import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Order_Item {
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @Column()
  orderprice: number;

  @Column()
  count: number;

  @Column()
  order_id: number;

  @Column()
  item_id: number;
}
