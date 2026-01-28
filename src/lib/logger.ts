/**
 * Client-side logger that outputs to both browser console and terminal.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *
 *   logger.info('User logged in', { userId: '123' });
 *   logger.error('Failed to fetch', error);
 *   logger.debug('Debug info', someData);
 *   logger.warn('Deprecated function called');
 *
 * With source label:
 *   const log = logger.withSource('AuthContext');
 *   log.info('Session started');  // Shows as [CLIENT:AuthContext]
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'log';

interface LoggerOptions {
  source?: string;
  sendToTerminal?: boolean;
}

const isDev = process.env.NODE_ENV === 'development';

async function sendToTerminal(level: LogLevel, args: unknown[], source?: string) {
  if (!isDev || typeof window === 'undefined') return;

  try {
    await fetch('/api/dev-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        args,
        timestamp: new Date().toISOString(),
        source,
      }),
    });
  } catch {
    // Silently fail - don't break the app if logging fails
  }
}

function createLogMethod(level: LogLevel, source?: string) {
  return (...args: unknown[]) => {
    // Always log to browser console
    const consoleFn = console[level] || console.log;
    if (source) {
      consoleFn(`[${source}]`, ...args);
    } else {
      consoleFn(...args);
    }

    // Send to terminal in development
    sendToTerminal(level, args, source);
  };
}

function createLogger(options: LoggerOptions = {}) {
  const { source } = options;

  return {
    debug: createLogMethod('debug', source),
    info: createLogMethod('info', source),
    warn: createLogMethod('warn', source),
    error: createLogMethod('error', source),
    log: createLogMethod('log', source),

    /**
     * Create a new logger instance with a source label
     * @param sourceName - Label to identify the log source (e.g., 'AuthContext', 'CartProvider')
     */
    withSource: (sourceName: string) => createLogger({ ...options, source: sourceName }),
  };
}

export const logger = createLogger();

// For quick debugging - can be removed in production builds
if (isDev && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).logger = logger;
}
