import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  home() {
    return { message: 'API Pro Gym funcionando correctamente' };
  }

  @Get('test-db')
  async testDb() {
    const result = await this.db.query<{ now: string }>('SELECT NOW() as now');
    return result[0];
  }
}
