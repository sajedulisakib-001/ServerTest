"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
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
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map