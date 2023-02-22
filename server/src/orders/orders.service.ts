import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/carts/cart.entity';
import { CartsController } from 'src/carts/carts.controller';
import { CartsService } from 'src/carts/carts.service';
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
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly dataSource: DataSource,
    private readonly cartsService: CartsService, // private readonly cartsController: CartsController,
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
      const point = checkPoint.point - order.price;
      console.log('point: ', point);

      const isupdatedPoint = await queryRunner.manager.getRepository(Point).create({ point: point });
      const isupdated = await queryRunner.manager.getRepository(Point).update(user.member_id, isupdatedPoint);
      //회원의 배송지, 주문 정보를 order table에 저장 시킨다
      const data = new Order();
      data.count = order.count;
      data.city = order.city;
      data.price = order.price;
      data.phone = order.phone;
      data.status = order.status;
      data.street = order.street;
      data.member = order.member_id;
      data.zipcode = order.zipcode;
      const create = await queryRunner.manager.getRepository(Order).create(data);
      console.log('create: ', create);

      const orderSave = await queryRunner.manager.getRepository(Order).save(create);

      // 저장된 주문 정보에서 order_id와 item_id를 조회해서 order_item 테이블에 저장시킨다
      const finditemid = order.item_id;
      const orderitemSave = await queryRunner.manager.getRepository(Order_Item).save({
        order: orderSave,
        item: finditemid,
      });
      console.log('orderitemSave: ', orderitemSave);
      // //장바구니에서 주문한 상품을 삭제한다
      const findCartItem = await this.cartItemRepository

        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('item.item_id = :item_id', { item_id: finditemid })
        .getMany();
      console.log('findCartItem: ', findCartItem);
      if (findCartItem) {
        const findcart = findCartItem.map((x) => parseInt(x.cart.cart_id.toString(), 10) === user.member_id);
        const cartid = findCartItem.map((x) => x.cart.cart_id);
        const countupdate = findCartItem.map((x) => x.cart.count - x.itemCount);
        const priceupdate = findCartItem.map((x) => x.cart.price - x.itemCount * x.item.price);
        const findcartitemid = findCartItem.map((x) => x.cart_item_id);
        //cart 테이블 수정
        for (let i = 0; i < findcart.length; i++) {
          const cart_id = cartid[i];
          console.log('cart_id: ', cart_id);
          const cart = await queryRunner.manager.getRepository(Cart).findOne({ where: { cart_id } });
          console.log('cart: ', cart);
          const isupdated = await queryRunner.manager

            .getRepository(Cart)
            .update(cart_id, { count: countupdate[i], price: priceupdate[i] });
          console.log('updated: ', isupdated);
        }
        //cart_item 테이블에서 itemCount 0 변경후 softDelete
        for (let i = 0; i < findcartitemid.length; i++) {
          const cart_item_id = parseInt(findcartitemid[i].toString(), 10);
          console.log('cart_item_id: ', cart_item_id);
          await queryRunner.manager.getRepository(Cart_Item).findOne({ where: { cart_item_id } });
          const zero = 0;
          const updatecartItem = await queryRunner.manager
            .getRepository(Cart_Item)
            .update(cart_item_id, { itemCount: zero });
          const deleted = await queryRunner.manager.getRepository(Cart_Item).softDelete(cart_item_id);
          console.log('updatecartItem: ', updatecartItem);
        }
        //item 재고수량 차감
        const updatestock = checkStock.stockquantity - order.count;
        console.log('updatestock: ', updatestock);
        const isupdatedStock = await queryRunner.manager
          .getRepository(Item)
          .update(checkStock.item_id, { stockquantity: updatestock });
      }

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //2) 주문취소 하기
  async cancel(user, order_id, cancel): Promise<Order> {
    console.log('cancel: ', cancel);
    console.log('order_item_id: ', order_id);
    const orderid = parseInt(order_id);
    const checkorder = await this.orderRepository.findOne({ where: { order_id: orderid } });
    console.log('checkorder: ', checkorder);
    if (!checkorder) {
      throw new HttpException('2102', 400);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      //삭제할 주문 정보 찾기
      const checkItem = await this.order_itemRepository
        .createQueryBuilder('orderitem')
        .leftJoinAndSelect('orderitem.order', 'order')
        .leftJoinAndSelect('orderitem.item', 'item')
        .where('order.order_id = :order_id', { order_id: orderid })
        .andWhere('item.item_id = :item_id', { item_id: cancel.item_id })
        .getOne();
      console.log('checkItem: ', checkItem);

      //주문 정보 삭제하기
      const deleteOrder = await queryRunner.manager.getRepository(Order).softDelete(checkItem.order.order_id);
      const deleteOrderItem = await queryRunner.manager.getRepository(Order_Item).softDelete(checkItem.order_item_id);

      //재고 되돌리기
      const checkStock = await this.itemRepository.findOne({ where: { item_id: checkItem.item.item_id } });
      const stock = checkStock.stockquantity + cancel.count;
      const restock = await queryRunner.manager
        .getRepository(Item)
        .update(checkStock.item_id, { stockquantity: stock });
      console.log('restock: ', restock);

      //point 환불하기
      const checkPoint = await this.pointRepository.findOne({ where: { member: user.member_id } });
      console.log('checkPoint: ', checkPoint);
      const point = checkPoint.point + cancel.price;
      console.log('point: ', point);
      const refund = await queryRunner.manager.getRepository(Point).update(user.member_id, { point: point });
      console.log('refund: ', refund);

      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
