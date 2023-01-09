import { Member } from './members.entity';
import { BaseEntity } from '../common/baseEntity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column({ type: 'varchar', length: 11 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  street: string;

  @Column({ type: 'tinyint' })
  zipcode: number;

  @ManyToOne(() => Member, (member) => member.address, {
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
