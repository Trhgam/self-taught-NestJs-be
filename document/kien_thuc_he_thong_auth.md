# 📘 Cấu hình Hệ thống & Redis: Những điều cần biết

Tài liệu này giải thích chi tiết về hai thành phần quan trọng bạn vừa triển khai: **Zod Validation cho Config** và **Redis**.

---

## 🛡️ 1. Tại sao cần `envSchema` (Zod)?

Trong dự án, bạn có file `.env`. Thông thường, ta có thể dùng `process.env.PORT` để lấy dữ liệu. Tuy nhiên, NesJS khuyến khích dùng `envSchema` vì 3 lý do "vàng" sau:

### a. Phát hiện lỗi ngay lập tức (Fail Fast)
Nếu bạn quên không điền `DATABASE_URL` trong file `.env`, ứng dụng sẽ **không được phép khởi động**. 
*   **Không có Schema**: App vẫn chạy, cho đến khi user Login thì mới báo lỗi sập server -> Rất khó debug.
*   **Có Schema**: App báo lỗi ngay giây đầu tiên bạn gõ `npm run start:dev`.

### b. Ràng buộc kiểu dữ liệu (Type Safety)
File `.env` mặc định mọi thứ đều là chữ (string). Nhưng cổng `PORT` phải là số, `DEBUG` phải là true/false.
`envSchema` giúp ép kiểu:
```typescript
PORT: z.coerce.number().default(3000) // Tự động biến "5050" thành số 5050
```

### c. Tài liệu hóa hệ thống
Nhìn vào `envSchema`, bất kỳ lập trình viên nào cũng biết dự án này cần tổng cộng bao nhiêu biến môi trường để chạy được.

---

## ⚡ 2. Redis: Tốc độ và Sức mạnh

### Redis là gì?
Redis (Remote Dictionary Server) là một cơ sở dữ liệu **lưu trên RAM**. Vì lưu trên RAM nên nó nhanh hơn Database truyền thống (PostgreSQL, MySQL - lưu trên ổ cứng) hàng nghìn lần.

### Công dụng chính trong Backend:

| Công dụng | Mô tả |
| :--- | :--- |
| **Caching (Bộ nhớ đệm)** | Lưu kết quả các API nặng. Ví dụ: Lấy danh sách 10,000 khóa học, lưu vào Redis để trả về trong 1ms. |
| **Session Storage** | Lưu trạng thái đăng nhập của User. |
| **Rate Limiting** | Chặn các cuộc tấn công SPAM (Ví dụ: Một IP chỉ được gọi API 5 lần/giây). |
| **Temporary Data** | Lưu các dữ liệu có thời hạn (OTP, mã xác nhận email, Token thu hồi). |

---

## 🧪 3. Cách Test Redis chuyên nghiệp

### Bước 1: Test bằng Ping-Pong (Kiểm tra "Sống/Chết")
Cách đơn giản nhất để biết Redis có phản hồi không là gửi lệnh `PING`.
*   Kết nối OK -> Redis trả về `"PONG"`.

### Bước 2: Test bằng Key-Value (Thao tác cơ bản)
Redis lưu dữ liệu theo cặp **Khóa - Giá trị**. Bạn hãy thử trên Postman với API chúng ta vừa tạo:
1.  **SET**: `set('user_1', 'Gam_Active')` -> Redis lưu vào RAM.
2.  **GET**: `get('user_1')` -> Trả về `'Gam_Active'`.
3.  **DEL**: Xóa bỏ khóa khi không cần thiết.

### Bước 3: Test TTL (Time To Live - Thời gian sống)
Dữ liệu trên Redis thường không để mãi mãi. 
*   Lệnh: `set('token', 'abc', 'EX', 60)` 
*   Sau 60 giây, Redis sẽ tự động tiêu hủy dữ liệu này. Đây là cách tuyệt vời để quản lý bộ nhớ.

---

> [!TIP]
> **Khi nào nên dùng Redis?** Khi bạn cần dữ liệu TRUY XUẤT CỰC NHANH và DỮ LIỆU ĐÓ KHÔNG CẦN LƯU VĨNH VIỄN (có thể mất khi mất điện hoặc hết hạn).
> **Khi nào dùng Database (Postgres)?** Khi dữ liệu quan trọng, cần quan hệ phức tạp và CẦN LƯU VĨNH VIỄN.

---
💡 *Bạn đã nắm vững "binh pháp" này chưa? Hãy thử nghịch thêm các lệnh Redis trên giao diện Web Browser để thấy dữ liệu nhảy múa nhé!*
