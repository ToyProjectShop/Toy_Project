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
    @InjectRepository(Cart_Item)
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
      const checkCategory = await this.categoryRepository.findOne({where:{category_id}})
      if (!checkCategory){
        throw new HttpException ('3101', 400)
      }
      const result = await this.itemRepository.save(item);
      return result;
    } catch {
      throw new HttpException('3101', 400);
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
      const checkCategory = await this.categoryRepository.findOne({where:{category_id}})
      if (!checkCategory){
        throw new HttpException ('3102', 400)
      }

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

    try {
      //1.삭제하려는 상품의 존재 여부 확인 
      const findItem = await this.itemRepository.findOne({ where: { item_id } });
      console.log('findItem: ', findItem);
      if(!findItem){
        throw new HttpException('3103',400)
      }

    //2. 장바구니에 삭제하는 상품이 담긴게 있는지 확인
    const findCartItem = await this.cart_ItemRepository
    .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('item.item_id = :item_id', {item_id: item_id})
        .getMany();
        console.log('findCartItem: ', findCartItem);
       
     
      // //3. 삭제될 item으로 장바구니에 수정해야할 수량, 가격 계산후 장바구니에 적용시키기
    
      // const totalItemCount = await this.cart_ItemRepository

      //   .createQueryBuilder('cartitem')
      //   .leftJoinAndSelect('cartitem.item', 'item')
      //   .where('item.item_id = :item_id', {item_id: item_id})
      //   .select('SUM(cartitem.itemCount)', 'totalItemCount')
      //   .getRawOne();
      // console.log('totalItemCount: ', totalItemCount);
      // const totalItem = totalItemCount.totalItemCount;

      // console.log('totalItem: ', totalItem);

      // const totalPrice = await this.cart_ItemRepository

      //   .createQueryBuilder('cartitem')
      //   .leftJoinAndSelect('cartitem.item', 'item')
      //   .where('item.item_id = :item_id', {item_id: item_id})
      //   .select('SUM(cartitem.itemCount * item.price)', 'totalPrice')
      //   .getRawOne();
      // const totalP = totalPrice.totalPrice 
      
      // console.log('totalP: ', totalP);

      // const resetCart = await this.cartsRepository
      // .createQueryBuilder('cart')
      //   .leftJoinAndSelect('cart.member', 'member')
      //   .where('cart.member= :id', { id: user.member_id })
      //   .getOne();

      // .update(item_id, { count: totalItem, price: totalP });
      
      // const updateCartItem = await this.cart_ItemRepository
      
      //   .createQueryBuilder('cartitem')
      //   .update(Cart_Item)
      //   .set({ itemCount: 0 })
      //   .where('item.item_id = :item_id', {item_id: item_id})
      //   .execute();
      //   console.log('updateCartItem: ', updateCartItem);
 //4. Item 테이블에서 해당 itemd_id 삭제 하기 
 throw new Error ('강제에러')
      const deleteCartItem = await this.cart_ItemRepository
      
        .createQueryBuilder('cartitem')
        .softDelete()
        .where('item.item_id = :item_id', {item_id: item_id})
        .execute();
        console.log('deleteCartItem: ', deleteCartItem);
        const deleteItem= await this.itemRepository.softDelete(item_id);
      return deleteItem
    } catch (error) {
      throw new HttpException('3103',400)
      
    }
  }
}
