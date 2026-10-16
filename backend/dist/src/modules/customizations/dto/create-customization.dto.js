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
exports.UpdateCustomizationStatusDto = exports.CreateCustomizationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCustomizationDto {
}
exports.CreateCustomizationDto = CreateCustomizationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Customer name is required' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Customer name cannot exceed 150 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "customerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Customer phone number is required' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Phone number cannot exceed 50 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "customerPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(150, { message: 'Email address cannot exceed 150 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "customerEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Address cannot exceed 500 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "customerAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Preferred size cannot exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "preferredSize", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Preferred color cannot exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "preferredColor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description of custom requirements is required' }),
    (0, class_validator_1.MaxLength)(5000, { message: 'Description cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Reference image URL cannot exceed 500 characters' }),
    (0, class_validator_1.Matches)(/^(\/uploads\/|https?:\/\/)/i, {
        message: 'Reference image must be an internal upload (/uploads/...) or safe HTTPS URL',
    }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "referenceImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Estimated budget cannot exceed 100 characters' }),
    __metadata("design:type", String)
], CreateCustomizationDto.prototype, "estimatedBudget", void 0);
class UpdateCustomizationStatusDto {
}
exports.UpdateCustomizationStatusDto = UpdateCustomizationStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['pending', 'contacted', 'in_progress', 'completed', 'cancelled'], {
        message: 'Status must be one of: pending, contacted, in_progress, completed, cancelled',
    }),
    __metadata("design:type", String)
], UpdateCustomizationStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Admin notes cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], UpdateCustomizationStatusDto.prototype, "adminNotes", void 0);
