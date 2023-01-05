import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar' })
  name: string;
}
