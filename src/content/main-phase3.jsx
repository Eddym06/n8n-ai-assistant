// Enhanced Content Script for Phase 3: Advanced Intelligence & Collaboration
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import Ajv from 'ajv';
import { AnimatePresence, motion } from 'framer-motion';
import { ResizableBox } from 'react-resizable';
import * as Tooltip from '@radix-ui/react-tooltip';
import { io } from 'socket.io-client';
import './tailwind.css';

// Import n8n utilities
import { 
  getWorkflowJSON as getWFJSONViaBridge, 
  importWorkflowJSON as importWFViaBridge, 
  applyActions as applyActionsViaBridge, 
  refreshCanvas as refreshCanvasViaBridge, 
  pingStores, 
  observeN8nErrors, 
  notify, 
  startVoiceRecognition, 
  exportWorkflowToGitHub 
} from './n8nUtils';

// Phase 3 Configuration
const PHASE3_CONFIG = {
  SERVER_URL: 'http://localhost:3000',
  API_ENDPOINT: '/api-key',
  COLLABORATION_ENABLED: true,
  SIMULATION_ENABLED: true,
  MUTATION_OBSERVER_ENABLED: true
};

// Global state
let apiKey = null;
let socket = null;
let mutationObserver = null;
let lastWorkflowSnapshot = null;

// AJV Schema Validation
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

const simulationResultSchema = {
  type: 'object',
  properties: {
    workflow: { type: 'object' },
    predictions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          node: { type: 'string' },
          bottleneck_risk: { type: 'number', minimum: 0, maximum: 1 },
          optimization: { type: 'string' },
          parallel_candidates: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    performance_metrics: {
      type: 'object',
      properties: {
        estimated_runtime: { type: 'number' },
        memory_usage: { type: 'number' },
        parallel_efficiency: { type: 'number' }
      }
    }
  }
};

const validateWorkflow = ajv.compile(workflowSchema);
const validateSimulationResult = ajv.compile(simulationResultSchema);

// ======================
// API UTILITIES
// ======================

const fetchAPIKey = async () => {
  try {
    const response = await fetch(`${PHASE3_CONFIG.SERVER_URL}/api-key`);
    const data = await response.json();
    apiKey = data.api_key;
    console.log('✅ Phase 3: API key obtained');
    return apiKey;
  } catch (error) {
    console.error('❌ Phase 3: Failed to fetch API key:', error);
    return null;
  }
};

