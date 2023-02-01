import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { Member } from 'src/members/members.entity';
import { Cart } from './cart.entity';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/createCart.dto';
import { UpdateCartDto } from './dto/updateCart.dto';

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
    const result = await this.cartsService.createCart(user, createCartDto, item_id);
    // console.log('result: ', result);
    if (!result) {
      return { code: '4101' };
    } else {
      return { code: 4000 };
    }
  }

  //장바구니 수정
  @ApiOperation({
    summary: '장바구니 수정',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '장바구니 수정 성공',
  })
  @Patch('/:item_id')
  async updateCart(
    @CurrentUser() user: Member,
    @Param() item_id: number,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<any> {
    const result = await this.cartsService.updateCart(user, item_id, updateCartDto);
    if (!result) {
      return { code: '4102' };
    } else {
      return { code: 4004 };
    }
  }

  //장바구니 상품 하나 삭제
  @ApiOperation({
    summary: '장바구니 상품 삭제',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '장바구니에서 상품 삭제 성공',
  })
  @Delete('/:item_id')
  async deleteOne(@CurrentUser() user: Member, @Param() item_id: number): Promise<any> {
    const result = await this.cartsService.deleteOne(user, item_id);
    if (!result) {
      return { code: '4103' };
    } else {
      return { code: 4001 };
    }
  }

  //장바구니 전체 삭제
  @ApiOperation({
    summary: '장바구니 전체 삭제',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '장바구니 초기화 성공',
  })
  @Delete('/')
  async deleteAll(@CurrentUser() user: Member): Promise<any> {
    const result = await this.cartsService.deleteAll(user);
    if (!result) {
      return { code: '4104' };
    } else {
      return { code: 4002 };
    }
  }
  //장바구니 조회
  @ApiOperation({
    summary: '장바구니 생성',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: '장바구니 생성 성공',
  })
  @Get('')
  async findCart(@CurrentUser() user: Member): Promise<any> {
    await this.cartsService.findCart(user);

    return { code: 4003 };
  }
}
