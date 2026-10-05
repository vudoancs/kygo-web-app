# Changelog

Mọi thay đổi đáng kể của `kygo-web-app` được ghi ở đây.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Trang `/account/profile` (**Thông tin tài khoản**; link trong menu mobile, "Đơn hàng của tôi" và nút quay lại của trang Đổi mật khẩu): ảnh đại diện (xem trước trước khi lưu, đổi / gỡ; JPEG/PNG/WebP, giới hạn theo `avatarPolicy` backend; tài khoản Google: ảnh tải lên thay ảnh Google, gỡ → dùng lại ảnh Google), họ tên (bắt buộc), email chỉ đọc kèm giải thích, SĐT (chuẩn hoá như backend), quốc gia / tỉnh-thành / quận-huyện. Mục "Đăng nhập và bảo mật": phương thức đăng nhập; có mật khẩu → link Đổi mật khẩu, chỉ Google → hướng dẫn Google. "Lưu thay đổi" / "Hủy" (tắt khi không đổi hoặc đang lưu), lỗi cạnh field (client + `fieldErrors` backend), giữ giá trị khi lỗi, cảnh báo `beforeunload` khi có thay đổi chưa lưu, thông báo "Cập nhật thông tin tài khoản thành công.". Sau khi lưu cập nhật app-state → avatar ở header + tên/ảnh trong menu mobile. API: `GET/PATCH /auth/me`, `POST/DELETE /auth/me/avatar`.
- HTTP client giữ `fieldErrors` trong `HttpError.body`.
- Trang `/account/change-password` (**Đổi mật khẩu**; link từ "Đơn hàng của tôi" và menu mobile khi đã đăng nhập): mật khẩu hiện tại / mới / xác nhận, hiện/ẩn, `autocomplete` `current-password` / `new-password`, chính sách 8–12 ký tự không khoảng trắng và khác mật khẩu hiện tại, chặn gửi trùng khi đang xử lý, cảnh báo đăng xuất khỏi mọi thiết bị. Lỗi theo `code` backend (sai mật khẩu hiện tại, mật khẩu không hợp lệ, quá nhiều lần thử). Tài khoản chỉ Google (`hasPassword=false`) → hướng dẫn đăng nhập Google thay cho form. Thành công → xoá token, app-state, cache react-query và form, chuyển `/login?passwordChanged=1` ("Đổi mật khẩu thành công. Vui lòng đăng nhập lại."). API: `POST /auth/change-password`, `GET /auth/password-status`.


### Added

- Form đăng nhập email / mật khẩu trên `/login` gọi `POST /auth/login` thật (trước đây chỉ là giao diện): validate email + mật khẩu, trạng thái đang đăng nhập, lưu token như đăng nhập Google (`persistAuthSession`), cập nhật app-state và chuyển về `?redirect=`. Lỗi hiển thị chung "Email hoặc mật khẩu không đúng." (không phân biệt tài khoản tồn tại).
- Quên / đặt lại mật khẩu: link **Quên mật khẩu?** trên `/login` → `/forgot-password` (xác nhận chung chung, đếm ngược gửi lại 60s, hướng dẫn cho tài khoản đăng ký bằng Google) và `/reset-password` (token từ `#token=`, xoá khỏi URL ngay sau khi đọc, không lưu localStorage; hiện/ẩn mật khẩu; chính sách 8–12 ký tự không khoảng trắng; trạng thái liên kết không hợp lệ / hết hạn). Thành công → `/login?reset=success`. Header `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, `noindex`. API: `POST /auth/forgot-password`, `POST /auth/reset-password`.

### Changed

- Giá thuê giảm + giá gốc gạch ngang chỉ hiển thị khi giảm giá đang hiệu lực (server tính theo lịch); trước/sau lịch hiển thị giá gốc — card, chi tiết, listing, khuyến mãi.
- Giỏ hàng / thanh toán làm mới giá dòng thuê theo API khi mở trang và báo khi giá thay đổi; lỗi `order.price_stale` khi đặt → tải lại giá và nhắc khách kiểm tra lại.

### Added

- Giá thuê hiệu lực từ API `pricing` (strike, %, hết KM); badge SALE trên card; cart/checkout hiện giá gốc khi có KM.
- Home «Đang khuyến mãi» gọi `homepageOnly=true`.

### Added

- Header: mục **Đang khuyến mãi** (sau Trẻ em/Kids, trước Bí quyết mặc đẹp) → `/products?onPromotion=1`.
- Home: mục **Đang khuyến mãi** (giữa Hàng mới về và Xu hướng); “Xem tất cả” → `/products?onPromotion=1` gọi `GET /web/products/on-promotion`.

### Changed

- Chi tiết sản phẩm (thuê): chỉ hiện giờ nhận/trả sau khi chọn ngày; mặc định nhận sau **08:00**, trả trước **21:30** (giỏ hàng và checkout gửi cùng giờ).
- Danh sách sản phẩm (mock/offline): sort và lọc khoảng giá theo giá thuê/mua hiển thị (giá KM nếu có).
- Home: ẩn section **Đang khuyến mãi** khi không có sản phẩm (không hiện empty state).
- Home **Đang khuyến mãi**: không fallback mock data khi thiếu API / lỗi — chỉ hiện SP từ `GET /web/products/on-promotion`.

### Changed

- Filter **Loại váy**: nguồn options từ `GET /web/products/tags` (master API), bỏ hardcode làm nguồn chính; vẫn nhóm UI (dress type / neck-shoulder / silhouette).
