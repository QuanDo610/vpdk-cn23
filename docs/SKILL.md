# BỘ KỸ NĂNG & QUY CHUẨN KỸ THUẬT WEB (SKILL.md)
### Hệ Thống Web Portal "Family CN23" - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23

> **Mục đích:** Tài liệu hướng dẫn chi tiết về kỹ thuật lập trình Frontend thuần (Vanilla HTML/CSS/JS), danh mục CDN chuẩn, và **Bảng mã màu hệ thống (Design System Tokens)** để đảm bảo mọi trang web con (Lịch tuần, IT Helpdesk, Giao việc, Báo cáo tổ) đều có giao diện đồng nhất 100%, không bao giờ bị "lạc quẻ".

---

## 1. Công Nghệ Cốt Lõi (Vanilla Web Stack)

### 1.1. Triết Lý Phát Triển
- **Zero Build Step:** Hoạt động hoàn toàn trên trình duyệt mà không cần cài đặt Node.js, npm, Webpack, Vite hay bất kỳ công cụ biên dịch nào.
- **Tương thích cao:** Chạy mượt mà trên Chrome, Microsoft Edge, Firefox, Cốc Cốc, Safari (macOS & iOS), và WebView trên điện thoại di động.
- **Tốc độ tải tức thì:** Kích thước nhẹ, ưu tiên tải bất đồng bộ (async/defer) và tận dụng bộ nhớ đệm CDN toàn cầu.

### 1.2. Thư Viện CDN Chuẩn Được Sử Dụng

| Tên Thư Viện | CDN URL | Phiên Bản | Mục Đích Sử Dụng |
|---|---|---|---|
| **Tailwind CSS CDN** | `https://cdn.tailwindcss.com` | Latest | Phục vụ tạo layout nhanh, tiện ích responsive, spacing |
| **Font Awesome 6** | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css` | 6.5.1 | Toàn bộ biểu tượng icon giao diện (Solid, Regular, Brands) |
| **Google Fonts** | `Plus Jakarta Sans` & `JetBrains Mono` | Google CDN | Phông chữ hiện đại, rõ nét cho giao diện quản trị cơ quan |
| **Flatpickr (Date)** | `css/flatpickr.min.css` & `js/flatpickr.min.js` | 4.6.13 (Local) | Bộ chọn ngày/tháng/năm định dạng Việt Nam (`DD/MM/YYYY`) |
| **Docx Engine** | `https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js` | 8.5.0 | Tạo tài liệu Microsoft Word (.docx) chuẩn thể thức NĐ 30/2020 |
| **FileSaver.js** | `https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js` | 2.0.5 | Kích hoạt lưu file tải về trình duyệt an toàn |
| **SheetJS (XLSX)** | `https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js` | 0.18.5 | Đọc/Xuất dữ liệu Excel (.xlsx, .csv) cho báo cáo số liệu |

---

## 2. Bảng Mã Màu Chuẩn Hệ Thống (Official Design System Tokens)

> [!IMPORTANT]
> **Quy định bắt buộc:** Mọi trang web mới khi tạo ra (`giao_viec.html`, `bao_cao_to.html`...) BẮT BUỘC phải dùng đúng các mã Hex bên dưới, tuyệt đối không tự ý dùng các mã màu ngẫu nhiên.

### 2.1. Màu Thương Hiệu Chủ Đạo (Primary Brand - Royal Navy)
Tượng trưng cho sự uy nghiêm, kỷ cương và chuyên nghiệp của cơ quan nhà nước.

| Tên Token | Mã HEX | Tailwind Class | CSS Variable | Ứng Dụng Thực Tế |
|---|---|---|---|---|
| **Navy Dark (Chính)** | `#1e3a8a` | `bg-blue-900` | `--primary-header` | Màu nền thanh Header chính thức, tiêu đề lớn |
| **Navy Royal (Nút bấm)** | `#1e40af` | `bg-blue-800` | `--primary` | Nút bấm chính (Submit), trạng thái Hover |
| **Blue Action (Điểm nhấn)** | `#2563eb` | `bg-blue-600` | `--primary-focus` | Nút bấm tương tác, đường viền khi Focus vào ô nhập |
| **Navy Soft Tint (Nền phụ)** | `#eff6ff` | `bg-blue-50` | `--primary-light` | Nền thẻ đang chọn, ô tìm kiếm, viền hộp thoại |

