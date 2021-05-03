import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StatsResponseDto } from './stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(): Promise<StatsResponseDto> {
    return await this.statsService.getStats();
  }
}
