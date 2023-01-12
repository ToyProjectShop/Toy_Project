import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  point_id: number;

  @Column({ type: 'integer' })
  point: number;
}
