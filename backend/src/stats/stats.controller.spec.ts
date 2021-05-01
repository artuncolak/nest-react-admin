import { Test, TestingModule } from '@nestjs/testing';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

const MockService = {
  getStats: jest.fn().mockImplementation(() => {
    return {
      numberOfUsers: 10,
      numberOfCourses: 5,
      numberOfContents: 6,
    };
  }),
};

describe('StatsController', () => {
  let controller: StatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: MockService,
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('should get stats', async () => {
      const stats = await controller.getStats();
      expect(stats.numberOfContents).toBe(6);
      expect(stats.numberOfCourses).toBe(5);
      expect(stats.numberOfUsers).toBe(10);
    });
  });
});
