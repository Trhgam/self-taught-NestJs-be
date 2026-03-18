# Nội dung cần và đủ để triển khai vào dự án không có ui FE 

Nắm vững concept chính của **Nest.js: Pipe, Guard, Middleware, Interceptor, Exception Filters, Decorator, Module, Service, Controller, DTO, Validation, Serialization...**

Xây dựng **API** dự án Ecommerce như Shopee ( để practice )

Database: **Postgresql + Prisma ORM**

---

Phân tích và thiết kế database, cách xử lý các trường hợp phổ biến khi migrate database

- Authentication: **JWT + Refresh Token, Google OAuth**

- 2FA: Bảo mật 2 lớp với mã **OTP hoặc Google Authenticator**

- Phân quyền: **Permission based Access Control (PBAC)**

- Hỗ trợ đa ngôn ngữ **(i18n)** : đa ngôn ngữu động theo database

- Validate dữ liệu đầu vào từ user gửi lên và Serialization dùng cho đầu ra với **class-validator và Zod** ( tránh trả về data nhạy cảm - cơ cchếloaji bỏ pwd )

- Gửi email bằng Resend với template React hiện đại (không dùng HTML thô hay template engine như **Pug, EJS, Handlebars...**)

- Upload file lên AWS S3 | VN data | Vietmit 

- Xử lý thông báo thời gian thực với **Socket.io** in web socket

- Tối ưu hiệu năng với **Redis Cache**

- Thanh toán online bằng chuyển khoản ngân hàng qua **Sepay** webhook kết hợp **BullMQ** để xử lý hàng đợi và Socket.io để cập nhật trạng thái thanh toán realtime.

- Phân tích **Race Condition** và cách xử lý với 3 giải pháp: **Optimistic Locking, Pessimistic Locking, Distributed Locking với Redlock trên Redis** (khóa học chỉ còn 1 slot nhưng tới 3 người muốn đăng kí cùng lúc)

Viết API theo **GraphQL với Apollo Server**

Viết Unit test cho project Nest bằng **Jest**

Tìm hiểu thêm Nest Testing

---
### Giới thiệu về Nest.js 

Nest.js là một Node.js backEnd framework được build dựa trên Express (mặc định) và Fastify.

Dùng TypeScript và kết hợp các tính năng của OOP (Object Oriented Programming), FP (Functional Programming) và FRP (Functional Reactive Programming).

Documentation đầy đủ nhất trong các framework Node.js.

Hệ sinh thái (các package hỗ trợ) nhiều nhất trong các framework Node.js.

##### So sánh Nest.js, Express.js và Fastify.js

##### Hiệu suất: Fastify > Express > Nest

##### Độ khó: Nest > Fastify > Express

##### Hệ sinh thái: Nest > Fastify > Express

##### Tính năng: Nest > Fastify > Express

##### Document: Nest > Fastify > Express

