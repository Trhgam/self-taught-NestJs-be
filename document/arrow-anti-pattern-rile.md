## Nested Code
```ts
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasSubscription) {
        if (user.role === 'admin') {
          if (user.permissions.canEdit) {
            executeEditAction();
          }
        }
      }
    }
  }
}
```

---

### 2.Guard Clauses

```ts
function processUser(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasSubscription) return;
  if (user.role !== 'admin') return;
  if (!user.permissions.canEdit) return;

  executeEditAction();
}
```

Tại sao nên suy nghĩ các trường hợp sai trước (dùng Guard Clauses)?

Khi bạn viết if (user) { ... }, máy phải ghi nhớ: "Mọi thứ bên trong dấu ngoặc này đều đang phụ thuộc vào việc user tồn tại". Nếu có 5 dấu ngoặc lồng nhau, não bạn phải gánh 5 tầng điều kiện cùng lúc.

Với Guard Clauses (!):

Ngay khi dòng if (!user) return; kết thúc, não bạn có thể quên luôn trường hợp user bị null.

Phần code phía dưới mặc định là "vùng an toàn" nơi user chắc chắn tồn tại.

Đây là phương pháp code xử lý vấn đề trực tiếp ngay từ khi phát hiện