import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { userInfo } from 'os';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt.guard';
import { Category } from 'src/category/category.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { Member } from 'src/members/members.entity';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './items.entity';
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
  getItem(@CurrentUser() user: Member, @Param('item_id') item_id: number) {
    const result = this.itemService.getItem(user, item_id);
    return result;
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
    const result = this.itemService.getAllItem(user);
    return result;
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
  async createItem(@CurrentUser() user: Member, @Body() createItemDto: CreateItemDto): Promise<Item> {
    const result = await this.itemService.createItem(user, createItemDto);
    return result;
  }
  //상품수정
  @ApiOperation({
    summary: '상품 수정',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '상품수정 성공',
  })
  @Put('/:item_id')
  async updateItem(
    @CurrentUser() user: Member,
    @Param('item_id') item_id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    const result = await this.itemService.updateItem(user, item_id, updateItemDto);
    return result;
  }
  //상품삭제
  @ApiOperation({
    summary: '상품 삭제',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '상품삭제 성공',
  })
  @Delete('/:item_id')
  async deleteItem(@CurrentUser() user: Member, @Param('item_id') item_id: number) {
    const result = await this.itemService.deleteItem(user, item_id);
    if (!result) {
      return { code: '3002' };
    } else {
      return { code: 3103 };
    }
  }
}
