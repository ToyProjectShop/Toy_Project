import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { check } from 'prettier';
import { Item } from 'src/items/items.entity';
import { Member } from 'src/members/members.entity';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // 1.매진된 상품을 장바구니에 담는지 재고 확인
      const stockcheck = await this.itemRepository.findOne({ where: { item_id: item_id.item_id } });
      const itemcount = parseInt(createCartDto.count);
      if (stockcheck.stockquantity < itemcount) throw new HttpException('4100', 400);

      //2. 현재 유저의 장바구니 가져오기
      const findmemberid = await this.cartsRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.member', 'member')
        .where('cart.member= :id', { id: user.member_id })
        .getOne();

      //3.현재 유저가 장바구니에 담긴 상품을 중복으로 등록하는지 확인
      const findcartid = await queryRunner.manager
        .getRepository(Cart)
        .findOne({ where: { cart_id: findmemberid.cart_id } });
      const finditemid = await queryRunner.manager.getRepository(Item).findOne({ where: { item_id: item_id.item_id } });
      console.log('finditemid: ', finditemid.item_id);
      const checkDup = await this.cart_ItemRepository

        .createQueryBuilder('dup')
        .leftJoinAndSelect('dup.cart', 'cart')
        .leftJoinAndSelect('dup.item', 'item')
        .where('dup.cart= :id', { id: findcartid.cart_id })
        .getMany();
      console.log('checkDup: ', checkDup);

      //4. 중복된 상품이 있다면 에러 처리하기
      const x = checkDup.map((x) => {
        if (x.item.item_id === finditemid.item_id && x.deletedAt === null) {
          console.log(x);
          throw new HttpException('4101', 400);
        }
      });

      //5. 장바구니를 담긴 수량과 가격에 맞게 수정하기
      let updatecount = parseInt(createCartDto.count);
      updatecount += findmemberid.count;
      let unitprice = parseInt(createCartDto.price);
      let updateprice = unitprice * updatecount;

      await queryRunner.manager
        .getRepository(Cart)
        .update(findmemberid.cart_id, { count: updatecount, price: updateprice });

      //6. 장바구니에 담긴 상품 정보를 Cart_Table에 itemCount, cart_id, item_id로 저장해주기
      const saveCartItem = await queryRunner.manager.getRepository(Cart_Item).save({
        cart: findcartid,
        item: finditemid,
        itemCount: createCartDto.count,
      });

      await queryRunner.commitTransaction();
      return saveCartItem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  /** 장바구니 수량 수정
   * 현재 유저가 장바구니에 담긴 상품의 수량을 수정하면, 수정된 개수 만큼 가격을 업데이트 시켜준다
   * @param user
   * @param item_id
   * @param updateCartDto
   * @returns api 명세서에 작성한 응답 코드
   */
  async updateCart(user, item_id, updateCartDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 수정하려는 상품의 재고 확인하기
      const item = await this.itemRepository.findOne({ where: { item_id: parseInt(item_id.item_id) } });
      if (item.stockquantity < parseInt(updateCartDto.count)) throw new HttpException('4100', 400);

      // 2. 현재 유저의 장바구니 정보를 불러오기
      const cart = await this.cartsRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.member', 'member')
        .where('cart.member = :id', { id: user.member_id })
        .getOne();
      // 3. 수정하려는 장바구니에 상품이 있는지 확인하고 없다면 에러 처리하기
      const cartItem = await this.cart_ItemRepository
        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('cartitem.cart = :id and item.item_id = :item_id', { id: cart.cart_id, item_id: item_id.item_id })
        .getOne();

      if (!cartItem) throw new HttpException('4102', 400);

      // 4.수정하려는 상품의 itemCount 수정하기
      await queryRunner.manager
        .getRepository(Cart_Item)
        .update(cartItem.cart_item_id, { itemCount: parseInt(updateCartDto.count) });

      // 5. 장바구니에 변경된 상품 수량과 가격 확인하여 최종적으로 장바구니의 price, count 수정하기
      const totalItemCount = await this.cart_ItemRepository

        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .where('cartitem.cart = :id', { id: cart.cart_id })
        .select('SUM(cartitem.itemCount)', 'totalItemCount')
        .getRawOne();
      console.log('totalItemCount: ', totalItemCount);
      const totalItem = totalItemCount.totalItemCount;

      console.log('totalItem: ', totalItem);

      const totalPrice = await this.cart_ItemRepository

        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('cartitem.cart = :id', { id: cart.cart_id })
        .select('SUM(cartitem.itemCount * item.price)', 'totalPrice')
        .getRawOne();
      const totalP = totalPrice.totalPrice;
      console.log('totalP: ', totalP);

      const isupdatedCount = await queryRunner.manager.getRepository(Cart).create({ count: totalItem });
      const isupdatedPrice = await queryRunner.manager.getRepository(Cart).create({ price: totalP });
      const isUpdated = await queryRunner.manager.getRepository(Cart).update(cart.cart_id, isupdatedCount);
      await queryRunner.manager.getRepository(Cart).update(cart.cart_id, isupdatedPrice);

      await queryRunner.commitTransaction();
      return isUpdated;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //장바구니 상품 삭제
  /**
   *장바구니에서 특정 상품만 삭제할 경우 Cart_Item 테이블에서 해당 데이터의 row 를 softdelete 해준다 
   Cart테이블에 cart_id의 count,price를 수정한다
   * @param user
   * @returns
   */

  async deleteOne(user, item_id: number): Promise<Cart_Item[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      //1. 현재 유저의 장바구니와 삭제하려는 상품이 존재하는지 확인하기
      const currentUser = await this.cartsRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.member', 'member')
        .where('cart.member = :id', { id: user.member_id })
        .getOne();

      const cart = await queryRunner.manager.getRepository(Cart).findOne({ where: { cart_id: currentUser.cart_id } });
      const item = await queryRunner.manager.getRepository(Item).findOne({ where: { item_id } });

      const cartItem = await this.cart_ItemRepository
        .createQueryBuilder('cartItem')
        .leftJoinAndSelect('cartItem.cart', 'cart')
        .leftJoinAndSelect('cartItem.item', 'item')
        .where('cartItem.cart = :id', { id: cart.cart_id })
        .getOne();

      if (!cartItem) {
        throw new HttpException('4103', 400);
      }
      //2. 장바구니에 선택한 상품이 삭제되면 수정해야할 count,price 계산 및 수정하기
      const updatedCount = cart.count - cartItem.itemCount;
      const updatedPrice = cart.price - cartItem.itemCount * item.price;
      const itemDeleted = await queryRunner.manager
        .getRepository(Cart)
        .update(cart.cart_id, { count: updatedCount, price: updatedPrice });

      //3. 삭제하는 아이템의 itemCount를 0으로 변경하고 softDelete 처리하기 (데이터베이스에서 완전히 삭제하는게 아니라 softDelete을 사용하여 데이터를 보관한다)
      const updatecartItem = await queryRunner.manager
        .getRepository(Cart_Item)
        .update(cartItem.cart_item_id, { itemCount: 0 });

      const deletecartItem = await queryRunner.manager
        .getRepository(Cart_Item)
        .softDelete({ cart_item_id: cartItem.cart_item_id });

      await queryRunner.commitTransaction();
      return [cartItem];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //장바구니 상품 전체 삭제
  async deleteAll(user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      //1. 현재 유저의 장바구니가 비어있는지 확인하기
      const memberId = user.member_id;
      const cart = await this.cartsRepository
        .createQueryBuilder('cart')
        .leftJoinAndSelect('cart.member', 'member')
        .where('cart.member = :id', { id: memberId })
        .getOne();
      if (!cart || (cart.count === 0 && cart.price === 0)) {
        throw new HttpException('4103', 400);
      }

      const cartId = (await queryRunner.manager.getRepository(Cart).findOne({ where: { cart_id: cart.cart_id } }))
        .cart_id;
      //2. 장바구니에 담긴 상품의 itemCount를 전체 0 으로 바꾸고 softDelete 처리하기
      const updateCartItem = await this.cart_ItemRepository
        .createQueryBuilder('cartitem')
        .update(Cart_Item)
        .set({ itemCount: 0 })
        .where('cart_id = :id', { id: cartId })
        .execute();

      const deleteCartItem = await this.cart_ItemRepository
        .createQueryBuilder('cartitem')
        .softDelete()
        .where('cart_id = :id', { id: cartId })
        .execute();
      //3. 장바구니의 count, price 를 0 으로 초기화 하기
      const resetCart = await queryRunner.manager.getRepository(Cart).update(cartId, { count: 0, price: 0 });

      await queryRunner.commitTransaction();

      return resetCart;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //장바구니 조회
  async findCart(user) {
    //1.현재 유저의 장바구니 정보 조회 하기
    const memberid = user.member_id;
    const cart = await this.cartsRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.member', 'member')
      .where('cart.member= :id', { id: memberid })
      .getOne();

    const cart_items = await this.cart_ItemRepository
      .createQueryBuilder('cartitem')
      .leftJoinAndSelect('cartitem.cart', 'cart')
      .leftJoinAndSelect('cartitem.item', 'item')
      .where('cartitem.cart= :id', { id: cart.cart_id })
      .getMany();

    if (!cart_items) {
      throw new HttpException('4104', 400);
    }
    //2. 장바구니의 총 수량과 가격, 그리고 상품의 상세 전보 전달하기
    const iteminfo = cart_items.map((x) => ({
      item_name: x.item.item_name,
      price: x.item.price,
      count: x.itemCount,
      image: x.item.image,
    }));

    const data = {
      count: cart.count,
      price: cart.price,
      item: iteminfo,
    };
    console.log('data: ', data);
    return [data];
  }
}
