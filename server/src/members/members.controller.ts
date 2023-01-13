import { UndefinedtoNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { SignupLocalRequestDto } from './dto/request/signup-local-request.dto';
import { MembersService } from './members.service';
import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('MEMBERS')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/auth')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiResponse({
    type: SignupLocalRequestDto,
    status: 200,
    description: '로컬 회원가입',
  })
  @ApiOperation({ summary: '로컬 회원가입' })
  @Post('/signup')
  async signUp(@Body() signupDto: SignupLocalRequestDto) {
    return await this.membersService.signUp(signupDto);
  }
}
