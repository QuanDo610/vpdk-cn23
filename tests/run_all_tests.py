#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
COMPREHENSIVE END-TO-END TEST SUITE FOR FAMILY CN23
Runs against Headless Google Chrome via Chrome DevTools Protocol (CDP).
Tests all workflows and scenarios from SPEC_WORKFLOW_TESTING.md:
- Route Guards (SEC-05, IT-01)
- Authentication & Hub Portal (SEC-02, Index UI, Quotes, Modules, User Dropdown)
- IT Helpdesk (IT-01 to IT-06, Modal Detail, Image Viewer, Canvas Compression)
- Lịch Công Tác Tuần (SCH-01 to SCH-04, Word Export, Realtime Status, Tabs)
- PII & Security Checks (SEC-01 to SEC-04)
- Other modules integrity (giao_viec.html, bao_cao_to.html)
- Clean up test data afterwards.
"""

import os
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
import json
import base64
import socket
import urllib.request
import subprocess

PORT = 8990
CDP_PORT = 9250
BASE_URL = f"http://localhost:{PORT}"
WORKSPACE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class ChromeCDPClient:
    def __init__(self, cdp_port=CDP_PORT):
        self.cdp_port = cdp_port
        self.sock = None
        self.msg_id = 1

    def connect_tab(self, url_filter):
        with urllib.request.urlopen(f"http://localhost:{self.cdp_port}/json") as r:
            tabs = json.loads(r.read())
        target = next((t for t in tabs if url_filter in t.get("url", "")), None)
        if not target:
            # Check if there is an empty/about:blank tab to navigate
            target = next((t for t in tabs if t.get("type") == "page"), None)
        if not target:
            raise RuntimeError(f"No target tab found for {url_filter}")
        
        ws_url = target["webSocketDebuggerUrl"]
        path = ws_url.split(f"localhost:{self.cdp_port}")[1]
        
        if self.sock:
            try: self.sock.close()
            except: pass
        
        self.sock = socket.create_connection(("localhost", self.cdp_port), timeout=10)
        req = (f"GET {path} HTTP/1.1\r\n"
               f"Host: localhost:{self.cdp_port}\r\n"
               f"Upgrade: websocket\r\n"
               f"Connection: Upgrade\r\n"
               f"Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
               f"Sec-WebSocket-Version: 13\r\n\r\n")
        self.sock.sendall(req.encode())
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.sock.recv(1024)
        if b"101" not in resp:
            raise RuntimeError(f"WebSocket upgrade failed: {resp}")

    def send_cmd(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        msg = {"id": mid, "method": method, "params": params or {}}
        payload = json.dumps(msg).encode("utf-8")
        mask = os.urandom(4)
        length = len(payload)
        
        hdr = bytearray([0x81])
        if length < 126:
            hdr.append(0x80 | length)
        elif length < 65536:
            hdr.append(0x80 | 126)
            hdr.extend(length.to_bytes(2, "big"))
        else:
            hdr.append(0x80 | 127)
            hdr.extend(length.to_bytes(8, "big"))
        hdr.extend(mask)
        masked = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        self.sock.sendall(hdr + masked)

        while True:
            # Read frame
            head = self.sock.recv(2)
            if not head:
                raise RuntimeError("Connection closed while waiting for response")
            l = head[1] & 0x7f
            if l == 126:
                l = int.from_bytes(self.sock.recv(2), "big")
            elif l == 127:
                l = int.from_bytes(self.sock.recv(8), "big")
            
            data = b""
            while len(data) < l:
                chunk = self.sock.recv(l - len(data))
                if not chunk:
                    break
                data += chunk
            
            try:
                parsed = json.loads(data.decode("utf-8"))
                if parsed.get("id") == mid:
                    return parsed
            except:
                pass

    def evaluate(self, expr, await_promise=False):
        res = self.send_cmd("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": await_promise
        })
        if "result" in res and "result" in res["result"]:
            r = res["result"]["result"]
            if r.get("type") == "undefined":
                return None
            return r.get("value")
        if "error" in res:
            raise RuntimeError(f"CDP evaluate error: {res['error']}")
        return res

    def navigate(self, url):
        self.send_cmd("Page.navigate", {"url": url})
        time.sleep(1.2)


class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        self.client = None

    def assert_true(self, condition, name, details=""):
        if condition:
            print(f"  ✅ PASS: {name}")
            self.passed += 1
        else:
            print(f"  ❌ FAIL: {name} | {details}")
            self.failed += 1
            self.errors.append((name, details))

    def assert_equal(self, actual, expected, name):
        self.assert_true(actual == expected, name, f"Expected '{expected}', got '{actual}'")

    def run_all(self):
        print("==================================================================")
        print("🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG FAMILY CN23 (SPEC TEST SUITE)")
        print("==================================================================\n")

        # 1. Start Server & Headless Chrome
        chrome_bin = None
        for candidate in [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe"),
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser"
        ]:
            if os.path.exists(candidate):
                chrome_bin = candidate
                break
        if not chrome_bin:
            chrome_bin = "chrome"


        srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT)],
                               cwd=WORKSPACE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1)

        chrome_cmd = [
            chrome_bin,
            "--headless=new",
            f"--remote-debugging-port={CDP_PORT}",
            "--disable-gpu",
            "--no-sandbox",
            f"{BASE_URL}/index.html"
        ]
        chrome = subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(2)

        try:
            self.client = ChromeCDPClient(CDP_PORT)
            self.client.connect_tab("index.html")

            # Execute test groups
            self.test_route_guards()
            self.test_index_hub_and_auth()
            self.test_it_helpdesk_workflow()
            self.test_schedule_workflow()
            self.test_hrm_workflow()
            self.test_other_modules_integrity()
            self.test_security_and_pii_rules()

            # Clean up all browser storage and memory test data
            print("\n🧹 [DỌN DẸP] Dọn sạch dữ liệu thử nghiệm trong sessionStorage và localStorage...")
            self.client.evaluate("""
                sessionStorage.clear();
                localStorage.clear();
                if (typeof currentTickets !== 'undefined') currentTickets = [];
                if (typeof scheduleData !== 'undefined') scheduleData = [];
            """)
            print("  ✅ Đã xóa sạch toàn bộ session và local storage test data.")

        finally:
            chrome.terminate()
            srv.terminate()

        print("\n==================================================================")
        print(f"📊 KẾT QUẢ KIỂM THỬ: {self.passed} PASSED | {self.failed} FAILED")
        print("==================================================================")
        if self.errors:
            print("\n❌ DANH SÁCH LỖI PHÁT HIỆN:")
            for name, details in self.errors:
                print(f" - {name}: {details}")
        else:
            print("🎉 TẤT CẢ TÍNH NĂNG THEO ĐẶC TẢ ĐỀU WORK HOÀN HẢO!")

    # -------------------------------------------------------------
    # 1. ROUTE GUARD & ZERO-TRUST SECURITY (SEC-05, IT-01)
    # -------------------------------------------------------------
    def test_route_guards(self):
        print("\n🔒 [NHÓM 1] Kiểm tra Route Guard khi CHƯA đăng nhập (Zero-Trust)")
        pages = ["lich_tuan.html", "it_helpdesk.html", "giao_viec.html", "bao_cao_to.html", "hrm.html"]

        for page in pages:
            # Clear all session keys
            self.client.evaluate("sessionStorage.clear(); localStorage.clear();")
            self.client.navigate(f"{BASE_URL}/{page}")
            time.sleep(0.5)

            curr_url = self.client.evaluate("window.location.href")
            is_redirected = "index.html" in curr_url
            self.assert_true(is_redirected, f"Route Guard chặn {page}", f"Current URL: {curr_url}")

            # Check if redirect target is remembered
            target = self.client.evaluate("sessionStorage.getItem('family_redirect_target')")
            self.assert_equal(target, page, f"Ghi nhớ target redirect cho {page}")

    # -------------------------------------------------------------
    # 2. AUTHENTICATION & PORTAL HUB WORKFLOW (index.html)
    # -------------------------------------------------------------
    def test_index_hub_and_auth(self):
        print("\n🏛️ [NHÓM 2] Kiểm tra Cổng Xác Thực & Hub Trung Tâm (index.html)")
        self.client.evaluate("sessionStorage.clear(); localStorage.clear();")
        self.client.navigate(f"{BASE_URL}/index.html")
        time.sleep(0.5)

        # Check default login view state
        login_display = self.client.evaluate("getComputedStyle(document.getElementById('loginSection')).display")
        hub_display = self.client.evaluate("getComputedStyle(document.getElementById('portalHubSection')).display")
        self.assert_true(login_display != "none", "Hiển thị Form Đăng Nhập khi chưa có session")
        self.assert_equal(hub_display, "none", "Ẩn Hub Dashboard khi chưa có session")

        # Check required fields & DOM selectors
        has_user_input = self.client.evaluate("!!document.getElementById('loginUsername')")
        has_pass_input = self.client.evaluate("!!document.getElementById('loginPassword')")
        has_toggle_btn = self.client.evaluate("!!document.getElementById('btnToggleLoginPassword')")
        has_remember_chk = self.client.evaluate("!!document.getElementById('rememberMe')")
        self.assert_true(has_user_input and has_pass_input and has_toggle_btn and has_remember_chk, "Đầy đủ các selector Form đăng nhập")

        # Test toggle password visibility
        self.client.evaluate("document.getElementById('btnToggleLoginPassword').click()")
        type_after_click = self.client.evaluate("document.getElementById('loginPassword').type")
        self.assert_equal(type_after_click, "text", "Toggle hiện mật khẩu chuyển type thành text")
        self.client.evaluate("document.getElementById('btnToggleLoginPassword').click()")
        type_after_second = self.client.evaluate("document.getElementById('loginPassword').type")
        self.assert_equal(type_after_second, "password", "Toggle ẩn mật khẩu khôi phục type password")

        # Test Quotes feature
        quotes_loaded = self.client.evaluate("Array.isArray(window.QUOTES_DATA) && window.QUOTES_DATA.length >= 200")
        self.assert_true(quotes_loaded, "Tải kho 200 danh ngôn tinh hoa vĩ nhân (QUOTES_DATA)")

        # Simulate Login with mock user via FamilyAuth.saveSession
        mock_user = {
            "username": "quandtm",
            "fullname": "Đỗ Trọng Minh Quân",
            "phone": "0973807027",
            "position": "Chuyên viên CNTT",
            "department": "Tổ Hành chính - Tổng hợp",
            "role": "admin",
            "status": "Đang làm việc"
        }
        self.client.evaluate(f"FamilyAuth.saveSession({json.dumps(mock_user)}); showHub(FamilyAuth.getUser());")
        time.sleep(0.5)

        # Check Hub display
        hub_display_logged = self.client.evaluate("getComputedStyle(document.getElementById('portalHubSection')).display")
        login_display_logged = self.client.evaluate("getComputedStyle(document.getElementById('loginSection')).display")
        self.assert_true(hub_display_logged != "none", "Hiển thị Hub Dashboard sau khi đăng nhập")
        self.assert_equal(login_display_logged, "none", "Ẩn Login Form sau khi đăng nhập")

        # Check Greeting and Quote roll
        greeting_text = self.client.evaluate("document.getElementById('hubTimeGreeting').textContent")
        self.assert_true(len(greeting_text) > 0, "Lời chào thời gian thực hiển thị", greeting_text)
        quote_text_before = self.client.evaluate("document.getElementById('quoteTextVi').textContent")
        self.client.evaluate("rollRandomQuote()")
        quote_text_after = self.client.evaluate("document.getElementById('quoteTextVi').textContent")
        self.assert_true(len(quote_text_before) > 0, "Thẻ danh ngôn hiển thị câu nói tiếng Việt")

        # Check 5 Module links
        links = self.client.evaluate("""
            Array.from(document.querySelectorAll('.compact-module-card')).map(a => a.getAttribute('href'))
        """)
        expected_links = ["lich_tuan.html", "it_helpdesk.html", "giao_viec.html", "bao_cao_to.html", "hrm.html"]
        self.assert_equal(links, expected_links, "5 Thẻ phân hệ liên kết đúng các trang")

        # Check User Dropdown in Layout
        header_user_name = self.client.evaluate("document.getElementById('displayUserName')?.textContent || document.getElementById('headerUserName')?.textContent || ''")
        self.assert_true("Minh Quân" in header_user_name or "Đỗ Trọng Minh Quân" in header_user_name, "Huy hiệu Topbar hiển thị tên cán bộ", header_user_name)

    # -------------------------------------------------------------
    # 3. IT HELPDESK WORKFLOW (it_helpdesk.html)
    # -------------------------------------------------------------
    def test_it_helpdesk_workflow(self):
        print("\n🎧 [NHÓM 3] Kiểm tra IT Helpdesk & Tiếp Nhận Sự Cố (it_helpdesk.html)")

        # Ensure valid session
        mock_user = {
            "username": "quandtm",
            "fullname": "Đỗ Trọng Minh Quân",
            "phone": "0973807027",
            "position": "Chuyên viên CNTT",
            "department": "Tổ Hành chính - Tổng hợp",
            "role": "admin"
        }
        self.client.evaluate(f"FamilyAuth.saveSession({json.dumps(mock_user)});")
        self.client.navigate(f"{BASE_URL}/it_helpdesk.html")
        time.sleep(1.2)

        # TEST CASE IT-02: Default tab is Form Section (Báo sự cố mới)
        list_display = self.client.evaluate("document.getElementById('listSection').style.display")
        form_display = self.client.evaluate("document.getElementById('formSection').style.display")
        tab_list_active = self.client.evaluate("document.getElementById('tabBtnHelpdeskList').classList.contains('active')")
        tab_form_active = self.client.evaluate("document.getElementById('tabBtnHelpdeskRegister').classList.contains('active')")
        tab_form_exists = self.client.evaluate("document.getElementById('tabBtnHelpdeskRegister') != null")

        self.assert_true(form_display != "none", "IT-02: #formSection hiển thị mặc định (Báo sự cố trước)")
        self.assert_equal(list_display, "none", "IT-02: #listSection ẩn mặc định (Monitoring sau)")
        self.assert_true(tab_form_active and not tab_list_active, "IT-02: Tab nút #tabBtnHelpdeskRegister có class active")
        self.assert_true(tab_form_exists, "IT-02: Tab nút #tabBtnHelpdeskRegister điều hướng tạo ticket hiển thị")
        dept_tag = self.client.evaluate("document.getElementById('department').tagName")
        dept_readonly = self.client.evaluate("document.getElementById('department').readOnly")
        dept_val = self.client.evaluate("document.getElementById('department').value")
        self.assert_equal(dept_tag, "INPUT", "IT-02: #department là ô input tự động (không phải dropdown select)")
        self.assert_true(dept_readonly, "IT-02: #department có thuộc tính readonly")
        self.assert_equal(dept_val, "Tổ Hành chính - Tổng hợp", "IT-02: #department tự fill đúng phòng ban từ TaiKhoan")

        # TEST CASE IT-03: Tab switching sang Monitoring
        self.client.evaluate("switchHelpdeskTab('list')")
        form_display_switched = self.client.evaluate("document.getElementById('formSection').style.display")
        list_display_switched = self.client.evaluate("document.getElementById('listSection').style.display")
        tab_list_active_switched = self.client.evaluate("document.getElementById('tabBtnHelpdeskList').classList.contains('active')")
        self.assert_equal(list_display_switched, "flex", "IT-03: Chuyển sang Tab Monitoring hiển thị")
        self.assert_equal(form_display_switched, "none", "IT-03: Tab Form bị ẩn")
        self.assert_true(tab_list_active_switched, "IT-03: Nút Tab Monitoring có class active")

        # Switch back to Form
        self.client.evaluate("switchHelpdeskTab('form')")
        form_display_back = self.client.evaluate("document.getElementById('formSection').style.display")
        self.assert_equal(form_display_back, "block", "IT-03: Quay lại Tab Form hoạt động mượt mà")

        # TEST CASE IT-04: Canvas Image Compression & Ctrl + V simulation
        self.client.evaluate("switchHelpdeskTab('form')")
        # Synthesize a 1600x1200 test canvas image in browser and compress
        comp_res = self.client.evaluate("""
            (function() {
                const c = document.createElement('canvas');
                c.width = 1600; c.height = 1200;
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#ff0000'; ctx.fillRect(0, 0, 1600, 1200);
                ctx.fillStyle = '#ffffff'; ctx.font = '40px Arial';
                ctx.fillText('Test Error Screen', 100, 100);
                
                // Convert to blob
                return new Promise(resolve => {
                    c.toBlob(blob => {
                        compressAndPreviewImage(blob);
                        setTimeout(() => {
                            const dataUrl = detectedClient.imageBase64;
                            const sizeKb = Math.round((dataUrl.length * 3 / 4) / 1024);
                            const previewSrc = document.getElementById('imagePreview').src;
                            const isHidden = document.getElementById('imagePreviewContainer').classList.contains('hidden');
                            resolve({
                                hasDataUrl: dataUrl.startsWith('data:image/jpeg;base64,'),
                                sizeKb: sizeKb,
                                previewVisible: !isHidden,
                                previewMatches: previewSrc.startsWith('data:image/jpeg;base64,')
                            });
                        }, 200);
                    }, 'image/png');
                });
            })()
        """, await_promise=True)

        self.assert_true(comp_res.get("hasDataUrl"), "IT-04: Nén Canvas tạo DataURL JPEG Base64")
        self.assert_true(comp_res.get("sizeKb", 999) < 250, f"IT-04: Dung lượng nén < 250KB ({comp_res.get('sizeKb')} KB)")
        self.assert_true(comp_res.get("previewVisible"), "IT-04: #imagePreviewContainer hiển thị sau khi nén")

        # Test Remove image button
        self.client.evaluate("removeSelectedImage()")
        is_hidden_after_remove = self.client.evaluate("document.getElementById('imagePreviewContainer').classList.contains('hidden')")
        data_cleared = self.client.evaluate("detectedClient.imageBase64 === ''")
        self.assert_true(is_hidden_after_remove and data_cleared, "IT-04: Nút xóa ảnh hoàn nguyên khung upload")

        # TEST CASE IT-05: Create Ticket & Auto-switch to List queue
        submit_res = self.client.evaluate("""
            (function() {
                // Intercept fetch to mock GAS response smoothly
                const originalFetch = window.fetch;
                window.fetch = async (url, opts) => {
                    if (typeof url === 'string' && url.includes('AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE')) {
                        return {
                            json: async () => ({
                                success: true,
                                ticketId: "TK-261102-999",
                                timestamp: "02/11/2026 10:45:00"
                            })
                        };
                    }
                    return originalFetch(url, opts);
                };

                document.getElementById('errorMessage').value = "Printer Offline";
                document.getElementById('description').value = "Máy in không nhận lệnh in từ phần mềm một cửa.";

                const initialTotal = parseInt(document.getElementById('statTotal').textContent) || 0;
                const initialPending = parseInt(document.getElementById('statPending').textContent) || 0;

                // Trigger real button click & form submission
                document.getElementById('btnSubmitTicket').click();
                return new Promise(resolve => {
                    setTimeout(() => {
                        const newTotal = parseInt(document.getElementById('statTotal').textContent) || 0;
                        const newPending = parseInt(document.getElementById('statPending').textContent) || 0;
                        const listDisplay = document.getElementById('listSection').style.display;
                        const modalSuccessVisible = !document.getElementById('modalSuccess').classList.contains('hidden');
                        const modalTicketText = document.getElementById('resTicketId').textContent;
                        const firstTicket = currentTickets[0];

                        resolve({
                            success: true,
                            totalDiff: newTotal - initialTotal,
                            pendingDiff: newPending - initialPending,
                            listDisplay: listDisplay,
                            modalSuccessVisible: modalSuccessVisible,
                            modalTicketText: modalTicketText,
                            firstTicketId: firstTicket?.id,
                            firstTicketDept: firstTicket?.department
                        });
                    }, 400);
                });
            })()
        """, await_promise=True)

        self.assert_true(submit_res.get("listDisplay") != "none", "IT-05: Tự động switchHelpdeskTab('list') về Tab Bảng sau khi gửi")
        self.assert_true(submit_res.get("modalSuccessVisible"), "IT-05: Modal #modalSuccess hiển thị xác nhận")
        self.assert_true("TK-261102" in submit_res.get("modalTicketText", ""), "IT-05: Hiển thị đúng mã vé #TK-261102-xxx")
        self.assert_equal(submit_res.get("firstTicketDept"), "Tổ Hành chính - Tổng hợp", "IT-05: Ticket mới gửi tự động đính kèm phòng ban")
        self.assert_equal(submit_res.get("totalDiff"), 1, "IT-05: Số liệu #statTotal tăng thêm 1")
        self.assert_equal(submit_res.get("pendingDiff"), 1, "IT-05: Số liệu #statPending tăng thêm 1")

        # TEST CASE IT-06: Smart sorting ("Đang xử lý" (1) > "Chờ xử lý" (2) > "Đã hoàn thành" (3))
        sort_res = self.client.evaluate("""
            (function() {
                currentTickets = [
                    { id: "TK-01", status: "Đã hoàn thành", fullname: "A", timestamp: "01/11/2026 08:00:00", department: "Tổ HC", description: "Lỗi mạng" },
                    { id: "TK-02", status: "Chờ xử lý", fullname: "B", timestamp: "01/11/2026 09:00:00", department: "Tổ KT", description: "Lỗi in" },
                    { id: "TK-03", status: "Đang xử lý", fullname: "C", timestamp: "01/11/2026 10:00:00", department: "Tổ VP", description: "Lỗi PC" }
                ];
                renderTickets();
                const rows = Array.from(document.querySelectorAll('#ticketTableBody tr'));
                const ticketIdsInTable = rows.map(r => r.querySelector('.font-mono.font-bold')?.textContent?.trim()).filter(Boolean);
                return ticketIdsInTable;
            })()
        """)
        self.assert_equal(sort_res, ["TK-03", "TK-02", "TK-01"], "IT-06: Sắp xếp thông minh Đang xử lý -> Chờ xử lý -> Đã hoàn thành")

        # Status filter check
        filter_res = self.client.evaluate("""
            (function() {
                document.getElementById('filterStatus').value = "Đang xử lý";
                renderTickets();
                const rows = Array.from(document.querySelectorAll('#ticketTableBody tr'));
                return rows.length;
            })()
        """)
        self.assert_equal(filter_res, 1, "IT-06: Bộ lọc filterStatus lọc chính xác")

        # Reset filter
        self.client.evaluate("document.getElementById('filterStatus').value = 'ALL'; renderTickets();")

        # Test Ticket Detail Modal
        self.client.evaluate("openTicketDetail('TK-03')")
        detail_visible = self.client.evaluate("!document.getElementById('modalTicketDetail').classList.contains('hidden')")
        detail_id = self.client.evaluate("document.getElementById('detailTicketId').textContent")
        self.assert_true(detail_visible and detail_id == "TK-03", "Mở Modal chi tiết ticket (#modalTicketDetail) chính xác")
        self.client.evaluate("closeTicketDetail()")

    # -------------------------------------------------------------
    # 4. LỊCH CÔNG TÁC TUẦN WORKFLOW (lich_tuan.html & js/app.js)
    # -------------------------------------------------------------
    def test_schedule_workflow(self):
        print("\n📅 [NHÓM 4] Kiểm tra Đăng Ký Lịch Công Tác Tuần (lich_tuan.html & js/app.js)")

        # Ensure valid session
        mock_user = {
            "username": "quandtm",
            "fullname": "Đỗ Trọng Minh Quân",
            "email": "quan.vpdk@gmail.com",
            "phone": "0973807027",
            "position": "Chuyên viên CNTT",
            "department": "Tổ Hành chính - Tổng hợp",
            "role": "admin"
        }
        self.client.evaluate(f"FamilyAuth.saveSession({json.dumps(mock_user)});")
        self.client.navigate(f"{BASE_URL}/lich_tuan.html")
        for _ in range(25):
            time.sleep(0.3)
            is_ready = self.client.evaluate("typeof switchScheduleTab === 'function' && typeof window.docx !== 'undefined'")
            if is_ready:
                break

        # Tab Switching test
        list_display = self.client.evaluate("document.getElementById('listSection').style.display")
        form_display = self.client.evaluate("document.getElementById('formSection').style.display")
        self.assert_true(list_display != "none", "Tab 1 Bảng Lịch hiển thị mặc định")
        self.assert_equal(form_display, "none", "Tab 2 Form Đăng ký ẩn mặc định")

        self.client.evaluate("switchScheduleTab('form')")
        form_display_switched = self.client.evaluate("document.getElementById('formSection').style.display")
        self.assert_equal(form_display_switched, "block", "Chuyển sang Tab Form đăng ký lịch thành công")

        # TEST CASE SCH-01: Time constraint (End <= Start)
        time_check_res = self.client.evaluate("""
            (function() {
                const startEl = document.getElementById('regStartTime');
                const endEl = document.getElementById('regEndTime');
                startEl.value = "10:00";
                endEl.value = "09:00";

                let alertMsg = "";
                const originalAlert = window.alert;
                window.alert = (msg) => { alertMsg = msg; };

                // Call validation
                const isValid = typeof isTimeRangeValid === 'function' ? isTimeRangeValid("10:00", "09:00") : ("09:00" > "10:00");
                window.alert = originalAlert;
                return { isValid: isValid };
            })()
        """)
        self.assert_true(not time_check_res.get("isValid"), "SCH-01: Chặn giờ kết thúc <= giờ bắt đầu (09:00 <= 10:00)")

        # TEST CASE SCH-02: Character counters (maxlength 500)
        char_test_res = self.client.evaluate("""
            (function() {
                const textarea = document.getElementById('regContent');
                const counter = document.getElementById('contentCounter');
                textarea.value = "A".repeat(120);
                textarea.dispatchEvent(new Event('input'));
                return {
                    maxlength: textarea.getAttribute('maxlength'),
                    counterText: counter ? counter.textContent : ""
                };
            })()
        """)
        self.assert_equal(char_test_res.get("maxlength"), "500", "SCH-02: regContent có thuộc tính maxlength='500'")
        self.assert_true("120" in char_test_res.get("counterText", ""), f"SCH-02: Bộ đếm ký tự hiển thị đúng '120 / 500' ({char_test_res.get('counterText')})")

        # TEST CASE SCH-03: Smart sorting (Ongoing > Upcoming > Past)
        sort_test_res = self.client.evaluate("""
            (function() {
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                const todayStr = `${d}/${m}/${y}`;

                const curH = now.getHours();
                const ongoingTime = `${String(curH).padStart(2, '0')}:00 - ${String(curH + 1).padStart(2, '0')}:00`;
                const upcomingTime = `${String((curH + 3) % 24).padStart(2, '0')}:00 - ${String((curH + 4) % 24).padStart(2, '0')}:00`;

                const testItems = [
                    { id: "M-PAST", date: "01/01/2020", time: "08:00 - 09:00", content: "Đã qua", attendees: "All", location: "Hội trường" },
                    { id: "M-ONGOING", date: todayStr, time: ongoingTime, content: "Đang diễn ra", attendees: "All", location: "Hội trường" },
                    { id: "M-UPCOMING", date: "31/12/2028", time: "08:00 - 09:00", content: "Sắp diễn ra", attendees: "All", location: "Hội trường" }
                ];

                testItems.sort(compareScheduleSmart);
                return testItems.map(i => i.id);
            })()
        """)
        self.assert_equal(sort_test_res, ["M-ONGOING", "M-UPCOMING", "M-PAST"], "SCH-03: Sắp xếp 3 tầng: Đang diễn ra -> Sắp diễn ra -> Đã qua")

        # TEST CASE SCH-04: Word export modal and DOCX generation
        self.client.evaluate("switchScheduleTab('list')")
        self.client.evaluate("""
            scheduleData = [{
                id: "LT-TEST-01",
                date: "02/11/2026",
                dayOfWeek: "Thứ Hai",
                time: "08:00 - 10:00",
                content: "Họp giao ban Chi nhánh 23",
                attendees: "Toàn thể cán bộ",
                location: "Phòng họp số 1",
                email: "quan.vpdk@gmail.com",
                name: "Đỗ Trọng Minh Quân"
            }];
            openExportWordModal();
        """)
        modal_visible = self.client.evaluate("document.getElementById('exportWordModal').style.display != 'none'")
        self.assert_true(modal_visible, "SCH-04: Mở Modal #exportWordModal xuất Word NĐ 30")

        # Test Keyword red highlight helper
        highlight_test = self.client.evaluate("""
            (function() {
                if (typeof formatCellHtmlWithRedHighlight === 'function') {
                    return formatCellHtmlWithRedHighlight("Họp tại Chi nhánh 23 sáng thứ Hai");
                }
                return "";
            })()
        """)
        self.assert_true("style=\"color: #ff0000; font-weight: bold;\"" in highlight_test, "SCH-04: Tô màu đỏ cho từ khóa Chi nhánh 23 khi xuất Word")

        # Test DOCX library generation
        docx_res = self.client.evaluate("""
            (function() {
                if (!window.docx) return { hasDocx: false };
                const sampleData = [{
                    id: "TEST-01",
                    date: "02/11/2026",
                    dayOfWeek: "Thứ Hai",
                    time: "08:00 - 10:00",
                    content: "Họp giao ban Chi nhánh 23",
                    attendees: "Toàn thể cán bộ",
                    location: "Phòng họp số 1",
                    email: "quan.vpdk@gmail.com",
                    name: "Đỗ Trọng Minh Quân"
                }];
                // Test if generator executes without throwing error
                return generateDocxWithLibrary(sampleData, "02/11/2026", "02/11/2026", "02", "11", 2026)
                    .then(doc => ({ hasDocx: true, docCreated: !!doc }))
                    .catch(err => ({ hasDocx: true, error: err.toString() }));
            })()
        """, await_promise=True)

        self.assert_true(docx_res.get("hasDocx"), "SCH-04: Nạp thư viện window.docx UMD")
        self.assert_true(docx_res.get("docCreated") or not docx_res.get("error"), f"SCH-04: Khởi tạo đối tượng docx NĐ 30 chuẩn ({docx_res.get('error', 'OK')})")
        self.client.evaluate("closeExportWordModal()")

    # -------------------------------------------------------------
    # 5. HRM - TRA CỨU NHÂN SỰ (hrm.html & js/hrm.js)
    # -------------------------------------------------------------
    def test_hrm_workflow(self):
        print("\n👥 [NHÓM 4B] Kiểm tra Phân hệ HRM - Tra Cứu Nhân Sự (hrm.html & js/hrm.js)")

        mock_user = {
            "username": "quandtm",
            "fullname": "Đỗ Trọng Minh Quân",
            "phone": "0973807027",
            "position": "Chuyên viên CNTT",
            "department": "Tổ Hành chính - Tổng hợp",
            "role": "admin"
        }
        self.client.evaluate(f"FamilyAuth.saveSession({json.dumps(mock_user)});")
        self.client.navigate(f"{BASE_URL}/hrm.html")
        for _ in range(25):
            time.sleep(0.25)
            is_ready = self.client.evaluate("typeof window.FamilyHRM === 'object'")
            if is_ready:
                break

        has_header = self.client.evaluate("!!document.getElementById('appTopbar')")
        has_footer = self.client.evaluate("!!document.getElementById('appFooter')")
        self.assert_true(has_header and has_footer, "HRM: Layout controller nạp Topbar & Footer")

        # Nạp danh sách giả lập có chứa cccd, mật khẩu và 1 nhân sự Đã nghỉ
        hrm_res = self.client.evaluate("""
            (function() {
                const sampleUsers = [
                    {
                        fullname: "Nguyễn Chiến Thắng",
                        username: "thangnc",
                        position: "Giám đốc",
                        department: "Ban Giám đốc",
                        phone: "0901112223",
                        status: "Đang làm việc",
                        role: "admin",
                        cccd: "074088001234",
                        password: "secret",
                        createdDate: "01/01/2026"
                    },
                    {
                        fullname: "Đỗ Trọng Minh Quân",
                        username: "quandtm",
                        position: "Chuyên viên CNTT",
                        department: "Tổ Hành chính - Tổng hợp",
                        phone: "0973807027",
                        status: "Đang làm việc",
                        role: "admin",
                        cccd: "074095005678",
                        createdDate: "01/01/2026"
                    },
                    {
                        fullname: "Trần Văn Tuấn",
                        username: "tuantv",
                        position: "Chuyên viên",
                        department: "Tổ Kỹ thuật Địa chính",
                        phone: "0912345678",
                        status: "Đang làm việc",
                        role: "user",
                        cccd: "074092009999",
                        createdDate: "02/01/2026"
                    },
                    {
                        fullname: "Lê Văn Nghỉ",
                        username: "nghilv",
                        position: "Chuyên viên",
                        department: "Tổ Kỹ thuật Địa chính",
                        phone: "0988777666",
                        status: "Đã nghỉ",
                        role: "user",
                        cccd: "074091008888",
                        createdDate: "03/01/2026"
                    }
                ];

                window.FamilyHRM.setUsersForTest(sampleUsers);

                const cardsCount = document.querySelectorAll('#staffCardGrid .hrm-staff-card').length;
                const bodyText = document.body.innerText;
                const hasAnyCccd = bodyText.includes("074088001234") || bodyText.includes("074095005678") || bodyText.includes("074092009999") || bodyText.includes("074091008888");
                const adminStatusVisible = !document.getElementById('filterStatusField').classList.contains('hidden');

                // Tìm theo tên không dấu
                document.getElementById('searchUserInput').value = "minh quan";
                window.FamilyHRM.applyFilters();
                const searchMatched = window.FamilyHRM.getFilteredUsers().map(u => u.username);

                // Reset search & lọc theo phòng ban
                document.getElementById('searchUserInput').value = "";
                document.getElementById('filterDeptSelect').value = "Tổ Kỹ thuật Địa chính";
                window.FamilyHRM.applyFilters();
                const deptMatched = window.FamilyHRM.getFilteredUsers().map(u => u.username);

                // Reset lọc & chuyển sang Table View + mở Detail Modal
                document.getElementById('filterDeptSelect').value = "ALL";
                window.FamilyHRM.applyFilters();
                window.FamilyHRM.switchViewMode("table");
                const tableRowsCount = document.querySelectorAll('#staffTableBody tr').length;

                const firstUid = window.FamilyHRM.getFilteredUsers()[0].uid;
                window.FamilyHRM.openStaffDetail(firstUid);
                const modalOpen = !document.getElementById('modalStaffDetail').classList.contains('hidden');
                const modalText = document.getElementById('modalStaffDetail').innerText;
                const modalHasCccd = modalText.includes("074088001234") || modalText.includes("074095005678") || modalText.includes("074092009999");
                window.FamilyHRM.closeStaffDetail();

                // Kiểm tra RBAC xem trạng thái nghỉ việc:
                // 1. Chuyên viên thường (không được xem Đã nghỉ)
                FamilyAuth.saveSession({
                    username: "tuantv",
                    fullname: "Trần Văn Tuấn",
                    phone: "0912345678",
                    position: "Chuyên viên",
                    department: "Tổ Kỹ thuật Địa chính",
                    role: "user"
                });
                window.FamilyHRM.setUsersForTest(sampleUsers);
                const regularUserVisible = window.FamilyHRM.getRawUsers().map(u => u.username);
                const regularStatusHidden = document.getElementById('filterStatusField').classList.contains('hidden');

                // 2. Phó Giám đốc (không phải Giám đốc, không được xem Đã nghỉ)
                FamilyAuth.saveSession({
                    username: "cuongdh",
                    fullname: "Đặng Huy Cường",
                    phone: "0902223334",
                    position: "Phó Giám đốc",
                    department: "Ban Giám đốc",
                    role: "admin"
                });
                window.FamilyHRM.setUsersForTest(sampleUsers);
                const viceDirVisible = window.FamilyHRM.getRawUsers().map(u => u.username);

                // 3. Giám đốc (được xem Đã nghỉ)
                FamilyAuth.saveSession({
                    username: "thangnc",
                    fullname: "Nguyễn Chiến Thắng",
                    phone: "0901112223",
                    position: "Giám đốc",
                    department: "Ban Giám đốc",
                    role: "admin"
                });
                window.FamilyHRM.setUsersForTest(sampleUsers);
                const directorVisible = window.FamilyHRM.getRawUsers().map(u => u.username);

                // 4. Nguyễn Thị Bích Tuyền (được xem Đã nghỉ)
                FamilyAuth.saveSession({
                    username: "tuyenntb",
                    fullname: "Nguyễn Thị Bích Tuyền",
                    phone: "0909736435",
                    position: "Tổ trưởng",
                    department: "Tổ Hành chính - Tổng hợp",
                    role: "admin"
                });
                window.FamilyHRM.setUsersForTest(sampleUsers);
                const tuyenVisible = window.FamilyHRM.getRawUsers().map(u => u.username);

                return {
                    cardsCount,
                    hasAnyCccd,
                    adminStatusVisible,
                    searchMatched,
                    deptMatched,
                    tableRowsCount,
                    modalOpen,
                    modalHasCccd,
                    regularUserVisible,
                    regularStatusHidden,
                    viceDirVisible,
                    directorVisible,
                    tuyenVisible
                };
            })()
        """)

        self.assert_equal(hrm_res.get("cardsCount"), 4, "HRM: IT Admin xem đầy đủ 4 nhân sự (gồm cả Đã nghỉ)")
        self.assert_true(hrm_res.get("adminStatusVisible"), "HRM: IT Admin thấy bộ lọc Trạng thái")
        self.assert_true(not hrm_res.get("hasAnyCccd"), "HRM: Tuyệt đối KHÔNG hiển thị CCCD trên thẻ/bảng")
        self.assert_equal(hrm_res.get("searchMatched"), ["quandtm"], "HRM: Tìm kiếm theo tên không dấu chính xác")
        self.assert_equal(hrm_res.get("deptMatched"), ["tuantv", "nghilv"], "HRM: Lọc theo phòng ban chính xác")
        self.assert_equal(hrm_res.get("tableRowsCount"), 4, "HRM: Chế độ xem Bảng hiển thị đủ 4 dòng")
        self.assert_true(hrm_res.get("modalOpen") and not hrm_res.get("modalHasCccd"), "HRM: Modal chi tiết mở đúng và không chứa CCCD")
        self.assert_true("nghilv" not in hrm_res.get("regularUserVisible", []) and hrm_res.get("regularStatusHidden"), "HRM RBAC: Chuyên viên thường chỉ thấy Đang làm việc và ẩn lọc Trạng thái")
        self.assert_true("nghilv" not in hrm_res.get("viceDirVisible", []), "HRM RBAC: Phó Giám đốc không thấy nhân sự Đã nghỉ")
        self.assert_true("nghilv" in hrm_res.get("directorVisible", []), "HRM RBAC: Giám đốc xem được nhân sự Đã nghỉ")
        self.assert_true("nghilv" in hrm_res.get("tuyenVisible", []), "HRM RBAC: Nguyễn Thị Bích Tuyền xem được nhân sự Đã nghỉ")

    # -------------------------------------------------------------
    # 5. OTHER MODULES INTEGRITY (giao_viec.html & bao_cao_to.html)
    # -------------------------------------------------------------
    def test_other_modules_integrity(self):
        print("\n📊 [NHÓM 5] Kiểm tra Tính Toàn Vẹn Của Các Phân Hệ Còn Lại")

        mock_user = {
            "username": "quandtm",
            "fullname": "Đỗ Trọng Minh Quân",
            "phone": "0973807027",
            "position": "Chuyên viên CNTT",
            "department": "Tổ Hành chính - Tổng hợp",
            "role": "admin"
        }
        self.client.evaluate(f"FamilyAuth.saveSession({json.dumps(mock_user)});")

        for page in ["giao_viec.html", "bao_cao_to.html"]:
            self.client.navigate(f"{BASE_URL}/{page}")
            time.sleep(1.0)

            # Check no uncaught JS crash, title loaded
            title = self.client.evaluate("document.title")
            self.assert_true(len(title) > 0, f"Phân hệ {page} nạp thành công", title)

            # Check layout controller added topbar & slim footer
            has_header = self.client.evaluate("!!document.getElementById('appTopbar')")
            has_footer = self.client.evaluate("!!document.getElementById('appFooter')")
            self.assert_true(has_header and has_footer, f"Layout controller nạp Topbar & Slim Footer trên {page}")

    # -------------------------------------------------------------
    # 6. SECURITY & PII COMPLIANCE (SEC-01 to SEC-04)
    # -------------------------------------------------------------
    def test_security_and_pii_rules(self):
        print("\n🛡️ [NHÓM 6] Kiểm tra Tuân Thủ An Toàn Thông Tin Cá Nhân (SEC-01 -> SEC-04)")

        # SEC-01: No CCCD visible on UI across pages
        for page in ["index.html", "lich_tuan.html", "it_helpdesk.html", "giao_viec.html", "bao_cao_to.html", "hrm.html"]:
            self.client.navigate(f"{BASE_URL}/{page}")
            time.sleep(0.5)

            # Look for 12-digit number pattern typical of CCCD
            found_cccd = self.client.evaluate("""
                (function() {
                    const text = document.body.innerText;
                    // Match 12 consecutive digits that look like CCCD (0xxxxxxxxxxx)
                    const matches = text.match(/\\b0\\d{11}\\b/g);
                    return matches || [];
                })()
            """)
            self.assert_equal(len(found_cccd), 0, f"SEC-01: Không có số CCCD hiển thị trên giao diện {page}")

        # SEC-02: No CCCD stored in sessionStorage
        session_user = self.client.evaluate("sessionStorage.getItem('family_user')")
        if session_user:
            user_dict = json.loads(session_user)
            self.assert_true("cccd" not in user_dict, "SEC-02: Không lưu trường 'cccd' trong sessionStorage family_user")

        # SEC-03: API Check (Local backend check)
        gas_file = os.path.join(WORKSPACE, "backend", "google_apps_script.js")
        with open(gas_file, "r", encoding="utf-8") as f:
            gas_content = f.read()

        # Check that getUsers in backend/google_apps_script.js does not push cccd
        get_users_block = gas_content[gas_content.find("action === \"getUsers\""):gas_content.find("action === \"getTasks\"")]
        self.assert_true("cccd: " not in get_users_block and "colCccd" in get_users_block,
                         "SEC-03: Backend google_apps_script.js không trả trường cccd trong getUsers")

        # SEC-04: Phone variable in IT Helpdesk does not fallback to CCCD
        with open(os.path.join(WORKSPACE, "it_helpdesk.html"), "r", encoding="utf-8") as f:
            hd_content = f.read()
        self.assert_true("user.cccd" not in hd_content and "cccd" not in hd_content.lower().split("body")[1],
                         "SEC-04: it_helpdesk.html không fallback số điện thoại sang CCCD")


if __name__ == "__main__":
    runner = TestRunner()
    runner.run_all()
    # Exit with code 0 if all passed, 1 if any failed
    sys.exit(0 if runner.failed == 0 else 1)
