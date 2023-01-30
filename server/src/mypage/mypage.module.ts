import { Order } from 'src/orders/orders.entity';
import { Address } from './../members/address.entity';
import { Point } from './../members/point.entity';
import { Member } from './../members/members.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Point, Address, Order])],
  providers: [MypageService],
  controllers: [MypageController],
})
export class MypageModule {}
