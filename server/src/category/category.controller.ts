import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UndefinedtoNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import { CategoryService } from './category.service';

@ApiTags('CATEGORY')
@UseInterceptors(UndefinedtoNullInterceptor)
@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  //카테고리 조회
  //카테고리 생성
  //카테고리 수정
  //카테고리 삭제
}
