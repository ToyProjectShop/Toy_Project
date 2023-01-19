import { PointRequestDto } from './dto/point-request.dto';
import { AddressRequestDto } from './dto/address-request.dto';
import { EditPasswordDto } from './dto/edit-password-request.dto';
import { Member } from './../members/members.entity';
import { EditUsernameDto } from './dto/edit-username-request.dto';
import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { MypageService } from './mypage.service';
import { UndefinedtoNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Controller, Patch, UseInterceptors, UseGuards, Body, Post, Get } from '@nestjs/common';
import { Order } from 'src/orders/orders.entity';

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

  @ApiResponse({
    status: 201,
    description: '포인트 충전',
  })
  @ApiOperation({ summary: '포인트 충전' })
  @UseGuards(JwtAuthGuard)
  @Post('/point')
  async updatePoint(@CurrentUser() user: Member, @Body() pointDto: PointRequestDto) {
    await this.mypageService.updatePoint(user, pointDto);
    return { code: 3004 };
  }

  @ApiResponse({
    status: 201,
    description: '주문목록 조회',
  })
  @ApiOperation({ summary: '주문목록 조회' })
  @UseGuards(JwtAuthGuard)
  @Get('/orderlist')
  async findOrderByMemberId(@CurrentUser() user: Member): Promise<Order[]> {
    const data = await this.mypageService.findOrderByMemberId(user);
    return data;
  }
}
