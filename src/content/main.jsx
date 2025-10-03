import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Ajv from 'ajv';
import { getWorkflowJSON as getWFJSONViaBridge, importWorkflowJSON as importWFViaBridge, applyActions as applyActionsViaBridge, refreshCanvas as refreshCanvasViaBridge, pingStores, observeN8nErrors, notify, startVoiceRecognition, exportWorkflowToGitHub } from './n8nUtils';
import { AnimatePresence, motion } from 'framer-motion';
import './tailwind.css';

const ajv = new Ajv({ allErrors: true, strict: false });
const workflowSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    nodes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string' },
          parameters: { type: 'object' },
          position: { type: 'array' },
        },
        required: ['id', 'name', 'type']
      }
    },
    connections: { type: 'object' },
    settings: { type: 'object' }
  },
  required: ['nodes', 'connections']
};
const validateWorkflow = ajv.compile(workflowSchema);

function getCurrentWorkflowJSON() {
  try {
    const txt = anyWorkflowFromBridge.cache || '';
    if (txt) return txt;
  } catch {}
  return '';
}

async function importWorkflowJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    // Validate first
    const valid = validateWorkflow(data);
    if (!valid) {
      const msg = ajv.errorsText(validateWorkflow.errors, { separator: '\n' });
      throw new Error(`JSON inválido para workflow n8n:\n${msg}`);
    }

  const resp = await importWFViaBridge(data);
  if (resp?.ok) { await refreshCanvasViaBridge(); return { ok: true }; }
  // Fallback: clipboard
  await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  return { ok: true, clipboard: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['llmProvider', 'apiKey', 'model'], (res) => {
      resolve({
        provider: res.llmProvider || 'openai',
        apiKey: res.apiKey || '',
        model: res.model || '',
      });
    });
  });
}

async function callLLM({ provider, apiKey, model, prompt }) {
  const workflow = getCurrentWorkflowJSON();
  const basePrompt = `You are an n8n expert. Current workflow: ${workflow || '""'}. Based on user prompt: ${prompt}. Return only the updated workflow JSON.`;

  if (provider === 'openai') {
    const body = {
      model: model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: basePrompt }],
    };
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return text;
  }

  if (provider === 'gemini') {
  const body = {
      contents: [{ parts: [{ text: basePrompt }] }],
    };
  const mdl = model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  }

  if (provider === 'grok') {
    const body = {
      model: model || 'grok-beta',
      messages: [{ role: 'user', content: basePrompt }],
    };
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return text;
  }

  throw new Error('Proveedor LLM no soportado');
}

