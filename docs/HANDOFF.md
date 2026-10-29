# TÀI LIỆU BÀN GIAO CÔNG VIỆC DỰ ÁN "FAMILY CN23"
> **Hệ thống Cổng Dịch Vụ Nội Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23**  
> *Ngày cập nhật: 29/10/2026 | Phiên bản hoàn thiện: v3.5-Full Subsystems*

---

## 1. THÔNG TIN HỆ THỐNG & ĐỊA CHỈ TRUY CẬP

| Hạng mục | Đường dẫn / Thông số |
| :--- | :--- |
| **Website Cổng Dịch Vụ Hub** | [https://quando610.github.io/vpdk-cn23/index.html](https://quando610.github.io/vpdk-cn23/index.html) |
| **Phân hệ 1: Lịch Công Tác Tuần** | [https://quando610.github.io/vpdk-cn23/lich_tuan.html](https://quando610.github.io/vpdk-cn23/lich_tuan.html) |
| **Phân hệ 2: IT Helpdesk Máy Tính** | [https://quando610.github.io/vpdk-cn23/it_helpdesk.html](https://quando610.github.io/vpdk-cn23/it_helpdesk.html) |
| **Phân hệ 3: Lãnh Đạo Giao Việc** | [https://quando610.github.io/vpdk-cn23/giao_viec.html](https://quando610.github.io/vpdk-cn23/giao_viec.html) |
| **Phân hệ 4: Báo Cáo Số Liệu Tổ & KPI**| [https://quando610.github.io/vpdk-cn23/bao_cao_to.html](https://quando610.github.io/vpdk-cn23/bao_cao_to.html) |
| **Kho mã nguồn GitHub** | [`https://github.com/QuanDo610/vpdk-cn23.git`](https://github.com/QuanDo610/vpdk-cn23.git) *(Branch `main`)* |
| **Google Apps Script API** | `https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec` |
| **Google Spreadsheet Backend** | Trang tính `BINHDUONG23`: `TaiKhoan`, `LichTuan`, `Tickets`, `GiaoViec`, `BaoCaoSoLieu` |

---

## 2. TỔNG HỢP CÁC CÔNG VIỆC ĐÃ HOÀN TẤT (PHIÊN BẢN v3.5)

### 2.1. Hoàn Thành Phân Hệ 3: Lãnh Đạo Giao Việc & Bảng Tiến Độ (`giao_viec.html`)
- **Nghiệp vụ cốt lõi:**
  1. **Form Giao việc & Chỉ đạo:**
     - Tự động nhận diện Lãnh đạo giao việc theo tài khoản đăng nhập (hoặc chọn từ danh sách Ban Giám đốc & Lãnh đạo các tổ).
     - Bộ lọc theo Tổ chuyên môn và danh sách **82 cán bộ viên chức chính thức** thuộc 5 tổ, hiển thị chức vụ và ghi chú nhân sự thời gian thực.
     - Tiêu đề công việc, Độ khẩn (🟢 Bình thường / 🟠 Khẩn / 🔴 Hỏa tốc có hiệu ứng nhấp nháy), Hạn chót hoàn thành (Deadline).
     - Văn bản căn cứ / Mã VBDLIS, tệp hồ sơ đính kèm, ý kiến chỉ đạo chi tiết của Lãnh đạo.
  2. **5 Thẻ KPI Giám Sát Tiến Độ:**
     - Tổng công việc, Đang thực hiện, Quá hạn Deadline (cảnh báo đỏ nhấp nháy), Đã hoàn thành, Tỷ lệ hoàn thành (%).
  3. **Bảng Desktop-First Theo Dõi Tiến Độ:**
     - Thiết kế theo chuẩn `SKILL.md` chống rớt chữ: cố định độ rộng cột, văn bản dài tự động rút gọn `...`, rê chuột xem tooltip hoặc click vào bất kỳ dòng nào để mở **Modal Popup xem toàn văn chi tiết**.
     - Bộ lọc trạng thái (Đang làm, Hoàn thành, Quá hạn), bộ lọc tổ, và ô tìm kiếm tức thì.
     - Nút đánh dấu Hoàn thành ✓ / Mở lại ↩, In phiếu giao việc chuẩn A4 có quốc hiệu và chữ ký, Xuất bảng danh sách ra Excel CSV.
     - Tích hợp lưu trữ kép: `localStorage` offline phản hồi tức thì + tự động đồng bộ ngầm lên Google Sheet qua API (`createTask`, `updateTaskStatus`, `deleteTask`, `getTasks`).

### 2.2. Hoàn Thành Phân Hệ 4: Báo Cáo Số Liệu Thực Hiện Cấp Tổ & KPI (`bao_cao_to.html`)
- **Nghiệp vụ cốt lõi:**
  1. **Biểu mẫu thu thập 8 nhóm chỉ tiêu chuyên môn:**
     - Thông tin chung: Tổ chuyên môn, Loại kỳ (Tuần / Tháng / Quý / Đột xuất), Tên kỳ, Ngày chốt số liệu.
     - Nhóm 1: Tiếp nhận hồ sơ (Trực tiếp, Trực tuyến) -> Tự động tính Tổng tiếp nhận & Tỷ lệ nộp trực tuyến (%).
     - Nhóm 2: Kết quả giải quyết (Trước hạn, Đúng hạn, Quá hạn, Thư xin lỗi) -> Tự động tính Tổng giải quyết & Tỷ lệ đúng hạn (%).
     - Nhóm 3: Hồ sơ đang xử lý (Tồn trong hạn, Tồn quá hạn) -> Tự động tính Tổng tồn đọng.
     - Nhóm 4: Nghĩa vụ tài chính & Thanh toán trực tuyến -> Tự động tính Tỷ lệ thanh toán trực tuyến (%) & Tổng số tiền thu.
     - Nhóm 5: Công tác số hóa hồ sơ (Đầu vào, Đầu ra, Tái sử dụng, Bản sao điện tử).
     - Nhóm 6: Vận hành hệ thống VBDLIS & CSDL dân cư.
     - Nhóm 7 & 8: Khó khăn vướng mắc & Đề xuất kiến nghị với Ban Giám đốc.
  2. **4 Thẻ KPI Giám Sát Chỉ Tiêu Cấp Trên:**
     - Tổng hồ sơ tiếp nhận.
     - Tỷ lệ trực tuyến (Xanh nếu đạt ≥ 50%, Vàng nếu < 50%).
     - Tỷ lệ đúng hạn (Xanh nếu đạt ≥ 98%, Đỏ cảnh báo nếu < 98%).
     - Tỷ lệ thanh toán trực tuyến (Xanh nếu đạt ≥ 40%, Vàng nếu < 40%).
  3. **Bảng Lịch Sử & Thống Kê Kỳ Báo Cáo:**
     - Lọc theo tổ, xem chi tiết modal từng bản ghi, in báo cáo A4 trang trọng có đầy đủ bảng số liệu 5 phần và chữ ký Tổ trưởng / Người lập biểu.
     - Xuất toàn bộ lịch sử ra tệp Excel CSV.
     - Tích hợp lưu trữ kép `localStorage` + API Google Sheet (`createPerformanceReport`, `deletePerformanceRecord`, `getPerformanceReports`).

### 2.3. Nâng Cấp Trang Chủ Hub (`index.html`) Thành Lưới 4 Phân Hệ
- Chuyển đổi lưới 2 card cũ thành **Lưới 4 Card Phân Hệ Nghiệp Vụ Hoàn Chỉnh**:
  1. Đăng ký Lịch công tác tuần (Chuẩn NĐ 30/2020).
  2. IT Helpdesk & Báo sự cố máy tính (Live Monitoring).
  3. Lãnh đạo Giao việc & Bảng tiến độ (Đôn đốc nhiệm vụ).
  4. Báo cáo Số liệu thực hiện cấp Tổ & KPI (8 nhóm chỉ tiêu).
- Thiết kế màu sắc riêng biệt cho từng thẻ nhưng tuân thủ 100% Design System:
  - Thẻ Lịch tuần: Xanh lá Emerald
  - Thẻ IT Helpdesk: Xanh dương Royal
  - Thẻ Giao việc: Vàng hổ phách Amber Gold
  - Thẻ Báo cáo tổ: Xanh mòng két Teal

### 2.4. Đồng Bộ Thanh Header Điều Hướng Toàn Hệ Thống
- Cả 4 trang web ([index.html](file:///Users/admin/Desktop/BINHDUONG/A_THANG/index.html), [lich_tuan.html](file:///Users/admin/Desktop/BINHDUONG/A_THANG/lich_tuan.html), [it_helpdesk.html](file:///Users/admin/Desktop/BINHDUONG/A_THANG/it_helpdesk.html), [giao_viec.html](file:///Users/admin/Desktop/BINHDUONG/A_THANG/giao_viec.html), [bao_cao_to.html](file:///Users/admin/Desktop/BINHDUONG/A_THANG/bao_cao_to.html)) đều được tích hợp thanh điều hướng chéo giúp cán bộ chuyển đổi qua lại giữa bất kỳ phân hệ nào chỉ với 1 cú click mà không cần quay lại trang đăng nhập.

### 2.5. Nâng Cấp Backend Google Apps Script (`backend/google_apps_script.js`)
- Hỗ trợ toàn bộ 5 tab trên Google Sheet:
  - `TaiKhoan`: Xác thực CCCD & Mật khẩu
  - `LichTuan`: Đăng ký lịch tuần
  - `Tickets`: Sự cố tin học & lưu ảnh Drive
  - `GiaoViec`: Quản lý 14 trường thông tin giao việc
  - `BaoCaoSoLieu`: Quản lý 32 trường thông tin 8 nhóm chỉ tiêu
- Cập nhật menu `⭐ BINHDUONG23` với lệnh **1-Click cấu hình chuẩn toàn bộ 5 phân hệ**.

---

## 3. CẤU TRÚC THƯ MỤC HOÀN CHỈNH HIỆN TẠI

```text
A_THANG/
│
├── index.html                      # Cổng Dịch Vụ Nội Bộ Hub (Lưới 4 phân hệ)
├── lich_tuan.html                  # Phân hệ 1: Đăng ký lịch tuần & Xuất Word NĐ 30
├── it_helpdesk.html                # Phân hệ 2: IT Helpdesk tiếp nhận & chẩn đoán sự cố
├── giao_viec.html                  # Phân hệ 3: Lãnh đạo giao việc & Bảng tiến độ
├── bao_cao_to.html                 # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ & KPI
│
├── css/                            # Bảng định kiểu tập trung
│   ├── style.css                   # Design System chuẩn Family CN23
│   └── flatpickr.min.css           # Thư viện chọn ngày tháng
│
├── js/                             # JavaScript thuần (Vanilla JS ES6+)
│   ├── app.js                      # Logic phân hệ Lịch tuần
│   ├── flatpickr.min.js            # Thư viện Datepicker
│   └── test_suite.js               # Bộ kiểm thử tự động
│
├── backend/                        # Mã nguồn máy chủ Google Apps Script
│   └── google_apps_script.js       # API Gateway xử lý Auth, 5 Sheet Tabs, Drive upload
│
├── assets/                         # Toàn bộ tài nguyên tĩnh
│   ├── icons/                      # Bộ nhận diện Pikachu & VPĐK (.ico)
│   ├── images/                     # Ảnh xem trước (preview png)
│   ├── installer/                  # Bộ cài đặt phím tắt Desktop 1-Click (.bat, .zip)
│   └── templates/                  # Biểu mẫu gốc BM_bao_cao...html & Word mẫu
│
├── docs/                           # TẬP TRUNG TOÀN BỘ FILE TÀI LIỆU (.md)
│   ├── GEMINI.md                   # Kiến trúc hệ thống & nguyên tắc phát triển
│   ├── AGENT.md                    # Vai trò, tác phong & nguyên tắc bảo mật của AI
│   ├── SKILL.md                    # Kỹ năng Vanilla Web, CDN & Bảng mã màu chuẩn
│   ├── RULE.md                     # 7 nguyên tắc vàng cốt lõi (Desktop-first, Zero leak)
│   ├── README.md                   # Thuyết minh chi tiết tính năng toàn hệ thống
│   ├── HANDOFF.md                  # Nhật ký bàn giao kỹ thuật này
│   ├── HD_TRIEN_KHAI.md            # Hướng dẫn nâng cấp 5 tab trên Google Sheet
│   ├── req.md                      # Yêu cầu nghiệp vụ
│   └── task.md                     # Quản lý danh mục nhiệm vụ
│
├── pikachu_badge.ico               # Giữ tại root phục vụ URL tải trực tiếp từ GitHub
├── Family_CN23_Desktop.zip         # Giữ tại root phục vụ URL tải trực tiếp từ GitHub
└── README.md                       # Trang bìa GitHub tổng quan điều hướng vào docs/
```
