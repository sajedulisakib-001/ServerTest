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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const rate_limit_guard_1 = require("./common/guards/rate-limit.guard");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const categories_module_1 = require("./modules/categories/categories.module");
const products_module_1 = require("./modules/products/products.module");
const orders_module_1 = require("./modules/orders/orders.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const faqs_module_1 = require("./modules/faqs/faqs.module");
const settings_module_1 = require("./modules/settings/settings.module");
const translations_module_1 = require("./modules/translations/translations.module");
const ai_module_1 = require("./modules/ai/ai.module");
const payments_module_1 = require("./modules/payments/payments.module");
const barcode_module_1 = require("./modules/barcode/barcode.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const promo_codes_module_1 = require("./modules/promo-codes/promo-codes.module");
const moderators_module_1 = require("./modules/moderators/moderators.module");
const database_module_1 = require("./modules/database/database.module");
const customizations_module_1 = require("./modules/customizations/customizations.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function getRootEnvFiles() {
    let current = process.cwd();
    for (let i = 0; i < 5; i++) {
        if (fs.existsSync(path.join(current, 'scripts', 'start-server.js')) ||
            (fs.existsSync(path.join(current, 'package.json')) &&
                fs.existsSync(path.join(current, 'backend')) &&
                fs.existsSync(path.join(current, 'frontend')))) {
            return [path.join(current, '.env.local'), path.join(current, '.env')];
        }
        const parent = path.dirname(current);
        if (parent === current)
            break;
        current = parent;
    }
    return [path.resolve('.env.local'), path.resolve('.env'), path.resolve('../.env')];
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: getRootEnvFiles(),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            reviews_module_1.ReviewsModule,
            faqs_module_1.FaqsModule,
            settings_module_1.SettingsModule,
            translations_module_1.TranslationsModule,
            ai_module_1.AiModule,
            payments_module_1.PaymentsModule,
            barcode_module_1.BarcodeModule,
            uploads_module_1.UploadsModule,
            promo_codes_module_1.PromoCodesModule,
            moderators_module_1.ModeratorsModule,
            database_module_1.DatabaseModule,
            customizations_module_1.CustomizationsModule,
            tenants_module_1.TenantsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: rate_limit_guard_1.RateLimitGuard,
            },
        ],
    })
], AppModule);
