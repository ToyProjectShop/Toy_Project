import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './createCart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {}
