"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super(process.env.DATABASE_URL
            ? {
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL,
                    },
                },
            }
            : undefined);
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        await this.$connect();
        await this.ensureDatabaseReady();
        await this.autoSeedDefaults();
    }
    async ensureDatabaseReady() {
        let tablesMissing = false;
        try {
            const res = await this.$queryRawUnsafe(`SELECT to_regclass('public.settings') as settings_tbl, to_regclass('public.translations') as trans_tbl;`);
            if (!res || !res[0] || !res[0].settings_tbl || !res[0].trans_tbl) {
                tablesMissing = true;
            }
        }
        catch {
            tablesMissing = true;
        }
        if (!tablesMissing) {
            return;
        }
        this.logger.log('⚙️ Database tables not detected. Executing database setup & schema sync (prisma db push)...');
        try {
            const candidateSchemas = [
                path.join(process.cwd(), 'backend', 'prisma', 'schema.prisma'),
                path.join(process.cwd(), 'prisma', 'schema.prisma'),
                path.resolve(__dirname, '..', '..', '..', 'prisma', 'schema.prisma'),
                path.resolve(__dirname, '..', '..', '..', 'backend', 'prisma', 'schema.prisma'),
                path.resolve(__dirname, '..', '..', 'prisma', 'schema.prisma'),
            ];
            const schemaPath = candidateSchemas.find((p) => fs.existsSync(p));
            if (!schemaPath) {
                this.logger.warn('Could not locate schema.prisma for auto-migration.');
                return;
            }
            const isWin = process.platform === 'win32';
            const candidateBins = [
                path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma'),
                path.join(process.cwd(), 'backend', 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma'),
                path.resolve(__dirname, '..', '..', '..', 'node_modules', '.bin', isWin ? 'prisma.cmd' : 'prisma'),
            ];
            const prismaBin = candidateBins.find((p) => fs.existsSync(p));
            const prismaCmd = prismaBin ? `"${prismaBin}"` : 'npx prisma';
            (0, child_process_1.execSync)(`${prismaCmd} db push --schema="${schemaPath}" --skip-generate`, {
                stdio: 'inherit',
                env: { ...process.env },
            });
            this.logger.log('✔ Database tables created and synchronized successfully.');
        }
        catch (pushErr) {
            this.logger.warn(`Automatic database push notice: ${pushErr.message}`);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async autoSeedDefaults() {
        try {
            const defaultSettings = [
                { key: 'site_title', value: 'StoreForge E-Commerce', description: 'Website Title' },
                { key: 'store_name', value: 'StoreForge', description: 'Store Brand Name' },
                { key: 'delivery_charge_dhaka', value: '60', description: 'Delivery Inside Dhaka (BDT)' },
                { key: 'delivery_charge_outside', value: '120', description: 'Delivery Charge Outside Dhaka (BDT)' },
                { key: 'contact_phone', value: '+880 1700-000000', description: 'Support Phone' },
                { key: 'contact_email', value: 'support@storeforge.io', description: 'Support Email' },
                { key: 'first_run_completed', value: 'false', description: 'First-run setup completed flag' },
            ];
            for (const s of defaultSettings) {
                await this.setting.upsert({
                    where: { key: s.key },
                    update: {},
                    create: s,
                });
            }
            const catCount = await this.category.count();
            if (catCount === 0) {
                const category = await this.category.create({
                    data: {
                        name: 'Featured Collection',
                        slug: 'featured-collection',
                        description: 'Handcrafted luxury decor and items',
                        status: 'active',
                        sortOrder: 1,
                    },
                });
                const prodCount = await this.product.count();
                if (prodCount === 0) {
                    await this.product.create({
                        data: {
                            categoryId: category.id,
                            name: '3D Wooden World Map',
                            slug: '3d-wooden-world-map',
                            tagline: 'Transform Your Wall Into a Piece of Art',
                            shortDescription: 'Handcrafted luxury 3D multi-layered birch wood map with detailed engravings.',
                            fullDescription: '<p>Experience craftsmanship with laser-cut precision natural birch wood. Edit or customize anytime from your Admin Panel.</p>',
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
                        },
                    });
                }
            }
            const faqCount = await this.faq.count();
            if (faqCount === 0) {
                const defaultFaqs = [
                    {
                        question: 'What material is the product made of?',
                        questionBn: 'পণ্যটি কোন উপাদান দিয়ে তৈরি?',
                        answer: 'The map is crafted from 100% premium, eco-friendly certified birch plywood. Each continent and island is precision laser-cut and stained with rich, non-toxic wood tones that highlight natural wood grains.',
                        answerBn: 'ম্যাপটি শতভাগ প্রিমিয়াম ও পরিবেশবান্ধব সার্টিফাইড বার্চ প্লাইউড দিয়ে তৈরি। নিখুঁত লেজার কাটিং এবং দীর্ঘস্থায়ী প্রাকৃতিক রঙের ফিনিশিং কাঠের প্রাকৃতিক সৌন্দর্যকে ফুটিয়ে তোলে।',
                        sortOrder: 1,
                        isPublished: true,
                    },
                    {
                        question: 'What is the difference between 4 Feet and 6 Feet sizes?',
                        questionBn: '৪ ফুট এবং ৬ ফুট সাইজের মধ্যে পার্থক্য কী?',
                        answer: 'The 4 Feet version measures 4 x 2.5 ft (120 x 75 cm) and is ideal for standard bedrooms, apartments, and study rooms. The 6 Feet version measures 6 x 3.8 ft (180 x 115 cm) and is best suited for large living room focal walls or corporate conference rooms.',
                        answerBn: '৪ ফুট ভার্সনটি (১২০ x ৭৫ সেমি) সাধারণ বেডরুম ও অ্যাপার্টমেন্টের জন্য মানানসই। ৬ ফুট ভার্সনটি (১৮০ x ১১৫ সেমি) লিভিং রুম বা অফিসের প্রধান ওয়ালের জন্য অত্যন্ত দৃষ্টিনন্দন।',
                        sortOrder: 2,
                        isPublished: true,
                    },
                    {
                        question: 'How long does delivery take?',
                        questionBn: 'ডেলিভারি পেতে কত দিন সময় লাগে?',
                        answer: 'Inside Dhaka: 24 to 48 hours. Outside Dhaka: 2 to 4 business days via trusted door-to-door courier service.',
                        answerBn: 'ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে সারাদেশে ২ থেকে ৪ কার্যদিবসের মধ্যে হোম ডেলিভারি সম্পন্ন হয়।',
                        sortOrder: 3,
                        isPublished: true,
                    },
                ];
                for (const item of defaultFaqs) {
                    const created = await this.faq.create({
                        data: {
                            question: item.question,
                            answer: item.answer,
                            sortOrder: item.sortOrder,
                            isPublished: item.isPublished,
                        },
                    });
                    await this.translation.upsert({
                        where: { key: `faq.${created.id}.question` },
                        update: {},
                        create: {
                            key: `faq.${created.id}.question`,
                            bn: item.questionBn,
                            en: item.question,
                            category: 'faqs',
                            description: `FAQ #${created.id} Question`,
                        },
                    });
                    await this.translation.upsert({
                        where: { key: `faq.${created.id}.answer` },
                        update: {},
                        create: {
                            key: `faq.${created.id}.answer`,
                            bn: item.answerBn,
                            en: item.answer,
                            category: 'faqs',
                            description: `FAQ #${created.id} Answer`,
                        },
                    });
                }
            }
            const revCount = await this.review.count();
            if (revCount === 0) {
                const firstProd = await this.product.findFirst({ select: { id: true } });
                const defaultReviews = [
                    {
                        customerName: 'Rafiqul Islam',
                        location: 'Gulshan, Dhaka',
                        rating: 5,
                        reviewText: 'Outstanding craftsmanship! The 6-feet map completely transformed our living room wall. Everyone who visits asks where we got it from. Delivery was swift within 24 hours in Dhaka.',
                        isPublished: true,
                        isFeatured: true,
                        sortOrder: 1,
                    },
                    {
                        customerName: 'Tanvir Ahmed',
                        location: 'Uttara, Dhaka',
                        rating: 5,
                        reviewText: 'Top quality wood and the 3D layers give it so much depth under warm spotlighting. Installation with the provided stencil was very easy and satisfying.',
                        isPublished: true,
                        isFeatured: true,
                        sortOrder: 2,
                    },
                    {
                        customerName: 'Nusrat Jahan',
                        location: 'Chittagong',
                        rating: 5,
                        reviewText: 'Ordered the 4-foot version for my husbands home office. Packaging was very secure and arrived in Chittagong in 3 days. Beautiful finish and great customer care!',
                        isPublished: true,
                        isFeatured: true,
                        sortOrder: 3,
                    },
                ];
                for (const rev of defaultReviews) {
                    await this.review.create({
                        data: {
                            productId: firstProd?.id || null,
                            customerName: rev.customerName,
                            location: rev.location,
                            rating: rev.rating,
                            reviewText: rev.reviewText,
                            isPublished: rev.isPublished,
                            isFeatured: rev.isFeatured,
                            sortOrder: rev.sortOrder,
                        },
                    });
                }
            }
        }
        catch (err) {
            this.logger.debug(`Database auto-seed notice: ${err.message}`);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map