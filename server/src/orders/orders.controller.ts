import { Body, Controller, Headers, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import e from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { Member } from 'src/members/members.entity';
import { CancelOrderDto } from './dto/cancleOrders.dto';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiResponse({
    status: 201,
    description: '주문 완료',
  })
  @ApiOperation({ summary: '주문 완료' })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createOrder(@CurrentUser() user: Member, @Body() order: CreateOrdersDto): Promise<Order> {
    console.log('user: ', user);
    order.member_id = user.member_id;
    const result = await this.ordersService.createOrder(user, order);
    return result;
  }
  @ApiResponse({
    status: 201,
    description: '주문 취소',
  })
  @ApiOperation({ summary: '주문 취소' })
  @UseGuards(JwtAuthGuard)
  @Post('/cancel/:order_id')
  async cancelOrder(
    @CurrentUser() user: Member,
    @Param('order_id') order_id: number,
    @Body() cancel: CancelOrderDto,
  ): Promise<Order> {
    const result = await this.ordersService.cancelOrder(user, order_id, cancel);
    return result;
  }
}
