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
   * 회원가입이 되면 Cart table에 member_id가 자동으로 생성된다. count와 price 디폴트값은 0이다.
   * @currentUser에서 현재 로그인상태의 유저 정보를 user라는 변수에 담는다
   * @param user 현재 유저의 Member 테이블의 정보가 객체로 담겨있다
   * @Param item_id, 장바구니에 담는 상품의 item_id가 객체로 담겨있다
   * @Body 에는 createCartDto의 장바구니에 담을 상품의 정보가 담겨있다. 이 정보로 장바구니 테이블의 count,price를 업데이트 하는 로직 필요
   * Cart_Item(중간 테이블)에 cart_id, item_id를 저장 로직 필요
   * 장바구니에 담으려는 상품의 재고 확인 로직 필요
   * @returns api 명세서에 작성한 응답 코드
   */
  async createCart(user, createCartDto, item_id): Promise<any> {
    //장바구니에 담으려는 상품의 재고 확인, 재고가 있다면 현재 유저의 장바구니 상품 개수와 가격 업데이트
    const stockcheck = await this.itemRepository.findOne({ where: { item_id: item_id.item_id } });
    const itemcount = parseInt(createCartDto.count);

    if (stockcheck.stockquantity >= itemcount) {
      const savememberid = await this.cartsRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.member', 'member')
        .where('cart.member= :id', { id: user.member_id })
        .getOne();

      let updatecount = parseInt(createCartDto.count);
      let updateprice = parseInt(createCartDto.price);
      updatecount += savememberid.count;
      updateprice += savememberid.price;

      const savecount = this.cartsRepository.create({ count: updatecount });
      const saveprice = this.cartsRepository.create({ price: updateprice });

      const saveData = await this.cartsRepository.update(savememberid.cart_id, savecount);
      await this.cartsRepository.update(savememberid.cart_id, saveprice);

      //중간테이블 Cart_Item에 cart_id, item_id 저장
      const findcartid = await this.cartsRepository.findOne({ where: { cart_id: savememberid.cart_id } });
      const itemid = item_id.item_id;
      const finditemid = await this.itemRepository.findOne({ where: { item_id: itemid } });

      const saveCartItem = await this.cart_ItemRepository.save({ cart: findcartid, item: finditemid });
    } else {
      throw new HttpException('4100', 400);
    }
  }

  //장바구니 수정

  //장바구니 삭제

  //장바구니 조회
}
