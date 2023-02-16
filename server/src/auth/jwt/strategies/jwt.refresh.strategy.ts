import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../../members/members.entity';
import { Payload } from '../jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const redisMemberRTK: any = await this.cacheManager.get(payload.sub.toString());
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, redisMemberRTK);

    if (isRefreshTokenMatching) {
      return member; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
