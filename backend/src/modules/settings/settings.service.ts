import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  // OPTIMIZATION: In-memory dictionary cache with TTL and auto-invalidation.
  // Reduces DB roundtrips from O(N) to O(1) for all frontend and checkout requests.
  private cache: Record<string, string> = {};
  private cacheLoaded = false;
  private lastCacheTime = 0;

  constructor(private readonly prisma: PrismaService) {}

  private async refreshCache(): Promise<Record<string, string>> {
    const settings = await this.prisma.setting.findMany({
      select: { key: true, value: true },
    });
    const map: Record<string, string> = {};
    for (let i = 0; i < settings.length; i++) {
      const s = settings[i];
      map[s.key] = s.value;
    }
    this.cache = map;
    this.cacheLoaded = true;
    this.lastCacheTime = Date.now();
    return this.cache;
  }

  async getAll(): Promise<Record<string, string>> {
    const now = Date.now();
    // Cache for 60 seconds or until explicitly invalidated
    if (!this.cacheLoaded || now - this.lastCacheTime > 60000) {
      return this.refreshCache();
    }
    return this.cache;
  }

  async getPublic(): Promise<Record<string, string>> {
    const all = await this.getAll();
    const publicSettings: Record<string, string> = {};
    const sensitivePatterns = [
      /secret/i,
      /password/i,
      /pass$/i,
      /^bkash_app_key$/,
      /^bkash_username$/,
      /^sms_api_key$/,
      /^sms_client_id$/,
      /api_key/i,
      /auth_token/i,
      /private_key/i,
    ];

    for (const [k, v] of Object.entries(all)) {
      const isSensitive = sensitivePatterns.some((pattern) => pattern.test(k));
      if (!isSensitive) {
        publicSettings[k] = v;
      }
    }
    return publicSettings;
  }

  async getAllDetailed() {
    return this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  async get(key: string, defaultValue = ''): Promise<string> {
    const all = await this.getAll();
    return all[key] ?? defaultValue;
  }

  async set(key: string, value: string, description?: string) {
    const res = await this.prisma.setting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
    await this.refreshCache();
    return res;
  }

  async updateBulk(entries: Record<string, string>) {
    if (!entries || typeof entries !== 'object') {
      return this.getAll();
    }
    const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype']);
    const ops = [];

    for (const [rawKey, rawValue] of Object.entries(entries)) {
      const key = String(rawKey).trim();
      if (!key || dangerousKeys.has(key) || !/^[a-zA-Z0-9_-]+$/.test(key)) {
        continue;
      }
      const value = rawValue !== null && rawValue !== undefined ? String(rawValue) : '';
      ops.push(
        this.prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      );

      // Keep delivery_charge_dhaka and delivery_charge_inside synchronized
      if (key === 'delivery_charge_dhaka') {
        ops.push(
          this.prisma.setting.upsert({
            where: { key: 'delivery_charge_inside' },
            update: { value },
            create: { key: 'delivery_charge_inside', value },
          }),
        );
      } else if (key === 'delivery_charge_inside') {
        ops.push(
          this.prisma.setting.upsert({
            where: { key: 'delivery_charge_dhaka' },
            update: { value },
            create: { key: 'delivery_charge_dhaka', value },
          }),
        );
      }
    }

    if (ops.length > 0) {
      await this.prisma.$transaction(ops);
      await this.refreshCache();
    }
    return this.getAll();
  }
}
