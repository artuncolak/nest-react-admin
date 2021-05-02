import { Test, TestingModule } from '@nestjs/testing';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { CourseService } from './course.service';

const MockService = {
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
  count: jest.fn().mockReturnValue(10),
};

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CourseService,
          useValue: MockService,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveCourse', () => {
    it('should get the created course ', async () => {
      const created = await service.save({
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
      const courses = await service.findAll({});
      expect(courses[0].id).toBe('testid1');
      expect(courses[1].name).toBe('test2');
      expect(courses[2].description).toBe('test3');
    });
  });

  describe('findCourseById', () => {
    it('should get the course with matching id ', async () => {
      const spy = jest.spyOn(global, 'Date');
      const course = await service.findById('testid');
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
      const updatedCourse = await service.update('testid', {
        name: 'test',
        description: 'test',
      });

      expect(updatedCourse).toEqual({
        id: 'testid',
        name: 'test',
        description: 'test',
      });

      const updatedCourse2 = await service.update('testid2', {
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
      const id = await service.delete('testid');
      expect(id).toBe('testid');
    });
  });

  describe('count', () => {
    it('should get number of courses', async () => {
      const count = await service.count();
      expect(count).toBe(10);
    });
  });
});
