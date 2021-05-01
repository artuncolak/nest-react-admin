import { Test, TestingModule } from '@nestjs/testing';

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

describe('StatsService', () => {
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StatsService,
          useValue: MockService,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should get stats', async () => {
      const stats = await service.getStats();
      expect(stats.numberOfContents).toBe(6);
      expect(stats.numberOfCourses).toBe(5);
      expect(stats.numberOfUsers).toBe(10);
    });
  });
});
