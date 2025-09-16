export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`

    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(logMessage, ...args)
          break
        case LogLevel.INFO:
          console.info(logMessage, ...args)
          break
        case LogLevel.WARN:
          console.warn(logMessage, ...args)
          break
        case LogLevel.ERROR:
          console.error(logMessage, ...args)
          break
      }
    }

    // In production, you might want to send logs to a service
    // like Sentry, LogRocket, or CloudWatch
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args)
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args)
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args)
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args)
  }
}

export const logger = new Logger()