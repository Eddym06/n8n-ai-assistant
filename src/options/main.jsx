import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/tailwind.css';
import { motion, AnimatePresence } from 'framer-motion';
import mojs from '@mojs/core';
import * as PIXI from 'pixi.js';

function useSetting(key, def='') {
  const [v, setV] = useState(def);
  useEffect(()=>{
    chrome.storage.sync.get([key], res => { if (res[key] !== undefined) setV(res[key]); });
  }, [key]);
  const save = (val) => new Promise(r=> chrome.storage.sync.set({ [key]: val }, r));
  return [v, setV, save];
}

function OptionsPage() {
  // All settings
  const [provider, setProvider, saveProvider] = useSetting('llmProvider','openai');
  const [apiKey, setApiKey, saveApiKey] = useSetting('apiKey','');
  const [model, setModel, saveModel] = useSetting('model','');
  const [offline, setOffline, saveOffline] = useSetting('offlineMode', false);
  const [serverUrl, setServerUrl, saveServerUrl] = useSetting('serverUrl','');
  const [ghToken, setGhToken, saveGhToken] = useSetting('ghToken','');
  const [ghOwner, setGhOwner, saveGhOwner] = useSetting('ghOwner','');
  const [ghRepo, setGhRepo, saveGhRepo] = useSetting('ghRepo','');
  const [saved, setSaved] = useState(false);
  const btnRef = useRef(null);
  const [modelSelect, setModelSelect] = useState('');
  const [customModel, setCustomModel] = useState('');
  const canvasRef = useRef(null);

  const MODEL_OPTIONS = {
    openai: [
      { value: 'gpt-4o-mini', label: 'gpt-4o-mini (rápido)' },
      { value: 'gpt-4o', label: 'gpt-4o (calidad)' },
      { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo (legacy)' },
    ],
    gemini: [
      { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash (rápido)' },
      { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro (calidad)' },
    ],
    grok: [
      { value: 'grok-beta', label: 'grok-beta' },
      { value: 'grok-4', label: 'grok-4' },
    ],
  };

  // Initialize modelSelect/custom based on stored model
  useEffect(() => {
    const list = MODEL_OPTIONS[provider]?.map(m => m.value) || [];
    if (!model) {
      const def = MODEL_OPTIONS[provider]?.[0]?.value || '';
      setModelSelect(def || 'custom');
      setCustomModel('');
      return;
    }
    if (list.includes(model)) {
      setModelSelect(model);
      setCustomModel('');
    } else {
      setModelSelect('custom');
      setCustomModel(model);
    }
  }, [provider, model]);

  useEffect(()=>{
    const el = btnRef.current; if (!el) return;
    const onClick = (e)=>{
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width/2; const y = rect.top + rect.height/2;
      new mojs.Burst({ left:x, top:y, radius:{10:40}, count:10, children:{ shape:'circle', fill:['#10b981','#34d399','#a7f3d0'], radius:{4:0}, duration:700 } }).play();
    };
    el.addEventListener('click', onClick);
    return ()=> el.removeEventListener('click', onClick);
  }, [btnRef.current]);

  // Mouse interactive background (particles) using canvas or Pixi.js
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };
    resize();
    window.addEventListener('resize', resize);
    const parts = Array.from({ length: 40 }).map(() => ({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      vx: (Math.random()-0.5)*0.2*dpr,
      vy: (Math.random()-0.5)*0.2*dpr,
      r: (Math.random()*2+0.5)*dpr,
      c: ['#10b98122','#3b82f622','#a855f722'][Math.floor(Math.random()*3)],
    }));
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = (e.clientX-rect.left)*dpr; mouse.y = (e.clientY-rect.top)*dpr; };
    window.addEventListener('mousemove', onMove);
  let raf; const loop = () => {
      ctx.clearRect(0,0,canvas.width, canvas.height);
      for (const p of parts) {
        // simple move
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>canvas.width) p.vx*=-1;
        if (p.y<0||p.y>canvas.height) p.vy*=-1;
        // mouse attraction
        const dx = mouse.x - p.x, dy = mouse.y - p.y; const dist2 = dx*dx+dy*dy; if (dist2 < 12000*dpr) { p.vx += dx*0.00002; p.vy += dy*0.00002; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = p.c; ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Optional Pixi layer (subtle flowing lines)
    let app;
    try {
      app = new PIXI.Application({ backgroundAlpha: 0, resizeTo: window });
      const overlay = document.createElement('div'); overlay.style.position = 'absolute'; overlay.style.inset = '0'; overlay.style.pointerEvents = 'none'; overlay.style.zIndex = '-5';
      document.body.appendChild(overlay);
      overlay.appendChild(app.view);
      const g = new PIXI.Graphics(); app.stage.addChild(g);
      app.ticker.add(()=>{
        g.clear(); g.lineStyle(1, 0x3b82f6, 0.18);
        for (let i=0;i<parts.length-1;i++){
          const a = parts[i], b = parts[i+1];
          const dx=a.x-b.x, dy=a.y-b.y; const d2 = dx*dx+dy*dy; if (d2<40000){ g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); }
        }
      });
    } catch {}

    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', resize); try{ app?.destroy(true,{children:true, texture:true, baseTexture:true}); overlay?.remove(); }catch{} };
  }, []);

  const saveAll = async () => {
    const finalModel = modelSelect === 'custom' ? customModel : modelSelect;
    await Promise.all([
      saveProvider(provider), saveApiKey(apiKey), saveModel(finalModel), saveOffline(offline),
      saveServerUrl(serverUrl), saveGhToken(ghToken), saveGhOwner(ghOwner), saveGhRepo(ghRepo)
    ]);
    setSaved(true); setTimeout(()=>setSaved(false), 1200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 animate-pulse" style={{ filter:'blur(32px)' }}>
        <div className="absolute -top-32 -left-24 w-[40rem] h-[40rem] rounded-full bg-emerald-400/30" />
        <div className="absolute top-1/3 -right-20 w-[36rem] h-[36rem] rounded-full bg-blue-400/25" />
        <div className="absolute bottom-0 left-1/2 w-[44rem] h-[44rem] -translate-x-1/2 rounded-full bg-fuchsia-400/20" />
      </div>
      <div className="max-w-3xl mx-auto p-8">
        <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="text-2xl font-bold mb-6">Enhanced n8n AI Assistant – Configuración</motion.h1>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div layout className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow">
            <div className="text-sm font-semibold mb-2">LLM</div>
            <label className="block text-xs mb-1">Proveedor</label>
            <select className="w-full border rounded p-2 mb-3" value={provider} onChange={e=>setProvider(e.target.value)}>
              <option value="openai">OpenAI</option>
              <option value="gemini">Google Gemini</option>
              <option value="grok">xAI Grok</option>
            </select>
            <label className="block text-xs mb-1">Modelo</label>
            <select className="w-full border rounded p-2 mb-2" value={modelSelect}
              onChange={e=> setModelSelect(e.target.value)}>
              {(MODEL_OPTIONS[provider] || []).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
              <option value="custom">Otro (custom)</option>
            </select>
            {modelSelect === 'custom' && (
              <input className="w-full border rounded p-2 mb-3" value={customModel} onChange={e=>setCustomModel(e.target.value)} placeholder="modelo personalizado" />
            )}
            <label className="inline-flex items-center gap-2 text-xs mb-3">
              <input type="checkbox" checked={!!offline} onChange={e=>setOffline(e.target.checked)} /> Modo Offline
            </label>
            <label className="block text-xs mb-1">API Key</label>
            <input type="password" className="w-full border rounded p-2 mb-3" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-..." />
          </motion.div>
          <motion.div layout className="bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow">
            <div className="text-sm font-semibold mb-2">Integraciones</div>
            <label className="block text-xs mb-1">Server URL (Proxy)</label>
            <input className="w-full border rounded p-2 mb-3" value={serverUrl} onChange={e=>setServerUrl(e.target.value)} placeholder="http://localhost:8787" />
            <div className="text-sm font-medium mb-1">GitHub</div>
            <label className="block text-xs mb-1">Token</label>
            <input type="password" className="w-full border rounded p-2 mb-3" value={ghToken} onChange={e=>setGhToken(e.target.value)} placeholder="ghp_..." />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">Owner</label>
                <input className="w-full border rounded p-2 mb-3" value={ghOwner} onChange={e=>setGhOwner(e.target.value)} placeholder="usuario" />
              </div>
              <div>
                <label className="block text-xs mb-1">Repo</label>
                <input className="w-full border rounded p-2 mb-3" value={ghRepo} onChange={e=>setGhRepo(e.target.value)} placeholder="repo" />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="mt-6">
          <button ref={btnRef} onClick={saveAll} className="px-5 py-2 rounded bg-emerald-600 text-white shadow hover:shadow-lg transition-all">Guardar</button>
          <AnimatePresence>
            {saved && (
              <motion.span initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="ml-3 text-emerald-600">Guardado ✓</motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<OptionsPage />);
