/**
 * Error and Exception Handler
 * Centralized error handling for the Virtual Museum application
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 50; // Keep last 50 errors
    this.listeners = [];
  }

  /**
   * Initialize error handler and attach global listeners
   */
  static init() {
    const instance = new ErrorHandler();
    
    // Handle uncaught runtime errors
    window.addEventListener('error', (event) => {
      instance.handleError('runtime', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      instance.handleError('promise', event.reason, {
        promise: event.promise
      });
    });

    // Log when page is about to unload
    window.addEventListener('beforeunload', () => {
      if (instance.errors.length > 0) {
        console.log('Virtual Museum - Session Errors:', instance.errors);
      }
    });

    return instance;
  }

  /**
   * Handle and log errors
   * @param {string} type - Error type (runtime, promise, validation, etc.)
   * @param {Error|string} error - Error object or message
   * @param {object} context - Additional context information
   */
  handleError(type, error, context = {}) {
    const errorData = {
      type,
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Store error
    this.errors.push(errorData);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console
    console.error(`[${type.toUpperCase()}]`, error, context);

    // Notify listeners
    this.listeners.forEach(listener => listener(errorData));

    // Send to error tracking service if available
    this.reportError(errorData);

    return errorData;
  }

  /**
   * Send error to remote service
   * @param {object} errorData - Formatted error data
   */
  reportError(errorData) {
    // Integrate with error tracking service (Sentry, LogRocket, etc.)
    if (window.errorReporter && typeof window.errorReporter.captureException === 'function') {
      try {
        window.errorReporter.captureException(new Error(errorData.message), {
          contexts: errorData.context
        });
      } catch (e) {
        console.warn('Failed to report error:', e);
      }
    }
  }

  /**
   * Add error listener
   * @param {function} callback - Function to call when error occurs
   */
  onError(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Get error summary
   * @returns {object} Summary of errors
   */
  getSummary() {
    const summary = {
      totalErrors: this.errors.length,
      byType: {},
      recent: this.errors.slice(-5)
    };

    this.errors.forEach(err => {
      summary.byType[err.type] = (summary.byType[err.type] || 0) + 1;
    });

    return summary;
  }

  /**
   * Clear error log
   */
  clear() {
    this.errors = [];
  }
}

// Auto-initialize error handler
const errorHandler = ErrorHandler.init();

export default errorHandler;
