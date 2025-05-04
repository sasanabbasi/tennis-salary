import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        bufferLogs: true,
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      },
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>('server.port', 8000);
    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
  }
}

bootstrap().catch((err) => console.error('Bootstrap error:', err));
