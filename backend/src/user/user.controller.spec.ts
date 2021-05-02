import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '../enums/role.enum';
import { UserController } from './user.controller';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

const MockService = {
  findAll: jest.fn().mockResolvedValue([
    {
      id: 'test1',
      firstName: 'test1',
      lastName: 'test1',
      username: 'test1',
      isActive: true,
      role: Role.Admin,
    },
    {
      id: 'test2',
      firstName: 'test2',
      lastName: 'test2',
      username: 'test2',
      isActive: true,
      role: Role.Admin,
    },
    {
      id: 'test3',
      firstName: 'test3',
      lastName: 'test3',
      username: 'test3',
      isActive: true,
      role: Role.Admin,
    },
  ]),
  save: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
    return {
      id: 'testid',
      ...createUserDto,
    };
  }),
  findById: jest.fn().mockImplementation((id) => {
    return {
      id,
      firstName: 'test',
      lastName: 'test',
      password: 'test',
      role: Role.User,
      isActive: true,
      username: 'test',
    };
  }),
  update: jest
    .fn()
    .mockImplementation((id: string, updateUserDto: UpdateUserDto) => {
      return {
        id,
        ...updateUserDto,
      };
    }),
  delete: jest.fn().mockImplementation((id: string) => id),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: MockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveUser', () => {
    it('should get the same user that is created', async () => {
      const returnValue = await controller.save({
        firstName: 'test',
        lastName: 'test',
        password: 'test',
        role: Role.User,
        username: 'test',
      });
      expect(returnValue.id).toBe('testid');
      expect(returnValue.firstName).toBe('test');
      expect(returnValue.role).toBe('user');
    });
  });

  describe('findAllUsers', () => {
    it('should get the list of users', async () => {
      const users = await controller.findAll({});
      expect(typeof users).toBe('object');
      expect(users[0].firstName).toBe('test1');
      expect(users[1].lastName).toBe('test2');
      expect(users[2].username).toBe('test3');
      expect(users.length).toBe(3);
    });
  });

  describe('findOneUser', () => {
    it('should get a user matching id', async () => {
      const user = await controller.findOne('id');
      expect(user.id).toBe('id');
      expect(user.firstName).toBe('test');
    });
  });

  describe('updateUser', () => {
    it('should update a user and return changed values', async () => {
      const updatedUser = await controller.update('testid', {
        firstName: 'test',
        role: Role.Editor,
      });
      expect(updatedUser.id).toBe('testid');
      expect(updatedUser.role).toBe('editor');
      expect(updatedUser.lastName).toBe(undefined);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return the id', async () => {
      const id = await controller.delete('testid');
      expect(id).toBe('testid');
    });
  });
});
