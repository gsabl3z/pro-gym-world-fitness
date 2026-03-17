import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';

interface SaleItem {
  type: string;
  id: string;
  quantity: number;
  price: number;
}

interface CreateSaleDto {
  member_id: string;
  total: number;
  payment_method: string;
  items: SaleItem[];
}

@Injectable()
export class PosService {
  constructor(private readonly db: DatabaseService) {}

  async createSale(data: CreateSaleDto) {
    const saleId = uuid();

    if (!data.items || data.items.length === 0) {
      throw new Error('La venta debe incluir al menos un item');
    }

    await this.db.query(
      `
        INSERT INTO sales
          (id, member_id, total, payment_method)
        VALUES ($1, $2, $3, $4)
      `,
      [saleId, data.member_id, data.total, data.payment_method],
    );

    for (const item of data.items) {
      await this.db.query(
        `
          INSERT INTO sale_items
            (id, sale_id, item_type, item_id, quantity, price)
          VALUES
            ($1, $2, $3, $4, $5, $6)
        `,
        [uuid(), saleId, item.type, item.id, item.quantity, item.price],
      );

      if (item.type === 'product') {
        await this.db.query(
          `
            UPDATE inventory
            SET stock = stock - $1
            WHERE product_id = $2
          `,
          [item.quantity, item.id],
        );
      }
    }

    return { saleId };
  }

  async assignMembership(memberId: string, membershipId: string) {
    const id = uuid();

    const membership = await this.db.query<{ duration_days: number }>(
      `
        SELECT duration_days
        FROM memberships
        WHERE id = $1
      `,
      [membershipId],
    );

    if (membership.length === 0) {
      throw new Error('La membresía no existe');
    }

    const duration = membership[0].duration_days;

    await this.db.query(
      `
        INSERT INTO member_memberships
          (id, member_id, membership_id, start_date, end_date, status)
        VALUES
          ($1, $2, $3, CURRENT_DATE, CURRENT_DATE + ($4 * INTERVAL '1 day'), 'active')
      `,
      [id, memberId, membershipId, duration],
    );

    return { message: 'Membresía asignada desde POS' };
  }
}
