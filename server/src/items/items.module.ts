import { Module } from '@nestjs/common';
import { Item } from './items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Category } from 'src/category/category.entity';
import { Cart } from 'src/carts/cart.entity';
import { Cart_Item } from 'src/carts/cart_item.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, Cart, Cart_Item])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
