import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentDetail } from './payment-detail.entity';
import { PaymentDetailService } from './payment-detail.service';
import { PaymentDetailController } from './payment-detail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDetail])],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService],
  exports: [PaymentDetailService, TypeOrmModule],
})
export class PaymentDetailModule { }
