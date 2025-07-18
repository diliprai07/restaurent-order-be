// src/modules/menu_items/menu_items.entity.ts
import { MenuCategory } from 'src/menu-categories/entities/menu-categories.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image_url?: string;

  @ManyToOne(() => MenuCategory, (category) => category, {
    onDelete: 'SET NULL',
  })
  category: MenuCategory;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
