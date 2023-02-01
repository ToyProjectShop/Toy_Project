// import { ConflictException, HttpException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { check } from 'prettier';
// import { Item } from 'src/items/items.entity';
// import { Member } from 'src/members/members.entity';
// import { DataSource, Repository } from 'typeorm';
// import { Cart } from './cart.entity';
// import { Cart_Item } from './cart_item.entity';

// @Injectable()
// export class CartsService {
//   constructor(
//     @InjectRepository(Cart)
//     private readonly cartsRepository: Repository<Cart>,
//     @InjectRepository(Cart_Item)
//     private readonly cart_ItemRepository: Repository<Cart_Item>,
//     @InjectRepository(Item)
//     private readonly itemRepository: Repository<Item>,
//     @InjectRepository(Member)
//     private readonly memberRepository: Repository<Member>,
//     private readonly dataSource: DataSource,
//   ) {}

//   /** 장바구니 생성
//    * 회원가입이 되면 Cart table에 member_id가 자동으로 생성된다. count와 price 디폴트값은 0이다.
//    * @currentUser에서 현재 로그인상태의 유저 정보를 user라는 변수에 담는다
//    * @param user 현재 유저의 Member 테이블의 정보가 객체로 담겨있다
//    * @Param item_id, 장바구니에 담는 상품의 item_id가 객체로 담겨있다
//    * @Body 에는 createCartDto의 장바구니에 담을 상품의 정보가 담겨있다. 이 정보로 장바구니 테이블의 count,price를 업데이트 하는 로직 필요
//    * Cart_Item(중간 테이블)에 cart_id, item_id를 저장 로직 필요
//    * 장바구니에 담으려는 상품의 재고 확인 로직 필요
//    * @returns api 명세서에 작성한 응답 코드
//    */
//   async createCart(user, createCartDto, item_id): Promise<any> {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();

//     // ============== transaction 시작!! ==============
//     await queryRunner.startTransaction();
//     // ===============================================

//     //1.장바구니에 담으려는 상품의 재고 확인

//     const stockcheck = await this.itemRepository.findOne({ where: { item_id: item_id.item_id } });

//     const itemcount = parseInt(createCartDto.count);
//     if (stockcheck.stockquantity < itemcount) throw new HttpException('4100', 400);
//     try {
//       //2. 재고가 있다면 현재 유저의 member_id로 cart_id를 찾아서 장바구니에 담긴 상품 개수와 가격으로 업데이트

//       const findmemberid = await this.cartsRepository
//         .createQueryBuilder('cart')
//         .leftJoinAndSelect('cart.member', 'member')
//         .where('cart.member= :id', { id: user.member_id })
//         .getOne();

//       let updatecount = parseInt(createCartDto.count);
//       let unitprice = parseInt(createCartDto.price);
//       let updateprice = unitprice * updatecount;
//       updatecount += findmemberid.count;
//       console.log('findmemberid.count: ', findmemberid.count);
//       updateprice = updatecount * updateprice;
//       console.log('updateprice: ', updateprice);
//       console.log('updatecount : ', updatecount);

//       await queryRunner.manager
//         .getRepository(Cart)
//         .update(findmemberid.cart_id, { count: updatecount, price: updateprice });

//       // const savecount = await queryRunner.manager.getRepository(Cart).create({ count: updatecount });
//       // const saveprice = await queryRunner.manager.getRepository(Cart).create({ price: updateprice });

//       // await queryRunner.manager.getRepository(Cart).update(findmemberid.cart_id, savecount);
//       // await queryRunner.manager.getRepository(Cart).update(findmemberid.cart_id, saveprice);

//       //3. 현재 유저의 장바구니에 중복된 아이템이 담겨있는지 체크하는 로직, 중복아이템이 있다면 롤백
//       const findcartid = await queryRunner.manager
//         .getRepository(Cart)
//         .findOne({ where: { cart_id: findmemberid.cart_id } });
//       const finditemid = await queryRunner.manager.getRepository(Item).findOne({ where: { item_id: item_id.item_id } });

//       const checkDup = await this.cart_ItemRepository
//         .createQueryBuilder('dup')
//         .leftJoinAndSelect('dup.cart', 'cart')
//         .leftJoinAndSelect('dup.item', 'item')
//         .where('dup.cart= :id', { id: findcartid.cart_id })
//         .getMany();

