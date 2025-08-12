import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/tailwind.css';
import mojs from '@mojs/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Settings, MessageSquare } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

function Popup() {
  // Hyper-realistic glossy button component
  const HyperButton = ({ children, className = '', icon: Icon, onClick }) => (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className={`relative group h-11 rounded-xl text-white shadow overflow-hidden ${className}`}
    >
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-black/20 mix-blend-overlay" />
      {/* inner glass shine */}
      <div className="absolute inset-0 [mask-image:radial-gradient(120px_60px_at_30%_0%,white,transparent)] bg-white/20 opacity-60 group-hover:opacity-80 transition-opacity" />
      {/* glossy highlight bar */}
      <div className="absolute -top-6 left-0 right-0 h-10 bg-white/30 blur-xl opacity-0 group-hover:opacity-80 transition-opacity" />
  {/* specular spark (clipped within) */}
  <div className="absolute inset-0 rounded-[14px] p-[1px] bg-[linear-gradient(120deg,rgba(255,255,255,0.65),rgba(255,255,255,0)_30%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.65))] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" />
      {/* content */}
      <div className="relative z-10 flex items-center justify-center gap-2 px-3">
        {Icon ? <Icon size={18} className="drop-shadow-sm" /> : null}
        <span className="font-medium">{children}</span>
      </div>
      {/* ambient glow */}
      <div className="absolute inset-0 rounded-xl shadow-[0_8px_24px_var(--glow)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('');
  const [offline, setOffline] = useState(false);
  const cardRef = React.useRef(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Animated aurora gradient background + gradient border card
    const style = document.createElement('style');
    style.textContent = `
      @keyframes enaFluid {
        0% { background-position: 0% 50%, 100% 50%, 50% 0%, 0% 100%; }
        50% { background-position: 100% 50%, 0% 50%, 50% 100%, 100% 0%; }
        100% { background-position: 0% 50%, 100% 50%, 50% 0%, 0% 100%; }
      }
      .ena-bg-fluid {
        position: fixed; inset: 0; z-index: -1; opacity: 0.95;
        background-image:
          radial-gradient(60% 60% at 12% 8%, rgba(16,185,129,0.45) 0%, transparent 60%),
          radial-gradient(50% 50% at 88% 16%, rgba(59,130,246,0.45) 0%, transparent 60%),
          radial-gradient(70% 70% at 50% 88%, rgba(236,72,153,0.40) 0%, transparent 60%),
          radial-gradient(60% 60% at 20% 80%, rgba(14,165,233,0.35) 0%, transparent 60%);
        background-size: 220% 220%, 220% 220%, 220% 220%, 220% 220%;
        background-repeat: no-repeat;
        animation: enaFluid 22s ease-in-out infinite;
        filter: blur(28px) saturate(1.12);
      }
      .ena-card {
        border: 1px solid transparent;
        background:
          linear-gradient( to bottom right, rgba(255,255,255,0.76), rgba(255,255,255,0.62) ) padding-box,
          linear-gradient(135deg, rgba(59,130,246,0.45), rgba(236,72,153,0.45), rgba(16,185,129,0.45)) border-box;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        transition: box-shadow 200ms ease, transform 200ms ease;
      }
      .ena-card:hover { box-shadow: 0 16px 40px rgba(59,130,246,0.15), 0 4px 16px rgba(0,0,0,0.08); }
      .ena-section {
        border: 1px solid rgba(255,255,255,0.18);
        background:
          radial-gradient(120% 120% at 0% 0%, rgba(59,130,246,0.12), transparent 60%),
          radial-gradient(120% 120% at 100% 0%, rgba(236,72,153,0.12), transparent 60%),
          radial-gradient(120% 120% at 50% 100%, rgba(16,185,129,0.10), transparent 60%),
          rgba(17,24,39,0.45);
        backdrop-filter: blur(10px);
      }
    `;
    document.head.appendChild(style);
    const bg = document.createElement('div');
    bg.className = 'ena-bg-fluid';
    document.body.appendChild(bg);
    return () => { bg.remove(); style.remove(); };
  }, []);

  useEffect(() => {
    // Parallax tilt micro-interaction on the card
    const el = cardRef.current; if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const rx = (e.clientY - rect.top - rect.height/2) / rect.height;
      const ry = (e.clientX - rect.left - rect.width/2) / rect.width;
      el.style.transform = `perspective(800px) rotateX(${(-rx*6).toFixed(2)}deg) rotateY(${(ry*6).toFixed(2)}deg)`;
    };
    const onLeave = () => { el.style.transform = 'none'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [cardRef.current]);

  useEffect(() => {
    chrome.storage.sync.get(['llmProvider', 'model', 'offlineMode'], (res) => {
      if (res.llmProvider) setProvider(res.llmProvider);
      if (res.model) setModel(res.model);
      if (typeof res.offlineMode === 'boolean') setOffline(res.offlineMode);
    });
  }, []);

  const openOptions = () => {
    try { chrome.runtime.openOptionsPage(); } catch {}
  };

  const activateHere = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;
      // Nudge content to mount if not already
      const res = await chrome.tabs.sendMessage(tab.id, { type: 'ENA_MOUNT' }).catch(()=>null);
      if (!res) {
        try {
          await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['assets/content.css'] });
        } catch {}
        try {
          await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['assets/content.js'] });
        } catch {}
      }
      // Small success burst
      const rect = document.body.getBoundingClientRect();
      new mojs.Burst({ left: rect.width-40, top: rect.height-40, radius:{10:40}, count:8, children:{ fill:['#10b981','#34d399','#a7f3d0'], radius:{3:0}, duration:600 } }).play();
    } catch {}
  };

  const startChat = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;
      await chrome.tabs.sendMessage(tab.id, { type: 'ENA_OPEN_CHAT' }).catch(()=>{});
    } catch {}
  };

  return (
    <div className="relative p-0 w-[420px] text-sm overflow-hidden">
      <div className="ena-bg-fluid" />
      <motion.div ref={cardRef} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative m-3 rounded-2xl ena-card backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-zinc-900">Enhanced n8n AI Assistant</h1>
          <div className="text-[11px] px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 text-emerald-800 border border-white/40">{provider}{model? ` · ${model}`:''}{offline? ' · offline':''}</div>
        </div>
  <div className="grid grid-cols-3 gap-5 mb-4 items-stretch xs:gap-y-3">
          <div className="w-full relative rounded-xl p-[1.5px] bg-white/15" style={{'--glow':'rgba(99,102,241,0.35)'}}>
            <HyperButton onClick={activateHere} icon={Rocket} className="bg-gradient-to-br from-violet-600 to-blue-600">Activar aquí</HyperButton>
          </div>
          <div className="w-full relative rounded-xl p-[1.5px] bg-white/15" style={{'--glow':'rgba(14,165,233,0.35)'}}>
            <HyperButton onClick={openOptions} icon={Settings} className="bg-gradient-to-br from-sky-500 to-cyan-600">Configuración</HyperButton>
          </div>
          <div className="w-full relative rounded-xl p-[1.5px] bg-white/15" style={{'--glow':'rgba(16,185,129,0.35)'}}>
            <HyperButton onClick={startChat} icon={MessageSquare} className="bg-gradient-to-br from-emerald-600 to-teal-600">Iniciar chat</HyperButton>
          </div>
        </div>
        <Tooltip.Provider>
          <div className="text-[11px] text-zinc-700 flex items-center justify-between">
            <span>Acceso rápido con micro-animaciones.</span>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button onClick={()=> setShowAdvanced(s=>!s)} className="px-2 py-1 rounded-md border border-white/40 bg-gradient-to-r from-emerald-500/20 via-fuchsia-500/20 to-indigo-500/20 hover:from-emerald-500/30 hover:to-indigo-500/30 text-xs text-zinc-800">{showAdvanced? 'Ocultar':'Avanzado'}</button>
              </Tooltip.Trigger>
              <Tooltip.Content className="rounded bg-gradient-to-br from-zinc-900 to-zinc-800 text-white px-2 py-1 text-[11px] shadow" sideOffset={6}>Expandir secciones</Tooltip.Content>
            </Tooltip.Root>
          </div>
        </Tooltip.Provider>
        <AnimatePresence>
          {showAdvanced && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="mt-3 space-y-2">
              <div className="rounded-lg ena-section p-3">
                <div className="text-xs font-medium mb-2 text-zinc-100">Colaboración</div>
                <div className="grid grid-cols-2 gap-2">
                  <div style={{'--glow':'rgba(236,72,153,0.35)'}}>
                    <HyperButton className="h-9 !rounded-md bg-gradient-to-br from-fuchsia-600 to-pink-600" icon={Rocket}>Modo colaboración</HyperButton>
                  </div>
                  <div style={{'--glow':'rgba(245,158,11,0.35)'}}>
                    <HyperButton className="h-9 !rounded-md bg-gradient-to-br from-amber-500 to-orange-600" icon={Rocket}>Simulación</HyperButton>
                  </div>
                </div>
              </div>
              <div className="rounded-lg ena-section p-3">
                <div className="text-xs font-medium mb-2 text-zinc-100">Editor de Expresiones</div>
                <div className="text-[11px] text-zinc-300">Acceso rápido al asistente para expressions de n8n.</div>
              </div>
              <div className="rounded-lg ena-section p-3">
                <div className="text-xs font-medium mb-2 text-zinc-100">Configuración avanzada</div>
                <div className="grid grid-cols-2 gap-2">
                  <div style={{'--glow':'rgba(16,185,129,0.35)'}} className="p-[1.5px] rounded-md bg-gradient-to-r from-emerald-500/60 to-indigo-500/60">
                    <HyperButton className="w-full h-9 !rounded-[6px] bg-gradient-to-r from-emerald-500 to-indigo-500" icon={Settings}>Selector LLM</HyperButton>
                  </div>
                  <div style={{'--glow':'rgba(234,88,12,0.35)'}} className="p-[1.5px] rounded-md bg-gradient-to-r from-pink-500/60 to-amber-500/60">
                    <HyperButton className="w-full h-9 !rounded-[6px] bg-gradient-to-r from-pink-500 to-amber-500" icon={Settings}>Memoria</HyperButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<Popup />);
