import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { DatabaseModule } from '../database/database.module'; // ✅ Asegúrate que esta ruta sea correcta

@Module({
  imports: [DatabaseModule], // ✅ Esto es lo que soluciona el error
  controllers: [PosController],
  providers: [PosService],
})
export class PosModule {}
