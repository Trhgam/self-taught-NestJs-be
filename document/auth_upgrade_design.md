# Tài liệu: Nâng cấp Hệ thống Authentication (Session-based with HttpOnly Cookies)

## 1. So sánh: Hiện tại vs. Đề xuất mới

| Đặc điểm | Luồng hiện tại | Luồng mới đề xuất |
| :--- | :--- | :--- |
| **Vị trí lưu Token ở Client** | LocalStorage / Response Body | **HttpOnly Cookie** (Trình duyệt tự quản lý) |
| **Loại Refresh Token** | JWT (Chứa data, có thể bị giải mã) | **Opaque String** (Chuỗi ngẫu nhiên, không chứa data) |
| **Quản lý thiết bị** | Một User chỉ có 1 Refresh Token duy nhất | **Nhiều Session** (Đăng nhập trên nhiều thiết bị cùng lúc) |
| **Lưu trữ phía Server** | Lưu trực tiếp vào cột trong bảng `User` | Lưu vào bảng `sessions` riêng biệt |
| **Bảo mật (XSS)** | Dễ bị hacker lấy cắp từ LocalStorage | **Hacker không thể đọc được** (HttpOnly) |
| **Cơ chế Refresh** | Gửi token cũ lên lấy token mới | **Xoay vòng (Rotation)**: Token cũ bị xóa ngay khi dùng |

---

## 2. Tại sao phải thay đổi như vậy?

### A. Chống tấn công XSS (Cross-Site Scripting)
Nếu lưu token trong `LocalStorage`, bất kỳ đoạn mã JavaScript độc hại nào (từ library bên thứ 3 hoặc script chèn vào) cũng có thể đọc và gửi token về server của hacker. Với `HttpOnly Cookie`, JavaScript **không thể truy cập**, chỉ có trình duyệt mới có quyền gửi nó kèm theo request.

### B. Opaque Refresh Token (Tăng tính bảo mật)
JWT Refresh Token chứa thông tin user bên trong. Nếu hacker lấy được, họ có thể biết ID hoặc các thông tin khác. Opaque Token chỉ là một chuỗi vô nghĩa (VD: `ref_123xyz`), hacker không làm gì được nếu không có quyền truy cập Database của bạn.

### C. Quản lý Session & Đăng xuất từ xa
Hiện tại, nếu bạn đổi mật khẩu, token cũ của bạn vẫn có thể còn hiệu lực. Với bảng `sessions`, bạn có thể liệt kê các thiết bị đang đăng nhập và thực hiện "Đăng xuất khỏi tất cả thiết bị" bằng cách xóa hết các dòng session của User đó.

---

## 3. Flow chi tiết (Code mẫu tham khảo)

### Bước 1: Table Sessions (`session.entity.ts`)
Thay vì lưu vào bảng User, ta tạo bảng này để quản lý từng lần đăng nhập.

```typescript
// Ý tưởng: Lưu thông tin thiết bị và thời hạn
@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Đây chính là Refresh Token Opaque String

  @Column()
  userId: string;

  @Column({ nullable: true })
  userAgent: string; // Tên trình duyệt/thiết bị

  @Column({ nullable: true })
  ipAddress: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isRevoked: boolean;
}
```

### Bước 2: Flow Đăng nhập (`auth.service.ts`)
Khi đăng nhập thành công, thay vì trả về Token, ta "đút" nó vào Cookie.

```typescript
// Cấu trúc logic mới trong AuthService
async login(user, response) {
  // 1. Tạo Access Token (JWT)
  const accessToken = this.jwtService.sign({ sub: user.id });

  // 2. Tạo Opaque Refresh Token (Tạo 1 bản ghi mới vào bảng Sessions)
  const session = await this.sessionRepo.save({
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
  });

  // 3. Set Cookie vào Response
  response.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, // Chỉ dùng với HTTPS (khi deploy)
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, 15 phút
  });

  response.cookie('refreshToken', session.id, {
    httpOnly: true,
    path: '/auth/refresh', // Chỉ gửi cookie này khi gọi API refresh
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  });

  return { message: 'Đăng nhập thành công' };
}
```

### Bước 3: Refresh Token Rotation
Đây là "trái tim" của bảo mật. Mỗi khi user dùng Refresh Token để lấy Access Token mới, ta **hủy luôn** Refresh Token đó và cấp cái mới.

1. Client gọi API `/auth/refresh` (Trình duyệt tự gửi kèm cookie `refreshToken`).
2. Server check ID trong bảng `sessions`.
3. Nếu hợp lệ: **Xóa dòng session cũ**, tạo dòng **session mới**, trả về 2 cookie mới.
4. Nếu không thấy: Hacker đang cố dùng token cũ đã hết hạn/đã bị hủy -> Bắt đăng nhập lại ngay.

---

## 4. Cách sử dụng ở Frontend (Client)

Khi dùng luồng này, code Frontend của bạn sẽ "nhàn" hơn nhưng cần cấu hình đúng:
*   **Không cần lưu token vào LocalStorage**: Trình duyệt tự lo.
*   **Gửi Request**: Khi gọi API bằng Axios, hãy thêm `withCredentials: true`.
    ```javascript
    axios.get('/api/profile', { withCredentials: true });
    ```
*   **Xử lý 401**: Nếu nhận code 401 (Hết hạn Access Token), Frontend chỉ cần gọi API `/auth/refresh`. Nếu API này thành công, Access Token mới sẽ tự được cập nhật vào Cookie, sau đó Frontend gọi lại API ban đầu bị lỗi là xong.
