import { Module } from '@nestjs/common';
import { Delivery } from './delivery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  controllers: [],
  providers: [],
})
export class DeliveryModule {}
