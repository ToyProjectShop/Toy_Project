import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/items.entity';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Cart_Item } from './cart_item.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(Cart_Item)
    private readonly cart_ItemRepository: Repository<Cart_Item>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  // 장바구니 생성

  //장바구니 담기
  async create(user, createCartDto): Promise<any> {
    // console.log('createCartDto: ', createCartDto);
    // console.log('user: ', user);
    try {
      const cart = new Cart();

      (cart.count = createCartDto.count), (cart.price = createCartDto.price), (cart.member = user);
      //   console.log('cart: ', cart);
      const result = await this.cartsRepository.save(cart);
      console.log('result: ', result);

      //   const findItemid = await this.itemRepository.findOne({ where: { item_id: createCartDto.item_id } });
      //   console.log('findItemid: ', findItemid);

      //   await this.cart_ItemRepository.save(result);

      return true;
    } catch (error) {
      console.log('error: ', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이미 장바구니에 담긴 상품입니다');
      }
      throw new HttpException('4100', 400);
    }
  }
  //장바구니 수정

  //장바구니 삭제

  //장바구니 조회
}
