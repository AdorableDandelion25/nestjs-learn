# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Quy tắc lập trình **bắt buộc** cho dự án **NestJS 11 + Sequelize (`sequelize-typescript`) + PostgreSQL**, package manager **pnpm**. Mọi Agent (Claude, Gemini, ...) phải đọc và tuân thủ.

## 0. Lệnh thường dùng

```bash
pnpm install                          # cài dependencies
pnpm run start:dev                    # chạy dev (watch)
pnpm run start:prod                   # chạy bản build (node dist/main)
pnpm run build                        # nest build
pnpm run lint                         # eslint --fix
pnpm run format                       # prettier --write
pnpm run test | test:watch | test:cov # unit test (jest, *.spec.ts)
pnpm run test:e2e                     # e2e (test/jest-e2e.json)
pnpm exec jest path/to/file.spec.ts   # chạy 1 file
pnpm exec jest -t "tên test"          # chạy 1 test theo tên
```

## 1. TypeScript cốt lõi

- **Cấm `any`**: dùng `unknown` + Type Narrowing (`typeof`/`instanceof`/type guard); dùng Generic `<T>` cho kiểu dùng chung.
- **Kiểu nguyên thủy viết thường**: `string`/`number`/`boolean`/`symbol`/`object`, KHÔNG dùng boxed types `String`/`Number`/`Boolean`/`Object`.
- **Callback**: trả `void` cho giá trị bị bỏ qua (không `any`); định nghĩa đủ tham số, không thừa `?`.
- **Overload**: sắp xếp từ cụ thể → chung; gộp bằng Union/`?` thay vì nhiều overload đơn giản.
- **Suy luận kiểu** cho biến cục bộ; **khai báo kiểu rõ ràng** cho tham số & giá trị trả về của API/Service/Controller công khai.
- **Nullable an toàn**: dùng `?.` và `??`, tránh lạm dụng `!`. Ép kiểu phải qua `unknown` (`x as unknown as T`), không ép vô tội vạ.
- **Bất biến**: mặc định `const` (không `var`); `readonly` cho field bất biến; `as const` cho literal cố định; ưu tiên `map`/`filter`/spread thay vì mutate.
- **`interface`** cho hình dạng đối tượng có thể mở rộng; **`type`** cho union/intersection/tuple/mapped. Tận dụng `Partial`/`Pick`/`Omit`/`Record`/`Readonly`. Ưu tiên union literal cho tập giá trị đơn giản.
- **Named export** (cấm `export default`). Mỗi file một mối quan tâm.
- **Async**: hàm async khai báo `Promise<T>`, dùng `async/await`; không floating promise; tác vụ độc lập chạy `Promise.all`.

## 2. NestJS

- **DI**: program-to-interface để giảm coupling. Vì `interface` mất ở runtime, dùng **`abstract class`** làm token; đăng ký `{ provide: Token, useClass: Impl }`. Luôn **constructor injection** với `private readonly`. Tránh circular dependency (chỉ dùng `forwardRef()` khi bất khả kháng).
- **Tổ chức**: `src/base/` (lớp cơ sở tái dùng), `src/feature/<tên>/` (module nghiệp vụ tự đóng gói `controller`/`service`/`entity`/`dto`/`provider`/`*.module.ts`), `src/module/` (root + hạ tầng), `src/provider/` & `src/constant/`. Module chỉ export thứ cần thiết.
- **Controller mỏng – Service chứa nghiệp vụ**: Controller chỉ điều phối HTTP, không truy cập model/repository trực tiếp.
- **DTO & Validation**: input qua DTO + `class-validator`; `ValidationPipe` toàn cục `{ whitelist, forbidNonWhitelisted, transform: true }`. KHÔNG trả entity ra response — map sang **Response DTO** (ẩn field nhạy cảm như `password`), vd `ResponseDto.from(entity)`. Tách DTO vào/ra.
- **Config**: ưu tiên `@nestjs/config` typed thay vì `process.env` rải rác; validate env lúc khởi động (fail-fast); không hardcode secret, cập nhật `.env.example`.
- **Lỗi**: ném `HttpException`/lớp con (`BadRequestException`, `NotFoundException`, ...) đúng status; dùng Exception Filter chuẩn hóa; không nuốt lỗi im lặng.
- **Pipes** (validate/transform input), **Guards** (auth/role — không nhét vào Controller/Service), **Interceptors** (logging/mapping/cache — đặt cross-cutting đúng cơ chế).
- **Logging & vòng đời**: dùng `Logger` của Nest (context theo class), không `console.log` nghiệp vụ; bật `enableShutdownHooks()`, dọn tài nguyên qua `OnModuleDestroy`.
- **API**: cân nhắc `setGlobalPrefix` + versioning; tài liệu bằng `@nestjs/swagger`.