### 2.2. Màu Nhận Diện Chi Nhánh 23 (Accent Brand - CN23 Gold & Amber)
Tạo điểm nhấn thị giác ấm áp, đồng bộ với màu sắc chú Pikachu nhận diện của hệ thống.

| Tên Token | Mã HEX | Tailwind Class | CSS Variable | Ứng Dụng Thực Tế |
|---|---|---|---|---|
| **Gold Primary** | `#f59e0b` | `bg-amber-500` | `--accent-gold` | Đường chỉ viền dưới Header (3px solid), huy hiệu nổi bật |
| **Gold Hover / Border** | `#d97706` | `bg-amber-600` | `--accent-gold-dark`| Trạng thái hover của nút màu vàng, icon chú ý |
| **Gold Bright** | `#fbbf24` | `bg-amber-400` | `--accent-gold-light`| Huy hiệu đặc biệt, viền card VIP |
| **Gold Soft Tint** | `#fef3c7` | `bg-amber-50` | `--accent-gold-tint` | Nền nhãn cảnh báo nhẹ, thẻ tóm tắt nổi bật |

### 2.3. Màu Nền & Màu Trung Tính (Neutrals & Backgrounds)

| Tên Token | Mã HEX | Tailwind Class | CSS Variable | Ứng Dụng Thực Tế |
|---|---|---|---|---|
| **App Canvas (Nền web)** | `#f8fafc` | `bg-slate-50` | `--bg-main` | Màu nền toàn bộ trang web (dịu mắt, không chói) |
| **Surface (Nền Card)** | `#ffffff` | `bg-white` | `--bg-card` | Nền các thẻ Card nội dung, Bảng dữ liệu |
| **Border Slate** | `#e2e8f0` | `border-slate-200` | `--border` | Đường kẻ phân cách, viền ô nhập liệu cơ bản |
| **Border Active** | `#cbd5e1` | `border-slate-300` | `--border-active` | Viền ô input khi hover, đường kẻ bảng table |
| **Text Primary** | `#0f172a` | `text-slate-900` | `--text-main` | Màu chữ chính (tiêu đề, nhãn input, nội dung quan trọng) |
| **Text Secondary** | `#475569` | `text-slate-600` | `--text-secondary`| Nội dung văn bản thường, mô tả ngắn |
| **Text Muted** | `#64748b` | `text-slate-500` | `--text-muted` | Gợi ý dưới ô nhập (hint), ghi chú phụ |

### 2.4. Bảng Màu Trạng Thái Nghiệp Vụ (Status & Badges)

```text
┌─────────────────┬───────────┬───────────┬───────────┬──────────────────────────────────────────┐
│ Trạng Thái      │ Chữ (Text)│ Nền (Bg)  │ Viền (Bdr)│ Sử Dụng Cho                              │
├─────────────────┼───────────┼───────────┼───────────┼──────────────────────────────────────────┤
│ HOÀN THÀNH      │  #16a34a  │  #dcfce7  │  #86efac  │ Nhiệm vụ xong, Sự cố đã xử lý, Đúng hạn  │
│ ĐANG XỬ LÝ      │  #ea580c  │  #ffedd5  │  #fdba74  │ Nhiệm vụ đang làm, Sự cố đang kiểm tra   │
│ CHỜ DUYỆT / MỚI │  #0284c7  │  #e0f2fe  │  #7dd3fc  │ Lịch mới đăng ký, Phiếu giao việc mới    │
│ QUÁ HẠN / HỎA TỐC│ #dc2626  │  #fee2e2  │  #fca5a5  │ Quá hạn xử lý, Mức độ ưu tiên cao nhất  │
└─────────────────┴───────────┴───────────┴───────────┴──────────────────────────────────────────┘
```

---

## 3. Khung Giao Diện Chuẩn (UI Component Templates)

