import { Address } from './address.entity';
import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, Binary } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from './../orders/orders.entity';

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

  @Column({ type: 'varchar', length: 10, nullable: true })
  provider: string;

  @Column({ type: 'integer', nullable: true })
  snsId: number;

  @Column({ type: 'char', length: 11 })
  phone: number;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string;

  @OneToMany(() => Address, (address) => address.member, { cascade: true })
  address: Address[];

  @OneToMany(() => Order, (order) => order.member, { cascade: true })
  order: Order[];
}
