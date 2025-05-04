export class PlayerMatchData {
  constructor(
    public playerId: number,
    public playerName: string,
    public opponentId: number,
    public opponentName: string,
    public result: number[][],
    public aces: number[],
    public smashedRackets: number[],
    public doubleFaults: number[],
  ) {}
}
