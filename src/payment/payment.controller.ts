import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { BaseController } from 'src/common/base.controller';

@Controller('payment')
export class PaymentController extends BaseController<Payment> {
  constructor(private readonly paymentService: PaymentService) {
    super(paymentService);
  }

  @Get('consecutive-number')
  async getConsecutiveNumber(): Promise<number> {
    return this.paymentService.getConsecutiveNumber();
  }
}
