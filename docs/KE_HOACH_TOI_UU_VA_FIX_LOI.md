# 📋 KẾ HOẠCH TỐI ƯU HIỆU SUẤT, BẢO MẬT & CHUẨN HÓA FRONT-END
### DỰ ÁN CỔNG ĐIỀU HÀNH & DỊCH VỤ NỘI BỘ "FAMILY CN23"
> **Đơn vị ban hành:** Văn phòng Đăng ký Đất đai TP.HCM - Chi nhánh số 23  
> **Thời điểm cập nhật:** 04/11/2026 (Phiên bản 1.0)  
> **Tài liệu tham chiếu:** [`docs/QUY_CHUAN_MA_NGUON.md`](file:///c:/Users/X/Desktop/vpdk-cn23/docs/QUY_CHUAN_MA_NGUON.md) • [`docs/BAO_CAO_AN_NINH.md`](file:///c:/Users/X/Desktop/vpdk-cn23/docs/BAO_CAO_AN_NINH.md)

---

## 🎯 MỤC TIÊU CỐT LÕI
1. **Triệt tiêu nguy cơ web bị load chậm:** Mở trang tức thì (< 300ms), không bị block render, loại bỏ CSS `@import` cascade và nạp tải nguyên nặng không cần thiết.
2. **Chuẩn hóa 100% Front-end & Clean Code:** Xóa sạch toàn bộ inline event handlers (`onclick`, `onchange`), chuyển sang Event Delegation, bổ sung thuộc tính form/button chuẩn và thêm kỹ thuật Debounce.
3. **Bảo mật & An toàn thông tin (Zero PII Leak):** Loại bỏ danh bạ cán bộ cứng trên client code, gia cố phân quyền và băm mật khẩu.

---

## 📊 BẢNG TIẾN ĐỘ TỔNG QUAN (STATUS BOARD)

| Nhóm Hạng Mục | Tổng Số Đầu Việc | Đã Hoàn Thành | Đang Thực Hiện | Chưa Thực Hiện |
| :--- | :---: | :---: | :---: | :---: |
| ⚡ **1. Tối ưu Hiệu suất & Tốc độ tải (Performance)** | 6 | 0 | 0 | 6 |
| 🎨 **2. Chuẩn hóa Front-end & Best Practices** | 6 | 0 | 0 | 6 |
| 🔒 **3. An ninh & Bảo mật Dữ liệu (Security)** | 5 | 0 | 0 | 5 |
| **TỔNG CỘNG** | **17** | **0** | **0** | **17** |

---

## 📝 DANH MỤC CÁC HẠNG MỤC CẦN FIX CHI TIẾT

### ⚡ 1. NHÓM HIỆU SUẤT & TỐC ĐỘ TẢI TRANG (PERFORMANCE)
*(Giải quyết triệt để vấn đề: Web bị load chậm)*

- [ ] **PERF-01: Gỡ bỏ toàn bộ `@import` lồng nhau trong CSS**
  - **Mức độ:** 🔴 **Khẩn cấp** (Nguyên nhân hàng đầu gây render-blocking & CSS waterfall).
  - **Vị trí:** `css/base.css`, `css/hub.css`, `css/lich_tuan.css`, `css/giao_viec.css`, `css/it_helpdesk.css`, `css/bao_cao_to.css`.
  - **Giải pháp:** Xóa sạch các dòng `@import url(...)`, thay bằng liên kết `<link rel="stylesheet">` song song trong thẻ `<head>` của các file HTML.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **PERF-02: Tối ưu hóa tệp `quotes_data.js` (362 KB) trên `index.html`**
  - **Mức độ:** 🔴 **Khẩn cấp** (Tốn 362 KB JS thô chỉ để hiển thị 1 câu quote ngẫu nhiên khi vào trang chủ).
  - **Vị trí:** `js/quotes_data.js`, `index.html`, `js/index.js`.
  - **Giải pháp:** Tách top 20-30 câu châm ngôn ngắn gọn vào `index.js` (~3 KB). Chỉ tải file đầy đủ khi người dùng thực hiện thao tác duyệt danh mục câu nói.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **PERF-03: Localize thư viện CDN ngoài (docx.js & FileSaver.js)**
  - **Mức độ:** 🟠 **Cao** (Phụ thuộc CDN nước ngoài `jsdelivr` và `cdnjs`, nếu mạng cơ quan chập chờn sẽ treo tải trang).
  - **Vị trí:** `lich_tuan.html`.
  - **Giải pháp:** Tải bản minified về lưu tĩnh nội bộ tại `js/vendor/` (tương tự như `flatpickr.min.js`).
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **PERF-04: Thay thế Google Fonts ngoại tuyến bằng System Font Stack**
  - **Mức độ:** 🟡 **Trung bình** (Tránh gọi sang `fonts.googleapis.com` và `fonts.gstatic.com` làm chậm FCP).
  - **Vị trí:** `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`.
  - **Giải pháp:** Cấu hình font hệ thống tối ưu văn phòng: `system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **PERF-05: Tích hợp hàm `debounce(..., 300)` cho các ô tìm kiếm**
  - **Mức độ:** 🟡 **Trung bình** (Chống giật lag DOM khi cán bộ gõ tìm kiếm sự cố IT / công việc).
  - **Vị trí:** `js/it_helpdesk.js`, `js/giao_viec.js`, `js/bao_cao_to.js`, `js/app.js`.
  - **Giải pháp:** Bọc hàm tìm kiếm qua bộ đếm 300ms, chỉ lọc và re-render bảng khi cán bộ ngừng gõ phím.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **PERF-06: Tối ưu và dọn dẹp các tệp tĩnh nặng trong repo**
  - **Mức độ:** 🟢 **Thấp** (Giảm dung lượng bộ nhớ tải và clone git).
  - **Vị trí:** `Family_CN23_Desktop.zip` (525 KB), `pikachu_badge.ico` (70 KB), các file preview không dùng.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

---

### 🎨 2. NHÓM CHUẨN HÓA FRONT-END & BEST PRACTICES
*(Đảm bảo tuân thủ 100% chuẩn kỹ thuật quy định tại `QUY_CHUAN_MA_NGUON.md`)*

- [ ] **FE-01: Loại bỏ 22 inline event handlers trong `it_helpdesk.html`**
  - **Mức độ:** 🔴 **Khẩn cấp** (Vi phạm nguyên tắc phân tách trách nhiệm Separation of Concerns).
  - **Vị trí:** `it_helpdesk.html` (các thẻ mang `onclick="..."`, `onchange="..."`, `oninput="..."`, `onsubmit="..."`).
  - **Giải pháp:** Chuyển sang thuộc tính ngữ nghĩa `data-action="..."` và sử dụng Event Delegation tại `js/it_helpdesk.js`.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **FE-02: Thay thế 10 inline `style="display: none;"` trong `lich_tuan.html`**
  - **Mức độ:** 🟠 **Cao** (Vi phạm quy chuẩn cấm Inline CSS).
  - **Vị trí:** `lich_tuan.html` (dòng 43, 48, 79, 90, 173, 259, 292, 325, 372, 409).
  - **Giải pháp:** Chuyển sang sử dụng class tiện ích `.d-none` trong `utilities.css` hoặc thuộc tính HTML5 `hidden`.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **FE-03: Bổ sung tường minh thuộc tính `type="button"` cho 27 nút bấm**
  - **Mức độ:** 🟠 **Cao** (Tránh lỗi trình duyệt tự động submit form khi bấm nút thông thường).
  - **Vị trí:** `bao_cao_to.html` (8 nút), `giao_viec.html` (7 nút), `lich_tuan.html` (9 nút), `it_helpdesk.html` (3 nút).
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **FE-04: Bổ sung liên kết `<label for="...">` và thuộc tính `id` cho các input**
  - **Mức độ:** 🟡 **Trung bình** (Đảm bảo chuẩn tiếp cận A11y & Form Best Practice).
  - **Vị trí:** `it_helpdesk.html` (6 input thiếu id/label).
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **FE-05: Thêm `rel="noopener noreferrer"` cho các liên kết `target="_blank"`**
  - **Mức độ:** 🟡 **Trung bình** (Ngăn chặn lỗ hổng Tabnabbing khi mở tab mới).
  - **Vị trí:** `index.html` (1 link Drive), `it_helpdesk.html` (2 link Drive).
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **FE-06: Quy chuẩn hóa mã màu HEX về CSS Design Tokens (`variables.css`)**
  - **Mức độ:** 🟢 **Thấp** (Tăng tính nhất quán và dễ bảo trì giao diện theo phong cách 60-30-10).
  - **Vị trí:** `css/base.css`, `css/hub.css`, `css/lich_tuan.css`.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

---

### 🔒 3. NHÓM AN NINH & BẢO MẬT HỆ THỐNG (SECURITY)
*(Bảo vệ an toàn thông tin cơ quan nhà nước)*

- [ ] **SEC-01: Gỡ bỏ danh sách 82 nhân sự cứng (`STAFF_CN23`) khỏi mã nguồn client**
  - **Mức độ:** 🔴 **Khẩn cấp** (Nguy cơ rò rỉ cơ cấu tổ chức & danh bạ cán bộ khi đưa lên Git công khai).
  - **Vị trí:** `js/giao_viec.js` (dòng 23 - 108), `js/app.js` (`KNOWN_USERS_MAP`).
  - **Giải pháp:** Chuyển sang nạp động từ Google Sheets qua API có kiểm tra quyền đăng nhập (`sessionStorage`).
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **SEC-02: Kiểm soát xác thực & phân quyền (RBAC) chặt chẽ trên Google Apps Script**
  - **Mức độ:** 🔴 **Khẩn cấp** (Chống người dùng can thiệp F12 sửa role trên Client để xóa/sửa dữ liệu).
  - **Vị trí:** `backend/google_apps_script.js`.
  - **Giải pháp:** Mọi request thêm/sửa/xóa bắt buộc gửi kèm token hoặc định danh người thực hiện để server đối chiếu quyền trước khi ghi vào Sheet.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **SEC-03: Băm mật khẩu người dùng (Hashing) thay vì lưu Plaintext**
  - **Mức độ:** 🔴 **Khẩn cấp** (Tránh lộ toàn bộ mật khẩu cán bộ khi có người truy cập trang tính `TaiKhoan`).
  - **Vị trí:** `backend/google_apps_script.js`.
  - **Giải pháp:** Áp dụng SHA-256 (`Utilities.computeDigest`) trên Google Apps Script trước khi lưu trữ và so sánh.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **SEC-04: Rà soát triệt để `innerHTML` chống Stored XSS**
  - **Mức độ:** 🟠 **Cao** (Đảm bảo mọi biến động chèn vào DOM đều qua `escapeHtml()`).
  - **Vị trí:** `js/index.js` (dòng 95, dòng 181), `js/giao_viec.js` (dòng 765).
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

- [ ] **SEC-05: Kiểm tra quyền truy cập thư mục Google Drive lưu ảnh IT Helpdesk**
  - **Mức độ:** 🟡 **Trung bình** (Tránh để lộ ảnh chụp màn hình chứa dữ liệu nhạy cảm của người dân).
  - **Vị trí:** Cấu hình thư mục Drive tại Google Apps Script.
  - **Trạng thái:** ⏳ *Chưa bắt đầu*

---

## 📌 LỊCH SỬ CÁC LẦN CẬP NHẬT (AUDIT LOG)

| Phiên Làm Việc | Người Thực Hiện | Hạng Mục Đã Sửa | Ghi Chú Chi Tiết |
| :---: | :---: | :---: | :--- |
| **04/11/2026** | Antigravity AI | Khởi tạo tài liệu kế hoạch | Quét toàn diện codebase và lên danh mục 17 đầu việc ưu tiên. |
