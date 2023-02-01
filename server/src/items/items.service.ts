import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/carts/cart.entity';
import { Cart_Item } from 'src/carts/cart_item.entity';
import { Category } from 'src/category/category.entity';
import { DataSource, Repository } from 'typeorm';
import { Item } from './items.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(Cart)
    private readonly cart_ItemRepository: Repository<Cart_Item>,
    private readonly dataSource: DataSource,
  ) {}

  //상품조회
  async getItem(user, item_id) {
    try {
      return await this.itemRepository.findOne({ where: { item_id } });
    } catch {
      throw new HttpException('3100', 400);
    }
  }
  //상품전체 조회

  async getAllItem(user) {
    try {
      return await this.itemRepository.find();
    } catch {
      throw new HttpException('3100', 400);
    }
  }
  //상품등록
  async createItem(user, createItemDto): Promise<Item> {
    try {
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
    } catch {
      throw new HttpException('3100', 400);
    }
  }
  //상품수정
  async updateItem(user, item_id, updateItemDto): Promise<Item> {
    console.log('item_id: ', typeof item_id);
    const itemid = parseInt(item_id);
    try {
      const { item_name, price, image, description, stockquantity, category_id } = updateItemDto;
      console.log('updateItemDto: ', updateItemDto);

      const item = new Item();
      (item.item_name = item_name),
        (item.price = price),
        (item.image = image),
        (item.descritpion = description),
        (item.stockquantity = stockquantity);
      item.category = category_id;

      const result = await this.itemRepository.findOne({ where: { item_id: itemid } });
      console.log('resul: ', result.item_id);
      const data = await this.itemRepository.update({ item_id: itemid }, item);

      return result;
    } catch {
      throw new HttpException('3102', 400);
    }
  }
  //상품삭제
  async deleteItem(user, item_id) {
    console.log('item_id: ', item_id);
    try {
      const findItem = await this.itemRepository.findOne({ where: { item_id } });
      console.log('findItem: ', findItem);
      if(!findItem){
        throw new HttpException('3103',400)
      }
      await this.itemRepository.softDelete(item_id);


    //장바구니에 삭제하는 상품이 담긴게 있다면 장바구니에서도 삭제
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const currentUser = await this.cartsRepository
    .createQueryBuilder('cart')
    .leftJoinAndSelect('cart.member', 'member')
    .where('cart.member = :id', { id: user.member_id })
    .getOne();

  const cart = await queryRunner.manager.getRepository(Cart).findOne({ where: { cart_id: currentUser.cart_id } });
    const cartItem = await this.cart_ItemRepository
    
    
        .createQueryBuilder('cartItem')
        .leftJoinAndSelect('cartItem.cart', 'cart')
        .leftJoinAndSelect('cartItem.item', 'item')
        .where('cartItem.cart = :id', { id: cart.cart_id })
        .getOne();
console.log('cartItem: ', cartItem);
      // if (!cartItem) {
      //   throw new HttpException('4103', 400);
      // }
      //2. 장바구니에 선택한 상품이 삭제되면 수정해야할 count,price 계산 및 수정하기
      const updatedCount = cart.count - cartItem.itemCount;
      const updatedPrice = cart.price - cartItem.itemCount * findItem.price;
      const itemDeleted = await queryRunner.manager
      
        .getRepository(Cart)
        .update(cart.cart_id, { count: updatedCount, price: updatedPrice });
console.log('itemDeleted: ', itemDeleted);
      //3. 삭제하는 아이템의 itemCount를 0으로 변경하고 softDelete 처리하기 (데이터베이스에서 완전히 삭제하는게 아니라 softDelete을 사용하여 데이터를 보관한다)
      const updatecartItem = await queryRunner.manager
        .getRepository(Cart_Item)
        .update(cartItem.cart_item_id, { itemCount: 0 });

      const deletecartItem = await queryRunner.manager
      
        .getRepository(Cart_Item)
        .softDelete({ cart_item_id: cartItem.cart_item_id });
      console.log('deletecartItem: ', deletecartItem);
      return true;
    } catch {
      throw new HttpException('3103', 400);
    }
  }
}
