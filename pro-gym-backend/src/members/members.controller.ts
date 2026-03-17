import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Post()
  create(@Body() body: CreateMemberDto) {
    return this.membersService.createMember(body);
  }

  @Post(':memberId/memberships/:membershipId')
  assignMembership(
    @Param('memberId') memberId: string,
    @Param('membershipId') membershipId: string,
  ) {
    return this.membersService.assignMembership(memberId, membershipId);
  }

  @Post(':id/membership')
  async assignMembershipBody(
    @Param('id') memberId: string,
    @Body() body: { membership_id: string },
  ) {
    return this.membersService.assignMembership(memberId, body.membership_id);
  }

  // 🔵 CORREGIDO: ahora sí usa await
  @Get(':id/membership')
  async getActiveMembership(@Param('id') memberId: string) {
    return await this.membersService.getActiveMembership(memberId);
  }

  // 🔵 NUEVO ENDPOINT
  @Get(':id/has-active-membership')
  async hasActiveMembership(@Param('id') memberId: string) {
    const active = await this.membersService.checkMembership(memberId);
    return { active };
  }
}
