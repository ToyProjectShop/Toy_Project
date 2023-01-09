import { BaseEntity } from './../common/baseEntity/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Cart_Item } from './cart_item.entity';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cart_id: number;

  @Column({ type: 'integer' })
  count: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'bigint' })
  member_id: number;

  @OneToMany(() => Cart_Item, (cart_item) => cart_item.item)
  cart_item: Cart_Item[];
}
