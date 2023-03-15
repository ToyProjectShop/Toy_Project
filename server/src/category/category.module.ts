import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Item } from 'src/items/items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Item])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
