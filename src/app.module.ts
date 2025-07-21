import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResidentModule } from './resident/resident.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        synchronize: false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    UserModule,
    ResidentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
