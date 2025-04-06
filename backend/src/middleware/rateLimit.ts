import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  keyPrefix?: string;
}) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: options.keyPrefix || 'rate-limit:',
    }),
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 Minuten
    max: options.max || 100, // Limit pro IP
    message: {
      error: 'Zu viele Anfragen, bitte versuchen Sie es später erneut.',
    },
    handler: (req, res) => {
      logger.warn(`Rate limit überschritten für IP: ${req.ip}`);
      res.status(429).json({
        error: 'Zu viele Anfragen, bitte versuchen Sie es später erneut.',
      });
    },
  });
};

// Spezifische Rate Limiter für verschiedene Endpunkte
export const contentStrategyLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 50,
  keyPrefix: 'content-strategy:',
});

export const engagementAnalysisLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000, // 30 Minuten
  max: 100,
  keyPrefix: 'engagement-analysis:',
});

export const networkGrowthLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 Stunde
  max: 30,
  keyPrefix: 'network-growth:',
}); 