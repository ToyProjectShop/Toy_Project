import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/carts/cart.entity';
import { CartsService } from 'src/carts/carts.service';
import { Cart_Item } from 'src/carts/cart_item.entity';
import { Item } from 'src/items/items.entity';
import { Member } from 'src/members/members.entity';
import { Point } from 'src/members/point.entity';
import { DataSource, Equal, QueryRunner, Repository } from 'typeorm';
import { CancelOrderDto } from './dto/cancleOrders.dto';
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
    private readonly cartsService: CartsService,
  ) {}

  // 1) create order
  async createOrder(user: Member, order: CreateOrdersDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // 1. Check stock quantity
      const item = await this.itemRepository.findOne({
        where: { item_id: order.item_id },
      });
      if (!item || item.stockquantity < order.count) {
        throw new HttpException('2100', 400);
      }
      const updatedItem = item.stockquantity - order.count;

      await this.itemRepository.save({ ...item, stockquantity: updatedItem });
      console.log('updatedItem: ', updatedItem);

      // 2. Check point balance
      const checkPoint = await this.pointRepository.findOne({ where: { member: Equal(user.member_id) } });
      if (!checkPoint || checkPoint.point < order.price) {
        throw new HttpException('2101', 400);
      }
      const updatedPoint = checkPoint.point - order.price;
      await this.pointRepository.save({ ...checkPoint, point: updatedPoint });
      console.log('updatedPoint: ', updatedPoint);

      // 3. Create order entity
      const orderEntity = new Order();
      orderEntity.count = order.count;
      orderEntity.city = order.city;
      orderEntity.price = order.price;
      orderEntity.status = order.status;
      orderEntity.street = order.street;
      orderEntity.phone = order.phone;
      orderEntity.member = user;
      orderEntity.zipcode = order.zipcode;
      const createdOrder = await this.orderRepository.save(orderEntity);
      console.log('createdOrder: ', createdOrder);

      // 4. Create order item entity
      const orderItemEntity = new Order_Item();
      orderItemEntity.order = createdOrder;
      orderItemEntity.item = item;
      const createdOrderItem = await this.order_itemRepository.save(orderItemEntity);
      console.log('createdOrderItem: ', createdOrderItem);

      // 5. Delete cart item
      const cartItem = await this.cartItemRepository
        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('item.item_id = :item_id', { item_id: order.item_id })
        .andWhere('cart.member_id= :member_id', { member_id: user.member_id })
        .getOne();

      if (cartItem) {
        await this.cartItemRepository.softRemove(cartItem);
        const cart = await this.cartRepository.findOne({ where: { member: Equal(user.member_id) } });
        cart.count -= order.count;
        cart.price -= order.price;
        await this.cartRepository.save(cart);

        console.log('cart: ', cart);
      } else if (!cartItem) {
        throw new HttpException('2102', 400);
      }

      await queryRunner.commitTransaction();

      return createdOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  // 2) cancel order
  async cancelOrder(user: Member, order_id: number, cancel: CancelOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // 1. Find the order to be cancelled
      const order = await this.orderRepository.findOne({ where: { order_id }, relations: ['order_item'] });
      if (!order) {
        throw new HttpException('2102', 400);
      }

      // 2. Soft remove the order and its order items
      await this.order_itemRepository.softRemove(order.order_item);
      await this.orderRepository.softRemove(order);

      // 3. Update the member's point balance
      const point = await this.pointRepository.findOne({ where: { member: Equal(user.member_id) } });
      const updatedPoint = point.point + cancel.price;
      await this.pointRepository.save({ ...point, point: updatedPoint });

      // 4. Update the stock quantity of the cancelled item
      const item = await this.itemRepository.findOne({ where: { item_id: cancel.item_id } });
      const updatedStock = item.stockquantity + cancel.count;
      await this.itemRepository.save({ ...item, stockquantity: updatedStock });

      // 5. Commit the transaction
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
