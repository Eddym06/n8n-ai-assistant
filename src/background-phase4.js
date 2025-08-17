/**
 * 🚀 n8n AI Assistant - Phase 4: Optimized Background Script
 * Enhanced service worker with health monitoring, notifications, and analytics
 * Version: 4.0.0 | Date: 2025-08-17
 */

// 🎯 Configuration
const CONFIG = {
  SERVER_URL: 'http://localhost:3000',
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  ANALYTICS_SYNC_INTERVAL: 300000, // 5 minutes
  NOTIFICATION_DURATION: 5000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

// 🏥 Health Monitoring System
class HealthMonitor {
  constructor() {
    this.lastHealthCheck = null;
    this.healthStatus = {
      server: 'unknown',
      redis: 'unknown',
      llm: 'unknown',
      uptime: 0
    };
    this.isMonitoring = false;
  }

  async start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🏥 Health monitoring started');
    
    // Initial health check
    await this.performHealthCheck();
    
    // Set up periodic health checks
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, CONFIG.HEALTH_CHECK_INTERVAL);
  }

  async performHealthCheck() {
    try {
      const response = await fetch(`${CONFIG.SERVER_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const healthData = await response.json();
        this.updateHealthStatus(healthData);
        this.lastHealthCheck = new Date();
        
        // Notify if recovered from error
        if (this.healthStatus.server === 'error') {
          this.showNotification('✅ Server connection restored', 'success');
        }
        
        this.healthStatus = { ...healthData };
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      console.warn('Health check failed:', error.message);
      this.handleHealthCheckFailure(error);
    }
  }

  updateHealthStatus(healthData) {
    // Check for status changes and notify
    if (this.healthStatus.redis !== healthData.redis) {
      const message = healthData.redis === 'connected' ? 
        '🔴 Redis connected' : '⚠️ Redis connection lost';
      this.showNotification(message, healthData.redis === 'connected' ? 'success' : 'warning');
    }

    if (this.healthStatus.llm !== healthData.llm) {
      const message = healthData.llm === 'configured' ? 
        '🧠 LLM provider configured' : '⚠️ LLM provider not configured';
      this.showNotification(message, healthData.llm === 'configured' ? 'success' : 'warning');
    }
  }

  handleHealthCheckFailure(error) {
    if (this.healthStatus.server !== 'error') {
      this.showNotification('❌ Server connection lost', 'error');
    }
    
    this.healthStatus.server = 'error';
    this.healthStatus.redis = 'error';
    this.healthStatus.uptime = 0;
  }

  showNotification(message, type = 'info') {
    const iconMap = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };

    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icons/icon48.png',
      title: 'n8n AI Assistant',
      message: `${iconMap[type]} ${message}`,
      priority: type === 'error' ? 2 : 1
    });
  }

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.isMonitoring = false;
  }

  getStatus() {
    return {
      ...this.healthStatus,
      lastCheck: this.lastHealthCheck,
      monitoring: this.isMonitoring
    };
  }
}

// 📊 Analytics Manager
class AnalyticsManager {
  constructor() {
    this.analytics = new Map();
    this.sessionStart = Date.now();
    this.syncInterval = null;
  }

  async start() {
    // Load stored analytics
    const stored = await this.getStoredAnalytics();
    if (stored) {
      this.analytics = new Map(Object.entries(stored));
    }

    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.syncAnalytics();
    }, CONFIG.ANALYTICS_SYNC_INTERVAL);

    console.log('📊 Analytics manager started');
  }

  track(event, category, value = 1) {
    const key = `${event}:${category}`;
    const current = this.analytics.get(key) || 0;
    this.analytics.set(key, current + value);
    
    // Store locally
    this.storeAnalytics();
  }

  async syncAnalytics() {
    try {
      const analyticsData = {
        events: Object.fromEntries(this.analytics.entries()),
        session: {
          start: this.sessionStart,
          duration: Date.now() - this.sessionStart
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${CONFIG.SERVER_URL}/api/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analyticsData)
      });

      if (response.ok) {
        console.log('📊 Analytics synced successfully');
      }
    } catch (error) {
      console.warn('Analytics sync failed:', error);
    }
  }

  async getStoredAnalytics() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['analytics'], (result) => {
        resolve(result.analytics);
      });
    });
  }

  storeAnalytics() {
    const data = Object.fromEntries(this.analytics.entries());
    chrome.storage.local.set({ analytics: data });
  }

  getAnalytics() {
    return {
      events: Object.fromEntries(this.analytics.entries()),
      session: {
        start: this.sessionStart,
        duration: Date.now() - this.sessionStart
      }
    };
  }
}

// 🔄 Request Manager with Retry Logic
class RequestManager {
  constructor() {
    this.requestQueue = new Map();
    this.retryCount = new Map();
  }

  async makeRequest(url, options = {}, retries = CONFIG.MAX_RETRIES) {
    const requestId = `${url}-${Date.now()}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Clear retry count on success
      this.retryCount.delete(requestId);
      return await response.json();

    } catch (error) {
      const currentRetries = this.retryCount.get(requestId) || 0;
      
      if (currentRetries < retries) {
        console.log(`Retrying request (${currentRetries + 1}/${retries}): ${url}`);
        this.retryCount.set(requestId, currentRetries + 1);
        
        // Exponential backoff
        const delay = CONFIG.RETRY_DELAY * Math.pow(2, currentRetries);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.makeRequest(url, options, retries);
      } else {
        console.error(`Request failed after ${retries} retries:`, error);
        throw error;
      }
    }
  }
}

