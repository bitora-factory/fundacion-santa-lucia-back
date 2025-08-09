import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, { 
      cors: true,
      logger: ['error', 'warn', 'log', 'debug', 'verbose']
    });
    
    // Configurar prefijo global para todas las rutas
    app.setGlobalPrefix('billing/api');
    
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}/billing/api`);
  } catch (error) {
    logger.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
