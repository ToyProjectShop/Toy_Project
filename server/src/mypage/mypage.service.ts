import { Order } from './../orders/orders.entity';
import { PointRequestDto } from './dto/point-request.dto';
import { AddressRequestDto } from './dto/address-request.dto';
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
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
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

  /**
   * 배송지 수정
   * @param user
   * @param addressDto
   */
  async updateAddress(user: Member, addressDto: AddressRequestDto) {
    try {
      const addressData = await this.addressRepository
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.member', 'm')
        .where('a.member = :id', { id: user.member_id })
        .getOne();

      const data = await this.addressRepository.update(addressData.address_id, addressDto);
      return data;
    } catch {
      throw new HttpException('1105', 412);
    }
  }

  /**
   * 포인트 충전
   * @param user
   * @param pointDto
   */
  async updatePoint(user: Member, pointDto: PointRequestDto) {
    // parseInt로 pointDto.point 형변환
    let transformPoint = parseInt(pointDto.point);
    try {
      const pointData = await this.pointRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.member', 'm')
        .where('p.member = :id', { id: user.member_id })
        .getOne();

      transformPoint += pointData.point;
      const updatePoint = this.pointRepository.create({
        point: transformPoint,
      });

      const data = await this.pointRepository.update(pointData.point_id, updatePoint);
      return data;
    } catch {
      throw new HttpException('1105', 412);
    }
  }

  /**
   * 주문목록 조회
   * @param user
   */
  async findOrderByMemberId(user: Member) {
    try {
      const orderData = await this.ordersRepository
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.member', 'm')
        .where('o.member = :id', { id: user.member_id })
        .getMany();
      return orderData;
    } catch {
      throw new HttpException('1105', 412);
    }
  }
}
