import { Module } from '@nestjs/common';
import { Item } from './items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [],
  providers: [],
})
export class ItemsModule {}
