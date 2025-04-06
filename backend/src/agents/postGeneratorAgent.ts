import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';

class PostGeneratorAgent {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey
    });
  }

  async generatePost(topic: string, style: string, length: 'short' | 'medium' | 'long'): Promise<string> {
    try {
      const prompt = this.createPrompt(topic, style, length);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Du bist ein professioneller LinkedIn Content Creator. Erstelle hochwertige, engagement-fördernde Posts, die informativ und authentisch sind."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: this.getMaxTokens(length),
      });

      const generatedPost = completion.choices[0].message.content;
      if (!generatedPost) throw new Error('Kein Post generiert');

      return this.postProcessContent(generatedPost);
    } catch (error) {
      logger.error('Fehler bei der Post-Generierung:', error);
      throw new Error('Post-Generierung fehlgeschlagen');
    }
  }

  private createPrompt(topic: string, style: string, length: string): string {
    return `
      Erstelle einen LinkedIn Post über ${topic}.
      Stil: ${style}
      Länge: ${length}
      
      Berücksichtige folgende Punkte:
      - Professioneller, aber persönlicher Ton
      - Klare Struktur mit Einleitung, Hauptteil und Call-to-Action
      - Relevante Hashtags (max. 3)
      - Emojis sparsam und professionell einsetzen
      - Fokus auf Mehrwert für die Zielgruppe
    `;
  }

  private getMaxTokens(length: string): number {
    const tokenLimits = {
      short: 150,
      medium: 250,
      long: 400
    };
    return tokenLimits[length];
  }

  private postProcessContent(content: string): string {
    // Entferne überschüssige Leerzeilen
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Stelle sicher, dass Hashtags am Ende stehen
    const hashtags = content.match(/#[a-zA-Z0-9]+/g) || [];
    content = content.replace(/#[a-zA-Z0-9]+/g, '');
    
    // Füge Hashtags am Ende hinzu
    if (hashtags.length > 0) {
      content = content.trim() + '\n\n' + hashtags.join(' ');
    }

    return content.trim();
  }
}

export const postGeneratorAgent = new PostGeneratorAgent(); 