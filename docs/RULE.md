# BỘ NGUYÊN TẮC VÀNG PHÁT TRIỂN HỆ THỐNG (RULE.md)
### Hệ Thống Web Portal "Family CN23" - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23

> [!IMPORTANT]
> Đây là các nguyên tắc cốt lõi mang tính kỷ luật tối cao. Mọi lập trình viên và Trợ lý AI khi thao tác trong thư mục `A_THANG/` bắt buộc phải tuân thủ 100%, không có ngoại lệ.

---

## QUY TẮC 1: GIỚI HẠN PHẠM VI (WORKSPACE ISOLATION)
1. Toàn bộ mã nguồn, tài nguyên, hình ảnh và tài liệu hướng dẫn của dự án Family CN23 PHẢI nằm gọn trong thư mục `A_THANG/`.
2. Tuyệt đối không can thiệp, không sửa đổi các file hướng dẫn hoặc tài liệu ở thư mục gốc cấp trên (`/Users/admin/Desktop/BINHDUONG/{Gemini.md, Agent.md, Rule.md, Skill.md, documents/, OUTPUT/}`).

---

## QUY TẮC 2: CÔNG NGHỆ THUẦN TÚY (VANILLA WEB STACK)
1. Chỉ sử dụng: **HTML5 + CSS3 + Vanilla JavaScript (ES6+)**.
2. Không sử dụng bất kỳ công cụ build nào (Vite, Webpack, Babel, npm build).
3. Mọi file HTML phải mở và chạy được độc lập trên trình duyệt hoặc máy chủ tĩnh (GitHub Pages / Cloudflare Pages).
4. Các thư viện phụ trợ chỉ được nhúng thông qua các CDN toàn cầu uy tín (Tailwind CDN, Font Awesome, Google Fonts, Flatpickr, Docx, SheetJS).

---

## QUY TẮC 3: ĐỒNG BỘ THIẾT KẾ (DESIGN HARMONIZATION)
1. **Tuân thủ bảng mã màu chuẩn trong [SKILL.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/SKILL.md):**
   - Nền thanh Header: Xanh Hoàng gia (`#1e3a8a` - `bg-blue-900`).
   - Đường viền chỉ Header: Vàng kim Chi nhánh 23 (`#f59e0b` - `border-amber-500`).
   - Nền trang web: Xám nhạt dịu mắt (`#f8fafc` - `bg-slate-50`).
   - Thẻ nội dung: Trắng tinh (`#ffffff` - `bg-white`) viền xám (`#e2e8f0` - `border-slate-200`).
2. Mọi phân hệ mới (Giao việc, Báo cáo tổ...) bắt buộc phải có thanh Header đồng nhất, hiển thị Huy hiệu cán bộ đăng nhập và nút quay về Cổng Hub trung tâm (`index.html`).

---

## QUY TẮC 4: ƯU TIÊN MÀN HÌNH MÁY TÍNH CƠ QUAN (DESKTOP-FIRST PERFECTION)
1. Cán bộ văn phòng làm việc trên màn hình máy tính để bàn (1920x1080 và 1366x768) là chủ yếu. Bố cục phải tận dụng tối đa chiều rộng màn hình, không để trống hai bên quá nhiều hoặc dồn ép cột hẹp.
2. **Quy tắc bảng dữ liệu không được vỡ dòng (No Broken Layout):**
   - Các cột nhiều chữ (như *Người gửi/Phòng ban*, *Tên máy/Thiết bị*, *Nội dung sự cố*, *Tên công việc*) bắt buộc phải có giới hạn chiều rộng (`max-w-[...]`).
   - Văn bản dài phải được rút gọn bằng dấu ba chấm `...` (`truncate` / `text-overflow: ellipsis`).
   - Bắt buộc phải có popup modal hoặc tooltip hiển thị đầy đủ văn bản khi cán bộ bấm vào hoặc rê chuột.

---

## QUY TẮC 5: BẢO MẬT DỮ LIỆU & AN TOÀN THÔNG TIN (ZERO LEAK)
1. **Tuyệt đối không đưa thông tin nhạy cảm lên Git:** Không hardcode số điện thoại, số CCCD, mật khẩu cá nhân hay danh sách nhân sự vào file mã nguồn JavaScript/HTML hoặc file markdown đẩy lên GitHub công khai.
2. Xác thực tài khoản phải được thực hiện thông qua Google Apps Script Web App đọc từ trang tính Google Sheet bảo mật.
3. Khi đăng nhập thành công, chỉ lưu thông tin cần thiết vào `sessionStorage` để phục vụ hiển thị tên và chức vụ trên Header.

---

## QUY TẮC 6: TƯƠNG THÍCH ĐƯỜNG DẪN & BỘ CÀI ĐẶT DESKTOP
1. Trang chủ chính của hệ thống bắt buộc phải đặt tại `A_THANG/index.html` để GitHub Pages (`https://quando610.github.io/vpdk-cn23/index.html`) hoạt động chính xác.
2. Giữ nguyên biểu tượng `pikachu_badge.ico` và gói `Family_CN23_Desktop.zip` để phục vụ đường dẫn tải trực tiếp trong các tệp `.bat` cài đặt phím tắt máy tính bàn.
3. Mọi đường dẫn liên kết nội bộ giữa các trang phải là đường dẫn tương đối (relative paths: `css/...`, `js/...`, `it_helpdesk.html`...).

---

## QUY TẮC 7: NGUYÊN TẮC TIẾN HÀNH (STEP-BY-STEP)
1. *"Chậm mà chắc"*: Thảo luận và thống nhất cấu trúc với người dùng trước khi tiến hành code các tính năng lớn.
2. Mỗi phân hệ khi hoàn thành phải được kiểm tra thực tế (kiểm tra gửi nhận dữ liệu, kiểm tra responsive giao diện) trước khi chuyển sang phân hệ kế tiếp.
3. Luôn cập nhật nhật ký tiến độ trong [docs/HANDOFF.md](file:///Users/admin/Desktop/BINHDUONG/A_THANG/docs/HANDOFF.md) sau mỗi phiên làm việc.
