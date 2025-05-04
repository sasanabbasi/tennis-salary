import { Controller, Get, Logger, Param } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { PlayerSalaryResponse } from './dto/player-salary-response.dto';
@Controller('salary')
export class SalaryController {
  private readonly logger = new Logger(SalaryController.name);

  constructor(private readonly salaryService: SalaryService) {}

  @Get('/player/:playerId')
  getSalaryByPlayerId(
    @Param('playerId') playerId: number,
  ): PlayerSalaryResponse {
    this.logger.log(`getSalaryByPlayerId: ${playerId}`);

    return this.salaryService.getSalaryByPlayerId(+playerId);
  }
}
