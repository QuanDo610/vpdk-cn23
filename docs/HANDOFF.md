# TÀI LIỆU BÀN GIAO CÔNG VIỆC DỰ ÁN "FAMILY CN23"
> **Hệ thống Cổng Dịch Vụ Nội Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23**  
> *Ngày cập nhật: 30/10/2026 | Phiên bản hoàn thiện: v3.8-UnifiedBaseLayout & DropdownAuth*

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

## 2. TỔNG HỢP CÁC CÔNG VIỆC HOÀN TẤT TRONG PHIÊN BẢN v3.7

### 2.1. Tái Cấu Trúc Điều Hướng: Bỏ Sidebar, Khôi Phục Thanh Điều Hướng Ngang Full-Width
1. **Loại bỏ hoàn toàn Sidebar bên trái:**
   - Xóa bỏ thanh Sidebar cố định theo chỉ đạo của người dùng để thu hồi 100% không gian bề ngang màn hình máy tính cơ quan, giúp các bảng biểu lớn (Lịch tuần, Tiến độ, Báo cáo) hiển thị thông thoáng và không bị co kéo.
2. **Thanh Header tập trung (Full-Width Topbar + Horizontal Nav Tabs):**
   - Giữ nguyên Header màu Xanh Hoàng Gia Royal Navy (`#1e3a8a`) với đường viền chỉ vàng kim Chi nhánh 23 (`#f59e0b`).
   - Tích hợp cụm Tab điều hướng ngang (`topbar-nav`) ngay chính giữa Header:
     * `Trang chủ` (`index.html`) - icon nhà
     * `Lịch tuần` (`lich_tuan.html`) - icon lịch
     * `IT Helpdesk` (`it_helpdesk.html`) - icon tai nghe
     * `Giao việc` (`giao_viec.html`) - icon danh sách
     * `Báo cáo tổ` (`bao_cao_to.html`) - icon biểu đồ
     * `Kho cài đặt` (Google Drive) - icon đám mây tải xuống
   - Tự động nhận diện URL đang duyệt để làm nổi bật tab tương ứng với màu Vàng Kim viền nét bóng (`#f59e0b`).
   - Tự động ẩn cụm điều hướng và khung cán bộ khi ở màn hình Đăng nhập `index.html`; tự động mở khi đăng nhập thành công.

### 2.2. Chuẩn Hóa Giao Diện Đăng Nhập (Căn Giữa Tuyệt Đối & Username `quandtm`)
1. **Căn giữa quang học 100%:**
   - Bố cục dạng thẻ nổi (.login-card) đặt trong flexbox wrapper `min-height: calc(100vh - var(--header-height))`, căn giữa hoàn hảo cả chiều dọc lẫn chiều ngang.
2. **Thẩm mỹ giao diện & Nhận diện cơ quan:**
   - Huy hiệu khiên bảo mật (`fa-shield-halved`), viền chỉ vàng kim trên đầu thẻ.
   - Nhập liệu Tên người dùng (username như `quandtm`) có icon người dùng bên trái, ô mật khẩu có icon chìa khóa và nút bật/tắt ẩn hiện mật khẩu bên trong ô input.
   - Dòng cam kết bảo mật nội bộ đạt chuẩn ở đáy form.

### 2.3. Sửa Triệt Để Lỗi Bảng Lịch Tuần ("Thời Gian & Thành Phần") & Chống Vỡ Khung 1280px
1. **Xử lý lỗi thẻ đóng HTML dư thừa:**
   - Dọn dẹp dứt điểm các thẻ đóng dư thừa (`</div></div></div></div></section></div>`) trên `lich_tuan.html` từng làm hỏng cây DOM và gây co giật giao diện.
2. **Cột Thời gian & Trạng thái chuyên nghiệp:**
   - Đồng bộ thành phần thời gian: icon đồng hồ thanh lịch, giờ bắt đầu - kết thúc rõ ràng, kèm nhãn trạng thái cuộc họp real-time (Sắp diễn ra, Đang diễn ra có chấm xanh nhấp nháy, Đã diễn ra gạch ngang).
