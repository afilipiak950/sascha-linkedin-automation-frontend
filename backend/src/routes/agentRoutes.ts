import { Router } from 'express';
import { AgentController } from '../controllers/AgentController';

const router = Router();
const agentController = new AgentController();

// Content-Strategie Endpunkte
router.post(
  '/content-strategy',
  agentController.generateContentStrategy.bind(agentController)
);

// Engagement-Analyse Endpunkte
router.post(
  '/engagement-analysis',
  agentController.analyzeEngagement.bind(agentController)
);

// Netzwerk-Wachstum Endpunkte
router.post(
  '/network-growth',
  agentController.analyzeNetworkGrowth.bind(agentController)
);

// Vollständiger Bericht Endpunkt
router.post(
  '/full-report',
  agentController.generateFullReport.bind(agentController)
);

export default router; 