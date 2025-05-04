import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PlayerMatchData } from '../common/model';
import { PlayerMatchDataArraySchema } from '../common/zod-schema/player-match-data.zod-schema';

@Injectable()
export class DataLoaderService implements OnModuleInit {
  private data: Array<PlayerMatchData> = [];
  private readonly logger = new Logger(DataLoaderService.name);

  async onModuleInit() {
    this.data = await this.loadDataFromFile();
  }

  private async loadDataFromFile(): Promise<Array<PlayerMatchData>> {
    const filePath = path.resolve(__dirname, '../../data/mock-data.json');

    this.logger.log(`Loading mock data from file: ${filePath}`);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      this.logger.debug('Successfully read mock data from file');

      const rawData = JSON.parse(data);

      const validatedData = PlayerMatchDataArraySchema.parse(rawData);
      this.logger.log(
        `Validated ${validatedData.length} records from mock data file`,
      );

      return validatedData.map(
        (item) =>
          new PlayerMatchData(
            item.playerId,
            item.playerName,
            item.opponentId,
            item.opponentName,
            item.result,
            item.aces,
            item.smashedRackets,
            item.doubleFaults,
          ),
      ) as Array<PlayerMatchData>;
    } catch (error) {
      this.logger.error('Failed to load or parse mock data from file', error);
      throw new Error(
        `Failed to load or parse mock data from file: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  public getData(): Array<PlayerMatchData> {
    return this.data;
  }
}
