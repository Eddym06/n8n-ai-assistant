/**
 * 🧩 Premium UI Components with Radix UI
 * Modern, accessible components with stunning visuals
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn, motionVariants } from './utils.js';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Switch from '@radix-ui/react-switch';
import * as Tabs from '@radix-ui/react-tabs';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Shield, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// 🎨 Premium Button Component
export const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  disabled,
  loading,
  icon: Icon,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/25",
    warning: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25",
    outline: "border-2 border-slate-600 hover:border-blue-500 bg-transparent hover:bg-blue-500/10 text-slate-300 hover:text-blue-400",
    ghost: "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    default: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
    xl: "px-8 py-4 text-lg rounded-2xl"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      variants={motionVariants.button}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
});

// 🎯 Premium Card Component  
export const Card = ({ children, className, hover = true, glow = false, ...props }) => {
  return (
    <motion.div
      className={cn(
        "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300",
        hover && "hover:bg-white/10 hover:border-white/20",
        glow && "shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20",
        className
      )}
      variants={hover ? motionVariants.card : undefined}
      initial={hover ? "idle" : undefined}
      whileHover={hover ? "hover" : undefined}
      whileTap={hover ? "tap" : undefined}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl -z-10" />
      )}
      {children}
    </motion.div>
  );
};

// ✨ Premium Tooltip
export const TooltipProvider = ({ children }) => (
  <Tooltip.Provider delayDuration={300}>
    {children}
  </Tooltip.Provider>
);

export const PremiumTooltip = ({ children, content, side = "top" }) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      {children}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        side={side}
        className="bg-slate-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm border border-white/10 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        sideOffset={5}
      >
        {content}
        <Tooltip.Arrow className="fill-slate-900/95" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
);

// 🔀 Premium Switch
export const PremiumSwitch = ({ checked, onCheckedChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="font-medium text-white">{label}</div>
      {description && (
        <div className="text-sm text-slate-400">{description}</div>
      )}
    </div>
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors duration-200 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 shadow-inner"
    >
      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-6" />
    </Switch.Root>
  </div>
);

// 📊 Stats Card Component
export const StatsCard = ({ icon: Icon, label, value, change, changeType = "neutral", gradient }) => {
  const gradients = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    green: "from-emerald-500 to-teal-500",
    orange: "from-orange-500 to-red-500"
  };

  const changeColors = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-slate-400"
  };

  return (
    <motion.div
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden group"
      variants={motionVariants.card}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300",
        gradients[gradient] || gradients.blue
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
            gradients[gradient] || gradients.blue
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={cn("text-sm font-medium", changeColors[changeType])}>
              {changeType === "positive" ? "+" : ""}{change}
            </div>
          )}
        </div>
        
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </motion.div>
  );
};

// 🎭 Premium Badge
export const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-slate-700/50 text-slate-300 border-slate-600",
    primary: "bg-blue-600/20 text-blue-400 border-blue-500/30",
    success: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-orange-600/20 text-orange-400 border-orange-500/30",
    error: "bg-red-600/20 text-red-400 border-red-500/30"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

// 🌈 Premium Progress Bar
export const ProgressBar = ({ value = 0, max = 100, className, showValue = true }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-slate-400">Progress</div>
        {showValue && (
          <div className="text-sm font-medium text-white">{Math.round(percentage)}%</div>
        )}
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg shadow-blue-500/30"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// 🎪 Loading Spinner Component
export const LoadingSpinner = ({ size = "default", text }) => {
  const sizes = {
    sm: "w-4 h-4",
    default: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <motion.div
        className={cn("border-2 border-blue-500/30 border-t-blue-500 rounded-full", sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <span className="text-sm text-slate-400">{text}</span>}
    </div>
  );
};

// 🎯 Status Indicator
export const StatusIndicator = ({ status = "idle", children }) => {
  const statusConfig = {
    idle: { icon: AlertCircle, color: "text-slate-400", bg: "bg-slate-600" },
    loading: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-600", animate: true },
    success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-600" },
    error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-600" }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("w-2 h-2 rounded-full", config.bg)} />
      <Icon className={cn("w-4 h-4", config.color, config.animate && "animate-spin")} />
      {children}
    </div>
  );
};