function DraggableResizable({ children }) {
  const ref = useRef(null);
  const pos = useRef({ x: 20, y: 80, w: 420, h: 560 });
  const [size, setSize] = useState({ w: 420, h: 560 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Position initially at bottom-center
    try {
      pos.current.x = Math.max(12, Math.floor((window.innerWidth - pos.current.w) / 2));
      pos.current.y = Math.max(12, window.innerHeight - pos.current.h - 24);
      el.style.left = pos.current.x + 'px';
      el.style.top = pos.current.y + 'px';
    } catch {}

    const onMouseDown = (e) => {
      if (!(e.target).closest('.ena-topbar')) return;
      setDragging(true);
      setOffset({ x: e.clientX - pos.current.x, y: e.clientY - pos.current.y });
    };
    const onMouseUp = () => setDragging(false);
    const onMouseMove = (e) => {
      if (!dragging) return;
      pos.current.x = Math.max(0, e.clientX - offset.x);
      pos.current.y = Math.max(0, e.clientY - offset.y);
      el.style.left = pos.current.x + 'px';
      el.style.top = pos.current.y + 'px';
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, offset]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleResize = (e) => {
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = size.w;
      const startH = size.h;
      const onMove = (ev) => {
        const dw = ev.clientX - startX;
        const dh = ev.clientY - startY;
        const newW = Math.max(320, startW + dw);
        const newH = Math.max(320, startH + dh);
        setSize({ w: newW, h: newH });
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };
    const handle = el.querySelector('.ena-resize');
    handle?.addEventListener('mousedown', handleResize);
    return () => handle?.removeEventListener('mousedown', handleResize);
  }, [size]);

  return (
    <motion.div ref={ref} style={{ left: pos.current.x, top: pos.current.y, width: size.w, height: size.h }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="fixed z-[99999] shadow-2xl rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden backdrop-blur">
      {children}
      <div className="ena-resize absolute right-0 bottom-0 w-4 h-4 cursor-se-resize bg-transparent" />
    </motion.div>
  );
}

function ChatPanel() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [llm, setLlm] = useState({ provider: 'openai', apiKey: '', model: '' });
  const [undoStack, setUndoStack] = useState([]);
  const [offline, setOffline] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const voiceRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  // Load persisted open state
  useEffect(() => {
    try {
      chrome.storage.sync.get(['panelOpen'], (res) => {
        // default true; only collapse if explicitly stored false
        const val = res.panelOpen;
        if (typeof val === 'boolean') setOpen(val);
      });
    } catch {}
  }, []);

  // Persist open state
  useEffect(() => {
    try { chrome.storage.sync.set({ panelOpen: open }); } catch {}
  }, [open]);

  useEffect(() => { (async () => {
    const s = await getSettings();
    setLlm(s);
    chrome.storage.sync.get(['offlineMode'], (res) => setOffline(!!res.offlineMode));
    // Warm up bridge and cache workflow
    const ping = await pingStores().catch(() => null);
    console.log('[n8n-ai] Stores', ping);
    const wf = await getWFJSONViaBridge();
    anyWorkflowFromBridge.cache = wf;
  const stop = observeN8nErrors((t) => setErrorLog(t));
  return () => stop?.();
  })(); }, []);

  const send = async () => {
    setError('');
    if (!input.trim()) return;
    if (!offline && !llm.apiKey) {
      setError('Configura tu API Key en el popup de la extensión.');
      return;
    }
    const userMsg = { role: 'user', content: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    try {
  const latestWF = await getWFJSONViaBridge();
  anyWorkflowFromBridge.cache = latestWF || anyWorkflowFromBridge.cache;
  const base = `Eres un experto en n8n. Flujo actual: ${anyWorkflowFromBridge.cache || '""'}. Modifica basado en: `;
  const prompt = base + history.map(m => `${m.role}: ${m.content}`).join('\n') + `. Devuelve JSON con acciones: [{"action":"addNode","data":{...}}, ...] o JSON completo del flujo.`;
      if (offline) {
        const note = '// Offline mode: simulando respuesta. Pega tu JSON de workflow aquí.';
        setMessages(h => [...h, { role: 'assistant', content: note }]);
        return;
      }
      console.log('[n8n-ai] Calling LLM', { provider: llm.provider });
      const reply = await callLLM({ provider: llm.provider, apiKey: llm.apiKey, model: llm.model, prompt });
      // Try to extract JSON from the reply (handles fenced code blocks)
  const match = reply.match(/```json[\s\S]*?```|\{[\s\S]*\}/);
  const jsonText = match ? match[0].replace(/```json|```/g, '') : reply;
  setMessages(h => [...h, { role: 'assistant', content: jsonText }]);
  setShowPreview(true);
    } catch (e) {
      setError(e.message || 'Error llamando al LLM');
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const apply = async () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) { setError('No hay respuesta del asistente para aplicar.'); return; }
    // Push current state into undo stack
    const current = getCurrentWorkflowJSON();
    if (current) setUndoStack(s => [...s, current]);
    // Try actions array first
    try {
      const obj = JSON.parse(last.content);
      if (Array.isArray(obj)) {
        const r = await applyActionsViaBridge(obj);
        if (r?.ok) { await refreshCanvasViaBridge(); return; }
      }
    } catch {}
    const res = await importWorkflowJSON(last.content);
    if (!res.ok) setError(res.error || 'Error aplicando workflow');
    else if (res.clipboard) alert('Workflow copiado al portapapeles. Pégalo en n8n > Import.');
  };

  const copy = async () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) return;
    await navigator.clipboard.writeText(last.content);
  };

  const renderPreview = () => {
    if (!showPreview) return null;
    const current = anyWorkflowFromBridge.cache || '';
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    let proposed = '';
    try {
      const obj = JSON.parse(last?.content || '{}');
      // If it's actions array, compute a message
      proposed = Array.isArray(obj) ? JSON.stringify(obj, null, 2) : JSON.stringify(obj, null, 2);
    } catch { proposed = last?.content || ''; }
    return (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/60">
        <div className="grid grid-cols-2 gap-2 p-2 text-xs">
          <div className="flex flex-col">
            <div className="font-medium mb-1">Actual</div>
            <pre className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700 max-h-48 whitespace-pre-wrap">{current}</pre>
          </div>
          <div className="flex flex-col">
            <div className="font-medium mb-1">Propuesto</div>
            <pre className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700 max-h-48 whitespace-pre-wrap">{proposed}</pre>
          </div>
        </div>
      </motion.div>
    );
  };

  const validateLast = () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) { setError('No hay respuesta para validar.'); return; }
    try {
      const obj = JSON.parse(last.content);
      const ok = validateWorkflow(obj);
      if (ok) alert('JSON válido.'); else throw new Error(ajv.errorsText(validateWorkflow.errors));
    } catch (e) {
      setError('Validación fallida: ' + (e.message || e));
    }
  };

  const undo = async () => {
    const prev = undoStack.pop?.() || null;
    if (!prev) { setError('Nada para deshacer.'); return; }
    const res = await importWorkflowJSON(prev);
    if (!res.ok) setError(res.error || 'Error al deshacer.');
    setUndoStack([...undoStack]);
  };

  const DockButton = ({ visible, onClick }) => (
    <AnimatePresence>
      {visible && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClick}
          className="fixed z-[99998] bottom-6 right-6 w-12 h-12 rounded-full shadow-xl bg-gradient-to-br from-emerald-500 to-fuchsia-600 text-white text-xl flex items-center justify-center">
          💬
        </motion.button>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {open && (
      <DraggableResizable>
  <div className={"flex flex-col h-full bg-white/85 dark:bg-zinc-900/80 backdrop-blur-md " + (justActivated ? 'ring-2 ring-emerald-500/60 transition-[box-shadow]': '')}>
        <div className="ena-topbar flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
          <div className="font-medium text-zinc-800 dark:text-zinc-100">n8n AI Assistant</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(o => !o)} className="px-2 py-1 text-xs rounded bg-zinc-200 dark:bg-zinc-700">{open ? '–' : '+'}</button>
          </div>
        </div>
        {open && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-3 space-y-2 bg-white dark:bg-zinc-900">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} layout className={"text-sm whitespace-pre-wrap rounded p-2 shadow-sm bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100"}>
                    <div className="text-xs uppercase opacity-60 mb-1">{m.role}</div>
                    {m.content}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && <div className="text-xs text-zinc-500">Generando…</div>}
              {error && <div className="text-xs text-red-600">{error}</div>}
            </div>
            <AnimatePresence>{renderPreview()}</AnimatePresence>
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50/90 dark:bg-zinc-800/80 backdrop-blur">
              {offline && <div className="text-xs text-amber-600 mb-1">Modo offline habilitado: no se harán llamadas a LLM.</div>}
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder="Describe lo que quieres cambiar o crear en el workflow…"
                className="w-full text-sm p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 h-20" />
              <div className="flex gap-2 mt-2">
                <button onClick={send} disabled={loading}
                  className="px-3 py-1 rounded bg-emerald-600 text-white text-sm disabled:opacity-50">Enviar</button>
                <button onClick={apply}
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Aplicar</button>
                <button onClick={copy}
                  className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-sm">Copiar</button>
                <button onClick={validateLast}
                  className="px-3 py-1 rounded bg-purple-600 text-white text-sm">Validar</button>
                <button onClick={undo}
                  className="px-3 py-1 rounded bg-zinc-300 dark:bg-zinc-600 text-sm">Deshacer</button>
                <button onClick={async ()=>{
                  if (!errorLog) { setError('No se detectaron errores.'); return; }
                  const wf = await getWFJSONViaBridge();
                  const prompt = `Analiza error: ${errorLog}. Flujo: ${wf}. Sugiere fix y devuelve acciones JSON.`;
                  setMessages(h=>[...h,{role:'user',content:'Fix Error'}]);
                  const reply = await callLLM({ provider: llm.provider, apiKey: llm.apiKey, model: llm.model, prompt });
                  const match = reply.match(/```json[\s\S]*?```|\[[\s\S]*\]|\{[\s\S]*\}/);
                  const txt = match ? match[0].replace(/```json|```/g,'') : reply;
                  setMessages(h=>[...h,{role:'assistant',content:txt}]);
                  setShowPreview(true);
                }} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Fix Error</button>
                <button onClick={async ()=>{
                  try {
                    const r = await fetch('/api/n8n/test', { method: 'POST' }).catch(()=>null);
                    await notify('Simulación', r?.ok ? 'Simulación iniciada' : 'No disponible');
                  } catch {}
                }} className="px-3 py-1 rounded bg-amber-600 text-white text-sm">Simular</button>
                <button onClick={()=>{
                  if (voiceRef.current){ try{voiceRef.current.stop();}catch{} voiceRef.current=null; return; }
                  const rec = startVoiceRecognition((t,fin)=>{ setInput(t); if(fin){ /* opcional auto-send */ } });
                  voiceRef.current = rec;
                }} className="px-3 py-1 rounded bg-zinc-800 text-white text-sm">Voz</button>
                <button onClick={()=> setShowPreview(p=>!p)} className="px-3 py-1 rounded bg-fuchsia-600 text-white text-sm">{showPreview? 'Ocultar Preview':'Preview'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DraggableResizable>
      )}
      <AnimatePresence>
        {justActivated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed z-[99998] bottom-6 right-6 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm shadow-lg">
            Assistant activado ✓
          </motion.div>
        )}
      </AnimatePresence>
      <DockButton visible={!open} onClick={() => setOpen(true)} />
    </>
  );
}

