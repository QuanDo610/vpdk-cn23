# CỔNG DỊCH VỤ NỘI BỘ VPĐK - CHI NHÁNH SỐ 23
### ⭐ Hệ Thống Điều Hành & Dịch Vụ Cán Bộ "Family CN23" ⭐

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Online-brightgreen?style=flat-square&logo=github)](https://quando610.github.io/vpdk-cn23/index.html)
[![Architecture](https://img.shields.io/badge/Architecture-Pure%20Vanilla%20Web%20%2B%20Google%20Apps%20Script-blue?style=flat-square)](.agent/rules.md)
[![Design System](https://img.shields.io/badge/Design%20System-Royal%20Navy%20%26%20Gold-amber?style=flat-square)](.agent/rules.md)

Hệ thống web portal tích hợp các phân hệ nghiệp vụ nội bộ phục vụ toàn thể cán bộ, viên chức, người lao động thuộc **Văn Phòng Đăng Ký Đất Đai TP.HCM - Chi Nhánh Số 23**:
- 🌐 **Website trực tuyến:** [https://quando610.github.io/vpdk-cn23/index.html](https://quando610.github.io/vpdk-cn23/index.html)
- 🖥️ **Bộ cài đặt Desktop 1-Click:** [Family_CN23_Desktop.zip](file:///Users/admin/Desktop/FAMILY_CN23/Family_CN23_Desktop.zip) (Biểu tượng Pikachu Kính Vuông nổi bật)

---

## 🏛️ Danh Sách Phân Hệ Hoạt Động

| STT | Phân Hệ Nghiệp Vụ | Đường Dẫn | Trạng Thái | Mô Tả |
|:---:|---|---|:---:|---|
| **0** | **Cổng Dịch Vụ & Đăng Nhập Hệ Thống** | [`index.html`](file:///Users/admin/Desktop/FAMILY_CN23/index.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Hub trung tâm xác thực tài khoản, điều hướng 4 phân hệ |
| **1** | **Đăng Ký Lịch Công Tác Tuần** | [`lich_tuan.html`](file:///Users/admin/Desktop/FAMILY_CN23/lich_tuan.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Đăng ký họp, tiếp dân; xuất Word chuẩn **Nghị định 30/2020** |
| **2** | **IT Helpdesk & Báo Sự Cố Máy Tính** | [`it_helpdesk.html`](file:///Users/admin/Desktop/FAMILY_CN23/it_helpdesk.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Tiếp nhận hỏng hóc PC/mạng, dán ảnh `Ctrl+V`, Live Monitoring |
| **3** | **Lãnh Đạo Giao Việc & Tiến Độ** | [`giao_viec.html`](file:///Users/admin/Desktop/FAMILY_CN23/giao_viec.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Lãnh đạo giao việc 82 cán bộ, đôn đốc tiến độ, in phiếu A4 |
| **4** | **Báo Cáo Số Liệu Thực Hiện Cấp Tổ**| [`bao_cao_to.html`](file:///Users/admin/Desktop/FAMILY_CN23/bao_cao_to.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Báo cáo 8 nhóm chỉ tiêu, tự tính KPI, xuất Excel & in A4 |

---

## 📁 Cấu Trúc Thư Mục Tiêu Chuẩn

```text
FAMILY_CN23/
│
├── .agent/
│   └── rules.md                # Quy chuẩn kỹ thuật & nguyên tắc sinh mã cho AI Agent
│
├── index.html                  # Cổng Dịch Vụ Nội Bộ (Hub trung tâm & Đăng nhập)
├── lich_tuan.html              # Phân hệ 1: Đăng ký lịch tuần & Xuất Word NĐ 30
├── it_helpdesk.html            # Phân hệ 2: IT Helpdesk tiếp nhận sự cố máy tính
├── giao_viec.html              # Phân hệ 3: Lãnh đạo giao việc & Bảng tiến độ
├── bao_cao_to.html             # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ & KPI
│
├── css/                        # Bảng định kiểu tập trung theo phân hệ (No CDN)
│   ├── variables.css           # Design Tokens, bảng màu 60-30-10 công vụ
│   ├── base.css                # Khung App Shell, Reset, Utilities, Layout
│   ├── hub.css                 # Định kiểu Phân hệ 0
│   ├── lich_tuan.css           # Định kiểu Phân hệ 1
│   ├── it_helpdesk.css         # Định kiểu Phân hệ 2
│   ├── giao_viec.css           # Định kiểu Phân hệ 3
│   ├── bao_cao_to.css          # Định kiểu Phân hệ 4
│   └── flatpickr.min.css       # Thư viện chọn ngày tháng offline
│
├── js/                         # JavaScript thuần (Vanilla JS ES6+ Modular)
│   ├── layout.js               # Quản lý Topbar 62px tinh gọn, User Dropdown, Sticky Footer
│   ├── app.js                  # Logic phân hệ Lịch tuần
│   ├── flatpickr.min.js        # Thư viện Datepicker
│   └── test_suite.js           # Bộ kiểm thử tự động
│
├── backend/                    # Mã nguồn máy chủ Google Apps Script
│   └── google_apps_script.js   # API Gateway xử lý 5 Sheet, Auth, Drive upload
│
├── templates/                  # Khung mẫu phân hệ chuẩn
│   └── base_app_template.html  # File HTML mẫu chuẩn tái sử dụng cho module mới
│
├── assets/                     # Tài nguyên hình ảnh, biểu tượng & bộ cài (Nguồn duy nhất)
│   ├── icons/                  # Bộ nhận diện Pikachu & VPĐK (.ico)
│   ├── images/                 # Ảnh xem trước (preview)
│   ├── installer/              # Bộ cài đặt phím tắt Desktop 1-Click (Cai_Dat_Family_CN23.bat)
│   └── templates/              # Biểu mẫu hành chính gốc & file mẫu Word
│
├── docs/                       # Toàn bộ tài liệu quy chuẩn kỹ thuật & vận hành (.md)
│   ├── QUY_CHUAN_MA_NGUON.md   # Tiêu chuẩn viết mã nguồn & Best Practices (HTML, CSS, JS, MD)
│   ├── QUY_TRINH_SDLC.md       # Quy trình phát triển phần mềm chuẩn 5 bước & Lộ trình task
│   ├── HUONG_DAN_TRIEN_KHAI.md # Hướng dẫn cấu hình Google Sheets & kế thừa Base Layout
│   ├── BAO_CAO_AN_NINH.md      # Báo cáo đánh giá an toàn thông tin & hiệu suất
│   ├── HANDOFF.md              # Bàn giao kỹ thuật & nhật ký triển khai qua các phiên
│   └── task.md                 # Quản lý danh mục công việc & checklist tiến độ
│
├── pikachu_badge.ico           # Icon phục vụ đường link tải trực tiếp từ GitHub
├── Family_CN23_Desktop.zip     # Gói cài đặt Desktop phục vụ link tải trực tiếp từ GitHub
└── README.md                   # Trang bìa hướng dẫn tổng quan (File này)
```

---

## 📚 Bộ Tài Liệu Quy Chuẩn Nội Bộ (Documentation)

Chi tiết về tiêu chuẩn kỹ thuật, thiết kế và hướng dẫn triển khai:
- 🤖 [`.agent/rules.md`](file:///Users/admin/Desktop/FAMILY_CN23/.agent/rules.md): **Quy chuẩn DUY NHẤT & TỐI THƯỢNG (SSOT)** cho quy trình phát triển Agile Frontend, an toàn thông tin và nguyên tắc sinh mã.
- 📐 [`docs/QUY_CHUAN_MA_NGUON.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/QUY_CHUAN_MA_NGUON.md): Cẩm nang tham chiếu viết mã nguồn chi tiết (HTML, CSS, JS, Markdown).
- 📘 [`docs/QUY_TRINH_SDLC.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/QUY_TRINH_SDLC.md): Quy trình phát triển linh hoạt (Agile Frontend) & Kế hoạch bảo mật - hiệu năng.
- 🧪 [`docs/SPEC_WORKFLOW_TESTING.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/SPEC_WORKFLOW_TESTING.md): Đặc tả kịch bản test luồng nghiệp vụ phục vụ bàn giao sang model khác hoặc test runner tự động.
- 🛠️ [`docs/HUONG_DAN_TRIEN_KHAI.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/HUONG_DAN_TRIEN_KHAI.md): Hướng dẫn cấu hình Google Sheet, Apps Script và tích hợp Base Layout.
- 🛡️ [`docs/BAO_CAO_AN_NINH.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/BAO_CAO_AN_NINH.md): Đánh giá an toàn thông tin, rà soát lỗ hổng và giải pháp khắc phục.
- 📝 [`docs/HANDOFF.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/HANDOFF.md): Nhật ký bàn giao kỹ thuật chi tiết qua các phiên làm việc.
- 📋 [`docs/task.md`](file:///Users/admin/Desktop/FAMILY_CN23/docs/task.md): Bảng theo dõi tiến độ các hạng mục đã hoàn thành và đang thực hiện.
