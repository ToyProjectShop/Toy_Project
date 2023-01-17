import { EditUsernameDto } from './dto/edit-username-request.dto';
import { Point } from './../members/point.entity';
import { Address } from './../members/address.entity';
import { Member } from './../members/members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';

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
  async accountUserEdit(user: Member, editDto: EditUsernameDto) {
    try {
      //DB에서 error가 발생하면 catch문으로 이동하게 코드 작성
      const data = await this.membersRepository.update(user.member_id, editDto);
      return data;
    } catch {
      throw new HttpException('1103', 412);
    }
  }
}
