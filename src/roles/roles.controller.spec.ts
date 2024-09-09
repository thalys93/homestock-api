import { Test, TestingModule } from '@nestjs/testing';
import { RolesControllerProtected } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesControllerProtected;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesControllerProtected],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesControllerProtected>(RolesControllerProtected);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
