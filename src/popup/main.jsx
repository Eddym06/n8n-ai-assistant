import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/tailwind.css';
import mojs from '@mojs/core';
import { motion } from 'framer-motion';

function Popup() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('');
  const [offline, setOffline] = useState(false);
  const cardRef = React.useRef(null);

  useEffect(() => {
    // Animated fluid-like gradient background via CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes enaFluid {
        0% { background-position: 0% 50%, 100% 50%, 50% 0%; }
        50% { background-position: 100% 50%, 0% 50%, 50% 100%; }
        100% { background-position: 0% 50%, 100% 50%, 50% 0%; }
      }
      .ena-bg-fluid {
        position: fixed; inset: 0; z-index: -1; opacity: 0.9;
        background-image:
          radial-gradient(60% 60% at 10% 10%, rgba(16,185,129,0.35) 0%, transparent 60%),
          radial-gradient(50% 50% at 90% 20%, rgba(59,130,246,0.35) 0%, transparent 60%),
          radial-gradient(70% 70% at 50% 90%, rgba(236,72,153,0.28) 0%, transparent 60%);
        background-size: 200% 200%, 200% 200%, 200% 200%;
        background-repeat: no-repeat;
        animation: enaFluid 18s ease-in-out infinite;
        filter: blur(32px) saturate(1.1);
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
    <div className="relative p-0 w-[390px] text-sm overflow-hidden">
      <div className="ena-bg-fluid" />
      <motion.div ref={cardRef} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="relative m-3 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/70 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">Enhanced n8n AI Assistant</h1>
          <div className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">{provider}{model? ` · ${model}`:''}{offline? ' · offline':''}</div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} onClick={activateHere}
            className="py-3 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 hover:from-zinc-300 hover:to-zinc-200 text-zinc-800 shadow-sm">Activar aquí</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} onClick={openOptions}
            className="py-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">Configuración</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} onClick={startChat}
            className="py-3 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm">Iniciar chat</motion.button>
        </div>
        <div className="text-[11px] text-zinc-500">
          Ajustes avanzados en Opciones. Este popup ofrece acceso rápido con animaciones.
        </div>
      </motion.div>
    </div>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<Popup />);