function mount() {
  if (window.__ENA_MOUNTED__) return; // guard
  if (document.getElementById('ena-root')) { window.__ENA_MOUNTED__ = true; return; }
  const root = document.createElement('div');
  root.id = 'ena-root';
  document.body.appendChild(root);
  createRoot(root).render(<ChatPanel />);
  window.__ENA_MOUNTED__ = true;
}

// Inject a small bridge script in page context if needed later
(function injectBridge(){
  try {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('assets/pageBridge.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
  } catch {}
})();

// Mount when DOM ready
// Initial mount + observe for SPA route changes
const tryMount = () => {
  try {
    // Only mount when n8n editor is present or after a small delay to let DOM paint
    const hasN8n = document.querySelector('[data-test-id="ndv-editor"]') || document.querySelector('#app, .n8n-root');
    if (hasN8n) mount(); else setTimeout(mount, 500);
  } catch { mount(); }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryMount); else tryMount();

// Observe body for SPA navigation changes to re-mount if needed
try {
  const obs = new MutationObserver(() => {
    if (!document.getElementById('ena-root')) {
      window.__ENA_MOUNTED__ = false;
      tryMount();
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
} catch {}

// Listen to popup commands
try {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'ENA_MOUNT') {
  mount(); setTimeout(()=>{ try{ chrome.storage.sync.set({ panelOpen: true }); }catch{} setJustActivated(true); setTimeout(()=>setJustActivated(false), 1200); }, 0); sendResponse?.({ ok: true }); return;
    }
    if (msg?.type === 'ENA_OPEN_CHAT') {
      mount();
      try {
        // ensure open state true
        chrome.storage.sync.set({ panelOpen: true });
      } catch {}
  setJustActivated(true); setTimeout(()=>setJustActivated(false), 1200);
      sendResponse?.({ ok: true }); return;
    }
  });
} catch {}