3. **Cột Thành phần & Nội dung chống vỡ dòng:**
   - Cố định tỷ lệ độ rộng bảng (`table-layout: fixed; min-width: 1080px;`).
   - Áp dụng triệt để cơ chế kẹp dòng `-webkit-line-clamp: 2` kết hợp nút bấm **"Xem thêm »"** mở Popup toàn văn chi tiết, đảm bảo dù cán bộ nhập 500 ký tự danh sách thành phần họp cũng không bao giờ làm méo hay vỡ bảng.
4. **Phục hồi 100% tính năng & giao diện chuyên biệt trong `lich_tuan.css`:**
   - Phục hồi toàn bộ hệ thống Flatpickr Date/Time picker chủ đề Royal Navy & Gold Amber.
   - Phục hồi Modal xuất văn bản Word chuẩn Nghị định 30, Modal xem chi tiết lịch họp, thanh phân trang dữ liệu và bộ đếm ký tự.

### 2.5. Tích Hợp Thẻ Danh Ngôn Tinh Hoa Vĩ Nhân (200 Câu Ngẫu Nhiên) & Tối Giản Hóa Phân Hệ Dashboard
1. **Lời chào năng động theo thời gian thực (Time-Based Greeting):**
   - Tự động nhận diện khung giờ đăng nhập của cán bộ:
     * 🌅 `Chào buổi sáng / Good morning` (05:00 - 11:59) kèm icon mặt trời vàng kim rạng rỡ và lời chúc một ngày mới làm việc tràn đầy năng lượng.
     * ☀️ `Chào buổi chiều / Good afternoon` (12:00 - 17:59) kèm icon mây trời xanh mát và lời chúc buổi chiều làm việc tập trung, hoàn thành tốt nhiệm vụ.
     * 🌙 `Chào buổi tối / Good evening` (18:00 - 04:59) kèm icon ánh trăng tím dịu và lời chúc buổi tối bình an, thư thái bên gia đình.
2. **Thẻ Danh Ngôn Vĩ Nhân Nền Nã & Tri Thức (`hub-quote-card`):**
   - Đặt ngay trong khu vực Hero Banner sau khi đăng nhập, thiết kế dạng thẻ nổi thanh nhã nền trắng phối viền chỉ vàng kim Chi nhánh 23.
   - Tự động bốc ngẫu nhiên một câu nói từ kho tàng **200 danh ngôn thế giới** (`A_THANG/js/quotes_data.js` & `OUTPUT/cau_noi_vi_nhan.json`).
   - Hiển thị đầy đủ:
     * Câu trích dẫn tiếng Việt trang trọng (chữ nghiêng font lớn) & bản dịch/nguyên văn tiếng Anh.
     * Tên vĩ nhân, danh hiệu/thành tựu (Nobel, Triết gia, Nhà khoa học, Lãnh tụ...), niên đại lịch sử.
     * Nhãn chủ đề (Trí tuệ, Ý chí, Thành công, Đạo đức, Hạnh phúc...) và xuất xứ tác phẩm/bài phát biểu.
     * Nút **"Đổi câu khác"** (icon xúc xắc 🎲) để cán bộ chủ động đổi câu ngẫu nhiên với hiệu ứng mờ chuyển động mượt mà.
     * Nút **"Sao chép"** (icon 📋) hỗ trợ copy nhanh nội dung danh ngôn vào clipboard kèm thông báo Toast.
