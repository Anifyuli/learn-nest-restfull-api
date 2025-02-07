import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ErrorFilter } from 'src/common/error/error.filter';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import * as winston from 'winston';
import { AuthMiddleware } from './auth/auth.middleware';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()],
            level: 'debug',
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [
        PrismaService,
        ValidationService,
        { provide: APP_FILTER, useClass: ErrorFilter },
    ],
    exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('/api/*');
    }
}
