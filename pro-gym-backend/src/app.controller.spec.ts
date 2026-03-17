import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DatabaseService } from './database/database.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DatabaseService,
          useValue: {
            query: jest.fn().mockResolvedValue([{ now: 'test-date' }]),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return test-db result', async () => {
    const result = await appController.testDb();
    expect(result).toEqual({ now: 'test-date' });
  });
});
