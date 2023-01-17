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
  async accountUserEdit(@CurrentUser() user: Member, @Body() editDto: EditUsernameDto) {
    await this.mypageService.accountUserEdit(user, editDto);
    return { code: 3001 };
  }
}
