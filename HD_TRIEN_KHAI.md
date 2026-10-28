# HƯỚNG DẪN NÂNG CẤP HỆ THỐNG "BINHDUONG23" TRÊN GOOGLE SHEET HIỆN CÓ
### (Giữ nguyên toàn bộ dữ liệu Lịch Tuần cũ + Thêm 70 Tài khoản CN23 & Tab IT Helpdesk)

---

## 💡 Phương Án Nâng Cấp Tối Ưu Nhất
Bạn **KHÔNG CẦN TẠO GOOGLE SHEET MỚI**. Chúng ta dùng lại chính trang tính Google Sheet của Lịch công tác tuần hiện tại:
- **Giữ nguyên 100% lịch sử các cuộc họp/lịch công tác** đã đăng ký từ trước tới nay trong tab `LichTuan`.
- **Giữ nguyên đường link Web App URL cũ** (không cần cấu hình lại URL trên các máy tính đã lưu).
- **Tự động thêm tab `Tickets`** để tiếp nhận sự cố IT Helpdesk.
- **Tự động cập nhật 70 tài khoản cán bộ Chi nhánh 23** vào tab `TaiKhoan`.

---

## 🚀 Các Bước Thực Hiện (Chỉ mất 2 phút)

### Bước 1: Đổi tên Google Sheet
1. Mở trang tính Google Sheet của Lịch công tác tuần hiện tại.
2. Bấm vào tên trang tính ở góc trên bên trái và đổi thành: **`BINHDUONG23`** (hoặc tên tùy thích).

### Bước 2: Dán mã Script mới
1. Trên thanh menu của Google Sheet, chọn: **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Xóa toàn bộ nội dung code cũ trong file `Code.gs`.
3. Mở file [google_apps_script.js](file:///Users/admin/Desktop/BINHDUONG/A_THANG/google_apps_script.js), sao chép toàn bộ nội dung và dán vào.
4. Bấm biểu tượng **Lưu** (Ctrl + S hoặc Cmd + S).

### Bước 3: Chạy 1-Click Nạp 70 Tài Khoản & Tạo Tab Tickets
1. Quay lại trang tính Google Sheet và **Tải lại trang (F5)**.
2. Trên thanh menu trên cùng của Google Sheet, bạn sẽ thấy xuất hiện thêm một menu mới:
   👉 **`⭐ BINHDUONG23`**
3. Bấm vào menu **`⭐ BINHDUONG23`** -> chọn dòng:
   👉 **`▶️ 1-Click: Nạp 70 Tài Khoản CN23 + Tạo Tab Tickets`**
4. *Nếu Google yêu cầu cấp quyền*: Bấm **Tiếp tục** -> **Nâng cao (Advanced)** -> **Đi tới BINHDUONG23 (không an toàn)** -> **Cho phép (Allow)**. Sau đó bấm lại nút 1-Click trên một lần nữa.
5. Hệ thống sẽ báo hộp thoại hoàn tất:
   - Tab `LichTuan`: Giữ nguyên toàn vẹn mọi lịch công tác cũ.
   - Tab `TaiKhoan`: Đã nạp đầy đủ 70 cán bộ Chi nhánh 23 với SĐT làm username và mật khẩu 8 ký tự.
   - Tab `Tickets`: Đã tạo sẵn sàng tiếp nhận sự cố IT Helpdesk.

*(Ngoài ra, nếu bạn muốn copy-paste tài khoản bằng tay thì đã có sẵn file Excel định dạng chuẩn tại [OUTPUT/IMPORT_TAI_KHOAN_CN23_VAO_SHEET.xlsx](file:///Users/admin/Desktop/BINHDUONG/OUTPUT/IMPORT_TAI_KHOAN_CN23_VAO_SHEET.xlsx)).*

### Bước 4: Cập nhật Bản Triển Khai (Deploy)
1. Trong màn hình Apps Script, bấm nút **Triển khai (Deploy)** ở góc trên bên phải -> chọn **Quản lý bản triển khai (Manage deployments)**.
2. Bấm vào biểu tượng **Chiếc bút chì (Edit)** cạnh bản triển khai hiện tại.
3. Tại dòng **Phiên bản (Version)**: Chọn **"Phiên bản mới" (New version)**.
4. Bấm nút **Triển khai (Deploy)**.
5. **Xong!** URL Web App vẫn giữ nguyên không đổi, toàn bộ website đã được nâng cấp lên hệ thống hợp nhất.
