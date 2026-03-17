import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AccessService } from './access.service';
import { validate as isUUID } from 'uuid';

@Controller('access')
export class AccessController {
  constructor(private accessService: AccessService) {}

  @Post('check')
  async check(@Body() body: { member_id: string }) {
    if (!body.member_id) {
      throw new BadRequestException('member_id es requerido');
    }

    if (!isUUID(body.member_id)) {
      return {
        access: false,
        message: 'QR inválido',
      };
    }

    return this.accessService.validateAccess(body.member_id);
  }
}
