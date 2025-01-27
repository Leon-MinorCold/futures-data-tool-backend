import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Database URL:', process.env.DATABASE_URL);
  await app.listen(3000);
}
bootstrap();
