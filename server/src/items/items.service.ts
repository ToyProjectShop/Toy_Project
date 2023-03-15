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
      item.item_name = item_name;
      item.price = price;
      item.image = image;
      item.descritpion = description;
      item.stockquantity = stockquantity;
      item.category = category_id;
      const checkCategory = await this.categoryRepository.findOne({ where: { category_id } });
      if (!checkCategory) {
        throw new HttpException('3101', 400);
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const { item_name, price, image, description, stockquantity, category_id } = updateItemDto;
      console.log('updateItemDto: ', updateItemDto);

      const item = new Item();
      item.item_name = item_name;
      item.price = price;
      item.image = image;
      item.descritpion = description;
      item.stockquantity = stockquantity;
      item.category = category_id;
      const checkCategory = await this.categoryRepository.findOne({ where: { category_id } });
      if (!checkCategory) {
        throw new HttpException('3102', 400);
      }
      //장바구니에 수정하려는 상품이 있는지 확인
      const findCartItem = await this.cart_ItemRepository
        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('item.item_id = :item_id', { item_id: item_id })
        .getMany();

      if (findCartItem) {
        const findcart = findCartItem.map((x) => x.cart.cart_id);
        const findcartitemid = findCartItem.map((x) => x.cart_item_id);
        const findcount = findCartItem.map((x) => x.itemCount);
        const priceupdate = findCartItem.map((x) => x.itemCount * updateItemDto.price);

        //cart 테이블에 가격 수정
        for (let i = 0; i < findcart.length; i++) {
          const cart_id = parseInt(findcart[i].toString(), 10);
          const cart = await queryRunner.manager.getRepository(Cart).findOne({ where: { cart_id } });
          const isupdated = await queryRunner.manager.getRepository(Cart).update(cart_id, { price: priceupdate[i] });
        }

        const result = await this.itemRepository.findOne({ where: { item_id: itemid } });
        console.log('resul: ', result.item_id);
        const data = await this.itemRepository.update({ item_id: itemid }, item);
        await queryRunner.commitTransaction();
        return result;
      }
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  //상품삭제
  async deleteItem(user, item_id) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      //1.삭제하려는 상품의 존재 여부 확인
      const findItem = await this.itemRepository.findOne({ where: { item_id } });
      console.log('findItem: ', findItem);
      if (!findItem) {
        throw new HttpException('3103', 400);
      }

      //2. 장바구니에 삭제하는 상품이 담긴게 있는지 확인
      const findCartItem = await this.cart_ItemRepository
        .createQueryBuilder('cartitem')
        .leftJoinAndSelect('cartitem.cart', 'cart')
        .leftJoinAndSelect('cartitem.item', 'item')
        .where('item.item_id = :item_id', { item_id: item_id })
        .getMany();
      console.log('findCartItem: ', findCartItem);
      //3. 삭제될 item으로 장바구니에 수정해야할 수량, 가격 계산후 장바구니에 적용시키기
      if (findCartItem) {
        const countupdate = findCartItem.map((x) => x.cart.count - x.itemCount);
        const priceupdate = findCartItem.map((x) => x.cart.price - x.itemCount * x.item.price);
        const findcart = findCartItem.map((x) => x.cart.cart_id);
        const finditemcount = findCartItem.map((x) => x.itemCount);
        const findcartitemid = findCartItem.map((x) => x.cart_item_id);
        //cart 테이블 수정
        for (let i = 0; i < findcart.length; i++) {
          const cart_id = parseInt(findcart[i].toString(), 10);
          console.log('cart_id: ', cart_id);
          const cart = await queryRunner.manager.getRepository(Cart).findOne({ where: { cart_id } });
          console.log('cart: ', cart);
          const isupdated = await queryRunner.manager

            .getRepository(Cart)
            .update(cart_id, { count: countupdate[i], price: priceupdate[i] });
          console.log('updated: ', isupdated);
        }
        //cart_item 테이블에서 itemCount 0 변경후 softDelete
        for (let i = 0; i < findcartitemid.length; i++) {
          const cart_item_id = parseInt(findcartitemid[i].toString(), 10);
          console.log('cart_item_id: ', cart_item_id);
          await queryRunner.manager.getRepository(Cart_Item).findOne({ where: { cart_item_id } });
          const zero = 0;
          const updatecartItem = await queryRunner.manager
            .getRepository(Cart_Item)
            .update(cart_item_id, { itemCount: zero });
          const deleted = await queryRunner.manager.getRepository(Cart_Item).softDelete(cart_item_id);
          console.log('updatecartItem: ', updatecartItem);
        }
      }
      //4. Item 테이블에서 해당 itemd_id 삭제 하기
      const deleteI = await this.itemRepository.softDelete(item_id);
      await queryRunner.commitTransaction();
      return deleteI;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
