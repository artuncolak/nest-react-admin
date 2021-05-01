import { createMock } from '@golevelup/nestjs-testing';
import { ExecutionContext } from '@nestjs/common';

import { UserGuard } from './user.guard';

describe('UserGuard', () => {
  let guard: UserGuard;

  beforeEach(() => {
    guard = new UserGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when user is admin', async () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      user: {
        role: 'admin',
      },
    });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return true when user is equals to param id', async () => {
    const context = createMock<ExecutionContext>();

    context.switchToHttp().getRequest.mockReturnValue({
      params: {
        id: 'testid',
      },
      user: {
        userId: 'testid',
      },
    });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
