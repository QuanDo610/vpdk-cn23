# 🛠️ HƯỚNG DẪN TRIỂN KHAI & KIẾN TRÚC GIAO DIỆN "FAMILY CN23"
> **Hệ Thống Cổng Dịch Vụ Cán Bộ & Điều Hành Nội Bộ - Văn Phòng Đăng Ký Đất Đai TP.HCM (Chi Nhánh Số 23)**

---

## 📑 MỤC LỤC
1. [HƯỚNG DẪN CẤU HÌNH GOOGLE SHEET & APPS SCRIPT](#1-hướng-dẫn-cấu-hình-google-sheet--apps-script)
2. [HƯỚNG DẪN KIẾN TRÚC LAYOUT DÙNG CHUNG (BASE LAYOUT GUIDE)](#2-hướng-dẫn-kiến-trúc-layout-dùng-chung-base-layout-guide)
3. [CÁCH KẾ THỪA CHO PHÂN HỆ MỚI](#3-cách-kế-thừa-cho-phân-hệ-mới)
4. [BẢNG API TOÀN CỤC `window.FamilyLayout`](#4-bảng-api-toàn-cục-windowfamilylayout)

---

## 1. HƯỚNG DẪN CẤU HÌNH GOOGLE SHEET & APPS SCRIPT

### 💡 Phương Án Tối Ưu Nhất
Hệ thống sử dụng lại chính trang tính Google Sheet hiện tại:
- **Giữ nguyên 100% lịch sử các cuộc họp/lịch công tác** đã đăng ký từ trước tới nay trong tab `LichTuan`.
- **Giữ nguyên đường link Web App URL cũ** (không cần cấu hình lại URL trên các máy tính đã lưu).
- Quản lý tập trung 5 tabs/sheets tương ứng 5 nghiệp vụ:
  1. `LichTuan`: Lịch công tác tuần và xuất văn bản Word chuẩn NĐ 30/2020/NĐ-CP.
  2. `TaiKhoan`: Quản lý 80+ tài khoản cán bộ Chi nhánh 23 (Username, CCCD, Mật khẩu, Chức vụ, Phòng ban).
  3. `Tickets`: Tiếp nhận sự cố tin học IT Helpdesk & lưu ảnh Google Drive.
  4. `GiaoViec`: Quản lý phiếu giao việc và theo dõi tiến độ của Ban Giám đốc.
  5. `BaoCaoSoLieu`: Báo cáo 8 nhóm chỉ tiêu chuyên môn và tự động tính tỷ lệ KPI.

### 🚀 Các Bước Thực Hiện Nhanh (Chỉ mất 2 phút)

#### Bước 1: Mở Google Sheet hiện tại
1. Mở trang tính Google Sheet của cơ quan.
2. Kiểm tra tên trang tính: **`BINHDUONG23`** (hoặc tên trang tính đang vận hành).

#### Bước 2: Dán mã Script Backend
1. Trên thanh menu của Google Sheet, chọn: **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
2. Xóa toàn bộ nội dung code cũ trong file `Code.gs`.
3. Mở file [backend/google_apps_script.js](file:///Users/admin/Desktop/FAMILY_CN23/backend/google_apps_script.js), sao chép toàn bộ nội dung và dán vào.
4. Bấm biểu tượng **Lưu (Save)** (`Ctrl + S` hoặc `Cmd + S`).

#### Bước 3: Cấu trúc 10 Cột chuẩn tab `TaiKhoan` & Tự động tạo Username
Thứ tự 10 cột trong tab `TaiKhoan` được chuẩn hóa đồng bộ như sau:
> **`Họ và tên` (A) | `Username` (B) | `Mật khẩu` (C) | `Chức danh / Chức vụ` (D) | `Số điện thoại` (E) | `Đơn vị / Bộ phận` (F) | `Số CCCD` (G) | `Trạng thái` (H) | `Vai trò` (I) | `Ngày tạo` (J)**

Bạn có 2 cách điền Username:
- **Cách 1 (Tự động 1-Click trên Google Sheet):**
  1. Tải lại trang Google Sheet (F5).
  2. Bấm vào menu **`⭐ BINHDUONG23`** trên thanh công cụ -> chọn **`🔤 Tự động tạo & điền Username (quandtm)`**.
  3. Hệ thống sẽ tự động tính toán từ cột A (`Họ và tên`) và điền sẵn Username chuẩn vào cột B cho toàn bộ cán bộ.
- **Cách 2 (Dùng công thức trang tính):**
  1. Tại ô B2, gõ công thức: `=TAO_USERNAME(A2)` rồi kéo xuống các hàng dưới.

#### Bước 4: Chạy 1-Click Cấu Hình Toàn Bộ 5 Phân Hệ (Nếu thiết lập lần đầu)
1. Bấm menu **`⭐ BINHDUONG23`** -> chọn **`▶️ 1-Click: Cấu hình chuẩn toàn bộ 5 Phân hệ BINHDUONG23`**.
2. Cấp quyền truy cập nếu Google yêu cầu.

#### Bước 5: Cập nhật Bản Triển Khai (Deploy)
1. Trong màn hình Apps Script, bấm **Triển khai (Deploy)** -> **Quản lý bản triển khai (Manage deployments)**.
2. Bấm biểu tượng **Chiếc bút chì (Edit)** cạnh bản triển khai hiện tại.
3. Tại dòng **Phiên bản (Version)**: Chọn **"Phiên bản mới" (New version)**.
4. Bấm **Triển khai (Deploy)**.

---

## 2. HƯỚNG DẪN KIẾN TRÚC LAYOUT DÙNG CHUNG (BASE LAYOUT GUIDE)

### Triết lý thiết kế (Single Source of Truth)
Toàn bộ Header cố định (Topbar) và Footer chuẩn hóa được sinh ra tự động bởi module `js/layout.js` kết hợp hệ thống định kiểu `css/base.css`. Mọi file HTML chỉ cần nhúng 2 file này là tự động có ngay bộ nhận diện chuẩn công vụ:

```text
                        THANH HEADER CỐ ĐỊNH (HEIGHT: 62PX)
┌───────────────────────────────────────────────┬──────────────────────────────────┐
│ [🏛️ Landmark Icon] VPĐK ĐẤT ĐAI TP. HỒ CHÍ MINH│ [👤 Cán bộ: Đỗ Trọng Minh Quân ▾]│
│ (Bấm icon về Trang chủ index.html)            │ (Bấm để mở User Dropdown Menu)   │
└───────────────────────────────────────────────┴─────────────────┬────────────────┘
                                                                  │
                                                                  ▼
                                                   ┌───────────────────────────────┐
                                                   │ 👤 Đỗ Trọng Minh Quân         │
                                                   │ Tổ Công nghệ thông tin        │
                                                   │ 🟢 Đang trực tuyến            │
                                                   ├───────────────────────────────┤
                                                   │ 🏠 Trang chủ Cổng Dịch Vụ     │
                                                   │ ☁️ Kho cài đặt nội bộ          │
                                                   ├───────────────────────────────┤
                                                   │ 🚪 Đăng xuất tài khoản (Đỏ)   │
                                                   └───────────────────────────────┘

                      KHÔNG GIAN LÀM VIỆC CHÍNH (MAIN WORKSPACE)
┌──────────────────────────────────────────────────────────────────────────────────┐
│ <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">                 │
│   Nội dung của từng phân hệ nghiệp vụ (Lịch tuần, Giao việc, Helpdesk, KPI...)   │
└──────────────────────────────────────────────────────────────────────────────────┘

                        CHÂN TRANG ĐỒNG BỘ TINH GỌN (SLIM FOOTER)
┌──────────────────────────────────────────────────────────────────────────────────┐
│ © 2026 VPĐKĐĐ TP.HCM - Chi nhánh số 23 • Phần mềm được phát triển bởi Đỗ Trọng Minh Quân │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CÁCH KẾ THỪA CHO PHÂN HỆ MỚI

Khi xây dựng một ứng dụng mới trong tương lai:
1. Sao chép mẫu chuẩn từ `templates/base_app_template.html`.
2. Nhúng `css/base.css` và `js/layout.js` trong thẻ `<head>`.
3. Đặt nội dung nghiệp vụ vào thẻ `<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">`.
4. Không cần viết code cho `<header>` hay `<footer>` (layout tự động hoàn toàn).

---

## 4. BẢNG API TOÀN CỤC `window.FamilyLayout`

| Phương Thức | Tham Số | Chức Năng |
|---|---|---|
| `FamilyLayout.updateUser(name, role)` | `name`, `role` | Cập nhật tức thì họ tên và chức vụ của cán bộ lên Header và Menu Dropdown. |
| `FamilyLayout.showSession(userObj)` | `userObj` | Hiển thị cụm Cán bộ sau khi đăng nhập thành công. |
| `FamilyLayout.hideSession()` | Không | Ẩn cụm Cán bộ (khi ở màn hình đăng nhập). |
| `FamilyLayout.logout()` | Không | Kích hoạt quy trình đăng xuất an toàn (dọn sạch `sessionStorage` và chuyển về `index.html`). |
