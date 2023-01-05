import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  orderdate: Date;

  @Column()
  status: string;

  @Column()
  member_id: number;

  @Column()
  delivery_id: number;
}
