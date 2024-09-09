import { Test, TestingModule } from '@nestjs/testing';
import { UsersControllerProtected } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersControllerProtected;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersControllerProtected],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersControllerProtected>(UsersControllerProtected);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
