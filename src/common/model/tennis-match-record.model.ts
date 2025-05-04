import { TennisSet } from './tennis-set.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TennisMatchRecord {
  public opponentId: number;
  public opponentName: string;
  public playerPosition: number;
  public opponentPosition: number;
  private sets: Array<TennisSet>;
  private aces: [number, number];
  private doubleFaults: [number, number];
  private smashedRackets: [number, number];
  private totalSalary: number;

  constructor(
    private readonly configService: ConfigService,
    args: {
      opponentId: number;
      opponentName: string;
      playerPosition: number;
      aces: [number, number];
      doubleFaults: [number, number];
      smashedRackets: [number, number];
      sets: Array<TennisSet>;
    },
  ) {
    this.opponentId = args.opponentId;
    this.opponentName = args.opponentName;
    this.playerPosition = args.playerPosition;
    this.opponentPosition = args.playerPosition ^ 1;
    this.aces = args.aces;
    this.doubleFaults = args.doubleFaults;
    this.smashedRackets = args.smashedRackets;
    this.sets = args.sets;
    this.totalSalary = 0;
  }

  public wonSetsCount(): number {
    return this.sets.filter((set) => set.isSetWon(this.playerPosition)).length;
  }

  public isMatchWon(): boolean {
    return this.wonSetsCount() >= 3;
  }

  public calculateParticipateInMatchBonus(): this {
    this.totalSalary += this.configService.get<number>(
      'bonus.participate_in_match',
    )!;
    return this;
  }

  public calculateWonSetsBonus(): this {
    this.totalSalary +=
      this.wonSetsCount() * this.configService.get<number>('bonus.won_sets')!;
    return this;
  }

  public calculateWonMatchBonus(): this {
    this.totalSalary += this.isMatchWon()
      ? this.configService.get<number>('bonus.won_match')!
      : 0;
    return this;
  }

  public calculateWonGameBonus(): this {
    this.totalSalary +=
      this.sets.reduce(
        (acc, set) => acc + set.wonGameCount(this.playerPosition),
        0,
      ) * this.configService.get<number>('bonus.won_game')!;
    return this;
  }

  public calculateDoubleFaultsPenalty(): this {
    this.totalSalary +=
      this.doubleFaults[this.playerPosition] *
      this.configService.get<number>('penalty.double_faults')!;
    return this;
  }

  public calculateRacketDamagePenalty(): this {
    this.totalSalary +=
      this.smashedRackets[this.playerPosition] *
      this.configService.get<number>('penalty.racket_damage')!;
    return this;
  }

  public calculateAceBonus(): this {
    this.totalSalary +=
      this.aces[this.playerPosition] *
      this.configService.get<number>('bonus.ace')!;
    return this;
  }

  public calculateTotalMatchSalary(): number {
    this.totalSalary = 0;

    this.calculateParticipateInMatchBonus()
      .calculateWonSetsBonus()
      .calculateWonMatchBonus()
      .calculateWonGameBonus()
      .calculateDoubleFaultsPenalty()
      .calculateRacketDamagePenalty()
      .calculateAceBonus();

    return this.totalSalary;
  }
}
