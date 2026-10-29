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
  <div class="max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-3">
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
