import { BaseEntity } from './../common/baseEntity/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Member } from '../members/members.entity';
import { Order_Item } from './order_item.entity';
@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  order_id: number;

  @Column({ type: 'integer' })
  count: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'integer' })
  zipcode: number;

  @Column({ type: 'char' })
  phone: number;

  @ManyToOne(() => Member, (member) => member.order)
  @JoinColumn([
    {
      name: 'member_id',
      referencedColumnName: 'member_id',
    },
  ])
  member: Member;

  @OneToMany(() => Order_Item, (order_item) => order_item.order, {
    cascade: true,
  })
  order_item: Order_Item[];
}
