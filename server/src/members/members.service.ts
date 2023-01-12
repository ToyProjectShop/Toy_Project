import { Address } from './address.entity';
import { SignupLocalRequestDto } from './dto/request/signup-local-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { Member } from './members.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async signUp(signupDto: SignupLocalRequestDto) {
    const { email, username, password, phone, city, street, zipcode } = signupDto;
    const transformPhone = parseInt(phone);
    const transformZipcode = parseInt(zipcode);

    // 회원가입
    const isUser = await this.membersRepository.findOne({
      where: { email },
    });
    if (isUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 6);
    const saveUser = this.membersRepository.create({
      email,
      username,
      phone: transformPhone,
      password: hashedPassword,
    });
    console.log('saveUser', saveUser);

    return await this.membersRepository.save(saveUser);

    // address 등록
    // const resultData = await this.addressRepository.save({
    //   city,
    //   street,
    //   zipcode,
    //   member,
    // });
    // return resultData;
  }
}
