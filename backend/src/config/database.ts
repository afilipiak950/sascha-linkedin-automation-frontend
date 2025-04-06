import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Interaction } from '../entities/Interaction';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'linkedin_automation',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, Post, Interaction],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export async function setupDatabase() {
  try {
    await AppDataSource.initialize();
    logger.info('Datenbankverbindung erfolgreich hergestellt');
  } catch (error) {
    logger.error('Fehler bei der Datenbankverbindung:', error);
    throw error;
  }
} 