import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:3000';

function App() {
  const [status, setStatus] = useState('checking...');
  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('gpt-4');
  const [offline, setOffline] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ workflows: 0, queries: 0, uptime: '0s', connections: 0, cacheSize: 0 });
  const [activeTab, setActiveTab] = useState('main');
  const [isRecording, setIsRecording] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [templates, setTemplates] = useState([]);
  const voiceRef = useRef(null);

  useEffect(() => {
    // Check backend connection
    checkConnection();
    
    // Load stats and templates
    loadStats();
    loadTemplates();
    
    const interval = setInterval(() => {
      checkConnection();
      loadStats();
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status || 'connected');
        setProvider(data.provider || 'OpenAI');
        setModel(data.model || 'gpt-4');
        setOffline(data.offline || false);
        setIsConnected(true);
      } else {
        setStatus('Error');
        setIsConnected(false);
      }
    } catch (error) {
      setStatus('Offline');
      setIsConnected(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log('Stats load failed:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.slice(0, 5));
      }
    } catch (error) {
      console.log('Templates load failed:', error);
    }
  };

  const notifyContentScript = async (type, data = {}) => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        await chrome.tabs.sendMessage(tabs[0].id, { type, ...data });
      }
    } catch (error) {
      console.log('Content script notification failed:', error);
    }
  };

  const toggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      notifyContentScript('VOICE_CONTROL', { action: 'stop' });
    } else {
      setIsRecording(true);
      notifyContentScript('VOICE_CONTROL', { action: 'start' });
    }
  };

  const toggleSimulation = () => {
    const newMode = !simulationMode;
    setSimulationMode(newMode);
    notifyContentScript('SIMULATION_MODE', { enabled: newMode });
  };

  const runWorkflowSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/simulation/run`, { method: 'POST' });
      if (response.ok) {
        notifyContentScript('SIMULATION_RUN');
      }
    } catch (e) {
      console.error('Simulation error:', e);
    }
  };

  const exportToGitHub = () => {
    notifyContentScript('EXPORT_GITHUB');
  };

  const loadTemplate = (template) => {
    notifyContentScript('LOAD_TEMPLATE', { 
      workflowJSON: JSON.stringify(template.workflow || {}),
      name: template.name 
    });
  };

  return (
    <div className="w-80 bg-white">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h1 className="text-lg font-semibold">n8n AI Assistant</h1>
        <p className="text-sm opacity-90">Enterprise Edition v4.0</p>
      </div>

      {/* Status Bar */}
      <div className="p-3">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">{provider}</span>
            {model && <span className="text-xs text-gray-500">({model})</span>}
            {offline && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Offline</span>}
            {simulationMode && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Sim</span>}
          </div>
          <div className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-3">
        <div className="flex border-b">
          {[
            { id: 'main', label: '🏠 Principal' },
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'templates', label: '📋 Templates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-3">
        {activeTab === 'main' && (
          <div className="space-y-3">
            {/* Voice & Advanced Features */}
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoice}
                className={`p-2 rounded-lg font-medium text-sm transition-colors ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {isRecording ? '🛑' : '🎤'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleSimulation}
                className={`p-2 rounded-lg font-medium text-sm transition-colors ${
                  simulationMode 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                ⚡
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={runWorkflowSimulation}
                className="p-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-medium text-sm transition-colors"
              >
                🧪
              </motion.button>
            </div>

            {/* Import/Export */}
            <div className="grid grid-cols-3 gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={exportToGitHub}
                className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
              >
                📤 Export
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
              >
                📥 Import
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
              >
                🔄 Sync
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border">
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Estadísticas en Tiempo Real</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">Workflows</span>
                  <div className="font-semibold text-blue-600">{stats.workflows}</div>
                </div>
                <div>
                  <span className="text-gray-600">Consultas</span>
                  <div className="font-semibold text-green-600">{stats.queries}</div>
                </div>
                <div>
                  <span className="text-gray-600">Uptime</span>
                  <div className="font-semibold text-purple-600">{stats.uptime}</div>
                </div>
                <div>
                  <span className="text-gray-600">Cache</span>
                  <div className="font-semibold text-orange-600">{stats.cacheSize}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800">Templates Rápidos</h3>
            {templates.map((template, index) => (
              <motion.div
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadTemplate(template)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border cursor-pointer transition-colors"
              >
                <div className="text-xs font-medium">{template.name}</div>
                <div className="text-xs text-gray-500">{template.description}</div>
                <div className="text-xs text-blue-600 mt-1">{template.category} • {template.nodes} nodes</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          © 2024 n8n AI Assistant Enterprise
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
