import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid, validate as isUUID } from 'uuid';

@Injectable()
export class AccessService {
  constructor(private db: DatabaseService) {}

  async validateAccess(memberId: string) {
    // 1. Validar UUID
    if (!isUUID(memberId)) {
      await this.db.query(
        `INSERT INTO access_logs (id, member_id, access_type, status)
         VALUES ($1, NULL, 'qr', 'invalid')`,
        [uuid()],
      );

      return {
        access: false,
        message: 'QR inválido',
      };
    }

    // 2. Verificar membresía activa
    const membership = await this.db.query(
      `
      SELECT id
      FROM member_memberships
      WHERE member_id = $1
        AND status = 'active'
        AND start_date <= CURRENT_DATE
        AND end_date >= CURRENT_DATE
      LIMIT 1
      `,
      [memberId],
    );

    const hasAccess = membership.length > 0;

    // 3. Registrar intento
    await this.db.query(
      `
      INSERT INTO access_logs
        (id, member_id, access_type, status)
      VALUES
        ($1, $2, 'qr', $3)
      `,
      [uuid(), memberId, hasAccess ? 'granted' : 'denied'],
    );

    // 4. Respuesta
    return {
      access: hasAccess,
      message: hasAccess ? 'Acceso permitido' : 'Membresía vencida',
    };
  }
}