### 3.1. Cấu Trúc Header Nhất Quán Toàn Hệ Thống
Mọi trang con đều nhúng thanh Header này để cán bộ dễ dàng nhận biết đơn vị và chuyển đổi phân hệ:

```html
<header class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-md border-b-[3px] border-amber-500 py-3 px-4 sm:px-6">
  <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
    <!-- Tiêu đề cơ quan -->
    <div>
      <p class="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
        Văn phòng Đăng ký đất đai TP. Hồ Chí Minh
      </p>
      <h1 class="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
        <i class="fa-solid fa-folder-tree text-amber-400"></i>
        <span>TÊN PHÂN HỆ CÔNG TÁC</span>
      </h1>
      <p class="text-[11px] text-slate-200 font-medium">Chi nhánh số 23 &bull; Family CN23</p>
    </div>

    <!-- Khu vực Cán bộ đăng nhập & Nút quay về Hub -->
    <div class="flex items-center gap-2.5">
      <a href="index.html" class="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-xl border border-white/20 transition shadow-sm">
        <i class="fa-solid fa-house"></i>
        <span class="hidden sm:inline">Trang Chủ Hub</span>
      </a>
      <div id="headerUserBadge" class="flex items-center gap-2 bg-blue-950/60 border border-blue-400/30 px-3 py-1 rounded-xl">
        <i class="fa-solid fa-circle-user text-amber-400 text-sm"></i>
        <div class="text-left text-xs leading-tight">
          <p id="headerUserName" class="font-bold text-white">Đang tải...</p>
          <p id="headerUserRole" class="text-[10px] text-slate-300">Chi nhánh 23</p>
        </div>
      </div>
      <button id="btnLogout" class="text-xs bg-rose-600/80 hover:bg-rose-600 text-white font-semibold px-2.5 py-1.5 rounded-xl transition">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  </div>
</header>
```

### 3.2. Chuẩn Xử Lý Bảng Dữ Liệu Desktop (Không Bể Chữ)
Để tránh rớt dòng chữ xấu xí trên màn hình máy tính bàn:
1. Đặt thuộc tính bảng `table-layout: fixed; width: 100%;`.
2. Gán độ rộng phần trăm hoặc pixel cụ thể cho từng cột.
3. Sử dụng lớp rút gọn văn bản `truncate` (hoặc `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`).
4. Khi người dùng click vào ô, mở Modal Popup chi tiết hiển thị toàn bộ nội dung.

```html
<!-- Mẫu ô bảng biểu an toàn không bao giờ làm vỡ layout -->
<td class="px-3 py-2.5 max-w-[160px] truncate cursor-pointer hover:text-blue-600" 
    onclick="showDetailPopup('Chi tiết nội dung...', 'Tên máy: PC-01')" 
    title="Nhấn để xem toàn bộ nội dung">
  Nội dung rất dài sẽ tự động hiển thị dấu ba chấm...
</td>
```

---

## 4. Chuẩn Kết Nối API Google Apps Script (REST Client Pattern)

Để vượt qua giới hạn CORS của Google Apps Script và tối ưu tốc độ phản hồi:

```javascript
// Cấu hình URL Web App Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

// Hàm gửi dữ liệu tiêu chuẩn (Hỗ trợ POST + Dự phòng GET fallback)
async function sendDataToGoogleSheet(action, payload) {
  const requestBody = { action: action, ...payload };
  
  try {
    // Ưu tiên 1: Gửi bằng POST với header text/plain để tránh CORS preflight bị chặn
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(requestBody)
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (postError) {
    console.warn("POST failed, falling back to GET...", postError);
  }

  // Ưu tiên 2: Cơ chế dự phòng bằng GET
  const param = encodeURIComponent(JSON.stringify(requestBody));
  const fallbackRes = await fetch(`${SCRIPT_URL}?action=${action}&data=${param}`);
  return await fallbackRes.json();
}
```

---

## 5. Kiến Trúc Bố Cục 1200px Grid System & Flexbox Responsive Hiện Đại

