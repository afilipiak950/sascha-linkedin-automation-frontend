import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  server: z.object({
    port: z.number().default(5000),
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  }),
  mongodb: z.object({
    uri: z.string().url(),
  }),
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().default('7d'),
  }),
  linkedin: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    callbackUrl: z.string().url(),
    email: z.string().email(),
    password: z.string(),
  }),
  openai: z.object({
    apiKey: z.string(),
  }),
  rateLimits: z.object({
    maxConnectionsPerDay: z.number().default(39),
    maxPostsPerWeek: z.number().default(4),
    maxInteractionsPerHour: z.number().default(20),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
});

const parseConfig = () => {
  try {
    return configSchema.parse({
      server: {
        port: Number(process.env.PORT),
        nodeEnv: process.env.NODE_ENV,
      },
      mongodb: {
        uri: process.env.MONGODB_URI,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackUrl: process.env.LINKEDIN_CALLBACK_URL,
        email: process.env.LINKEDIN_EMAIL,
        password: process.env.LINKEDIN_PASSWORD,
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
      },
      rateLimits: {
        maxConnectionsPerDay: Number(process.env.MAX_CONNECTIONS_PER_DAY),
        maxPostsPerWeek: Number(process.env.MAX_POSTS_PER_WEEK),
        maxInteractionsPerHour: Number(process.env.MAX_INTERACTIONS_PER_HOUR),
      },
      logging: {
        level: process.env.LOG_LEVEL,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Konfigurationsfehler:', error.errors);
    }
    throw new Error('Ungültige Konfiguration');
  }
};

export const config = parseConfig(); 