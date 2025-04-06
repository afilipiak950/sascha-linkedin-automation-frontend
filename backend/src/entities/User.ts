import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from './Post';
import { Interaction } from './Interaction';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  linkedinEmail: string;

  @Column({ nullable: true })
  linkedinPassword: string;

  @Column({ type: 'jsonb', nullable: true })
  linkedinCookies: any;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    postFrequency: number;
    preferredTimes: string[];
    targetKeywords: string[];
    targetIndustries: string[];
    targetRoles: string[];
    commentStrategy: string;
    likeStrategy: string;
    aiTone: string;
    aiStyle: string;
  };

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Interaction, interaction => interaction.user)
  interactions: Interaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 