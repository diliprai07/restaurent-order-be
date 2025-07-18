// src/modules/tables/tables.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

@Entity('restaurent_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  table_number: string;

  @Column({ type: 'text', nullable: true })
  qr_code: string;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;
}
