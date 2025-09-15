import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentDetail } from 'src/paymentDetail/payment-detail.entity';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentDetail])],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule { }
