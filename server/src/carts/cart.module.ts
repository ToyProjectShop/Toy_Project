import { Module } from '@nestjs/common';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart_Item } from './cart_item.entity';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Item } from 'src/items/items.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Cart, Cart_Item, Item])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartModule {}
