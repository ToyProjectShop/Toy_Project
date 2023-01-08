import { BaseEntity } from './../common/baseEntity/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Order_Item } from 'src/orders/order_item.entity';
import { Cart_Item } from 'src/carts/cart_item.entity';
@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  item_id: number;

  @Column({ type: 'varchar' })
  item_name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  descritpion: string;

  @Column({ type: 'integer' })
  stockquantity: number;

  @ManyToOne(() => Category, (category) => category.item)
  @JoinColumn([
    {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  ])
  category: Category;

  @OneToMany(() => Order_Item, (order_item) => order_item.item)
  order_item: Order_Item[];

  @OneToMany(() => Cart_Item, (cart_item) => cart_item.item)
  cart_item: Cart_Item[];
}
