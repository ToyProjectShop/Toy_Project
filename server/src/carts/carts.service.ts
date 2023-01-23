import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/items.entity';
import { Member } from 'src/members/members.entity';
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
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  /** 장바구니 생성
   * @currentUser에서 장바구니 테이블에 member_id가져와서 user라는 변수에 넣어주기
   * @param user (current user의 member_id가 담겨있다)
   * querybuilder 또는 relations로 member_id를 조회해서 변수에 담고 Cart 레포에 저장  cart_id 1 member_id 1 count 0 price 0
   * @param createCartDto (프런트에서 전달한 상품정보가 담겼다 count, price)
   * await this.cartRepository.update({cart_id},{creatCartDto})
   * @Param item_id
   * @Body 로 들어온 정보들로 장바구니 테이블 업데이트
   * Body에서 받은 count, price로 업데이트 필요 (디폴트는 0,0 임)
   * Cart_Item 테이블 cart_id cartRepository에서 findOne, item_id itemRepository에서 findOne
   * (중간 테이블)에 cart_id, item_id를 저장 로직
   * @returns api 명세서에 작성한 응답 코드
   */
  async createCart(user, createCartDto, item_id): Promise<any> {
    const savememberid = await this.cartsRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.member', 'member')
      .where('cart.member= :id', { id: user.member_id })
      .getOne();

    const isupdated = await this.cartsRepository.update(savememberid.cart_id, createCartDto);

    // let updatecount = parseInt(createCartDto.count);
    // let updateprice = parseInt(createCartDto.price);
    // updatecount += savememberid.count;
    // updateprice += savememberid.price;
    // const savecount = this.cartsRepository.create({ count: updatecount });
    // const saveprice = this.cartsRepository.create({ price: updateprice });

    // const saveData = await this.cartsRepository.update(savememberid.cart_id, savecount);
    // await this.cartsRepository.update(savememberid.cart_id, saveprice);
    // return saveData;
  }

  //장바구니 수정

  //장바구니 삭제

  //장바구니 조회
}
