import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';

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

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: MockService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should get login response', async () => {
      const req = mocks.createRequest();
      req.res = mocks.createResponse();

      const loginResponse = await service.login(
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
      const result = await service.logout(req, req.res);

      expect(result).toBe(true);
    });
  });

  describe('refresh', () => {
    it('should get login response', async () => {
      const req = mocks.createRequest();

      const loginResponse = await service.refresh('token', req.res);
      expect(loginResponse).toEqual({
        token: 'token',
        user: {
          username: 'test',
        },
      });
    });
  });
});
