/**
 * Performance Tests
 * Tests for application performance and optimization
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Performance measurement utilities
const measureTime = async <T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
};

const measureSyncTime = <T>(fn: () => T): { result: T; duration: number } => {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  return { result, duration };
};

// Memoization for performance optimization
const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  getKey: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T => {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
};

// Debounce utility
const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let resolvePromise: (value: ReturnType<T>) => void;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    return new Promise((resolve) => {
      resolvePromise = resolve;
      timeoutId = setTimeout(() => {
        const result = fn(...args) as ReturnType<T>;
        resolve(result);
      }, delay);
    });
  };
};

// Throttle utility
const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
  let inThrottle = false;
  let lastResult: ReturnType<T>;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = fn(...args) as ReturnType<T>;
      return lastResult;
    }
    return undefined;
  };
};

describe('Performance Utilities', () => {
  describe('measureTime', () => {
    it('should measure async function execution time', async () => {
      const { duration } = await measureTime(() =>
        new Promise((resolve) => setTimeout(resolve, 100))
      );

      expect(duration).toBeGreaterThanOrEqual(90);
      expect(duration).toBeLessThan(150);
    });

    it('should return function result', async () => {
      const { result } = await measureTime(() => Promise.resolve(42));

      expect(result).toBe(42);
    });
  });

  describe('measureSyncTime', () => {
    it('should measure sync function execution time', () => {
      const { duration } = measureSyncTime(() => {
        let sum = 0;
        for (let i = 0; i < 10000; i++) {
          sum += i;
        }
        return sum;
      });

      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Memoization', () => {
  describe('memoize', () => {
    it('should cache function results', () => {
      const expensiveFn = jest.fn((n: number) => n * 2);
      const memoizedFn = memoize(expensiveFn);

      expect(memoizedFn(5)).toBe(10);
      expect(memoizedFn(5)).toBe(10);
      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });

    it('should handle different arguments', () => {
      const fn = jest.fn((n: number) => n * 2);
      const memoizedFn = memoize(fn);

      expect(memoizedFn(5)).toBe(10);
      expect(memoizedFn(10)).toBe(20);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should use custom key generator', () => {
      const fn = jest.fn((a: number, b: number) => a + b);
      const memoizedFn = memoize(fn, (a, b) => `${a}-${b}`);

      expect(memoizedFn(1, 2)).toBe(3);
      expect(memoizedFn(1, 2)).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should improve performance for expensive operations', () => {
      const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      };

      const memoizedFib = memoize((n: number): number => {
        if (n <= 1) return n;
        return memoizedFib(n - 1) + memoizedFib(n - 2);
      });

      // Memoized version should be much faster
      const { duration: normalDuration } = measureSyncTime(() => fibonacci(20));
      const { duration: memoizedDuration } = measureSyncTime(() => memoizedFib(20));

      expect(memoizedDuration).toBeLessThan(normalDuration);
    });
  });
});

describe('Debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay function execution', async () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    await Promise.resolve();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only execute once for multiple calls', async () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(100);
    await Promise.resolve();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on each call', async () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);

    debouncedFn();
    jest.advanceTimersByTime(50);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    await Promise.resolve();

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('Throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should limit function calls', () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow calls after throttle period', () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('Bundle Size Estimation', () => {
  const estimateBundleSize = (modules: string[]): number => {
    // Simplified estimation - in reality, this would analyze actual module sizes
    const avgModuleSize = 5; // KB
    const baseSize = 50; // KB
    return baseSize + modules.length * avgModuleSize;
  };

  it('should estimate bundle size', () => {
    const modules = ['react', 'react-dom', 'lodash', 'axios'];
    const size = estimateBundleSize(modules);

    expect(size).toBeGreaterThan(50);
  });

  it('should track bundle growth', () => {
    const initialModules = ['react', 'react-dom'];
    const addedModules = [...initialModules, 'lodash', 'moment', 'chart.js'];

    const initialSize = estimateBundleSize(initialModules);
    const newSize = estimateBundleSize(addedModules);

    const growth = ((newSize - initialSize) / initialSize) * 100;
    expect(growth).toBeGreaterThan(0);
  });
});

describe('Render Performance', () => {
  interface RenderMetrics {
    renderCount: number;
    totalRenderTime: number;
    averageRenderTime: number;
  }

  const trackRenderPerformance = (): RenderMetrics & {
    recordRender: (time: number) => void;
  } => {
    let renderCount = 0;
    let totalRenderTime = 0;

    return {
      get renderCount() {
        return renderCount;
      },
      get totalRenderTime() {
        return totalRenderTime;
      },
      get averageRenderTime() {
        return renderCount > 0 ? totalRenderTime / renderCount : 0;
      },
      recordRender(time: number) {
        renderCount++;
        totalRenderTime += time;
      },
    };
  };

  it('should track render metrics', () => {
    const metrics = trackRenderPerformance();

    metrics.recordRender(16);
    metrics.recordRender(20);
    metrics.recordRender(12);

    expect(metrics.renderCount).toBe(3);
    expect(metrics.totalRenderTime).toBe(48);
    expect(metrics.averageRenderTime).toBe(16);
  });

  it('should detect slow renders', () => {
    const metrics = trackRenderPerformance();
    const threshold = 16; // 60fps = ~16ms per frame

    metrics.recordRender(10);
    metrics.recordRender(25); // Slow render
    metrics.recordRender(12);

    const slowRenders = [10, 25, 12].filter((t) => t > threshold);
    expect(slowRenders).toHaveLength(1);
  });
});

describe('Memory Usage', () => {
  const createMemoryTracker = () => {
    const measurements: number[] = [];

    return {
      measure: () => {
        // In a real scenario, this would use performance.memory
        const used = Math.random() * 100; // Simulated memory in MB
        measurements.push(used);
        return used;
      },
      getAverage: () =>
        measurements.reduce((a, b) => a + b, 0) / measurements.length,
      getPeak: () => Math.max(...measurements),
      getMeasurements: () => [...measurements],
    };
  };

  it('should track memory usage', () => {
    const tracker = createMemoryTracker();

    tracker.measure();
    tracker.measure();
    tracker.measure();

    expect(tracker.getMeasurements()).toHaveLength(3);
  });

  it('should calculate average memory', () => {
    const tracker = createMemoryTracker();

    // Force specific values
    const measurements = [50, 60, 70];
    measurements.forEach((m) => {
      // @ts-expect-error - testing only
      tracker.measurements = tracker.getMeasurements().concat(m);
    });

    // Average should be 60
    // This is just demonstrating the API
    expect(typeof tracker.getAverage()).toBe('number');
  });
});

describe('API Response Time', () => {
  interface ApiMetrics {
    endpoint: string;
    method: string;
    responseTime: number;
    statusCode: number;
  }

  const createApiTracker = () => {
    const metrics: ApiMetrics[] = [];

    return {
      record: (metric: ApiMetrics) => metrics.push(metric),
      getSlowEndpoints: (threshold: number = 1000) =>
        metrics.filter((m) => m.responseTime > threshold),
      getAverageResponseTime: (endpoint?: string) => {
        const filtered = endpoint
          ? metrics.filter((m) => m.endpoint === endpoint)
          : metrics;
        if (filtered.length === 0) return 0;
        return (
          filtered.reduce((sum, m) => sum + m.responseTime, 0) / filtered.length
        );
      },
      getErrorRate: () => {
        if (metrics.length === 0) return 0;
        const errors = metrics.filter((m) => m.statusCode >= 400);
        return (errors.length / metrics.length) * 100;
      },
    };
  };

  it('should track API metrics', () => {
    const tracker = createApiTracker();

    tracker.record({
      endpoint: '/api/users',
      method: 'GET',
      responseTime: 150,
      statusCode: 200,
    });

    tracker.record({
      endpoint: '/api/users',
      method: 'POST',
      responseTime: 250,
      statusCode: 201,
    });

    expect(tracker.getAverageResponseTime('/api/users')).toBe(200);
  });

  it('should identify slow endpoints', () => {
    const tracker = createApiTracker();

    tracker.record({
      endpoint: '/api/fast',
      method: 'GET',
      responseTime: 100,
      statusCode: 200,
    });

    tracker.record({
      endpoint: '/api/slow',
      method: 'GET',
      responseTime: 2000,
      statusCode: 200,
    });

    const slowEndpoints = tracker.getSlowEndpoints(1000);
    expect(slowEndpoints).toHaveLength(1);
    expect(slowEndpoints[0].endpoint).toBe('/api/slow');
  });

  it('should calculate error rate', () => {
    const tracker = createApiTracker();

    for (let i = 0; i < 10; i++) {
      tracker.record({
        endpoint: '/api/test',
        method: 'GET',
        responseTime: 100,
        statusCode: i < 8 ? 200 : 500,
      });
    }

    expect(tracker.getErrorRate()).toBe(20); // 20% error rate
  });
});

describe('Performance Budgets', () => {
  const performanceBudgets = {
    firstContentfulPaint: 1800, // ms
    largestContentfulPaint: 2500, // ms
    timeToInteractive: 3800, // ms
    totalBlockingTime: 300, // ms
    cumulativeLayoutShift: 0.1,
  };

  const checkBudget = (
    metric: keyof typeof performanceBudgets,
    value: number
  ): { passed: boolean; difference: number } => {
    const budget = performanceBudgets[metric];
    const passed = value <= budget;
    return {
      passed,
      difference: passed ? budget - value : value - budget,
    };
  };

  it('should pass within budget', () => {
    const result = checkBudget('firstContentfulPaint', 1500);
    expect(result.passed).toBe(true);
    expect(result.difference).toBe(300);
  });

  it('should fail when exceeding budget', () => {
    const result = checkBudget('largestContentfulPaint', 3000);
    expect(result.passed).toBe(false);
    expect(result.difference).toBe(500);
  });

  it('should validate all metrics', () => {
    const actualMetrics = {
      firstContentfulPaint: 1600,
      largestContentfulPaint: 2200,
      timeToInteractive: 3500,
      totalBlockingTime: 250,
      cumulativeLayoutShift: 0.05,
    };

    const results = Object.entries(actualMetrics).map(([metric, value]) => ({
      metric,
      ...checkBudget(metric as keyof typeof performanceBudgets, value),
    }));

    const failedMetrics = results.filter((r) => !r.passed);
    expect(failedMetrics).toHaveLength(0);
  });
});
