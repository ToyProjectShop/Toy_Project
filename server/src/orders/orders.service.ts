import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsOrderStatus, Order } from './orders.entity';
import { Order_Item } from './order_item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Order_Item)
    private readonly order_ItemRepository: Repository<Order_Item>,
  ) {}

  //1) 주문 저장하기
  async create(orderDto): Promise<Order> {
    const { count, price, city, street, zipcode, phone, item_id } = orderDto;

    const order = new Order();
    order.count = count;
    order.price = price;
    order.city = city;
    order.street = street;
    order.zipcode = zipcode;
    order.phone = phone;
    order.status = IsOrderStatus.order_complete;

    const result = await this.orderRepository.save(order);
    return result;
  }

  //2) 주문취소 하기 stutus order_complete-> order_cancel 업데이트 하기

  async update(order_id) {
    const result = await this.orderRepository.findOne({ where: { order_id } });
    console.log('result: ', result);
    result.status = IsOrderStatus.order_cancel;
    await this.orderRepository.update({ order_id: order_id }, { status: IsOrderStatus.order_cancel });
    return true;
  }
}
