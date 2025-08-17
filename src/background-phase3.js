// Enhanced Background Script for Phase 3: Advanced Intelligence & Collaboration
console.log('🚀 n8n AI Assistant Phase 3: Background script starting...');

// Phase 3 Configuration
const PHASE3_CONFIG = {
  SERVER_URL: 'http://localhost:3000',
  COLLABORATION_ENABLED: true,
  NOTIFICATION_ENABLED: true,
  AUTO_UPDATE_CHECK: true
};

// Global state
let serverConnection = {
  status: 'disconnected',
  lastCheck: null,
  retryCount: 0
};

let collaborationState = {
  activeRooms: new Map(),
  userSessions: new Map()
};

let systemHealth = {
  server: false,
  agents: false,
  collaboration: false,
  memory: false
};

// Utility Functions
const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
};

const sendNotification = (title, message, type = 'basic') => {
  if (!PHASE3_CONFIG.NOTIFICATION_ENABLED) return;
  
  try {
    chrome.notifications.create({
      type: type,
      iconUrl: 'icons/icon48.png',
      title: `n8n AI Assistant - ${title}`,
      message: message
    });
  } catch (error) {
    log(`Notification error: ${error.message}`, 'error');
  }
};

// Server Health Monitoring
const checkServerHealth = async () => {
  try {
    const response = await fetch(`${PHASE3_CONFIG.SERVER_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const health = await response.json();
      
      // Update server connection status
      const wasDisconnected = serverConnection.status === 'disconnected';
      serverConnection.status = 'connected';
      serverConnection.lastCheck = Date.now();
      serverConnection.retryCount = 0;
      
      // Update system health
      systemHealth = {
        server: true,
        agents: health.active_agents && health.active_agents.length > 0,
        collaboration: health.features?.collaboration || false,
        memory: health.memory_items > 0
      };
      
      // Notify if connection was restored
      if (wasDisconnected) {
        sendNotification('Connection Restored', 'AI server is now available');
        log('Server connection restored');
      }
      
      return health;
    } else {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    // Update connection status
    const wasConnected = serverConnection.status === 'connected';
    serverConnection.status = 'disconnected';
    serverConnection.retryCount++;
    
    // Update system health
    systemHealth = {
      server: false,
      agents: false,
      collaboration: false,
      memory: false
    };
    
    // Notify if connection was lost
    if (wasConnected) {
      sendNotification('Connection Lost', 'AI server is unavailable', 'basic');
      log(`Server connection lost: ${error.message}`, 'error');
    }
    
    return null;
  }
};

// Background Health Monitoring
const startHealthMonitoring = () => {
  // Initial check
  checkServerHealth();
  
  // Periodic checks every 30 seconds
  setInterval(async () => {
    const health = await checkServerHealth();
    
    // Log health status periodically
    if (health) {
      log(`Health check: ${health.workflows} workflows, ${health.memory_items} memories, ${health.collaboration_rooms} rooms`);
    } else {
      log(`Health check failed (retry ${serverConnection.retryCount})`, 'warn');
    }
  }, 30000);
};

// Message Handler for Content Scripts and Popup
const handleMessage = async (message, sender, sendResponse) => {
  const { action, data } = message;
  
  log(`Received message: ${action} from ${sender.tab ? 'content' : 'popup'}`);
  
  try {
    switch (action) {
      case 'get_server_status':
        sendResponse({
          success: true,
          status: serverConnection.status,
          health: systemHealth,
          lastCheck: serverConnection.lastCheck
        });
        break;
        
      case 'check_server_health':
        const health = await checkServerHealth();
        sendResponse({
          success: !!health,
          health: health,
          systemHealth: systemHealth
        });
        break;
        
      case 'simulate_workflow':
        // Forward to content script
        if (sender.tab) {
          // Message came from content script - relay to other tabs if needed
          sendResponse({ success: true, message: 'Simulation request processed' });
        } else {
          // Message came from popup - forward to active tab
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, message);
            sendResponse({ success: true, message: 'Simulation request forwarded' });
          } else {
            sendResponse({ success: false, error: 'No active tab found' });
          }
        }
        break;
        
      case 'join_collaboration':
        // Handle collaboration join
        const { roomId, username } = data || {};
        
        if (!roomId || !username) {
          sendResponse({ success: false, error: 'Room ID and username required' });
          break;
        }
        
        // Store collaboration session
        const sessionId = sender.tab?.id || 'popup';
        collaborationState.userSessions.set(sessionId, {
          roomId,
          username,
          joinedAt: Date.now()
        });
        
        // Forward to content script if from popup
        if (!sender.tab) {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, message);
          }
        }
        
        sendNotification('Collaboration', `Joined room: ${roomId} as ${username}`);
        sendResponse({ success: true, message: 'Collaboration session started' });
        break;
        
      case 'leave_collaboration':
        // Handle collaboration leave
        const leaveSessionId = sender.tab?.id || 'popup';
        const session = collaborationState.userSessions.get(leaveSessionId);
        
        if (session) {
          collaborationState.userSessions.delete(leaveSessionId);
          sendNotification('Collaboration', `Left room: ${session.roomId}`);
        }
        
        sendResponse({ success: true, message: 'Collaboration session ended' });
        break;
        
      case 'agent_analysis_complete':
        // Handle agent analysis completion notification
        const { analysisType, summary } = data || {};
        
        sendNotification(
          'Analysis Complete', 
          `${analysisType || 'Agent analysis'} finished: ${(summary || '').substring(0, 100)}...`
        );
        
        sendResponse({ success: true });
        break;
        
      case 'error_detected':
        // Handle error detection notification
        const { errorType, errorMessage } = data || {};
        
        sendNotification(
          'Error Detected',
          `${errorType || 'Workflow error'}: ${(errorMessage || '').substring(0, 100)}...`,
          'basic'
        );
        
        sendResponse({ success: true });
        break;
        
      case 'workflow_optimized':
        // Handle optimization completion notification
        const { optimizations, performanceGain } = data || {};
        
        let notificationText = 'Workflow optimized successfully';
        if (performanceGain) {
          notificationText += ` (${performanceGain}% improvement)`;
        }
        
        sendNotification('Optimization Complete', notificationText);
        sendResponse({ success: true });
        break;
        
      case 'get_collaboration_state':
        // Return current collaboration state
        sendResponse({
          success: true,
          state: {
            activeSessions: Array.from(collaborationState.userSessions.entries()),
            serverCollaboration: systemHealth.collaboration
          }
        });
        break;
        
      case 'update_badge':
        // Update extension badge
        const { text, color } = data || {};
        
        if (sender.tab) {
          chrome.action.setBadgeText({ text: text || '', tabId: sender.tab.id });
          chrome.action.setBadgeBackgroundColor({ color: color || '#3B82F6', tabId: sender.tab.id });
        }
        
        sendResponse({ success: true });
        break;
        
      default:
        log(`Unknown action: ${action}`, 'warn');
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    log(`Error handling message ${action}: ${error.message}`, 'error');
    sendResponse({ success: false, error: error.message });
  }
};

// Installation and Update Handler
const handleInstallOrUpdate = (details) => {
  log(`Extension ${details.reason}: Phase 3 installed`);
  
  if (details.reason === 'install') {
    // First installation
    sendNotification(
      'Welcome to Phase 3!', 
      'Advanced Intelligence & Collaboration features are now available'
    );
    
    // Set default badge
    chrome.action.setBadgeText({ text: '3.0' });
    chrome.action.setBadgeBackgroundColor({ color: '#8B5CF6' });
    
    // Open welcome page (optional)
    // chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
    
  } else if (details.reason === 'update') {
    // Extension updated
    const previousVersion = details.previousVersion;
    log(`Updated from version ${previousVersion} to Phase 3`);
    
    sendNotification(
      'Updated to Phase 3!', 
      'New multi-agent AI and collaboration features available'
    );
  }
};

// Context Menu Setup
const setupContextMenus = () => {
  try {
    // Remove existing menus
    chrome.contextMenus.removeAll(() => {
      // Add Phase 3 context menus
      chrome.contextMenus.create({
        id: 'n8n-ai-simulate',
        title: 'Simulate with n8n AI',
        contexts: ['page'],
        documentUrlPatterns: ['*://*/*n8n*/*', '*://localhost/*', '*://127.0.0.1/*']
      });
      
      chrome.contextMenus.create({
        id: 'n8n-ai-collaborate',
        title: 'Start Collaboration',
        contexts: ['page'],
        documentUrlPatterns: ['*://*/*n8n*/*', '*://localhost/*', '*://127.0.0.1/*']
      });
      
      chrome.contextMenus.create({
        id: 'n8n-ai-analyze-error',
        title: 'Analyze with AI Agent',
        contexts: ['selection'],
        documentUrlPatterns: ['*://*/*n8n*/*', '*://localhost/*', '*://127.0.0.1/*']
      });
      
      log('Context menus created for Phase 3');
    });
  } catch (error) {
    log(`Context menu setup error: ${error.message}`, 'error');
  }
};

// Context Menu Click Handler
const handleContextMenuClick = async (info, tab) => {
  log(`Context menu clicked: ${info.menuItemId}`);
  
  try {
    switch (info.menuItemId) {
      case 'n8n-ai-simulate':
        chrome.tabs.sendMessage(tab.id, { 
          action: 'simulate_workflow',
          data: { trigger: 'context_menu' }
        });
        break;
        
      case 'n8n-ai-collaborate':
        chrome.tabs.sendMessage(tab.id, { 
          action: 'start_collaboration',
          data: { trigger: 'context_menu' }
        });
        break;
        
      case 'n8n-ai-analyze-error':
        const selectedText = info.selectionText;
        chrome.tabs.sendMessage(tab.id, { 
          action: 'analyze_error',
          data: { 
            error: selectedText,
            trigger: 'context_menu'
          }
        });
        break;
    }
  } catch (error) {
    log(`Context menu action error: ${error.message}`, 'error');
  }
};

// Tab Management
const handleTabUpdated = (tabId, changeInfo, tab) => {
  // Check if tab is loading an n8n instance
  if (changeInfo.status === 'complete' && tab.url) {
    const isN8nPage = tab.url.includes('n8n') || 
                     tab.url.includes('localhost') || 
                     tab.url.includes('127.0.0.1');
    
    if (isN8nPage) {
      log(`n8n page detected: ${tab.url}`);
      
      // Update badge for n8n tabs
      chrome.action.setBadgeText({ text: 'AI', tabId: tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#10B981', tabId: tabId });
      
      // Check if content script is loaded by sending a ping
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            log(`Content script not loaded on tab ${tabId}`, 'warn');
          } else {
            log(`Content script active on tab ${tabId}`);
          }
        });
      }, 1000);
    }
  }
};

// Extension Icon Click Handler
const handleActionClick = async (tab) => {
  log(`Extension icon clicked on tab: ${tab.id}`);
  
  try {
    // Check if it's an n8n page
    const isN8nPage = tab.url.includes('n8n') || 
                     tab.url.includes('localhost') || 
                     tab.url.includes('127.0.0.1');
    
    if (isN8nPage) {
      // Send message to content script to show assistant
      chrome.tabs.sendMessage(tab.id, { 
        action: 'show_assistant',
        data: { trigger: 'icon_click' }
      }, (response) => {
        if (chrome.runtime.lastError) {
          log('Content script not available, showing popup', 'warn');
          // Fallback: open popup
          chrome.action.openPopup();
        }
      });
    } else {
      // Not an n8n page, show notification
      sendNotification(
        'n8n Page Required',
        'Please navigate to an n8n instance to use the AI assistant'
      );
    }
  } catch (error) {
    log(`Action click error: ${error.message}`, 'error');
  }
};

// Startup Sequence
const initializeBackground = () => {
  log('Phase 3 background script initializing...');
  
  // Start health monitoring
  startHealthMonitoring();
  
  // Setup context menus
  setupContextMenus();
  
  // Set initial badge
  chrome.action.setBadgeText({ text: '3.0' });
  chrome.action.setBadgeBackgroundColor({ color: '#8B5CF6' });
  
  log('Phase 3 background script initialized successfully');
};

// Event Listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep message channel open for async responses
});

chrome.runtime.onInstalled.addListener(handleInstallOrUpdate);

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.tabs.onUpdated.addListener(handleTabUpdated);

chrome.action.onClicked.addListener(handleActionClick);

// Handle browser startup
chrome.runtime.onStartup.addListener(() => {
  log('Browser startup detected');
  initializeBackground();
});

// Handle extension suspension (if supported)
if (chrome.runtime.onSuspend) {
  chrome.runtime.onSuspend.addListener(() => {
    log('Background script suspending...');
    
    // Clean up any active resources
    collaborationState.userSessions.clear();
    
    // Save important state to storage if needed
    chrome.storage.local.set({
      'lastServerStatus': serverConnection.status,
      'lastHealthCheck': serverConnection.lastCheck
    });
  });
}

// Handle extension suspension cancellation (if supported)  
if (chrome.runtime.onSuspendCanceled) {
  chrome.runtime.onSuspendCanceled.addListener(() => {
    log('Background script suspension canceled');
    initializeBackground();
  });
}

// Error handling for unhandled promises
self.addEventListener('unhandledrejection', (event) => {
  log(`Unhandled promise rejection: ${event.reason}`, 'error');
  event.preventDefault();
});

// Global error handler
self.addEventListener('error', (event) => {
  log(`Global error: ${event.error?.message || event.message}`, 'error');
});

// Initialize when script loads
initializeBackground();

log('🚀 n8n AI Assistant Phase 3: Background script loaded successfully!');
