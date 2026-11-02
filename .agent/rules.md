# PROJECT SPECIFICATION & MASTER AGENT RULES
### HỆ THỐNG CỔNG DỊCH VỤ NỘI BỘ "FAMILY CN23" - VPĐK CHI NHÁNH SỐ 23

> [!IMPORTANT]
> **QUY CHUẨN DUY NHẤT VÀ TỐI THƯỢNG (SINGLE SOURCE OF TRUTH):**  
> Tài liệu này là kim chỉ nam bắt buộc cho AI Agent và lập trình viên khi phát triển, sửa đổi hoặc nâng cấp mã nguồn hệ thống. Mọi tài liệu trong thư mục `docs/` chỉ mang tính chất tham khảo lịch sử hoặc hướng dẫn nghiệp vụ, **tuyệt đối không được phép ghi đè hay làm mâu thuẫn với các quy tắc trong tài liệu này**.

---

## 0. TRIẾT LÝ VẬN HÀNH & QUY TRÌNH PHÁT TRIỂN (AGILE FRONTEND WORKFLOW)

1. **Loại bỏ quy trình thác nước cồng kềnh (No Heavy Waterfall):**
   - Dự án **KHÔNG áp dụng quy trình 5 giai đoạn cứng nhắc (Analyst &rarr; Design &rarr; Coding &rarr; Testing &rarr; Maintenance)** và **không yêu cầu phải viết tài liệu đặc tả (Spec) phức tạp** trước khi thực hiện.
   - Quy trình làm việc là **Agile Pair-Programming trực tiếp với Người dùng**: Nhận yêu cầu &rarr; Áp dụng ngay bộ quy chuẩn Frontend có sẵn &rarr; Chỉnh sửa mã nguồn sạch &rarr; Kiểm thử kiểm tra tại chỗ (Local Test) &rarr; Bàn giao nhanh gọn.

