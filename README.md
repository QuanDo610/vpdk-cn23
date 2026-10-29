# CỔNG DỊCH VỤ NỘI BỘ VPĐK - CHI NHÁNH SỐ 23
### ⭐ Hệ Thống Điều Hành & Dịch Vụ Cán Bộ "Family CN23" ⭐

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Online-brightgreen?style=flat-square&logo=github)](https://quando610.github.io/vpdk-cn23/index.html)
[![Architecture](https://img.shields.io/badge/Architecture-Pure%20Vanilla%20Web%20%2B%20Google%20Apps%20Script-blue?style=flat-square)](docs/GEMINI.md)
[![Design System](https://img.shields.io/badge/Design%20System-Royal%20Navy%20%26%20Gold-amber?style=flat-square)](docs/SKILL.md)

Hệ thống web portal tích hợp các phân hệ nghiệp vụ nội bộ phục vụ toàn thể cán bộ, viên chức, người lao động thuộc **Văn Phòng Đăng Ký Đất Đai TP.HCM - Chi Nhánh Số 23**:
- 🌐 **Website trực tuyến:** [https://quando610.github.io/vpdk-cn23/index.html](https://quando610.github.io/vpdk-cn23/index.html)
- 🖥️ **Bộ cài đặt Desktop 1-Click:** [Family_CN23_Desktop.zip](file:///Users/admin/Desktop/BINHDUONG/A_THANG/Family_CN23_Desktop.zip) (Biểu tượng Pikachu Kính Vuông nổi bật)

---

## 🏛️ Danh Sách Phân Hệ Hoạt Động

| STT | Phân Hệ Nghiệp Vụ | Đường Dẫn | Trạng Thái | Mô Tả |
|:---:|---|---|:---:|---|
| **0** | **Cổng Dịch Vụ & Đăng Nhập CCCD** | [`index.html`](file:///Users/admin/Desktop/BINHDUONG/A_THANG/index.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Hub trung tâm xác thực CCCD, điều hướng 4 phân hệ |
| **1** | **Đăng Ký Lịch Công Tác Tuần** | [`lich_tuan.html`](file:///Users/admin/Desktop/BINHDUONG/A_THANG/lich_tuan.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Đăng ký họp, tiếp dân; xuất Word chuẩn **Nghị định 30/2020** |
| **2** | **IT Helpdesk & Báo Sự Cố Máy Tính** | [`it_helpdesk.html`](file:///Users/admin/Desktop/BINHDUONG/A_THANG/it_helpdesk.html) | ![Hoàn thành](https://img.shields.io/badge/-Hoàn%20thành-emerald) | Tiếp nhận hỏng hóc PC/mạng, dán ảnh `Ctrl+V`, Live Monitoring |
| **3** | **Lãnh Đạo Giao Việc & Tiến Độ** | `giao_viec.html` | ![Đang triển khai](https://img.shields.io/badge/-Đang%20triển%20khai-amber) | Lãnh đạo giao việc cán bộ, bảng theo dõi tiến độ công việc |
| **4** | **Báo Cáo Số Liệu Thực Hiện Cấp Tổ**| `bao_cao_to.html` | ![Đang triển khai](https://img.shields.io/badge/-Đang%20triển%20khai-amber) | Báo cáo 8 nhóm chỉ tiêu, theo dõi KPI & xuất Excel |

---

## 📁 Cấu Trúc Thư Mục Tiêu Chuẩn

```text
A_THANG/
│
├── index.html                  # Cổng Dịch Vụ Nội Bộ (Hub & Đăng nhập CCCD)
├── lich_tuan.html              # Phân hệ 1: Đăng ký lịch tuần & Xuất Word NĐ30
├── it_helpdesk.html            # Phân hệ 2: IT Helpdesk tiếp nhận sự cố
├── giao_viec.html              # Phân hệ 3: Lãnh đạo giao việc & Bảng tiến độ (sắp ra mắt)
├── bao_cao_to.html             # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ (sắp ra mắt)
│
├── css/                        # Bảng định kiểu tập trung
│   ├── style.css               # Design System chuẩn Family CN23
│   └── flatpickr.min.css       # Thư viện chọn ngày tháng
│
├── js/                         # JavaScript thuần (Vanilla JS ES6+)
│   ├── app.js                  # Logic phân hệ Lịch tuần
│   ├── flatpickr.min.js        # Thư viện Datepicker
│   └── test_suite.js           # Bộ kiểm thử tự động
│
├── backend/                    # Mã nguồn máy chủ Google Apps Script
│   └── google_apps_script.js   # API Gateway xử lý Auth, Sheet CRUD, Drive upload
│
├── assets/                     # Tài nguyên hình ảnh, biểu tượng & bộ cài
│   ├── icons/                  # Bộ nhận diện Pikachu & VPĐK (.ico)
│   ├── images/                 # Ảnh xem trước (preview)
│   ├── installer/              # Bộ cài đặt phím tắt Desktop 1-Click (.bat, .zip)
│   └── templates/              # Biểu mẫu hành chính gốc & file mẫu Word
│
├── docs/                       # Toàn bộ tài liệu quy chuẩn & kiến trúc (.md)
│   ├── GEMINI.md               # Kiến trúc hệ thống & nguyên tắc phát triển
│   ├── AGENT.md                # Vai trò & tiêu chuẩn thực thi của AI Agent
│   ├── SKILL.md                # Kỹ năng lập trình Vanilla HTML/CSS/JS & Bảng mã màu
│   ├── RULE.md                 # Bộ quy tắc cốt lõi, bảo mật & responsive desktop
│   ├── README.md               # Tài liệu thuyết minh tính năng chi tiết
│   ├── HANDOFF.md              # Bàn giao kỹ thuật & nhật ký triển khai
│   ├── HD_TRIEN_KHAI.md        # Hướng dẫn nâng cấp Google Sheet
│   ├── req.md                  # Yêu cầu nghiệp vụ
│   └── task.md                 # Quản lý danh mục công việc
│
├── pikachu_badge.ico           # Icon dự phòng cho đường link tải trực tiếp từ GitHub
├── Family_CN23_Desktop.zip     # Gói cài đặt Desktop dự phòng cho đường link tải trực tiếp
└── README.md                   # Trang bìa hướng dẫn tổng quan (File này)
```

---

## 📚 Bộ Tài Liệu Quy Chuẩn Nội Bộ (Documentation)

Chi tiết về tiêu chuẩn kỹ thuật, thiết kế và hướng dẫn triển khai:
- 📘 [docs/GEMINI.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/GEMINI.md): Kiến trúc dự án, cấu trúc thư mục, quy trình làm việc chuẩn.
- 🧑‍💻 [docs/AGENT.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/AGENT.md): Vai trò, định vị tác phong và nguyên tắc bảo mật của AI.
- 🎨 [docs/SKILL.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/SKILL.md): Bảng mã màu chuẩn (Design System Tokens) và danh mục CDN được phép sử dụng.
- ⚖️ [docs/RULE.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/RULE.md): 7 nguyên tắc vàng phát triển hệ thống (Bảo mật, Desktop-first, không build step).
- 🛠️ [docs/HD_TRIEN_KHAI.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/HD_TRIEN_KHAI.md): Hướng dẫn cấu hình Google Sheet và triển khai Google Apps Script.
- 📝 [docs/HANDOFF.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/HANDOFF.md): Nhật ký bàn giao kỹ thuật chi tiết qua các phiên làm việc.
