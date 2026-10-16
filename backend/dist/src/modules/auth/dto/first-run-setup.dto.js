"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstRunSetupDto = void 0;
const class_validator_1 = require("class-validator");
class FirstRunSetupDto {
}
exports.FirstRunSetupDto = FirstRunSetupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Administrator full name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Administrator full name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Administrator full name cannot exceed 100 characters' }),
    (0, class_validator_1.Matches)(/^[\p{L}\p{M}\s.'-]+$/u, {
        message: 'Administrator name contains invalid characters. Only letters, spaces, hyphens, and periods are allowed.',
    }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'A valid administrator email address is required' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Email address cannot exceed 150 characters' }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    (0, class_validator_1.MaxLength)(128, { message: 'Password cannot exceed 128 characters' }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Administrator phone number is required' }),
    (0, class_validator_1.MaxLength)(30, { message: 'Phone number cannot exceed 30 characters' }),
    (0, class_validator_1.Matches)(/^[0-9+()-\s]{7,25}$/, {
        message: 'Please enter a valid phone number',
    }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Store or brand name is required' }),
    (0, class_validator_1.MinLength)(2, { message: 'Store name must be at least 2 characters' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Store name cannot exceed 100 characters' }),
    (0, class_validator_1.Matches)(/^[^<>]+$/, { message: 'Store name cannot contain angle brackets or HTML tags' }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "store_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Website title is required' }),
    (0, class_validator_1.MinLength)(3, { message: 'Website title must be at least 3 characters' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Website title cannot exceed 150 characters' }),
    (0, class_validator_1.Matches)(/^[^<>]+$/, { message: 'Website title cannot contain angle brackets or HTML tags' }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "site_title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Support contact phone number is required' }),
    (0, class_validator_1.MaxLength)(30, { message: 'Support phone number cannot exceed 30 characters' }),
    (0, class_validator_1.Matches)(/^[0-9+()-\s]{7,25}$/, {
        message: 'Please enter a valid support phone number',
    }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "contact_phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'A valid support contact email address is required' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Support email cannot exceed 150 characters' }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "contact_email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Inside Dhaka delivery charge is required' }),
    (0, class_validator_1.MaxLength)(10, { message: 'Delivery charge cannot exceed 10 characters' }),
    (0, class_validator_1.Matches)(/^\d+(\.\d{1,2})?$/, {
        message: 'Inside Dhaka delivery charge must be a valid non-negative number',
    }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "delivery_charge_dhaka", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Outside Dhaka delivery charge is required' }),
    (0, class_validator_1.MaxLength)(10, { message: 'Delivery charge cannot exceed 10 characters' }),
    (0, class_validator_1.Matches)(/^\d+(\.\d{1,2})?$/, {
        message: 'Outside Dhaka delivery charge must be a valid non-negative number',
    }),
    __metadata("design:type", String)
], FirstRunSetupDto.prototype, "delivery_charge_outside", void 0);
