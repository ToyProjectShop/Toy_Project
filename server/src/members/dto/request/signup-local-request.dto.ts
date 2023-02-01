import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignupLocalRequestDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'email',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'test',
    description: 'name',
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    example: '1234',
    description: 'password',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: '01012345678',
    description: 'phone',
  })
  readonly phone: string | number;

  @ApiProperty({
    example: '고양시',
    description: 'city',
  })
  @IsString()
  readonly city: string;

  @ApiProperty({
    example: '마두동',
    description: 'street',
  })
  @IsString()
  readonly street: string;

  @ApiProperty({
    example: '12345',
    description: 'zipcode',
  })
  readonly zipcode: string | number;
}
