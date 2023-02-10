import { BaseEntity } from './../common/baseEntity/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Member } from '../members/members.entity';
import { Order_Item } from './order_item.entity';

// export enum IsOrderStatus {
//   order_complete = '주문완료',
//   order_cancel = '주문취소',
//   default = '주문대기',
// }

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  order_id: number;

  @Column({ type: 'integer' })
  count: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({
    type: 'varchar',
    length: '11',
    default: 'complete',
  })
  status: string;

  @Column({ type: 'varchar', length: '11' })
  city: string;

  @Column({ type: 'varchar', length: '50' })
  street: string;

  @Column({ type: 'integer' })
  zipcode: number;

  @Column({ type: 'char', length: 11 })
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
