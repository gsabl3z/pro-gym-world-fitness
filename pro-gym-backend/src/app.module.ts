import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PosModule } from './pos/pos.module';
import { InventoryModule } from './inventory/inventory.module';
import { MembersModule } from './members/members.module';
import { AccessModule } from './access/access.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ShiftsModule } from './shifts/shifts.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    PosModule,
    InventoryModule,
    MembersModule,
    AccessModule,
    DashboardModule,
    ShiftsModule, // 👈 Ya funciona porque el módulo está exportado
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
