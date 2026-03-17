import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  async getMetrics() {
    // Ventas de hoy
    const salesToday = await this.db.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM sales
      WHERE DATE(created_at) = CURRENT_DATE
      `,
    );

    // Ingresos de hoy
    const incomeToday = await this.db.query<{ income: string }>(
      `
      SELECT COALESCE(SUM(total), 0) AS income
      FROM sales
      WHERE DATE(created_at) = CURRENT_DATE
      `,
    );

    // Miembros activos
    const activeMembers = await this.db.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM member_memberships
      WHERE status = 'active'
      AND end_date >= CURRENT_DATE
      `,
    );

    // Membresías expiradas
    const expiredMemberships = await this.db.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM member_memberships
      WHERE end_date < CURRENT_DATE
      `,
    );

    return {
      sales_today: Number(salesToday[0].count),
      income_today: Number(incomeToday[0].income),
      active_members: Number(activeMembers[0].count),
      expired_memberships: Number(expiredMemberships[0].count),
    };
  }
}
