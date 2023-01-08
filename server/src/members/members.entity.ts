import { Address } from './address.entity';

import { Point } from './point.entity';
import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  member_id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'integer' })
  snsId: number;

  @Column({ type: 'char', length: 11 })
  phone: number;

  @OneToOne(() => Point)
  @JoinColumn()
  point: Point;

  @OneToMany(() => Address, (address) => address.member, { cascade: true })
  address: Address[];
}