3. **Thu gọn & Tối giản hóa 4 Phân Hệ Nghiệp Vụ (`compact-modules-grid`):**
   - Lắng nghe chỉ đạo của người dùng: loại bỏ hoàn toàn các đoạn văn mô tả 4 dòng dài dòng, thừa thãi.
   - Thiết kế dạng lưới thẻ ngang nhỏ gọn, tinh tế (Compact Cards):
     * **Lịch công tác tuần** (`lich_tuan.html`): Hành chính & Chuẩn NĐ 30.
     * **IT Helpdesk máy tính** (`it_helpdesk.html`): Tin học & Hỗ trợ thiết bị.
     * **Lãnh đạo giao việc** (`giao_viec.html`): Điều hành & Giám sát tiến độ 82 cán bộ.
     * **Báo cáo tổ & KPI** (`bao_cao_to.html`): Chỉ tiêu 8 nhóm số liệu chuyên môn.
   - Toàn bộ 4 thẻ đều đang ở trạng thái kích hoạt (Active), bấm vào bất kỳ đâu trên thẻ đều chuyển trang tức thì.
   - Bổ sung nút liên kết nhanh tới **Kho phần mềm cài đặt cơ quan trên Google Drive** gọn gàng bên góc phải.

### 2.6. Chuẩn Hóa Base Layout Thống Nhất Toàn Hệ Thống (Header Tinh Gọn, User Dropdown, Slim Footer & 60-30-10 Palette)
1. **Tinh gọn Header (Topbar):**
   - Loại bỏ hoàn toàn thanh tab ngang rườm rà ở giữa để giải phóng diện tích, tạo không gian làm việc rộng rãi, hiện đại theo chuẩn Enterprise Portal.
   - Nút Icon Tòa nhà (`fa-solid fa-landmark`): Thiết kế hộp vàng kim công vụ nổi bật (`#d97706`), rê chuột có hiệu ứng phóng to và hào quang ánh sáng; click vào icon lập tức điều hướng về Trang chủ (`index.html`).
2. **Tích hợp Đăng xuất vào Menu Dropdown Cán Bộ:**
   - Khi nhấp vào Huy hiệu Cán bộ (Avatar + Tên + Chức danh) ở góc phải Header, menu Dropdown sổ xuống với hiệu ứng mượt mà.
   - Hiển thị đầy đủ: Ảnh đại diện cán bộ, họ tên, chức danh, nhãn trạng thái "Đang trực tuyến" (chấm xanh), liên kết về Trang chủ và Kho cài đặt nội bộ.
   - Nút "Đăng xuất tài khoản" màu đỏ cảnh báo (`#b91c1c`), tích hợp hộp thoại xác nhận an toàn, dọn dẹp sạch sẽ `sessionStorage` (`family_user`) và `localStorage`.
   - Hỗ trợ đóng tự động khi click ra ngoài hoặc bấm phím `Escape`.
3. **Chân trang mỏng gọn, trang nhã (Slim Compact Footer):**
   - Được `js/layout.js` và `css/base.css` tự động gắn vào cuối `<body>` của tất cả các phân hệ theo cơ chế Sticky Footer với chiều cao mỏng gọn (padding 10px), không chiếm diện tích màn hình.
   - Nội dung súc tích: *© 2026 VPĐKĐĐ TP.HCM - Chi nhánh số 23 • Phần mềm được phát triển bởi Đỗ Trọng Minh Quân*.
4. **Áp dụng Bảng màu 60-30-10 chuẩn `.agent/rules.md`:**
   - Cập nhật `css/variables.css` theo đúng quy chuẩn: 60% Nền trắng xám (`--color-bg-app: #f8fafc`), 30% Royal Navy (`--color-brand-navy: #1e3a8a`, `--color-brand-navy-dark: #0f172a`), 10% Vàng kim công vụ (`--color-accent: #d97706`).
   - Loại bỏ bộ chuyển "Tông màu" (theme switcher) trên Banner Danh ngôn vĩ nhân tại `index.html` để giao diện thuần nhất, trang trọng.
5. **Cung cấp Base Template & Tài liệu kiến trúc kế thừa:**
   - Tạo file `templates/base_app_template.html` làm khung mẫu chuẩn cho bất kỳ phân hệ nào được phát triển thêm trong tương lai.
   - Cập nhật tài liệu kiến trúc tại `docs/HUONG_DAN_TRIEN_KHAI.md` và `.agent/rules.md`.

---

## 2. TỔNG HỢP CÁC CÔNG VIỆC HOÀN TẤT TRONG PHIÊN BẢN v3.6

