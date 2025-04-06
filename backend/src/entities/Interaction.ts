import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['like', 'comment', 'connection_request', 'message'],
  })
  type: 'like' | 'comment' | 'connection_request' | 'message';

  @Column({ nullable: true })
  targetProfileId: string;

  @Column({ nullable: true })
  targetPostId: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  })
  status: 'pending' | 'completed' | 'failed';

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    targetName: string;
    targetTitle: string;
    targetCompany: string;
    responseReceived: boolean;
    responseContent: string;
  };

  @ManyToOne(() => User, user => user.interactions)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 