2. **Kế thừa tối đa bộ khung Frontend chuẩn hóa:**
   - Đã có sẵn hệ thống nền tảng: Bố cục App Shell ([`js/layout.js`](file:///Users/admin/Desktop/FAMILY_CN23/js/layout.js)), Khung cơ sở ([`css/base.css`](file:///Users/admin/Desktop/FAMILY_CN23/css/base.css)), Tokens ([`css/variables.css`](file:///Users/admin/Desktop/FAMILY_CN23/css/variables.css)), Route Guard ([`js/auth.js`](file:///Users/admin/Desktop/FAMILY_CN23/js/auth.js)). Mọi tính năng mới chỉ cần kế thừa, không phát minh lại bộ khung.

3. **Kỷ luật Git nghiêm ngặt (Quy tắc 9):**
   - **TUYỆT ĐỐI KHÔNG tự ý thực hiện `git push`** lên remote repository khi chưa có lệnh rõ ràng từ người dùng. Mọi thao tác lập trình, chạy kiểm thử, chỉnh sửa file đều phải thực hiện an toàn tại Local Workspace.

---

## 1. TECH STACK & ARCHITECTURE

* **Frontend:** Pure Semantic HTML5, Modern CSS (Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+ chuẩn mực). Tuyệt đối **không tự ý cài đặt framework** (React, Vue, Angular) hoặc build tools/bundlers nặng nề (Webpack, Vite, npm) để đảm bảo không có build step, trang mở tức thì dưới 200ms trên máy tính văn phòng cấu hình cơ bản.
* **Database / Backend:** Google Sheets đóng vai trò Database. Truy xuất dữ liệu thông qua **Google Apps Script (GAS) Web App** đóng vai trò REST API endpoint (`doGet`, `doPost`).
* **Mô hình triển khai:** Tách biệt hoàn toàn (Decoupled Client-Server). Client gọi API bất đồng bộ và tự render DOM.
* **Hosting:** GitHub Pages máy chủ tĩnh (Static Hosting) kết hợp Bộ phím tắt Desktop 1-Click dành cho hơn 80 cán bộ.

---

## 2. DESIGN SYSTEM & COLOR PALETTE

Tuân thủ nghiêm ngặt nguyên tắc phối màu **60 - 30 - 10** chuẩn nhận diện cơ quan hành chính nhà nước (Royal Navy & Gold):
* **60% Nền & Không gian:** Trắng xám dịu (`--color-bg-app`) và Trắng tinh (`--color-bg-surface`).
* **30% Khung nhận diện:** Xanh hoàng gia Royal Navy (`--color-brand-navy`) cho Header Topbar, Khung điều hướng, Card Header, Bảng dữ liệu.
* **10% Điểm nhấn hành động:** Vàng kim công vụ (`--color-accent`) CHỈ dùng cho Call-To-Action (CTA), Nút bấm nổi bật, Badge và Trạng thái quan trọng.

### 2.1. Bảng biến CSS chuẩn cơ quan (`css/variables.css` kế thừa qua `css/base.css`):
```css
:root {
  /* Brand Identity (30% & 10%) */
  --color-brand-navy: #1e3a8a;       /* Xanh Royal Navy chủ đạo cơ quan */
  --color-brand-navy-dark: #0f172a;  /* Navy trầm - Header bar & Chân trang */
  --color-brand-navy-light: #2563eb; /* Navy sáng - Hover & Active states */
  --color-accent: #d97706;           /* Vàng kim công vụ - Nút CTA chính */
  --color-accent-hover: #b45309;     /* Vàng sẫm khi hover */
  --color-accent-glow: rgba(217, 119, 6, 0.35);

  /* Neutrals & Surfaces (60%) */
  --color-bg-app: #f8fafc;           /* Nền toàn trang (Slate White dịu mắt) */
  --color-bg-surface: #ffffff;       /* Nền thẻ, bảng số liệu, form (Pure White) */
  --color-bg-subtle: #f1f5f9;        /* Nền phụ, input disabled */
  --color-border: #cbd5e1;           /* Viền mỏng phân cách */
  --color-border-subtle: #e2e8f0;    /* Viền nhạt thẻ card */

  /* Semantic Status Colors */
  --color-success: #15803d;          /* Xanh lá - Hoàn thành, Đúng hạn, Online */
  --color-warning: #b45309;          /* Cam đất - Đang xử lý, Chờ duyệt */
  --color-danger: #b91c1c;           /* Đỏ cờ - Khẩn, Quá hạn, Đăng xuất */
  --color-info: #0284c7;             /* Xanh biển - Thông tin, Lịch họp */

  /* Typography */
  --color-text-main: #0f172a;        /* Chữ nội dung chính (Dark Slate) */
  --color-text-muted: #64748b;       /* Chữ phụ, hướng dẫn (Slate Gray) */
  --color-text-inverse: #ffffff;     /* Chữ trắng trên nền Navy hoặc nút CTA */

  /* Container & Layout */
  --container-max-width: 1280px;     /* Độ rộng chuẩn chống tràn, thẳng lề */
  --header-height: 60px;             /* Chiều cao cố định của thanh Topbar */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --shadow-card: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  --transition-fast: 0.18s ease-in-out;
}
```

### 2.2. Chuẩn hóa chiều rộng Container 1280px:
Mọi phân hệ đều phải bọc nội dung chính trong thẻ:
```html
<main class="main-content app-container max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex-1">
```
Đảm bảo khi chuyển đổi giữa các module không bị giật khung, lệch lề hai bên.

---

## 3. PROJECT FOLDER STRUCTURE (CHUẨN HÓA CHO 5 PHÂN HỆ)

```text
FAMILY_CN23/
│
├── .agent/
│   └── rules.md                # QUY CHUẨN DUY NHẤT & TỐI THƯỢNG (Single Source of Truth)
│
├── index.html                  # Phân hệ 0: Cổng Dịch Vụ & Đăng nhập Hệ Thống (Hub)
├── lich_tuan.html              # Phân hệ 1: Đăng ký lịch công tác tuần & Xuất Word NĐ 30
├── it_helpdesk.html            # Phân hệ 2: IT Helpdesk tiếp nhận sự cố & Dán ảnh màn hình
├── giao_viec.html              # Phân hệ 3: Lãnh đạo giao việc & Bảng theo dõi tiến độ
├── bao_cao_to.html             # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ & KPI
│
├── css/                        # Bảng định kiểu tập trung (CSS tĩnh thuần, NO CDN)
│   ├── variables.css           # Design Tokens, bảng màu 60-30-10 toàn hệ thống
│   ├── base.css                # App Shell chuẩn, Reset, Utilities Bootstrap-like, Layout
│   ├── hub.css                 # Giao diện Phân hệ 0 (Trang chủ & Đăng nhập)
│   ├── lich_tuan.css           # Giao diện Phân hệ 1
│   ├── it_helpdesk.css         # Giao diện Phân hệ 2
│   ├── giao_viec.css           # Giao diện Phân hệ 3
│   ├── bao_cao_to.css          # Giao diện Phân hệ 4
│   └── flatpickr.min.css       # Thư viện chọn ngày tháng offline
│
├── js/                         # JavaScript thuần (Vanilla JS ES6+ Modular)
│   ├── auth.js                 # Module bảo mật: Route Guard, quản lý session family_user
│   ├── layout.js               # Header Topbar 60px tinh gọn, User Dropdown, Footer
│   ├── app.js                  # Logic nghiệp vụ phân hệ Lịch tuần
│   ├── flatpickr.min.js        # Thư viện Datepicker offline
│   └── test_suite.js           # Bộ kiểm thử tự động
│
├── backend/                    # Mã nguồn máy chủ Google Apps Script
│   └── google_apps_script.js   # API Gateway xử lý 5 Sheet, Auth, Drive upload, CRUD
│
├── assets/                     # Tài nguyên tĩnh duy nhất (Single Source of Truth)
│   ├── icons/                  # Bộ nhận diện Pikachu & VPĐK (.ico)
│   ├── images/                 # Ảnh xem trước (preview)
│   ├── templates/              # Biểu mẫu hành chính gốc & file Word mẫu
│   └── installer/              # Bộ cài đặt phím tắt Desktop 1-Click (.bat, .zip)
│
├── templates/                  # Khung mẫu phân hệ chuẩn phục vụ mở rộng app sau này
│   └── base_app_template.html  # Khung trang mẫu tích hợp sẵn Header, Footer, Route Guard
│
├── docs/                       # Toàn bộ tài liệu hỗ trợ kỹ thuật (Tham khảo nghiệp vụ)
│   ├── HANDOFF.md              # Nhật ký bàn giao kỹ thuật & tiến trình dự án
│   ├── HUONG_DAN_TRIEN_KHAI.md # Hướng dẫn triển khai Google Sheets & Apps Script
│   ├── BAO_CAO_AN_NINH.md      # Báo cáo đánh giá an ninh bảo mật và lỗ hổng đã fix
│   ├── SPEC_WORKFLOW_TESTING.md# Đặc tả kịch bản test luồng phục vụ model khác nếu cần
│   └── task.md                 # Bảng theo dõi tiến độ công việc chi tiết
│
└── README.md                   # Trang bìa giới thiệu tổng quan hệ thống
```

---

## 4. SECURITY & DATA PRIVACY (BẢO VỆ DỮ LIỆU CÁ NHÂN & AN TOÀN)

1. **Tuyệt đối KHÔNG hiển thị số CCCD của cán bộ (Strict PII Protection):**
   - Không hiển thị số CCCD trên bất kỳ giao diện người dùng (UI) nào.
   - Thẻ xác thực cán bộ (như ở IT Helpdesk) chỉ hiển thị: Họ và tên, Phòng ban, Số điện thoại hoặc Username.
   - Không lưu trữ `cccd` trong `sessionStorage.getItem("family_user")`.
   - Endpoint backend (`getUsers`, `login`) không trả trường `cccd` về cho client.
   - Không fallback gán số CCCD vào ô Số điện thoại.

2. **Zero-Trust Route Guard (Kiểm soát truy cập phân hệ):**
   - Mọi phân hệ con (`lich_tuan.html`, `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`) **bắt buộc phải có đoạn mã kiểm tra session ngay đầu thẻ `<head>`**:
     ```html
     <script src="js/auth.js"></script>
     <script>FamilyAuth.requireAuth();</script>
     ```
   - Chặn 100% người ngoài hoặc cửa sổ ẩn danh vào thẳng trang con khi chưa đăng nhập.

3. **Quy chuẩn phiên làm việc duy nhất (`family_user`):**
   - Thống nhất một key duy nhất: `sessionStorage.getItem("family_user")`.
   - Đăng xuất dọn sạch session bằng: `FamilyAuth.logout()` hoặc `FamilyLayout.logout()`.

4. **Phương thức gửi Auth an toàn:**
   - Đăng nhập chỉ gửi bằng `POST` trong Request Body. Tuyệt đối không nối mật khẩu vào URL query string GET (`?password=...`).

5. **Chống XSS & Formula Injection:**
   - Mọi biến dữ liệu người dùng đưa vào `innerHTML` phải bọc qua `FamilyAuth.escapeHtml(str)` hoặc hàm `escapeHtml()`.
   - Trên Apps Script backend, chuỗi bắt đầu bằng `=`, `+`, `-`, `@` phải thêm dấu `'` ở đầu (`sanitizeForSheet`).

6. **Bảo toàn Master Data & Phân quyền dung sai cao:**
   - Dữ liệu trả về từ server lưu vào mảng bất biến (`rawServerTickets` / `rawServerData`). Mọi thao tác lọc, tìm kiếm chỉ thực hiện trên mảng hiển thị (`currentTickets`).
   - Nhận diện Quản trị viên IT (`quandtm` / `0973807027` / `quan.vpdk@gmail.com`) kiểm tra đa trường, không phụ thuộc duy nhất vào chữ `admin` trên sheet.

---

## 5. FRONTEND BEST PRACTICES CHO PURE VANILLA WEB

1. **2-Tab Layout thống nhất (như Lịch tuần & IT Helpdesk):**
   - **Tab 1:** Hiển thị Bảng theo dõi / Danh sách rộng 100% màn hình ngay khi tải trang (`#listSection`).
   - **Tab 2:** Form nhập liệu / đăng ký mới ở dạng thẻ card trung tâm (`max-width: 880px; margin: 0 auto; display: none;`).
   - Sau khi gửi form thành công, hệ thống hiển thị thông báo và **tự động chuyển ngay về Tab 1 xem bảng** để cán bộ quan sát mục vừa tạo.

2. **Dán ảnh màn hình & Nén Canvas (<kbd>Ctrl + V</kbd>):**
   - Hỗ trợ dán ảnh trực tiếp từ bộ nhớ tạm Clipboard.
   - Sử dụng HTML5 Canvas nén ảnh dạng JPEG 0.75 xuống dưới `250KB` (kích thước tối đa 1280px) trước khi đẩy lên Google Drive.

3. **Event Delegation & Debounce:**
   - Các danh sách dữ liệu động gán sự kiện trên container cha, tránh gán hàng trăm event listener riêng lẻ.
   - Mọi ô tìm kiếm, lọc dữ liệu phải có debounce **300ms** để giao diện mượt mà, không giật lag.

4. **Hiệu năng Render & In ấn công vụ:**
   - Thêm `if (document.hidden) return;` vào các hàm `setInterval` để trình duyệt nghỉ ngơi khi tab ẩn dưới nền.
   - Hỗ trợ `@media print` A4 chuẩn Nghị định 30/2020/NĐ-CP (ẩn Topbar/nút, font Times New Roman 13pt).

---

## 6. PRE-FLIGHT CHECKLIST (BẢNG KIỂM BẮT BUỘC TRƯỚC KHI BÀN GIAO)

| STT | Tiêu chí kiểm tra | Tiêu chuẩn bắt buộc |
|:---:|:---|:---|
| 1 | **Route Guard** | File HTML con có `<script src="js/auth.js"></script><script>FamilyAuth.requireAuth();</script>` trong `<head>`. |
| 2 | **Session chuẩn** | Đọc ghi session thông qua `family_user`, không dùng key rác. |
| 3 | **Bảo mật PII** | 0 visible CCCD trên UI, không gửi CCCD trong payload hay URL. |
| 4 | **Bố cục 1280px** | `<main class="main-content app-container max-w-7xl ...">`. |
| 5 | **Màu sắc 60-30-10**| Dùng biến CSS từ `css/variables.css`, không thêm mã HEX tùy tiện. |
| 6 | **Chống XSS** | Mọi biến động chèn vào DOM đều lọc qua `escapeHtml()`. |
| 7 | **Bảo toàn dữ liệu**| Không dùng `filter()` ghi đè trực tiếp làm mất mảng nguồn server. |
| 8 | **Thẻ HTML hợp lệ** | Thẻ đóng/mở cân bằng 100%, không sinh lỗi DOM tree. |
| 9 | **Kỷ luật Git** | **TUYỆT ĐỐI KHÔNG tự ý chạy `git push`** nếu chưa có lệnh từ người dùng. |
