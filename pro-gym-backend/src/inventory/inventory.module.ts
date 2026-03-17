import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule], // ← NECESARIO para inyectar DatabaseService
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
