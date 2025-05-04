import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PlayerMatchData } from '../common/model';

@Injectable()
export class DataLoaderService implements OnModuleInit {
  private data: Array<PlayerMatchData> = [];
  private readonly logger = new Logger(DataLoaderService.name);

  async onModuleInit() {
    this.data = await this.loadDataFromFile();
  }

  private async loadDataFromFile(): Promise<PlayerMatchData[]> {
    const filePath = path.resolve(__dirname, '../../data/mock-data.json');

    this.logger.log(`Loading mock data from file: ${filePath}`);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      this.logger.debug('Successfully read mock data from file');

      const rawData = JSON.parse(data) as Array<PlayerMatchData>;
      this.logger.log(`Parsed ${rawData.length} records from mock data file`);

      return rawData;
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
