import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BaseRepository } from 'src/common/base.repository';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService extends BaseRepository<Payment> {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>
  ) {
    super(paymentRepository);
  }

  async getConsecutiveNumber(): Promise<number> {
    try {
      // Método más eficiente usando MAX
      const result = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('MAX(payment.receiptNumber)', 'maxReceiptNumber')
        .getRawOne();
      
      const nextNumber = result?.maxReceiptNumber ? parseInt(result.maxReceiptNumber) + 1 : 1;
      this.logger.log(`Generated consecutive number: ${nextNumber}`);
      
      return nextNumber;
    } catch (error) {
      this.logger.error('Error getting consecutive number:', error);
      throw error;
    }
  }
}
