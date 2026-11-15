export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  HTTP = 'HTTP',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
};

function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return `${date} ${time}`;
}

export class Logger {
  private static formatMessage(level: LogLevel, message: string, color: string, meta?: any): string {
    const timestamp = `${colors.dim}[${formatTimestamp()}]${colors.reset}`;
    const badge = `${color}[${level}]${colors.reset}`;
    let output = `${timestamp} ${badge} ${message}`;

    if (meta !== undefined) {
      if (meta instanceof Error) {
        output += `\n${colors.red}${meta.stack || meta.message}${colors.reset}`;
      } else if (typeof meta === 'object') {
        try {
          output += ` ${colors.dim}${JSON.stringify(meta)}${colors.reset}`;
        } catch (_) {
          output += ` ${meta}`;
        }
      } else {
        output += ` ${meta}`;
      }
    }

    return output;
  }

  static info(message: string, meta?: any) {
    console.log(this.formatMessage(LogLevel.INFO, message, colors.cyan, meta));
  }

  static success(message: string, meta?: any) {
    console.log(this.formatMessage(LogLevel.INFO, message, colors.green, meta));
  }

  static http(method: string, path: string, statusCode: number, durationMs: number) {
    let statusColor = colors.green;
    if (statusCode >= 500) statusColor = colors.red;
    else if (statusCode >= 400) statusColor = colors.yellow;
    else if (statusCode >= 300) statusColor = colors.cyan;

    const formattedMethod = `${colors.bright}${colors.blue}${method.padEnd(6)}${colors.reset}`;
    const formattedStatus = `${statusColor}${statusCode}${colors.reset}`;
    const formattedDuration = `${colors.dim}${durationMs.toFixed(1)}ms${colors.reset}`;

    const timestamp = `${colors.dim}[${formatTimestamp()}]${colors.reset}`;
    const badge = `${colors.magenta}[HTTP]${colors.reset}`;
    console.log(`${timestamp} ${badge} ${formattedMethod} ${path} ${formattedStatus} - ${formattedDuration}`);
  }

  static warn(message: string, meta?: any) {
    console.warn(this.formatMessage(LogLevel.WARN, message, colors.yellow, meta));
  }

  static error(message: string, error?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, colors.red, error));
  }

  static debug(message: string, meta?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, colors.dim, meta));
    }
  }
}

export default Logger;
