import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { DisasterRecoveryBackend, SystemState } from './MockBackend';

// Mock the backend singleton for isolated testing
jest.mock('./MockBackend', () => {
  return {
    DisasterRecoveryBackend: jest.fn().mockImplementation(() => ({
      onStateChange: jest.fn((_cb) => () => {}),
      onMetricsUpdate: jest.fn((_cb) => () => {}),
      triggerFailover: jest.fn(),
    })),
    backend: {
      onStateChange: jest.fn((_cb) => () => {}),
      onMetricsUpdate: jest.fn((_cb) => () => {}),
      triggerFailover: jest.fn(),
    }
  };
});

describe('AetherVault Command Center - Chaos & Resilience Suite', () => {
  let mockTriggerFailover: jest.Mock;

  beforeEach(() => {
    mockTriggerFailover = jest.fn();
    (DisasterRecoveryBackend as jest.Mock).mockImplementation(() => ({
      onStateChange: jest.fn((cb) => {
        // Expose callback to simulate state transitions in tests
        (global as any).simulateStateChange = cb; 
        return () => {};
      }),
      onMetricsUpdate: jest.fn((_cb) => () => {}),
      triggerFailover: mockTriggerFailover,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('prevents accidental failover on quick clicks (requires hold)', async () => {
    render(<App />);
    const failoverButton = screen.getByText('1-CLICK FAILOVER');
    
    // Simulate a quick click rather than a hold
    fireEvent.mouseDown(failoverButton);
    fireEvent.mouseUp(failoverButton);

    // Failover should not be triggered instantly
    expect(mockTriggerFailover).not.toHaveBeenCalled();
  });

  test('progresses through strict state machine phases upon validation', async () => {
    render(<App />);
    
    // Simulate system receiving state changes from the Temporal.io orchestrator
    const triggerState = (global as any).simulateStateChange;
    
    triggerState(SystemState.REPLICATING);
    expect(await screen.findByText(/QUIESCE/i)).toBeInTheDocument();

    triggerState(SystemState.REROUTING_TRAFFIC);
    expect(await screen.findByText(/DNS CUTOVER/i)).toBeInTheDocument();

    triggerState(SystemState.SECURED);
    expect(await screen.findByText(/TARGET SECURED/i)).toBeInTheDocument();
  });

  test('UI remains resilient and does not crash during missing telemetry data', async () => {
    // Inject chaos: render UI, but do not provide any initial metric callbacks
    const { container } = render(<App />);
    
    // Ensure the fallback/default states render safely without throwing undefined errors
    expect(screen.getByText('RPO (Lag)')).toBeInTheDocument();
    expect(container).toBeVisible();
  });
});
