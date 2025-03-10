import Blits from '@lightningjs/blits'

/** @typedef {'debug' | 'info' | 'warn' | 'error'} LogLevel */

const LogBus = Blits.Component('LogBus', {
  state() {
    return {}
  }
});

const logBus = new LogBus();

class LoggerService {
  /** @type {LoggerService | null} */
  static instance = null;
  
  /** @type {WebSocket | null} */
  static wsConnection = null;

  /** @type {boolean} */
  static consoleEnabled = false;

  /** @type {boolean} */
  static wsEnabled = true;
  
  static logLevels = {
    DEBUG: /** @type {LogLevel} */ ('debug'),
    INFO: /** @type {LogLevel} */ ('info'),
    WARN: /** @type {LogLevel} */ ('warn'),
    ERROR: /** @type {LogLevel} */ ('error')
  };

  constructor() {
    if (LoggerService.instance) {
      return LoggerService.instance;
    }
    this.initFromUrlParams();
    if (LoggerService.wsEnabled) {
      this.initWebSocket();
    }
    this.setupEventListeners();
    LoggerService.instance = this;
  }

  setupEventListeners() {
    // Listen for log events from components
    logBus.$on('log', ({ level, message, component, metadata }) => {
      this.log(message, level, component, metadata);
    });

    // Listen for specific log level events
    Object.values(LoggerService.logLevels).forEach(level => {
      logBus.$on(level, ({ message, component, metadata }) => {
        this.log(message, level, component, metadata);
      });
    });
  }

  initFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    LoggerService.consoleEnabled = urlParams.get('debug') === 'true';
    LoggerService.wsEnabled = urlParams.get('disableWsLogs') !== 'true';
  }

  initWebSocket() {
    try {
      const ws = new WebSocket('wss://your-logging-server');
      LoggerService.wsConnection = ws;
      
      ws.onopen = () => {
        this.log('Logger WebSocket connected', 'info', 'LoggerService');
      };

      ws.onclose = () => {
        console.warn('Logger WebSocket disconnected, attempting to reconnect...');
        setTimeout(() => this.initWebSocket(), 5000);
      };

      ws.onerror = (error) => {
        console.error('Logger WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  /**
   * @param {string} message
   * @param {LogLevel} level
   * @param {string} component
   * @param {Object} metadata
   */
  log(message, level = 'info', component = 'App', metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      metadata,
    };

    // Log to console if enabled
    if (LoggerService.consoleEnabled) {
      console[level](`[${component}] ${message}`, metadata);
    }

    // Send to WebSocket if enabled and connected
    if (LoggerService.wsEnabled) {
      const ws = LoggerService.wsConnection;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(logEntry));
      }
    }
  }

  /**
   * @param {string} message
   * @param {string} component
   * @param {Object} metadata
   */
  debug(message, component, metadata) {
    logBus.$emit('debug', { message, component, metadata });
  }

  /**
   * @param {string} message
   * @param {string} component
   * @param {Object} metadata
   */
  info(message, component, metadata) {
    logBus.$emit('info', { message, component, metadata });
  }

  /**
   * @param {string} message
   * @param {string} component
   * @param {Object} metadata
   */
  warn(message, component, metadata) {
    logBus.$emit('warn', { message, component, metadata });
  }

  /**
   * @param {string} message
   * @param {string} component
   * @param {Object} metadata
   */
  error(message, component, metadata) {
    logBus.$emit('error', { message, component, metadata });
  }
}

export const logger = new LoggerService();
