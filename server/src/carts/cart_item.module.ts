import { Module } from '@nestjs/common';
import { Cart_Item } from './cart_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Cart_Item])],
  controllers: [],
  providers: [],
})
export class CartItemModule {}
