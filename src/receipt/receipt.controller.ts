import { Body, Controller, Post, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Controller('receipt')
export class ReceiptController {
  private readonly logger = new Logger(ReceiptController.name);

  constructor(private readonly receiptService: ReceiptService) {
  }

  @Post()
  async saveReceipt(@Body() body: any): Promise<any> {
    try {
      this.logger.log('Received body data:', JSON.stringify(body, null, 2));
      
      // Extraer los datos del receipt si vienen anidados
      const receipt = body.receipt || body;
      
      this.logger.log('Processing receipt:', JSON.stringify(receipt, null, 2));
      
      // Validaciones básicas
      if (!receipt) {
        throw new Error('Receipt data is required');
      }
      
      if (!receipt.payment) {
        throw new Error('Payment data is required');
      }
      
      if (!receipt.payment.receiptNumber) {
        throw new Error('Receipt number is required');
      }
      
      if (!receipt.payment.resident) {
        throw new Error('Resident data is required');
      }
      
      if (!receipt.payment.resident.id) {
        throw new Error('Resident ID is required');
      }
      
      this.logger.log('Validation passed, saving receipt...');
      
      const result = await this.receiptService.saveReceipt(receipt);
      this.logger.log('Receipt saved successfully');
      return {
        success: true,
        data: result,
        message: 'Receipt saved successfully'
      };
    } catch (error) {
      this.logger.error('Error saving receipt:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Error saving receipt',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
