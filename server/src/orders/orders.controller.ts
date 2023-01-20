import { Body, Controller, Headers, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@ApiTags('ORDERS')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  //주문하기
  @ApiOperation({
    summary: '주문',
    description: '주문하기, 수량, 배송지 입력',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: CreateOrdersDto,
    status: 201,
    description: '주문 성공',
  })
  @Post()
  async create(@CurrentUser() user, @Body() orderDto: CreateOrdersDto): Promise<Order> {
    const result = await this.ordersService.create(user, orderDto);
    return result;
  }

  //주문취소
  @ApiOperation({
    summary: '주문취소',
    description: '주문상태 취소로 업데이트 ',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: CreateOrdersDto,
    status: 201,
    description: '주문취소 성공',
  })
  @Patch('cancel/:order_id')
  async update(@Param('order_id') order_id: number): Promise<Order> {
    const result = await this.ordersService.update(order_id);
    return;
  }
}
