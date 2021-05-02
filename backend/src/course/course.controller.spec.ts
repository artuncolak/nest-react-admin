import { Test, TestingModule } from '@nestjs/testing';
import { CreateContentDto, UpdateContentDto } from 'src/content/content.dto';

import { ContentService } from '../content/content.service';
import { CourseController } from './course.controller';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { CourseService } from './course.service';

const CourseMockService = {
  save: jest.fn().mockImplementation((createCourseDto: CreateCourseDto) => {
    return {
      id: 'testid',
      dateCreated: new Date(),
      ...createCourseDto,
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
  update: jest
    .fn()
    .mockImplementation((id: string, updateCourseDto: UpdateCourseDto) => {
      return {
        id,
        ...updateCourseDto,
      };
    }),
  delete: jest.fn().mockImplementation((id) => id),
};

const ContentMockService = {
  save: jest
    .fn()
    .mockImplementation((id: string, createContentDto: CreateContentDto) => {
      return {
        id: 'testid',
        dateCreated: new Date(),
        ...createContentDto,
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
};

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: CourseMockService,
        },
        {
          provide: ContentService,
          useValue: ContentMockService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveCourse', () => {
    it('should get the created course ', async () => {
      const created = await controller.save({
        name: 'test',
        description: 'test',
      });
      expect(created.id).toBe('testid');
      expect(created.name).toBe('test');
      expect(created.description).toBe('test');
    });
  });

  describe('findAllCourses', () => {
    it('should get the array of courses ', async () => {
      const courses = await controller.findAll({});
      expect(courses[0].id).toBe('testid1');
      expect(courses[1].name).toBe('test2');
      expect(courses[2].description).toBe('test3');
    });
  });

  describe('findCourseById', () => {
    it('should get the course with matching id ', async () => {
      const spy = jest.spyOn(global, 'Date');
      const course = await controller.findOne('testid');
      const date = spy.mock.instances[0];

      expect(course).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
        dateCreated: date,
      });
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return changed values', async () => {
      const updatedCourse = await controller.update('testid', {
        name: 'test',
        description: 'test',
      });

      expect(updatedCourse).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
      });

      const updatedCourse2 = await controller.update('testid2', {
        name: 'test2',
      });

      expect(updatedCourse2).toEqual({
        id: 'testid2',
        name: 'test2',
      });
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course and return the id', async () => {
      const id = await controller.delete('testid');
      expect(id).toBe('testid');
    });
  });

  describe('saveContent', () => {
    it('should get the saved content', async () => {
      const spy = jest.spyOn(global, 'Date');
      const content = await controller.saveContent('testcourseid', {
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

  describe('findAllContentsByCourseId', () => {
    it('should get the array of contents', async () => {
      const contents = await controller.findAllContentsByCourseId(
        'testcourseid',
        {},
      );

      expect(contents[0].id).toBe('testid1');
      expect(contents[1].name).toBe('test2');
      expect(contents[2].description).toBe('test3');
    });
  });

  describe('updateContent', () => {
    it('should update a content and return changed values', async () => {
      const updatedContent = await controller.updateContent(
        'testid',
        'testcontentid',
        {
          name: 'test',
          description: 'test',
        },
      );

      expect(updatedContent).toEqual({
        id: 'testcontentid',
        name: 'test',
        description: 'test',
      });

      const updatedContent2 = await controller.updateContent(
        'testid',
        'testcontentid2',
        {
          description: 'test',
        },
      );

      expect(updatedContent2).toEqual({
        id: 'testcontentid2',
        description: 'test',
      });
    });
  });

  describe('deleteContent', () => {
    it('should delete a content and return the id', async () => {
      const id = await controller.deleteContent('testid', 'testcontentid');
      expect(id).toBe('testcontentid');
    });
  });
});
