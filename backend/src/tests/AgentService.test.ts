import { AgentService } from '../services/AgentService';
import { ContentStrategyAgent } from '../services/agents/ContentStrategyAgent';
import { EngagementAnalysisAgent } from '../services/agents/EngagementAnalysisAgent';
import { NetworkGrowthAgent } from '../services/agents/NetworkGrowthAgent';

// Mock der Agenten
jest.mock('../services/agents/ContentStrategyAgent');
jest.mock('../services/agents/EngagementAnalysisAgent');
jest.mock('../services/agents/NetworkGrowthAgent');

describe('AgentService', () => {
  let agentService: AgentService;
  let mockContentStrategyAgent: jest.Mocked<ContentStrategyAgent>;
  let mockEngagementAnalysisAgent: jest.Mocked<EngagementAnalysisAgent>;
  let mockNetworkGrowthAgent: jest.Mocked<NetworkGrowthAgent>;

  beforeEach(() => {
    // Mock-Implementierungen zurücksetzen
    jest.clearAllMocks();

    // Mock-Instanzen erstellen
    mockContentStrategyAgent = new ContentStrategyAgent() as jest.Mocked<ContentStrategyAgent>;
    mockEngagementAnalysisAgent = new EngagementAnalysisAgent() as jest.Mocked<EngagementAnalysisAgent>;
    mockNetworkGrowthAgent = new NetworkGrowthAgent() as jest.Mocked<NetworkGrowthAgent>;

    // Mock-Methoden implementieren
    mockContentStrategyAgent.execute.mockResolvedValue({
      trends: {
        recommendations: ['Trend 1', 'Trend 2']
      },
      schedule: {
        bestTimes: ['9:00', '15:00']
      },
      content: {
        suggestions: ['Content 1', 'Content 2']
      }
    });

    mockEngagementAnalysisAgent.execute.mockResolvedValue({
      performance: {
        metrics: {
          likes: 100,
          comments: 50,
          shares: 25
        }
      },
      strategies: {
        recommendations: ['Strategy 1', 'Strategy 2']
      },
      recommendations: ['Recommendation 1', 'Recommendation 2']
    });

    mockNetworkGrowthAgent.execute.mockResolvedValue({
      suggestions: {
        connections: ['Connection 1', 'Connection 2']
      },
      metrics: {
        recommendations: ['Metric 1', 'Metric 2']
      },
      strategies: {
        growth: ['Growth 1', 'Growth 2']
      }
    });

    // AgentService mit Mocks erstellen
    agentService = new AgentService();
  });

  describe('generateContentStrategy', () => {
    it('sollte eine Content-Strategie basierend auf Keywords generieren', async () => {
      const keywords = ['keyword1', 'keyword2'];
      const result = await agentService.generateContentStrategy(keywords);

      expect(result).toBeDefined();
      expect(result.trends).toBeDefined();
      expect(result.schedule).toBeDefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('analyzeEngagement', () => {
    it('sollte eine Engagement-Analyse für Posts durchführen', async () => {
      const postData = {
        id: '123',
        content: 'Test post',
        metrics: {
          likes: 100,
          comments: 50,
          shares: 25
        }
      };

      const result = await agentService.analyzeEngagement(postData);

      expect(result).toBeDefined();
      expect(result.performance).toBeDefined();
      expect(result.strategies).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });

  describe('analyzeNetworkGrowth', () => {
    it('sollte eine Netzwerk-Wachstumsanalyse durchführen', async () => {
      const profileData = {
        id: '123',
        connections: 500,
        industry: 'Technology'
      };

      const result = await agentService.analyzeNetworkGrowth(profileData);

      expect(result).toBeDefined();
      expect(result.suggestions).toBeDefined();
      expect(result.metrics).toBeDefined();
      expect(result.strategies).toBeDefined();
    });
  });

  describe('generateFullReport', () => {
    it('sollte einen vollständigen Analysebericht generieren', async () => {
      const keywords = ['keyword1', 'keyword2'];
      const postData = {
        id: '123',
        content: 'Test post',
        metrics: {
          likes: 100,
          comments: 50,
          shares: 25
        }
      };
      const profileData = {
        id: '123',
        connections: 500,
        industry: 'Technology'
      };

      const result = await agentService.generateFullReport(
        keywords,
        postData,
        profileData
      );

      expect(result).toBeDefined();
      expect(result.contentStrategy).toBeDefined();
      expect(result.engagementAnalysis).toBeDefined();
      expect(result.networkGrowth).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });
}); 