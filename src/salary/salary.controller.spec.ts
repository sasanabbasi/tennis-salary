import { Test, TestingModule } from '@nestjs/testing';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { Logger } from '@nestjs/common';
import { PlayerSalaryResponse } from './dto/player-salary-response.dto';

describe('SalaryController', () => {
  let controller: SalaryController;
  let salaryService: SalaryService;

  const mockSalaryResponse: PlayerSalaryResponse = {
    id: 1,
    name: 'Rafael Nadal',
    totalSalary: 19600,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryController],
      providers: [
        {
          provide: SalaryService,
          useValue: {
            getSalaryByPlayerId: jest
              .fn()
              .mockImplementation((playerId: number) => {
                if (playerId === 1) {
                  return mockSalaryResponse;
                }

                throw new Error(
                  `Player data not found for playerId: ${playerId}`,
                );
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<SalaryController>(SalaryController);
    salaryService = module.get<SalaryService>(SalaryService);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSalaryByPlayerId', () => {
    it('should return player salary data for a valid player ID', () => {
      const playerId = 1;
      const spy = jest.spyOn(salaryService, 'getSalaryByPlayerId');

      const result = controller.getSalaryByPlayerId(playerId);

      expect(spy).toHaveBeenCalledWith(playerId);
      expect(result).toEqual(mockSalaryResponse);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Rafael Nadal');
      expect(result.totalSalary).toBe(19600);
    });

    it('should convert string player ID to number', () => {
      const playerIdAsString = '1';
      const spy = jest.spyOn(salaryService, 'getSalaryByPlayerId');

      const result = controller.getSalaryByPlayerId(+playerIdAsString);

      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSalaryResponse);
    });

    it('should throw an error for non-existent player ID', () => {
      const nonExistentPlayerId = 999;

      expect(() => {
        controller.getSalaryByPlayerId(nonExistentPlayerId);
      }).toThrow(`Player data not found for playerId: ${nonExistentPlayerId}`);
    });
  });
});