### 2.1. Chuẩn Hóa Toàn Diện Hệ Thống Grid 1200px & Flexbox (Chống Tuyệt Đối Vỡ Layout)
1. **Kiểm tra và sửa toàn bộ CSS / HTML trong hệ thống:**
   - Cập nhật `.main-content` và `.header-container` trong `css/style.css` sang chuẩn `max-width: 1280px; width: 100%; margin: 20px auto; padding: 0 16px; box-sizing: border-box;`.
   - Cập nhật toàn bộ thẻ Header và Main Container trên `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html` từ `max-w-[1720px]` về chuẩn đồng nhất `max-w-7xl` (1280px).
   - Thêm lớp khóa toàn cục `html, body { overflow-x: hidden; width: 100%; }` và `img, svg { max-width: 100%; }` ngăn chặn triệt để hiện tượng thanh cuộn ngang xuất hiện vô lý trên màn hình cơ quan.
   - Bổ sung `min-w-0` trên các thẻ Flex child chứa text dài và áp dụng `truncate` kết hợp Modal popup xem toàn văn.
   - Đảm bảo các bảng biểu dữ liệu chuyên môn (Lịch tuần, Tiến độ, Báo cáo) đều có `table-layout: fixed; min-width: 1200px;` đặt trong wrapper `overflow-x: auto;`.

