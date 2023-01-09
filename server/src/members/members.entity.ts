import { Address } from './address.entity';
import { Point } from './point.entity';
import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, Binary } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from 'src/orders/orders.entity';
import { Cart } from 'src/carts/cart.entity';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  member_id: number;

  @Column({ type: 'varchar', length: 80 })
  email: string;

  @Column({ type: 'varchar', unique: true, length: 20 })
  username: string;

  @Column({ type: 'binary', length: 60 })
  @Exclude()
  password: Binary;

  @Column({ type: 'varchar', length: 10 })
  provider: string;

  @Column({ type: 'integer' })
  snsId: number;

  @Column({ type: 'char', length: 11 })
  phone: number;

  @OneToOne(() => Point)
  @JoinColumn()
  point: Point;

  @OneToOne(() => Cart)
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Address, (address) => address.member, { cascade: true })
  address: Address[];

  @OneToMany(() => Order, (order) => order.member, { cascade: true })
  order: Order[];
}
