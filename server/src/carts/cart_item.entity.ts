import { BaseEntity } from '../common/baseEntity/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Item } from '../items/items.entity';

@Entity()
export class Cart_Item extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cart_item_id: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_item, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'cart_id',
      referencedColumnName: 'cart_id',
    },
  ])
  cart: Cart;

  @ManyToOne(() => Item, (item) => item.cart_item, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'item_id',
      referencedColumnName: 'item_id',
    },
  ])
  item: Item;
}
