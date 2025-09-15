import { Payment } from "src/payment/entities/payment.entity";
import { PaymentDetail } from "src/paymentDetail/payment-detail.entity";
import { Resident } from "src/resident/resident.entity";

export interface CreateReceiptDto {
    payment: {
        id?: number | null;
        receiptNumber: number;
        date: Date;
        totalAmount: number;
        resident: Resident;
    };
    paymentDetails: Array<{
        id?: number;
        paymentId?: number | null;
        code: string;
        detail: string;
        units?: number | null;
        unitPrice?: number | null;
        total?: number | null;
    }>;
}