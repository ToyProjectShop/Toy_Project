import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Order } from '../orders.entity';
export class CreateOrdersDto {
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @IsNotEmpty()
  @IsNumber()
  readonly zipcode: number;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @IsNotEmpty()
  @IsNumber()
  readonly item_id: number;

  @IsNotEmpty()
  @IsNumber()
  member_id: number;
}
