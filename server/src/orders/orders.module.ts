import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Order_Item } from './order_item.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Member } from 'src/members/members.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, Order_Item, Member])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
