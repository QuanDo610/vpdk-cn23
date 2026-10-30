# Cổng Dịch Vụ Nội Bộ VPĐK - Chi Nhánh Số 23
### (Hệ Thống Đăng Ký Lịch Tuần & Tiếp Nhận Sự Cố IT Helpdesk Hợp Nhất)

Hệ thống web portal tích hợp 2 phân hệ nghiệp vụ nội bộ dành cho toàn thể viên chức, người lao động thuộc **Văn Phòng Đăng Ký Đất Đai TP.HCM - Chi Nhánh Số 23**:
1. **Phân hệ 1 (Lịch Tuần)**: Đăng ký lịch làm việc, họp giao ban, tiếp công dân và tự động kết xuất văn bản Word (.docx) chuẩn thể thức **Nghị định 30/2020/NĐ-CP**.
2. **Phân hệ 2 (IT Helpdesk)**: Báo cáo và tiếp nhận sự cố tin học (máy tính, máy in, mạng nội bộ, phần mềm VBDLIS, chữ ký số), tự động nhận diện thiết bị, hỗ trợ dán ảnh chụp màn hình phím tắt `Ctrl + V`, và theo dõi tiến độ xử lý trực tiếp (Live Monitoring).

Toàn bộ hệ thống hoạt động theo mô hình **Serverless** (lưu trữ tập trung trên 1 Google Sheet duy nhất gồm 3 tabs/sheets và tự động lưu ảnh lên Google Drive), tương thích 100% trên cả máy tính lẫn điện thoại di động.

---

## 🌟 Tính Năng Nổi Bật

### 1. Quản Lý Tài Khoản & Đăng Nhập
- **Tên đăng nhập**: Sử dụng **Số CCCD** của cán bộ (12 chữ số).
- **Mật khẩu an toàn**: Mật khẩu được cấp và quản lý tập trung trên hệ thống.
- **Phân loại trạng thái**: Tự động nhận diện cán bộ đang làm việc và cán bộ đã nghỉ việc (ngăn chặn đăng nhập kèm thông báo bảo mật).

### 2. Trang Chủ Điều Hướng (Portal Hub)
- Lời chào cá nhân hóa theo tên cán bộ, hiển thị chức vụ, số điện thoại và ngày làm việc hiện tại.
- 2 thẻ phân hệ lớn với huy hiệu nghiệp vụ và số lượng thống kê trực quan (số lịch đã đăng ký, số sự cố đang chờ xử lý).
- Thanh điều hướng nhanh trên Header cho phép chuyển đổi qua lại giữa Trang Chủ, Lịch Tuần và IT Helpdesk bất kỳ lúc nào mà không cần đăng nhập lại.

### 3. Phân Hệ Đăng Ký Lịch Công Tác Tuần
- **Tự động tính "Thứ"** theo ngày chọn (DD/MM/YYYY).
- Đồng hồ chọn giờ làm việc hệ 24h (`07:30`, `08:00`, `14:00`...).
- Bộ đếm trực quan **giới hạn 500 ký tự** cho các ô Nội dung, Thành phần, Địa điểm.
- Bảng lịch tuần tổng hợp thời gian thực, hỗ trợ tìm kiếm nhanh, phân trang, xem chi tiết modal.
- **Xuất file Word (.docx) chuẩn Nghị định 30/2020/NĐ-CP**: Khổ giấy A4, lề chuẩn (Trái 30mm, Phải 15mm, Trên 20mm, Dưới 20mm), phông Times New Roman cỡ 13-14, tiêu ngữ, đường kẻ và bảng phân công công tác tuần.

### 4. Phân Hệ IT Helpdesk & Báo Cáo Sự Cố
- **Tự động nhận diện thiết bị & IP**: Tự sinh mã máy (`PC-XXXX`), quét hệ điều hành (Windows, macOS), RAM, CPU, độ phân giải màn hình và địa chỉ IP Public.
- **Tự động điền thông tin cán bộ**: Họ tên, Số điện thoại và Tổ/Phòng ban được lấy tự động từ tài khoản đăng nhập.
- **Dán ảnh chụp trực tiếp (`Ctrl + V`)**: Chỉ cần chụp màn hình lỗi rồi bấm `Ctrl + V` là ảnh tự dán vào form, tự nén HTML5 Canvas xuống ~150KB trước khi tải lên Google Drive (`IT_Helpdesk_Uploads`).
- **Bảng Monitoring 2 cột**: Theo dõi hàng đợi trực tiếp với 4 thẻ thống kê (Tổng số, Chờ xử lý, Đang xử lý, Đã hoàn thành), tự động sắp xếp theo thứ tự ưu tiên ("Đang xử lý" > "Chờ xử lý" > "Đã hoàn thành").
- Xem ảnh lỗi phóng to trực tiếp ngay trên trang web.

---

## 📁 Cấu Trúc Thư Mục

```text
A_THANG/
├── index.html                   # Cổng dịch vụ chính (Đăng nhập bằng CCCD, Hub điều hướng)
├── style.css                    # CSS giao diện chuẩn, tương thích máy tính và di động
├── app.js                       # Logic Lịch tuần & xuất văn bản Word chuẩn Nghị định 30
├── it_helpdesk.html             # Phân hệ IT Helpdesk tiếp nhận & theo dõi sự cố
├── lich_tuan.html               # Phân hệ Đăng ký Lịch công tác tuần
├── google_apps_script.js        # Script Google Apps Script quản lý hệ thống
├── Tao_Icon_Desktop_VPDK23.bat  # Công cụ tạo phím tắt mở trực tiếp bằng Chrome/Edge
├── Tao_Icon_Desktop_VPDK23.zip  # File nén cài đặt phím tắt kèm Icon huy hiệu
├── vpdk23.ico                   # Icon Huy hiệu Chi Nhánh 23 độ phân giải cao
└── README.md                    # Tài liệu tổng quan hệ thống
```
