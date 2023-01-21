import { Body, Controller, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { Member } from 'src/members/members.entity';
import { Cart } from './cart.entity';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/createCart.dto';

@ApiTags('CATEGORY')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  //장바구니 생성

  //장바구니 담기
  @ApiOperation({
    summary: '장바구니 등록',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '카테고리 등록 성공',
  })
  @Post('')
  async create(@CurrentUser() user: Member, @Body() createCartDto: CreateCartDto): Promise<any> {
    const result = await this.cartsService.create(user, createCartDto);
    return { code: 4000 };
  }

  //장바구니 수정

  //장바구니 삭제

  //장바구니 조회
}
