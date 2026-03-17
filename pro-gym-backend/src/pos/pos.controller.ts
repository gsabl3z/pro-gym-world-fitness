import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PosService } from './pos.service';

interface CreateSaleDto {
  member_id: string;
  total: number;
  payment_method: string;
  items: {
    type: string;
    id: string;
    quantity: number;
    price: number;
  }[];
}

interface AssignMembershipDto {
  membership_id: string;
}

@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('sale')
  testSale() {
    return { message: 'POS sale endpoint activo' };
  }

  @Post('sale')
  async createSale(@Body() body: CreateSaleDto) {
    return await this.posService.createSale(body);
  }

  @Post(':id/membership')
  async assignMembership(
    @Param('id') memberId: string,
    @Body() body: AssignMembershipDto,
  ) {
    return await this.posService.assignMembership(memberId, body.membership_id);
  }
}
