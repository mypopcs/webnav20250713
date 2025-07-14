import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 导入 ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- VVVV 在这里添加代码 VVVV ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离 DTO 中未定义的属性
      transform: true, // 自动将传入的普通对象转换为 DTO 类的实例
      forbidNonWhitelisted: true, // 如果传入了 DTO 中未定义的属性，则抛出错误
    }),
  );
  // --- AAAA 在这里添加代码 AAAA ---

  await app.listen(3000);
}
bootstrap();