import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from 'src/jwt/jwt-auth-guard';
import { RolesGuard } from 'src/jwt/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard,RolesGuard)
export class AdminController {
  @Get()
  @Roles('admin')
  getAdminData() {
    return { message: 'Admin-only route' };
  }
}
