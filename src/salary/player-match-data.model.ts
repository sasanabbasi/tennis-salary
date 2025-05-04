export class PlayerMatch {
  constructor(
    public playerId: string,
    public opponentId: string,
    public result: string,
    public aces: number,
    public smashedRackets: number,
    public doubleFaults: number,
  ) {}
}

export interface RawPlayerMatch {
  playerId: string;
  opponentId: string;
  result: string;
  aces: number;
  smashedRackets: number;
  doubleFaults: number;
}
