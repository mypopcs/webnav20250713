// /server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- VVVV 在这里添加 CORS 配置 VVVV ---
  app.enableCors({
    // 允许的前端源地址
    origin: 'http://localhost:5173',
    // 允许请求携带 cookie
    credentials: true, 
  });
  // --- AAAA 在这里添加 CORS 配置 AAAA ---

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();