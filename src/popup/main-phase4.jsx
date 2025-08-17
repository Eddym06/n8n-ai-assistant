/**
 * 🚀 n8n AI Assistant - Phase 4: Optimized Popup Component
 * Enhanced UI with analytics dashboard, onboarding, and advanced features
 * Version: 4.0.0 | Date: 2025-08-17
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Settings, Users, Bot, BarChart3, 
  Zap, Download, Upload, Slack, Github, 
  Play, Pause, RefreshCw, AlertCircle,
  ChevronRight, HelpCircle, Star, TrendingUp
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// 🎨 Component Styles
const styles = {
  container: 'w-96 h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans overflow-hidden',
  sidebar: 'w-14 bg-slate-800/50 backdrop-blur border-r border-slate-700/50 flex flex-col items-center py-4',
  content: 'flex-1 p-6 overflow-y-auto',
  tab: 'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 mb-3 cursor-pointer',
  activeTab: 'bg-blue-600 text-white shadow-lg scale-110',
  inactiveTab: 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white',
  card: 'bg-slate-800/50 rounded-xl p-4 backdrop-blur border border-slate-700/50',
  button: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200',
  metric: 'text-center p-3 bg-slate-700/30 rounded-lg',
  badge: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium'
};

// 🎯 Server Health Status Component
const ServerStatus = ({ status, onRefresh }) => {
  const getStatusColor = (health) => {
    const colors = {
      healthy: 'text-green-400 bg-green-400/10',
      error: 'text-red-400 bg-red-400/10',
      warning: 'text-yellow-400 bg-yellow-400/10'
    };
    return colors[health] || colors.warning;
  };

  return (
    <div className={`${styles.card} mb-4`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Server Status
        </h3>
        <button onClick={onRefresh} className="text-slate-400 hover:text-white">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400">Server:</span>
          <span className={`${styles.badge} ${getStatusColor(status.server)}`}>
            {status.server || 'Unknown'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Redis:</span>
          <span className={`${styles.badge} ${getStatusColor(status.redis)}`}>
            {status.redis || 'Unknown'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Uptime:</span>
          <span className="text-white">{Math.floor(status.uptime / 60)}m</span>
        </div>
      </div>
    </div>
  );
};

// 📊 Analytics Dashboard Component
const AnalyticsDashboard = ({ analytics }) => {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Requests',
      data: [12, 19, 3, 5, 2, 3, 9],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const performanceData = {
    labels: ['Cache Hits', 'Cache Misses', 'Errors'],
    datasets: [{
      data: [75, 20, 5],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">📊 Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={styles.metric}>
          <div className="text-2xl font-bold text-blue-400">{analytics?.summary?.totalRequests || 0}</div>
          <div className="text-xs text-slate-400">Total Requests</div>
        </div>
        <div className={styles.metric}>
          <div className="text-2xl font-bold text-green-400">{Math.round((analytics?.summary?.cacheHitRate || 0) * 100)}%</div>
          <div className="text-xs text-slate-400">Cache Hit Rate</div>
        </div>
        <div className={styles.metric}>
          <div className="text-2xl font-bold text-purple-400">{analytics?.summary?.activeUsers || 0}</div>
          <div className="text-xs text-slate-400">Active Users</div>
        </div>
        <div className={styles.metric}>
          <div className="text-2xl font-bold text-orange-400">{Math.round(analytics?.performance?.avgResponseTime || 0)}ms</div>
          <div className="text-xs text-slate-400">Avg Response</div>
        </div>
      </div>

      {/* Charts */}
      <div className={`${styles.card} mb-4`}>
        <h3 className="text-sm font-semibold mb-3">Request Trends</h3>
        <div className="h-32">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { display: false },
                y: { display: false }
              }
            }} 
          />
        </div>
      </div>

      <div className={`${styles.card}`}>
        <h3 className="text-sm font-semibold mb-3">Performance</h3>
        <div className="h-32 flex items-center justify-center">
          <Doughnut 
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: 'white', font: { size: 10 } }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 🎓 Onboarding Modal Component
const OnboardingModal = ({ isOpen, onClose, currentStep, setCurrentStep }) => {
  const steps = [
    {
      title: "Welcome to n8n AI Assistant v4.0!",
      content: "Experience enterprise-grade AI assistance with Redis caching, analytics, and advanced optimizations.",
      icon: <Star className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Connect Your LLM Provider",
      content: "Configure OpenAI, Anthropic, or Groq API keys in Settings to unlock multi-agent intelligence.",
      icon: <Bot className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Start Building Workflows",
      content: "Use templates, get AI suggestions, and collaborate in real-time with team members.",
      icon: <Zap className="w-8 h-8 text-green-400" />
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4 border border-slate-700"
          >
            <div className="text-center mb-6">
              {steps[currentStep].icon}
              <h2 className="text-xl font-bold mt-4 mb-2">{steps[currentStep].title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{steps[currentStep].content}</p>
            </div>
            
            <div className="flex justify-center mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentStep ? 'bg-blue-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`px-4 py-2 rounded-lg ${
                  currentStep === 0 
                    ? 'text-slate-500 cursor-not-allowed' 
                    : 'text-white bg-slate-700 hover:bg-slate-600'
                }`}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🎮 Quick Actions Component
const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 'template', label: 'Apply Template', icon: <Download className="w-4 h-4" />, color: 'bg-green-600' },
    { id: 'simulate', label: 'Run Simulation', icon: <Play className="w-4 h-4" />, color: 'bg-blue-600' },
    { id: 'collaborate', label: 'Start Collab', icon: <Users className="w-4 h-4" />, color: 'bg-purple-600' },
    { id: 'backup', label: 'Export Backup', icon: <Upload className="w-4 h-4" />, color: 'bg-orange-600' }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-300">Quick Actions</h3>
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={`w-full ${action.color} hover:opacity-80 text-white p-3 rounded-lg flex items-center transition-all duration-200 hover:scale-105`}
        >
          {action.icon}
          <span className="ml-2 font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

// 🎛️ Main Popup Component
const Phase4OptimizedPopup = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serverStatus, setServerStatus] = useState({
    server: 'healthy',
    redis: 'connected',
    uptime: 3600
  });
  const [analytics, setAnalytics] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const tabs = [
    { id: 'dashboard', icon: <Activity className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { id: 'agents', icon: <Bot className="w-5 h-5" />, label: 'Agents' },
    { id: 'collaboration', icon: <Users className="w-5 h-5" />, label: 'Collaboration' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
  ];

  // Initialize component
  useEffect(() => {
    loadServerStatus();
    loadAnalytics();
    
    // Check if first time user
    const hasSeenOnboarding = localStorage.getItem('n8n-ai-onboarding-v4');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    // Setup polling for real-time updates
    const interval = setInterval(() => {
      loadServerStatus();
      if (activeTab === 'analytics') {
        loadAnalytics();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const loadServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      setServerStatus(data);
    } catch (error) {
      console.warn('Failed to load server status:', error);
      setServerStatus({ server: 'error', redis: 'error', uptime: 0 });
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.warn('Failed to load analytics:', error);
    }
  };

  const handleQuickAction = async (actionId) => {
    const actions = {
      template: () => chrome.tabs.query({active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'applyTemplate'});
      }),
      simulate: () => chrome.tabs.query({active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'runSimulation'});
      }),
      collaborate: () => chrome.tabs.query({active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'startCollaboration'});
      }),
      backup: () => downloadBackup()
    };
    
    if (actions[actionId]) {
      actions[actionId]();
      addNotification(`${actionId} initiated successfully`, 'success');
    }
  };

  const downloadBackup = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/backup/memory');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `n8n-backup-${Date.now()}.json`;
      a.click();
    } catch (error) {
      addNotification('Backup failed', 'error');
    }
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [...prev.slice(-4), notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('n8n-ai-onboarding-v4', 'completed');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <button
                onClick={() => setShowOnboarding(true)}
                className="text-slate-400 hover:text-white"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <ServerStatus status={serverStatus} onRefresh={loadServerStatus} />
            <QuickActions onAction={handleQuickAction} />
          </div>
        );
      
      case 'analytics':
        return <AnalyticsDashboard analytics={analytics} />;
      
      case 'agents':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">🤖 AI Agents</h2>
            <div className={styles.card}>
              <h3 className="font-semibold mb-2">Multi-Agent System</h3>
              <p className="text-slate-400 text-sm mb-3">
                Three specialized agents working together for optimal workflow assistance.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  <span>Error Analysis Agent</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span>Performance Optimizer</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span>Custom Node Generator</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'collaboration':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">👥 Collaboration</h2>
            <div className={styles.card}>
              <h3 className="font-semibold mb-2">Real-time Collaboration</h3>
              <p className="text-slate-400 text-sm mb-4">
                Work together with your team in real-time on n8n workflows.
              </p>
              <button className={styles.button}>
                Start Collaboration Session
              </button>
            </div>
            <div className={styles.card}>
              <h3 className="font-semibold mb-2">Slack Integration</h3>
              <p className="text-slate-400 text-sm mb-4">
                Get notifications about workflow changes and collaboration.
              </p>
              <button className={styles.button}>
                Configure Slack
              </button>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">⚙️ Settings</h2>
            <div className={styles.card}>
              <h3 className="font-semibold mb-2">API Configuration</h3>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="OpenAI API Key"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
                <input
                  type="password"
                  placeholder="Slack Webhook URL"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
                <button className={styles.button}>Save Configuration</button>
              </div>
            </div>
            <div className={styles.card}>
              <h3 className="font-semibold mb-2">Performance</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Enable Redis Caching</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Lazy Load Templates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Offline Mode</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className={styles.sidebar}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : styles.inactiveTab}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              {tab.icon}
            </div>
          ))}
          
          {/* Version Badge */}
          <div className="mt-auto">
            <div className="text-xs text-slate-500 text-center">
              v4.0.0
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-40">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-3 rounded-lg text-sm font-medium ${
                notification.type === 'success' ? 'bg-green-600' :
                notification.type === 'error' ? 'bg-red-600' :
                'bg-blue-600'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={closeOnboarding}
        currentStep={onboardingStep}
        setCurrentStep={setOnboardingStep}
      />
    </div>
  );
};

export default Phase4OptimizedPopup;