//       checkDup.map((x) => {
//         if (x.item.item_id === finditemid.item_id) {
//           console.log('finditemid.item_id: ', finditemid.item_id);
//           console.log('x.item.item_id: ', x.item.item_id);
//           throw new HttpException('4101', 400);
//         }
//       });
//       //4. 중간테이블 Cart_Item에 cart_id, item_id 저장
//       const saveCartItem = await queryRunner.manager.getRepository(Cart_Item).save({
//         cart: findcartid,
//         item: finditemid,
//         itemCount: createCartDto.count,
//       });

//       // ============== commit 성공 확정!!! ==============
//       await queryRunner.commitTransaction();
//       // ===============================================
//       return saveCartItem;
//     } catch (error) {
//       // ============== rollback 되돌리기!!! ==============
//       await queryRunner.rollbackTransaction();
//       // ===============================================
//     } finally {
//       // ============== 연결 해제!!! ==============
//       await queryRunner.release();
//       // ========================================
//     }
//   }

//   /** 장바구니 수량 수정
//    * 현재 유저가 장바구니에 담긴 상품의 수량을 수정하면, 수정된 개수 만큼 가격을 업데이트 시켜준다
//    * @param user
//    * @param item_id
//    * @param updateCartDto
//    * @returns api 명세서에 작성한 응답 코드
//    */
//   async updateCart(user, item_id, updateCartDto) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();

//     // ============== transaction 시작!! ==============
//     await queryRunner.startTransaction();
//     // ===============================================

//     //1.수정할 상품 수량 재고 확인
//     const itemid = parseInt(item_id.item_id);
//     const stockcheck = await this.itemRepository.findOne({ where: { item_id: itemid } });
//     const itemcount = parseInt(updateCartDto.count);

//     if (stockcheck.stockquantity < itemcount) throw new HttpException('4100', 400);

//     try {
//       //2. 현재 유저의 cart_id와 파라미터로 받은 item_id로 Cart_Item 테이블을 조회한다. (Cart와 Item 테이블을 leftjoin시켜 조회한다)
//       const currentuser = await this.cartsRepository
//         .createQueryBuilder('cart')
//         .leftJoinAndSelect('cart.member', 'member')
//         .where('cart.member= :id', { id: user.member_id })
//         .getOne();

//       const findcartid = await queryRunner.manager
//         .getRepository(Cart)
//         .findOne({ where: { cart_id: currentuser.cart_id } });

//       const finditemid = await queryRunner.manager.getRepository(Item).findOne({ where: { item_id: item_id.item_id } });

//       const checkCart_Item = await this.cart_ItemRepository
//         .createQueryBuilder('cartitem')
//         .leftJoinAndSelect('cartitem.cart', 'cart')
//         .leftJoinAndSelect('cartitem.item', 'item')
//         .where('cartitem.cart= :id', { id: findcartid.cart_id })
//         .getMany();
//       // console.log('checkCart_Item: ', checkCart_Item);

//       //cart_id로 조회한 객체 배열에서 item_id가 finditem.item_id인 객체를 찾는다
//       const data = checkCart_Item.find((e) => e.item.item_id === finditemid.item_id);
//       // console.log('data: ', data);
//       if (!data) {
//         throw new HttpException('4102', 400);
//       }

//       //3-1.  Cart_Item 테이블에서 data의 row에서 itemCount를 updateCarDto에서 받은 count 로 업데이트 해준다
//       let updatecount = parseInt(updateCartDto.count);
//       const updateitemCount = await queryRunner.manager.getRepository(Cart_Item).create({ itemCount: updatecount });
//       await queryRunner.manager.getRepository(Cart_Item).update(data.cart_item_id, updateitemCount);
//       console.log('updateitemCount: ', updateitemCount.itemCount);

//       //3-2. Cart_Item 테이블에서 업데이트 된 cart_id의 상품의 총 합계와, 상품별 가격의 합을 구한다
//       //장바구니에 담긴 cart_id 총 상품의 개수를 찾는다
//       const getSum = await this.cart_ItemRepository
//         .createQueryBuilder('cartitem')
//         .leftJoinAndSelect('cartitem.cart', 'cart')
//         .leftJoinAndSelect('cartitem.item', 'item')
//         .where('cartitem.cart= :id', { id: findcartid.cart_id })
//         .select('SUM(cartitem.itemCount)', 'totalItemCount')
//         .getRawOne();

//       const totalItemCount = getSum.totalItemCount;
//       console.log('totalItemCount: ', totalItemCount);
//       //cart_id 상품 개수와 상품의 unitprice를 조회해서 cart_id의 총 가격을 계산한다
//       const totalPrice = checkCart_Item.reduce((sum, item) => {
//         return sum + item.itemCount * item.item.price;
//       }, 0);
//       console.log('Total price: ', totalPrice);

