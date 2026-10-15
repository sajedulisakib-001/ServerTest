import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('setup-status')
  async getSetupStatus() {
    return this.authService.getSetupStatus();
  }

  @Post('first-run-setup')
  @HttpCode(HttpStatus.OK)
  async firstRunSetup(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      store_name?: string;
      site_title?: string;
      contact_phone?: string;
      contact_email?: string;
      delivery_charge_dhaka?: string;
      delivery_charge_outside?: string;
    },
  ) {
    return this.authService.firstRunSetup(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email?: string; username?: string; password?: string }) {
    const identifier = (body?.email || body?.username || '').trim();
    const password = body?.password || '';
    const user = await this.authService.validateUser(identifier, password);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req: any) {
    const userId = Number(req.user.userId || req.user.sub);
    return this.authService.getProfile(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(
    @Request() req: any,
    @Body()
    body: {
      name?: string;
      email?: string;
      phone?: string;
      photo?: string;
      nidNumber?: string;
      nidPhoto?: string;
      presentAddress?: string;
      permanentAddress?: string;
    },
  ) {
    const userId = req.user.userId || req.user.sub;
    return this.authService.updateProfile(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(
    @Request() req: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = req.user.userId || req.user.sub;
    return this.authService.changePassword(userId, body.currentPassword, body.newPassword);
  }
}
