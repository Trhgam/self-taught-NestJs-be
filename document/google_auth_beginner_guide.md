# 🎓 Siêu Cẩm nang: Giải mã Google Login (Bản Full Code 100% - Không Rút Gọn)

Chào mừng bạn đến với bản tài liệu "tâm huyết" nhất, nơi chúng ta sẽ soi từng dòng code thực tế trong dự án của bạn để hiểu cách NestJS vận hành luồng Google Login chuyên nghiệp.

---

## 🏗️ 1. Module: Trái tim nối kết ([auth.module.ts](file:///d:/HOCTUTHIEN/hoctuthien/backend/src/modules/auth/auth.module.ts))

Đây là nơi "đấu dây điện". Nếu không có Module, các bộ phận sẽ rời rạc và không hoạt động.

```typescript
@Module({
  imports: [
    // 1. Kết nối với bảng User và Session trong Database
    TypeOrmModule.forFeature([UserEntity, UserSessionEntity]),
    RedisModule,
    // 2. NHỜ CẢ VÀO ĐÂY: Cho phép dự án sử dụng thư viện Passport
    PassportModule,
    UserSessionModule,
    JwtModule.registerAsync({ ... }),
  ],
  // 3. Khai báo Strategy (Cái phích cắm Google) để NestJS nhận diện
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 🚪 2. Controller: Lễ tân đón khách ([auth.controller.ts](file:///d:/HOCTUTHIEN/hoctuthien/backend/src/modules/auth/auth.controller.ts))

Lễ tân có 2 nhiệm vụ: Đẩy khách sang Google và Đón khách quay về.

```typescript
  // BƯỚC 1: Đẩy khách sang Google
  @Public() // Thẻ miễn tử để ai cũng vào được
  @Get('google')
  @UseGuards(GoogleAuthGuard) // Nhờ Bảo vệ (Strategy) dẫn đường
  async googleAuth(@Req() req: any) {
    // Passport sẽ tự động chuyển hướng khách sang trang Login của Google
  }

  // BƯỚC 2: Đón khách từ Google quay về
  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard) // Bảo vệ kiểm tra xem khách có mang "Hộ chiếu" về không
  async googleAuthRedirect(@Req() req: any) {
    // Dữ liệu "sạch" từ Google lúc này đã nằm trong req.user
    // Chúng ta đưa nó cho Đầu bếp (AuthService) nấu nướng
    return this.authService.validateGoogleUser(req.user);
  }
