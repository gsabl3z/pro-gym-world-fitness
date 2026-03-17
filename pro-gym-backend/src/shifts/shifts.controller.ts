import { Controller, Post, Body } from '@nestjs/common';
import { ShiftsService } from './shifts.service';

interface OpenShiftDto {
  user_id: string;
  opening_amount: number;
}

interface CloseShiftDto {
  shift_id: string;
  closing_amount: number;
}

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('open')
  async open(@Body() body: OpenShiftDto) {
    return await this.shiftsService.openShift(
      body.user_id,
      body.opening_amount,
    );
  }

  @Post('close')
  async close(@Body() body: CloseShiftDto) {
    return await this.shiftsService.closeShift(
      body.shift_id,
      body.closing_amount,
    );
  }
}
