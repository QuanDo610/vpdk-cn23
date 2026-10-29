# TÀI LIỆU BÀN GIAO CÔNG VIỆC DỰ ÁN "FAMILY CN23"
> **Hệ thống Cổng Dịch Vụ Nội Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23**  
> *Ngày cập nhật: 29/10/2026 | Phiên bản hoàn thiện: v3.0-Modular Framework*

---

## 1. THÔNG TIN HỆ THỐNG & ĐỊA CHỈ TRUY CẬP

| Hạng mục | Đường dẫn / Thông số |
| :--- | :--- |
| **Website Cổng Dịch Vụ** | [https://quando610.github.io/vpdk-cn23/index.html](https://quando610.github.io/vpdk-cn23/index.html) |
| **Phân hệ IT Helpdesk** | [https://quando610.github.io/vpdk-cn23/it_helpdesk.html](https://quando610.github.io/vpdk-cn23/it_helpdesk.html) |
| **Phân hệ Lịch Tuần** | [https://quando610.github.io/vpdk-cn23/lich_tuan.html](https://quando610.github.io/vpdk-cn23/lich_tuan.html) |
| **Kho mã nguồn GitHub** | [`https://github.com/QuanDo610/vpdk-cn23.git`](https://github.com/QuanDo610/vpdk-cn23.git) *(Branch `main`)* |
| **Google Apps Script API** | `https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec` |
| **Google Spreadsheet Backend** | Trang tính `BINHDUONG23`: `TaiKhoan`, `LichTuan`, `Tickets` (sắp tới: `GiaoViec`, `BaoCaoSoLieu`) |

---

## 2. TỔNG HỢP CÁC CÔNG VIỆC VỪA HOÀN THÀNH (PHIÊN BẢN v3.0)

### 2.1. Tái Cấu Trúc Thư Mục Chuẩn Dự Án Web Chuyên Nghiệp
- Toàn bộ các file tài liệu `.md` rơi vãi đã được quy hoạch tập trung 100% vào thư mục `docs/`.
- Tách bạch rõ ràng các tài nguyên:
  - `css/`: Chứa file phong cách hệ thống `style.css` và `flatpickr.min.css`.
  - `js/`: Chứa mã logic nghiệp vụ `app.js`, thư viện `flatpickr.min.js`, `test_suite.js`.
  - `backend/`: Chứa file mã nguồn Google Apps Script `google_apps_script.js`.
  - `assets/`: Chia thành 4 thư mục con chuyên biệt `icons/`, `images/`, `installer/`, `templates/`.
- Cập nhật toàn bộ đường dẫn tham chiếu trong `index.html` và `lich_tuan.html` sang thư mục mới (`css/...`, `js/...`), đảm bảo trang web hoạt động hoàn hảo, không một liên kết chết (zero dead links).
- Duy trì các file dự phòng tại root (`pikachu_badge.ico`, `Family_CN23_Desktop.zip`, `README.md`) để bảo đảm các đường link tải trực tiếp trong file `.bat` và trình duyệt không bao giờ bị lỗi 404.

### 2.2. Xây Dựng Bộ Khung Quy Chuẩn Riêng Biệt Cho `A_THANG/`
Đã thiết lập bộ 4 tài liệu tiêu chuẩn kỹ thuật chuyên nghiệp:
1. [docs/GEMINI.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/GEMINI.md): Giới hạn phạm vi nghiêm ngặt chỉ trong `A_THANG/`, kiến trúc Vanilla Web tĩnh + Serverless Apps Script, quy trình làm việc 5 bước.
2. [docs/AGENT.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/AGENT.md): Định vị vai trò AI Kỹ sư Full-stack, bảo mật thông tin tuyệt đối (Zero sensitive data leak on Git), triết lý "Desktop-First" cho màn hình cơ quan.
3. [docs/SKILL.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/SKILL.md): Toàn bộ kỹ năng lập trình Vanilla HTML5/CSS3/JS, danh mục CDN được phê duyệt, mẫu component Header & Table và **Bảng mã màu nhận diện hệ thống (Design System Tokens)** để không bao giờ bị lạc quẻ CSS:
   - **Royal Navy:** `#1e3a8a` (Header), `#1e40af` (Primary Button), `#2563eb` (Focus), `#eff6ff` (Light tint).
   - **CN23 Gold / Amber:** `#f59e0b` (Viền Header 3px & Accent), `#d97706` (Hover), `#fef3c7` (Tint).
   - **Neutrals:** Slate-50 `#f8fafc` (Nền trang), White `#ffffff` (Card), Slate-200 `#e2e8f0` (Viền).
   - **Trạng thái:** Thành công `#16a34a` (`#dcfce7`), Đang xử lý `#ea580c` (`#ffedd5`), Quá hạn/Khẩn `#dc2626` (`#fee2e2`).
4. [docs/RULE.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/RULE.md): 7 nguyên tắc vàng phát triển hệ thống (Bảo mật, Desktop-first, không rớt dòng bảng biểu, rút gọn `...` kèm modal).

---

## 3. CẤU TRÚC THƯ MỤC CHUẨN HIỆN TẠI

```text
A_THANG/
│
├── index.html                  # Cổng Dịch Vụ Nội Bộ (Hub & Đăng nhập CCCD)
├── lich_tuan.html              # Phân hệ 1: Đăng ký lịch tuần & Xuất Word NĐ30
├── it_helpdesk.html            # Phân hệ 2: IT Helpdesk tiếp nhận sự cố
├── giao_viec.html              # Phân hệ 3: Lãnh đạo giao việc & Bảng tiến độ (bước tiếp theo)
├── bao_cao_to.html             # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ (bước tiếp theo)
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
│   ├── icons/                  # pikachu_badge.ico, pikachu.ico, vpdk23.ico, vpdk_pikachu.ico
│   ├── images/                 # pikachu_badge_preview.png, pikachu_preview.png, vpdk23_preview.png
│   ├── installer/              # Cai_Dat_Family_CN23.bat, Tao_Icon_Desktop_VPDK23.bat, Family_CN23_Desktop.zip, HUONG_DAN.txt
│   └── templates/              # file mẫu word lịch Tuần.docx, BM_bao_cao_so_lieu_thuc_hien_CN23.html
│
├── docs/                       # Toàn bộ tài liệu quy chuẩn & kiến trúc (.md)
│   ├── GEMINI.md               # Kiến trúc hệ thống & nguyên tắc phát triển
│   ├── AGENT.md                # Vai trò & tiêu chuẩn thực thi của AI Agent
│   ├── SKILL.md                # Kỹ năng lập trình Vanilla HTML/CSS/JS & Bảng mã màu
│   ├── RULE.md                 # Bộ quy tắc cốt lõi, bảo mật & responsive desktop
│   ├── README.md               # Tài liệu thuyết minh tính năng chi tiết
│   ├── HANDOFF.md              # Nhật ký bàn giao kỹ thuật này
│   ├── HD_TRIEN_KHAI.md        # Hướng dẫn nâng cấp Google Sheet
│   ├── req.md                  # Yêu cầu nghiệp vụ
│   └── task.md                 # Quản lý danh mục công việc
│
├── pikachu_badge.ico           # Biểu tượng dự phòng tải trực tiếp
├── Family_CN23_Desktop.zip     # Gói cài đặt dự phòng tải trực tiếp
└── README.md                   # Trang bìa hướng dẫn tổng quan
```

---

## 4. KẾ HOẠCH TRIỂN KHAI 2 ỨNG DỤNG TIẾP THEO (STEP-BY-STEP)

Từ biểu mẫu gốc [assets/templates/BM_bao_cao_so_lieu_thuc_hien_CN23.html](file:///Users/admin/Desktop/BINHDUONG/A_THANG/assets/templates/BM_bao_cao_so_lieu_thuc_hien_CN23.html), chúng ta sẽ lần lượt xây dựng 2 ứng dụng độc lập:

### Ứng Dụng 1: Lãnh Đạo Giao Việc & Chỉ Đạo Cán Bộ + Bảng Tiến Độ (`giao_viec.html`)
- **Nguồn trích xuất:** Tách từ Tab 1 ("Giao việc & Chỉ đạo") và Tab 2 ("Theo dõi tiến độ") của file mẫu gốc.
- **Tính năng chính:**
  1. Form giao việc: Chọn Tổ chuyên môn (Hành chính, Đăng ký, Cấp GCN, Kỹ thuật, Lưu trữ), chọn cán bộ nhận việc trong danh sách 82 cán bộ, tiêu đề nhiệm vụ, nội dung chi tiết, độ khẩn (Bình thường / Khẩn / Hỏa tốc), hạn chót hoàn thành.
  2. Bảng theo dõi tiến độ: Bộ lọc theo tổ, theo trạng thái (Chờ nhận việc, Đang thực hiện, Hoàn thành, Trễ hạn), tìm kiếm thời gian thực.
  3. Cán bộ cập nhật tiến độ (% hoàn thành, đính kèm kết quả, ghi chú vướng mắc). Lãnh đạo bấm duyệt hoàn thành.
- **Đồng bộ giao diện:** Áp dụng 100% Header Family CN23, Bảng màu Royal Navy & Gold, bảng dữ liệu responsive desktop chống vỡ chữ (rút gọn `...` + popup modal).
- **Backend Google Sheet:** Bổ sung tab `GiaoViec`.

### Ứng Dụng 2: Báo Cáo Số Liệu Thực Hiện Cấp Tổ & KPI (`bao_cao_to.html`)
- **Nguồn trích xuất:** Tách từ Tab 3 ("Báo cáo số liệu thực hiện") của file mẫu gốc.
- **Tính năng chính:**
  1. Nhập liệu 8 nhóm chỉ tiêu chuyên môn của từng tổ (Hồ sơ nhận, Đã giải quyết, Đúng hạn, Trễ hạn, Tồn đọng trong hạn, Tồn đọng quá hạn...).
  2. Hệ thống thẻ KPI trực quan tự động tính tỷ lệ % giải quyết đúng hạn, cảnh báo màu sắc (Xanh: Đạt / Vàng: Chú ý / Đỏ: Báo động).
  3. Lưu lịch sử báo cáo theo tuần/tháng, xem lại báo cáo cũ, xuất file Excel (`.xlsx`) hoặc in báo cáo A4.
- **Backend Google Sheet:** Bổ sung tab `BaoCaoSoLieu`.

### Cập Nhật Trang Chủ Hub (`index.html`)
- Mở rộng bố cục Hub từ 2 thẻ thành lưới 4 thẻ ứng dụng (Lịch tuần, IT Helpdesk, Giao việc, Báo cáo tổ) đồng bộ và sang trọng.
