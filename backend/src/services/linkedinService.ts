import { chromium } from 'playwright';
import { config } from '../config';
import { logger } from '../utils/logger';

export class LinkedInService {
  private browser: any;
  private context: any;
  private page: any;
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.browser = await chromium.launch({
        headless: true
      });
      this.context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      });
      this.page = await this.context.newPage();
      
      await this.login();
      this.isInitialized = true;
    } catch (error) {
      logger.error('Fehler bei der LinkedIn-Initialisierung:', error);
      throw new Error('LinkedIn-Initialisierung fehlgeschlagen');
    }
  }

  private async login(): Promise<void> {
    try {
      await this.page.goto('https://www.linkedin.com/login');
      await this.page.fill('#username', config.linkedin.email);
      await this.page.fill('#password', config.linkedin.password);
      await this.page.click('button[type="submit"]');
      await this.page.waitForNavigation();
      
      logger.info('LinkedIn-Login erfolgreich');
    } catch (error) {
      logger.error('Fehler beim LinkedIn-Login:', error);
      throw new Error('LinkedIn-Login fehlgeschlagen');
    }
  }

  async searchPeople(options: {
    keywords: string[];
    industries: string[];
    connectionDegree: string;
    limit: number;
  }): Promise<any[]> {
    await this.initialize();

    try {
      const searchUrl = this.buildSearchUrl(options);
      await this.page.goto(searchUrl);
      await this.page.waitForSelector('.search-results__list');

      const profiles = await this.page.$$eval('.search-result__info', (elements: any[]) => {
        return elements.map(el => ({
          id: el.getAttribute('data-profile-id'),
          name: el.querySelector('.actor-name')?.innerText,
          position: el.querySelector('.actor-title')?.innerText,
          company: el.querySelector('.actor-subtitle')?.innerText,
          location: el.querySelector('.actor-location')?.innerText,
          mutualConnections: el.querySelector('.actor-common')?.innerText,
          url: el.querySelector('a.search-result__result-link')?.href
        }));
      });

      return profiles.slice(0, options.limit);
    } catch (error) {
      logger.error('Fehler bei der Personensuche:', error);
      return [];
    }
  }

  private buildSearchUrl(options: any): string {
    const params = new URLSearchParams({
      keywords: options.keywords.join(' '),
      facetNetwork: [`F${options.connectionDegree}`],
      facetIndustry: options.industries,
      origin: 'GLOBAL_SEARCH_HEADER'
    });

    return `https://www.linkedin.com/search/results/people/?${params.toString()}`;
  }

  async sendConnectionRequest(profileId: string, message: string): Promise<void> {
    await this.initialize();

    try {
      await this.page.goto(`https://www.linkedin.com/in/${profileId}`);
      await this.page.click('button.connect-button');
      
      if (message) {
        await this.page.click('button.artdeco-button--secondary');
        await this.page.fill('textarea#custom-message', message);
      }
      
      await this.page.click('button.artdeco-button--primary');
      logger.info(`Verbindungsanfrage an ${profileId} gesendet`);
    } catch (error) {
      logger.error(`Fehler beim Senden der Verbindungsanfrage an ${profileId}:`, error);
      throw new Error('Verbindungsanfrage fehlgeschlagen');
    }
  }

  async likePost(postId: string): Promise<void> {
    await this.initialize();

    try {
      await this.page.goto(`https://www.linkedin.com/feed/update/${postId}`);
      await this.page.click('button.react-button');
      logger.info(`Post ${postId} geliked`);
    } catch (error) {
      logger.error(`Fehler beim Liken von Post ${postId}:`, error);
      throw new Error('Like fehlgeschlagen');
    }
  }

  async commentOnPost(postId: string, comment: string): Promise<void> {
    await this.initialize();

    try {
      await this.page.goto(`https://www.linkedin.com/feed/update/${postId}`);
      await this.page.click('button.comment-button');
      await this.page.fill('div[contenteditable="true"]', comment);
      await this.page.keyboard.press('Enter');
      logger.info(`Kommentar auf Post ${postId} erstellt`);
    } catch (error) {
      logger.error(`Fehler beim Kommentieren von Post ${postId}:`, error);
      throw new Error('Kommentieren fehlgeschlagen');
    }
  }

  async replyToComment(commentId: string, reply: string): Promise<void> {
    await this.initialize();

    try {
      // Finde den Kommentar und klicke auf "Antworten"
      await this.page.click(`div[data-id="${commentId}"] button.reply-button`);
      await this.page.fill('div[contenteditable="true"]', reply);
      await this.page.keyboard.press('Enter');
      logger.info(`Auf Kommentar ${commentId} geantwortet`);
    } catch (error) {
      logger.error(`Fehler beim Antworten auf Kommentar ${commentId}:`, error);
      throw new Error('Antworten fehlgeschlagen');
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.isInitialized = false;
    }
  }
} 