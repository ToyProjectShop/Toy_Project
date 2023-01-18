import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    example: '로지텍 에르고 K860',
    description: '상품명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly item_name: string;

  @ApiProperty({
    example: '10000',
    description: '판매 가격',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    example: '상품 이미지',
    description: '상품 이미지',
    required: false,
  })
  @IsString()
  readonly image: string;

  @ApiProperty({
    example: '로지텍 인체공학 키보드',
    description: '상품설명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: '10',
    description: '재고 수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly stockquantity: number;

  @ApiProperty({
    example: '1',
    description: 'category id',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly category_id: number;
}
