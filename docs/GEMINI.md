# GEMINI INSTRUCTIONS - DỰ ÁN FAMILY CN23 (A_THANG)

> **Phạm vi áp dụng:** Tài liệu này là kim chỉ nam tối cao cho việc phát triển, nâng cấp và bảo trì toàn bộ hệ thống Web Portal **Family CN23** thuộc thư mục `A_THANG/`.

---

## 1. Tổng Quan Hệ Thống
Hệ thống **Family CN23** (Cổng Dịch Vụ Nội Bộ Chi Nhánh Số 23 - Văn Phòng Đăng Ký Đất Đai TP.HCM) là nền tảng web ứng dụng nội bộ phục vụ toàn thể cán bộ, công chức, viên chức và người lao động của Chi nhánh.

Hệ thống hoạt động theo mô hình **Serverless Static Web + Google Apps Script API**:
- **Frontend:** Hoạt động hoàn toàn trên trình duyệt tĩnh (GitHub Pages / Cloudflare Pages / Local file).
- **Backend & Database:** Google Apps Script Web App kết nối trực tiếp với 1 Google Spreadsheet duy nhất (`BINHDUONG23`) và Google Drive để lưu trữ hình ảnh/chứng từ.

---

## 2. Giới Hạn Phạm Vi Làm Việc (Scope Boundary)
1. **Phạm vi tuyệt đối:** Mọi thao tác lập trình, cấu trúc thư mục, chỉnh sửa mã nguồn, bổ sung file tài liệu CHỈ ĐƯỢC PHÉP thực hiện bên trong thư mục `A_THANG/`.
2. **Không xâm lấn Workspace gốc:** Tuyệt đối không chỉnh sửa các file framework ở thư mục cha (`/Users/admin/Desktop/BINHDUONG/{Gemini.md, Agent.md, Skill.md, Rule.md, documents/, OUTPUT/}`).
3. **Đồng bộ GitHub:** Thư mục `A_THANG/` là mã nguồn cho repository `https://github.com/QuanDo610/vpdk-cn23.git` (nhánh `main`) phục vụ trực tiếp GitHub Pages tại `https://quando610.github.io/vpdk-cn23/index.html`.

---

## 3. Kiến Trúc Thư Mục Tiêu Chuẩn

```text
A_THANG/
│
├── index.html                  # Cổng Dịch Vụ Nội Bộ (Hub Điều Hướng & Đăng Nhập CCCD)
├── lich_tuan.html              # Phân hệ 1: Đăng ký lịch công tác tuần & xuất Word NĐ30
├── it_helpdesk.html            # Phân hệ 2: IT Helpdesk tiếp nhận & chẩn đoán sự cố
├── giao_viec.html              # Phân hệ 3: Lãnh đạo giao việc & Bảng theo dõi tiến độ
├── bao_cao_to.html             # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ & KPI
│
├── css/                        # Định kiểu tập trung (Design System)
│   ├── style.css               # Bảng màu, typography, thẻ card, header, responsive
│   └── flatpickr.min.css       # Thư viện chọn ngày tháng
│
├── js/                         # JavaScript thuần (Vanilla JS ES6+)
│   ├── app.js                  # Xử lý Lịch tuần & xuất văn bản Word chuẩn NĐ30
│   ├── flatpickr.min.js        # Datepicker chọn ngày tháng
│   └── test_suite.js           # Bộ công cụ kiểm thử tự động
│
├── backend/                    # Mã nguồn tích hợp máy chủ Google
│   └── google_apps_script.js   # API Gateway xử lý Auth, Sheet CRUD, Drive upload
│
├── assets/                     # Tài nguyên hình ảnh, biểu tượng, biểu mẫu
│   ├── icons/                  # Bộ nhận diện Pikachu & VPĐK (.ico)
│   ├── images/                 # Ảnh minh họa, preview
│   ├── installer/              # Bộ cài đặt phím tắt Desktop 1-Click (.bat, .zip)
│   └── templates/              # File Word mẫu, tài liệu biểu mẫu gốc
│
├── docs/                       # Tài liệu đặc tả kỹ thuật & hướng dẫn
│   ├── GEMINI.md               # Quy chuẩn kiến trúc & quy trình làm việc (File này)
│   ├── AGENT.md                # Vai trò & nguyên tắc làm việc của AI Agent
│   ├── SKILL.md                # Kỹ năng lập trình Vanilla HTML/CSS/JS & Bảng mã màu
│   ├── RULE.md                 # Bộ quy tắc cốt lõi, bảo mật & responsive desktop
│   ├── README.md               # Tài liệu chi tiết tính năng toàn hệ thống
│   ├── HANDOFF.md              # Bàn giao kỹ thuật & nhật ký triển khai
│   ├── HD_TRIEN_KHAI.md        # Hướng dẫn nâng cấp Google Sheet & Apps Script
│   ├── req.md                  # Yêu cầu nghiệp vụ
│   └── task.md                 # Quản lý danh mục công việc
│
├── pikachu_badge.ico           # Icon dự phòng cho URL tải trực tiếp từ GitHub
├── Family_CN23_Desktop.zip     # Gói cài đặt Desktop dự phòng cho URL tải trực tiếp
└── README.md                   # Trang bìa GitHub tổng quan điều hướng vào docs/
```

