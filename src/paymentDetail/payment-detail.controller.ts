import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentDetailService } from './payment-detail.service';
import { PaymentDetail } from './payment-detail.entity';

@Controller('payment-detail')
export class PaymentDetailController {
  constructor(private readonly paymentDetailService: PaymentDetailService) {}

  @Get()
  async findAll(): Promise<PaymentDetail[]> {
    return this.paymentDetailService.findAll();
  }

  @Get('with-payment')
  async findAllWithPayment(): Promise<PaymentDetail[]> {
    return this.paymentDetailService.findDetailsWithPayment();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PaymentDetail | null> {
    return this.paymentDetailService.findOne(id);
  }

  @Get('payment/:paymentId')
  async findByPaymentId(@Param('paymentId', ParseIntPipe) paymentId: number): Promise<PaymentDetail[]> {
    return this.paymentDetailService.findDetailsByPaymentId(paymentId);
  }

  @Get('payment/:paymentId/with-payment')
  async findByPaymentIdWithPayment(@Param('paymentId', ParseIntPipe) paymentId: number): Promise<PaymentDetail[]> {
    return this.paymentDetailService.findDetailsByPaymentIdWithPayment(paymentId);
  }
}
