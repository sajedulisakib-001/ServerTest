import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions';
import { Request } from 'express';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @RateLimit({ limit: 30, ttl: 60000 })
  @Post()
  async create(@Body() body: any, @Req() req: Request) {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return this.ordersService.createOrder({
      ...body,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
    });
  }

  @RateLimit({ limit: 20, ttl: 60000 })
  @Get('track')
  async trackOrder(
    @Query('orderNumber') orderNumber: string,
    @Query('phone') phone: string,
    @Query('token') token: string,
    @Req() req: Request,
  ) {
    if (!token || !token.trim()) {
      throw new BadRequestException('Order Access Code (secret token) is strictly required to track an order');
    }
    return this.ordersService.trackOrder(orderNumber, phone, token.trim());
  }

  @RateLimit({ limit: 20, ttl: 60000 })
  @Get('verify')
  async verifyOrder(
    @Query('orderNumber') orderNumber: string,
    @Query('token') token: string,
    @Req() req: Request,
  ) {
    return this.ordersService.findByNumberAndToken(orderNumber, token);
  }

  @Get('number/:orderNumber')
  async findByOrderNumber(
    @Param('orderNumber') orderNumber: string,
    @Query('token') token?: string,
  ) {
    if (!token) {
      throw new BadRequestException('Security access token required to view order');
    }
    return this.ordersService.findByNumberAndToken(orderNumber, token);
  }

  @Get('lookup/:orderNumber')
  async lookupOrder(
    @Param('orderNumber') orderNumber: string,
    @Query('token') token?: string,
  ) {
    if (!token) {
      throw new BadRequestException('Security access token required to view order');
    }
    return this.ordersService.findByNumberAndToken(orderNumber, token);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @RequirePermissions(PERMISSIONS.ORDERS_VIEW)
  @Get('admin/stats')
  async getDashboardStats() {
    return this.ordersService.getDashboardStats();
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @RequirePermissions(PERMISSIONS.ORDERS_VIEW)
  @Get('admin/list')
  async findAll(@Query() query: any) {
    return this.ordersService.findAll({
      search: query.search,
      status: query.status,
      paymentStatus: query.paymentStatus,
      paymentMethod: query.paymentMethod,
      district: query.district,
      size: query.size,
      sortBy: query.sortBy,
      startDate: query.startDate,
      endDate: query.endDate,
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 20,
    });
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @RequirePermissions(PERMISSIONS.ORDERS_VIEW)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @RequirePermissions(PERMISSIONS.ORDERS_EDIT)
  @Put(':id/status')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @RequirePermissions(PERMISSIONS.ORDERS_EDIT)
  @Put(':id/admin-note')
  async updateAdminNote(@Param('id', ParseIntPipe) id: number, @Body('adminNote') adminNote: string) {
    return this.ordersService.updateAdminNote(id, adminNote);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @RequirePermissions(PERMISSIONS.ORDERS_EDIT)
  @Put(':id/switch-cod')
  async switchToCod(@Param('id', ParseIntPipe) id: number, @Body('adminNote') adminNote?: string) {
    return this.ordersService.switchToCod(id, adminNote);
  }
}
