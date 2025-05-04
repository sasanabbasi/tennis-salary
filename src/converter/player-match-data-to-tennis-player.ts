import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConverter } from '../common/contracts';
import {
  PlayerMatchData,
  TennisMatchRecord,
  TennisPlayer,
  TennisSet,
} from '../common/model';

@Injectable()
export class PlayerMatchDataToTennisPlayerConverter
  implements IConverter<Array<PlayerMatchData>, TennisPlayer>
{
  constructor(private configService: ConfigService) {}

  public convert(
    matchData: Array<PlayerMatchData>,
    mainPlayerId: number,
  ): TennisPlayer {
    const player = new TennisPlayer(
      matchData[0].playerId === mainPlayerId
        ? {
            playerId: matchData[0].playerId,
            playerName: matchData[0].playerName,
          }
        : {
            playerId: matchData[0].opponentId,
            playerName: matchData[0].opponentName,
          },
    );

    player.setTennisMatches(
      matchData.map((match) => this.mapTennisMatch(match, mainPlayerId)),
    );

    return player;
  }

  private mapTennisMatch(
    match: PlayerMatchData,
    mainPlayerId: number,
  ): TennisMatchRecord {
    return new TennisMatchRecord(this.configService, {
      opponentId: match.opponentId,
      opponentName: match.opponentName,
      playerPosition: match.playerId === mainPlayerId ? 0 : 1,
      aces: this.convertToTuple(match.aces),
      doubleFaults: this.convertToTuple(match.doubleFaults),
      smashedRackets: this.convertToTuple(match.smashedRackets),
      sets: match.result.map((resultSet) => this.mapTennisSet(resultSet)),
    });
  }

  private mapTennisSet(set: Array<number>): TennisSet {
    return new TennisSet({
      result: set,
    });
  }

  private convertToTuple(arr: Array<number>): [number, number] {
    return [arr[0] || 0, arr[1] || 0];
  }
}
