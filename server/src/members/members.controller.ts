import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { AuthService } from './../auth/auth.service';
import { UndefinedtoNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { SignupLocalRequestDto } from './dto/request/signup-local-request.dto';
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
    type: SignupLocalRequestDto,
    status: 200,
    description: '로컬 회원가입',
  })
  @ApiOperation({ summary: '로컬 회원가입' })
  @Post('/signup')
  async signUp(@Body() signupDto: SignupLocalRequestDto): Promise<number> {
    return await this.membersService.signUp(signupDto);
  }

  @ApiResponse({
    type: LoginRequestDto,
    status: 200,
    description: '로그인',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  logIn(@Body() loginDto: LoginRequestDto) {
    return this.authService.jwtLogIn(loginDto);
  }
}
