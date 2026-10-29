# HƯỚNG DẪN NÂNG CẤP HỆ THỐNG "BINHDUONG23" TRÊN GOOGLE SHEET
### (Quản Lý Toàn Diện 5 Phân Hệ: Lịch Tuần + IT Helpdesk + Giao Việc + Báo Cáo Số Liệu Cấp Tổ)

---

## 💡 Phương Án Nâng Cấp Tối Ưu Nhất
Bạn **KHÔNG CẦN TẠO GOOGLE SHEET MỚI**. Chúng ta dùng lại chính trang tính Google Sheet hiện tại:
- **Giữ nguyên 100% lịch sử các cuộc họp/lịch công tác** đã đăng ký từ trước tới nay trong tab `LichTuan`.
- **Giữ nguyên đường link Web App URL cũ** (không cần cấu hình lại URL trên các máy tính đã lưu).
- **Tab `TaiKhoan`**: Quản lý cán bộ Chi nhánh 23 xác thực CCCD & Mật khẩu.
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
3. Mở file [backend/google_apps_script.js](file:///Users/admin/Desktop/BINHDUONG/A_THANG/backend/google_apps_script.js), sao chép toàn bộ nội dung và dán vào.
4. Bấm biểu tượng **Lưu** (Ctrl + S hoặc Cmd + S).

### Bước 3: Chạy 1-Click Cấu Hình Toàn Bộ 5 Phân Hệ
1. Quay lại trang tính Google Sheet và **Tải lại trang (F5)**.
2. Trên thanh menu trên cùng của Google Sheet, bạn sẽ thấy xuất hiện thêm một menu mới:
   👉 **`⭐ BINHDUONG23`**
3. Bấm vào menu **`⭐ BINHDUONG23`** -> chọn dòng:
   👉 **`▶️ 1-Click: Cấu hình chuẩn toàn bộ 5 Phân hệ BINHDUONG23`**
4. *Nếu Google yêu cầu cấp quyền*: Bấm **Tiếp tục** -> **Nâng cao (Advanced)** -> **Đi tới BINHDUONG23 (không an toàn)** -> **Cho phép (Allow)**. Sau đó bấm lại nút 1-Click trên một lần nữa.
5. Hệ thống sẽ báo hộp thoại hoàn tất với đầy đủ 5 tab:
   - Tab `LichTuan`: Giữ nguyên dữ liệu lịch công tác.
   - Tab `TaiKhoan`: Định dạng chuẩn nhân sự Chi nhánh 23.
   - Tab `Tickets`: Tiếp nhận sự cố IT Helpdesk.
   - Tab `GiaoViec`: Quản lý giao việc & bảng tiến độ.
   - Tab `BaoCaoSoLieu`: Báo cáo số liệu 8 chỉ tiêu chuyên môn cấp tổ.

### Bước 4: Cập nhật Bản Triển Khai (Deploy)
1. Trong màn hình Apps Script, bấm nút **Triển khai (Deploy)** ở góc trên bên phải -> chọn **Quản lý bản triển khai (Manage deployments)**.
2. Bấm vào biểu tượng **Chiếc bút chì (Edit)** cạnh bản triển khai hiện tại.
3. Tại dòng **Phiên bản (Version)**: Chọn **"Phiên bản mới" (New version)**.
4. Bấm nút **Triển khai (Deploy)**.
5. **Xong!** URL Web App vẫn giữ nguyên không đổi, toàn bộ 4 website con đã được nâng cấp đồng bộ.
