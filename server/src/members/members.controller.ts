import { SignupLocalRequestDto } from './dto/request/signup-local-request.dto';
import { MembersService } from './members.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('api/auth')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('/signup')
  async create(@Body() signupDto: SignupLocalRequestDto) {
    return await this.membersService.signUp(signupDto);
  }
}
