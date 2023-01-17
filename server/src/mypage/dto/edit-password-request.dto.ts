import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;
}
