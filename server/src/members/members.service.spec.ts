import { Cart } from './../carts/cart.entity';
import { Point } from './point.entity';
import { Address } from './address.entity';
import { Member } from './members.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MembersService } from './members.service';

class MockMemberRepository {
  save() {
    return true;
  }
}
class MockAddressRepository {}
class MockPointRepository {}
class MockCartRepository {}

describe('MembersService', () => {
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useClass: MockMemberRepository,
        },
        {
          provide: getRepositoryToken(Address),
          useClass: MockAddressRepository,
        },
        {
          provide: getRepositoryToken(Point),
          useClass: MockPointRepository,
        },
        {
          provide: getRepositoryToken(Cart),
          useClass: MockCartRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
