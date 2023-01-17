import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Order } from '../orders.entity';
export class CreateOrdersDto {
  @ApiProperty({
    example: '1',
    description: '주문 개수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    example: '10000',
    description: '판매 가격',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
  @ApiProperty({
    example: '서울시 강남구 서초동',
    description: '도시 주소',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @ApiProperty({
    example: '영동대로 89 번지 000빌딩 000호',
    description: '도로명 상세주소',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @ApiProperty({
    example: '12334',
    description: '우편번호, 집코드',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly zipcode: number;

  @ApiProperty({
    example: '01012345678',
    description: '전화 번호 - 없이 입력',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;
}
