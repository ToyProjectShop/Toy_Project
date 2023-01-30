import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/order')
  async create(@Body() order: CreateOrdersDto): Promise<Order> {
    const result = await this.ordersService.create(order);
    return result;
  }
  // update(order_id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} population`;
  // }
  // remove(order_id: number) {
  //   return `This action removes a #${id} population`;
  // }
}
