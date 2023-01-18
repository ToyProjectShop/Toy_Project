import { Module } from '@nestjs/common';
import { Item } from './items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Category } from 'src/category/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Item, Category])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