2. **Cập nhật Bộ Quy Chuẩn Kỹ Thuật:**
   - Hợp nhất **Kiến Trúc Bố Cục 1280px & Flexbox Responsive Hiện Đại** vào [`.agent/rules.md`](file:///Users/admin/Desktop/FAMILY_CN23/.agent/rules.md).
   - Thiết lập **Tiêu Chuẩn Container 1280px & Chống Vỡ Layout (Zero Broken Layout)** làm quy tắc bắt buộc.

### 2.2. Hoàn Thành Chuyên Đề Tư Vấn Kiến Trúc Dữ Liệu & Khả Năng Mở Rộng
- Phân tích chi tiết 3 mô hình: **Google Sheets + Apps Script** vs **JSON Flat File** vs **Database Thực Thụ (Supabase/PostgreSQL/Firebase)**.
- Phân tích cặn kẽ tại sao JSON file không thể ghi trực tiếp trên GitHub Pages và dễ gặp lỗi Race Condition.
- Đánh giá dung lượng thực tế với 82 nhân sự CN23 (~5.000 - 12.000 dòng/năm) chứng minh Google Sheets hoàn toàn chạy tốt trong 2-3 năm tới.
- Đề xuất lộ trình công nghệ 2 giai đoạn:
  * **Giai đoạn 1 (Hiện tại):** Hybrid Caching (`localStorage` phản hồi tức thì 0ms + Background Sync lên Google Sheets).
  * **Giai đoạn 2 (Tương lai khi > 30.000 dòng hoặc mở rộng toàn TP):** Chuyển sang Supabase (PostgreSQL) kèm cơ chế sao lưu tự động (Mirror Backup) về Google Drive.
- Cập nhật đầy đủ vào tài liệu kiến trúc kỹ thuật của hệ thống.

### 2.3. Nâng Cấp Hệ Thống Menu Cố Định Bên Trái (Solid Royal Navy & Chế Độ Thu Gọn 3 Gạch)
1. **Màu sắc Solid Royal Navy thuần nhất:**
   - Chuyển màu nền Sidebar sang **Xanh Royal Navy thuần khiết (`#1e3a8a`)**, bỏ hoàn toàn hiệu ứng gradient chuyển màu.
   - Giữ đường viền chỉ vàng kim Chi nhánh 23 (`#f59e0b`) và hiệu ứng hover/active sáng rõ, trang nhã.
2. **Chuẩn hóa tên gọi menu gọn gàng (Không dùng Badge bên cạnh gây `...`):**
   - Đặt lại tên các mục rõ nghĩa, không bị rớt dòng:
     * `Trang chủ`
     * `Đăng ký lịch tuần`
     * `IT Helpdesk`
     * `Giao việc`
     * `Báo cáo số liệu`
     * `Kho cài đặt` (liên kết mở Google Drive)
   - Bỏ hoàn toàn các thẻ badge bên phải (Hub, NĐ 30, Online, 82 CB, Drive) để giải phóng toàn bộ chiều ngang cho chữ, đảm bảo văn bản hiển thị nguyên vẹn 100%, không bao giờ bị cắt thành dấu ba chấm `...`.
3. **Chuẩn hóa thông tin cơ quan tại đỉnh Sidebar:**
   - Đổi tiêu đề đỉnh Sidebar sang: **VP ĐĂNG KÝ ĐẤT ĐAI** &bull; *Chi nhánh số 23 &bull; Portal* (thay vì để Family CN23 vốn chỉ dành cho tên icon Desktop).

### 2.4. Tái Cấu Trúc CSS Phân Tầng (Modular CSS Architecture) & Header Dài Hết Màn Hình
1. **Kiến trúc Design Tokens `:root` & Hệ thống Component Chuẩn Hóa:**
   - Tạo mới `css/variables.css`: Quản lý tập trung toàn bộ biến `:root` (màu sắc cơ quan, kích thước layout 1280px, spacing, typography, radius, shadow).
   - Tạo mới `css/base.css`: Kế thừa `variables.css`, cung cấp các lớp tiện ích dùng chung chuẩn hóa Bootstrap-like (`.btn`, `.btn-primary`, `.card`, `.form-control`, `.badge`, `.app-container`, `.table-responsive`) và khóa toàn cục chống tràn ngang (`overflow-x: hidden`).
   - Tách riêng biệt từng file CSS cho từng trang:
     * `css/hub.css`: Giao diện Hub trung tâm & Form đăng nhập thẻ nổi.
     * `css/lich_tuan.css`: Bảng Lịch Tuần full-width & Hệ thống 2 Tab.
     * `css/it_helpdesk.css`: Lưới 2 cột tiếp nhận & Thẻ sự cố.
     * `css/giao_viec.css`: Thẻ KPI & Bảng theo dõi tiến độ.
     * `css/bao_cao_to.css`: Thẻ chỉ tiêu chuyên môn & Bảng số liệu.
2. **Top Header Chạy Dài Toàn Màn Hình (`app-topbar`) + Sidebar Dưới Header (`app-sidebar`):**
   - Tạo mới module `js/layout.js`: Tự động khởi tạo và chèn **Full-Width Topbar** (cố định `top: 0`, cao `62px`, rộng `100%`) hiển thị đầy đủ tên cơ quan: *VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI THÀNH PHỐ HỒ CHÍ MINH - CHI NHÁNH SỐ 23*, kèm nút 3 gạch `☰`, thông tin cán bộ đăng nhập và nút Đăng xuất.
   - Sidebar được gắn cố định trực tiếp **bên dưới Header** (`top: 62px; height: calc(100vh - 62px)`), giải quyết triệt để lỗi icon và nút 3 gạch chồng chéo lên nhau khi thu gọn.
   - Nút 3 gạch `☰` nằm trên Header: khi bấm, Sidebar thu gọn về chế độ **Mini Icon-Only (`68px`)**, nội dung trang tự động giãn rộng mượt mà, lưu trạng thái vào `localStorage`.
   - Đã đồng bộ liên kết CSS và `layout.js` vào 100% cả 5 trang HTML: `index.html`, `lich_tuan.html`, `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`.
3. **Tư Vấn Chuyên Sâu: Có Nên Dùng Bootstrap CDN Không?:**
   - **Khuyến nghị:** **KHÔNG NÊN** nhúng file Bootstrap CDN (`bootstrap.min.css`).
   - **Lý do:**
     * Bootstrap CDN mang bảng màu mặc định màu xanh dương Twitter (`#0d6efd`), làm mất tính nhận diện Xanh Hoàng Gia Royal Navy (`#1e3a8a`) và Vàng Kim (`#f59e0b`) của cơ quan.
     * Bootstrap CDN sẽ xung đột nghiêm trọng với các lớp Tailwind CDN đang dùng trên `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html` (do trùng lặp tên class `.container`, `.card`, `.badge`, `.collapse`, `.modal`, dẫn đến lỗi vỡ giao diện).
     * Bộ `variables.css` + `base.css` vừa xây dựng đã cung cấp đầy đủ các class thông dụng như Bootstrap nhưng nhẹ hơn, không có mã thừa và tương thích 100% với hệ sinh thái cơ quan.

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
     - Thiết kế chống rớt chữ: cố định độ rộng cột, văn bản dài tự động rút gọn `...`, rê chuột xem tooltip hoặc click vào bất kỳ dòng nào để mở **Modal Popup xem toàn văn chi tiết**.
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
- Cả 4 trang web ([index.html](file:///Users/admin/Desktop/FAMILY_CN23/index.html), [lich_tuan.html](file:///Users/admin/Desktop/FAMILY_CN23/lich_tuan.html), [it_helpdesk.html](file:///Users/admin/Desktop/FAMILY_CN23/it_helpdesk.html), [giao_viec.html](file:///Users/admin/Desktop/FAMILY_CN23/giao_viec.html), [bao_cao_to.html](file:///Users/admin/Desktop/FAMILY_CN23/bao_cao_to.html)) đều được tích hợp thanh điều hướng chéo giúp cán bộ chuyển đổi qua lại giữa bất kỳ phân hệ nào chỉ với 1 cú click mà không cần quay lại trang đăng nhập.

### 2.5. Nâng Cấp Backend Google Apps Script (`backend/google_apps_script.js`)
- Hỗ trợ toàn bộ 5 tab trên Google Sheet:
  - `TaiKhoan`: Quản lý tài khoản (Username, Mật khẩu, Chức vụ, Phòng ban)
  - `LichTuan`: Đăng ký lịch tuần
  - `Tickets`: Sự cố tin học & lưu ảnh Drive
  - `GiaoViec`: Quản lý 14 trường thông tin giao việc
  - `BaoCaoSoLieu`: Quản lý 32 trường thông tin 8 nhóm chỉ tiêu
- Cập nhật menu `⭐ BINHDUONG23` với lệnh **1-Click cấu hình chuẩn toàn bộ 5 phân hệ**.

### 2.6. Quy Chuẩn Quy Trình Làm Việc Mới (Bắt Buộc Tuân Thủ)
- **Pipeline 2 Giai Đoạn (Design-First):**
  1. *Giai đoạn 1 (Designer):* Dựng layout HTML/CSS, bố cục giao diện, thẻ, bảng biểu tĩnh. Trình bày người dùng xem và duyệt trước.
  2. *Giai đoạn 2 (Developer/Backend):* Chỉ viết script logic, tương tác JS, API và Google Apps Script sau khi người dùng đã chốt layout. Không làm gộp một mớ cùng lúc.
- **Kỷ Luật Git Push:**
  - Tuyệt đối KHÔNG tự ý push lên GitHub remote khi chưa có lệnh từ người dùng.
  - Toàn bộ việc phát triển và kiểm thử phải được thực hiện ở Local. Chỉ push khi người dùng chỉ đạo trực tiếp.

### 2.7. Nâng Cấp Đăng Nhập Bằng Cột Username (Tên + Họ Tên Lót Viết Tắt: Quân ĐTM)
- **Thuật toán sinh Username chuẩn:**
  - Quy tắc: Tên chính + Chữ cái đầu viết hoa của Họ và các Tên lót (Ví dụ: `Đỗ Trọng Minh Quân` -> `Quân ĐTM`, `Nguyễn Văn An` -> `An NV`).
  - Hỗ trợ công thức trực tiếp trên Google Sheets: `=TAO_USERNAME(C2)`.
  - Hỗ trợ menu 1-click trên Google Sheet: **`⭐ BINHDUONG23` -> `🔤 Tự động tạo & điền Username (Quân ĐTM)`**.
- **Cơ chế so khớp xác thực thông minh:**
  - Tự động nhận diện cột `Username` ở bất kỳ vị trí nào trong tab `TaiKhoan` (ưu tiên cột cuối bảng do người dùng thêm vào).
  - So khớp linh hoạt: không phân biệt hoa thường (`Quân ĐTM`, `quân đtm`), cho phép gõ liền (`quandtm`), và hỗ trợ gõ không dấu (`Quan DTM`).
  - Dự phòng 100%: Nếu ô `Username` trên Google Sheet chưa kịp điền, hệ thống tự động suy luận Username từ cột Họ tên để cán bộ đăng nhập ngay lập tức.
  - Hỗ trợ đăng nhập linh hoạt bằng Username hoặc Số điện thoại (Bảo mật tối đa thông tin cá nhân, không hiển thị số CCCD lên website).
- **Đồng bộ giao diện Web Portal (`index.html`):**
  - Ô đăng nhập hỗ trợ nhập Username (ví dụ `quandtm`), bỏ ràng buộc `numeric` để cán bộ thoải mái gõ chữ.
  - Nhãn hiển thị và cơ chế lưu trữ phiên làm việc cập nhật đồng bộ.

---

### 2.6. Đồng Bộ Giao Diện IT Helpdesk Theo Chuẩn Lịch Tuần (2-Tab UX & Container 1280px)
1. **Thiết kế lại phân hệ IT Helpdesk theo UX Lịch Tuần:**
   - **Mặc định khi vào trang:** Hiển thị toàn màn hình (100% width) Bảng Theo Dõi & Hàng Đợi Xử Lý (`#listSection`), giải phóng hoàn toàn không gian chật chội của bố cục 2 cột cũ.
   - **Thanh chuyển Tab đồng bộ (`.schedule-tab-nav`):**
     * Tab 1: `1. Bảng Theo Dõi Sự Cố (Monitoring)` (active mặc định).
     * Tab 2: `2. Báo Sự Cố Mới (Tạo Ticket)` (kèm nút nhanh `+ Báo Sự Cố Mới`).
   - **Form đăng ký rộng rãi (`#formSection`):** Đặt ở vị trí trung tâm thoáng đãng (`max-width: 880px; margin: 0 auto; width: 100%`), có nút "Quay lại bảng sự cố" tiện lợi.
   - **Tự động chuyển view:** Sau khi nộp ticket thành công, hệ thống tự động chuyển về Tab 1 (`list`) để cán bộ thấy ngay ticket vừa tạo ở đầu danh sách.
   - **Tương tác bong bóng hỗ trợ:** Nút Zalo/IT ở góc dưới bên phải được liên kết kích hoạt chuyển trực tiếp sang Tab nộp ticket.
   - **Bảo toàn 100% chức năng:** Giữ nguyên toàn bộ ID và logic kết nối Google Apps Script (`SCRIPT_URL`), tự động quét thông số máy/IP, hỗ trợ `Ctrl+V` nén ảnh canvas siêu nhẹ, 3 modal (Chi tiết ticket, Phóng to ảnh Drive, Thông báo thành công).

2. **Chuẩn hóa chiều rộng Container 1280px trên toàn bộ hệ thống:**
   - Áp dụng thống nhất class `main-content app-container max-w-7xl` trên tất cả 4 phân hệ (`lich_tuan.html`, `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`) và `templates/base_app_template.html`.
   - Đảm bảo layout không bị co lệch, vỡ dòng hay lệch mép khi cán bộ chuyển đổi qua lại giữa các phân hệ trên màn hình máy tính cơ quan.

---

## 3. CẤU TRÚC THƯ MỤC HOÀN CHỈNH HIỆN TẠI

```text
FAMILY_CN23/
│
├── .agent/
│   └── rules.md                    # QUY CHUẨN DUY NHẤT & TỐI THƯỢNG (Single Source of Truth)
│
├── index.html                      # Cổng Dịch Vụ Nội Bộ Hub (Lưới 4 phân hệ)
├── lich_tuan.html                  # Phân hệ 1: Đăng ký lịch tuần & Xuất Word NĐ 30
├── it_helpdesk.html                # Phân hệ 2: IT Helpdesk tiếp nhận & chẩn đoán sự cố
├── giao_viec.html                  # Phân hệ 3: Lãnh đạo giao việc & Bảng tiến độ
├── bao_cao_to.html                 # Phân hệ 4: Báo cáo số liệu thực hiện cấp Tổ & KPI
│
├── css/                            # Bảng định kiểu phân tầng (Modular CSS, No CDN)
│   ├── variables.css               # Design System Tokens (:root biến toàn cục, 60-30-10)
│   ├── base.css                    # Khung giao diện App Shell, Reset & Utilities
│   ├── utilities.css               # Bộ tiện ích CSS tĩnh thuần thay thế Tailwind Play CDN
│   ├── hub.css                     # Stylesheet chuyên biệt Cổng Hub trung tâm & Đăng nhập
│   ├── lich_tuan.css               # Stylesheet chuyên biệt Đăng ký Lịch tuần & 2-Tab Switcher
│   ├── it_helpdesk.css             # Stylesheet chuyên biệt IT Helpdesk Máy Tính
│   ├── giao_viec.css               # Stylesheet chuyên biệt Lãnh Đạo Giao Việc & Tiến Độ
│   ├── bao_cao_to.css              # Stylesheet chuyên biệt Báo Cáo Số Liệu Tổ & KPI
│   └── flatpickr.min.css           # Thư viện chọn ngày tháng offline
│
├── js/                             # JavaScript thuần (Vanilla JS ES6+ Modular)
│   ├── auth.js                     # Module Route Guard & Xác thực phiên family_user
│   ├── layout.js                   # Layout Controller (Topbar 60px tinh gọn, User Dropdown, Slim Footer)
│   ├── app.js                      # Logic phân hệ Lịch tuần
│   ├── flatpickr.min.js            # Thư viện Datepicker offline
│   └── test_suite.js               # Bộ kiểm thử tự động
│
├── backend/                        # Mã nguồn máy chủ Google Apps Script
│   └── google_apps_script.js       # API Gateway xử lý Auth, 5 Sheet Tabs, Drive upload
│
├── assets/                         # Toàn bộ tài nguyên tĩnh duy nhất
│   ├── icons/                      # Bộ nhận diện Pikachu & VPĐK (.ico)
│   ├── images/                     # Ảnh xem trước (preview png)
│   ├── installer/                  # Bộ cài đặt phím tắt Desktop 1-Click (.bat, .zip)
│   └── templates/                  # Biểu mẫu gốc BM_bao_cao...html & Word mẫu
│
├── templates/                      # Khung mẫu phân hệ chuẩn tái sử dụng
│   └── base_app_template.html      # Khung HTML tích hợp sẵn Base Layout & Route Guard
│
├── docs/                           # TẬP TRUNG TOÀN BỘ FILE TÀI LIỆU (.md)
│   ├── QUY_CHUAN_MA_NGUON.md       # Cẩm nang tham chiếu viết mã nguồn (HTML, CSS, JS, Markdown)
│   ├── QUY_TRINH_SDLC.md           # Quy trình phát triển linh hoạt (Agile Frontend) & Kế hoạch bảo mật
│   ├── SPEC_WORKFLOW_TESTING.md    # Đặc tả nghiệp vụ & Kịch bản kiểm thử (cho AI khác/test runner)
│   ├── BAO_CAO_AN_NINH.md          # Báo cáo đánh giá an toàn thông tin & khắc phục lỗ hổng
│   ├── HUONG_DAN_TRIEN_KHAI.md     # Hướng dẫn cấu hình Google Sheet & Google Apps Script
│   ├── HANDOFF.md                  # Nhật ký bàn giao kỹ thuật này
│   └── task.md                     # Quản lý danh mục nhiệm vụ
│
├── pikachu_badge.ico               # Giữ tại root phục vụ URL tải trực tiếp từ GitHub
├── Family_CN23_Desktop.zip         # Giữ tại root phục vụ URL tải trực tiếp từ GitHub
└── README.md                       # Trang bìa GitHub tổng quan điều hướng vào docs/
```
