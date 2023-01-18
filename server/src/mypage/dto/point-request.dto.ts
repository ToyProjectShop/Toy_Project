import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PointRequestDto {
  @ApiProperty()
  @IsString()
  point: string;
}