### 5.1. Tại Sao Lại Là 1200px / 1280px (Tiêu Chuẩn Vàng Của Thiết Kế Web)?
1. **Toán học hoàn hảo:** Số 1200 (hoặc hệ 12 cột) chia hết cho **2, 3, 4, 6, 12**. Điều này cho phép chia layout thành 2 nửa (50%-50%), 3 cột (33.3%), 4 thẻ KPI (25%), hoặc chia tỷ lệ form 1/3 - 2/3 (4 cột - 8 cột) một cách chính xác tuyệt đối mà không bao giờ bị lẻ pixel hay bị lỗi làm tròn kích thước trên các trình duyệt khác nhau.
2. **Khớp chính xác với thực tế màn hình máy tính cơ quan nhà nước:**
   - Đa số máy tính bàn văn phòng và laptop cán bộ sử dụng 2 độ phân giải chủ đạo:
     - **1366x768 px** (Màn hình laptop 14 inch, màn hình vi tính 18.5 - 19.5 inch văn phòng).
     - **1920x1080 px** (Màn hình Full HD 21.5 - 24 inch hiện đại).
   - Khi áp dụng container chuẩn `max-width: 1200px` (hoặc `1280px` / `max-w-7xl` có 16px - 24px padding hai bên):
     - Trên màn hình **1366px**: Container chiếm khoảng 1280px, để lại mỗi bên khoảng `43px` lề trắng đối xứng, **vừa vặn 100% trong tầm mắt, không phát sinh thanh cuộn ngang khó chịu**.
     - Trên màn hình **1920px**: Khung nội dung tập trung ở giữa, tránh tình trạng dòng chữ bị kéo dãn quá dài (vượt quá 80 ký tự/dòng) gây mỏi mắt cho cán bộ khi đọc văn bản hành chính.

### 5.2. Phân Định Rõ Ràng: Khi Nào Dùng Flexbox & Khi Nào Dùng CSS Grid?

| Công Nghệ | Bố Cục | Trường Hợp Sử Dụng Điển Hình | Code Mẫu Chuẩn |
|---|---|---|---|
| **Flexbox** (1 Chiều - 1D) | Xếp theo hàng ngang (`row`) hoặc cột dọc (`column`), căn chỉnh khoảng cách, co giãn linh hoạt | - Thanh Header điều hướng.<br>- Hàng nút thao tác, bộ lọc tìm kiếm.<br>- Thẻ Huy hiệu trạng thái (Badge, Icon + Chữ).<br>- Căn giữa nội dung Modal Popup. | `display: flex; align-items: center; justify-between; gap: 12px;` |
| **CSS Grid** (2 Chiều - 2D) | Phân chia thành hàng và cột ma trận có kích thước cố định hoặc tự động tính toán | - Dãy thẻ KPI tổng quan (4 cột hoặc 5 cột).<br>- Không gian làm việc 2 cột: Cột trái nhập form (390px), Cột phải bảng dữ liệu (`1fr`).<br>- Lưới ứng dụng trung tâm Portal Hub. | `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;` |

### 5.3. Bộ 5 Quy Tắc Vàng Chống Tuyệt Đối Vỡ Layout (Zero Broken Layout)

1. **Khóa chống tràn toàn trang (Global Overflow Lock):**
   ```css
   html, body {
     width: 100%;
     overflow-x: hidden; /* Ngăn chặn triệt để thanh cuộn ngang vô tình xuất hiện */
   }
   img, svg {
     max-width: 100%;
     height: auto;
   }
   ```
2. **Quy tắc `min-w-0` trên Flex Child:**
   Mặc định các thẻ con trong `flex` có thuộc tính `min-width: auto`. Khi chứa văn bản dài, thẻ con sẽ tự nở rộng ra ngoài container gây vỡ layout. Bắt buộc phải thêm `min-w-0` (hoặc `min-width: 0`) kèm theo `truncate` để dấu ba chấm `...` kích hoạt chính xác:
   ```html
   <div class="flex items-center gap-3">
     <div class="min-w-0 flex-1">
       <p class="font-bold truncate">Nội dung văn bản công văn rất dài...</p>
     </div>
   </div>
   ```
