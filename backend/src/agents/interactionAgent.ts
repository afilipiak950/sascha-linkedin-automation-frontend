import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';
import { LinkedInService } from '../services/linkedinService';

class InteractionAgent {
  private openai: OpenAI;
  private linkedinService: LinkedInService;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
    this.linkedinService = new LinkedInService();
  }

  async generateComment(postContent: string, context: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein professioneller LinkedIn-Nutzer. Erstelle authentische, wertvolle Kommentare, die zur Diskussion beitragen."
          },
          {
            role: "user",
            content: `
              Erstelle einen Kommentar für folgenden LinkedIn Post:
              "${postContent}"
              
              Kontext: ${context}
              
              Richtlinien:
              - Professionell und höflich
              - Authentisch und persönlich
              - Füge zur Diskussion bei
              - Maximal 2-3 Sätze
              - Keine Hashtags
              - Sparsamer Emoji-Einsatz
            `
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const comment = completion.choices[0].message.content;
      if (!comment) throw new Error('Kein Kommentar generiert');

      return comment.trim();
    } catch (error) {
      logger.error('Fehler bei der Kommentar-Generierung:', error);
      throw new Error('Kommentar-Generierung fehlgeschlagen');
    }
  }

  async shouldInteractWithPost(postContent: string, authorInfo: any): Promise<boolean> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein LinkedIn-Strategieberater. Entscheide, ob eine Interaktion mit einem Post sinnvoll ist."
          },
          {
            role: "user",
            content: `
              Analysiere diesen LinkedIn Post und entscheide, ob eine Interaktion sinnvoll ist:
              
              Post: "${postContent}"
              Autor: ${JSON.stringify(authorInfo)}
              
              Kriterien:
              - Relevanz für die Zielgruppe
              - Professionalität des Inhalts
              - Potenzial für sinnvolle Interaktion
              - Keine kontroversen/politischen Themen
              
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
      logger.error('Fehler bei der Interaktions-Entscheidung:', error);
      return false;
    }
  }

  async processNewPosts(posts: any[]): Promise<void> {
    for (const post of posts) {
      try {
        if (await this.shouldInteractWithPost(post.content, post.author)) {
          // Like mit Wahrscheinlichkeit von 80%
          if (Math.random() < 0.8) {
            await this.linkedinService.likePost(post.id);
            logger.info(`Post ${post.id} geliked`);
          }

          // Kommentieren mit Wahrscheinlichkeit von 30%
          if (Math.random() < 0.3) {
            const comment = await this.generateComment(post.content, 'Reguläre Interaktion');
            await this.linkedinService.commentOnPost(post.id, comment);
            logger.info(`Kommentar auf Post ${post.id} erstellt`);
          }

          // Warte zwischen 30 und 90 Sekunden vor der nächsten Interaktion
          await new Promise(resolve => setTimeout(resolve, 30000 + Math.random() * 60000));
        }
      } catch (error) {
        logger.error(`Fehler bei der Verarbeitung von Post ${post.id}:`, error);
      }
    }
  }

  async respondToComments(comments: any[]): Promise<void> {
    for (const comment of comments) {
      try {
        const response = await this.generateComment(comment.content, 'Antwort auf Kommentar');
        await this.linkedinService.replyToComment(comment.id, response);
        logger.info(`Auf Kommentar ${comment.id} geantwortet`);

        // Warte zwischen 2 und 5 Minuten vor der nächsten Antwort
        await new Promise(resolve => setTimeout(resolve, 120000 + Math.random() * 180000));
      } catch (error) {
        logger.error(`Fehler bei der Antwort auf Kommentar ${comment.id}:`, error);
      }
    }
  }
}

export const interactionAgent = new InteractionAgent(); 