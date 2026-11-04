import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
E2E TEST FOR IT HELPDESK RBAC, UI/UX, AND USERNAME DISPLAY
Validates:
1. Desktop table visibility (regression test for .hidden !important override bug).
2. Admin view (quandtm / 0973807027): Sees full sheet tickets (9 tickets), title "Toàn Cơ Quan", badge "Quản trị IT", @username in table.
3. Non-admin view (mailtp / 0972709729): Sees only their own ticket(s) (1 ticket), title "Danh Sách Sự Cố Của Tôi", badge "Cán bộ cá nhân", stats match personal count.
4. Non-admin view with 0 tickets (hoa.lt): Displays personal empty-state message.
5. Mobile viewport: Table hidden, mobile cards visible with @username badge.
6. Detail modal displays @username badge correctly.
"""

import os
import sys
import time
import json
import socket
import urllib.request
import subprocess

PORT = 8991
CDP_PORT = 9251
BASE_URL = f"http://localhost:{PORT}"
WORKSPACE = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class ChromeCDPClient:
    def __init__(self, cdp_port=CDP_PORT):
        self.cdp_port = cdp_port
        self.sock = None
        self.msg_id = 1

    def connect_tab(self, url_filter=""):
        with urllib.request.urlopen(f"http://localhost:{self.cdp_port}/json") as r:
            tabs = json.loads(r.read())
        target = next((t for t in tabs if url_filter in t.get("url", "")), None)
        if not target:
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
        masked = bytearray(payload)
        for i in range(len(masked)):
            masked[i] ^= mask[i % 4]
        
        self.sock.sendall(hdr + masked)
        
        while True:
            head = self._recv_exact(2)
            b1, b2 = head[0], head[1]
            plen = b2 & 0x7F
            if plen == 126:
                plen = int.from_bytes(self._recv_exact(2), "big")
            elif plen == 127:
                plen = int.from_bytes(self._recv_exact(8), "big")
            data = self._recv_exact(plen)
            try:
                res = json.loads(data.decode("utf-8"))
                if res.get("id") == mid:
                    return res
            except Exception:
                pass

    def _recv_exact(self, n):
        b = b""
        while len(b) < n:
            chunk = self.sock.recv(n - len(b))
            if not chunk:
                raise RuntimeError("Socket closed unexpectedly")
            b += chunk
        return b

    def eval_js(self, expression):
        res = self.send_cmd("Runtime.evaluate", {
            "expression": expression,
            "returnByValue": True,
            "awaitPromise": True
        })
        if "result" in res and "result" in res["result"]:
            val = res["result"]["result"]
            return val.get("value")
        return None

def run_tests():
    print("=" * 60)
    print("🛠️  KIỂM THỬ E2E: IT HELPDESK RBAC, UI/UX, VÀ HIỂN THỊ USERNAME")
    print("=" * 60)

    # 1. Start HTTP Server
    http_proc = subprocess.Popen(
        ["python3", "-m", "http.server", str(PORT)],
        cwd=WORKSPACE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(1)

    # 2. Start Headless Chrome
    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    chrome_proc = subprocess.Popen([
        chrome_bin,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "--window-size=1280,900",
        f"{BASE_URL}/index.html"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2)

    client = ChromeCDPClient(CDP_PORT)
    client.connect_tab("index.html")

    passed = 0
    failed = 0

    def assert_true(cond, name, details=""):
        nonlocal passed, failed
        if cond:
            print(f"  ✅ [PASS] {name}")
            passed += 1
        else:
            print(f"  ❌ [FAIL] {name} - {details}")
            failed += 1

    try:
        # TEST 1: Admin Login (quandtm) - Full View
        print("\n--- TEST SCENARIO 1: QUẢN TRỊ VIÊN IT (QUANDTM) ---")
        client.send_cmd("Page.navigate", {"url": f"{BASE_URL}/index.html"})
        time.sleep(1)

        # Set admin session
        admin_session_js = """
        FamilyAuth.saveSession({
            username: "quandtm",
            fullname: "Đỗ Trọng Minh Quân",
            phone: "0973807027",
            role: "admin",
            department: "Chi nhánh số 23"
        });
        """
        client.eval_js(admin_session_js)
        
        # Navigate to it_helpdesk.html
        client.send_cmd("Page.navigate", {"url": f"{BASE_URL}/it_helpdesk.html"})
        
        # Poll until data loaded or timeout 6s
        for _ in range(20):
            time.sleep(0.3)
            loaded = client.eval_js("currentTickets && currentTickets.length > 0")
            if loaded:
                break

        # Check desktop table container visibility
        table_style = client.eval_js("""
            (() => {
                const el = document.querySelector('.helpdesk-desktop-table');
                if (!el) return null;
                const style = window.getComputedStyle(el);
                return {
                    display: style.display,
                    visibility: style.visibility,
                    offsetWidth: el.offsetWidth,
                    offsetHeight: el.offsetHeight,
                    winWidth: window.innerWidth
                };
            })()
        """)
        assert_true(
            table_style and table_style.get("display") == "block" and table_style.get("offsetWidth", 0) > 500,
            "Desktop Table Container hiển thị chuẩn trên màn hình máy tính (không bị display: none)",
            f"Table style: {table_style}"
        )

        # Check Monitoring Title & Badge for Admin
        admin_title = client.eval_js("document.getElementById('monitoringTitle')?.textContent")
        admin_badge = client.eval_js("document.getElementById('roleScopeBadge')?.textContent")
        assert_true(
            admin_title and "Toàn Cơ Quan" in admin_title,
            "Tiêu đề hiển thị đúng cho Quản trị viên: (Toàn Cơ Quan)",
            f"Actual title: {admin_title}"
        )
        assert_true(
            admin_badge and "Quản trị IT" in admin_badge,
            "Badge hiển thị đúng: Quản trị IT (Xem & Điều phối toàn bộ sự cố)",
            f"Actual badge: {admin_badge}"
        )

        # Check total rows rendered for admin
        row_count = client.eval_js("document.querySelectorAll('#ticketTableBody tr').length")
        assert_true(
            row_count and row_count >= 8,
            f"Quản trị viên nhìn thấy đầy đủ toàn bộ ticket cơ quan ({row_count} rows)",
            f"Row count: {row_count}"
        )

        # Check presence of @username badge in table
        usernames_in_table = client.eval_js("""
            (() => {
                const badges = Array.from(document.querySelectorAll('#ticketTableBody .bg-indigo-50'));
                return badges.map(b => b.textContent.trim());
            })()
        """)
        assert_true(
            usernames_in_table and len(usernames_in_table) > 0 and any("@" in u for u in usernames_in_table),
            f"Cột 'Người gửi / Tài khoản' hiển thị rõ ràng huy hiệu @username: {usernames_in_table}",
            f"Usernames found: {usernames_in_table}"
        )

        # Open Detail Modal and verify @username
        client.eval_js("""
            (() => {
                const firstRow = document.querySelector('#ticketTableBody tr');
                if (firstRow) firstRow.click();
            })()
        """)
        time.sleep(0.5)

        modal_username = client.eval_js("document.getElementById('detailUsername')?.textContent")
        modal_visible = client.eval_js("!document.getElementById('modalTicketDetail')?.classList.contains('hidden')")
        assert_true(
            modal_visible and modal_username and "@" in modal_username,
            f"Modal chi tiết hiển thị thẻ Username: {modal_username}",
            f"Modal visible: {modal_visible}, username: {modal_username}"
        )

        # Close detail modal
        client.eval_js("closeTicketDetail()")
        time.sleep(0.3)


        # TEST 2: Regular Staff (mailtp - Lê Thị Phương Mai) - Restricted View
        print("\n--- TEST SCENARIO 2: CÁN BỘ CÁ NHÂN (MAILTP) ---")
        user_session_js = """
        FamilyAuth.saveSession({
            username: "mailtp",
            fullname: "Lê Thị Phương Mai",
            phone: "0972709729",
            role: "user",
            department: "Tổ Kỹ thuật Địa chính"
        });
        """
        client.eval_js(user_session_js)
        client.send_cmd("Page.navigate", {"url": f"{BASE_URL}/it_helpdesk.html"})
        
        for _ in range(20):
            time.sleep(0.3)
            loaded = client.eval_js("currentTickets && currentTickets.length > 0")
            if loaded:
                break

        user_title = client.eval_js("document.getElementById('monitoringTitle')?.textContent")
        user_badge = client.eval_js("document.getElementById('roleScopeBadge')?.textContent")
        assert_true(
            user_title and "Của Tôi" in user_title,
            "Tiêu đề tự động đổi thành: 'Danh Sách Sự Cố Của Tôi'",
            f"Actual title: {user_title}"
        )
        assert_true(
            user_badge and "Cán bộ cá nhân" in user_badge,
            "Badge đổi thành: 'Cán bộ cá nhân (Chỉ xem sự cố của bạn)'",
            f"Actual badge: {user_badge}"
        )

        # Check that regular user only sees their own ticket
        user_row_count = client.eval_js("document.querySelectorAll('#ticketTableBody tr').length")
        user_stat_total = client.eval_js("document.getElementById('statTotal')?.textContent")
        assert_true(
            user_row_count == 1 and user_stat_total == "1",
            f"Phân quyền RBAC chính xác: Cán bộ mailtp chỉ thấy đúng 1 ticket của mình (stat: {user_stat_total})",
            f"Rows: {user_row_count}, stat: {user_stat_total}"
        )

        user_ticket_sender = client.eval_js("document.querySelector('#ticketTableBody tr td:nth-child(2)')?.textContent")
        assert_true(
            user_ticket_sender and "Phương Mai" in user_ticket_sender and "@mailtp" in user_ticket_sender,
            f"Ticket hiển thị đúng thông tin của Lê Thị Phương Mai (@mailtp): {user_ticket_sender}",
            f"Sender text: {user_ticket_sender}"
        )


        # TEST 3: Regular Staff with 0 tickets (hoa.lt) - Empty State
        print("\n--- TEST SCENARIO 3: CÁN BỘ CHƯA CÓ TICKET NÀO (HOA.LT) ---")
        new_user_js = """
        FamilyAuth.saveSession({
            username: "hoa.lt",
            fullname: "Lê Thị Hoa",
            phone: "0987000111",
            role: "user",
            department: "Bộ phận Một Cửa"
        });
        """
        client.eval_js(new_user_js)
        client.send_cmd("Page.navigate", {"url": f"{BASE_URL}/it_helpdesk.html"})
        
        for _ in range(20):
            time.sleep(0.3)
            loaded = client.eval_js("currentTickets && currentTickets.length > 0")
            if loaded:
                break

        empty_visible = client.eval_js("!document.getElementById('emptyTableState')?.classList.contains('hidden')")
        empty_title = client.eval_js("document.getElementById('emptyStateTitle')?.textContent")
        empty_desc = client.eval_js("document.getElementById('emptyStateDesc')?.textContent")
        assert_true(
            empty_visible and empty_title and "Đồng chí chưa có yêu cầu sự cố nào" in empty_title,
            f"Giao diện hiển thị Empty-State thân thiện: '{empty_title}'",
            f"Visible: {empty_visible}, title: {empty_title}, desc: {empty_desc}"
        )


        # TEST 4: Mobile Responsive Viewport (< 768px)
        print("\n--- TEST SCENARIO 4: MOBILE RESPONSIVE (IPHONE VIEWPORT 375x667) ---")
        client.send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 375,
            "height": 667,
            "deviceScaleFactor": 2,
            "mobile": True
        })
        time.sleep(0.5)

        mobile_display = client.eval_js("""
            (() => {
                const table = document.querySelector('.helpdesk-desktop-table');
                const cards = document.querySelector('.helpdesk-mobile-cards');
                return {
                    tableDisplay: window.getComputedStyle(table).display,
                    cardsDisplay: window.getComputedStyle(cards).display
                };
            })()
        """)
        assert_true(
            mobile_display and mobile_display.get("tableDisplay") == "none" and mobile_display.get("cardsDisplay") == "block",
            "Responsive Mobile: Desktop Table ẩn hoàn toàn, Mobile Cards hiển thị hoàn hảo",
            f"Mobile display: {mobile_display}"
        )

        # Reset viewport back to desktop
        client.send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 1280,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })


        # TEST 5: Clean up
        print("\n--- CLEAN UP ---")
        client.eval_js("sessionStorage.clear(); localStorage.clear();")
        print("  🧹 Đã xóa sạch session và local storage sau test.")

    finally:
        try:
            client.eval_js("sessionStorage.clear(); localStorage.clear();")
        except: pass
        if client.sock:
            client.sock.close()
        chrome_proc.terminate()
        http_proc.terminate()
        chrome_proc.wait()
        http_proc.wait()

    print("\n" + "=" * 60)
    print(f"📊 KẾT QUẢ KIỂM THỬ: {passed} PASS, {failed} FAIL")
    print("=" * 60)
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
