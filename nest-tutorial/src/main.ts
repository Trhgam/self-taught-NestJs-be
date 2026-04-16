declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình Validation toàn cục
  app.useGlobalPipes(new ValidationPipe());

  // 2. Lấy cổng từ file .env, mặc định là 3001
  // Đảm bảo ép kiểu Number để tránh lỗi tham số
  const port = Number(process.env.PORT) || 3001;

  // 3. Quan trọng: '0.0.0.0' cho phép Docker kết nối từ bên ngoài container
  await app.listen(port, '0.0.0.0');

  // In ra log để bạn biết chắc chắn app đang chạy cổng nào trên server
  logger.log(`Ứng dụng đang chạy tại: http://localhost:${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap().catch((err) => {
  console.error('Lỗi khi khởi động ứng dụng:', err);
  process.exit(1);
});
