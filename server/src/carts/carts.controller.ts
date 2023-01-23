import { Body, Controller, Param, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
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
  @ApiOperation({
    summary: '장바구니 생성',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '장바구니 생성 성공',
  })
  @Post('/:item_id')
  async createCart(
    @CurrentUser() user: Member,
    @Param() item_id: number,
    @Body() createCartDto: CreateCartDto,
  ): Promise<any> {
    await this.cartsService.createCart(user, createCartDto, item_id);

    return { code: 4000 };
  }

  //장바구니 담기
  // @ApiOperation({
  //   summary: '장바구니 담기',
  // })
  // @UseGuards(JwtAuthGuard)
  // @ApiResponse({
  //   status: 201,
  //   description: '장바구니 담기 성공',
  // })
  // @Put('')
  // async addCart(@CurrentUser() user: Member, @Body() createCartDto: CreateCartDto): Promise<any> {
  //   await this.cartsService.addCart(user, createCartDto);
  //   return { code: 4000 };
  // }

  //장바구니 수정

  //장바구니 삭제

  //장바구니 조회
}
