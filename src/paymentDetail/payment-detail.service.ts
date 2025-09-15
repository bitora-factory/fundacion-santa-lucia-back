import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/base.repository";
import { Repository } from "typeorm";
import { PaymentDetail } from "./payment-detail.entity";

@Injectable()
export class PaymentDetailService extends BaseRepository<PaymentDetail> {
    constructor(
        @InjectRepository(PaymentDetail)
        private paymentDetailRepository: Repository<PaymentDetail>
    ) {
        super(paymentDetailRepository);
    }

    async findDetailsByPaymentId(paymentId: number): Promise<PaymentDetail[]> {
        return await this.paymentDetailRepository.find({
            where: { paymentId },
            order: { id: 'ASC' }
        });
    }

    async findDetailsWithPayment(): Promise<PaymentDetail[]> {
        return await this.paymentDetailRepository.find({
            relations: ['payment'],
            order: { id: 'DESC' }
        });
    }

    async findDetailsByPaymentIdWithPayment(paymentId: number): Promise<PaymentDetail[]> {
        return await this.paymentDetailRepository.find({
            where: { paymentId },
            relations: ['payment'],
            order: { id: 'ASC' }
        });
    }

}