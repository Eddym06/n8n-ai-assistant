import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../content/tailwind.css';
import { motion, AnimatePresence } from 'framer-motion';

function Popup() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('');
  const [offline, setOffline] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ workflows: 0, queries: 0, uptime: '0s', connections: 0, cacheSize: 0 });
  const [activeTab, setActiveTab] = useState('main');
  const [isRecording, setIsRecording] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [templates, setTemplates] = useState([]);
  const voiceRef = useRef(null);

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    // Load settings
    chrome.storage.sync.get(['llmProvider', 'model', 'offlineMode', 'simulationMode'], (res) => {
      if (res.llmProvider) setProvider(res.llmProvider);
      if (res.model) setModel(res.model);
      if (typeof res.offlineMode === 'boolean') setOffline(res.offlineMode);
      if (typeof res.simulationMode === 'boolean') setSimulationMode(res.simulationMode);
    });

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
      const data = await response.json();
      setIsConnected(response.ok);
      return data;
    } catch (error) {
      setIsConnected(false);
      return null;
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (e) {
      console.log('Stats not available');
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (e) {
      console.log('Templates not available');
    }
  };

  const notifyContentScript = async (type, data = {}) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, { type, ...data });
      }
    } catch (e) {
      console.error(`Error sending ${type}:`, e);
    }
  };

  const openOptions = () => {
    try {
      chrome.runtime.openOptionsPage();
    } catch (e) {
      console.error('Error opening options:', e);
    }
  };

  const activateAssistant = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      await chrome.tabs.sendMessage(tab.id, { type: 'ENA_MOUNT' }).catch(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['assets/content.js']
        });
      });
    } catch (e) {
      console.error('Error activating assistant:', e);
    }
  };

  const startChat = () => {
    notifyContentScript('ENA_OPEN_CHAT');
  };

  const toggleVoice = async () => {
    if (isRecording) {
      setIsRecording(false);
      await notifyContentScript('STOP_VOICE');
    } else {
      setIsRecording(true);
      await notifyContentScript('START_VOICE');
    }
  };

  const toggleSimulation = async () => {
    const newMode = !simulationMode;
    setSimulationMode(newMode);
    chrome.storage.sync.set({ simulationMode: newMode });
    await notifyContentScript('TOGGLE_SIMULATION', { enabled: newMode });
  };

  const runWorkflowSimulation = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      // Get current workflow from content script
      const workflow = await chrome.tabs.sendMessage(tab.id, { type: 'GET_WORKFLOW' });
      
      const response = await fetch(`${API_BASE}/api/simulate/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: workflow || { id: 'test', nodes: [] },
          testData: { input: 'test data' }
        })
      });

      if (response.ok) {
        const result = await response.json();
        await notifyContentScript('SIMULATION_RESULT', result);
      }
    } catch (e) {
      console.error('Simulation error:', e);
    }
  };

  const exportToGitHub = () => {
    notifyContentScript('EXPORT_GITHUB');
  };

  const importWorkflow = () => {
    notifyContentScript('IMPORT_WORKFLOW');
  };

  const exportWorkflow = () => {
    notifyContentScript('EXPORT_WORKFLOW');
  };

  const clearCache = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cache/clear`, { method: 'POST' });
      if (response.ok) {
        loadStats();
      }
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
  };

  const refreshAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/refresh`, { method: 'POST' });
      if (response.ok) {
        loadStats();
      }
    } catch (e) {
      console.error('Error refreshing analytics:', e);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      const response = await fetch(`${API_BASE}/api/templates/${templateId}`);
      if (response.ok) {
        const template = await response.json();
        await notifyContentScript('LOAD_TEMPLATE', template);
      }
    } catch (e) {
      console.error('Error loading template:', e);
    }
  };

  const MainTab = () => (
    <div className="space-y-4">
      {/* Enhanced Status Bar */}
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

      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={activateAssistant}
          className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          🚀 Activate AI
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startChat}
          className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          💬 Start Chat
        </motion.button>
      </div>

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
          onClick={importWorkflow}
          className="p-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium text-sm transition-colors"
        >
          📥 Import
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={exportWorkflow}
          className="p-2 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg font-medium text-sm transition-colors"
        >
          📤 Export
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={exportToGitHub}
          className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
        >
          🐙 GitHub
        </motion.button>
      </div>

      {/* Settings */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={openOptions}
        className="w-full p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
      >
        ⚙️ Settings
      </motion.button>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-4">
      {/* Real-time Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border">
          <div className="text-lg font-bold text-green-600">{stats.workflows}</div>
          <div className="text-xs text-gray-600">Workflows</div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border">
          <div className="text-lg font-bold text-blue-600">{stats.queries}</div>
          <div className="text-xs text-gray-600">Queries</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border">
          <div className="text-sm font-bold text-purple-600">{stats.connections || 0}</div>
          <div className="text-xs text-gray-600">Connections</div>
        </div>
        
        <div className="p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border">
          <div className="text-sm font-bold text-orange-600">{(stats.cacheSize || 0)}KB</div>
          <div className="text-xs text-gray-600">Cache</div>
        </div>

        <div className="p-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border">
          <div className="text-sm font-bold text-indigo-600">{stats.uptime}</div>
          <div className="text-xs text-gray-600">Uptime</div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-gray-50 rounded-lg p-3 border">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Quick Templates</h3>
        {templates.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {templates.slice(0, 4).map((template, i) => (
              <button
                key={i}
                onClick={() => loadTemplate(template.id)}
                className="p-2 bg-white rounded border text-xs text-left hover:bg-blue-50 hover:border-blue-200"
              >
                <div className="font-medium truncate">{template.name}</div>
                <div className="text-gray-500 truncate">{template.description}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-2">No templates loaded</div>
        )}
      </div>

      {/* Analytics Actions */}
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={refreshAnalytics}
          className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-medium text-sm transition-colors"
        >
          🔄 Refresh
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearCache}
          className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium text-sm transition-colors"
        >
          🗑️ Clear Cache
        </motion.button>
      </div>

      {/* Connection Status Details */}
      <div className="bg-gray-50 rounded-lg p-3 border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-800">System Status</span>
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Backend API</span>
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">WebSocket</span>
            <span className={wsConnected ? 'text-blue-600' : 'text-gray-600'}>
              {wsConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Simulation</span>
            <span className={simulationMode ? 'text-purple-600' : 'text-gray-600'}>
              {simulationMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-96 min-h-[500px] bg-white">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">n8n AI Assistant</h1>
              <p className="text-xs text-white/80">Enterprise Edition</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-blue-400' : 'bg-white/30'}`}></div>
            <div className={`w-2 h-2 rounded-full ${simulationMode ? 'bg-purple-400' : 'bg-white/30'}`}></div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'main' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Main
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'main' ? <MainTab /> : <AnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
createRoot(root).render(<Popup />);
