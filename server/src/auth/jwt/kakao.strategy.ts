import { Member } from './../../members/members.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENTID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const isMember = await this.membersRepository.findOne({
      where: {
        snsId: profile.id,
        provider: 'kakao',
      },
    });
    if (isMember) {
      done(null, isMember);
    } else {
      const profilejson = profile._json;
      const kakao_account = profilejson.kakao_acount;
      const data = {
        username: kakao_account.profile.name,
        snsId: profilejson.id,
        email: kakao_account.has_email && !kakao_account.email_needs_agreement ? kakao_account.email : null,
        provider: 'kakao',
      };
      const newMember = await this.membersRepository.save(data);
      done(null, newMember);
    }
  }
}