```

---

## 🛡️ 3. Strategy: Người nhặt đồ từ Google ([google.strategy.ts](file:///d:/HOCTUTHIEN/hoctuthien/backend/src/modules/auth/strategies/google.strategy.ts))

Passport đã làm hết việc khó, bạn chỉ việc "nhặt" những thứ mình cần từ cái `profile` khổng lồ mà Google trả về.

```typescript
async validate(
  accessToken: string,  // Chìa khóa Google cấp để Server mình liên lạc với họ
  refreshToken: string, // Chìa khóa dự phòng
  profile: any,         // CẢ NĂM TRỜI ĐỢI CHỜ: Google trả Profile ở đây!
  done: VerifyCallback,
): Promise<any> {
    
  // SOI CHI TIẾT CÁCH NHẶT ĐỒ:
  const { name, emails, photos } = profile;
  
  // Bạn hỏi: "Xử lý profile như thế nào?" -> ĐÂY CHÍNH LÀ NÓ:
  const user = {
    // Một người có nhiều Email, mình chọn cái đầu tiên (Index 0)
    email: emails[0].value, 
    // Ghép Tên và Họ lại thành tên đầy đủ
    firstName: name.givenName,
    lastName: name.familyName,
    // Google trả về nhiều kích cỡ ảnh, mình lấy cái mặc định (Index 0)
    picture: photos[0].value,
    accessToken, // Giữ lại cái này nếu sau này muốn lục ngăn kéo Google của họ
  };
  
  // Đưa món đồ đã "lọc sạch" này cho Controller
  done(null, user); 
}
```

---

## 🍳 4. AuthService: Ma thuật nấu nướng ([auth.service.ts](file:///d:/HOCTUTHIEN/hoctuthien/backend/src/modules/auth/services/auth.service.ts))

Đây là nơi logic nghiệp vụ thực sự diễn ra.

```typescript
async validateGoogleUser(profile: any) {
  // 1. Giải nén thông tin chúng ta vừa nhặt ở Strategy
  const { email, firstName, lastName, picture } = profile;
  
  // 2. SOI SỔ HỘ KHẨU (Database)
  let user = await this.userRepository.findOne({ where: { email } });

  if (!user) {
    // 3. KHÁCH MỚI: Tạo hồ sơ mới hoàn toàn
    user = this.userRepository.create({
      email,
      fullName: lastName ? `${firstName} ${lastName}` : firstName,
      avatar: picture,
      role: UserRole.MENTEE,
      isEmailVerified: true,
    });
    // Lưu khách mới vào Database
    await this.userRepository.save(user);
  } else {
    // 4. KHÁCH CŨ: Chỉ cập nhật lại cái Avatar mới nhất cho "xịn"
    user.avatar = picture;
    await this.userRepository.save(user);
  }

  // 5. PHÁT THẺ PHÒNG (JWT): Cho khách vào chơi trong hệ thống
  const tokens = await this.generateTokens(user.id);
  
  // 6. GHI VÀO SỔ QUẢN LÝ PHIÊN (Session Table)
  // Lưu Refresh Token vào bảng nhà mình để sau này có thể "đuổi khách" nếu cần.
  await this.createSession(user.id, tokens.refresh_token);

  // TRẢ KẾT QUẢ CUỐI CÙNG
  return { user, ...tokens };
}
```

---

## 🏮 5. Passport thực sự "lo" cái gì? (Under the Hood)

Để tôi kể cho bạn nghe Passport đã làm "luồng ngầm" như thế nào:
1.  **Bước 1:** Khi bạn gọi `super({...})` trong Strategy, Passport tự xây dựng cái link: `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...` (Bạn không cần viết một dòng nào để tạo cái link này).
2.  **Bước 2:** Khi khách đăng nhập xong, Google ném về một cái mã `code` vào đường link Callback của bạn. Passport tự động "bắt" lấy cái mã này.
3.  **Bước 3:** Passport lấy mã `code` đó kết hợp với `clientSecret` bí mật của bạn, nó tự phi lên Google xin đổi lấy chìa khóa `accessToken`.
4.  **Bước 4:** Sau khi có `accessToken`, nó lại tự phi lên Google lần nữa để hỏi: *"Ê, ông khách này tên gì, ảnh đâu?"*. Google trả về một chuỗi JSON khổng lồ (Profile).
5.  **Bước 5:** Cuối cùng, nó mới nhồi hết `accessToken` và `Profile` vào hàm `validate` của bạn.

**Tóm lại:** 
3.  **Passport (Người gác cổng vĩ đại):** 
    *   **Nghiệp vụ:** Đây là thư viện "tiêu chuẩn" giúp Backend nói chuyện được với Google. 
    *   **Tại sao phải dùng?** Nếu không có Passport, bạn sẽ phải tự viết hàng trăm dòng code để: Tự tạo link chuyển hướng -> Tự nhận mã code Google gửi về -> Tự gửi yêu cầu đổi mã lấy Token -> Tự giải mã Token... cực kỳ dễ sai sót và mất bảo mật. 
    *   **Nó cần tài nguyên gì để làm việc?** Bạn phải "cúng" cho nó 3 món đồ sau trong Constructor:
        1.  `ClientID`: Tên của ứng dụng bạn (Google cấp).
        2.  `ClientSecret`: Mật khẩu ứng dụng của bạn (Google cấp).
        3.  `CallbackURL`: Cái địa chỉ "nhà mình" để Google dẫn khách quay lại.
    *   **Nó kết nối với BE bằng cách nào?** Passport sử dụng cơ chế **Guard (Người bảo vệ)**. Khi bạn đặt `@UseGuards(GoogleAuthGuard)` lên trên một hàm trong Controller, NestJS sẽ nói: *"Dừng lại! Đưa request này cho Passport xử lý trước, khi nào nó xong việc và 'gật đầu' cho qua thì hàm của tôi mới chạy"*.

Bản "Siêu Cẩm nang" này đã đủ chi tiết để bạn tự tin giảng giải lại cho người khác chưa? Cần soi kĩ hơn dòng nào, cứ bảo tôi!
