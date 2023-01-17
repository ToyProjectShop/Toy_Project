import { AddressRequestDto } from './dto/address-request.dto';
import { EditPasswordDto } from './dto/edit-password-request.dto';
import { Member } from './../members/members.entity';
import { EditUsernameDto } from './dto/edit-username-request.dto';
import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { MypageService } from './mypage.service';
import { UndefinedtoNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Patch, UseInterceptors, UseGuards, Body } from '@nestjs/common';

@ApiTags('MyPage')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @ApiResponse({
    status: 201,
    description: '회원이름 수정',
  })
  @ApiOperation({ summary: '회원이름 수정' })
  @UseGuards(JwtAuthGuard)
  @Patch('/username')
  async updateUsername(@CurrentUser() user: Member, @Body() usernameDto: EditUsernameDto) {
    await this.mypageService.updateUsername(user, usernameDto);
    return { code: 3001 };
  }

  @ApiResponse({
    status: 201,
    description: '비밀번호 수정',
  })
  @ApiOperation({ summary: '비밀번호 수정' })
  @UseGuards(JwtAuthGuard)
  @Patch('/password')
  async updatePassword(@CurrentUser() user: Member, @Body() passwordDto: EditPasswordDto) {
    await this.mypageService.updatePassword(user, passwordDto);
    return { code: 3003 };
  }

  @ApiResponse({
    status: 201,
    description: '배송지 수정',
  })
  @ApiOperation({ summary: '배송지 수정' })
  @UseGuards(JwtAuthGuard)
  @Patch('/address')
  async updateAddress(@CurrentUser() user: Member, @Body() addressDto: AddressRequestDto) {
    await this.mypageService.updateAddress(user, addressDto);
    return { code: 3002 };
  }
}
