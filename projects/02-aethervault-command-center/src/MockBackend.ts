// ==========================================
// 1. BACKEND STATE MACHINE & TELEMETRY STREAM
// ==========================================

export enum SystemState {
  IDLE = 'ACTIVE_SYNC',
  REPLICATING = 'QUIESCE_AND_SNAPSHOT',
  FAILOVER_TRIGGERED = 'HYDRATING_TARGET',
  REROUTING_TRAFFIC = 'DNS_CUTOVER',
  SECURED = 'TARGET_SECURED',
  DEGRADED = 'DEGRADED_STATE'
}

export type StateListener = (state: SystemState) => void;
export type MetricsListener = (metrics: { rpo: string; rto: string; sync: number }) => void;

export class DisasterRecoveryBackend {
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

  private emitMetrics(metrics: { rpo: string; rto: string; sync: number }) {
    this.metricsListeners.forEach(listener => listener(metrics));
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const backend = new DisasterRecoveryBackend();
