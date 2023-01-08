import { Module } from '@nestjs/common';
import { Order_Item } from './order_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order_Item])],
  controllers: [],
  providers: [],
})
export class OrderItemModule {}
