---
name: speckit-vpdk
description: Quy trình phát triển tính năng mới chuẩn Spec-Driven Development (Spec Kit) dành riêng cho dự án vpdk-cn23. Kích hoạt khi người dùng muốn thêm tính năng mới, nâng cấp module hoặc yêu cầu 'lên spec', 'speckit', 'lập kế hoạch tính năng'.
---

# QUY TRÌNH SPEC-KIT CHO VPDK-CN23 (SPEC-DRIVEN DEVELOPMENT)

Khi người dùng yêu cầu phát triển tính năng mới hoặc dùng từ khóa liên quan đến **Spec Kit / Lên Spec / Kế hoạch tính năng**, AI Agent **BẮT BUỘC** tuân thủ quy trình 4 giai đoạn sau đây thay vì vội vàng viết code ngay:

---

## GIAI ĐOẠN 1: ĐẶC TẢ TÍNH NĂNG (SPECIFICATION - `/specify`)

Trước khi đụng vào code, tạo một bản tóm tắt Spec ngắn gọn gồm 4 mục:
1. **Mục tiêu nghiệp vụ (User Story):** Cán bộ/người dùng nào sử dụng? Giải quyết vấn đề gì?
2. **Thiết kế Giao diện & Trải nghiệm (UI/UX):**
   - Tuân thủ nghiêm ngặt nguyên tắc **60 - 30 - 10** trong `.agent/rules.md` (Navy `#1e3a8a`, Vàng kim `#d97706`).
   - Kế thừa App Shell `js/layout.js`, `css/base.css`, không tạo lại khung cơ sở.
3. **Luồng dữ liệu (Data & Backend):**
   - Đọc/Ghi dữ liệu gì với Google Sheets qua Google Apps Script (GAS)?
   - Cấu trúc Request/Response JSON (action, payload, status).
4. **Trường hợp biên & Xử lý lỗi (Edge Cases):**
   - Mất mạng, dữ liệu rỗng, loading state, phân quyền người dùng (`js/auth.js`).

---

## GIAI ĐOẠN 2: LÀM RÕ ĐIỂM MÙ (CLARIFY - `/clarify`)

- Rà soát các giả định ngầm trong Spec.
- Đặt ra từ 1 đến 3 câu hỏi trắc nghiệm ngắn gọn cho người dùng để chốt phương án (ví dụ: vị trí nút bấm, cách hiển thị thông báo, quyền hạn xem dữ liệu).
- **Chỉ chuyển sang Giai đoạn 3 khi người dùng đã phản hồi hoặc đồng ý phương án đề xuất.**

---

## GIAI ĐOẠN 3: KẾ HOẠCH & CHIA TASK (PLAN & TASKS - `/tasks`)

Chia nhỏ việc triển khai thành danh sách checklist 3 - 5 task tuần tự:
- [ ] **Task 1 (UI/DOM):** Bổ sung markup HTML & style CSS kế thừa tokens.
- [ ] **Task 2 (Logic & State):** Viết hàm xử lý sự kiện trong JavaScript (Vanilla ES6+).
- [ ] **Task 3 (Data/API):** Tích hợp gọi GAS Web App hoặc xử lý lưu trữ Local.
- [ ] **Task 4 (Validation & Polish):** Thêm spinner loading, thông báo Toast, xử lý lỗi.

---

## GIAI ĐOẠN 4: THỰC THI & NGHIỆM THU (IMPLEMENT & CONVERGE - `/converge`)

1. **Implement:** Thực hiện từng task một cách cẩn thận, không làm ảnh hưởng đến các trang hiện có (`index.html`, `giao_viec.html`, `it_helpdesk.html`,...).
2. **Kỷ luật Git:** Tuyệt đối **KHÔNG tự ý `git push`** (tuân thủ Quy tắc 9 trong `.agent/rules.md`).
3. **Converge (Nghiệm thu):**
   - Kiểm tra mã lỗi console (syntax, unhandled promise).
   - Đối chiếu lại bản Spec ban đầu xem đã đáp ứng đủ các tiêu chí chưa.
   - Báo cáo rõ ràng các file đã thay đổi và hướng dẫn người dùng kiểm tra trên trình duyệt.
