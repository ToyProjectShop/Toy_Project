import { EditPasswordDto } from './dto/edit-password-request.dto';
import { EditUsernameDto } from './dto/edit-username-request.dto';
import { Point } from './../members/point.entity';
import { Address } from './../members/address.entity';
import { Member } from './../members/members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  /**
   * 회원이름 수정
   * @param user
   * @param editDto
   */
  async updateUsername(user: Member, usernameDto: EditUsernameDto) {
    try {
      //DB에서 error가 발생하면 catch문으로 이동하게 코드 작성
      const data = await this.membersRepository.update(user.member_id, usernameDto);
      return data;
    } catch {
      throw new HttpException('1103', 412);
    }
  }

  /**
   * 비밀번호 수정
   * @param user
   * @param editDto
   */
  async updatePassword(user: Member, passwordDto: EditPasswordDto) {
    try {
      const hashedPassword = await bcrypt.hash(passwordDto.password, 6);
      const updatePassword = this.membersRepository.create({
        password: hashedPassword,
      });

      //DB에서 error가 발생하면 catch문으로 이동하게 코드 작성
      const data = await this.membersRepository.update(user.member_id, updatePassword);
      return data;
    } catch {
      throw new HttpException('1105', 412);
    }
  }
}