## 3. Sequelize & Database

- **Model**: dùng decorator (`@Table`/`@Column`/`@PrimaryKey`/`@ForeignKey`/`@BelongsTo`/`@HasMany`); khai báo `declare` + `CreationOptional<T>` cho field tự sinh; kế thừa `BaseEntity<T>`.
- **Transaction**: mọi write (create/update/delete) chạy trong `sequelize.transaction(async t => { ... })` để auto commit/rollback.
- **CRUD**: chuẩn hóa kết quả `update` về `[affectedCount: number]` (độc lập dialect).
- **Truy vấn**: phân trang (`limit`/`offset`/cursor), tránh `findAll` không giới hạn; `include` để tránh N+1; chỉ lấy `attributes` cần dùng; cân nhắc soft delete (`paranoid`). KHÔNG ghép chuỗi SQL từ input (SQL injection) — dùng where/tham số.
- **Schema**: `sync()` (`alter`/`force`) chỉ ở dev qua env (`ENVIRONMENT`/`ALLOW_ALTER_TABLE`/`ALLOW_FORCE_TABLE_RECREATION`); `force=true` **drop & tạo lại bảng**. Production dùng migration, không `sync`.

## 4. Quy tắc SonarQube (TypeScript)

**Độ tin cậy (Bug)**
- Không dùng kết quả của hàm trả `void`; không so sánh/gán kiểu không tương thích.
- Mọi nhánh code phải có thể đạt tới — xóa dead code & code sau `return`/`throw`/`break`.
- Loop phải có khả năng dừng; không điều kiện luôn đúng/luôn sai (gratuitous boolean).
- Promise/async phải được `await` hoặc xử lý; không bỏ lửng.
- Biến không tự tham chiếu khi gán; không gán đè vô nghĩa.

**Bảo trì (Code Smell)**
- **Cognitive Complexity** mỗi hàm ≤ 15; tách hàm khi vượt.
- Không lồng quá 3 cấp control flow; gộp `if` lồng nhau khi có thể (collapsible if); không nested ternary.
- Hàm ≤ ~7 tham số; nhiều hơn thì gom thành object.
- Không lặp khối code; tách thành hàm/hằng dùng chung. Không lặp string literal ≥ 3 lần — đưa vào hằng có tên.
- Xóa biến/import/tham số/private không dùng; không code bị comment (commented-out code).
- Luôn `===`/`!==` (không `==`/`!=`); `switch` phải có `default`; mỗi `case` không fall-through ngoài ý muốn.
- Không biểu thức trùng hai vế toán tử (`a && a`, `a === a`); không gán trong điều kiện.
- Đặt tên rõ nghĩa; không shadowing biến; xử lý mọi `catch` (không catch rỗng).

**Bảo mật (Security Hotspot)**
- Không hardcode credential/secret/token; không log dữ liệu nhạy cảm.
- Không dùng `eval`/dynamic code; validate mọi input ở biên hệ thống.
- `TODO`/`FIXME` phải kèm ngữ cảnh & được theo dõi, không để treo.

## 5. Clean Code & Định dạng

- ESLint + Prettier: indent **2 spaces**, nháy đơn `'`, luôn có `;`.
- Đặt tên: Class/Interface `PascalCase`, biến/hàm `camelCase`, hằng toàn cục `UPPER_SNAKE_CASE`, file `kebab-case.ts` với hậu tố vai trò (`*.controller.ts`/`*.service.ts`/`*.module.ts`/`*.dto.ts`/`*.model.ts`/`*.guard.ts`/`*.provider.ts`).
- Không magic value — dùng hằng có tên. Hàm nhỏ, một trách nhiệm.
- Chỉ comment khi giải thích "tại sao"; giữ comment nghiệp vụ của người dùng, không tự ý xóa.
