import { Test, TestingModule } from '@nestjs/testing';

import { PasswordEncoder } from './password.encoder';

describe('PasswordEncoderService', () => {
  let service: PasswordEncoder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordEncoder],
    }).compile();

    service = module.get<PasswordEncoder>(PasswordEncoder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
