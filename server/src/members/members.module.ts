import { AuthModule } from './../auth/auth.module';
import { Address } from './address.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from './members.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Point } from './point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Point, Address]), AuthModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
