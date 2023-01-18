import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { Repository } from 'typeorm';
import { Item } from './items.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  //상품조회
  async getItem(user, item_id) {
    return await this.itemRepository.findOne({ where: { item_id } });
  }
  //상품전체 조회

  async getAllItem(user) {
    return await this.itemRepository.find();
  }
  //상품등록
  async createItem(user, createItemDto): Promise<Item> {
    const { item_name, price, image, description, stockquantity, category_id } = createItemDto;
    const item = new Item();
    (item.item_name = item_name),
      (item.price = price),
      (item.image = image),
      (item.descritpion = description),
      (item.stockquantity = stockquantity);
    item.category = category_id;

    const result = await this.itemRepository.save(item);
    return result;
  }
  //상품수정
  async updateItem(user, item_id, updateItemDto): Promise<Item> {
    const { item_name, price, image, description, stockquantity, category_id } = updateItemDto;
    const item = new Item();
    (item.item_name = item_name),
      (item.price = price),
      (item.image = image),
      (item.descritpion = description),
      (item.stockquantity = stockquantity);
    item.category = category_id;

    const result = await this.itemRepository.findOne({ where: { item_id } });
    await this.itemRepository.update({ item_id }, { ...item });
    return result;
  }
  //상품삭제
  async deleteItem(user, item_id) {
    const result = await this.itemRepository.findOne({ where: { item_id } });
    await this.itemRepository.softDelete(item_id);
    return true;
  }
}
