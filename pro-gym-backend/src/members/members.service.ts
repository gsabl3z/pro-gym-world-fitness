import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';

interface CreateMemberDto {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

@Injectable()
export class MembersService {
  constructor(private db: DatabaseService) {}

  async createMember(data: CreateMemberDto) {
    const id = uuid();

    await this.db.query(
      `
      INSERT INTO members
        (id, first_name, last_name, phone, email)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [id, data.first_name, data.last_name, data.phone, data.email],
    );

    return { id };
  }

  async findAll() {
    return this.db.query(
      `
      SELECT id, first_name, last_name, phone, email
      FROM members
      ORDER BY first_name ASC
      `,
    );
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

    return { message: 'Membresía asignada' };
  }

  // 🔵 NUEVO MÉTODO AÑADIDO AQUÍ
  async getActiveMembership(memberId: string) {
    const result = await this.db.query(
      `
      SELECT 
        mm.id,
        mm.start_date,
        mm.end_date,
        mm.status,
        m.name AS membership_name,
        m.duration_days,
        m.price
      FROM member_memberships mm
      JOIN memberships m ON m.id = mm.membership_id
      WHERE mm.member_id = $1
        AND mm.status = 'active'
      ORDER BY mm.start_date DESC
      LIMIT 1
      `,
      [memberId],
    );

    if (result.length === 0) {
      return { message: 'El miembro no tiene membresía activa' };
    }

    return result[0];
  }

  // 🔵 NUEVO MÉTODO AÑADIDO AQUÍ
  async checkMembership(memberId: string) {
    const result = await this.db.query(
      `
      SELECT *
      FROM member_memberships
      WHERE member_id = $1
        AND status = 'active'
        AND end_date >= CURRENT_DATE
      `,
      [memberId],
    );

    return result.length > 0;
  }
}
