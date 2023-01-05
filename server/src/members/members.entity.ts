import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  city: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'integer' })
  zipcode: number;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'integer' })
  snsId: number;
}