//       //위에서 구한 상품 개수, 가격을 가지고 이제 Cart 테이블에 업데이트 시킨다
//       const isupdatedCount = await queryRunner.manager.getRepository(Cart).create({ count: totalItemCount });
//       const isupdatedPrice = await queryRunner.manager.getRepository(Cart).create({ price: totalPrice });

//       await queryRunner.manager.getRepository(Cart).update(currentuser.cart_id, isupdatedCount);
//       await queryRunner.manager.getRepository(Cart).update(currentuser.cart_id, isupdatedPrice);

//       // ============== commit 성공 확정!!! ==============
//       await queryRunner.commitTransaction();
//       // ===============================================
//       return checkCart_Item;
//     } catch (error) {
//       // ============== rollback 되돌리기!!! ==============
//       await queryRunner.rollbackTransaction();
//     } finally {
//       // ============== 연결 해제!!! ==============
//       await queryRunner.release();
//       // ========================================
//     }
//   }

//   //장바구니 상품 삭제
//   /**
//    *장바구니에서 특정 상품만 삭제할 경우 Cart_Item 테이블에서 해당 데이터의 row 를 softdelete 해준다
//    Cart테이블에 cart_id의 count,price를 수정한다
//    currentUser의 장바구니에 다른 상품이 없다면 Cart테이블에
//    * @param user
//    * @returns
//    */
//   async deleteOne(user, item_id) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();

//     // ============== transaction 시작!! ==============
//     await queryRunner.startTransaction();
//     // ===============================================

//     //1.삭제할 상품 수량 재고 확인

//     try {
//       //2. 현재 유저의 cart_id와 파라미터로 받은 item_id로 Cart_Item 테이블을 조회한다. (Cart와 Item 테이블을 leftjoin시켜 조회한다)
//       const currentuser = await this.cartsRepository
//         .createQueryBuilder('cart')
//         .leftJoinAndSelect('cart.member', 'member')
//         .where('cart.member= :id', { id: user.member_id })
//         .getOne();

//       const findcartid = await queryRunner.manager
//         .getRepository(Cart)
//         .findOne({ where: { cart_id: currentuser.cart_id } });

//       const finditemid = await queryRunner.manager.getRepository(Item).findOne({ where: { item_id: item_id.item_id } });

//       const checkCart_Item = await this.cart_ItemRepository
//         .createQueryBuilder('cartitem')
//         .leftJoinAndSelect('cartitem.cart', 'cart')
//         .leftJoinAndSelect('cartitem.item', 'item')
//         .where('cartitem.cart= :id', { id: findcartid.cart_id })
//         .getMany();
//       // console.log('checkCart_Item: ', checkCart_Item);

//       //cart_id로 조회한 객체 배열에서 item_id가 finditem.item_id인 객체를 찾는다
//       const data = checkCart_Item.find((e) => e.item.item_id === finditemid.item_id);
//       // console.log('data: ', data);
//       if (!data) {
//         throw new HttpException('4103', 400);
//       }
//       const iszero: number = 0;
//       const is0 = iszero;
//       console.log('iszero: ', iszero);

//       const updateCount = await queryRunner.manager.getRepository(Cart_Item).create({ itemCount: iszero });
//       await queryRunner.manager.getRepository(Cart_Item).update(data.cart_item_id, updateCount);

//       //3-1.  Cart_Item 테이블에서 data의 row를 삭제해준다
//       const deleteCartItem = await queryRunner.manager
//         .getRepository(Cart_Item)
//         .softDelete({ cart_item_id: data.cart_item_id });

//       //3-2. Cart테이블에 count, price 를 수정한다 만약 count,price 0이면 장바구니가 초기화 된다.
//       const isdeleted = findcartid.count - data.itemCount;
//       const isdeletedPrice = findcartid.price - data.itemCount * data.item.price;

//       const isupdatedCount = await queryRunner.manager.getRepository(Cart).create({ count: isdeleted });
//       const isupdatedPrice = await queryRunner.manager.getRepository(Cart).create({ price: isdeletedPrice });

//       await queryRunner.manager.getRepository(Cart).update(currentuser.cart_id, isupdatedCount);
//       await queryRunner.manager.getRepository(Cart).update(currentuser.cart_id, isupdatedPrice);

