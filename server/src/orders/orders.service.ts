import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  //1) 주문 저장하기
  async create(order): Promise<Order> {
    const create = this.orderRepository.create(order);
    const result = await this.orderRepository.save({ ...order });
    return result;
  }

  //2) 주문이 저장되면 status default -> order_complete  업데이트하기

  //3) 주문취소 하기 stutus order_complete-> order_cancel 업데이트 하기
}
