import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  linkedinPostId: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  })
  status: 'draft' | 'scheduled' | 'published' | 'failed';

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    hashtags: string[];
    mentions: string[];
    mediaUrls: string[];
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  };

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 