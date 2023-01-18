import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './items.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
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
  async createItem() {}
  //상품수정
  //상품삭제
}
