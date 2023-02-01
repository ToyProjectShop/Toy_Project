import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../../members/members.entity';
import { Payload } from '../jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    const member = await this.membersRepository.findOne({
      where: {
        member_id: payload.sub,
      },
    });

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, member.refreshToken);

    if (isRefreshTokenMatching) {
      return member; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
