import { BaseEntity } from './../common/baseEntity/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { Order_Item } from '../orders/order_item.entity';
import { Cart_Item } from '../carts/cart_item.entity';
@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  item_id: number;

  @Column({ type: 'varchar', length: '20' })
  item_name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar', length: '150' })
  descritpion: string;

  @Column({ type: 'integer' })
  stockquantity: number;

  @ManyToOne(() => Category, (category) => category.item, {
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
  })
  @JoinColumn([
    {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  ])
  category: Category;

  @OneToMany(() => Order_Item, (order_item) => order_item.item,{cascade:true})
  order_item: Order_Item[];

  @OneToMany(() => Cart_Item, (cart_item) => cart_item.item,{cascade:true})
  cart_item: Cart_Item[];
}
