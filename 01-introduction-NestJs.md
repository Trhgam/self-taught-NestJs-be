# Nội dung cần và đủ để triển khai vào dự án
Nắm vững concept chính của **Nest.js: Pipe, Guard, Middleware, Interceptor, Exception Filters, Decorator, Module, Service, Controller, DTO, Validation, Serialization...**

Xây dựng **API** dự án Ecommerce như Shopee ( để practice )

Database: **Postgresql + Prisma ORM**

---

Phân tích và thiết kế database, cách xử lý các trường hợp phổ biến khi migrate database

- Authentication: **JWT + Refresh Token, Google OAuth**

- 2FA: Bảo mật 2 lớp với mã **OTP hoặc Google Authenticator**

- Phân quyền: **Permission based Access Control (PBAC)**

- Hỗ trợ đa ngôn ngữ **(i18n)**

- Validate dữ liệu đầu vào và Serialization đầu ra với **class-validator và Zod**

- Gửi email bằng Resend với template React hiện đại (không dùng HTML thô hay template engine như **Pug, EJS, Handlebars...**)

- Upload file lên AWS S3

- Xử lý thông báo thời gian thực với **Socket.io**

- Tối ưu hiệu năng với **Redis Cache**

- Thanh toán online bằng chuyển khoản ngân hàng qua Sepay webhook kết hợp BullMQ để xử lý hàng đợi và Socket.io để cập nhật trạng thái thanh toán realtime.

- Phân tích Race Condition và cách xử lý với 3 giải pháp: **Optimistic Locking, Pessimistic Locking, Distributed Locking với Redlock trên Redis**

Viết API theo **GraphQL với Apollo Server**