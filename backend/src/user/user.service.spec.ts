import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '../enums/role.enum';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
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
            save: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) => {
                return {
                  id: 'testid',
                  ...createUserDto,
                };
              }),
            findById: jest.fn().mockImplementation((id: string) => {
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
            findByUsername: jest.fn().mockImplementation((username: string) => {
              return {
                id: 'testid',
                firstName: 'test',
                lastName: 'test',
                password: 'test',
                role: Role.User,
                isActive: true,
                username,
              };
            }),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateUserDto: UpdateUserDto) => {
                  return {
                    id,
                    ...updateUserDto,
                  };
                },
              ),
            delete: jest.fn().mockImplementation((id: string) => id),
            count: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveUser', () => {
    it('should get the same user that is created', async () => {
      const returnValue = await service.save({
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
      const users = await service.findAll({});
      expect(typeof users).toBe('object');
      expect(users[0].firstName).toBe('test1');
      expect(users[1].lastName).toBe('test2');
      expect(users[2].username).toBe('test3');
      expect(users.length).toBe(3);
    });
  });

  describe('findOneUser', () => {
    it('should get a user matching id', async () => {
      const user = await service.findById('id');
      expect(user.id).toBe('id');
      expect(user.firstName).toBe('test');
    });
  });

  describe('findOneUserByUsername', () => {
    it('should get a user matching username', async () => {
      const user = await service.findByUsername('testusername');
      expect(user.id).toBe('testid');
      expect(user.firstName).toBe('test');
      expect(user.username).toBe('testusername');
    });
  });

  describe('updateUser', () => {
    it('should update a user and return changed values', async () => {
      const updatedUser = await service.update('testid', {
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
      const id = await service.delete('testid');
      expect(id).toBe('testid');
    });
  });

  describe('countUsers', () => {
    it('should return the number of users', async () => {
      const count = await service.count();
      expect(count).toBe(10);
    });
  });
});
