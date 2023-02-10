import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart_Item } from 'src/carts/cart_item.entity';
import { Item } from 'src/items/items.entity';
import { Point } from 'src/members/point.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrdersDto } from './dto/createOrders.dto';
import { Order } from './orders.entity';
import { Order_Item } from './order_item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Order_Item)
    private readonly order_itemRepository: Repository<Order_Item>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectRepository(Cart_Item)
    private readonly cartItemRepository: Repository<Cart_Item>,
    private readonly dataSource: DataSource,
  ) {}

  //1) 주문 저장하기
  async create(user, order): Promise<Order> {
    console.log(' order: ', order);
    //주문 수량이 재고 수 보다 많은지 확인 후 주문 하는 트랜잭션 시작
    const checkStock = await this.itemRepository.findOne({ where: { item_id: order.item_id } });
    console.log('checkStock: ', checkStock);
    console.log('order.item_id: ', order.item_id);
    if ((await checkStock).stockquantity < order.count) {
      throw new HttpException('2100', 400);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 회원의 포인트 잔액을 확인 한다
      const checkPoint = await this.pointRepository.findOne({ where: { member: user.member_id } });
      console.log('member: user.member_id: ', user.member_id);
      console.log('checkPoint: ', checkPoint);
      if (checkPoint.point < order.price) {
        console.log('checkPoint: ', checkPoint);
        throw new HttpException('2101', 400);
      }
      //회원의 배송지, 주문 정보를 order table에 저장 시킨다
      const create = await queryRunner.manager.getRepository(Order).create(order);
      const orderSave = await queryRunner.manager.getRepository(Order).save({ ...order });
      console.log('orderSave: ', orderSave);

      // 저장된 주문 정보에서 order_id와 item_id를 조회해서 order_item 테이블에 저장시킨다
      const findorderid = await this.orderRepository.findOne({ where: { order_id: orderSave.order_id } });
      const orderitemSave = await queryRunner.manager.getRepository(Order_Item).create(orderSave.order_id);
      await queryRunner.manager.getRepository(Order_Item).create(orderSave.item_id);
      await queryRunner.manager.getRepository(Order_Item).save(orderitemSave);

      //장바구니에서 주문한 상품을 삭제한다

      await queryRunner.commitTransaction();

      return orderSave;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //2) 주문취소 하기
  async cancel(user, order_id): Promise<Order> {
    const result = await this.orderRepository.softDelete(order_id);
    // const result = await this.orderRepository.save({ ...order });
    return;
  }
}
