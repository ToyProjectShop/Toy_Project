import { BaseEntity } from './../common/baseEntity/base.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './orders.entity';
import { Item } from '../items/items.entity';
@Entity()
export class Order_Item extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  order_item_id: number;

  @ManyToOne(() => Order, (order) => order.order_item, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'order_id',
      referencedColumnName: 'order_id',
    },
  ])
  order: Order;

  @ManyToOne(() => Item, (item) => item.order_item, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'item_id',
      referencedColumnName: 'item_id',
    },
  ])
  item: Item;
}
