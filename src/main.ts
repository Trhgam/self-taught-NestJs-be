import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //Dòng code này trả về một đối tượng (instance) thực thi giao diện INestApplication.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
// NestFactory:	Một lớp (class) core của NestJS cung cấp //
//              các phương thức tĩnh để tạo một instance của ứng dụng.
/**
 * AppModule	Module gốc (root module) của ứng dụng.
 *             NestJS sẽ dựa vào đây để quét và //
 *              khởi tạo toàn bộ các module, controller, và provider con.
 * /
 * NestFactory.create() :      Hàm khởi tạo. Nó đọc AppModule, /
 *        giải quyết các phụ thuộc (Dependency Injection) và trả về đối tượng app.
 * /
 * INestApplication	: * Một interface định nghĩa các phương thức để quản lý ứng dụng /
 *                  (như listen, use, connectMicroservice).
 * app.listen(): 	Kích hoạt HTTP server để bắt đầu lắng nghe các yêu cầu từ client.
 * /
 */
