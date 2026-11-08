import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CloudLightning, Activity, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { backend, SystemState } from './MockBackend';
import GlobalTopologyCanvas from './GlobalTopologyCanvas';

export default function App() {
  const [sysState, setSysState] = useState<SystemState>(SystemState.IDLE);
  const [metrics, setMetrics] = useState({ rpo: '0.0s', rto: '--', sync: 100 });
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    // Subscribe to simulated WebSocket telemetry
    const unsubscribeState = backend.onStateChange(setSysState);
    const unsubscribeMetrics = backend.onMetricsUpdate(setMetrics);

    return () => {
      unsubscribeState();
      unsubscribeMetrics();
    };
  }, []);

  const handleHoldStart = () => setIsHolding(true);
  const handleHoldEnd = () => setIsHolding(false);

  return (
    <div className="min-h-screen bg-[#05070B] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative selection:bg-[#00F0FF]/30">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] transition-colors duration-1000 opacity-15"
          style={{
            backgroundColor: sysState === SystemState.SECURED ? '#00FF9D' : sysState === SystemState.IDLE ? '#00F0FF' : '#FFB800'
          }}
        />
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] transition-colors duration-1000 opacity-10"
          style={{
            backgroundColor: sysState === SystemState.SECURED ? '#00FF9D' : sysState === SystemState.IDLE ? '#3B82F6' : '#FF3B30'
          }}
        />
      </div>

      <header className="mb-6 text-center z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-[#00F0FF]" />
          <h1 className="text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
            AetherVault
          </h1>
        </div>
        <p className="text-gray-400 text-xs tracking-[0.25em] uppercase font-mono">
          Aegis Core Labs • Cloud Disaster Recovery Command Center
        </p>
      </header>

      {/* Main Interactive Container */}
      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* Phase 2: 3D Global Topology Canvas (Three.js / React Three Fiber) */}
        <GlobalTopologyCanvas status={sysState} />

        {/* Glassmorphic Telemetry Grid */}
        <motion.div 
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-[2rem] border border-white/10 bg-[#121826]/40 backdrop-blur-3xl shadow-2xl"
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
          <div className="col-span-1 md:col-span-3 mt-6 flex flex-col items-center justify-center py-10 border-t border-white/5 relative overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              {sysState === SystemState.IDLE ? (
                <div className="flex flex-col items-center">
                  <motion.button
                    key="trigger"
                    onMouseDown={handleHoldStart}
                    onMouseUp={handleHoldEnd}
                    onMouseLeave={handleHoldEnd}
                    onTouchStart={handleHoldStart}
                    onTouchEnd={handleHoldEnd}
                    whileTap={{ scale: 0.96 }}
                    className="relative group flex items-center justify-center w-72 h-16 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#00F0FF]/50 transition-colors shadow-lg overflow-hidden cursor-pointer"
                  >
                    <span className="relative z-10 text-xs font-mono tracking-widest text-[#00F0FF] font-semibold uppercase group-hover:text-white transition-colors">
                      {isHolding ? 'HOLD TO INITIATE FAILOVER' : '1-CLICK FAILOVER'}
                    </span>
                    
                    {/* Hold Progress Ring Fill */}
                    {isHolding && (
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2, ease: "linear" }}
                        onAnimationComplete={() => {
                          backend.triggerFailover('us-east-1', 'us-central1');
                          setIsHolding(false);
                        }}
                        className="absolute left-0 top-0 h-full bg-[#00F0FF]/20 backdrop-blur-sm"
                      />
                    )}
                  </motion.button>
                  <p className="text-[11px] font-mono text-zinc-500 mt-3 tracking-wider">
                    {isHolding ? 'Hold until complete to confirm trigger...' : 'Press and hold for 1.2s to prevent accidental execution'}
                  </p>
                </div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  {sysState === SystemState.SECURED ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center text-[#00FF9D]"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(0,255,157,0.3)]">
                        <CheckCircle className="w-8 h-8 text-[#00FF9D]" />
                      </div>
                      <p className="text-xl font-mono tracking-widest uppercase font-semibold">TARGET SECURED</p>
                      <p className="text-xs text-zinc-400 font-mono mt-1">Traffic 100% Routed to us-central1 (GCP)</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative flex items-center justify-center mb-5">
                        <div className="w-16 h-16 border-4 border-t-[#FFB800] border-r-transparent border-b-transparent border-l-[#FFB800]/30 rounded-full animate-spin" />
                        <div className="absolute w-12 h-12 border-4 border-t-transparent border-r-[#00F0FF] border-b-[#00F0FF]/30 border-l-transparent rounded-full animate-[spin_1.5s_reverse_infinite]" />
                        <AlertTriangle className="w-5 h-5 text-[#FFB800]" />
                      </div>
                      <p className="text-sm font-mono text-[#FFB800] animate-pulse tracking-widest uppercase font-semibold">
                        {sysState.replace(/_/g, ' ')}...
                      </p>
                      <p className="text-xs text-gray-500 mt-2 font-mono">ESTIMATED RTO ELAPSED: {metrics.rto}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: React.ReactNode }) {
  return (
    <motion.div 
      layout
      className="flex flex-col items-start p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-2xl border border-white/5"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">{label}</span>
      </div>
      <span className={`text-3xl font-mono font-medium tracking-tight ${color}`}>
        {value}
      </span>
    </motion.div>
  );
}
