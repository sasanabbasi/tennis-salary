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
    const player = this.getTennisPlayer(matchData[0], mainPlayerId);

    player.setTennisMatches(
      matchData.map((match) => this.mapTennisMatch(match, mainPlayerId)),
    );

    return player;
  }

  private getTennisPlayer(
    match: PlayerMatchData,
    mainPlayerId: number,
  ): TennisPlayer {
    return match.playerId === mainPlayerId
      ? new TennisPlayer({
          playerId: match.playerId,
          playerName: match.playerName,
        })
      : new TennisPlayer({
          playerId: match.opponentId,
          playerName: match.opponentName,
        });
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
