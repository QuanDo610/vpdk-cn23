# TÀI LIỆU BÀN GIAO CÔNG VIỆC DỰ ÁN "FAMILY CN23"
> **Hệ thống Cổng Dịch Vụ Nội Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23**  
> *Ngày lập: 29/10/2026 | Phiên bản hoàn thiện: v2.5-Stable*

---

## 1. THÔNG TIN HỆ THỐNG & ĐỊA CHỈ TRUY CẬP

| Hạng mục | Đường dẫn / Thông số |
| :--- | :--- |
| **Website Cổng Dịch Vụ** | [https://quando610.github.io/vpdk-cn23/index.html](https://quando610.github.io/vpdk-cn23/index.html) |
| **Phân hệ IT Helpdesk** | [https://quando610.github.io/vpdk-cn23/it_helpdesk.html](https://quando610.github.io/vpdk-cn23/it_helpdesk.html) |
| **Kho mã nguồn GitHub** | [`https://github.com/QuanDo610/vpdk-cn23.git`](https://github.com/QuanDo610/vpdk-cn23.git) *(Branch `main`)* |
| **Google Apps Script API** | `https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec` |
| **Google Spreadsheet Backend** | Chứa 3 tab dữ liệu: `TaiKhoan` (Tài khoản), `LichTuan` (Lịch công tác), `Tickets` (Sự cố máy tính) |

---

## 2. TỔNG HỢP CÁC CÔNG VIỆC ĐÃ HOÀN TẤT

### 2.1. Bảo mật & Làm sạch kho dữ liệu
* **Gỡ bỏ dữ liệu nhạy cảm**: Đã loại bỏ hoàn toàn các file bảng tính và danh sách tài khoản chứa số điện thoại, mật khẩu, số CCCD khỏi kho lưu trữ Git (`DANH_SACH_TAI_KHOAN_CN23.md`, `IMPORT_TAI_KHOAN_CN23_VAO_SHEET.xlsx`, `IMPORT_TICKETS_IT_VAO_SHEET.xlsx`, `danh_sach_tai_khoan_cn23.json`).
* **Làm sạch `README.md`**: Xóa bảng tài khoản mẫu và các thông tin mật khẩu thử nghiệm.
* **Xóa dữ liệu cứng (Initial Data)**: Loại bỏ `initial accounts` và `initial tickets` khỏi mã nguồn JavaScript; dữ liệu hiện tại được nạp 100% thời gian thực từ Google Sheet.
* **Gỡ bỏ từ ngữ nhạy cảm giao diện**: Thay thế toàn bộ cụm từ *"Google Sheet"* trên màn hình đăng nhập thành *"Hệ thống nội bộ"* hoặc *"Đang xác thực..."*.
* **Tối giản thông báo**: Bỏ thông báo pop-up trượt *"Xin chào... Đăng nhập thành công"* theo đúng yêu cầu người dùng.
* **Ẩn danh mục cán bộ**: Ẩn phân hệ xem danh sách nhân sự sau khi đăng nhập để đảm bảo quyền riêng tư.

### 2.2. Chuyển đổi kiến trúc Đăng nhập bằng CCCD
* **Đăng nhập bằng CCCD & Mật khẩu**: Thay thế cơ chế đăng nhập bằng Số điện thoại sang **Số CCCD (12 chữ số)** kết hợp Mật khẩu cá nhân.
* **Chuẩn hóa thông minh**: Tự động loại bỏ dấu chấm, dấu gạch ngang, khoảng trắng và số `0` ở đầu (nếu Google Sheet lưu dạng số nguyên).
* **Bắt buộc nhập mật khẩu khi mở mới**: Đã xử lý dứt điểm vấn đề tự động đăng nhập (như trường hợp tự chào Giám đốc khi mở máy) bằng cách xóa toàn bộ cache `localStorage` cũ và chỉ duy trì đăng nhập tạm thời trong `sessionStorage` của phiên làm việc hiện tại.

### 2.3. Tối ưu giao diện & Phân hệ IT Helpdesk
* **Form gửi sự cố thông minh**: Tự động kế thừa Họ tên, SĐT, CCCD, Phòng ban từ thông tin đăng nhập; cán bộ chỉ cần chọn loại sự cố và nhập mô tả lỗi.
* **Sửa lỗi vỡ layout người gửi**: Chia khối thông tin cán bộ thành các thẻ nhãn (chip badges) riêng biệt (`[Họ tên]`, `[🪪 CCCD]`, `[📞 SĐT]`), chống tràn chữ trên mọi kích thước màn hình.
* **Cân bằng bảng hiển thị Desktop**:
  * Cố định và chống rớt chữ cho các cột *"Người gửi / Phòng ban"* và *"Tên máy & Thiết bị"*.
  * Cắt ngắn mô tả lỗi dài thành 2 dòng hiển thị kèm dấu ba chấm `...`.
* **Popup chi tiết sự cố (Modal)**: Khi bấm vào dòng sự cố, popup hiện ra đầy đủ thông tin máy tính, IP mạng, ảnh chụp đính kèm (cho phép click phóng to), mã lỗi hệ thống và ghi chú tiến độ từ IT.

### 2.4. Khắc phục lỗi Đồng bộ sang Google Sheet
* **Sửa lỗi Form IT Helpdesk không lưu**:
  * Bổ sung trường `action: "createTicket"` bị thiếu trong payload gửi đi.
  * Chuyển cấu hình `fetch` từ `mode: "no-cors"` & `application/json` sang chuẩn `Content-Type: text/plain;charset=utf-8`.
  * Nhận trực tiếp kết quả JSON trả về từ Google Sheet gồm mã ticket chính thức (`TK-xxxxxx-xxx`) và thời gian chuẩn (`timestamp`).
  * Bổ sung cơ chế dự phòng `GET Fallback` nếu mạng nội bộ chặn kết nối `POST`.
* **Rà soát & tối ưu Lịch Tuần (`app.js`)**:
  * Bổ sung đầy đủ định danh người gửi (`phone`, `name`, `fullname`, `email`) trong cả luồng POST và GET fallback của `action: "register"`.
  * Khóa URL server chính thức để ngăn cache trình duyệt trỏ vào endpoint cũ.
  * Tự động làm mới bảng lịch tuần sau khi đăng ký thành công.
* **Tối ưu Google Apps Script (`google_apps_script.js`)**:
  * Bổ sung **Smart Fallback** trong `doPost`: Tự động nhận diện dữ liệu nếu client gửi thiếu `action` (dựa trên các trường sự cố để chạy `createTicket`, dựa trên trường lịch tuần để chạy `handleAddSchedule`).

### 2.5. Thiết kế Bộ biểu tượng Pikachu Kính Vuông & Công cụ cài đặt "Family CN23"
* **Icon Pikachu Kính Vuông**:
  * Thiết kế chú Pikachu vàng tươi rực rỡ, đeo **cặp mắt kính vuông** thời trang, thông thái, tròng kính anime phản quang trong suốt, hai má đỏ hồng hào.
  * Cung cấp 2 mẫu:
    1. **`pikachu_badge.ico`**: Pikachu Kính Vuông nằm trên ô Squircle hiện đại nền xanh da trời viền vàng hoàng gia *(Được chọn làm mặc định)*.
    2. **`pikachu.ico`**: Pikachu Kính Vuông nền trong suốt.
    3. Giữ nguyên icon huy hiệu cũ **`vpdk23.ico`** trong thư mục.
* **Tên lối tắt**: Thống nhất đặt tên phím tắt trên Desktop là **"Family CN23"**.
* **Khắc phục lỗi tạo shortcut**:
  * Thay thế lệnh PowerShell cũ bằng **Windows Script Host (VBScript native)**, hoạt động 100% ổn định trên mọi máy tính Windows, không bị chặn bởi PowerShell ExecutionPolicy.
  * Tự động định vị đúng Desktop người dùng (kể cả Desktop đồng bộ qua OneDrive).
  * Tự sao chép icon vào `%LOCALAPPDATA%\VPDK23` để sau khi cài đặt, cán bộ có xóa thư mục trong Downloads hay rút USB thì icon ngoài màn hình vẫn không bị mất.
  * Tự phục hồi Offline bằng mã nhúng Base64 nhị phân bên trong file BAT.
  * Tự động dò tìm Google Chrome, Microsoft Edge hoặc Cốc Cốc.
* **Đóng gói chuẩn chống bung file**:
  * File nén **`Family_CN23_Desktop.zip`** chứa sẵn thư mục mẹ `Family_CN23/` để khi cán bộ giải nén bằng bất kỳ phần mềm nào cũng chỉ tạo ra đúng 1 thư mục gọn gàng.

---

## 3. CẤU TRÚC FILE BÀN GIAO TRONG THƯ MỤC `A_THANG/`

```text
A_THANG/
├── Family_CN23_Desktop.zip        <-- GÓI NÉN CHÍNH GỬI CHO CÁN BỘ (Bên trong chứa folder Family_CN23)
├── Tao_Icon_Desktop_VPDK23.zip     <-- Gói nén phụ (nội dung tương đương)
│
├── Cai_Dat_Family_CN23.bat         <-- File cài đặt phím tắt chính (bấm đúp là xong)
├── Tao_Icon_Desktop_VPDK23.bat     <-- File cài đặt tên cũ (nội dung đồng bộ)
├── HUONG_DAN.txt                   <-- Hướng dẫn 3 bước ngắn gọn
│
├── pikachu_badge.ico               <-- Icon chính thức: Pikachu Badge Kính Vuông
├── pikachu_badge_preview.png       <-- Ảnh xem trước Pikachu Badge Kính Vuông
├── pikachu.ico                     <-- Icon phụ: Pikachu Kính Vuông nền trong suốt
├── pikachu_preview.png             <-- Ảnh xem trước Pikachu nền trong suốt
├── vpdk23.ico                      <-- Icon huy hiệu cũ (giữ lại theo yêu cầu)
│
├── index.html                      <-- Trang Cổng dịch vụ trung tâm (Đăng nhập CCCD)
├── it_helpdesk.html                <-- Phân hệ IT Helpdesk & Quản lý Ticket
├── lich_tuan.html                  <-- Phân hệ Lịch tuần công tác
├── app.js                          <-- Xử lý nghiệp vụ Lịch tuần & Xác thực
├── google_apps_script.js           <-- Mã nguồn triển khai Google Apps Script Web App
├── style.css                       <-- Tấm phong cách dùng chung
└── HANDOFF.md                      <-- File tài liệu bàn giao này
```

---

## 4. QUY TRÌNH HƯỚNG DẪN CÁN BỘ CƠ QUAN

Khi gửi phần mềm cho cán bộ qua Zalo hoặc mạng nội bộ, chỉ cần nhắn nội dung sau:

```text
Kính gửi các đồng chí trong cơ quan,

Tổ CNTT gửi file cài đặt phím tắt Cổng dịch vụ nội bộ "Family CN23" (Lịch tuần & Báo hỏng máy tính):
1. Tải file đính kèm: Family_CN23_Desktop.zip
2. Giải nén file (Chuột phải -> Chọn "Extract All..." hoặc "Giải nén").
3. Mở thư mục "Family_CN23", bấm đúp chuột vào file: Cai_Dat_Family_CN23.bat
4. Màn hình máy tính sẽ xuất hiện ngay biểu tượng chú Pikachu vàng kính vuông "Family CN23".

Hằng ngày vào làm việc, các đồng chí chỉ cần bấm đúp vào biểu tượng "Family CN23" để đăng nhập bằng Số CCCD (12 số) và Mật khẩu được cấp.
```

---

## 5. TRẠNG THÁI KIỂM THỬ LẦN CUỐI (VERIFICATION)

- [x] **Xác thực Đăng nhập CCCD**: Đã kiểm tra thành công với tài khoản thực từ Google Sheet tab `TaiKhoan`.
- [x] **Gửi Ticket IT Helpdesk**: Đã kiểm tra trực tiếp qua API, dữ liệu ghi nhận ngay tức thì vào tab `Tickets`.
- [x] **Đăng ký Lịch Tuần**: Đã kiểm tra luồng gửi `action: "register"`, dữ liệu lưu chuẩn xác vào tab `LichTuan`.
- [x] **Đồng bộ GitHub Repository**: Commit `e7ec886` đã được đẩy lên nhánh `main` của `QuanDo610/vpdk-cn23`.
- [x] **GitHub Pages**: Đang chạy trực tuyến ổn định tại `https://quando610.github.io/vpdk-cn23/index.html`.