//       // ============== commit 성공 확정!!! ==============
//       await queryRunner.commitTransaction();
//       // ===============================================
//       return checkCart_Item;
//     } catch (error) {
//       // ============== rollback 되돌리기!!! ==============
//       await queryRunner.rollbackTransaction();
//     } finally {
//       // ============== 연결 해제!!! ==============
//       await queryRunner.release();
//       // ========================================
//     }
//   }

//   //장바구니 상품 전체 삭제

//   async deleteAll(user) {
//     const queryRunner = this.dataSource.createQueryRunner();
//     await queryRunner.connect();

//     // ============== transaction 시작!! ==============
//     await queryRunner.startTransaction();
//     // ===============================================

//     //1.장바구니가 비어있는지 확인
//     const memberid = user.member_id;
//     const cart = await this.cartsRepository
//       .createQueryBuilder('cart')
//       .leftJoinAndSelect('cart.member', 'member')
//       .where('cart.member= :id', { id: memberid })
//       .getOne();
//     if (cart.count === 0 && cart.price === 0) {
//       throw new HttpException('4104', 400);
//     }
//     //2. 장바구니에 상품이 담겨있다면, 장바구니에 담긴 상품을 모두 찾아서 전체 삭제 (장바구니를 초기화)
//     try {
//       const currentuser = await this.cartsRepository
//         .createQueryBuilder('cart')
//         .leftJoinAndSelect('cart.member', 'member')
//         .where('cart.member= :id', { id: user.member_id })
//         .getOne();

//       const findcartid = await queryRunner.manager
//         .getRepository(Cart)
//         .findOne({ where: { cart_id: currentuser.cart_id } });

//       const checkCart_Item = await this.cart_ItemRepository
//         .createQueryBuilder('cartitem')
//         .leftJoinAndSelect('cartitem.cart', 'cart')
//         .leftJoinAndSelect('cartitem.item', 'item')
//         .where('cartitem.cart= :id', { id: findcartid.cart_id })
//         .getMany();

//       const updateCart_Item = await this.cart_ItemRepository
//         .createQueryBuilder('cartitem')
//         .update(Cart_Item)
//         .set({ itemCount: 0 })
//         .where('cart_id= :id', { id: findcartid.cart_id })
//         .execute();
//       console.log('updateCart_Item: ', updateCart_Item);

//       const deleteCart_Item = await this.cart_ItemRepository
//         .createQueryBuilder('cartitem')
//         .softDelete()
//         .where('cart_id= :id', { id: findcartid.cart_id })
//         .execute();
//       console.log('deleteCart_Item: ', deleteCart_Item);

//       const newcount = 0;
//       const newprice = 0;
//       const resetCart = await queryRunner.manager.getRepository(Cart).update(findcartid.cart_id, { count: newcount });
//       await queryRunner.manager.getRepository(Cart).update(findcartid.cart_id, { price: newprice });

//       // ============== commit 성공 확정!!! ==============
//       await queryRunner.commitTransaction();

//       return resetCart;
//     } catch (error) {
//       // ============== rollback 되돌리기!!! ==============
//       await queryRunner.rollbackTransaction();
//     } finally {
//       // ============== 연결 해제!!! ==============
//       await queryRunner.release();
//     }
//   }

//   //장바구니 조회
//   async findCart(user) {
//     const memberid = user.member_id;
//     // console.log('memberid: ', memberid);

//     //현재 로그인 유저의 장바구니 조회 (총 count, price 확인)
//     const cart = await this.cartsRepository
//       .createQueryBuilder('cart')
//       .leftJoinAndSelect('cart.member', 'member')
//       .where('cart.member= :id', { id: memberid })
//       .getOne();

//     //현재 로그인 유저 Cart_Item 상세 조회 (cart_item_id별 count 확인)

//     const cart_item = await this.cart_ItemRepository
//       .createQueryBuilder('cartitem')
//       .leftJoinAndSelect('cartitem.cart', 'cart')
//       .leftJoinAndSelect('cartitem.item', 'item')
//       .where('cartitem.cart= :id', { id: cart.cart_id })
//       .getMany();

//     const iteminfo = cart_item.map((x) => {
//       return {
//         item_name: x.item.item_name,
//         price: x.item.price,
//         count: x.itemCount,
//         image: x.item.image,
//       };
//     });

//     const data: any = {
//       count: cart.count,
//       price: cart.price,
//       item: iteminfo,
//     };

//     const cartinfo: any[] = [];
//     cartinfo.push(data);
//     console.log('cartinfo: ', cartinfo);
//     return cartinfo;
//   }
// }
