
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = 3000;

  await app.listen(port);

  console.log('');
  console.log('====================================');
  console.log('🚀 FitFlow Backend is running!');
  console.log(`🌐 Local URL: http://localhost:${port}`);
  console.log('====================================');
  console.log('');
}

bootstrap();