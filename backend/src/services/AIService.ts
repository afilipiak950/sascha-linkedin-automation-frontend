import OpenAI from 'openai';
import { setupLogger } from '../utils/logger';
import { User } from '../entities/User';

const logger = setupLogger();

export class AIService {
  private openai: OpenAI;
  private user: User;

  constructor(user: User) {
    this.user = user;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generatePostContent(keywords: string[]): Promise<string> {
    try {
      const prompt = this.buildPrompt(keywords);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Du bist ein erfahrener LinkedIn-Content-Creator. 
            Erstelle einen professionellen, informativen und engagierenden LinkedIn-Post.
            Der Post sollte:
            - 3-4 Absätze lang sein
            - Einen klaren Mehrwert bieten
            - Professionell und authentisch klingen
            - Hashtags am Ende enthalten
            - Keine Emojis oder übermäßige Formatierung verwenden
            Ton: ${this.user.preferences.aiTone}
            Stil: ${this.user.preferences.aiStyle}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('Keine Antwort von OpenAI erhalten');
      }

      return content;
    } catch (error) {
      logger.error('Fehler bei der Generierung des Post-Inhalts:', error);
      throw error;
    }
  }

  async generateConnectionMessage(profile: {
    name: string;
    title: string;
    company: string;
  }): Promise<string> {
    try {
      const prompt = `Erstelle eine personalisierte Verbindungsanfrage für:
      Name: ${profile.name}
      Position: ${profile.title}
      Unternehmen: ${profile.company}
      
      Die Nachricht sollte:
      - Kurz und prägnant sein (max. 300 Zeichen)
      - Einen konkreten Grund für die Verbindung nennen
      - Professionell und authentisch klingen
      - Keine Emojis verwenden`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein erfahrener LinkedIn-Networker. Erstelle eine personalisierte Verbindungsanfrage."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('Keine Antwort von OpenAI erhalten');
      }

      return content;
    } catch (error) {
      logger.error('Fehler bei der Generierung der Verbindungsnachricht:', error);
      throw error;
    }
  }

  async generateComment(postContent: string): Promise<string> {
    try {
      const prompt = `Erstelle einen konstruktiven Kommentar zu diesem LinkedIn-Post:
      "${postContent}"
      
      Der Kommentar sollte:
      - Einen Mehrwert bieten
      - Professionell und authentisch klingen
      - Max. 2-3 Sätze lang sein
      - Keine Emojis verwenden`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein erfahrener LinkedIn-Networker. Erstelle einen konstruktiven Kommentar."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('Keine Antwort von OpenAI erhalten');
      }

      return content;
    } catch (error) {
      logger.error('Fehler bei der Generierung des Kommentars:', error);
      throw error;
    }
  }

  private buildPrompt(keywords: string[]): string {
    return `Erstelle einen LinkedIn-Post über folgende Themen/Keywords:
    ${keywords.join(', ')}
    
    Berücksichtige dabei:
    - Aktuelle Trends und Entwicklungen in diesen Bereichen
    - Praktische Insights oder Tipps
    - Eine klare Struktur mit Einleitung, Hauptteil und Fazit
    - 3-5 relevante Hashtags am Ende`;
  }
} 