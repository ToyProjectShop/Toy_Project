import { Address } from './address.entity';

import { Point } from './point.entity';
import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, Binary } from 'typeorm';
import { Exclude } from 'class-transformer';

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

  @OneToMany(() => Address, (address) => address.member, { cascade: true })
  address: Address[];
}
