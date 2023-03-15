import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Order_Item } from './order_item.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Item } from 'src/items/items.entity';
import { Point } from 'src/members/point.entity';
import { Cart_Item } from 'src/carts/cart_item.entity';
import { Cart } from 'src/carts/cart.entity';
import { CartsService } from 'src/carts/carts.service';
import { CartsController } from 'src/carts/carts.controller';
import { Member } from 'src/members/members.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, Order_Item, Item, Point, Cart_Item, Cart, Member])],
  controllers: [OrdersController, CartsController],
  providers: [OrdersService, CartsService],
})
export class OrdersModule {}
