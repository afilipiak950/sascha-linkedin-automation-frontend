import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './utils/logger';
import { schedulerService } from './services/schedulerService';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basis-Route
app.get('/', (req, res) => {
  res.json({ message: 'LinkedIn Automation API' });
});

// API-Routen
// TODO: Implementiere API-Routen für:
// - Authentifizierung
// - Post-Management
// - Interaktions-Einstellungen
// - Netzwerk-Einstellungen

// Error Handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unbehandelter Fehler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server starten
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.info(`Server läuft auf Port ${PORT}`);
  
  // Scheduler initialisieren
  schedulerService.initialize();
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM Signal empfangen. Server wird heruntergefahren...');
  schedulerService.stopAll();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT Signal empfangen. Server wird heruntergefahren...');
  schedulerService.stopAll();
  process.exit(0);
}); 