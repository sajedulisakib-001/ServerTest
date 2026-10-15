import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { sanitizeString, sanitizePhone } from '../../common/utils/sanitize';
import { hasPermission, PERMISSIONS } from '../../common/constants/permissions';
import { clearStaffCache } from '../../common/guards/admin.guard';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, pass: string): Promise<any> {
    const identifier = typeof emailOrUsername === 'string' ? emailOrUsername.trim().toLowerCase() : '';
    const password = typeof pass === 'string' ? pass : '';

    if (!identifier || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const cleanedPhone = sanitizePhone(identifier);

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifier, mode: 'insensitive' } },
          { name: { equals: identifier, mode: 'insensitive' } },
          { phone: { equals: identifier, mode: 'insensitive' } },
          ...(cleanedPhone ? [{ phone: { equals: cleanedPhone, mode: 'insensitive' as const } }] : []),
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isActive === false) {
      throw new UnauthorizedException('Account has been suspended by store administration');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      userId: user.id,
      role: user.role,
      name: user.name,
      permissions: user.permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photo: user.photo,
        permissions: user.permissions,
        isActive: user.isActive,
      },
    };
  }

  async getProfile(userId: number) {
    const id = Number(userId);
    if (isNaN(id) || id <= 0) {
      throw new UnauthorizedException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        photo: true,
        nidNumber: true,
        nidPhoto: true,
        presentAddress: true,
        permanentAddress: true,
        permissions: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: number,
    data: {
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
    const id = Number(userId);
    if (isNaN(id) || id <= 0) {
      throw new UnauthorizedException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isSuperAdmin = user.role === 'admin';
    const canEditAll = isSuperAdmin || hasPermission(user, PERMISSIONS.EDIT_ALL_PROFILE_INFO);

    // If an ordinary moderator tries to modify restricted fields, block and advise
    const restrictedAttempt =
      (data.name !== undefined && data.name !== user.name) ||
      (data.nidNumber !== undefined && data.nidNumber !== user.nidNumber) ||
      (data.nidPhoto !== undefined && data.nidPhoto !== user.nidPhoto) ||
      (data.presentAddress !== undefined && data.presentAddress !== user.presentAddress) ||
      (data.permanentAddress !== undefined && data.permanentAddress !== user.permanentAddress);

    if (!canEditAll && restrictedAttempt) {
      throw new ForbiddenException(
        'To update confidential profile details (NID number, NID photo, full name, or addresses), please submit a change request to the store administrator.',
      );
    }

    const updatePayload: any = {};

    if (data.email !== undefined) {
      const cleanEmail = sanitizeString(data.email, 150).toLowerCase();
      if (cleanEmail && cleanEmail !== user.email) {
        const existing = await this.prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (existing && existing.id !== id) {
          throw new BadRequestException('Email address is already in use by another account');
        }
        updatePayload.email = cleanEmail;
      }
    }

    if (data.phone !== undefined) {
      updatePayload.phone = sanitizePhone(data.phone);
    }

    if (data.photo !== undefined) {
      updatePayload.photo = sanitizeString(data.photo, 1000);
    }

    if (canEditAll) {
      if (data.name !== undefined) {
        updatePayload.name = sanitizeString(data.name, 100);
      }
      if (data.nidNumber !== undefined) {
        updatePayload.nidNumber = sanitizeString(data.nidNumber, 100);
      }
      if (data.nidPhoto !== undefined) {
        updatePayload.nidPhoto = sanitizeString(data.nidPhoto, 1000);
      }
      if (data.presentAddress !== undefined) {
        updatePayload.presentAddress = sanitizeString(data.presentAddress, 1000);
      }
      if (data.permanentAddress !== undefined) {
        updatePayload.permanentAddress = sanitizeString(data.permanentAddress, 1000);
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        photo: true,
        nidNumber: true,
        nidPhoto: true,
        presentAddress: true,
        permanentAddress: true,
        permissions: true,
        isActive: true,
        updatedAt: true,
      },
    });

    clearStaffCache(id);

    return updated;
  }

  async changePassword(userId: number, currentPass: string, newPass: string) {
    const id = Number(userId);
    if (isNaN(id) || id <= 0) {
      throw new UnauthorizedException('Invalid user ID');
    }
    if (!currentPass || !newPass) {
      throw new UnauthorizedException('Current password and new password are required');
    }
    if (newPass.trim().length < 6) {
      throw new UnauthorizedException('New password must be at least 6 characters long');
    }
    if (currentPass === newPass) {
      throw new UnauthorizedException('New password must be different from current password');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const hashedNew = await bcrypt.hash(newPass.trim(), 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    clearStaffCache(id);

    return { success: true, message: 'Password updated successfully' };
  }

  async getSetupStatus() {
    const adminCount = await this.prisma.user.count({
      where: { role: 'admin' },
    });
    const totalUsers = await this.prisma.user.count();
    const setupSetting = await this.prisma.setting.findUnique({
      where: { key: 'first_run_completed' },
    });
    // Setup is completed whenever an admin exists
    const isCompleted = adminCount > 0;

    // Auto-heal setting flag if missing
    if (isCompleted && setupSetting?.value !== 'true') {
      this.prisma.setting
        .upsert({
          where: { key: 'first_run_completed' },
          update: { value: 'true' },
          create: {
            key: 'first_run_completed',
            value: 'true',
            description: 'First-run setup completed flag',
          },
        })
        .catch(() => {});
    }

    return {
      isSetupRequired: !isCompleted,
      adminCount,
      totalUsers,
    };
  }

  async firstRunSetup(data: {
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
  }) {
    const adminCount = await this.prisma.user.count({
      where: { role: 'admin' },
    });
    if (adminCount > 0) {
      throw new BadRequestException('Initial setup has already been completed. Please log in.');
    }

    const cleanEmail = sanitizeString(data.email || '', 150).toLowerCase();
    const cleanName = sanitizeString(data.name || '', 100);
    const rawPassword = data.password ? data.password.trim() : '';
    const cleanPhone = data.phone ? sanitizePhone(data.phone) : '';
    const storeName = sanitizeString(data.store_name || '', 100);
    const siteTitle = sanitizeString(data.site_title || '', 150);
    const contactPhone = data.contact_phone ? sanitizePhone(data.contact_phone) : cleanPhone;
    const contactEmail = sanitizeString(data.contact_email || '', 150).toLowerCase();
    const deliveryDhaka = sanitizeString(data.delivery_charge_dhaka || '', 10);
    const deliveryOutside = sanitizeString(data.delivery_charge_outside || '', 10);

    if (!cleanName) {
      throw new BadRequestException('Administrator full name is required');
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new BadRequestException('A valid administrator email address is required');
    }
    if (!cleanPhone) {
      throw new BadRequestException('Administrator contact phone number is required');
    }
    if (!rawPassword || rawPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }
    if (!storeName) {
      throw new BadRequestException('Store or brand name is required');
    }
    if (!siteTitle) {
      throw new BadRequestException('Website title is required');
    }
    if (!contactPhone) {
      throw new BadRequestException('Support contact phone is required');
    }
    if (!contactEmail || !contactEmail.includes('@')) {
      throw new BadRequestException('Support contact email is required');
    }
    if (!deliveryDhaka) {
      throw new BadRequestException('Delivery charge inside Dhaka is required');
    }
    if (!deliveryOutside) {
      throw new BadRequestException('Delivery charge outside Dhaka is required');
    }

    // 1. Hash password & create Superadmin user
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const superAdmin = await this.prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        phone: cleanPhone,
        role: 'admin',
        isActive: true,
      },
    });

    // 2. Upsert Store and Site Settings
    const settingsToSave = [
      { key: 'store_name', value: storeName, description: 'Store Brand Name' },
      { key: 'site_title', value: siteTitle, description: 'Website Title' },
      { key: 'contact_phone', value: contactPhone, description: 'Support Phone' },
      { key: 'contact_whatsapp', value: contactPhone, description: 'Support WhatsApp' },
      { key: 'contact_email', value: contactEmail, description: 'Support Email' },
      { key: 'delivery_charge_dhaka', value: deliveryDhaka, description: 'Delivery Inside Dhaka (BDT)' },
      { key: 'delivery_charge_outside', value: deliveryOutside, description: 'Delivery Charge Outside Dhaka (BDT)' },
      { key: 'category_card_style', value: 'capsule', description: 'Homepage Category Card Style' },
      { key: 'first_run_completed', value: 'true', description: 'First-run setup completed flag' },
    ];

    for (const s of settingsToSave) {
      await this.prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    // 3. Automatically log the newly created superadmin in
    return this.login(superAdmin);
  }
}
