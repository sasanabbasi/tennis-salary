import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { DataLoaderService } from './data-loader.service';
import { PlayerMatchDataToTennisPlayerConverter } from '../converter/player-match-data-to-tennis-player';
@Module({
  controllers: [SalaryController],
  providers: [
    SalaryService,
    DataLoaderService,
    PlayerMatchDataToTennisPlayerConverter,
  ],
})
export class SalaryModule {}
