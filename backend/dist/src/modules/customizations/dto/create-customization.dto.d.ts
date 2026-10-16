export declare class CreateCustomizationDto {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    preferredSize?: string;
    preferredColor?: string;
    description: string;
    referenceImage?: string;
    estimatedBudget?: string;
}
export declare class UpdateCustomizationStatusDto {
    status?: string;
    adminNotes?: string;
}
