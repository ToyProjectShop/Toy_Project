import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateCartDto } from 'src/carts/dto/createCart.dto';
import { Order } from '../orders.entity';
export class CancelOrderDto extends PartialType(CreateCartDto) {}
