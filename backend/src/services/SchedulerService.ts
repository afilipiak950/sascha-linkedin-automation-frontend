import cron from 'node-cron';
import { setupLogger } from '../utils/logger';
import { LinkedInService } from './LinkedInService';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Interaction } from '../entities/Interaction';
import { AppDataSource } from '../config/database';

const logger = setupLogger();

export class SchedulerService {
  private user: User;
  private linkedInService: LinkedInService;
  private tasks: cron.ScheduledTask[] = [];

  constructor(user: User) {
    this.user = user;
    this.linkedInService = new LinkedInService(user);
  }

  async initialize() {
    try {
      await this.linkedInService.initialize();
      this.scheduleTasks();
      logger.info('Scheduler-Service initialisiert');
    } catch (error) {
      logger.error('Fehler bei der Initialisierung des Scheduler-Services:', error);
      throw error;
    }
  }

  private scheduleTasks() {
    // Post-Planung (3-4 mal pro Woche)
    this.tasks.push(
      cron.schedule('0 9 * * 1-5', async () => {
        await this.scheduleWeeklyPosts();
      })
    );

    // Interaktionen über den Tag verteilt
    this.tasks.push(
      cron.schedule('*/30 * * * *', async () => {
        await this.processInteractions();
      })
    );

    // Verbindungsanfragen (max. 39 pro Tag)
    this.tasks.push(
      cron.schedule('0 */2 * * *', async () => {
        await this.sendConnectionRequests();
      })
    );

    // Kommentar-Überprüfung und Antworten
    this.tasks.push(
      cron.schedule('0 * * * *', async () => {
        await this.checkAndRespondToComments();
      })
    );
  }

  private async scheduleWeeklyPosts() {
    try {
      const postRepository = AppDataSource.getRepository(Post);
      const postsToSchedule = await postRepository.find({
        where: {
          user: { id: this.user.id },
          status: 'draft'
        },
        order: { createdAt: 'DESC' },
        take: 4
      });

      for (const post of postsToSchedule) {
        const randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Montag-Freitag)
        const randomHour = Math.floor(Math.random() * 8) + 9; // 9-17 Uhr
        post.scheduledFor = new Date();
        post.scheduledFor.setDate(post.scheduledFor.getDate() + randomDay);
        post.scheduledFor.setHours(randomHour, 0, 0, 0);
        post.status = 'scheduled';
        await postRepository.save(post);
      }
    } catch (error) {
      logger.error('Fehler beim Planen der wöchentlichen Posts:', error);
    }
  }

  private async processInteractions() {
    try {
      const interactionRepository = AppDataSource.getRepository(Interaction);
      const pendingInteractions = await interactionRepository.find({
        where: {
          user: { id: this.user.id },
          status: 'pending'
        },
        take: 5 // Max. 5 Interaktionen pro 30 Minuten
      });

      for (const interaction of pendingInteractions) {
        switch (interaction.type) {
          case 'like':
            await this.linkedInService.likePost(interaction);
            break;
          case 'comment':
            await this.linkedInService.commentOnPost(interaction);
            break;
        }
        await interactionRepository.save(interaction);
      }
    } catch (error) {
      logger.error('Fehler bei der Verarbeitung der Interaktionen:', error);
    }
  }

  private async sendConnectionRequests() {
    try {
      const interactionRepository = AppDataSource.getRepository(Interaction);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayConnections = await interactionRepository.count({
        where: {
          user: { id: this.user.id },
          type: 'connection_request',
          createdAt: today
        }
      });

      if (todayConnections >= 39) {
        logger.info('Tageslimit für Verbindungsanfragen erreicht');
        return;
      }

      const pendingConnections = await interactionRepository.find({
        where: {
          user: { id: this.user.id },
          type: 'connection_request',
          status: 'pending'
        },
        take: 5 // Max. 5 Anfragen pro 2 Stunden
      });

      for (const connection of pendingConnections) {
        await this.linkedInService.sendConnectionRequest(connection);
        await interactionRepository.save(connection);
      }
    } catch (error) {
      logger.error('Fehler beim Senden von Verbindungsanfragen:', error);
    }
  }

  private async checkAndRespondToComments() {
    try {
      const postRepository = AppDataSource.getRepository(Post);
      const posts = await postRepository.find({
        where: {
          user: { id: this.user.id },
          status: 'published'
        }
      });

      for (const post of posts) {
        // TODO: Implementiere die Logik zum Überprüfen und Antworten auf Kommentare
        // Dies erfordert zusätzliche LinkedIn-API-Funktionen
      }
    } catch (error) {
      logger.error('Fehler bei der Überprüfung der Kommentare:', error);
    }
  }

  async stop() {
    this.tasks.forEach(task => task.stop());
    await this.linkedInService.close();
    logger.info('Scheduler-Service gestoppt');
  }
} 