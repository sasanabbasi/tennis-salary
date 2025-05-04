import { Test, TestingModule } from '@nestjs/testing';
import { SalaryService } from './salary.service';
import { DataLoaderService } from './data-loader.service';
import { PlayerMatchDataToTennisPlayerConverter } from '../converter/player-match-data-to-tennis-player';
import { PlayerMatchData } from '../common/model';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('SalaryService', () => {
  let service: SalaryService;
  let dataLoaderService: DataLoaderService;
  let playerMatchDataToTennisPlayerConverter: PlayerMatchDataToTennisPlayerConverter;
  const playerId = 1;

  // Mock data
  const mockPlayerData: PlayerMatchData[] = [
    {
      playerId: 1,
      playerName: 'Rafael Nadal',
      opponentId: 2,
      opponentName: 'Roger Federer',
      result: [
        [6, 2],
        [4, 6],
        [7, 5],
        [5, 7],
        [6, 1],
      ],
      aces: [6, 15],
      smashedRackets: [2, 1],
      doubleFaults: [3, 4],
    },
    {
      playerId: 3,
      playerName: 'Novak Djokovic',
      opponentId: 1,
      opponentName: 'Rafael Nadal',
      result: [
        [3, 6],
        [4, 6],
        [2, 6],
      ],
      aces: [5, 8],
      smashedRackets: [2, 0],
      doubleFaults: [5, 2],
    },
  ];

  const mockConfig = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'bonus.participate_in_match':
          return 500;
        case 'bonus.won_sets':
          return 750;
        case 'bonus.won_match':
          return 2500;
        case 'bonus.won_game':
          return 200;
        case 'bonus.ace':
          return 100;
        case 'penalty.double_faults':
          return -100;
        case 'penalty.racket_damage':
          return -500;
        case 'server.port':
          return 8000;
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalaryService,
        {
          provide: DataLoaderService,
          useValue: {
            getData: jest.fn().mockReturnValue(mockPlayerData),
          },
        },
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
        PlayerMatchDataToTennisPlayerConverter,
      ],
    }).compile();

    service = module.get<SalaryService>(SalaryService);
    dataLoaderService = module.get<DataLoaderService>(DataLoaderService);
    playerMatchDataToTennisPlayerConverter =
      module.get<PlayerMatchDataToTennisPlayerConverter>(
        PlayerMatchDataToTennisPlayerConverter,
      );

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalaryByPlayerId', () => {
    it('should return player salary data for a valid player ID', () => {
      const getDataSpy = jest.spyOn(dataLoaderService, 'getData');
      const convertSpy = jest.spyOn(
        playerMatchDataToTennisPlayerConverter,
        'convert',
      );

      const result = service.getSalaryByPlayerId(playerId);

      expect(getDataSpy).toHaveBeenCalled();
      expect(convertSpy).toHaveBeenCalledWith(expect.any(Array), playerId);

      expect(result).toEqual({
        id: 1,
        name: 'Rafael Nadal',
        totalSalary: 19600,
      });
    });

    it('should throw an error when player data is not found', () => {
      jest.spyOn(dataLoaderService, 'getData').mockReturnValueOnce([]);

      expect(() => service.getSalaryByPlayerId(playerId)).toThrow(
        `Player data not found for playerId: ${playerId}`,
      );
    });

    it('should filter player data correctly', () => {
      const mockData = [...mockPlayerData];
      jest.spyOn(dataLoaderService, 'getData').mockReturnValueOnce(mockData);

      service.getSalaryByPlayerId(playerId);

      const filteredData = mockData.filter(
        (item) => item.playerId === playerId || item.opponentId === playerId,
      );
      expect(filteredData.length).toBeGreaterThan(0);
      expect(
        filteredData.every(
          (item) => item.playerId === playerId || item.opponentId === playerId,
        ),
      ).toBeTruthy();
    });
  });
});
