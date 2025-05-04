import { Injectable, Logger } from '@nestjs/common';
import { DataLoaderService } from './data-loader.service';
import { PlayerMatchDataToTennisPlayerConverter } from '../converter/player-match-data-to-tennis-player';
import { PlayerSalaryResponse } from './dto/player-salary-response.dto';

@Injectable()
export class SalaryService {
  private readonly logger = new Logger(SalaryService.name);
  constructor(
    private readonly dataLoaderService: DataLoaderService,
    private readonly playerMatchDataToTennisPlayerConverter: PlayerMatchDataToTennisPlayerConverter,
  ) {}

  getSalaryByPlayerId(playerId: number): PlayerSalaryResponse {
    const data = this.dataLoaderService.getData();

    const playerData = data.filter(
      (item) => item.playerId === playerId || item.opponentId === playerId,
    );

    if (!playerData.length) {
      throw new Error(`Player data not found for playerId: ${playerId}`);
    }

    this.logger.log(
      `Converting player data to match data for playerId: ${playerId}`,
    );
    const player = this.playerMatchDataToTennisPlayerConverter.convert(
      playerData,
      playerId,
    );

    this.logger.log(`Calculating total salary for playerId: ${playerId}`);
    const totalSalary = player.calculateTotalSalary();
    this.logger.log(`Total salary calculated: ${totalSalary}`);

    return {
      id: player.playerId,
      name: player.playerName,
      totalSalary,
    };
  }
}
