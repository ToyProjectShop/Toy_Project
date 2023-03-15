import { Member } from './../members/members.entity';
import { BaseEntity } from './../common/baseEntity/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Cart_Item } from './cart_item.entity';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cart_id: number;

  @Column({ type: 'integer', default: 0 })
  count?: number;

  @Column({ type: 'integer', default: 0 })
  price?: number;

  @OneToOne(() => Member)
  @JoinColumn([
    {
      name: 'member_id',
      referencedColumnName: 'member_id',
    },
  ])
  member: Member;

  @OneToMany(() => Cart_Item, (cart_item) => cart_item.item, {cascade:true})
  cart_item: Cart_Item[];
}
