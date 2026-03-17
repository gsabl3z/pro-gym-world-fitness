import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule], // 👈 ESTA LÍNEA ES LA QUE FALTABA
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
