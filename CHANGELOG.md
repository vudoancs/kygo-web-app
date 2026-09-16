# Changelog

Mọi thay đổi đáng kể của `kygo-web-app` được ghi ở đây.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
