import { ContentStrategyAgent } from './agents/ContentStrategyAgent';
import { EngagementAnalysisAgent } from './agents/EngagementAnalysisAgent';
import { NetworkGrowthAgent } from './agents/NetworkGrowthAgent';
import { setupLogger } from '../utils/logger';

const logger = setupLogger();

export class AgentService {
  private contentStrategyAgent: ContentStrategyAgent;
  private engagementAnalysisAgent: EngagementAnalysisAgent;
  private networkGrowthAgent: NetworkGrowthAgent;

  constructor() {
    this.contentStrategyAgent = new ContentStrategyAgent();
    this.engagementAnalysisAgent = new EngagementAnalysisAgent();
    this.networkGrowthAgent = new NetworkGrowthAgent();
  }

  /**
   * Analysiert Trends und generiert Content basierend auf Keywords
   */
  async generateContentStrategy(keywords: string[]) {
    try {
      logger.info('Starte Content-Strategie-Generierung mit Keywords:', keywords);
      const result = await this.contentStrategyAgent.execute(keywords);
      logger.info('Content-Strategie erfolgreich generiert');
      return result;
    } catch (error) {
      logger.error('Fehler bei der Content-Strategie-Generierung:', error);
      throw error;
    }
  }

  /**
   * Analysiert die Performance von LinkedIn-Posts und generiert Empfehlungen
   */
  async analyzeEngagement(postData: any) {
    try {
      logger.info('Starte Engagement-Analyse für Posts');
      const result = await this.engagementAnalysisAgent.execute(postData);
      logger.info('Engagement-Analyse erfolgreich abgeschlossen');
      return result;
    } catch (error) {
      logger.error('Fehler bei der Engagement-Analyse:', error);
      throw error;
    }
  }

  /**
   * Analysiert das Netzwerk und generiert Wachstumsstrategien
   */
  async analyzeNetworkGrowth(profileData: any) {
    try {
      logger.info('Starte Netzwerk-Wachstumsanalyse');
      const result = await this.networkGrowthAgent.execute(profileData);
      logger.info('Netzwerk-Wachstumsanalyse erfolgreich abgeschlossen');
      return result;
    } catch (error) {
      logger.error('Fehler bei der Netzwerk-Wachstumsanalyse:', error);
      throw error;
    }
  }

  /**
   * Führt eine vollständige Analyse durch und generiert einen umfassenden Bericht
   */
  async generateFullReport(keywords: string[], postData: any, profileData: any) {
    try {
      logger.info('Starte vollständige Analyse');
      
      // Parallele Ausführung der Agenten
      const [contentStrategy, engagementAnalysis, networkGrowth] = await Promise.all([
        this.generateContentStrategy(keywords),
        this.analyzeEngagement(postData),
        this.analyzeNetworkGrowth(profileData)
      ]);
      
      // Zusammenfassung der Ergebnisse
      const report = {
        contentStrategy,
        engagementAnalysis,
        networkGrowth,
        timestamp: new Date().toISOString(),
        recommendations: [
          ...contentStrategy.trends.recommendations || [],
          ...engagementAnalysis.recommendations || [],
          ...networkGrowth.metrics.recommendations || []
        ]
      };
      
      logger.info('Vollständige Analyse erfolgreich abgeschlossen');
      return report;
    } catch (error) {
      logger.error('Fehler bei der vollständigen Analyse:', error);
      throw error;
    }
  }
} 