3. **Quy tắc cố định bảng biểu Desktop (`table-layout: fixed`):**
   Tất cả các bảng dữ liệu chuyên môn (Lịch tuần, Tiến độ giao việc, Báo cáo số liệu tổ) bắt buộc phải có cấu trúc:
   ```html
   <div class="overflow-x-auto w-full">
     <table class="w-full text-left text-xs border-collapse" style="table-layout: fixed; min-width: 1200px;">
       <!-- Các cột <th class="w-40">...</th> được định vị độ rộng cố định -->
     </table>
   </div>
   ```
4. **Quy tắc xem chi tiết (Ellipsis + Click Modal):**
   Mọi cột có độ dài văn bản không dự đoán trước được (Tên công việc, Nội dung kiến nghị, Vướng mắc) phải được cắt gọn bằng dấu ba chấm và gắn sự kiện click để bật Popup xem toàn bộ nội dung.
5. **Điểm ngắt Responsive chuẩn (Breakpoints Hierarchy):**
   - `< 640px` (Điện thoại): Chuyển bảng biểu thành danh sách thẻ dọc, form xếp 1 cột.
   - `640px - 1024px` (Tablet / Màn hình nhỏ): Grid 2 cột cho các thẻ KPI, bảng biểu cuộn ngang mượt mà trong khung.
   - `≥ 1024px` (Laptop / Màn hình cơ quan): Kích hoạt hoàn toàn bố cục Desktop hoàn chỉnh, chia form 2 bên, hiển thị đầy đủ bảng dữ liệu.

---

## 6. Kiến Trúc Dữ Liệu & Khả Năng Mở Rộng (Data Architecture: Sheet vs Database vs JSON)

### 6.1. So Sánh Chi Tiết 3 Phương Án Dữ Liệu

| Tiêu Chí | 🟢 Google Sheets + Apps Script (Hiện tại) | 🟡 JSON Flat File (Tệp tĩnh) | 🔵 Database Thực Thụ (Supabase / PostgreSQL / Firebase) |
|---|---|---|---|
| **Dung lượng lưu trữ** | 10 triệu ô tính (~100.000 dòng dữ liệu). | Giới hạn theo dung lượng file (vài MB đến vài chục MB). | Vô hạn (hàng chục GB, hàng triệu dòng). |
| **Tốc độ đọc/ghi (Latency)** | Đọc: 300 - 800ms.<br>Ghi: 800ms - 1.5s (do Google Cloud overhead). | Đọc: Siêu nhanh (< 50ms).<br>Ghi: Rất chậm hoặc **bất khả thi** trên web tĩnh. | Đọc & Ghi: Cực nhanh (< 50ms), hỗ trợ hàng nghìn request/giây. |
| **Khả năng đồng thời (Concurrency)** | Tối đa ~30 kết nối đồng thời, quota ~300 read/phút. | Không hỗ trợ ghi đồng thời (bị lỗi Race Condition, ghi đè file). | Xử lý hoàn hảo hàng nghìn người dùng đồng thời, giao dịch ACID an toàn. |
| **Tính tiện dụng cho Lãnh đạo** | **VÔ ĐỊCH:** Ban Giám đốc và Tổ trưởng mở trực tiếp trên Google Drive, điện thoại, xuất file Excel dễ dàng không cần IT hỗ trợ. | Thấp: Phải tải file về mở bằng công cụ kỹ thuật. | Trung bình: Cần lập trình thêm trang Quản trị (Admin CMS) để người không rành IT xem dữ liệu. |
| **Chi phí vận hành** | **0 VNĐ (Miễn phí 100% trọn đời)**. | 0 VNĐ. | Miễn phí ở mức cơ bản (Free tier), có thể phát sinh chi phí nếu dữ liệu vượt hạn mức. |
| **Phù hợp với CN23** | **RẤT PHÙ HỢP trong giai đoạn 1 - 2 năm tới.** | **KHÔNG PHÙ HỢP để làm cơ sở dữ liệu đọc/ghi.** | **Phương án nâng cấp tương lai khi hệ thống quy mô lớn.** |

