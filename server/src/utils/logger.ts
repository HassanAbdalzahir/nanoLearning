import { config } from '@/config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = config.logLevel as LogLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(message: string, meta?: unknown): string {
    const timestamp = new Date().toLocaleTimeString();
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${message}${metaString}`;
  }

  error(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`🔴 ${this.formatMessage(message, meta)}`);
    }
  }

  warn(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`🟡 ${this.formatMessage(message, meta)}`);
    }
  }

  info(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(`ℹ️  ${this.formatMessage(message, meta)}`);
    }
  }

  debug(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`🔍 ${this.formatMessage(message, meta)}`);
    }
  }
}

export const logger = new Logger();
