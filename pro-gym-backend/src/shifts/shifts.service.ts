import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ShiftsService {
  constructor(private readonly db: DatabaseService) {}

  async openShift(userId: string, openingAmount: number) {
    const id = uuid();

    await this.db.query(
      `
        INSERT INTO shifts (id, user_id, opening_amount, status)
        VALUES ($1, $2, $3, 'open')
      `,
      [id, userId, openingAmount],
    );

    return { shiftId: id };
  }

  async closeShift(shiftId: string, closingAmount: number) {
    const shift = await this.db.query(
      `
        SELECT *
        FROM shifts
        WHERE id = $1 AND status = 'open'
      `,
      [shiftId],
    );

    if (shift.length === 0) {
      throw new Error('El turno no existe o ya está cerrado');
    }

    const sales = await this.db.query<{ total: number }>(
      `
        SELECT COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE shift_id = $1
      `,
      [shiftId],
    );

    const expected = sales[0].total;

    await this.db.query(
      `
        UPDATE shifts
        SET
          closed_at = CURRENT_TIMESTAMP,
          closing_amount = $1,
          expected_amount = $2,
          status = 'closed'
        WHERE id = $3
      `,
      [closingAmount, expected, shiftId],
    );

    return {
      shiftId,
      expected_amount: expected,
      closing_amount: closingAmount,
      difference: closingAmount - expected,
    };
  }
}
