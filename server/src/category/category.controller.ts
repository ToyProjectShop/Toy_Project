import { Body, Controller, Delete, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@ApiTags('CATEGORY')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //카테고리 생성
  @ApiOperation({
    summary: '카테고리 등록',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '카테고리 등록 성공',
  })
  @Post()
  async create(@CurrentUser() user, @Body() category_name: string): Promise<Category> {
    const result = await this.categoryService.create(user, category_name);
    console.log('category_name: ', category_name);
    return result;
  }
  //카테고리 수정
  @ApiOperation({
    summary: '카테고리 수정',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '카테고리 수정 성공',
  })
  @Put('/:category_id')
  async update(
    @CurrentUser() user,
    @Param('category_id') category_id: number,
    @Body() category_name: string,
  ): Promise<Category> {
    const result = await this.categoryService.update(user, category_id, category_name);
    return result;
  }
  //카테고리 삭제
  @ApiOperation({
    summary: '카테고리 삭제',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: '카테고리 삭제 성공',
  })
  @Delete('/:category_id')
  async deleteCategory(@CurrentUser() user, @Param('category_id') category_id: number) {
    const result = await this.categoryService.deleteCategory(user, category_id);
    return result;
  }
  //카테고리 조회 (검색기능 개발시 추가)
}
