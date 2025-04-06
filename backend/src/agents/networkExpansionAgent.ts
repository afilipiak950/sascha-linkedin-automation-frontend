import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';
import { LinkedInService } from '../services/linkedinService';

class NetworkExpansionAgent {
  private openai: OpenAI;
  private linkedinService: LinkedInService;
  private dailyConnectionLimit: number;
  private connectionsToday: number;
  private lastReset: Date;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
    this.linkedinService = new LinkedInService();
    this.dailyConnectionLimit = 39; // LinkedIn's empfohlenes Limit
    this.connectionsToday = 0;
    this.lastReset = new Date();
  }

  private resetDailyCounters(): void {
    const now = new Date();
    if (now.getDate() !== this.lastReset.getDate()) {
      this.connectionsToday = 0;
      this.lastReset = now;
      logger.info('Tägliche Verbindungszähler zurückgesetzt');
    }
  }

  async generateConnectionMessage(profile: any): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein Networking-Experte. Erstelle personalisierte, professionelle Verbindungsanfragen für LinkedIn."
          },
          {
            role: "user",
            content: `
              Erstelle eine personalisierte Verbindungsanfrage für:
              Name: ${profile.name}
              Position: ${profile.position}
              Unternehmen: ${profile.company}
              Gemeinsame Verbindungen: ${profile.mutualConnections}
              Interessen: ${profile.interests}
              
              Richtlinien:
              - Kurz und prägnant (max. 300 Zeichen)
              - Persönlich, aber professionell
              - Erwähne Gemeinsamkeiten oder spezifische Interessen
              - Keine Verkaufsabsicht zeigen
            `
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      });

      const message = completion.choices[0].message.content;
      if (!message) throw new Error('Keine Nachricht generiert');

      return message.trim();
    } catch (error) {
      logger.error('Fehler bei der Nachrichtengenerierung:', error);
      throw new Error('Nachrichtengenerierung fehlgeschlagen');
    }
  }

  async shouldConnect(profile: any): Promise<boolean> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein LinkedIn-Strategieberater. Entscheide, ob eine Verbindung wertvoll für das Netzwerk ist."
          },
          {
            role: "user",
            content: `
              Analysiere dieses LinkedIn-Profil und entscheide, ob eine Verbindung sinnvoll ist:
              
              Profil: ${JSON.stringify(profile)}
              
              Kriterien:
              - Relevanz für die Zielgruppe
              - Professionalität des Profils
              - Aktivitätsniveau
              - Gemeinsame Interessen/Branche
              - Potenzial für gegenseitigen Mehrwert
              
              Antworte nur mit "true" oder "false"
            `
          }
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      const decision = completion.choices[0].message.content?.toLowerCase().includes('true');
      return decision;
    } catch (error) {
      logger.error('Fehler bei der Verbindungsentscheidung:', error);
      return false;
    }
  }

  async processProspects(prospects: any[]): Promise<void> {
    this.resetDailyCounters();

    if (this.connectionsToday >= this.dailyConnectionLimit) {
      logger.info('Tägliches Verbindungslimit erreicht');
      return;
    }

    for (const prospect of prospects) {
      try {
        if (this.connectionsToday >= this.dailyConnectionLimit) break;

        if (await this.shouldConnect(prospect)) {
          const message = await this.generateConnectionMessage(prospect);
          await this.linkedinService.sendConnectionRequest(prospect.id, message);
          
          this.connectionsToday++;
          logger.info(`Verbindungsanfrage an ${prospect.name} gesendet (${this.connectionsToday}/${this.dailyConnectionLimit})`);

          // Warte zwischen 10 und 20 Minuten vor der nächsten Anfrage
          await new Promise(resolve => setTimeout(resolve, 600000 + Math.random() * 600000));
        }
      } catch (error) {
        logger.error(`Fehler bei der Verarbeitung von Prospect ${prospect.name}:`, error);
      }
    }
  }

  async findNewProspects(keywords: string[], industries: string[]): Promise<any[]> {
    try {
      const prospects = await this.linkedinService.searchPeople({
        keywords,
        industries,
        connectionDegree: '2nd',
        limit: this.dailyConnectionLimit * 2 // Hole mehr für Filterung
      });

      return prospects;
    } catch (error) {
      logger.error('Fehler beim Suchen neuer Prospects:', error);
      return [];
    }
  }
}

export const networkExpansionAgent = new NetworkExpansionAgent(); 