const path = require('path');
const { execSync } = require('child_process');

function resolveBcrypt(rootDir, backendDir) {
  try {
    return require('bcryptjs');
  } catch {
    try {
      return require(path.join(backendDir, 'node_modules', 'bcryptjs'));
    } catch {
      try {
        return require(path.join(rootDir, 'node_modules', 'bcryptjs'));
      } catch {
        return null;
      }
    }
  }
}

/**
 * Database Migrator and Seed Provisioner
 */
class Migrator {
  constructor(rootDir = null) {
    this.rootDir = rootDir || path.resolve(__dirname, '..');
    this.backendDir = path.join(this.rootDir, 'backend');
  }

  /**
   * 1. Generate Prisma Client
   */
  generatePrismaClient() {
    try {
      execSync('npx prisma generate', {
        cwd: this.backendDir,
        stdio: 'pipe',
        encoding: 'utf8',
      });
      return { success: true, message: 'Prisma client generated successfully.' };
    } catch (err) {
      throw new Error(`Failed to generate Prisma Client: ${err.stderr || err.message}`);
    }
  }

  /**
   * 2. Synchronize Database Schema (db push)
   */
  pushDatabaseSchema() {
    try {
      execSync('npx prisma db push --accept-data-loss', {
        cwd: this.backendDir,
        stdio: 'pipe',
        encoding: 'utf8',
      });
      return { success: true, message: 'Database schema synchronized with PostgreSQL.' };
    } catch (err) {
      throw new Error(`Failed to synchronize database schema: ${err.stderr || err.message}`);
    }
  }

  /**
   * 3. Seed Administrator and Store Configurations
   */
  async seedInitialData(config) {
    // Robust multi-path resolution for PrismaClient in npm workspace environments
    let PrismaClientClass;
    try {
      PrismaClientClass = require('@prisma/client').PrismaClient;
    } catch {
      try {
        PrismaClientClass = require(path.join(this.rootDir, 'node_modules', '@prisma/client')).PrismaClient;
      } catch {
        PrismaClientClass = require(path.join(this.backendDir, 'node_modules', '@prisma/client')).PrismaClient;
      }
    }

    if (!PrismaClientClass) {
      throw new Error('Could not resolve PrismaClient from node_modules. Please ensure dependencies are installed.');
    }

    const prisma = new PrismaClientClass();

    try {
      await prisma.$connect();

      // 1. Seed or Update Primary Super Administrator
      const adminName = config.adminName || 'Administrator';
      const adminEmail = (config.adminEmail || 'admin@woodenmap.com').trim().toLowerCase();
      const bcryptModule = resolveBcrypt(this.rootDir, this.backendDir);
      let hashedPassword;
      if (bcryptModule) {
        hashedPassword = await bcryptModule.hash(rawPassword, 10);
      } else {
        // Fallback SHA-256 hash or simple placeholder if bcrypt unavailable
        const crypto = require('crypto');
        hashedPassword = crypto.createHash('sha256').update(rawPassword).digest('hex');
      }

      const existingAdmin = await prisma.user.findFirst({
        where: {
          OR: [{ email: adminEmail }, { role: 'admin' }],
        },
      });

      if (existingAdmin) {
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            permissions: JSON.stringify(['*']),
            isActive: true,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            permissions: JSON.stringify(['*']),
            isActive: true,
          },
        });
      }

      // 2. Seed Store Settings
      const storeSettings = {
        store_name: config.storeName || '3D Wooden World Map',
        tagline: config.storeTagline || 'Handcrafted Luxury Wall Art & Décor',
        contact_email: config.contactEmail || adminEmail,
        contact_phone: config.contactPhone || '01700000000',
        contact_address: config.contactAddress || 'Dhaka, Bangladesh',
        currency_symbol: config.currencySymbol || '৳',
        currency_code: config.currencyCode || 'BDT',
        delivery_charge_dhaka: String(config.deliveryInside || '60'),
        delivery_charge_outside: String(config.deliveryOutside || '120'),
        delivery_charge_inside: String(config.deliveryInside || '60'),
        admin_route_prefix: config.adminRoutePrefix || 'admin',
        moderator_route_prefix: config.moderatorRoutePrefix || 'moderator',
        enable_cod: config.enableCod !== false ? 'true' : 'false',
        enable_bkash: config.enableBkash ? 'true' : 'false',
        theme_primary_color: '#c08a46',
      };

      for (const [key, value] of Object.entries(storeSettings)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }

      // 3. Seed Default Category if missing
      const defaultCategory = await prisma.category.upsert({
        where: { slug: 'world-maps' },
        update: {},
        create: {
          name: 'World Maps',
          slug: 'world-maps',
          description: 'Handcrafted 3D multi-layered wooden world maps',
          status: 'active',
          sortOrder: 1,
        },
      });

      // 4. Seed Default Product if missing
      const existingProduct = await prisma.product.findUnique({
        where: { slug: '3d-wooden-world-map' },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            categoryId: defaultCategory.id,
            name: '3D Wooden World Map',
            slug: '3d-wooden-world-map',
            tagline: 'Transform Your Wall Into a Piece of Art',
            shortDescription:
              'Premium handcrafted 3D wooden world map made with multi-layered natural birch plywood to give your wall a sophisticated and luxurious interior accent.',
            fullDescription:
              '<p>Experience the world right from your living room or office wall. Our 3D Wooden World Map is laser-cut with pinpoint precision from certified natural birch wood. Features layered relief topography, engraved country names, capitals, borders, and major islands.</p>',
            hasSizeVariants: true,
            status: 'active',
            variants: {
              create: [
                {
                  sizeName: '4 Feet',
                  dimensions: '4 x 2.5 ft (120 x 75 cm)',
                  colour: 'Natural Oak & Walnut',
                  price: 4500,
                  originalPrice: 5500,
                  stockStatus: 'in_stock',
                  isDefault: true,
                  sortOrder: 1,
                },
                {
                  sizeName: '6 Feet',
                  dimensions: '6 x 3.8 ft (180 x 115 cm)',
                  colour: 'Natural Oak & Walnut',
                  price: 7500,
                  originalPrice: 9200,
                  stockStatus: 'in_stock',
                  isDefault: false,
                  sortOrder: 2,
                },
              ],
            },
            images: {
              create: [
                {
                  imageUrl: '/images/product-main.jpg',
                  altText: '3D Wooden World Map wall mounted living room',
                  title: 'Living Room Display',
                  isPrimary: true,
                  sortOrder: 1,
                },
              ],
            },
          },
        });
      }

      // 5. Seed Core FAQs if empty
      const faqCount = await prisma.faq.count();
      if (faqCount === 0) {
        await prisma.faq.createMany({
          data: [
            {
              question: 'How do I mount the 3D wooden world map on the wall?',
              answer: 'Each map comes with heavy-duty double-sided specialty adhesive tape and a full-size precision template guide. No drilling is required.',
              sortOrder: 1,
              status: 'active',
            },
            {
              question: 'What materials are used for the maps?',
              answer: 'We craft each map using premium sustainable European birch plywood with eco-friendly non-toxic stains in natural oak and walnut finishes.',
              sortOrder: 2,
              status: 'active',
            },
            {
              question: 'What are the delivery times and shipping costs?',
              answer: 'Delivery within Dhaka takes 24-48 hours (৳60). Delivery across all other districts in Bangladesh takes 2-4 business days (৳120).',
              sortOrder: 3,
              status: 'active',
            },
          ],
        });
      }

      return {
        success: true,
        message: 'Initial administrator, settings, catalog, and FAQ data provisioned successfully.',
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = { Migrator };
