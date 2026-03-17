import { Controller, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';

interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
}

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('product')
  async createProduct(@Body() body: CreateProductDto) {
    return await this.inventoryService.createProduct(body);
  }
}
