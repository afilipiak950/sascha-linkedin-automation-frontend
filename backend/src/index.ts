import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { setupDatabase } from './config/database';
import { setupLogger } from './utils/logger';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import interactionRoutes from './routes/interactions';
import { errorHandler } from './middleware/errorHandler';

// Umgebungsvariablen laden
dotenv.config();

const app = express();
const logger = setupLogger();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/interactions', interactionRoutes);

// Fehlerbehandlung
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Datenbankverbindung herstellen
    await setupDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server läuft auf Port ${PORT}`);
    });
  } catch (error) {
    logger.error('Serverstart fehlgeschlagen:', error);
    process.exit(1);
  }
}

startServer(); 