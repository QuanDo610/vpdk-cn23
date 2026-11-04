# 🛠️ CẨM NANG KỸ THUẬT & KIẾN TRÚC FRONT-END (SKILL.MD)
### DỰ ÁN HỆ THỐNG ĐIỀU HÀNH NỘI BỘ "FAMILY CN23"
> **Phạm vi áp dụng:** Toàn bộ mã nguồn Front-end (HTML5, CSS3, Modern Vanilla JS ES6+)  
> **Nguyên tắc cốt lõi:** Pure Vanilla Web (No Build Step) • Mở trang tức thì (< 200ms) • No External CDN • Zero-Trust Security  
> **Vị trí lưu trữ:** `.agent/skill.md` (Cẩm nang kiến trúc và Best Practice nội bộ)

---

## 📌 QUY ĐỊNH BẮT BUỘC DÀNH CHO AGENT
> [!IMPORTANT]
> **ĐỌC TRƯỚC KHI CODE:**  
> Trước khi tạo mới, sửa đổi, tái cấu trúc (refactor) bất kỳ tệp HTML, CSS hoặc JS nào, Agent **bắt buộc phải xem qua cẩm nang này** để áp dụng đúng:
> 1. Thiết kế App Shell và Design Tokens màu 60-30-10.
> 2. Kỹ thuật triệt tiêu Render-Blocking (Không `@import` CSS, nạp script `defer`).
> 3. Nguyên tắc phân tách trách nhiệm (Cấm inline style, cấm inline event handlers).
> 4. Kỹ thuật tối ưu bộ nhớ & DOM (Event Delegation, Debounce 300ms, DOM Caching).
> 5. An toàn thông tin (Bắt buộc `escapeHtml()`, Route Guard tại thẻ `<head>`).

---

