import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: '10',
    description: '주문 개수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly count: number;

  @ApiProperty({
    example: '10000',
    description: '판매 가격',
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
}
