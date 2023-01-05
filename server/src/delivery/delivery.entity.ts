import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  delivery_id: number;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  zipcode: number;

  @Column()
  status: string;
}
