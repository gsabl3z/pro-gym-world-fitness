import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';

interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class InventoryService {
  constructor(private db: DatabaseService) {}

  async createProduct(data: CreateProductDto) {
    try {
      const productId = uuid();

      if (!data.name || data.price == null || data.stock == null) {
        throw new Error('Datos incompletos para crear producto');
      }

      await this.db.query(
        `
        INSERT INTO products
          (id, name, price)
        VALUES ($1, $2, $3)
        `,
        [productId, data.name, data.price],
      );

      await this.db.query(
        `
        INSERT INTO inventory
          (id, product_id, stock)
        VALUES ($1, $2, $3)
        `,
        [uuid(), productId, data.stock],
      );

      return { productId };
    } catch (error) {
      console.error('🔥 ERROR EN createProduct:', error);
      throw error;
    }
  }
}