---

## 4. Nguyên Tắc Lập Trình & Công Nghệ
1. **Frontend Thuần (Pure Vanilla):**
   - HTML5 ngữ nghĩa (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - CSS3 hiện đại (CSS Custom Properties, Flexbox, CSS Grid).
   - JavaScript thuần ES6+ (Async/Await, Fetch API, DOM Manipulation).
   - **Tuyệt đối KHÔNG** sử dụng Node.js build step, Webpack, Vite hay các framework nặng (React, Angular, Vue) đòi hỏi môi trường npm để chạy. Mọi file HTML phải mở được trực tiếp qua trình duyệt hoặc static server.
2. **CDN Được Phép Sử Dụng:**
   - Tailwind CSS CDN (`https://cdn.tailwindcss.com`) phục vụ tiện ích layout nhanh.
   - Font Awesome 6.5+ Free CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/...`).
   - Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`).
   - Thư viện tài liệu: `docx@8.5.0` (tạo Word), `FileSaver.js`, `xlsx.full.min.js` (SheetJS).
3. **Đồng Bộ Nhận Diện Thương Hiệu:**
   - Tất cả các trang bắt buộc dùng chung Header chuẩn, Bảng màu Hoàng Gia (Royal Navy `#1e3a8a` & Gold `#f59e0b`), Badge định danh người dùng và luồng xác thực phiên làm việc bằng CCCD.
4. **Desktop-First & Hoàn Hảo Trên Màn Hình Cơ Quan:**
   - Ưu tiên tối đa độ hiển thị trên màn hình máy tính bàn cơ quan (1920x1080 và 1366x768).
   - Bảng biểu nhiều cột không được tràn chữ làm bể layout: dùng rút gọn `...` (text-overflow: ellipsis) và popup modal xem chi tiết.
   - Đồng thời vẫn đảm bảo hiển thị mượt mà trên iPad và điện thoại thông minh.

---

## 5. Quy Trình Làm Việc Tiêu Chuẩn (Step-by-Step)
1. **Khảo sát & Lập kế hoạch:** Đọc kỹ yêu cầu người dùng, phân tích cấu trúc dữ liệu và đối chiếu với mẫu nghiệp vụ.
2. **Thiết kế & Phê duyệt:** Thống nhất cấu trúc bảng Google Sheet, API payload và giao diện người dùng trước khi code.
3. **Hiện thực hóa (Implementation):** Lập trình theo chuẩn Vanilla JS, viết code sạch, chú thích tiếng Việt rõ ràng.
4. **Kiểm thử cục bộ & Responsive:** Chạy thử nghiệm, kiểm tra gửi/nhận dữ liệu thật, kiểm tra giao diện trên nhiều độ phân giải.
5. **Đồng bộ Git & Báo cáo:** Đẩy code lên repo GitHub, kiểm tra bản build GitHub Pages, bàn giao và viết hướng dẫn chi tiết.