const makeAPIRequest = async (endpoint, options = {}) => {
  if (!apiKey) {
    await fetchAPIKey();
  }
  
  if (!apiKey) {
    throw new Error('No API key available');
  }
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    }
  };
  
  const response = await fetch(`${PHASE3_CONFIG.SERVER_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// ======================
// WORKFLOW UTILITIES
// ======================

function getCurrentWorkflowJSON() {
  try {
    return getWFJSONViaBridge();
  } catch (error) {
    console.warn('Failed to get workflow JSON:', error);
    return '';
  }
}

async function importWorkflowJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    
    // Validate workflow
    const valid = validateWorkflow(data);
    if (!valid) {
      const msg = ajv.errorsText(validateWorkflow.errors, { separator: '\n' });
      throw new Error(`Workflow validation failed:\n${msg}`);
    }
    
    // Import via bridge
    await importWFViaBridge(jsonStr);
    await refreshCanvasViaBridge();
    
    notify('Workflow imported successfully', 'success');
    
    // Store snapshot for collaboration
    lastWorkflowSnapshot = data;
    
    return true;
  } catch (error) {
    notify(`Import failed: ${error.message}`, 'error');
    console.error('Import error:', error);
    return false;
  }
}

// ======================
// COLLABORATION FEATURES
// ======================

class CollaborationManager {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.username = null;
    this.isConnected = false;
    this.onStateChange = null;
  }
  
  async connect(serverUrl = PHASE3_CONFIG.SERVER_URL) {
    if (this.socket?.connected) return;
    
    try {
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling']
      });
      
      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('🤝 Phase 3: Connected to collaboration server');
        this.onStateChange?.({ connected: true });
      });
      
      this.socket.on('disconnect', () => {
        this.isConnected = false;
        console.log('👋 Phase 3: Disconnected from collaboration server');
        this.onStateChange?.({ connected: false });
      });
      
      this.socket.on('user-joined', (data) => {
        console.log(`👤 User joined: ${data.user.username}`);
        notify(`${data.user.username} joined the collaboration`, 'info');
        this.onStateChange?.({ users: data.users });
      });
      
      this.socket.on('user-left', (data) => {
        console.log(`👋 User left: ${data.username}`);
        notify(`${data.username} left the collaboration`, 'info');
        this.onStateChange?.({ users: data.users });
      });
      
      this.socket.on('workflow-changed', (data) => {
        console.log('🔄 Workflow change received:', data.change);
        this.handleRemoteWorkflowChange(data);
      });
      
      this.socket.on('conflict-resolved', (data) => {
        console.log('⚡ Conflict resolved:', data);
        notify(`Conflict resolved by ${data.resolvedBy}`, 'success');
        if (data.mergedState) {
          this.applyWorkflowState(data.mergedState);
        }
      });
      
      this.socket.on('chat-message', (data) => {
        console.log('💬 Chat message:', data);
        this.onStateChange?.({ chatMessage: data });
      });
      
      this.socket.on('error', (error) => {
        console.error('🚨 Collaboration error:', error);
        notify(`Collaboration error: ${error.message}`, 'error');
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to collaboration server:', error);
      return false;
    }
  }
  
  async joinRoom(roomId, username = 'Anonymous') {
    if (!this.socket?.connected) {
      await this.connect();
    }
    
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }
    
    this.roomId = roomId;
    this.username = username;
    
    this.socket.emit('join-room', {
      roomId,
      username,
      userColor: this.generateUserColor()
    });
    
    console.log(`🏠 Joined collaboration room: ${roomId}`);
  }
  
  async leaveRoom() {
    if (this.socket?.connected && this.roomId) {
      this.socket.disconnect();
      this.roomId = null;
      this.username = null;
    }
  }
  
  sendWorkflowChange(change, workflowState) {
    if (this.socket?.connected && this.roomId) {
      this.socket.emit('workflow-change', {
        change,
        workflowState,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  sendChatMessage(message, type = 'text') {
    if (this.socket?.connected && this.roomId) {
      this.socket.emit('chat-message', { message, type });
    }
  }
  
  resolveConflict(conflictId, resolution, mergedState) {
    if (this.socket?.connected && this.roomId) {
      this.socket.emit('resolve-conflict', {
        conflictId,
        resolution,
        mergedState
      });
    }
  }
  
  async handleRemoteWorkflowChange(data) {
    try {
      const { change, workflowState, from } = data;
      
      // Show notification
      notify(`Workflow updated by ${from.username}`, 'info');
      
      // Apply the change
      if (workflowState) {
        await this.applyWorkflowState(workflowState);
      }
      
      // Update UI
      this.onStateChange?.({ 
        remoteChange: { change, from, timestamp: data.timestamp }
      });
      
    } catch (error) {
      console.error('Failed to handle remote workflow change:', error);
      notify('Failed to apply remote changes', 'error');
    }
  }
  
  async applyWorkflowState(workflowState) {
    try {
      const jsonStr = JSON.stringify(workflowState);
      await importWorkflowJSON(jsonStr);
      lastWorkflowSnapshot = workflowState;
    } catch (error) {
      console.error('Failed to apply workflow state:', error);
      throw error;
    }
  }
  
  generateUserColor() {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Global collaboration manager
const collaborationManager = new CollaborationManager();

// ======================
// SIMULATION FEATURES
// ======================

class WorkflowSimulator {
  constructor() {
    this.isSimulating = false;
  }
  
  async simulateCurrentWorkflow() {
    if (this.isSimulating) {
      notify('Simulation already in progress', 'warning');
      return null;
    }
    
    try {
      this.isSimulating = true;
      
      // Get current workflow
      const workflowJson = getCurrentWorkflowJSON();
      if (!workflowJson) {
        throw new Error('No workflow available for simulation');
      }
      
      const workflow = JSON.parse(workflowJson);
      
      // Validate workflow
      if (!validateWorkflow(workflow)) {
        throw new Error('Invalid workflow structure');
      }
      
      notify('Starting workflow simulation...', 'info');
      
      // Call simulation API
      const result = await makeAPIRequest('/simulate', {
        method: 'POST',
        body: JSON.stringify({
          workflow,
          options: {
            include_performance: true,
            analyze_bottlenecks: true,
            suggest_optimizations: true
          }
        })
      });
      
      if (result.success) {
        // Validate simulation result
        if (validateSimulationResult(result.simulation)) {
          notify('Simulation completed successfully', 'success');
          return result.simulation;
        } else {
          console.warn('Simulation result validation failed:', ajv.errors);
          return result.simulation; // Return anyway but warn
        }
      } else {
        throw new Error(result.error || 'Simulation failed');
      }
      
    } catch (error) {
      console.error('Simulation error:', error);
      notify(`Simulation failed: ${error.message}`, 'error');
      return null;
    } finally {
      this.isSimulating = false;
    }
  }
  
  async runMultiAgentAnalysis(prompt) {
    try {
      const workflowJson = getCurrentWorkflowJSON();
      let context = {};
      
      if (workflowJson) {
        context.current_workflow = JSON.parse(workflowJson);
      }
      
      const result = await makeAPIRequest('/multi-agent', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          context,
          llm_provider: null // Use default
        })
      });
      
      if (result.success) {
        notify('Multi-agent analysis completed', 'success');
        return result;
      } else {
        throw new Error(result.error || 'Multi-agent analysis failed');
      }
      
    } catch (error) {
      console.error('Multi-agent analysis error:', error);
      notify(`Analysis failed: ${error.message}`, 'error');
      return null;
    }
  }
}

// Global simulator
const workflowSimulator = new WorkflowSimulator();

// ======================
// MUTATION OBSERVER
// ======================

class WorkflowChangeObserver {
  constructor() {
    this.observer = null;
    this.isObserving = false;
    this.debounceTimeout = null;
    this.onWorkflowChange = null;
  }
  
  start() {
    if (this.isObserving) return;
    
    // Target the n8n canvas/workflow area
    const targetNode = document.querySelector('#app') || document.body;
    
    if (!targetNode) {
      console.warn('Target node not found for mutation observer');
      return false;
    }
    
    this.observer = new MutationObserver((mutations) => {
      this.handleMutations(mutations);
    });
    
    this.observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-*'],
      characterData: false
    });
    
    this.isObserving = true;
    console.log('👁️ Phase 3: Workflow change observer started');
    return true;
  }
  
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    
    this.isObserving = false;
    console.log('🛑 Workflow change observer stopped');
  }
  
  handleMutations(mutations) {
    // Check if this is a workflow-related change
    const isWorkflowChange = mutations.some(mutation => {
      const target = mutation.target;
      
      // Look for n8n specific classes or elements
      return (
        target.classList?.contains('node') ||
        target.classList?.contains('connection') ||
        target.classList?.contains('node-view') ||
        target.closest?.('.node') ||
        target.closest?.('.connection') ||
        target.querySelector?.('.node') ||
        target.querySelector?.('.connection')
      );
    });
    
    if (isWorkflowChange) {
      // Debounce the change detection
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      
      this.debounceTimeout = setTimeout(() => {
        this.detectWorkflowChange();
      }, 1000); // 1 second debounce
    }
  }
  
  async detectWorkflowChange() {
    try {
      const currentWorkflow = getCurrentWorkflowJSON();
      
      if (!currentWorkflow) return;
      
      const currentParsed = JSON.parse(currentWorkflow);
      
      // Compare with last snapshot
      if (lastWorkflowSnapshot && JSON.stringify(currentParsed) !== JSON.stringify(lastWorkflowSnapshot)) {
        const change = this.calculateDiff(lastWorkflowSnapshot, currentParsed);
        
        console.log('🔄 Workflow change detected:', change);
        
        // Notify collaboration system
        if (collaborationManager.isConnected) {
          collaborationManager.sendWorkflowChange(change, currentParsed);
        }
        
        // Update snapshot
        lastWorkflowSnapshot = currentParsed;
        
        // Trigger callback
        this.onWorkflowChange?.(change, currentParsed);
      } else if (!lastWorkflowSnapshot) {
        // First time capturing workflow
        lastWorkflowSnapshot = currentParsed;
      }
      
    } catch (error) {
      console.warn('Error detecting workflow change:', error);
    }
  }
  
  calculateDiff(oldWorkflow, newWorkflow) {
    const diff = {
      type: 'workflow_change',
      timestamp: new Date().toISOString(),
      changes: []
    };
    
    // Simple diff calculation
    if (oldWorkflow.nodes?.length !== newWorkflow.nodes?.length) {
      diff.changes.push({
        type: 'nodes_count_changed',
        old_count: oldWorkflow.nodes?.length || 0,
        new_count: newWorkflow.nodes?.length || 0
      });
    }
    
    if (JSON.stringify(oldWorkflow.connections) !== JSON.stringify(newWorkflow.connections)) {
      diff.changes.push({
        type: 'connections_changed'
      });
    }
    
    if (oldWorkflow.name !== newWorkflow.name) {
      diff.changes.push({
        type: 'name_changed',
        old_name: oldWorkflow.name,
        new_name: newWorkflow.name
      });
    }
    
    return diff;
  }
}

// Global observer
const workflowObserver = new WorkflowChangeObserver();

// ======================
// MAIN COMPONENT
// ======================

function EnhancedN8nAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentView, setCurrentView] = useState('chat');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [collaborationState, setCollaborationState] = useState({
    connected: false,
    users: [],
    roomId: null
  });
  const [agentSettings, setAgentSettings] = useState({
    errorAgent: true,
    optimizationAgent: true,
    customNodeAgent: false
  });
  
  const chatContainerRef = useRef(null);
  
  // Initialize Phase 3 features
  useEffect(() => {
    const initializePhase3 = async () => {
      console.log('🚀 Phase 3: Initializing advanced features...');
      
      // Fetch API key
      await fetchAPIKey();
      
      // Setup collaboration callbacks
      collaborationManager.onStateChange = (state) => {
        setCollaborationState(prev => ({ ...prev, ...state }));
        
        if (state.chatMessage) {
          setChatHistory(prev => [...prev, {
            type: 'collaboration',
            content: `${state.chatMessage.username}: ${state.chatMessage.message}`,
            timestamp: state.chatMessage.timestamp
          }]);
        }
        
        if (state.remoteChange) {
          setChatHistory(prev => [...prev, {
            type: 'system',
            content: `Workflow updated by ${state.remoteChange.from.username}`,
            timestamp: state.remoteChange.timestamp
          }]);
        }
      };
      
      // Setup workflow observer callbacks
      workflowObserver.onWorkflowChange = (change, workflow) => {
        setChatHistory(prev => [...prev, {
          type: 'system',
          content: `Workflow change detected: ${change.changes.map(c => c.type).join(', ')}`,
          timestamp: change.timestamp
        }]);
      };
      
      // Start workflow observer if enabled
      if (PHASE3_CONFIG.MUTATION_OBSERVER_ENABLED) {
        workflowObserver.start();
      }
      
      console.log('✅ Phase 3: Advanced features initialized');
    };
    
    initializePhase3();
    
    // Cleanup on unmount
    return () => {
      workflowObserver.stop();
      collaborationManager.leaveRoom();
    };
  }, []);
  
  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const message = inputText.trim();
    setInputText('');
    setIsLoading(true);
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    }]);
    
    try {
      // Determine if this should go to multi-agent system
      const shouldUseMultiAgent = (
        message.toLowerCase().includes('error') ||
        message.toLowerCase().includes('optimize') ||
        message.toLowerCase().includes('custom node') ||
        message.toLowerCase().includes('analyze')
      );
      
      let response;
      
      if (shouldUseMultiAgent) {
        // Use multi-agent system
        response = await workflowSimulator.runMultiAgentAnalysis(message);
        
        if (response?.success) {
          setChatHistory(prev => [...prev, {
            type: 'multi-agent',
            content: response.summary || 'Multi-agent analysis completed',
            details: response.results,
            routing: response.routing,
            timestamp: new Date().toISOString()
          }]);
        }
      } else {
        // Use regular expression/memory API
        const currentWorkflow = getCurrentWorkflowJSON();
        const context = currentWorkflow ? { current_workflow: JSON.parse(currentWorkflow) } : {};
        
        const result = await makeAPIRequest('/expression', {
          method: 'POST',
          body: JSON.stringify({
            expression: message,
            context,
            node_type: 'general'
          })
        });
        
        if (result.success) {
          setChatHistory(prev => [...prev, {
            type: 'assistant',
            content: result.analysis.explanation || result.analysis.optimized || 'Analysis completed',
            details: result.analysis,
            timestamp: new Date().toISOString()
          }]);
        }
      }
      
    } catch (error) {
      console.error('Message processing error:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSimulateWorkflow = async () => {
    setIsLoading(true);
    
    try {
      const result = await workflowSimulator.simulateCurrentWorkflow();
      
      if (result) {
        setSimulationResult(result);
        setChatHistory(prev => [...prev, {
          type: 'simulation',
          content: 'Workflow simulation completed',
          details: result,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoinCollaboration = async () => {
    const roomId = prompt('Enter room ID (or leave empty to create new room):') || 
                   `room-${Date.now()}`;
    const username = prompt('Enter your username:') || 'Anonymous';
    
    try {
      await collaborationManager.connect();
      await collaborationManager.joinRoom(roomId, username);
      
      setCollaborationState(prev => ({
        ...prev,
        roomId,
        connected: true
      }));
      
      notify(`Joined collaboration room: ${roomId}`, 'success');
      
    } catch (error) {
      notify(`Failed to join collaboration: ${error.message}`, 'error');
    }
  };
  
  const renderChatMessage = (message, index) => {
    const messageTypes = {
      user: 'bg-blue-100 text-blue-900 ml-8',
      assistant: 'bg-gray-100 text-gray-900 mr-8',
      'multi-agent': 'bg-purple-100 text-purple-900 mr-8',
      simulation: 'bg-green-100 text-green-900 mr-8',
      collaboration: 'bg-yellow-100 text-yellow-900',
      system: 'bg-gray-50 text-gray-600',
      error: 'bg-red-100 text-red-900'
    };
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3 rounded-lg mb-2 ${messageTypes[message.type] || messageTypes.system}`}
      >
        <div className="text-sm font-medium mb-1">
          {message.type === 'user' ? 'You' : 
           message.type === 'multi-agent' ? 'AI Agents' :
           message.type === 'simulation' ? 'Simulator' :
           message.type === 'collaboration' ? 'Team' :
           message.type.charAt(0).toUpperCase() + message.type.slice(1)}
          <span className="text-xs opacity-60 ml-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="text-sm">{message.content}</div>
        
        {message.details && (
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer font-medium">Details</summary>
            <pre className="mt-1 p-2 bg-white/50 rounded overflow-x-auto">
              {JSON.stringify(message.details, null, 2)}
            </pre>
          </details>
        )}
      </motion.div>
    );
  };
  
  if (!isExpanded) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all duration-300"
        title="Open n8n AI Assistant (Phase 3)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </motion.button>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <ResizableBox
        width={400}
        height={600}
        minConstraints={[350, 400]}
        maxConstraints={[800, 800]}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">n8n AI Assistant</h3>
              <p className="text-sm opacity-90">Phase 3: Advanced Intelligence</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex bg-gray-50 border-b">
            {['chat', 'simulation', 'collaboration', 'settings'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`flex-1 py-2 px-3 text-sm font-medium capitalize ${
                  currentView === view 
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'chat' && (
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-2"
                >
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <h4 className="font-medium mb-2">Welcome to Phase 3!</h4>
                      <p className="text-sm">
                        Ask me about workflow optimization, error analysis, or custom nodes.
                        I now have multi-agent intelligence and collaboration features!
                      </p>
                    </div>
                  ) : (
                    chatHistory.map(renderChatMessage)
                  )}
                  {isLoading && (
                    <div className="flex items-center space-x-2 p-3">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm text-gray-500">Processing...</span>
                    </div>
                  )}
                </div>
                
                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about errors, optimization, or custom nodes..."
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputText.trim()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {currentView === 'simulation' && (
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Workflow Simulation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Analyze your workflow for performance bottlenecks and optimization opportunities.
                  </p>
                  
                  <button
                    onClick={handleSimulateWorkflow}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Simulating...' : 'Simulate Current Workflow'}
                  </button>
                </div>
                
                {simulationResult && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Simulation Results</h5>
                    <div className="space-y-2 text-sm">
                      {simulationResult.performance_metrics && (
                        <div>
                          <strong>Performance:</strong>
                          <ul className="ml-4 mt-1">
                            <li>Runtime: {simulationResult.performance_metrics.estimated_runtime}s</li>
                            <li>Memory: {simulationResult.performance_metrics.memory_usage}MB</li>
                            <li>Parallel Efficiency: {(simulationResult.performance_metrics.parallel_efficiency * 100).toFixed(1)}%</li>
                          </ul>
                        </div>
                      )}
                      
                      {simulationResult.predictions && simulationResult.predictions.length > 0 && (
                        <div>
                          <strong>Bottleneck Analysis:</strong>
                          <ul className="ml-4 mt-1 space-y-1">
                            {simulationResult.predictions.map((pred, i) => (
                              <li key={i} className={`p-2 rounded ${pred.bottleneck_risk > 0.7 ? 'bg-red-100' : pred.bottleneck_risk > 0.4 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                                <strong>{pred.node}:</strong> {(pred.bottleneck_risk * 100).toFixed(1)}% risk
                                {pred.optimization && <div className="text-xs mt-1">{pred.optimization}</div>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {currentView === 'collaboration' && (
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Real-time Collaboration</h4>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${collaborationState.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">
                      {collaborationState.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  
                  {!collaborationState.connected ? (
                    <button
                      onClick={handleJoinCollaboration}
                      className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600"
                    >
                      Join Collaboration Room
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium">Room: {collaborationState.roomId}</div>
                        <div className="text-xs text-gray-600">
                          {collaborationState.users.length} user(s) connected
                        </div>
                      </div>
                      
                      {collaborationState.users.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Connected Users:</h5>
                          <div className="space-y-1">
                            {collaborationState.users.map(user => (
                              <div key={user.id} className="flex items-center space-x-2 text-sm">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: user.userColor }}
                                ></div>
                                <span>{user.username}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => collaborationManager.leaveRoom()}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600"
                      >
                        Leave Room
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentView === 'settings' && (
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Agent Settings</h4>
                  <div className="space-y-3">
                    {Object.entries(agentSettings).map(([key, enabled]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setAgentSettings(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">System Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Workflow Observer</span>
                      <span className={workflowObserver.isObserving ? 'text-green-600' : 'text-red-600'}>
                        {workflowObserver.isObserving ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Connection</span>
                      <span className={apiKey ? 'text-green-600' : 'text-red-600'}>
                        {apiKey ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collaboration</span>
                      <span className={collaborationState.connected ? 'text-green-600' : 'text-red-600'}>
                        {collaborationState.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (workflowObserver.isObserving) {
                          workflowObserver.stop();
                        } else {
                          workflowObserver.start();
                        }
                      }}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600"
                    >
                      {workflowObserver.isObserving ? 'Stop Observer' : 'Start Observer'}
                    </button>
                    
                    <button
                      onClick={async () => {
                        try {
                          await fetchAPIKey();
                          notify('API key refreshed', 'success');
                        } catch (error) {
                          notify('Failed to refresh API key', 'error');
                        }
                      }}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600"
                    >
                      Refresh API Key
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ResizableBox>
    </motion.div>
  );
}

// ======================
// INITIALIZATION
// ======================

function initializeEnhancedAssistant() {
  console.log('🚀 n8n AI Assistant Phase 3: Initializing...');
  
  // Wait for page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedAssistant);
    return;
  }
  
  // Create container
  const container = document.createElement('div');
  container.id = 'n8n-ai-assistant-phase3';
  document.body.appendChild(container);
  
  // Initialize React app
  const root = createRoot(container);
  
  root.render(
    <Tooltip.Provider>
      <AnimatePresence>
        <EnhancedN8nAssistant />
      </AnimatePresence>
    </Tooltip.Provider>
  );
  
  console.log('✅ n8n AI Assistant Phase 3: Initialized successfully!');
}

// Start the application
initializeEnhancedAssistant();

export { 
  collaborationManager, 
  workflowSimulator, 
  workflowObserver,
  makeAPIRequest,
  getCurrentWorkflowJSON,
  importWorkflowJSON
};
