import { LoginRequestDto } from './../members/dto/request/login-request.dto';
import { Member } from './../members/members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogIn(loginDto: LoginRequestDto) {
    const { email, password } = loginDto;

    const member = await this.membersRepository.findOne({
      where: {
        email,
      },
    });

    if (!member) {
      throw new ConflictException('이메일과 비밀번호를 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(password, member.password.toString());

    if (!isPasswordValidated) {
      throw new ConflictException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, sub: member.member_id };
    console.log(payload);

    return {
      token: this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET }),
    };
  }

  async kakaoLogIn(user) {
    console.log('authService user', user);
    const { email } = user;

    const member = await this.membersRepository.findOne({
      where: {
        email,
      },
    });

    if (!member) {
      throw new ConflictException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, sub: member.member_id };

    return {
      token: this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET }),
    };
  }
}
