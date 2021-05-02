import { Test, TestingModule } from '@nestjs/testing';

import { CreateContentDto, UpdateContentDto } from './content.dto';
import { ContentService } from './content.service';

const MockService = {
  save: jest
    .fn()
    .mockImplementation((id: string, createContentDto: CreateContentDto) => {
      return {
        id: 'testid',
        dateCreated: new Date(),
        ...createContentDto,
      };
    }),
  findAll: jest.fn().mockImplementation(() => {
    return [
      {
        id: 'testid1',
        name: 'test1',
        description: 'test1',
        dateCreated: new Date(),
      },
      {
        id: 'testid2',
        name: 'test2',
        description: 'test2',
        dateCreated: new Date(),
      },
      {
        id: 'testid3',
        name: 'test3',
        description: 'test3',
        dateCreated: new Date(),
      },
    ];
  }),
  findById: jest.fn().mockImplementation((id: string) => {
    return {
      id,
      name: 'test',
      description: 'test',
      dateCreated: new Date(),
    };
  }),
  findByCourseIdAndId: jest
    .fn()
    .mockImplementation((courseId: string, id: string) => {
      return {
        id,
        name: 'test',
        description: 'test',
        dateCreated: new Date(),
      };
    }),
  findAllByCourseId: jest.fn().mockImplementation((id: string) => {
    return [
      {
        id: 'testid1',
        name: 'test1',
        description: 'test1',
        dateCreated: new Date(),
      },
      {
        id: 'testid2',
        name: 'test2',
        description: 'test2',
        dateCreated: new Date(),
      },
      {
        id: 'testid3',
        name: 'test3',
        description: 'test3',
        dateCreated: new Date(),
      },
    ];
  }),
  update: jest
    .fn()
    .mockImplementation(
      (id: string, contentId: string, updateContentDto: UpdateContentDto) => {
        return {
          id: contentId,
          ...updateContentDto,
        };
      },
    ),
  delete: jest
    .fn()
    .mockImplementation((id: string, contentId: string) => contentId),
  count: jest.fn().mockReturnValue(10),
};

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ContentService,
          useValue: MockService,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveContent', () => {
    it('should get the saved content', async () => {
      const spy = jest.spyOn(global, 'Date');
      const content = await service.save('testcourseid', {
        name: 'test',
        description: 'test',
      });
      const date = spy.mock.instances[0];

      expect(content).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: date,
      });
    });
  });

  describe('findAllContent', () => {
    it('should get the list of all contents', async () => {
      const contents = await service.findAll({});
      expect(contents[0].id).toBe('testid1');
      expect(contents[1].name).toBe('test2');
      expect(contents[2].description).toBe('test3');
    });
  });

  describe('findContentById', () => {
    it('should get a content by id', async () => {
      const spy = jest.spyOn(global, 'Date');
      const content = await service.findById('testid');
      const date = spy.mock.instances[0];

      expect(content).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: date,
      });
    });
  });

  describe('findAllContentsByCourseIdAndId', () => {
    it('should get a contets', async () => {
      const spy = jest.spyOn(global, 'Date');
      const content = await service.findByCourseIdAndId(
        'testcourseid',
        'testid',
      );
      const date = spy.mock.instances[0];

      expect(content).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: date,
      });
    });
  });

  describe('findAllContentsByCourseId', () => {
    it('should get the array of contents', async () => {
      const contents = await service.findAllByCourseId('testcourseid', {});

      expect(contents[0].id).toBe('testid1');
      expect(contents[1].name).toBe('test2');
      expect(contents[2].description).toBe('test3');
    });
  });

  describe('updateContent', () => {
    it('should update a content and return changed values', async () => {
      const updatedContent = await service.update('testid', 'testcontentid', {
        name: 'test',
        description: 'test',
      });

      expect(updatedContent).toEqual({
        id: 'testcontentid',
        name: 'test',
        description: 'test',
      });

      const updatedContent2 = await service.update('testid', 'testcontentid2', {
        description: 'test',
      });

      expect(updatedContent2).toEqual({
        id: 'testcontentid2',
        description: 'test',
      });
    });
  });

  describe('deleteContent', () => {
    it('should delete a content and return the id', async () => {
      const id = await service.delete('testid', 'testcontentid');
      expect(id).toBe('testcontentid');
    });
  });

  describe('countContents', () => {
    it('should get number of contents', async () => {
      const count = await service.count();
      expect(count).toBe(10);
    });
  });
});
