"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipRateLimit = exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.RATE_LIMIT_KEY = 'rate_limit_options';
const RateLimit = (options) => (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, options);
exports.RateLimit = RateLimit;
const SkipRateLimit = () => (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, { skip: true });
exports.SkipRateLimit = SkipRateLimit;
