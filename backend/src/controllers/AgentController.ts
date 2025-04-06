import { Request, Response } from 'express';
import { AgentService } from '../services/AgentService';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();
const agentService = new AgentService();

export class AgentController {
  /**
   * Generiert eine Content-Strategie basierend auf Keywords
   */
  async generateContentStrategy(req: Request, res: Response) {
    try {
      const { keywords } = req.body;
      
      if (!keywords || !Array.isArray(keywords)) {
        return res.status(400).json({ 
          error: 'Keywords müssen als Array übergeben werden' 
        });
      }

      const result = await agentService.generateContentStrategy(keywords);
      return res.json(result);
    } catch (error) {
      logger.error('Fehler im Content-Strategie-Endpunkt:', error);
      return res.status(500).json({ 
        error: 'Interner Server-Fehler bei der Content-Strategie-Generierung' 
      });
    }
  }

  /**
   * Analysiert die Performance von LinkedIn-Posts
   */
  async analyzeEngagement(req: Request, res: Response) {
    try {
      const { postData } = req.body;
      
      if (!postData) {
        return res.status(400).json({ 
          error: 'Post-Daten müssen übergeben werden' 
        });
      }

      const result = await agentService.analyzeEngagement(postData);
      return res.json(result);
    } catch (error) {
      logger.error('Fehler im Engagement-Analyse-Endpunkt:', error);
      return res.status(500).json({ 
        error: 'Interner Server-Fehler bei der Engagement-Analyse' 
      });
    }
  }

  /**
   * Analysiert das Netzwerk-Wachstum
   */
  async analyzeNetworkGrowth(req: Request, res: Response) {
    try {
      const { profileData } = req.body;
      
      if (!profileData) {
        return res.status(400).json({ 
          error: 'Profil-Daten müssen übergeben werden' 
        });
      }

      const result = await agentService.analyzeNetworkGrowth(profileData);
      return res.json(result);
    } catch (error) {
      logger.error('Fehler im Netzwerk-Wachstums-Endpunkt:', error);
      return res.status(500).json({ 
        error: 'Interner Server-Fehler bei der Netzwerk-Wachstumsanalyse' 
      });
    }
  }

  /**
   * Generiert einen vollständigen Analysebericht
   */
  async generateFullReport(req: Request, res: Response) {
    try {
      const { keywords, postData, profileData } = req.body;
      
      if (!keywords || !Array.isArray(keywords) || !postData || !profileData) {
        return res.status(400).json({ 
          error: 'Alle erforderlichen Daten müssen übergeben werden' 
        });
      }

      const result = await agentService.generateFullReport(
        keywords,
        postData,
        profileData
      );
      return res.json(result);
    } catch (error) {
      logger.error('Fehler im Vollständiger-Bericht-Endpunkt:', error);
      return res.status(500).json({ 
        error: 'Interner Server-Fehler bei der Berichtsgenerierung' 
      });
    }
  }
}