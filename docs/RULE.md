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

## QUY TẮC 3: ĐỒNG BỘ THIẾT KẾ & MENU CỐ ĐỊNH BÊN TRÁI (UNIFIED SIDEBAR NAVIGATION)
1. **Tuân thủ bảng mã màu chuẩn trong [SKILL.md](file:///Users/admin/Desktop/FAMILY_CN23/docs/SKILL.md):**
   - Nền Sidebar: Xanh Slate Navy đậm (`#0f172a` - `#1e293b`).
   - Đường viền chỉ Header & Sidebar: Vàng kim Chi nhánh 23 (`#f59e0b` - `border-amber-500`).
   - Nền trang web: Xám nhạt dịu mắt (`#f8fafc` - `bg-slate-50`).
   - Thẻ nội dung: Trắng tinh (`#ffffff` - `bg-white`) viền xám (`#e2e8f0` - `border-slate-200`).
2. **Quy chuẩn điều hướng thống nhất (Fixed Sidebar Menu):**
   - Mọi trang web con trong hệ thống (`index.html`, `lich_tuan.html`, `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`) bắt buộc phải nhúng module `css/sidebar.css` và `js/sidebar.js`.
   - Cố định toàn bộ danh mục phân hệ nằm ở thanh Menu trượt bên trái (Sidebar).
   - Tuyệt đối không đặt các nút chuyển trang lộn xộn, không đồng bộ trên thanh Header. Thanh Header phía trên chỉ dùng để hiển thị định danh cơ quan, tên trang hiện tại, trạng thái Online và Huy hiệu cán bộ đăng nhập.

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
3. Luôn cập nhật nhật ký tiến độ trong [docs/HANDOFF.md](file:///Users/admin/Desktop/FAMILY_CN23/docs/HANDOFF.md) sau mỗi phiên làm việc.

---

## QUY TẮC 8: PIPELINE PHÁT TRIỂN 2 GIAI ĐOẠN (DESIGN-FIRST PIPELINE)
> [!IMPORTANT]
> **Quy trình bắt buộc khi phát triển tính năng / trang web mới:**
> Tuyệt đối không làm gộp cùng lúc cả một mớ (Giao diện + Script logic + Backend) vì rất khó kiểm soát và khó chỉnh sửa.

1. **Giai đoạn 1 (Vai trò Designer - Layout First):**
   - Chỉ tập trung dựng layout, dựng khung HTML/CSS, bố cục các khối, thẻ card, bảng biểu, ô nhập liệu.
   - Giữ trạng thái tĩnh hoặc giao diện mẫu, tập trung làm cho giao diện đẹp, chuẩn màu sắc, chuẩn responsive desktop.
   - **Dừng lại để trình bày cho người dùng xem và duyệt layout trước.**
2. **Giai đoạn 2 (Vai trò Developer - Script & Backend After):**
   - Chỉ bắt tay vào viết logic JavaScript, tương tác DOM, tính toán dữ liệu, và viết script kết nối Google Apps Script backend **SAU KHI người dùng đã đồng ý với layout giao diện**.
   - Phân tách module rõ ràng, chú thích code rành mạch.

---

## QUY TẮC 9: KỶ LUẬT GIT PUSH (CHỈ PUSH KHI CÓ LỆNH NGƯỜI DÙNG)
> [!WARNING]
> **Tuyệt đối KHÔNG tự ý chạy lệnh `git push` lên GitHub remote khi chưa có yêu cầu từ người dùng!**

1. Mọi công việc sửa đổi, tinh chỉnh, thêm tính năng mới phải được giữ ở **môi trường cục bộ (Local)** để thử nghiệm và kiểm tra.
2. Chỉ khi người dùng nói rõ ràng các câu lệnh như: *"Đẩy lên git đi"*, *"Push git nhé"*, *"Sync lên github"*... thì Trợ lý AI mới được phép thực hiện commit và push code lên GitHub remote.
3. Khi chưa có lệnh, chỉ báo cáo kết quả kiểm thử local cho người dùng xem xét.

---

## QUY TẮC 10: TIÊU CHUẨN CONTAINER 1200PX & CHỐNG VỠ LAYOUT (ZERO BROKEN LAYOUT)
> [!IMPORTANT]
> **Quy chuẩn bố cục bắt buộc cho toàn bộ trang web trong hệ thống:**
> Không bao giờ để thanh cuộn ngang xuất hiện trên trang toàn cục hoặc để văn bản dài làm biến dạng cột bảng.

1. **Chuẩn kích thước Container (`1200px - 1280px`):**
   - Mọi trang web (`index.html`, `lich_tuan.html`, `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`) đều sử dụng khung giới hạn `max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 16px;` (tương đương `max-w-7xl` trong Tailwind CSS).
   - Tối ưu tuyệt đối cho độ phân giải máy tính bàn cơ quan (1366x768 và 1920x1080), tạo khoảng đệm lề 2 bên đối xứng, mắt không bị mỏi khi đọc văn bản ngang quá dài.
2. **Khóa chống tràn toàn cục:**
   - Luôn áp dụng `html, body { overflow-x: hidden; width: 100%; }`.
3. **Cố định bảng biểu chuyên môn:**
   - Các bảng danh sách dữ liệu (Lịch tuần, Tiến độ, Lịch sử báo cáo) phải đặt bên trong container có `overflow-x: auto;`.
   - Bảng sử dụng `table-layout: fixed;` với độ rộng tối thiểu an toàn (`min-width: 1200px`).
   - Cột văn bản dài bắt buộc phải có `truncate` (hoặc `text-overflow: ellipsis`) và hỗ trợ bấm chuột mở Modal chi tiết.
4. **Quy tắc Flexbox & CSS Grid:**
   - Dùng Flexbox cho thanh Header, thanh công cụ, các nút bấm thao tác hàng ngang (1 chiều).
   - Dùng CSS Grid cho thẻ KPI tổng quan và lưới phân chia màn hình làm việc (2 chiều).
   - Các phần tử con trong Flex container phải có `min-w-0` để không bị bung kích thước khi chứa text dài.
