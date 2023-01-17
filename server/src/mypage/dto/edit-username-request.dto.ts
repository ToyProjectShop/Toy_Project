import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditUsernameDto {
  @ApiProperty()
  @IsString()
  username: string;
}
