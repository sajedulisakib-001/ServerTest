import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  generateOrderAccessToken,
  getOrderNumberCandidates,
  getPhoneNumberCandidates,
  isValidOrderAccessToken,
} from '../../common/utils/order-verification';
import { sanitizeString, sanitizePhone, sanitizeNumber } from '../../common/utils/sanitize';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async generateOrderNumber(): Promise<string> {
    const lastOrder = await this.prisma.order.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });
    const nextId = (lastOrder?.id || 0) + 1;
    const padded = String(nextId + 100).padStart(6, '0');
    return `#WM${padded}`;
  }

  async createOrder(data: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    district: string;
    areaThana?: string;
    deliveryNote?: string;
    items: Array<{
      productId?: number;
      variantId?: number;
      productName?: string;
      sizeName?: string;
      unitPrice?: number;
      quantity?: number;
      totalPrice?: number;
      colour?: string;
      colourHex?: string;
    }>;
    promoCode?: string;
    discountAmount?: number;
    subtotal?: number;
    deliveryCharge?: number;
    total?: number;
    paymentMethod?: string;
    paymentStatus?: string;
    paymentId?: string;
    trxId?: string;
    customerNote?: string;
    ipAddress?: string;
  }) {
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // 1. Sanitize customer information (support direct and alias field names)
    const rawName = (data as any).customerName || (data as any).name;
    const rawPhone = (data as any).phone || (data as any).customerPhone;
    const rawEmail = (data as any).email || (data as any).customerEmail;
    const rawAddress = (data as any).address || (data as any).customerAddress;
    const rawDistrict = (data as any).district || (data as any).customerCity || (data as any).shippingMethod || 'inside_dhaka';

    const customerName = sanitizeString(rawName, 100);
    const phone = sanitizePhone(rawPhone);
    const email = rawEmail ? sanitizeString(rawEmail, 120) : null;
    const address = sanitizeString(rawAddress, 500);
    const district = sanitizeString(rawDistrict, 50);
    const areaThana = data.areaThana ? sanitizeString(data.areaThana, 100) : null;
    const deliveryNote = data.deliveryNote ? sanitizeString(data.deliveryNote, 500) : null;
    const customerNote = data.customerNote ? sanitizeString(data.customerNote, 500) : null;

    if (!customerName || !phone || !address) {
      throw new BadRequestException('Customer name, phone, and address are required');
    }

    // 2. Batch-resolve items with authoritative server-side verified pricing (O(1) Map lookups)
    const variantIds = Array.from(new Set(data.items.map((it) => Number(it.variantId)).filter((id) => !isNaN(id) && id > 0)));
    const productIds = Array.from(new Set(data.items.map((it) => Number(it.productId)).filter((id) => !isNaN(id) && id > 0)));

    const [variantsList, productsList] = await Promise.all([
      variantIds.length > 0
        ? this.prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            include: { product: true },
          })
        : Promise.resolve([]),
      productIds.length > 0
        ? this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { variants: true },
          })
        : Promise.resolve([]),
    ]);

    const variantMap = new Map<number, (typeof variantsList)[0]>();
    for (const v of variantsList) variantMap.set(v.id, v);

    const productMap = new Map<number, (typeof productsList)[0]>();
    for (const p of productsList) productMap.set(p.id, p);

    const resolvedItems = data.items.map((item) => {
      let pName = sanitizeString(item.productName || '', 150);
      let sName = sanitizeString(item.sizeName || '', 50);
      let uPrice = 0;
      let validProductId: number | null = null;
      let validVariantId: number | null = null;
      const qty = Math.max(1, Math.min(100, Math.floor(sanitizeNumber(item.quantity, 1))));

      if (item.variantId && variantMap.has(Number(item.variantId))) {
        const variant = variantMap.get(Number(item.variantId))!;
        pName = variant.product?.name || pName;
        sName = variant.sizeName || 'Standard';
        uPrice = Number(variant.price);
        validVariantId = variant.id;
        validProductId = variant.productId || null;
      } else if (item.productId && productMap.has(Number(item.productId))) {
        const product = productMap.get(Number(item.productId))!;
        pName = product.name;
        sName = product.variants?.[0]?.sizeName || 'Standard';
        uPrice = Number(product.variants?.[0]?.price || 4500);
        validProductId = product.id;
        validVariantId = product.variants?.[0]?.id || null;
      }

      // Fallback only if product/variant was not found in DB
      if (!uPrice) {
        uPrice = Math.max(0, sanitizeNumber(item.unitPrice, 4500));
      }
      if (!pName) pName = '3D Wooden World Map';
      if (!sName) sName = 'Standard';

      const totPrice = Math.round(uPrice * qty);

      return {
        productId: validProductId,
        variantId: validVariantId,
        productName: pName,
        sizeName: sName,
        unitPrice: uPrice,
        quantity: qty,
        totalPrice: totPrice,
        colour: item.colour ? sanitizeString(item.colour, 50) : null,
        colourHex: item.colourHex ? sanitizeString(item.colourHex, 20) : null,
      };
    });

    // 3. Authoritative server-side subtotal
    const verifiedSubtotal = resolvedItems.reduce((acc, it) => acc + it.totalPrice, 0);

    // 4. Authoritative server-side promo code validation & discount calculation
    let verifiedPromoCode: string | null = null;
    let verifiedDiscount = 0;

    if (data.promoCode && data.promoCode.trim()) {
      const cleanCode = data.promoCode.trim().toUpperCase();
      const promo = await this.prisma.promoCode.findUnique({
        where: { code: cleanCode },
      });

      if (promo && promo.isActive) {
        const now = new Date();
        const startValid = !promo.startDate || now >= new Date(promo.startDate);
        const endValid = !promo.endDate || now <= new Date(promo.endDate);
        const limitValid = !promo.usageLimit || promo.usedCount < promo.usageLimit;
        const minValid = verifiedSubtotal >= Number(promo.minOrderAmount || 0);

        if (startValid && endValid && limitValid && minValid) {
          verifiedPromoCode = cleanCode;
          const discountVal = Number(promo.discountValue) || 0;
          if (promo.discountType === 'percentage') {
            verifiedDiscount = (verifiedSubtotal * discountVal) / 100;
            if (promo.maxDiscountAmount && Number(promo.maxDiscountAmount) > 0) {
              verifiedDiscount = Math.min(verifiedDiscount, Number(promo.maxDiscountAmount));
            }
          } else {
            verifiedDiscount = discountVal;
          }
          verifiedDiscount = Math.min(verifiedDiscount, verifiedSubtotal);
          verifiedDiscount = Math.round(verifiedDiscount * 100) / 100;
        }
      }
    }

    // 5. Authoritative server-side delivery charge
    let insideDhakaCharge = 60;
    let outsideDhakaCharge = 120;
    let codEnabled = true;
    let bkashEnabled = true;

    try {
      const settings = await this.prisma.setting.findMany({
        where: { key: { in: ['delivery_charge_dhaka', 'delivery_charge_inside', 'delivery_charge_outside', 'payment_cod_enabled', 'payment_bkash_enabled'] } },
        select: { key: true, value: true },
      });
      let foundDhaka: number | null = null;
      let foundInside: number | null = null;
      for (let i = 0; i < settings.length; i++) {
        const s = settings[i];
        if (s.key === 'delivery_charge_dhaka' && s.value !== '') foundDhaka = Number(s.value);
        if (s.key === 'delivery_charge_inside' && s.value !== '') foundInside = Number(s.value);
        if (s.key === 'delivery_charge_outside') outsideDhakaCharge = Number(s.value) || 120;
        if (s.key === 'payment_cod_enabled' && s.value === 'false') codEnabled = false;
        if (s.key === 'payment_bkash_enabled' && s.value === 'false') bkashEnabled = false;
      }
      if (foundDhaka !== null && !isNaN(foundDhaka)) {
        insideDhakaCharge = foundDhaka;
      } else if (foundInside !== null && !isNaN(foundInside)) {
        insideDhakaCharge = foundInside;
      }
    } catch {}

    const requestedPaymentMethod = sanitizeString(data.paymentMethod || 'cod', 30).toLowerCase();
    if (requestedPaymentMethod === 'cod') {
      if (!codEnabled) {
        throw new BadRequestException('Cash on Delivery is currently unavailable. Please choose another payment method.');
      }
    } else if (requestedPaymentMethod === 'bkash') {
      if (!bkashEnabled) {
        throw new BadRequestException('bKash online payment is currently unavailable. Please choose another payment method.');
      }
    } else {
      throw new BadRequestException(`Unsupported payment method: ${requestedPaymentMethod}`);
    }

    const isInsideDhaka = district.toLowerCase() === 'inside_dhaka' || district.toLowerCase() === 'dhaka';
    const verifiedDelivery = isInsideDhaka ? insideDhakaCharge : outsideDhakaCharge;

    // 6. Authoritative server-side total
    const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount) + verifiedDelivery;

    const orderNumber = await this.generateOrderNumber();
    const accessToken = generateOrderAccessToken();

    const createdOrder = await this.prisma.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        email,
        address,
        district,
        areaThana,
        deliveryNote,
        subtotal: verifiedSubtotal,
        deliveryCharge: verifiedDelivery,
        promoCode: verifiedPromoCode,
        discountAmount: verifiedDiscount,
        total: verifiedTotal,
        paymentMethod: requestedPaymentMethod,
        paymentStatus: 'unpaid',
        paymentId: data.paymentId ? sanitizeString(data.paymentId, 100) : null,
        trxId: data.trxId ? sanitizeString(data.trxId, 100) : null,
        customerNote,
        accessToken,
        ipAddress: data.ipAddress ? sanitizeString(data.ipAddress, 50) : null,
        status: 'pending',
        items: {
          create: resolvedItems,
        },
      },
      include: {
        items: true,
      },
    });

    // 7. Increment promo code usage safely if valid promo code was used
    if (verifiedPromoCode) {
      try {
        await this.prisma.promoCode.update({
          where: { code: verifiedPromoCode },
          data: { usedCount: { increment: 1 } },
        });
      } catch {}
    }

    return createdOrder;
  }

  async findById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (!order.accessToken) {
      const newToken = generateOrderAccessToken();
      try {
        await this.prisma.order.update({
          where: { id },
          data: { accessToken: newToken },
        });
        order.accessToken = newToken;
      } catch {}
    }

    return order;
  }

  async findByOrderNumber(orderNumberQuery: string) {
    const clean = (orderNumberQuery || '').trim().replace(/^#+/, '');
    const withHash = `#${clean}`;
    const candidates = Array.from(new Set([
      orderNumberQuery,
      orderNumberQuery.trim(),
      clean,
      withHash,
      decodeURIComponent(orderNumberQuery),
    ])).filter(Boolean);

    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber: { in: candidates, mode: 'insensitive' },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderNumberQuery} not found`);
    }

    return order;
  }

  async findByNumberAndToken(orderNumber: string, token: string) {
    const cleanNumber = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber: { equals: cleanNumber, mode: 'insensitive' },
        accessToken: token,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found or invalid token');
    }

    // Security: Do not expose internal fields
    const { accessToken: _token, adminNote: _note, ipAddress: _ip, ...safeOrder } = order as any;
    return {
      ...safeOrder,
      isVerifiedAccess: true,
    };
  }

  async trackOrder(orderQuery: string, phoneQuery?: string, accessToken?: string) {
    const cleanToken = accessToken?.trim();
    if (!cleanToken) {
      throw new UnauthorizedException('Security Access Code (secret token) is strictly required to track this order');
    }

    const orderNumbers = getOrderNumberCandidates(orderQuery);
    if (!orderNumbers.length) {
      throw new BadRequestException('Invalid order number format');
    }

    const cleanPhone = phoneQuery?.trim();

    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber: { in: orderNumbers, mode: 'insensitive' },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Strictly enforce secret access token
    if (!order.accessToken || order.accessToken !== cleanToken) {
      throw new UnauthorizedException('Invalid security access code for this order');
    }

    // Optional phone validation if customer also entered phone
    if (cleanPhone) {
      const phoneNumbers = getPhoneNumberCandidates(cleanPhone);
      const cleanOrderPhone = order.phone.replace(/\D/g, '');
      const isPhoneMatched = phoneNumbers.some((p) => cleanOrderPhone.includes(p) || p.includes(cleanOrderPhone));
      if (!isPhoneMatched) {
        throw new UnauthorizedException('Provided phone number does not match this order');
      }
    }

    // Attach reviewed product IDs for single-review tracking UI
    const existingReviews = await this.prisma.review.findMany({
      where: {
        orderNumber: { in: orderNumbers, mode: 'insensitive' },
      },
      select: { productId: true },
    });
    const reviewedProductIds = existingReviews
      .map((r) => r.productId)
      .filter((id): id is number => typeof id === 'number' && id > 0);

    // SECURITY SANITIZATION:
    // Strip internal secrets from response
    const { accessToken: _token, adminNote: _note, ipAddress: _ip, ...safeOrder } = order as any;

    safeOrder.isVerifiedAccess = true;

    return {
      ...safeOrder,
      reviewedProductIds,
    };
  }

  private maskCustomerName(name: string): string {
    if (!name || typeof name !== 'string') return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      const p = parts[0];
      return p.length <= 2 ? p : `${p[0]}***${p[p.length - 1]}`;
    }
    return parts
      .map((p, idx) => {
        if (idx === 0) return p;
        return p.length <= 2 ? p : `${p[0]}***${p[p.length - 1]}`;
      })
      .join(' ');
  }

  private maskCustomerPhone(phone: string): string {
    if (!phone || typeof phone !== 'string') return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8) return phone;
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
  }

  private maskCustomerAddress(address: string, district?: string, areaThana?: string): string {
    const parts = [areaThana, district].filter(Boolean).join(', ');
    return parts
      ? `${parts} (Street address hidden for privacy. Enter Access Code to reveal)`
      : 'Address protected (Enter Access Code to reveal)';
  }

  async findAll(options: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    district?: string;
    size?: string;
    sortBy?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      status,
      paymentStatus,
      paymentMethod,
      district,
      size,
      sortBy = 'date_desc',
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = options;

    const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100);
    const safePage = Math.max(1, Number(page) || 1);

    const where: Prisma.OrderWhereInput = {};

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { trxId: { contains: q, mode: 'insensitive' } },
        { paymentId: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      if (paymentStatus === 'paid') {
        where.paymentStatus = 'paid';
      } else if (paymentStatus === 'unpaid') {
        where.NOT = { paymentStatus: 'paid' };
      } else {
        where.paymentStatus = paymentStatus;
      }
    }

    if (paymentMethod && paymentMethod !== 'all') {
      where.paymentMethod = paymentMethod;
    }

    if (district && district !== 'all') {
      where.district = district;
    }

    if (size && size !== 'all') {
      where.items = {
        some: { sizeName: { contains: size, mode: 'insensitive' } },
      };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    let orderBy: Prisma.OrderOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'date_asc') orderBy = { createdAt: 'asc' };
    else if (sortBy === 'amount_desc') orderBy = { total: 'desc' };
    else if (sortBy === 'amount_asc') orderBy = { total: 'asc' };

    const skip = (safePage - 1) * safeLimit;

    const [orders, totalCount] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy,
        skip,
        take: safeLimit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      totalCount,
      page: safePage,
      totalPages: Math.ceil(totalCount / safeLimit),
      limit: safeLimit,
    };
  }

  async getDashboardStats() {
    const [
      statusGroups,
      paidRevenueAggregate,
      deliveredRevenueAggregate,
      totalRevenueAggregate,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['status', 'paymentStatus'],
        _count: { _all: true },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'paid' },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'delivered' },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { NOT: { status: 'cancelled' } },
      }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { items: true },
      }),
    ]);

    let totalOrders = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let processingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    for (let i = 0; i < statusGroups.length; i++) {
      const g = statusGroups[i];
      const count = g._count._all;
      totalOrders += count;
      if (g.status === 'pending') pendingCount += count;
      else if (g.status === 'confirmed') confirmedCount += count;
      else if (g.status === 'processing') processingCount += count;
      else if (g.status === 'shipped') shippedCount += count;
      else if (g.status === 'delivered') deliveredCount += count;
      else if (g.status === 'cancelled') cancelledCount += count;

      if (g.paymentStatus === 'paid') paidCount += count;
      else unpaidCount += count;
    }

    return {
      total_orders: totalOrders,
      pending_count: pendingCount,
      confirmed_count: confirmedCount,
      processing_count: processingCount,
      shipped_count: shippedCount,
      delivered_count: deliveredCount,
      cancelled_count: cancelledCount,
      paid_count: paidCount,
      unpaid_count: unpaidCount,
      paid_revenue: paidRevenueAggregate._sum.total || 0,
      delivered_revenue: deliveredRevenueAggregate._sum.total || 0,
      total_revenue: totalRevenueAggregate._sum.total || 0,
      recent_orders: recentOrders,
    };
  }

  async updateStatus(id: number, status: string) {
    await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async updateAdminNote(id: number, adminNote: string) {
    await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: { adminNote },
      include: { items: true },
    });
  }

  async updatePaymentInfo(
    id: number,
    data: {
      paymentId?: string;
      trxId?: string;
      paymentStatus?: string;
      status?: string;
      paymentMethod?: string;
      adminNote?: string;
      paymentDetails?: any;
    },
  ) {
    await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        paymentId: data.paymentId,
        trxId: data.trxId,
        paymentStatus: data.paymentStatus,
        status: data.status,
        paymentMethod: data.paymentMethod,
        adminNote: data.adminNote,
        paymentDetails: data.paymentDetails,
      },
      include: { items: true },
    });
  }

  async switchToCod(id: number, adminNote?: string) {
    const order = await this.findById(id);
    if (order.paymentMethod.toLowerCase() !== 'bkash') {
      throw new BadRequestException('Only bKash orders can be switched to COD');
    }
    return this.prisma.order.update({
      where: { id },
      data: {
        paymentMethod: 'cod',
        paymentId: null,
        paymentStatus: 'unpaid',
        status: 'pending',
        adminNote: adminNote || order.adminNote,
      },
      include: { items: true },
    });
  }
}
