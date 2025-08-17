/**
 * 🚀 n8n AI Assistant - Premium Professional Popup
 * Ultra-modern design with Radix UI, GSAP animations, and premium aesthetics
 * Version: 5.0.0 | Date: 2025-08-17
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Activity, Settings, Bot, BarChart3, Zap, Download, Upload,
  Play, Pause, RefreshCw, AlertCircle, CheckCircle, Clock,
  TrendingUp, Users, Server, Database, Cpu, MemoryStick,
  ChevronRight, Plus, Sparkles, Mic, MicOff, Home, Layers,
  Maximize2, Minimize2, Bell, Shield, Globe, Heart,
  PieChart, LineChart, Target, Rocket, Star, Award
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Import our premium components
import { 
  Button, 
  Card, 
  PremiumTooltip, 
  TooltipProvider, 
  PremiumSwitch, 
  StatsCard, 
  Badge, 
  ProgressBar, 
  LoadingSpinner, 
  StatusIndicator 
} from './components.jsx';
import { cn, motionVariants, designTokens } from './utils.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// 🌟 Enhanced API Client with retry logic
class PremiumAPIClient {
  static baseURL = 'http://localhost:3000/api';
  static retryCount = 3;
  
  static async request(endpoint, options = {}) {
    let lastError;
    
    for (let i = 0; i < this.retryCount; i++) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          headers: { 'Content-Type': 'application/json' },
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        if (i < this.retryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }
  
  static async getHealth() { return this.request('/health'); }
  static async getAnalytics() { return this.request('/analytics'); }
  static async getTemplates() { return this.request('/templates'); }
  static async generateWorkflow(prompt) { 
    return this.request('/generate', { 
      method: 'POST', 
      body: JSON.stringify({ prompt, type: 'workflow' })
    }); 
  }
}

// 🏠 Premium Dashboard Tab
const PremiumDashboard = ({ serverHealth, analytics, onRefresh }) => {
  const containerRef = useRef();
  
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  const getHealthStatus = () => {
    if (!serverHealth) return { 
      icon: Clock, 
      color: 'warning', 
      label: 'Connecting...', 
      description: 'Establishing connection to server' 
    };
    if (serverHealth.status === 'healthy') return { 
      icon: CheckCircle, 
      color: 'success', 
      label: 'Online', 
      description: 'All systems operational' 
    };
    return { 
      icon: AlertCircle, 
      color: 'error', 
      label: 'Offline', 
      description: 'Server connection failed' 
    };
  };
  
  const { icon: HealthIcon, color, label, description } = getHealthStatus();

  return (
    <div ref={containerRef} className="space-y-6 p-2">
      {/* Hero Header */}
      <motion.div 
        className="text-center relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
        <Card className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50" glow>
          <motion.div 
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Bot className="w-10 h-10 text-white drop-shadow-lg" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-2">
            n8n AI Assistant
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="primary">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <Badge variant="success">v5.0.0</Badge>
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Server Status */}
      <Card hover glow className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Server className="w-5 h-5 mr-2 text-blue-400" />
            Server Status
          </h3>
          <TooltipProvider>
            <PremiumTooltip content="Refresh server data">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onRefresh}
                icon={RefreshCw}
                className="hover:bg-blue-600/20"
              />
            </PremiumTooltip>
          </TooltipProvider>
        </div>
        
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <StatusIndicator status={serverHealth ? 'success' : 'loading'}>
            <div>
              <div className="font-semibold text-white">{label}</div>
              <div className="text-sm text-slate-400">{description}</div>
              {serverHealth && (
                <div className="text-xs text-slate-500 mt-1">
                  Uptime: {Math.floor((serverHealth.uptime || 0) / 1000)}s | 
                  Memory: {Math.round((serverHealth.memory || 0) / 1024 / 1024)}MB
                </div>
              )}
            </div>
          </StatusIndicator>
        </div>
      </Card>

      {/* Premium Stats Grid */}
      {analytics && (
        <motion.div 
          className="grid grid-cols-2 gap-4"
          variants={motionVariants.container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={motionVariants.item}>
            <StatsCard
              icon={Activity}
              label="Total Requests"
              value={analytics.requests || 0}
              change="+12%"
              changeType="positive"
              gradient="blue"
            />
          </motion.div>
          <motion.div variants={motionVariants.item}>
            <StatsCard
              icon={Layers}
              label="Workflows"
              value={analytics.workflows || 0}
              change="+8%"
              changeType="positive"
              gradient="purple"
            />
          </motion.div>
          <motion.div variants={motionVariants.item}>
            <StatsCard
              icon={Target}
              label="Cache Hit Rate"
              value={`${Math.round(analytics.cache_hits/(analytics.cache_hits + analytics.cache_misses) * 100) || 0}%`}
              change="+3%"
              changeType="positive"
              gradient="green"
            />
          </motion.div>
          <motion.div variants={motionVariants.item}>
            <StatsCard
              icon={Cpu}
              label="Memory Usage"
              value={`${Math.round(analytics.memory?.heapUsed / 1024 / 1024) || 0}MB`}
              change="-5%"
              changeType="negative"
              gradient="orange"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Premium Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Rocket className="w-5 h-5 mr-2 text-yellow-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <Button 
            variant="primary" 
            size="lg" 
            icon={Plus}
            className="justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <span className="flex-1 text-left">Create New Workflow</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            icon={Layers}
            className="justify-start"
          >
            <span className="flex-1 text-left">Browse Templates</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            icon={Settings}
            className="justify-start"
          >
            <span className="flex-1 text-left">Open Settings</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

// 📊 Premium Analytics Tab
const PremiumAnalytics = ({ analytics }) => {
  const [timeframe, setTimeframe] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('requests');
  
  const chartData = {
    labels: ['10m', '8m', '6m', '4m', '2m', 'Now'],
    datasets: [{
      label: 'Requests',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };
  
  const memoryData = {
    labels: ['Used', 'Free'],
    datasets: [{
      data: [
        Math.round((analytics?.memory?.heapUsed || 0) / 1024 / 1024),
        Math.round(((analytics?.memory?.heapTotal || 0) - (analytics?.memory?.heapUsed || 0)) / 1024 / 1024)
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(34, 197, 94)'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'rgba(255,255,255,0.7)' }
      },
      y: { 
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'rgba(255,255,255,0.7)' }
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
          Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
          </select>
        </div>
      </div>

      {/* Performance Overview */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60" glow>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
          Performance Overview
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{analytics?.requests || 0}</div>
            <div className="text-sm text-slate-400">Total Requests</div>
            <div className="text-xs text-emerald-400 mt-1">+12% ↗</div>
          </div>
          <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{analytics?.workflows || 0}</div>
            <div className="text-sm text-slate-400">Workflows</div>
            <div className="text-xs text-emerald-400 mt-1">+8% ↗</div>
          </div>
          <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">1</div>
            <div className="text-sm text-slate-400">Active Users</div>
            <div className="text-xs text-slate-400 mt-1">Stable</div>
          </div>
        </div>
      </Card>

      {/* Request Trends Chart */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <LineChart className="w-5 h-5 mr-2 text-blue-400" />
          Request Trends
        </h3>
        <div className="h-48 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>

      {/* System Resources */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <MemoryStick className="w-5 h-5 mr-2 text-red-400" />
            Memory Usage
          </h3>
          <div className="h-32 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex items-center justify-center">
            <Doughnut 
              data={memoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: 'white',
                    bodyColor: 'white'
                  }
                }
              }}
            />
          </div>
          <div className="text-center text-sm text-slate-400 mt-3">
            {Math.round((analytics?.memory?.heapUsed || 0) / 1024 / 1024)}MB / {Math.round((analytics?.memory?.heapTotal || 0) / 1024 / 1024)}MB
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-emerald-400" />
            Cache Performance
          </h3>
          <div className="space-y-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Hit Rate</span>
              <span className="text-emerald-400 font-semibold">{Math.round(analytics?.cache_hits/(analytics?.cache_hits + analytics?.cache_misses) * 100) || 0}%</span>
            </div>
            <ProgressBar 
              value={Math.round(analytics?.cache_hits/(analytics?.cache_hits + analytics?.cache_misses) * 100) || 0} 
              showValue={false}
            />
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Hits</span>
              <span className="text-white">{analytics?.cache_hits || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Cache Size</span>
              <span className="text-white">{analytics?.cache_size || 0} items</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

// 🤖 Premium AI Generator Tab
const PremiumAIGenerator = ({ onGenerateWorkflow, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);

  const templates = [
    { id: 'email', name: '📧 Email Automation', description: 'Automated email workflows', gradient: 'blue' },
    { id: 'data', name: '📊 Data Processing', description: 'ETL and data transformation', gradient: 'purple' },
    { id: 'api', name: '🔗 API Integration', description: 'Connect multiple services', gradient: 'green' },
    { id: 'notification', name: '🔔 Notifications', description: 'Alert and notification systems', gradient: 'orange' }
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      const workflow = await onGenerateWorkflow(prompt);
      setGeneratedWorkflow(workflow);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.div 
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25"
          animate={{ 
            rotate: isGenerating ? 360 : 0,
            scale: isGenerating ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" },
            scale: { duration: 2, repeat: isGenerating ? Infinity : 0 }
          }}
        >
          <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
        </motion.div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
          AI Workflow Generator
        </h2>
        <p className="text-slate-400 text-sm">Describe your automation idea and watch magic happen</p>
      </div>

      {/* Template Quick Selection */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-purple-400" />
          Quick Templates
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template, index) => (
            <motion.button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template.id);
                setPrompt(`Create a ${template.name.replace(/📧|📊|🔗|🔔/g, '').trim()} workflow`);
              }}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group",
                selectedTemplate === template.id 
                  ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/25' 
                  : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50'
              )}
              variants={motionVariants.button}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              custom={index}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10">
                <div className="font-semibold text-white text-sm mb-1">{template.name}</div>
                <div className="text-xs text-slate-400">{template.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Enhanced Input Section */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Workflow Description</h3>
          <TooltipProvider>
            <PremiumTooltip content={isListening ? "Stop voice input" : "Start voice input"}>
              <Button
                variant={isListening ? "warning" : "outline"}
                size="sm"
                onClick={handleVoiceInput}
                icon={isListening ? MicOff : Mic}
                className={isListening ? "animate-pulse" : ""}
              />
            </PremiumTooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the workflow you want to create... (e.g., 'Send a Slack message when a new email arrives from VIP customers')"
            className="w-full h-32 bg-slate-900/50 border-2 border-slate-700/50 focus:border-blue-500/50 rounded-xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all"
            disabled={isGenerating}
          />
          
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            loading={isGenerating}
            size="lg"
            variant="success"
            className="w-full"
            icon={!isGenerating ? Play : undefined}
          >
            {isGenerating ? 'Generating Workflow...' : 'Generate AI Workflow'}
          </Button>
        </div>
      </Card>

      {/* Generated Workflow Preview */}
      <AnimatePresence>
        {generatedWorkflow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30" glow>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                Generated Workflow
                <Badge variant="success" className="ml-2">New</Badge>
              </h3>
              <div className="bg-slate-900/70 rounded-xl p-4 mb-4 border border-slate-700/50">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {JSON.stringify(generatedWorkflow, null, 2)}
                </pre>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="success"
                  size="default"
                  icon={Download}
                  className="flex-1"
                >
                  Export Workflow
                </Button>
                <Button 
                  variant="primary"
                  size="default"
                  icon={Play}
                  className="flex-1"
                >
                  Deploy Now
                </Button>
                <Button 
                  variant="outline"
                  size="default"
                  icon={Settings}
                >
                  Configure
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ⚙️ Premium Settings Tab
const PremiumSettings = () => {
  const [serverUrl, setServerUrl] = useState('http://localhost:3000');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  return (
    <motion.div 
      className="space-y-6 p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Settings className="w-6 h-6 mr-2 text-slate-400" />
        Settings & Preferences
      </h2>

      {/* Server Configuration */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-blue-400" />
          Server Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Server URL</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="w-full bg-slate-900/50 border-2 border-slate-700/50 focus:border-blue-500/50 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all"
              placeholder="http://localhost:3000"
            />
          </div>
          <Button 
            variant="outline"
            size="default"
            icon={Globe}
            className="w-full"
          >
            Test Connection
          </Button>
        </div>
      </Card>

      {/* User Preferences */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-pink-400" />
          User Preferences
        </h3>
        <div className="space-y-6">
          <PremiumSwitch
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
            label="Auto Refresh"
            description="Automatically refresh data every 30 seconds"
          />
          <PremiumSwitch
            checked={notifications}
            onCheckedChange={setNotifications}
            label="Push Notifications"
            description="Receive notifications for important events"
          />
          <PremiumSwitch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            label="Dark Mode"
            description="Use dark theme (recommended)"
          />
          <PremiumSwitch
            checked={soundEffects}
            onCheckedChange={setSoundEffects}
            label="Sound Effects"
            description="Play sounds for actions and notifications"
          />
        </div>
      </Card>

      {/* System Information */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-400" />
          About n8n AI Assistant
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Version</span>
            <Badge variant="primary">5.0.0 Premium</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Build</span>
            <span className="text-white font-mono">2025.08.17</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">License</span>
            <Badge variant="success">Professional</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Last Updated</span>
            <span className="text-white">Today</span>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="default" className="border-purple-500/50 hover:bg-purple-500/10">
            Documentation
          </Button>
          <Button variant="outline" size="default" className="border-purple-500/50 hover:bg-purple-500/10">
            Support
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

// 🎯 Main Premium Popup Component
const PremiumPopup = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serverHealth, setServerHealth] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Fetch server data with enhanced error handling
  const fetchServerData = async () => {
    try {
      setConnectionStatus('connecting');
      const [healthData, analyticsData] = await Promise.all([
        PremiumAPIClient.getHealth().catch(() => null),
        PremiumAPIClient.getAnalytics().catch(() => null)
      ]);
      
      setServerHealth(healthData);
      setAnalytics(analyticsData);
      setConnectionStatus(healthData ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Failed to fetch server data:', error);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate workflow with loading states
  const handleGenerateWorkflow = async (prompt) => {
    setIsGenerating(true);
    try {
      const workflow = await PremiumAPIClient.generateWorkflow(prompt);
      return workflow;
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize and setup auto-refresh
  useEffect(() => {
    fetchServerData();
    const interval = setInterval(fetchServerData, 30000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: 'blue' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'purple' },
    { id: 'ai', icon: Bot, label: 'AI Generator', color: 'emerald' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'slate' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PremiumDashboard serverHealth={serverHealth} analytics={analytics} onRefresh={fetchServerData} />;
      case 'analytics':
        return <PremiumAnalytics analytics={analytics} />;
      case 'ai':
        return <PremiumAIGenerator onGenerateWorkflow={handleGenerateWorkflow} isGenerating={isGenerating} />;
      case 'settings':
        return <PremiumSettings />;
      default:
        return <PremiumDashboard serverHealth={serverHealth} analytics={analytics} onRefresh={fetchServerData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-[420px] h-[640px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <Bot className="w-8 h-8 text-white" />
          </motion.div>
          <LoadingSpinner size="lg" text="Loading Premium Experience..." />
          <p className="text-slate-400 text-sm mt-4">Initializing AI Assistant...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-[420px] h-[640px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        {/* Enhanced Sidebar */}
        <div className="w-20 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 relative z-10">
          {/* Connection Status Indicator */}
          <div className="mb-6">
            <TooltipProvider>
              <PremiumTooltip content={`Server: ${connectionStatus}`}>
                <div className={cn(
                  "w-3 h-3 rounded-full transition-colors duration-300",
                  connectionStatus === 'connected' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                  connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400 shadow-lg shadow-red-400/50'
                )} />
              </PremiumTooltip>
            </TooltipProvider>
          </div>

          {/* Navigation Tabs */}
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <TooltipProvider key={tab.id}>
                <PremiumTooltip content={tab.label} side="right">
                  <motion.button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 overflow-hidden",
                      isActive
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/10 bg-white/5'
                    )}
                    variants={motionVariants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl"
                        layoutId="activeTab"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                    <Icon className="w-6 h-6 relative z-10" />
                    {isActive && (
                      <motion.div
                        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </PremiumTooltip>
              </TooltipProvider>
            );
          })}
        </div>

        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PremiumPopup;
