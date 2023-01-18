import { Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { Member } from 'src/members/members.entity';
import { ItemsService } from './items.service';

@ApiTags('ITEMS')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}
  //상품조회

  @ApiOperation({
    summary: '상품 단건 조회',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: '상품상세 조회 성공',
  })
  @Get('/:item_id')
  getItem(@CurrentUser() user: Member, @Param('item_id') item_id: string) {
    return;
  }

  //상품전체 조회
  @ApiOperation({
    summary: '상품 전체 조회',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: '상품전체 조회 성공',
  })
  @Get()
  getAllItem(@CurrentUser() user: Member) {
    return;
  }
  //상품등록
  @ApiOperation({
    summary: '상품 등록',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '상품등록 성공',
  })
  @Post()
  createItem() {}
  //상품수정
  //상품삭제
}