// 🎛️ Main Background Service
class Phase4BackgroundService {
  constructor() {
    this.healthMonitor = new HealthMonitor();
    this.analyticsManager = new AnalyticsManager();
    this.requestManager = new RequestManager();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    console.log('🚀 n8n AI Assistant Phase 4 Background Service initializing...');

    try {
      // Start health monitoring
      await this.healthMonitor.start();
      
      // Start analytics
      await this.analyticsManager.start();
      
      // Set up message listeners
      this.setupMessageListeners();
      
      // Set up alarm listeners
      this.setupAlarms();
      
      // Set up notification listeners
      this.setupNotificationListeners();

      // Track initialization
      this.analyticsManager.track('background_service', 'initialized');
      
      this.isInitialized = true;
      console.log('✅ Background service initialized successfully');
      
    } catch (error) {
      console.error('❌ Background service initialization failed:', error);
      throw error;
    }
  }

  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      this.analyticsManager.track('message_received', message.action || 'unknown');

      switch (message.action) {
        case 'getHealthStatus':
          sendResponse({
            success: true,
            data: this.healthMonitor.getStatus()
          });
          break;

        case 'getAnalytics':
          sendResponse({
            success: true,
            data: this.analyticsManager.getAnalytics()
          });
          break;

        case 'makeApiRequest':
          try {
            const result = await this.requestManager.makeRequest(
              message.url,
              message.options
            );
            sendResponse({ success: true, data: result });
          } catch (error) {
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        case 'trackEvent':
          this.analyticsManager.track(
            message.event,
            message.category,
            message.value
          );
          sendResponse({ success: true });
          break;

        case 'showNotification':
          this.healthMonitor.showNotification(
            message.message,
            message.type || 'info'
          );
          sendResponse({ success: true });
          break;

        case 'checkServerConnection':
          try {
            await this.healthMonitor.performHealthCheck();
            sendResponse({
              success: true,
              status: this.healthMonitor.getStatus()
            });
          } catch (error) {
            sendResponse({
              success: false,
              error: error.message
            });
          }
          break;

        case 'exportAnalytics':
          try {
            const analytics = this.analyticsManager.getAnalytics();
            const blob = new Blob([JSON.stringify(analytics, null, 2)], {
              type: 'application/json'
            });
            
            // Create download
            const url = URL.createObjectURL(blob);
            chrome.downloads.download({
              url,
              filename: `n8n-ai-analytics-${Date.now()}.json`,
              saveAs: true
            });
            
            sendResponse({ success: true });
          } catch (error) {
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        case 'clearCache':
          try {
            await this.requestManager.makeRequest(
              `${CONFIG.SERVER_URL}/cache/clear`,
              { method: 'DELETE' }
            );
            this.healthMonitor.showNotification('🗑️ Cache cleared successfully', 'success');
            sendResponse({ success: true });
          } catch (error) {
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        case 'sendSlackNotification':
          try {
            await this.requestManager.makeRequest(
              `${CONFIG.SERVER_URL}/api/slack/notify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  message: message.message,
                  type: message.type || 'info'
                })
              }
            );
            sendResponse({ success: true });
          } catch (error) {
            sendResponse({ 
              success: false, 
              error: error.message 
            });
          }
          break;

        default:
          sendResponse({
            success: false,
            error: 'Unknown action'
          });
      }
    } catch (error) {
      console.error('Message handling error:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }

  setupAlarms() {
    // Set up periodic health checks as backup
    chrome.alarms.create('healthCheck', { 
      delayInMinutes: 1,
      periodInMinutes: 1 
    });
    
    chrome.alarms.create('analyticsSync', {
      delayInMinutes: 5,
      periodInMinutes: 5
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      switch (alarm.name) {
        case 'healthCheck':
          this.healthMonitor.performHealthCheck();
          break;
        case 'analyticsSync':
          this.analyticsManager.syncAnalytics();
          break;
      }
    });
  }

  setupNotificationListeners() {
    chrome.notifications.onClicked.addListener((notificationId) => {
      this.analyticsManager.track('notification', 'clicked');
      chrome.notifications.clear(notificationId);
    });

    chrome.notifications.onClosed.addListener((notificationId) => {
      this.analyticsManager.track('notification', 'closed');
    });
  }

  // Cleanup on extension shutdown
  async cleanup() {
    console.log('🧹 Cleaning up background service...');
    
    this.healthMonitor.stop();
    
    // Final analytics sync
    await this.analyticsManager.syncAnalytics();
    
    // Clear alarms
    chrome.alarms.clearAll();
    
    this.isInitialized = false;
    console.log('✅ Background service cleanup completed');
  }
}

// 🚀 Initialize Service Worker
const backgroundService = new Phase4BackgroundService();

// Handle service worker lifecycle
chrome.runtime.onStartup.addListener(() => {
  console.log('🔄 Extension startup detected');
  backgroundService.initialize().catch(console.error);
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log('📦 Extension installed/updated:', details.reason);
  backgroundService.initialize().catch(console.error);
  
  if (details.reason === 'install') {
    // Show welcome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/icons/icon48.png',
      title: 'n8n AI Assistant v4.0',
      message: '🚀 Welcome! Your AI assistant is ready with advanced optimizations.',
      priority: 1
    });
  }
});

chrome.runtime.onSuspend.addListener(() => {
  console.log('⏸️ Extension suspending');
  backgroundService.cleanup().catch(console.error);
});

// Handle tab updates for analytics
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('n8n')) {
    backgroundService.analyticsManager?.track('tab_navigation', 'n8n_page');
  }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Phase4BackgroundService,
    HealthMonitor,
    AnalyticsManager,
    RequestManager
  };
}

// Initialize immediately
backgroundService.initialize().catch(console.error);

console.log('🎯 Phase 4 Background Service loaded successfully');
