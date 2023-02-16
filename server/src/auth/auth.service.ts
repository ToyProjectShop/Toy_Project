import { LoginRequestDto } from './../members/dto/request/login-request.dto';
import { Member } from './../members/members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, ConflictException, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    const jwtAccessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' });
    const jwtRefreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '1d' });

    const currentHashedRefreshToken = await bcrypt.hash(jwtRefreshToken, 10);

    const memberId = member.member_id.toString();
    await this.cacheManager.set(memberId, currentHashedRefreshToken);

    return {
      jwtAccessToken,
      jwtRefreshToken,
    };
  }

  async jwtRefreshTokenLogIn(user: Member) {
    const payload = { email: user.email, sub: user.member_id };

    const jwtAccessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' });
    const jwtRefreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '1d' });

    const currentHashedRefreshToken = await bcrypt.hash(jwtRefreshToken, 10);
    await this.membersRepository.update(user.member_id, { refreshToken: currentHashedRefreshToken });

    return {
      jwtAccessToken,
      jwtRefreshToken,
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
