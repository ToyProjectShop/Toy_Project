import { Member } from './members.entity';
import { BaseEntity } from './../common/baseEntity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  point_id: number;

  @Column({ type: 'integer', default: 5000 })
  point?: number;

  @OneToOne(() => Member)
  @JoinColumn([
    {
      name: 'member_id',
      referencedColumnName: 'member_id',
    },
  ])
  member: Member;
}
