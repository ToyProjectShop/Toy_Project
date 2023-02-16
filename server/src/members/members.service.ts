import { Cart } from './../carts/cart.entity';
import { Point } from './point.entity';
import { Address } from './address.entity';
import { Injectable, ConflictException } from '@nestjs/common';
import { Member } from './members.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(private dataSource: DataSource) {}

  async signUp(signupDto): Promise<number> {
    const { email, username, password, phone, city, street, zipcode, provider, snsId } = signupDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isUser = await queryRunner.manager.getRepository(Member).findOne({
        where: { email },
      });
      if (isUser) {
        throw new ConflictException('이미 존재하는 사용자입니다.');
      }
      const hashedPassword = await bcrypt.hash(password, 6);
      const saveUser = await queryRunner.manager.getRepository(Member).create({
        email,
        username,
        phone,
        password: hashedPassword,
        provider,
        snsId,
      });

      const member = await queryRunner.manager.getRepository(Member).save(saveUser);

      await queryRunner.manager.getRepository(Address).save({
        city,
        street,
        zipcode,
        member,
      });

      await queryRunner.manager.getRepository(Point).save({
        member,
      });

      await queryRunner.manager.getRepository(Cart).save({
        member,
      });
      return member.member_id;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
