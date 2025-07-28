import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BaseRepository } from 'src/common/base.repository';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService extends BaseRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>
  ) {
    super(paymentRepository);
  }
}
