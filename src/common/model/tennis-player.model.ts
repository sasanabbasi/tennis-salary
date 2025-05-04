import { TennisMatchRecord } from './tennis-match-record.model';

export class TennisPlayer {
  public playerId: number;
  public playerName: string;
  private tennisMatches: Array<TennisMatchRecord>;

  constructor(args: { playerId: number; playerName: string }) {
    this.playerId = args.playerId;
    this.playerName = args.playerName;
  }

  public setTennisMatches(matches: Array<TennisMatchRecord>) {
    this.tennisMatches = matches;
  }

  public getTennisMatches(): Array<TennisMatchRecord> {
    return this.tennisMatches;
  }

  public calculateTotalSalary(): number {
    return this.tennisMatches.reduce(
      (acc, match) => acc + match.calculateTotalMatchSalary(),
      0,
    );
  }
}
