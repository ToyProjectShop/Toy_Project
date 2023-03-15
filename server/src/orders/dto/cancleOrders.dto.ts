import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateOrdersDto } from './createOrders.dto';

export class CancelOrderDto extends CreateOrdersDto {
  @IsNotEmpty()
  @IsNumber()
  item_id: number;

  @IsNotEmpty()
  @IsNumber()
  member_id: number;
}
