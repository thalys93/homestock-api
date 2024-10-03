import { Test, TestingModule } from '@nestjs/testing';
import { UserControllerProtected } from './user.controller';
import { UserService } from './user.service';

describe('UsersController', () => {
  let controller: UserControllerProtected;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserControllerProtected],
      providers: [UserService],
    }).compile();

    controller = module.get<UserControllerProtected>(UserControllerProtected);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
