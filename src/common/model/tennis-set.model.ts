export class TennisSet {
  private result: number[];

  constructor(args: { result: number[] }) {
    this.result = args.result;
  }

  public isSetWon(playerPosition: number): boolean {
    return (
      this.result[playerPosition] >= 6 &&
      this.result[playerPosition] - this.result[playerPosition ^ 1] >= 2
    );
  }

  public wonGameCount(playerPosition: number): number {
    return this.result[playerPosition];
  }
}
