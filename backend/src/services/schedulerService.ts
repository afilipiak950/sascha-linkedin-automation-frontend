import cron from 'node-cron';
import { config } from '../config';
import { logger } from '../utils/logger';
import { postGeneratorAgent } from '../agents/postGeneratorAgent';
import { interactionAgent } from '../agents/interactionAgent';
import { networkExpansionAgent } from '../agents/networkExpansionAgent';

export class SchedulerService {
  private tasks: Map<string, cron.ScheduledTask>;

  constructor() {
    this.tasks = new Map();
  }

  initialize(): void {
    this.schedulePostGeneration();
    this.scheduleInteractions();
    this.scheduleNetworkExpansion();
    logger.info('Scheduler-Service initialisiert');
  }

  private schedulePostGeneration(): void {
    // Generiere Posts 3-4 mal pro Woche (Montag, Mittwoch, Freitag)
    const task = cron.schedule('0 10 * * 1,3,5', async () => {
      try {
        const topics = ['KI', 'Automatisierung', 'LinkedIn Marketing', 'Networking'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        await postGeneratorAgent.generatePost(
          randomTopic,
          'professionell',
          'medium'
        );
        
        logger.info('Post-Generierung erfolgreich ausgeführt');
      } catch (error) {
        logger.error('Fehler bei der geplanten Post-Generierung:', error);
      }
    });

    this.tasks.set('postGeneration', task);
  }

  private scheduleInteractions(): void {
    // Überprüfe stündlich auf neue Posts und Kommentare
    const task = cron.schedule('0 * * * *', async () => {
      try {
        // Hole neue Posts aus dem Feed
        const newPosts = await this.fetchNewPosts();
        await interactionAgent.processNewPosts(newPosts);

        // Überprüfe auf neue Kommentare
        const newComments = await this.fetchNewComments();
        await interactionAgent.respondToComments(newComments);

        logger.info('Interaktionen erfolgreich ausgeführt');
      } catch (error) {
        logger.error('Fehler bei den geplanten Interaktionen:', error);
      }
    });

    this.tasks.set('interactions', task);
  }

  private scheduleNetworkExpansion(): void {
    // Verteile Kontaktanfragen über den Tag (8:00 - 17:00 Uhr)
    const task = cron.schedule('0 8-17 * * 1-5', async () => {
      try {
        const keywords = ['CEO', 'Founder', 'Marketing Manager', 'Digital'];
        const industries = ['Technology', 'Marketing', 'Business'];

        const prospects = await networkExpansionAgent.findNewProspects(
          keywords,
          industries
        );

        await networkExpansionAgent.processProspects(prospects);
        logger.info('Netzwerk-Erweiterung erfolgreich ausgeführt');
      } catch (error) {
        logger.error('Fehler bei der geplanten Netzwerk-Erweiterung:', error);
      }
    });

    this.tasks.set('networkExpansion', task);
  }

  private async fetchNewPosts(): Promise<any[]> {
    // TODO: Implementiere LinkedIn API/Scraping-Logik
    return [];
  }

  private async fetchNewComments(): Promise<any[]> {
    // TODO: Implementiere LinkedIn API/Scraping-Logik
    return [];
  }

  stopAll(): void {
    for (const [name, task] of this.tasks) {
      task.stop();
      logger.info(`Task ${name} gestoppt`);
    }
    this.tasks.clear();
  }
}

export const schedulerService = new SchedulerService(); 