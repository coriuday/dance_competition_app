/**
 * Logger Utility
 * 
 * Centralized logging for debugging in development mode
 * Can be extended to send logs to external services in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
  }

  /**
   * Format log entry with timestamp
   */
  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      const log = this.formatLog('debug', message, data);
      console.debug(`[DEBUG] ${log.timestamp} - ${message}`, data || '');
    }
  }

  /**
   * Log info message
   */
  info(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      const log = this.formatLog('info', message, data);
      console.info(`[INFO] ${log.timestamp} - ${message}`, data || '');
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown): void {
    const log = this.formatLog('warn', message, data);
    console.warn(`[WARN] ${log.timestamp} - ${message}`, data || '');
    
    // In production, send to logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(log);
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown): void {
    const log = this.formatLog('error', message, error);
    console.error(`[ERROR] ${log.timestamp} - ${message}`, error || '');
    
    // In production, send to logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(log);
    }
  }

  /**
   * Log API error with details
   */
  apiError(endpoint: string, error: unknown, context?: Record<string, unknown>): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.error(`API Error at ${endpoint}: ${errorMessage}`, {
      endpoint,
      error,
      context,
    });
  }

  /**
   * Log query error (React-Query specific)
   */
  queryError(queryKey: string | string[], error: unknown): void {
    const key = Array.isArray(queryKey) ? queryKey.join('.') : queryKey;
    this.error(`Query Error [${key}]`, error);
  }

  /**
   * Log mutation error (React-Query specific)
   */
  mutationError(mutationKey: string, error: unknown, variables?: unknown): void {
    this.error(`Mutation Error [${mutationKey}]`, {
      error,
      variables,
    });
  }

  /**
   * Send log to external logging service (placeholder)
   * In production, implement integration with services like Sentry, LogRocket, etc.
   */
  private sendToLoggingService(log: LogEntry): void {
    // Placeholder for production logging service integration
    // Example: Sentry.captureMessage(log.message, { level: log.level, extra: log.data });
  }
}

// Export singleton instance
export const logger = new Logger();