## 📑 MỤC LỤC
1. [Kiến Trúc Tổng Thể & App Shell](#1-kiến-trúc-tổng-thể--app-shell)
2. [Chuẩn Tầng Giao Diện HTML5](#2-chuẩn-tầng-giao-diện-html5)
3. [Chuẩn Tầng Định Kiểu CSS & Design Tokens](#3-chuẩn-tầng-định-kiểu-css--design-tokens)
4. [Chuẩn Tầng Xử Lý Logic JavaScript (ES6+)](#4-chuẩn-tầng-xử-lý-logic-javascript-es6)
5. [Tối Ưu Hiệu Năng: Triệt Tiêu Web Chậm & Lag](#5-tối-ưu-hiệu-năng-triệt-tiêu-web-chậm--lag)
6. [Bảo Mật Hệ Thống & Bảo Vệ Dữ Liệu Cán Bộ](#6-bảo-mật-hệ-thống--bảo-vệ-dữ-liệu-cán-bộ)
7. [Bảng So Sánh Mã Mẫu (Anti-Pattern vs. Best Practice)](#7-bảng-so-sánh-mã-mẫu-anti-pattern-vs-best-practice)

---

## 1. KIẾN TRÚC TỔNG THỂ & APP SHELL

### 1.1. Triết lý No-Build Vanilla Web
- Không sử dụng React/Vue/Angular, không Webpack/Vite.
- Tất cả các trang chạy tĩnh độc lập (Static HTML/CSS/JS) trên GitHub Pages kết hợp Desktop Shortcut 1-click.
- Trang nạp tức thì trong vòng < 200ms trên máy tính văn phòng cấu hình phổ thông (Core i3, RAM 4GB).

### 1.2. Cấu trúc App Shell chuẩn
Mỗi phân hệ (`index.html`, `lich_tuan.html`, `it_helpdesk.html`, `giao_viec.html`, `bao_cao_to.html`) đều sử dụng chung bộ khung:
1. **Thẻ `<head>`:**
   - Khai báo UTF-8, Viewport.
   - **Route Guard chạy tức thì:** `<script src="js/auth.js"></script><script>FamilyAuth.requireAuth();</script>` (chặn người ngoài trước khi render DOM).
   - Nạp các file CSS theo thứ tự: `variables.css` &rarr; `base.css` &rarr; `utilities.css` &rarr; `[module].css`.
   - Nạp các script với thuộc tính `defer`: `js/layout.js`, `js/[module].js`.
2. **Topbar 60px tự động khởi tạo bởi `js/layout.js`:**
   - Logo Pikachu & VPĐK Chi nhánh 23.
   - Tên cơ quan và Menu chuyển nhanh giữa 5 phân hệ.
   - User Dropdown góc phải (Họ tên, Đơn vị, Vai trò, Nút Đăng xuất).
3. **Thân trang (`main.main-content`):**
   - Độ rộng chuẩn: `max-w-7xl w-full mx-auto px-4 sm:px-6 py-4`.
4. **Footer:**
   - Tự động chèn bởi `js/layout.js` kèm bản quyền và phím tắt kín đáo cho Admin.

---

## 2. CHUẨN TẦNG GIAO DIỆN HTML5

### 2.1. Phân tách trách nhiệm (Separation of Concerns)
* ❌ **CẤM Inline Styles:** Tuyệt đối không dùng `style="display: none;"` hay `style="color: red;"`. Dùng class tiện ích `.d-none` hoặc thuộc tính HTML5 `hidden`.
* ❌ **CẤM Inline Event Handlers:** Cấm `onclick="..."`, `onchange="..."`, `oninput="..."`, `onsubmit="..."`.
  - Thay bằng: Thuộc tính ngữ nghĩa `data-action="tên-hành-động"` và gán listener từ JS.

### 2.2. Chuẩn Form & Accessibility (A11y)
* Mọi thẻ `<button>` **bắt buộc phải có thuộc tính `type="button"`** (hoặc `type="submit"` trong form). Tuyệt đối không bỏ trống `type` vì trình duyệt sẽ mặc định xem là `submit` gây tải lại trang ngoài ý muốn.
* Mọi trường `<input>`, `<select>`, `<textarea>` phải có `<label for="id-tương-ứng">` đi kèm.
* Mọi liên kết `target="_blank"` mở tab mới bắt buộc phải có `rel="noopener noreferrer"`.
* Mọi thẻ `<img>` phải có thuộc tính `alt="..."` mô tả ngắn gọn.

---

## 3. CHUẨN TẦNG ĐỊNH KIỂU CSS & DESIGN TOKENS

### 3.1. Tuyệt đối KHÔNG sử dụng `@import` lồng nhau
* `@import url(...)` bên trong file CSS là nguyên nhân hàng đầu gây nghẽn mạng tuần tự (Waterfall blocking).
* **Quy tắc bắt buộc:** Toàn bộ CSS phải được liên kết song song bằng các thẻ `<link rel="stylesheet">` trong `<head>` của HTML.

### 3.2. Hệ thống Design Tokens màu 60 - 30 - 10
Tuân thủ nguyên tắc phối màu công vụ từ `css/variables.css`:
* **60% Nền & Không gian:** `--color-bg-app` (`#f8fafc`) và `--color-bg-surface` (`#ffffff`).
* **30% Nhận diện cơ quan:** `--color-brand-navy` (`#1e3a8a`), `--color-brand-navy-dark` (`#0f172a`) dùng cho Header, tiêu đề Card, viền bảng.
* **10% Điểm nhấn hành động:** `--color-accent` (`#d97706` - Vàng kim) **CHỈ DÙNG** cho nút bấm hành động chính (CTA: Đăng ký, Gửi sự cố), Badge nổi bật và trạng thái khẩn cấp.

> [!CAUTION]
> **Không gán cứng mã màu HEX tùy tiện:** Luôn sử dụng `var(--color-...)` đã khai báo trong `css/variables.css`.

### 3.3. Định dạng In ấn A4 chuẩn Nghị định 30/2020/NĐ-CP
Mọi phân hệ khi in (`@media print` hoặc `Ctrl + P`) phải:
```css
@media print {
  .topbar, .user-dropdown, .btn, .filter-toolbar, .no-print {
    display: none !important;
  }
  @page {
    size: A4 portrait;
    margin: 20mm 15mm 20mm 30mm;
  }
  body {
    background: #ffffff !important;
    color: #000000 !important;
    font-family: "Times New Roman", Times, serif !important;
    font-size: 13pt !important;
  }
}
```

---

## 4. CHUẨN TẦNG XỬ LÝ LOGIC JAVASCRIPT (ES6+)

### 4.1. Cơ chế Event Delegation bắt buộc trên bảng dữ liệu
Không gán listener riêng rẽ bằng vòng lặp sau mỗi lần render. Luôn gán 1 listener duy nhất trên phần tử cha (`tbody` hoặc container):
```javascript
// ✅ Chuẩn mực: Chỉ 1 Event Listener duy nhất
const tableBody = document.getElementById("ticketTableBody");
if (tableBody) {
  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === "edit") openEditModal(id);
    else if (action === "delete") confirmDelete(id);
  });
}
```

### 4.2. Kỹ thuật Debounce cho ô tìm kiếm (Tối thiểu 300ms)
Mọi ô nhập tìm kiếm gõ phím (`input`) phải được debounce tối thiểu **300ms** trước khi lọc danh sách:
```javascript
function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Gán vào ô tìm kiếm:
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", debounce((e) => {
    handleSearchFilter(e.target.value.trim());
  }, 300));
}
```

### 4.3. DOM Selector Caching & Cập nhật DOM theo đợt (Batch Updating)
- Lưu các phần tử DOM thường dùng vào đối tượng đệm `const DOM = { ... }`.
- Tạo chuỗi HTML hoàn chỉnh hoặc `DocumentFragment` rồi gán vào DOM 1 lần (`innerHTML = html;`), không gọi `.appendChild()` liên tục trong vòng lặp.

### 4.4. Tiết kiệm CPU khi Tab ẩn dưới nền (Inactive Tab CPU Saving)
Các hàm hẹn giờ `setInterval` (đồng bộ Google Sheets) bắt buộc phải kiểm tra:
```javascript
setInterval(() => {
  if (document.hidden) return; // Nếu cán bộ mở tab khác, tạm dừng gọi server
  syncDataSilently();
}, 60000);
```

---

## 5. TỐI ƯU HIỆU NĂNG: TRIỆT TIÊU WEB CHẬM & LAG

1. **Không nạp file JS tĩnh quá nặng lúc khởi động:**
   - Ví dụ: `quotes_data.js` nặng 362KB không được nạp đồng bộ lúc mở trang. Chỉ trích xuất 20-30 câu mẫu (~3KB) hoặc tải bất đồng bộ (lazy fetch) khi người dùng bấm xem.
2. **Loại bỏ phụ thuộc CDN quốc tế:**
   - Không dùng Tailwind CDN (`cdn.tailwindcss.com` 2.9MB runtime).
   - Không phụ thuộc Google Fonts khi mạng cơ quan chập chờn; ưu tiên System Font Stack:
     ```css
     font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
     ```
   - Các thư viện cần thiết (`docx.umd.js`, `FileSaver.min.js`, `flatpickr.min.js`) phải tải về lưu cục bộ tại `js/` hoặc `css/`.
3. **Nén hình ảnh Client-Side (<kbd>Ctrl + V</kbd>):**
   - Ảnh chụp màn hình dán vào IT Helpdesk phải được nén bằng HTML5 Canvas xuống JPEG chất lượng 0.75, kích thước tối đa 1280px, dung lượng < 250KB trước khi tải lên.

---

## 6. BẢO MẬT HỆ THỐNG & BẢO VỆ DỮ LIỆU CÁN BỘ

1. **Tuyệt đối không lưu trữ thông tin cá nhân (PII) trên Git công khai:**
   - Cấm hardcode danh bạ nhân sự (`STAFF_CN23`, số điện thoại, CCCD) vào file JavaScript tĩnh.
   - Dữ liệu nhân sự phải được lấy từ API Google Sheets sau khi đã xác thực tài khoản.
2. **Chống XSS 100%:**
   - Mọi chuỗi dữ liệu do người dùng nhập hoặc nhận từ server chèn vào `innerHTML` bắt buộc phải qua hàm `escapeHtml()`:
     ```javascript
     function escapeHtml(str) {
       if (!str) return "";
       return String(str)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
     }
     ```
3. **Chống Spreadsheet Formula Injection:**
   - Dữ liệu ghi vào Google Sheets bắt đầu bằng `=`, `+`, `-`, `@` phải được thêm dấu nháy đơn `'` ở đầu thông qua `sanitizeForSheet()`.
4. **Bảo mật phiên đăng nhập:**
   - Khóa phiên chuẩn duy nhất: `sessionStorage.getItem("family_user")`.
   - Đăng nhập chỉ gửi bằng HTTP POST trong Request Body, không nối mật khẩu vào URL query string (`?password=...`).
   - Mọi hành vi cập nhật/xóa trên Google Apps Script cần kiểm tra định danh người gửi, không tin tưởng 100% quyền từ Client.

---

## 7. BẢNG SO SÁNH MÃ MẪU (ANTI-PATTERN VS. BEST PRACTICE)

| Hạng mục | ❌ MÃ LỖI (ANTI-PATTERN) | ✅ MÃ CHUẨN (BEST PRACTICE) |
| :--- | :--- | :--- |
| **CSS Waterfall** | `@import url("base.css");` trong file CSS con. | Nạp song song bằng `<link rel="stylesheet">` trong thẻ `<head>` của HTML. |
| **Inline CSS** | `<div style="display: none;">` | `<div class="d-none">` hoặc `<div hidden>` |
| **Button Type** | `<button class="btn">Lưu</button>` | `<button type="button" class="btn">Lưu</button>` |
| **Event Listener** | `<button onclick="deleteItem(123)">` | `<button type="button" data-action="delete" data-id="123">` + Event Delegation |
| **XSS trong innerHTML** | `el.innerHTML = "<span>" + item.name + "</span>";` | `el.innerHTML = \`<span>\${escapeHtml(item.name)}</span>\`;` |
| **Tìm kiếm trực tiếp** | `input.oninput = () => render();` | `input.addEventListener("input", debounce(() => render(), 300));` |
| **Tab chạy ngầm** | `setInterval(fetchData, 10000);` | `setInterval(() => { if (document.hidden) return; fetchData(); }, 60000);` |
| **Mở tab mới an toàn**| `<a href="link" target="_blank">` | `<a href="link" target="_blank" rel="noopener noreferrer">` |
