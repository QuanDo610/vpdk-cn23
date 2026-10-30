# HƯỚNG DẪN NÂNG CẤP HỆ THỐNG "BINHDUONG23" TRÊN GOOGLE SHEET
### (Quản Lý Toàn Diện 5 Phân Hệ: Lịch Tuần + IT Helpdesk + Giao Việc + Báo Cáo Số Liệu Cấp Tổ + Đăng Nhập Username)

---

## 💡 Phương Án Nâng Cấp Tối Ưu Nhất
Bạn **KHÔNG CẦN TẠO GOOGLE SHEET MỚI**. Chúng ta dùng lại chính trang tính Google Sheet hiện tại:
- **Giữ nguyên 100% lịch sử các cuộc họp/lịch công tác** đã đăng ký từ trước tới nay trong tab `LichTuan`.
- **Giữ nguyên đường link Web App URL cũ** (không cần cấu hình lại URL trên các máy tính đã lưu).
- **Tab `TaiKhoan`**: Quản lý cán bộ Chi nhánh 23 xác thực bằng **Username mới (VD: Quân ĐTM)** hoặc **Số CCCD** & Mật khẩu.
- **Tab `Tickets`**: Tiếp nhận sự cố máy tính IT Helpdesk.
- **Tab `GiaoViec`**: Quản lý phiếu giao việc và đôn đốc tiến độ của Lãnh đạo.
- **Tab `BaoCaoSoLieu`**: Thu thập 8 nhóm chỉ tiêu chuyên môn và giám sát KPI cấp tổ.

---

## 🚀 Các Bước Thực Hiện (Chỉ mất 2 phút)

### Bước 1: Mở Google Sheet hiện tại
1. Mở trang tính Google Sheet của Lịch công tác tuần hiện tại.
2. Kiểm tra tên trang tính ở góc trên bên trái: **`BINHDUONG23`**.

### Bước 2: Dán mã Script mới
1. Trên thanh menu của Google Sheet, chọn: **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Xóa toàn bộ nội dung code cũ trong file `Code.gs`.
3. Mở file [backend/google_apps_script.js](file:///Users/admin/Desktop/FAMILY_CN23/backend/google_apps_script.js), sao chép toàn bộ nội dung và dán vào.
4. Bấm biểu tượng **Lưu** (Ctrl + S hoặc Cmd + S).

### Bước 3: Cấu trúc 10 Cột chuẩn tab `TaiKhoan` & Tự động tạo Username
Thứ tự 10 cột trong tab `TaiKhoan` đã được chuẩn hóa đồng bộ 100% như sau:
> **`Họ và tên` (A) | `Username` (B) | `Mật khẩu` (C) | `Chức danh / Chức vụ` (D) | `Số điện thoại` (E) | `Đơn vị / Bộ phận` (F) | `Số CCCD` (G) | `Trạng thái` (H) | `Vai trò` (I) | `Ngày tạo` (J)**

Bạn có 2 cách điền Username:
- **Cách 1 (Nhanh nhất - Tự động 100%):**
  1. Tải lại trang Google Sheet (F5).
  2. Bấm vào menu **`⭐ BINHDUONG23`** trên thanh công cụ -> chọn **`🔤 Tự động tạo & điền Username (Quân ĐTM)`**.
  3. Hệ thống sẽ tự động tính toán từ cột A (`Họ và tên`) và điền sẵn Username chuẩn vào cột B (`Username`) cho toàn bộ 70+ cán bộ trong nháy mắt!
- **Cách 2 (Dùng công thức trang tính):**
  1. Tại ô B2 (dòng cán bộ đầu tiên), bạn gõ công thức: `=TAO_USERNAME(A2)` rồi kéo xuống các hàng dưới.
  2. Hoặc bạn có thể tự nhập tay Username theo định dạng: **Tên chính + Chữ cái đầu viết hoa của Họ và Tên lót** (Ví dụ: `Đỗ Trọng Minh Quân` -> `Quân ĐTM`, `Nguyễn Văn An` -> `An NV`).

### Bước 4: Chạy 1-Click Cấu Hình Toàn Bộ 5 Phân Hệ (Nếu thiết lập mới)
1. Trên thanh menu trên cùng của Google Sheet, bấm menu:
   👉 **`⭐ BINHDUONG23`** -> chọn dòng:
   👉 **`▶️ 1-Click: Cấu hình chuẩn toàn bộ 5 Phân hệ BINHDUONG23`**
2. *Nếu Google yêu cầu cấp quyền*: Bấm **Tiếp tục** -> **Nâng cao (Advanced)** -> **Đi tới BINHDUONG23 (không an toàn)** -> **Cho phép (Allow)**. Sau đó bấm lại nút 1-Click trên một lần nữa.

### Bước 5: Cập nhật Bản Triển Khai (Deploy)
1. Trong màn hình Apps Script, bấm nút **Triển khai (Deploy)** ở góc trên bên phải -> chọn **Quản lý bản triển khai (Manage deployments)**.
2. Bấm vào biểu tượng **Chiếc bút chì (Edit)** cạnh bản triển khai hiện tại.
3. Tại dòng **Phiên bản (Version)**: Chọn **"Phiên bản mới" (New version)**.
4. Bấm nút **Triển khai (Deploy)**.
5. **Xong!** URL Web App vẫn giữ nguyên không đổi, toàn bộ hệ thống web portal đã hỗ trợ đăng nhập bằng Username mới và mật khẩu.
