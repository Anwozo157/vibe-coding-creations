import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CloudLightning, Activity, Server, CheckCircle, AlertTriangle } from 'lucide-react';

// ==========================================
// 1. BACKEND STATE MACHINE (Mock)
// ==========================================

export enum SystemState {
  IDLE = 'ACTIVE_SYNC',
  REPLICATING = 'QUIESCE_AND_SNAPSHOT',
  FAILOVER_TRIGGERED = 'HYDRATING_TARGET',
  REROUTING_TRAFFIC = 'DNS_CUTOVER',
  SECURED = 'TARGET_SECURED',
  DEGRADED = 'DEGRADED_STATE'
}

type StateListener = (state: SystemState) => void;
type MetricsListener = (metrics: { rpo: string, rto: string, sync: number }) => void;

class DisasterRecoveryBackend {
  private currentState: SystemState = SystemState.IDLE;
  private stateListeners: Set<StateListener> = new Set();
  private metricsListeners: Set<MetricsListener> = new Set();
  private metricsInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startTelemetryStream();
  }

  private startTelemetryStream() {
    this.metricsInterval = setInterval(() => {
      if (this.currentState === SystemState.IDLE) {
        this.emitMetrics({
          rpo: `${(Math.random() * 0.4 + 0.1).toFixed(2)}s`, // Fluctuates between 0.1s and 0.5s
          rto: '--',
          sync: 100
        });
      }
    }, 800);
  }

  public async triggerFailover(sourceRegion: string, targetRegion: string) {
    if (this.currentState !== SystemState.IDLE) return;

    this.updateState(SystemState.REPLICATING);
    
    // T+1.2s: Quiesce & Snapshot
    await this.delay(1200);
    this.updateState(SystemState.FAILOVER_TRIGGERED);
    this.emitMetrics({ rpo: '0.0s', rto: '1.2s', sync: 85 });

    // T+3.5s: Target Storage Hydration
    await this.delay(2300);
    this.emitMetrics({ rpo: '0.0s', rto: '3.5s', sync: 95 });

    // T+18.5s: Traffic Cutover (Simulated shorter for UI demo)
    this.updateState(SystemState.REROUTING_TRAFFIC);
    await this.delay(2000);
    
    this.updateState(SystemState.SECURED);
    this.emitMetrics({ rpo: '< 0.1s', rto: 'COMPLETED', sync: 100 });
  }

  public onStateChange(listener: StateListener) {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public onMetricsUpdate(listener: MetricsListener) {
    this.metricsListeners.add(listener);
    return () => this.metricsListeners.delete(listener);
  }

  private updateState(newState: SystemState) {
    this.currentState = newState;
    this.stateListeners.forEach(listener => listener(newState));
  }

  private emitMetrics(metrics: { rpo: string, rto: string, sync: number }) {
    this.metricsListeners.forEach(listener => listener(metrics));
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instantiate the singleton backend
const backend = new DisasterRecoveryBackend();

// ==========================================
// 2. FRONTEND UI COMPONENTS
// ==========================================

export default function App() {
  const [sysState, setSysState] = useState<SystemState>(SystemState.IDLE);
  const [metrics, setMetrics] = useState({ rpo: '0.0s', rto: '--', sync: 100 });
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    const unsubscribeState = backend.onStateChange(setSysState);
    const unsubscribeMetrics = backend.onMetricsUpdate(setMetrics);
    return () => {
      unsubscribeState();
      unsubscribeMetrics();
    };
  }, []);

  const handleHoldStart = () => setIsHolding(true);
  const handleHoldEnd = () => {
    setIsHolding(false);
  };

  const handleFailoverExecute = () => {
    setIsHolding(false);
    if (sysState === SystemState.IDLE) {
      backend.triggerFailover('us-east-1', 'us-central1');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center p-8 font-sans overflow-hidden relative selection:bg-[#00F0FF] selection:text-black">
      
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <motion.div 
          animate={{ 
            opacity: sysState === SystemState.IDLE ? 0.05 : 0,
            scale: sysState === SystemState.IDLE ? 1 : 1.2
          }}
          className="absolute w-[60vw] h-[60vw] bg-[#00F0FF] blur-[150px] rounded-full transition-all duration-1000" 
        />
        <motion.div 
          animate={{ 
            opacity: sysState !== SystemState.IDLE && sysState !== SystemState.SECURED ? 0.08 : 0,
            scale: sysState !== SystemState.IDLE ? 1 : 0.8
          }}
          className="absolute w-[60vw] h-[60vw] bg-[#FFB800] blur-[150px] rounded-full transition-all duration-1000" 
        />
        <motion.div 
          animate={{ 
            opacity: sysState === SystemState.SECURED ? 0.08 : 0,
          }}
          className="absolute w-[60vw] h-[60vw] bg-[#00FF9D] blur-[150px] rounded-full transition-all duration-1000" 
        />
      </div>

      <header className="mb-12 text-center z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-[#00F0FF]" />
          <h1 className="text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
            AetherVault
          </h1>
        </div>
        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">Command Center • Global Topology: Active</p>
      </header>

      {/* Glassmorphic Dashboard */}
      <motion.div 
        className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-[2rem] border border-white/10 bg-[#121826]/40 backdrop-blur-3xl shadow-2xl"
        layout
      >
        <MetricCard 
          icon={<Activity className="w-5 h-5 text-gray-400" />}
          label="RPO (Lag)" 
          value={metrics.rpo} 
          color={metrics.sync === 100 ? 'text-[#00FF9D]' : 'text-[#FFB800]'} 
        />
        <MetricCard 
          icon={<Server className="w-5 h-5 text-gray-400" />}
          label="System State" 
          value={sysState.replace(/_/g, ' ')} 
          color="text-white" 
        />
        <MetricCard 
          icon={<CloudLightning className="w-5 h-5 text-gray-400" />}
          label="Data Sync" 
          value={`${metrics.sync}%`} 
          color="text-[#00F0FF]" 
        />

        {/* Failover Interaction Zone */}
        <div className="col-span-1 md:col-span-3 mt-8 flex flex-col items-center justify-center py-12 border-t border-white/5 relative overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            {sysState === SystemState.IDLE ? (
              <motion.button
                key="trigger"
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onMouseLeave={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center justify-center w-72 h-16 rounded-full bg-gradient-to-b from-[#1c2333] to-[#0B0F17] border border-white/10 shadow-[0_0_30px_rgba(0,240,255,0.05)] hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 text-[#00F0FF] text-sm font-semibold tracking-[0.1em] uppercase">
                  {isHolding ? 'HOLD TO INITIATE' : '1-CLICK FAILOVER'}
                </span>
                
                {/* Hold Progress Ring/Fill */}
                {isHolding && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    onAnimationComplete={handleFailoverExecute}
                    className="absolute left-0 top-0 h-full bg-[#00F0FF]/20 backdrop-blur-sm"
                  />
                )}
              </motion.button>
            ) : (
              <motion.div
                key="status"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
              >
                {sysState === SystemState.SECURED ? (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="flex flex-col items-center text-[#00FF9D]"
                  >
                    <CheckCircle className="w-16 h-16 mb-4" />
                    <p className="text-xl font-mono tracking-widest uppercase shadow-[#00FF9D]">TARGET SECURED</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="absolute w-20 h-20 border-4 border-t-[#FFB800] border-r-transparent border-b-transparent border-l-[#FFB800]/30 rounded-full animate-spin" />
                      <div className="absolute w-16 h-16 border-4 border-t-transparent border-r-[#00F0FF] border-b-[#00F0FF]/30 border-l-transparent rounded-full animate-[spin_1.5s_reverse_infinite]" />
                      <AlertTriangle className="w-6 h-6 text-[#FFB800]" />
                    </div>
                    <p className="text-sm font-mono text-[#FFB800] animate-pulse tracking-widest uppercase">
                      {sysState.replace(/_/g, ' ')}...
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">ESTIMATED RTO: {metrics.rto}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({ label, value, color, icon }: { label: string, value: string | number, color: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      layout
      className="flex flex-col items-start p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-2xl border border-white/5"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className={`text-3xl font-mono font-medium tracking-tight ${color}`}>
        {value}
      </span>
    </motion.div>
  );
}