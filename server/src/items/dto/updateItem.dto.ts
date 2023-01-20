import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './createItem.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
