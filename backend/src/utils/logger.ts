import winston from 'winston';
import { config } from '../config';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export const logger = winston.createLogger({
  levels: logLevels,
  level: config.logging.level || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
}); 