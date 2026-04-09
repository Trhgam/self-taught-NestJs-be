###

setup nodeJs before install nest

    npm i -g @nestjs/cli
    nest new project-name

phân biệt swc và ts-node trong package.json

---

**Decorator** là một trong những khái niệm quan trọng nhất. Về bản chất, nó là các hàm (functions) bắt đầu bằng ký hiệu @, được dùng để bổ sung metadata (thông tin mô tả) hoặc thay đổi hành vi cho class, method, property hoặc parameter mà không cần can thiệp trực tiếp vào logic bên trong.

Decorator giống như các "nhãn dán" (labels). Khi bạn dán nhãn **@Controller('users')** lên một class, NestJS nhìn vào đó và hiểu ngay: "À, class này sẽ chịu trách nhiệm xử lý các request liên quan đến đường dẫn /users".

---

#### So sánh cách viết code khi dùng Express.js thuần (không có Decorator) và NestJS (sử dụng Decorator).

```ts
// Express.js
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  const product = findProductById(productId);

  // Phải tự định nghĩa status code và kiểu trả về (JSON)
  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy" });
  }

  res.status(200).json(product);
});
```

```ts
// NestJS
@Controller("products") // Đây là Controller cho đường dẫn /products
export class ProductsController {
  @Get(":id")
  findOne(@Param("id") id: string) {
    // NestJS đã tự bóc tách req.params.id và gán thẳng vào biến 'id'

    const product = this.productsService.findById(id);

    // Chỉ cần return dữ liệu, NestJS tự động hiểu là trả về JSON + Status 200
    return product;
  }
}
// sự kết hợp giữa Servlet (MVC Java) và và React
```