### 6.2. Tại Sao Tệp JSON Không Thể Dùng Làm Cơ Sở Dữ Liệu Ghi Trên Web Tĩnh?
1. **GitHub Pages là Hosting tĩnh (Static Only):** Trình duyệt của người dùng chỉ có thể *tải về* file JSON để đọc (`fetch('data.json')`). Trình duyệt **hoàn toàn không có quyền ghi đè** lên file JSON trên máy chủ GitHub.
2. **Nếu ghi qua GitHub API:** Phải lưu Token bí mật (Personal Access Token) ngay trên trình duyệt (nguy cơ lộ mật mã bảo mật), mỗi lần bấm lưu phải commit 1 lần vào Git (mất 30-60 giây để GitHub Pages build lại), làm rác lịch sử commit của dự án.
3. **Xung đột ghi đè (Race Condition):** Nếu Cán bộ A và Cán bộ B cùng gửi báo cáo tại cùng một giây, bản ghi của người gửi sau sẽ xóa sạch bản ghi của người gửi trước.

> [!NOTE]
> **Kết luận về JSON:** Tệp JSON chỉ nên dùng để lưu danh mục tĩnh (ví dụ: Danh sách mã 82 cán bộ, danh mục các tổ phòng ban), không dùng làm nơi lưu dữ liệu nghiệp vụ thay đổi thường xuyên.

### 6.3. Đánh Giá Khả Năng Đáp Ứng Thực Tế Của Google Sheets Với Chi Nhánh 23
- Chi nhánh số 23 có tổng cộng **82 cán bộ nhân viên**.
- Tần suất sử dụng trung bình mỗi ngày:
  - Lịch công tác tuần: ~20 - 40 lượt đăng ký/tuần.
  - IT Helpdesk: ~5 - 15 sự cố/ngày.
  - Lãnh đạo giao việc: ~10 - 30 nhiệm vụ/ngày.
  - Báo cáo số liệu tổ: ~3 - 10 báo cáo/tháng.
- **Tổng lượng bản ghi tạo ra mỗi năm:** Khoảng **5.000 đến 12.000 dòng**.
- **Kết luận chuyên môn:** Google Sheets hoàn toàn xử lý nhẹ nhàng quy mô dữ liệu này trong vòng **2 đến 3 năm tới** mà không gặp bất kỳ hiện tượng quá tải nào, miễn là áp dụng đúng cơ chế tối ưu bộ nhớ đệm bên dưới.

### 6.4. Lộ Trình Công Nghệ Chiến Lược (2 Giai Đoạn)

#### Giai Đoạn 1: Chiến Lược Bộ Đệm Lai (Hybrid Caching - Áp Dụng Ngay Hiện Tại)
- **Cơ chế lưu trữ:**
  1. Khi người dùng bấm *Lưu / Phát lệnh / Báo cáo*, dữ liệu được ghi tức thì vào `localStorage` của trình duyệt. Giao diện người dùng lập tức hiển thị dữ liệu mới với độ trễ **0 mili-giây** (trải nghiệm mượt mà tức thì).
  2. Một tiến trình ngầm (Background Async Task) sẽ gửi dữ liệu lên Google Apps Script để ghi vào Google Sheet.
  3. Khi mở trang web, hệ thống ưu tiên đọc ngay dữ liệu từ cache `localStorage`, sau đó mới kiểm tra phiên bản mới từ Google Sheet để cập nhật.
- **Lợi ích:** Tránh việc trình duyệt phải chờ 1-2 giây mỗi khi bấm nút; giảm tải 80% số lượng request đọc lặp lại lên Google Sheet.

#### Giai Đoạn 2: Nâng Cấp Lên Database Đám Mây Chuyên Nghiệp (Khi Dữ Liệu > 30.000 Dòng)
- **Khi nào cần chuyển đổi?**
  - Khi hệ thống mở rộng phục vụ cho toàn bộ 24 Chi nhánh trên địa bàn TP. Hồ Chí Minh (hàng nghìn cán bộ truy cập đồng thời).
  - Hoặc khi tổng số bản ghi vượt quá 30.000 dòng khiến việc mở Google Sheet bị đơ lag.
