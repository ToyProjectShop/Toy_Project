import { Module } from '@nestjs/common';
import { Cart } from './cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  controllers: [],
  providers: [],
})
export class CartModule {}
