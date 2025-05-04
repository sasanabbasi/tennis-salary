import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

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

    await app.listen(process.env.PORT ?? 8000);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
  }
}

bootstrap().catch((err) => console.error('Bootstrap error:', err));
