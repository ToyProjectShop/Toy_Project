import { AdminAuthGuard } from './jwt/guards/admin.guard';
import { JwtRefreshStrategy } from './jwt/strategies/jwt.refresh.strategy';
import { KakaoStrategy } from './jwt/strategies/kakao.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './../members/members.entity';
import { JwtStrategy } from './jwt/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
  ],
  providers: [AuthService, JwtStrategy, KakaoStrategy, JwtRefreshStrategy, AdminAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
