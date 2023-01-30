import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../items/items.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  category_id: number;

  @Column({ type: 'varchar' })
  category_name: string;

  @OneToMany(() => Item, (item) => item.category)
  item: Item[];
}
