import puppeteer from 'puppeteer';
import { setupLogger } from '../utils/logger';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Interaction } from '../entities/Interaction';

const logger = setupLogger();

export class LinkedInService {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      await this.login();
      logger.info('LinkedIn-Service initialisiert');
    } catch (error) {
      logger.error('Fehler bei der Initialisierung des LinkedIn-Services:', error);
      throw error;
    }
  }

  private async login() {
    if (!this.page) throw new Error('Browser nicht initialisiert');

    try {
      await this.page.goto('https://www.linkedin.com/login');
      await this.page.type('#username', this.user.linkedinEmail!);
      await this.page.type('#password', this.user.linkedinPassword!);
      await this.page.click('[type="submit"]');
      await this.page.waitForNavigation();
      
      // Cookies speichern für spätere Verwendung
      const cookies = await this.page.cookies();
      this.user.linkedinCookies = cookies;
      // TODO: User in Datenbank aktualisieren
    } catch (error) {
      logger.error('Login fehlgeschlagen:', error);
      throw error;
    }
  }

  async createPost(post: Post) {
    if (!this.page) throw new Error('Browser nicht initialisiert');

    try {
      await this.page.goto('https://www.linkedin.com/feed/');
      await this.page.waitForSelector('[aria-label="Start a post"]');
      await this.page.click('[aria-label="Start a post"]');
      await this.page.waitForSelector('[role="textbox"]');
      await this.page.type('[role="textbox"]', post.content);
      await this.page.click('[aria-label="Post"]');
      
      // Post-ID aus der URL extrahieren
      const postUrl = await this.page.url();
      post.linkedinPostId = postUrl.split('/posts/')[1]?.split('?')[0];
      post.status = 'published';
      post.publishedAt = new Date();
      
      logger.info(`Post erfolgreich erstellt: ${post.linkedinPostId}`);
    } catch (error) {
      logger.error('Fehler beim Erstellen des Posts:', error);
      post.status = 'failed';
      throw error;
    }
  }

  async sendConnectionRequest(interaction: Interaction) {
    if (!this.page) throw new Error('Browser nicht initialisiert');

    try {
      await this.page.goto(`https://www.linkedin.com/in/${interaction.targetProfileId}`);
      await this.page.waitForSelector('[aria-label="Connect"]');
      await this.page.click('[aria-label="Connect"]');
      
      if (interaction.content) {
        await this.page.waitForSelector('[aria-label="Add a note"]');
        await this.page.click('[aria-label="Add a note"]');
        await this.page.type('[aria-label="Message"]', interaction.content);
        await this.page.click('[aria-label="Send"]');
      } else {
        await this.page.click('[aria-label="Send"]');
      }

      interaction.status = 'completed';
      logger.info(`Verbindungsanfrage gesendet an: ${interaction.targetProfileId}`);
    } catch (error) {
      logger.error('Fehler beim Senden der Verbindungsanfrage:', error);
      interaction.status = 'failed';
      throw error;
    }
  }

  async likePost(interaction: Interaction) {
    if (!this.page) throw new Error('Browser nicht initialisiert');

    try {
      await this.page.goto(`https://www.linkedin.com/feed/update/${interaction.targetPostId}`);
      await this.page.waitForSelector('[aria-label="Like"]');
      await this.page.click('[aria-label="Like"]');
      
      interaction.status = 'completed';
      logger.info(`Post geliked: ${interaction.targetPostId}`);
    } catch (error) {
      logger.error('Fehler beim Liken des Posts:', error);
      interaction.status = 'failed';
      throw error;
    }
  }

  async commentOnPost(interaction: Interaction) {
    if (!this.page) throw new Error('Browser nicht initialisiert');

    try {
      await this.page.goto(`https://www.linkedin.com/feed/update/${interaction.targetPostId}`);
      await this.page.waitForSelector('[aria-label="Comment"]');
      await this.page.click('[aria-label="Comment"]');
      await this.page.waitForSelector('[role="textbox"]');
      await this.page.type('[role="textbox"]', interaction.content!);
      await this.page.click('[aria-label="Post"]');
      
      interaction.status = 'completed';
      logger.info(`Kommentar hinzugefügt zu Post: ${interaction.targetPostId}`);
    } catch (error) {
      logger.error('Fehler beim Kommentieren des Posts:', error);
      interaction.status = 'failed';
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      logger.info('LinkedIn-Service geschlossen');
    }
  }
} 