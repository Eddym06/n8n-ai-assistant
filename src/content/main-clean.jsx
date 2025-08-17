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
    active: { type: 'boolean' },
    settings: { type: 'object' },
  },
  required: ['name', 'nodes']
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
    await importWFViaBridge(jsonStr);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// AI Assistant Component
function AIAssistant() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const assistantRef = useRef(null);

  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('gpt-4');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Mouse events
  const handleMouseDown = (e) => {
    if (e.target.closest('.ai-content')) return;
    setIsDragging(true);
    const rect = assistantRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Chrome storage
  useEffect(() => {
    chrome.storage.local.get(['aiProvider', 'aiModel', 'aiApiKey'], (result) => {
      if (result.aiProvider) setProvider(result.aiProvider);
      if (result.aiModel) setModel(result.aiModel);
      if (result.aiApiKey) setApiKey(result.aiApiKey);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.local.set({
      aiProvider: provider,
      aiModel: model,
      aiApiKey: apiKey
    });
    setShowSettings(false);
    notify('Configuración Guardada', 'Tu configuración de IA ha sido guardada exitosamente');
  };

  // AI Query
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    const currentQuery = query;
    setQuery('');

    try {
      const workflowData = getCurrentWorkflowJSON();
      
      const requestBody = {
        query: currentQuery,
        provider: provider,
        model: model,
        apiKey: apiKey || undefined,
        workflowContext: workflowData ? JSON.parse(workflowData) : null
      };

      const response = await fetch('http://localhost:3000/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la consulta AI');
      }

      const data = await response.json();
      setResult(data.response);

      const newEntry = {
        id: Date.now(),
        query: currentQuery,
        response: data.response,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [newEntry, ...prev].slice(0, 10));

      if (data.workflowJSON) {
        try {
          const isValid = validateWorkflow(JSON.parse(data.workflowJSON));
          if (isValid) {
            const importResult = await importWorkflowJSON(data.workflowJSON);
            if (importResult.success) {
              notify('Workflow Aplicado', 'El workflow generado por IA ha sido aplicado exitosamente');
            }
          }
        } catch (err) {
          console.warn('Workflow validation/import failed:', err);
        }
      }

    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
      const errorEntry = {
        id: Date.now(),
        query: currentQuery,
        response: `❌ Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [errorEntry, ...prev].slice(0, 10));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearHistory = () => {
    setHistory([]);
    setResult('');
    notify('Historial Limpiado', 'El historial de conversaciones ha sido eliminado');
  };

  return (
    <div className="ai-assistant-container">
      {/* Toggle Button */}
      <motion.button
        className="ai-toggle-btn"
        onClick={toggleVisibility}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10001,
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          fontSize: '24px',
        }}
      >
        🤖
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={assistantRef}
            className="ai-assistant-panel"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 10000,
              width: '380px',
              maxHeight: '600px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Header */}
            <div className="ai-header" style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>n8n AI Assistant</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                    {provider} ({model})
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
                  >
                    ⚙️
                  </button>
                  <button
                    onClick={toggleVisibility}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="ai-content" style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}>
              {/* Settings Panel */}
              {showSettings && (
                <div style={{ marginBottom: '16px', padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Configuración</h4>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Proveedor:</label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '12px' }}
                    >
                      <option value="OpenAI">OpenAI</option>
                      <option value="Anthropic">Anthropic</option>
                      <option value="Gemini">Gemini</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>Modelo:</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="gpt-4, claude-3-sonnet, gemini-pro..."
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '12px' }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>API Key:</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Tu API Key..."
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '12px' }}
                    />
                  </div>

                  <button
                    onClick={saveSettings}
                    style={{ 
                      backgroundColor: '#4F46E5', 
                      color: 'white', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Guardar
                  </button>
                </div>
              )}

              {/* Query Form */}
              <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe qué quieres hacer en n8n..."
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    style={{
                      backgroundColor: isLoading ? '#9CA3AF' : '#4F46E5',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {isLoading ? '⏳' : '🚀'}
                  </button>
                </div>
              </form>

              {/* Result */}
              {result && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: result.startsWith('❌') ? '#FEF2F2' : '#F0F9FF',
                  border: `1px solid ${result.startsWith('❌') ? '#FECACA' : '#BAE6FD'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {result}
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                      Historial
                    </h4>
                    <button
                      onClick={clearHistory}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#6B7280', 
                        cursor: 'pointer', 
                        fontSize: '12px' 
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                  
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {history.map((entry) => (
                      <div key={entry.id} style={{ 
                        marginBottom: '8px', 
                        padding: '8px', 
                        backgroundColor: '#F9FAFB', 
                        borderRadius: '6px',
                        border: '1px solid #E5E7EB'
                      }}>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                          {entry.timestamp} - {entry.query}
                        </div>
                        <div style={{ fontSize: '12px', color: '#374151' }}>
                          {entry.response.substring(0, 100)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Bridge functions
let anyWorkflowFromBridge = { cache: '' };

function refreshWorkflowBridge() {
  try {
    const jsonData = getWFJSONViaBridge();
    anyWorkflowFromBridge.cache = jsonData || '';
  } catch (error) {
    console.warn('Error refreshing workflow bridge:', error);
    anyWorkflowFromBridge.cache = '';
  }
}

// Initialize
(() => {
  const container = document.createElement('div');
  container.id = 'n8n-ai-assistant-root';
  container.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 10002; pointer-events: none;';
  container.style.pointerEvents = 'none';
  
  const shadowRoot = container.attachShadow({ mode: 'open' });
  shadowRoot.innerHTML = `
    <style>
      * { pointer-events: auto; }
    </style>
    <div id="shadow-root"></div>
  `;

  document.body.appendChild(container);
  const root = createRoot(shadowRoot.getElementById('shadow-root'));
  root.render(<AIAssistant />);

  // Refresh workflow data every 2 seconds
  setInterval(refreshWorkflowBridge, 2000);
  refreshWorkflowBridge();

  // Chrome extension message handling
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('[n8n-ai] Message received:', msg);

    if (msg?.type === 'PING') {
      sendResponse?.({ ok: true, message: 'n8n AI Assistant is active' });
      return;
    }

    if (msg?.type === 'GET_WORKFLOW') {
      try {
        refreshWorkflowBridge();
        const jsonData = anyWorkflowFromBridge.cache;
        sendResponse?.({ ok: true, data: jsonData });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }

    if (msg?.type === 'IMPORT_WORKFLOW') {
      try {
        importWFViaBridge(msg.workflowJSON);
        sendResponse?.({ ok: true });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }

    if (msg?.type === 'APPLY_ACTIONS') {
      try {
        applyActionsViaBridge(msg.actions);
        sendResponse?.({ ok: true });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }

    if (msg?.type === 'VOICE_CONTROL') {
      try {
        if (msg.action === 'start') {
          startVoiceRecognition();
          notify('Control de Voz', 'Control de voz iniciado');
        }
        sendResponse?.({ ok: true });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }

    if (msg?.type === 'SIMULATION_MODE') {
      try {
        // Handle simulation mode toggle
        console.log('[n8n-ai] Simulation mode:', msg.enabled ? 'enabled' : 'disabled');
        if (msg.enabled) {
          notify('Modo Simulación', 'Modo simulación activado');
        } else {
          notify('Modo Simulación', 'Modo simulación desactivado');
        }
        sendResponse?.({ ok: true });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }

    if (msg?.type === 'LOAD_TEMPLATE') {
      try {
        // Handle template loading
        const result = importWFViaBridge(msg.workflowJSON);
        if (result) {
          notify('Template Cargado', `${msg.name} cargado exitosamente`);
        } else {
          throw new Error(result.error);
        }
        sendResponse?.({ ok: true });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }

    if (msg?.type === 'EXPORT_GITHUB') {
      try {
        exportWorkflowToGitHub();
        notify('GitHub Export', 'Workflow exportado a GitHub exitosamente');
        sendResponse?.({ ok: true });
      } catch (e) {
        sendResponse?.({ ok: false, error: e.message });
      }
      return;
    }
  });
})();
