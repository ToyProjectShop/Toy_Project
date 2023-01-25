import { SignUpInfo, ISignUpInfo } from './types/signup.type';
import { JwtRefreshAuthGuard } from './../auth/jwt/guards/jwt-refresh.guard';
import { KakaoAuthGuard } from '../auth/jwt/guards/kakao.guard';
import { JwtAuthGuard } from '../auth/jwt/guards/jwt.guard';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { AuthService } from './../auth/auth.service';
import { UndefinedtoNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { MembersService } from './members.service';
import { Controller, Post, Body, UseInterceptors, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('MEMBERS')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/auth')
export class MembersController {
  constructor(private readonly membersService: MembersService, private readonly authService: AuthService) {}

  @ApiResponse({
    type: CurrentUser,
    status: 200,
    description: '회원정보 조회',
  })
  @ApiOperation({ summary: '회원정보' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentMember(@CurrentUser() user) {
    return user;
  }

  @ApiResponse({
    status: 200,
    description: '로컬 회원가입',
  })
  @ApiOperation({ summary: '로컬 회원가입' })
  @Post('/signup')
  signUp(@Body() signupDto: ISignUpInfo): Promise<number> {
    const payload = SignUpInfo.Request(signupDto);
    return this.membersService.signUp(payload);
  }

  @ApiResponse({
    status: 200,
    description: '로그인',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  logIn(@Body() loginDto: LoginRequestDto) {
    return this.authService.jwtLogIn(loginDto);
  }

  @ApiResponse({
    status: 200,
    description: 'refreshToken success',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  refresh(@CurrentUser() user) {
    const result = this.authService.jwtRefreshTokenLogIn(user);
    return result;
  }

  @ApiOperation({ summary: '카카오 로그인 접근 API' })
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao')
  kakao() {
    return 'ok';
  }

  @ApiResponse({
    type: CurrentUser,
    status: 200,
    description: '카카오 로그인 Response',
  })
  @ApiOperation({ summary: '카카오 로그인' })
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao-callback')
  kakaoLogIn(@CurrentUser() user) {
    return this.authService.kakaoLogIn(user);
  }
}
