import { Member } from './members.entity';
import { BaseEntity } from '../common/baseEntity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class Adress extends BaseEntity {
  @PrimaryGeneratedColumn()
  adress_id: number;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'integer' })
  zipcode: number;

  @ManyToOne(() => Member, (member) => member.adress, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'member_id',
      referencedColumnName: 'member_id',
    },
  ])
  member: Member;
}
