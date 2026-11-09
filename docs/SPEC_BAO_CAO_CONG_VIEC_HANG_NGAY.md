# [SPEC] PHÂN HỆ BÁO CÁO CÔNG VIỆC HẰNG NGÀY & THEO DÕI SỐ LIỆU CẤP TỔ
**Mã đặc tả:** `SPEC-CN23-DAILY-REPORT`  
**Dự án:** Hệ Thống Điều Hành & Dịch Vụ Cán Bộ "Family CN23" - VPĐK Chi Nhánh Số 23  
**Người phụ trách:** AI Agent & Đỗ Trọng Minh Quân (IT Admin)  
**Ngày khởi tạo:** 2026-11-05  
**Trạng thái:** `REVIEW & APPROVED (IN PROGRESS)`  
**Tài liệu tham chiếu:** [`.agent/skills/spec-driven/SKILL.md`](file:///c:/Users/X/Desktop/vpdk-cn23/.agent/skills/spec-driven/SKILL.md), [`.agent/skills/speckit/SKILL.md`](file:///c:/Users/X/Desktop/vpdk-cn23/.agent/skills/speckit/SKILL.md)

---

## 1. BỐI CẢNH & MỤC TIÊU NGHIỆP VỤ

### 1.1. Vấn đề hiện tại
- Trước đây, phân hệ 4 ([`bao_cao_to.html`](file:///c:/Users/X/Desktop/vpdk-cn23/bao_cao_to.html)) chỉ phục vụ báo cáo định kỳ tuần/tháng theo 8 nhóm chỉ tiêu tổng quát, không phản ánh được khối lượng công việc thực tế phát sinh **mỗi ngày** của từng Tổ chuyên môn.
- Lãnh đạo chi nhánh (Chị Sếp) đã dùng AI thiết kế biểu mẫu chuẩn mới tại [`assets/templates/BM_bao_cao_so_lieu_thuc_hien_CN23_v2.html`](file:///c:/Users/X/Desktop/vpdk-cn23/assets/templates/BM_bao_cao_so_lieu_thuc_hien_CN23_v2.html), trong đó **Tab 1: BÁO CÁO CÔNG VIỆC HẰNG NGÀY** gồm **21 hạng mục công việc** được chuẩn hóa theo 3 Tổ chuyên môn.
- Việc ghi chép thủ công rời rạc khiến việc tổng hợp báo cáo hằng ngày mất nhiều thời gian, khó đối soát số tồn đọng và không có cơ chế phân quyền bảo mật dữ liệu.

### 1.2. Mục tiêu giải pháp
1. **Một biểu mẫu nhập liệu tập trung hằng ngày (Daily Data Entry):** Cán bộ thuộc 3 Tổ chỉ cần vào điền số liệu phát sinh trong ngày của Tổ mình, hệ thống tự động tính toán tổng số và tồn đọng.
2. **Bảng Giám sát & Quản trị Lịch sử (Admin Monitoring & History Tracking):**
   - **Phân quyền Zero-Trust tuyệt đối:** Chỉ **2 Admin** được xem Bảng theo dõi và Lịch sử toàn cơ quan:
     1. **Đỗ Trọng Minh Quân** (`quandtm` / `0973807027` - IT Admin)
     2. **Nguyễn Thị Bích Tuyền** (`tuyenntb` / `0909736435` - Tổ trưởng HCTH)
   - Cán bộ/nhân viên thông thường chỉ thấy biểu mẫu của Tổ mình để gửi báo cáo.
3. **Bộ lọc thông minh theo khoảng thời gian:** Cho phép Lãnh đạo/Admin lọc xem số liệu từ ngày ... đến ngày ..., lọc theo Tổ hoặc xem toàn bộ đơn vị.
4. **Kiến trúc dữ liệu Google Sheets đồng bộ:** Chuẩn hóa các cột lưu trữ dữ liệu lên Google Sheets thông qua Google Apps Script (GAS) Web App.

---

## 2. YÊU CẦU CHỨC NĂNG (USER STORIES & ACCEPTANCE CRITERIA)

### US-01: Cán bộ chuyên viên điền và gửi báo cáo hằng ngày của Tổ
- **Là (As a):** Cán bộ chuyên viên của 1 trong 3 Tổ (*Tổ 1: ĐK&CGCN*, *Tổ 2: Kỹ thuật địa chính*, *Tổ 3: HCTH*).
- **Tôi muốn:** Vào phân hệ, chọn ngày và điền số liệu (*Tồn trước*, *Tiếp nhận*, *Đã giải quyết*) cho các hạng mục của Tổ mình rồi bấm nút "Gửi báo cáo lên Lãnh đạo".
- **Để:** Báo cáo tiến độ hoàn thành công việc trong ngày cho Ban Giám đốc và Tổ HCTH một cách nhanh chóng, minh bạch.
- **Tiêu chí chấp nhận (Acceptance Criteria):**
  - **AC-01.1 (Auto-calc):** Khi gõ số vào ô *Tồn trước* ($A$), *Tiếp nhận* ($B$), *Đã giải quyết* ($D$) &rarr; Hệ thống tự động tính tức thì *Tổng cần xử lý* ($C = A + B$), *Chưa xử lý* ($E = C - D$), và *Tỉ lệ hoàn thành* ($D / C \times 100\%$).
  - **AC-01.2 (Backlog Alert):** Nếu *Chưa xử lý* $> 0$, ô hiển thị màu đỏ cảnh báo tồn đọng (`.has-backlog`).
  - **AC-01.3 (Quick Entry):** Cán bộ có thể dùng thanh "Cập nhật nhanh từng mục" để chọn 1 loại hồ sơ từ dropdown, điền 3 ô và nhấn Cập nhật &rarr; Bảng tự động cuộn đến dòng đó và nhấp nháy highlight vàng.
  - **AC-01.4 (Draft & Submit):** Nút *Lưu nháp* lưu tức thời vào `localStorage`. Nút *Gửi Báo Cáo Ngày* ghi nhận thời gian gửi, tên người gửi và chuyển trạng thái sang `Đã gửi báo cáo`.

### US-02: Lãnh đạo & Quản trị viên giám sát tiến độ nộp của 3 Tổ
- **Là (As an):** Quản trị viên / Lãnh đạo (Đỗ Trọng Minh Quân hoặc Nguyễn Thị Bích Tuyền).
- **Tôi muốn:** Xem 3 Thẻ Giám Sát Tiến Độ hiển thị trạng thái nộp, tổng tiếp nhận, đã xử lý, tồn đọng của 3 Tổ.
- **Để:** Biết ngay Tổ nào đã nộp, Tổ nào chưa nộp và số lượng tồn đọng trong ngày của toàn chi nhánh.
- **Tiêu chí chấp nhận:**
  - **AC-02.1:** Thẻ của từng Tổ hiển thị thời gian nộp hoặc trạng thái `Chưa gửi`.
  - **AC-02.2 (Drill-down):** Bấm nút *"Xem Tổ 1"*, *"Xem Tổ 2"*, *"Xem Tổ 3"* &rarr; Bảng dữ liệu tự động lọc và cuộn mượt mà đến đúng Tổ đó.

### US-03: Lãnh đạo lọc và xem lịch sử báo cáo theo khoảng thời gian
- **Là (As an):** Admin / Lãnh đạo.
- **Tôi muốn:** Dùng bộ lọc chọn khoảng thời gian (*Từ ngày ... đến ngày ...*) và chọn Tổ để xem bảng tổng hợp lịch sử các ngày.
- **Để:** So sánh khối lượng công việc, tỷ lệ giải quyết hồ sơ qua các ngày và phục vụ họp giao ban tuần/tháng.
- **Tiêu chí chấp nhận:**
  - **AC-03.1:** Bộ lọc hỗ trợ chọn *Từ ngày* và *Đến ngày*, mặc định từ ngày đầu tháng đến hiện tại.
  - **AC-03.2:** Bấm nút *"Lọc"* cập nhật bảng lịch sử ngay lập tức.
  - **AC-03.3:** Bấm nút *"Xem lại"* ở bất kỳ dòng lịch sử nào &rarr; Hệ thống tự động nạp lại toàn bộ 21 hạng mục của ngày đó lên bảng biểu mẫu phía trên.

### US-04: Phân quyền Zero-Trust bảo mật dữ liệu
- **Là (As a):** Quản trị viên hệ thống.
- **Tôi muốn:** Ẩn hoàn toàn Bảng Giám Sát và Bảng Lịch Sử đối với tài khoản cán bộ thông thường (`role !== "admin"`).
- **Để:** Bảo mật dữ liệu thống kê tổng hợp toàn cơ quan, chỉ 2 Admin được thẩm định.
- **Tiêu chí chấp nhận:**
  - **AC-04.1:** Nếu tài khoản là `admin` (`quandtm`) hoặc `tuyenntb` &rarr; Hiển thị đầy đủ Giám sát, Lịch sử, Nạp mẫu Excel, Về 0, Xóa lịch sử.
  - **AC-04.2:** Nếu tài khoản là cán bộ thông thường (ví dụ: `user` / `Trần Văn Tuấn`) &rarr; Ẩn hoàn toàn `#adminMonitoringSection`, `#historyTrackingSection`, các nút quản trị; chỉ hiển thị `#userWorkspaceHub` với nút gửi báo cáo của Tổ mình.

---

## 3. THIẾT KẾ KỸ THUẬT & HỢP ĐỒNG DỮ LIỆU (TECHNICAL PLAN)

### 3.1. Danh mục 21 Hạng mục Công việc Chuẩn (3 Khối nghiệp vụ)
1. **Khối I - Tổ Đăng ký & Cấp GCN (`SEC_1`):**
   * *1. Biến động nhà đất:* `1.1` Cấp GCN dự án; `1.2` Cấp GCN mới + Trình cấp; `1.3` Đăng ký biến động đổi chủ sở hữu; `1.4` Đơn xin rút/trả hồ sơ.
   * *2. Giao dịch bảo đảm:* `2.1` Thế chấp; `2.2` Xóa thế chấp; `2.3` Văn bản thông báo; `2.4` Đăng ký thay đổi; `2.5` Loại khác.
   * *3. Biến động khác:* `3.1` Cập nhật số nhà, CCCD, họ tên; `3.2` Xóa nợ tiền SDĐ; `3.3` Đơn rút hồ sơ biến động khác.
2. **Khối II - Tổ Kỹ thuật Địa chính & Lưu trữ (`SEC_2`):**
   * `4.1` Đo vẽ hiện trạng; `4.2` Xác nhận vị trí đất, cho thửa; `4.3` Kiểm tra bản vẽ công ty đo vẽ (Tổng số); `4.3.1` (Trong đó: Đạt); `4.3.2` (Trong đó: Không đạt); `4.4` Xác minh hiện trạng; `4.5` Đã trích lục hồ sơ.
3. **Khối III - Tổ Hành chính - Tổng hợp & Một cửa (`SEC_3`):**
   * `5.1` Cung cấp thông tin đất đai cho Hộ gia đình / Cá nhân; `5.2` Cung cấp thông tin hỗ trợ tư pháp (Tòa án, Thi hành án, Công an, Thuế...).

### 3.2. Cấu trúc Bảng Google Sheets Backend (`backend/google_apps_script.js`)
Đề xuất 2 Tab Google Sheets sạch:

#### Tab 1: `BaoCaoHangNgay` (Lưu chi tiết từng hạng mục)
| STT | Cột Sheet | Tên trường JSON | Kiểu dữ liệu |
|:---:|---|---|---|
| 1 | `Timestamp` | `timestamp` | DateTime (`DD/MM/YYYY HH:mm:ss`) |
| 2 | `NgayBaoCao` | `reportDate` | Date (`YYYY-MM-DD`) |
| 3 | `MaTo` | `sectionId` | Text (`SEC_1`, `SEC_2`, `SEC_3`) |
| 4 | `TenTo` | `deptName` | Text |
| 5 | `NguoiBaoCao` | `reporter` | Text |
| 6 | `MaChiTieu` | `itemId` | Text (`1.1`, `1.2`, ...) |
| 7 | `TenHangMuc` | `itemName` | Text |
| 8 | `TonKyTruoc` | `tonTruoc` | Number |
| 9 | `TiepNhanTrongNgay` | `tiepNhan` | Number |
| 10 | `TongCanXuLy` | `tongCanXuLy` | Number |
| 11 | `DaGiaiQuyet` | `daGiaiQuyet` | Number |
| 12 | `ChuaGiaiQuyet` | `chuaGiaiQuyet`| Number |
| 13 | `TiLeGiaiQuyet` | `rate` | Text (`XX.X%`) |
| 14 | `GhiChuCanCu` | `note` | Text |
| 15 | `TrangThai` | `status` | Text (`Đã nộp` / `Đã chốt`) |

#### Tab 2: `NhatKyChotSoNgay` (Lưu tóm tắt từng ngày toàn Chi nhánh)
`NgayBaoCao` | `TongTon` | `TongTiepNhan` | `TongDaGiaiQuyet` | `TongChuaGiaiQuyet` | `TiLeChiNhanh` | `TienDoTo1` | `TienDoTo2` | `TienDoTo3` | `NguoiChot` | `CreatedAt`

---

## 4. KẾ HOẠCH PHÂN RÃ CÔNG VIỆC (TASK BREAKDOWN)

- [x] **Task 1 (UI & State):** Thiết kế Form nhập liệu 21 chỉ tiêu của 3 Tổ, tích hợp trực tiếp vào phân hệ [`bao_cao_to.html`](file:///c:/Users/X/Desktop/vpdk-cn23/bao_cao_to.html) thay thế form cũ.
- [x] **Task 2 (Monitoring & Filters):**
  - [x] Bổ sung 3 Thẻ Giám sát Tiến độ của 3 Tổ chuyên môn.
  - [x] Bổ sung Bộ lọc kép: Dropdown lọc Tổ + Dropdown lọc trực tiếp loại hồ sơ.
  - [x] Bổ sung Bảng Lịch sử & Theo dõi với bộ lọc *Từ ngày ... đến ngày ...*.
- [x] **Task 3 (Role-Based Permissions & Sample Data):**
  - [x] Tạo tài khoản `admin` / `admin` và `user` / `123456` để kiểm thử tại chỗ.
  - [x] Khóa quyền: Chỉ 2 Admin (`quandtm`, `tuyenntb`) xem được Bảng Giám Sát và Bảng Lịch Sử. Cán bộ `user` chỉ thấy Không gian nộp biểu của Tổ mình.
  - [x] Khởi tạo sẵn 4 bộ Data Samples liên tiếp kèm các nút chọn nhanh để xem ngay.
- [ ] **Task 4 (Backend GAS & Google Sheets Sync):**
  - [ ] Viết hàm `seedDailyReportSheetOnly()` trong `backend/google_apps_script.js` để tự động khởi tạo 2 Tab Google Sheets mới (`BaoCaoHangNgay`, `NhatKyChotSoNgay`).
  - [ ] Viết action `saveDailyReport` và `getDailyReportsByDateRange` trong doGet/doPost.
- [ ] **Task 5 (Export & Polish):**
  - [ ] Nút xuất dữ liệu ra file Excel (.xlsx / .csv) theo chuẩn báo cáo hành chính.
  - [ ] Tối ưu in ấn bản A4 theo Nghị định 30/2020/NĐ-CP.

---

## 5. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE MATRIX)

| STT | Tiêu chí nghiệm thu | Trạng thái |
|:---:|---|:---:|
| 1 | Mở trang tức thì (< 200ms), không có build step, không CDN bên ngoài gây lag | ✅ Đạt |
| 2 | Đầy đủ 21 hạng mục công việc chuẩn của cả 3 Tổ | ✅ Đạt |
| 3 | Tự động tính toán thời gian thực ($C = A + B$, $E = C - D$, Tỉ lệ %) | ✅ Đạt |
| 4 | Có sẵn 4 bộ dữ liệu mẫu (Data samples) để xem và đối soát ngay | ✅ Đạt |
| 5 | Phân quyền chuẩn: `admin` thấy toàn bộ, `user` chỉ thấy form của tổ mình | ✅ Đạt |
| 6 | Bảng theo dõi lịch sử có bộ lọc từ ngày ... đến ngày ... | ✅ Đạt |
| 7 | Không có inline styles hoặc inline events, tuân thủ `rules.md` | ✅ Đạt |
| 8 | Toàn bộ test suite [`tests/run_all_tests.py`](file:///c:/Users/X/Desktop/vpdk-cn23/tests/run_all_tests.py) vượt qua 100% | ✅ Đạt |
