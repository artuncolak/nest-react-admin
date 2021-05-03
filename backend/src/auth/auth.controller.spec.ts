import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';

import { AuthController } from './auth.controller';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

const MockService = {
  login: jest.fn().mockImplementation((loginDto: LoginDto) => {
    return {
      token: 'token',
      user: {
        username: loginDto.username,
      },
    };
  }),
  logout: jest.fn().mockReturnValue(true),
  refresh: jest.fn().mockImplementation(() => {
    return {
      token: 'token',
      user: {
        username: 'test',
      },
    };
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: MockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should get login response', async () => {
      const req = mocks.createRequest();
      req.res = mocks.createResponse();

      const loginResponse = await controller.login(
        { username: 'test', password: 'test' },
        req.res,
      );
      expect(loginResponse).toEqual({
        token: 'token',
        user: {
          username: 'test',
        },
      });
    });
  });

  describe('logout', () => {
    it('should get true', async () => {
      const req = mocks.createRequest();
      req.res = mocks.createResponse();
      const result = await controller.logout(req, req.res);

      expect(result).toBe(true);
    });
  });

  describe('refresh', () => {
    it('should get login response', async () => {
      const req = mocks.createRequest();

      const loginResponse = await controller.refresh(req, req.res);
      expect(loginResponse).toEqual({
        token: 'token',
        user: {
          username: 'test',
        },
      });
    });
  });
});
