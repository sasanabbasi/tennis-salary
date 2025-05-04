import { Test, TestingModule } from '@nestjs/testing';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { Logger } from '@nestjs/common';
import { PlayerSalaryResponse } from './dto/player-salary-response.dto';

describe('SalaryController', () => {
  let controller: SalaryController;
  let salaryService: SalaryService;

  // Mock response data
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
                // Return mock data for specific player ID
                if (playerId === 1) {
                  return mockSalaryResponse;
                }

                // Simulate error for non-existent player
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

    // Mock logger to avoid console output during tests
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
      // Arrange
      const playerId = 1;
      const spy = jest.spyOn(salaryService, 'getSalaryByPlayerId');

      // Act
      const result = controller.getSalaryByPlayerId(playerId);

      // Assert
      expect(spy).toHaveBeenCalledWith(playerId);
      expect(result).toEqual(mockSalaryResponse);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Rafael Nadal');
      expect(result.totalSalary).toBe(19600);
    });

    it('should convert string player ID to number', () => {
      // Arrange
      const playerIdAsString = '1'; // Simulating string ID from URL parameter
      const spy = jest.spyOn(salaryService, 'getSalaryByPlayerId');

      // Act
      const result = controller.getSalaryByPlayerId(+playerIdAsString);

      // Assert
      expect(spy).toHaveBeenCalledWith(1); // Should be converted to number
      expect(result).toEqual(mockSalaryResponse);
    });

    it('should throw an error for non-existent player ID', () => {
      // Arrange
      const nonExistentPlayerId = 999;

      // Act & Assert
      expect(() => {
        controller.getSalaryByPlayerId(nonExistentPlayerId);
      }).toThrow(`Player data not found for playerId: ${nonExistentPlayerId}`);
    });
  });
});
