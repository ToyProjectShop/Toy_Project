import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/items.entity';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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
      await this.categoryRepository.update(category_id, category_name);
      return result;
    } catch {
      throw new HttpException('5101', 400);
    }
  }
  //카테고리 삭제
  async deleteCategory(user, category_id) {
    try {
      //1.삭제하려는 카테고리가 존재하는지 체크한다
      const category = await this.categoryRepository.findOne({ where: { category_id } });
      console.log('category: ', category);
      const categoryid = parseInt(category_id)
      if (!category) {
        throw new HttpException('5102', 400);
      }
      //2. 삭제하려는 카테고리의 cartegory_id로 생성된 상품을 Item테이블에서 찾아서 softDelte해준다
      const items = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .where('item.category= :category_id', { category_id: category_id })
      .getMany();
    
      if (items.length > 0) {
        items.forEach(async item => {
          item.deletedAt = new Date();
          await this.itemRepository.save(item);
        });
      }
      //3. Category 테이블에서 해당 category_id를 softDelete 해준다 
      category.deletedAt = new Date();
      return await this.categoryRepository.save(category);
      
    } catch (error) {
      throw new HttpException('5100', 400);
    }
  }
  
  //카테고리조회 (검색기능 개발하면 추가)
}
