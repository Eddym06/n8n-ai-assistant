// Enhanced Popup for Phase 3: Advanced Intelligence & Collaboration
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import './tailwind.css';

// Phase 3 Configuration
const PHASE3_CONFIG = {
  SERVER_URL: 'http://localhost:3000',
  COLLABORATION_ENABLED: true,
  MULTI_AGENT_ENABLED: true,
  SIMULATION_ENABLED: true
};

// Global state
let serverStatus = { connected: false, health: null };

// API Utilities
const fetchServerHealth = async () => {
  try {
    const response = await fetch(`${PHASE3_CONFIG.SERVER_URL}/health`);
    const health = await response.json();
    serverStatus = { connected: true, health };
    return health;
  } catch (error) {
    serverStatus = { connected: false, health: null };
    console.error('Server health check failed:', error);
    return null;
  }
};

const fetchAPIKey = async () => {
  try {
    const response = await fetch(`${PHASE3_CONFIG.SERVER_URL}/api-key`);
    const data = await response.json();
    return data.api_key;
  } catch (error) {
    console.error('API key fetch failed:', error);
    return null;
  }
};

const makeAPIRequest = async (endpoint, options = {}) => {
  try {
    const apiKey = await fetchAPIKey();
    if (!apiKey) throw new Error('No API key available');
    
    const response = await fetch(`${PHASE3_CONFIG.SERVER_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Main Popup Component
function EnhancedPopup() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [serverHealth, setServerHealth] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [systemStats, setSystemStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collaborationRoom, setCollaborationRoom] = useState('');
  const [username, setUsername] = useState('User');
  const [agentSettings, setAgentSettings] = useState({
    errorAgent: true,
    optimizationAgent: true,
    customNodeAgent: false,
    tracing: false,
    gitIntegration: false,
    offlineMode: false
  });
  const [quickActions, setQuickActions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Initialize popup
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      
      try {
        // Check server health
        const health = await fetchServerHealth();
        setServerHealth(health);
        setIsConnected(!!health);
        
        // Fetch system stats
        if (health) {
          try {
            const stats = await makeAPIRequest('/stats');
            setSystemStats(stats);
          } catch (error) {
            console.warn('Failed to fetch stats:', error);
          }
        }
        
        // Load saved settings
        const savedSettings = localStorage.getItem('n8n-ai-phase3-settings');
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings);
            setAgentSettings(prev => ({ ...prev, ...parsed }));
            setUsername(parsed.username || 'User');
          } catch (e) {
            console.warn('Failed to load saved settings');
          }
        }
        
      } catch (error) {
        console.error('Popup initialization failed:', error);
        addNotification('Failed to connect to AI server', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);
  
  // Save settings to localStorage
  useEffect(() => {
    const settings = { ...agentSettings, username };
    localStorage.setItem('n8n-ai-phase3-settings', JSON.stringify(settings));
  }, [agentSettings, username]);
  
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };
  
  const handleSimulateWorkflow = async () => {
    try {
      // Send message to content script to trigger simulation
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'simulate_workflow',
          data: {}
        });
        
        addNotification('Workflow simulation started', 'success');
        window.close();
      }
    } catch (error) {
      addNotification('Failed to start simulation', 'error');
    }
  };
  
  const handleJoinCollaboration = async () => {
    if (!collaborationRoom.trim()) {
      addNotification('Please enter a room ID', 'warning');
      return;
    }
    
    try {
      // Send message to content script to join collaboration
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'join_collaboration',
          data: {
            roomId: collaborationRoom,
            username
          }
        });
        
        addNotification(`Joining room: ${collaborationRoom}`, 'success');
        window.close();
      }
    } catch (error) {
      addNotification('Failed to join collaboration', 'error');
    }
  };
  
  const handleQuickAction = async (action) => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: action.id,
          data: action.data || {}
        });
        
        addNotification(action.successMessage || 'Action executed', 'success');
        
        if (!action.keepOpen) {
          window.close();
        }
      }
    } catch (error) {
      addNotification(action.errorMessage || 'Action failed', 'error');
    }
  };
  
  const generateRoomCode = () => {
    const code = `room-${Math.random().toString(36).substr(2, 8)}`;
    setCollaborationRoom(code);
  };
  
  const openServerDashboard = () => {
    chrome.tabs.create({ url: `${PHASE3_CONFIG.SERVER_URL}/health` });
  };
  
  if (isLoading) {
    return (
      <div className="w-96 h-[500px] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Phase 3...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-96 h-[500px] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">n8n AI Assistant</h1>
            <p className="text-sm opacity-90">Phase 3: Advanced Intelligence</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`p-2 text-sm ${
              notification.type === 'error' ? 'bg-red-100 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              notification.type === 'success' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Navigation */}
      <div className="flex bg-gray-50 border-b">
        {['dashboard', 'simulation', 'collaboration', 'agents', 'settings'].map(view => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`flex-1 py-2 px-2 text-xs font-medium capitalize ${
              currentView === view 
                ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {view}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentView === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* System Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">System Status</h3>
              {serverHealth ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-mono">{serverHealth.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Workflows:</span>
                    <span className="font-mono">{serverHealth.workflows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Items:</span>
                    <span className="font-mono">{serverHealth.memory_items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Rooms:</span>
                    <span className="font-mono">{serverHealth.collaboration_rooms}</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 mb-1">Available Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(serverHealth.features || {}).map(([feature, enabled]) => (
                        <span
                          key={feature}
                          className={`px-2 py-1 rounded text-xs ${
                            enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {feature.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-red-600">
                  <p className="font-medium">Server Unavailable</p>
                  <p className="text-sm">Make sure the server is running on port 3000</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Retry Connection
                  </button>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            {systemStats && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Database Statistics</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {systemStats.workflows?.total || 0}
                    </div>
                    <div className="text-gray-600">Total Workflows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {systemStats.workflows?.categories || 0}
                    </div>
                    <div className="text-gray-600">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {systemStats.memory?.total || 0}
                    </div>
                    <div className="text-gray-600">Memory Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {systemStats.system?.llms_available?.length || 0}
                    </div>
                    <div className="text-gray-600">LLMs Available</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="font-medium">Quick Actions</h3>
              
              <button
                onClick={() => setCurrentView('simulation')}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                🔬 Simulate Workflow
              </button>
              
              <button
                onClick={() => setCurrentView('collaboration')}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                🤝 Join Collaboration
              </button>
              
              <button
                onClick={() => setCurrentView('agents')}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                🤖 Configure Agents
              </button>
              
              {isConnected && (
                <button
                  onClick={openServerDashboard}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  🖥️ Open Server Dashboard
                </button>
              )}
            </div>
          </motion.div>
        )}
        
        {currentView === 'simulation' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-medium mb-2">Workflow Simulation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Analyze your current workflow for performance bottlenecks, optimization opportunities, and parallel execution possibilities.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-green-800 mb-2">Simulation Features:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Performance bottleneck detection</li>
                  <li>• Parallel execution analysis</li>
                  <li>• Memory usage estimation</li>
                  <li>• Runtime prediction</li>
                  <li>• Optimization suggestions</li>
                </ul>
              </div>
              
              <button
                onClick={handleSimulateWorkflow}
                disabled={!isConnected}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConnected ? 'Start Workflow Simulation' : 'Server Not Available'}
              </button>
              
              <p className="text-xs text-gray-500 mt-2">
                This will analyze the currently open workflow in your n8n editor.
              </p>
            </div>
          </motion.div>
        )}
        
        {currentView === 'collaboration' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-medium mb-2">Real-time Collaboration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Collaborate with your team on workflows in real-time. Share rooms and see changes live.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Room ID</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={collaborationRoom}
                      onChange={(e) => setCollaborationRoom(e.target.value)}
                      placeholder="Enter room ID or generate one"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={generateRoomCode}
                      className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleJoinCollaboration}
                  disabled={!isConnected || !collaborationRoom.trim() || !username.trim()}
                  className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Join Collaboration Room
                </button>
                
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Collaboration Features:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Real-time workflow synchronization</li>
                    <li>• Conflict resolution with AI assistance</li>
                    <li>• Live cursors and user presence</li>
                    <li>• Chat and voice communication</li>
                    <li>• Change history and rollback</li>
                  </ul>
                </div>
                
                {serverHealth?.collaboration_rooms > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm">
                      <strong>Active Rooms:</strong> {serverHealth.collaboration_rooms}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Other teams are currently collaborating
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {currentView === 'agents' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-medium mb-2">Multi-Agent System</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure which AI agents are active and available for assistance.
              </p>
              
              <div className="space-y-3">
                {[
                  {
                    key: 'errorAgent',
                    name: 'Error Analysis Agent',
                    description: 'Analyzes workflow errors and provides solutions',
                    icon: '🚨'
                  },
                  {
                    key: 'optimizationAgent',
                    name: 'Optimization Agent',
                    description: 'Identifies performance bottlenecks and suggests improvements',
                    icon: '⚡'
                  },
                  {
                    key: 'customNodeAgent',
                    name: 'Custom Node Agent',
                    description: 'Generates custom JavaScript nodes for specific tasks',
                    icon: '🔧'
                  }
                ].map(agent => (
                  <div key={agent.key} className="bg-gray-50 p-3 rounded-lg">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={agentSettings[agent.key]}
                        onChange={(e) => setAgentSettings(prev => ({
                          ...prev,
                          [agent.key]: e.target.checked
                        }))}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{agent.icon}</span>
                          <span className="font-medium text-sm">{agent.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{agent.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <h4 className="font-medium text-blue-800 mb-2">Agent Capabilities:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Context-aware analysis using workflow memory</li>
                  <li>• Integration with n8n workflow database</li>
                  <li>• Multi-modal input processing</li>
                  <li>• Collaborative conflict resolution</li>
                  <li>• Continuous learning from interactions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentView === 'settings' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <h3 className="font-medium mb-2">Advanced Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">System Features</h4>
                  <div className="space-y-2">
                    {[
                      {
                        key: 'tracing',
                        name: 'LangSmith Tracing',
                        description: 'Enable detailed tracing for debugging'
                      },
                      {
                        key: 'gitIntegration',
                        name: 'Git Integration',
                        description: 'Auto-commit workflow changes'
                      },
                      {
                        key: 'offlineMode',
                        name: 'Offline Mode',
                        description: 'Use local LLM when server unavailable'
                      }
                    ].map(setting => (
                      <label key={setting.key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={agentSettings[setting.key]}
                          onChange={(e) => setAgentSettings(prev => ({
                            ...prev,
                            [setting.key]: e.target.checked
                          }))}
                        />
                        <div>
                          <div className="text-sm font-medium">{setting.name}</div>
                          <div className="text-xs text-gray-600">{setting.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Server Information</h4>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                    <div>URL: {PHASE3_CONFIG.SERVER_URL}</div>
                    <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
                    {serverHealth && (
                      <div>Phase: {serverHealth.phase}</div>
                    )}
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <button
                    onClick={() => {
                      localStorage.removeItem('n8n-ai-phase3-settings');
                      setAgentSettings({
                        errorAgent: true,
                        optimizationAgent: true,
                        customNodeAgent: false,
                        tracing: false,
                        gitIntegration: false,
                        offlineMode: false
                      });
                      setUsername('User');
                      addNotification('Settings reset to defaults', 'success');
                    }}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t p-3 bg-gray-50">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Phase 3 v3.0.0</span>
          <div className="flex items-center space-x-2">
            {serverHealth?.llms_available && (
              <span title={`LLMs: ${serverHealth.llms_available.join(', ')}`}>
                🧠 {serverHealth.llms_available.length}
              </span>
            )}
            {isConnected && (
              <span className="text-green-600">●</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Initialize popup
function initializePopup() {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<EnhancedPopup />);
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}

export default EnhancedPopup;
