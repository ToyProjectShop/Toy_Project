import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  //카테고리 생성
  async create(user, category_name): Promise<Category> {
    console.log('user: ', user);
    try {
      const result = await this.categoryRepository.save(category_name);
      return result;
    } catch {
      throw new HttpException('5100', 400);
    }
  }

  //카테고리 수정
  async update(user, category_id, category_name): Promise<Category> {
    try {
      const result = await this.categoryRepository.findOne({ where: { category_id } });
      await this.categoryRepository.save(category_name);
      return result;
    } catch {
      throw new HttpException('5101', 400);
    }
  }
  //카테고리 삭제
  async deleteCategory(user, category_id) {
    try {
      const result = await this.categoryRepository.findOne({ where: { category_id } });
      await this.categoryRepository.softDelete({ category_id });
      return true;
    } catch {
      throw new HttpException('5102', 400);
    }
  }

  //카테고리조회 (검색기능 개발하면 추가)
}
