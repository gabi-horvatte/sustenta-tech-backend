export default interface Logger {
  info(message: string, data?: Record<string, any>): void;
  error(message: string, data?: Record<string, any>): void;
  warn(message: string, data?: Record<string, any>): void;
  debug(message: string, data?: Record<string, any>): void;
}

export const logger: Logger = {
  info: (message, data) => {
    if (data) console.log(message, data);
    else console.log(message);
  },
  error: (message, data) => {
    if (data) console.error(message, data);
    else console.error(message);
  },
  warn: (message, data) => {
    if (data) console.warn(message, data);
    else console.warn(message);
  },
  debug: (message, data) => {
    if (data) console.debug(message, data);
    else console.debug(message);
  },
};
