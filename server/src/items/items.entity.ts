import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  stockquantity: number;

  @Column()
  author: string;

  @Column()
  isbn: string;
}
