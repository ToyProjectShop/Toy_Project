import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../../members/members.entity';
import { Payload } from '../jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const member = await this.membersRepository.findOne({
      where: {
        member_id: payload.sub,
      },
    });
    if (member.isAdmin) {
      return member; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