- **Giải pháp chuyển đổi khuyến nghị: Supabase (PostgreSQL Cloud):**
  - Supabase cung cấp hệ cơ sở dữ liệu PostgreSQL chuẩn công nghiệp, có gói Miễn phí (Free Tier) cực kỳ hào phóng (500MB DB, 50.000 người dùng hoạt động/tháng).
  - Có SDK JavaScript gọi trực tiếp từ trình duyệt bảo mật bằng Row Level Security (RLS).
  - **Cơ chế sao lưu song song (Mirror Sync):** Cài đặt một script tự động chạy hàng đêm (Nightly Cron Job) xuất một bản sao lưu toàn bộ bảng từ Supabase sang Google Sheet, giúp Lãnh đạo vẫn duy trì thói quen mở file Sheet trên Google Drive để xem nhanh báo cáo.

---

## 7. Kiến Trúc Menu Cố Định Bên Trái (Solid Royal Navy Sidebar & Collapsible Mode)

### 7.1. Cấu Trúc Tổng Quan (Shell Architecture)
Để chấm dứt hoàn toàn tình trạng Header mỗi trang một kiểu và thiếu đồng bộ, toàn bộ hệ thống sử dụng module Sidebar dùng chung:
- **Tệp CSS:** `css/sidebar.css`
- **Tệp JS:** `js/sidebar.js`
- **Màu nền:** Xanh Royal Navy thuần nhất (`#1e3a8a`), không dùng gradient, tạo cảm giác sang trọng, trang nghiêm và đồng bộ tuyệt đối với nhận diện thương hiệu cơ quan.

```
┌──────────────────────────────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR MENU (Mở rộng 260px / 72px) │ WORKSPACE NỘI DUNG CHÍNH (FULL CHIỀU CAO 100%)       │
│  - Logo cơ quan + Nút 3 gạch toggle  │ - Bỏ Header trên Desktop để giải phóng ~80px         │
│  ----------------------------------  │ - Tiêu đề trang tối giản, tinh tế đầu mỗi phân hệ    │
│  PHÂN HỆ LÀM VIỆC:                   │                                                      │
│  [🏠 Trang chủ]                      │                                                      │
│  [📅 Đăng ký lịch tuần]              │                                                      │
│  [🎧 IT Helpdesk]                    │                                                      │
│  [📋 Giao việc]                      │                                                      │
│  [📊 Báo cáo số liệu]                │                                                      │
│  ----------------------------------  │                                                      │
│  TIỆN ÍCH:                           │                                                      │
│  [☁️ Kho cài đặt]                    │                                                      │
│  ----------------------------------  │                                                      │
│  FOOTER CÁN BỘ:                      │                                                      │
│  - Avatar + Tên cán bộ + Đăng xuất   │                                                      │
└──────────────────────────────────────┴──────────────────────────────────────────────────────┘
```

### 7.2. Đặc Tính Kỹ Thuật Cốt Lõi
1. **Tên gọi chuẩn hóa, không dùng Badge bên cạnh:** Các mục điều hướng dùng tên súc tích: *Trang chủ, Đăng ký lịch tuần, IT Helpdesk, Giao việc, Báo cáo số liệu, Kho cài đặt*. Tuyệt đối không gắn nhãn badge bên hông để tránh chiếm diện tích gây cắt chữ thành dấu ba chấm `...`.
2. **Chế độ Thu Gọn / Mở Rộng linh hoạt (Collapsible Icon-Only Mode):**
   - Người dùng bấm nút **3 gạch `☰`** ở đầu Sidebar để thu gọn Sidebar về dạng Mini (độ rộng chỉ `72px`), chỉ hiển thị các biểu tượng Icon căn giữa với hiệu ứng tooltip khi rê chuột.
   - Khi thu gọn, diện tích nội dung làm việc bên phải được nới rộng tối đa.
   - Trạng thái thu gọn được lưu vào `localStorage`, tự động ghi nhớ khi chuyển qua lại giữa các trang con.
3. **Đồng bộ phiên đăng nhập:** Tự động lấy tên cán bộ, CCCD, chức vụ từ `sessionStorage` để hiển thị ở chân Sidebar trên tất cả các trang.
4. **Thân thiện Mobile/Tablet:** Trên màn hình < 1024px, Sidebar tự động thu gọn sang trái và mở ra dạng Slide Drawer khi bấm nút Hamburger Menu `☰` trên thanh Mobile Topbar 54px.
