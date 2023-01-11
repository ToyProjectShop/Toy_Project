import { Body, Controller, Headers, Param, Patch, Post } from '@nestjs/common';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() orderDto: CreateOrdersDto): Promise<Order> {
    const result = await this.ordersService.create(orderDto);
    return result;
  }

  @Patch('cancel/:order_id')
  async update(@Param('order_id') order_id: number): Promise<Order> {
    const result = await this.ordersService.update(order_id);
    return;
  }
}
