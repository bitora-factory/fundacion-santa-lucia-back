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

  // Override del método findAll para incluir la relación con resident
  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['resident'],
      order: { id: 'DESC' }
    });
  }

  // Override del método findOne para incluir la relación con resident
  async findOne(id: number): Promise<Payment | null> {
    return this.paymentRepository.findOne({
      where: { id },
      relations: ['resident']
    });
  }

  // Override del método create para retornar el payment con resident después de crearlo
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment = this.paymentRepository.create(createPaymentDto);
    const savedPayment = await this.paymentRepository.save(newPayment);
    
    // Retornar el payment guardado con la relación resident incluida
    const paymentWithResident = await this.findOne(savedPayment.id);
    if (!paymentWithResident) {
      throw new Error('Payment not found after creation');
    }
    return paymentWithResident;
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
