import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base.repository";
import { Payment } from "src/payment/entities/payment.entity";
import { PaymentDetail } from "src/paymentDetail/payment-detail.entity";
import { Repository } from "typeorm";
import { CreateReceiptDto } from "./dto/create-receipt.dto";

@Injectable()
export class ReceiptService {
    private readonly logger = new Logger(ReceiptService.name);

    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,

        @InjectRepository(PaymentDetail)
        private paymentDetailRepository: Repository<PaymentDetail>
    ) { }

    async saveReceipt(receipt: CreateReceiptDto): Promise<any> {
        try {
            this.logger.log('Starting to save receipt');
            this.logger.log('Receipt object keys:', Object.keys(receipt));
            this.logger.log('Payment object:', receipt.payment ? Object.keys(receipt.payment) : 'payment is undefined');

            // Validaciones adicionales
            if (!receipt.payment) {
                throw new Error('Payment object is missing from receipt');
            }

            this.logger.log('Payment data received:', {
                receiptNumber: receipt.payment.receiptNumber,
                date: receipt.payment.date,
                totalAmount: receipt.payment.totalAmount,
                residentId: receipt.payment.resident?.id
            });

            // 1. Preparar y guardar el payment
            const paymentData = {
                receiptNumber: receipt.payment.receiptNumber,
                date: receipt.payment.date,
                totalAmount: receipt.payment.totalAmount,
                residentId: receipt.payment.resident.id
            };

            this.logger.log('Payment data to save:', paymentData);

            const savedPayment = await this.paymentRepository.save(paymentData);
            this.logger.log('Payment saved with ID:', savedPayment.id);

            // 2. Guardar los payment details solo si tienen información válida
            const savedDetails: PaymentDetail[] = [];
            
            for (const detail of receipt.paymentDetails) {
                // Solo guardar detalles que tengan información válida
                if (detail.code && detail.detail && detail.total !== null) {
                    const detailData = {
                        paymentId: savedPayment.id,
                        code: detail.code,
                        detail: detail.detail,
                        units: detail.units || 1,
                        unitPrice: detail.unitPrice || 0,
                        total: detail.total
                    };

                    const savedDetail = await this.paymentDetailRepository.save(detailData);
                    savedDetails.push(savedDetail);
                    this.logger.log('Payment detail saved:', savedDetail.id);
                }
            }

            // 3. Retornar el payment completo con resident y details
            const completePayment = await this.paymentRepository.findOne({
                where: { id: savedPayment.id },
                relations: ['resident']
            });

            const result = {
                payment: completePayment,
                paymentDetails: savedDetails
            };

            this.logger.log('Receipt saved successfully', result);
            return result;

        } catch (error) {
            this.logger.error('Error saving receipt:', error);
            throw error;
        }
    }
}