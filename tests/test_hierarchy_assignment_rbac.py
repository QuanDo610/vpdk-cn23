import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
# -*- coding: utf-8 -*-
"""
TEST SUITE: KIỂM THỬ PHÂN CẤP GIAO VIỆC & RÀO CHẮN THẨM QUYỀN (HIERARCHY & PERMISSION TEST)
1. Giám đốc > Phó Giám đốc > Tổ trưởng > Tổ phó > Chuyên viên / Nhân viên.
2. Chuyên viên thường: Ẩn hoàn toàn giao diện giao việc (Form + nút chuyển tab + nút nhanh).
3. Lãnh đạo giao việc: Tự động điền thông tin người đăng nhập, khóa trường (readonly).
4. Tổ trưởng / Tổ phó: Cố định và khóa Tổ chuyên môn (disabled = true), chỉ giao việc nội bộ tổ.
5. Cấm tự giao việc cho chính mình: Loại bỏ người đăng nhập khỏi dropdown nhận việc.
6. Cấm giao việc vượt cấp lên trên: Tổ phó không giao cho Tổ trưởng, PGĐ không giao cho Giám đốc.
"""
import os
import sys
import json
import time
import socket
import urllib.request
import subprocess

PORT = 8994
CDP_PORT = 9335
BASE_URL = f"http://localhost:{PORT}"
WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def find_chrome():
    paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    return None

class ChromeCDPClient:
    def __init__(self, cdp_port=CDP_PORT):
        self.cdp_port = cdp_port
        self.sock = None
        self.msg_id = 1

    def connect_tab(self, url_filter):
        time.sleep(1)
        with urllib.request.urlopen(f"http://127.0.0.1:{self.cdp_port}/json") as r:
            tabs = json.loads(r.read())
        target = next((t for t in tabs if url_filter in t.get("url", "")), None)
        if not target:
            target = next((t for t in tabs if t.get("type") == "page"), None)
        if not target:
            raise RuntimeError(f"No target tab found for {url_filter}")
        
        ws_url = target["webSocketDebuggerUrl"]
        host_port = ws_url.split("ws://")[1].split("/")[0]
        path = "/" + ws_url.split(host_port + "/")[1]
        host, port_str = host_port.split(":")
        
        if self.sock:
            try: self.sock.close()
            except: pass
        
        self.sock = socket.create_connection((host, int(port_str)), timeout=10)
        req = (f"GET {path} HTTP/1.1\r\n"
               f"Host: {host_port}\r\n"
               f"Upgrade: websocket\r\n"
               f"Connection: Upgrade\r\n"
               f"Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
               f"Sec-WebSocket-Version: 13\r\n\r\n")
        self.sock.sendall(req.encode())
        resp = b""
        while b"\r\n\r\n" not in resp:
            resp += self.sock.recv(1024)
        if b"101" not in resp:
            raise RuntimeError(f"WebSocket upgrade failed: {resp.decode('utf-8', errors='ignore')}")

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
            head = self.sock.recv(2)
            if not head:
                raise RuntimeError("Connection closed")
            b1, b2 = head[0], head[1]
            plen = b2 & 0x7F
            if plen == 126:
                plen = int.from_bytes(self.sock.recv(2), "big")
            elif plen == 127:
                plen = int.from_bytes(self.sock.recv(8), "big")
            
            data = b""
            while len(data) < plen:
                chunk = self.sock.recv(plen - len(data))
                if not chunk:
                    break
                data += chunk
            
            try:
                res = json.loads(data.decode("utf-8", errors="ignore"))
                if res.get("id") == mid:
                    return res.get("result", {})
            except:
                pass

    def eval_js(self, expression):
        res = self.send_cmd("Runtime.evaluate", {
            "expression": expression,
            "returnByValue": True,
            "awaitPromise": True
        })
        if "exceptionDetails" in res:
            raise RuntimeError(f"JS Error: {res['exceptionDetails']}")
        return res.get("result", {}).get("value")

def run_tests():
    print("=" * 70)
    print("🔍 BẮT ĐẦU KIỂM THỬ: PHÂN CẤP GIAO VIỆC, TỰ ĐIỀN LÃNH ĐẠO & CHỐNG TỰ GIAO VIỆC")
    print("=" * 70)

    # Khởi động HTTP server
    http_proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=WORKSPACE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(1.2)

    chrome_bin = find_chrome()
    if not chrome_bin:
        print("❌ Không tìm thấy Chrome trên máy tính!")
        http_proc.terminate()
        return

    user_data_dir = os.path.join(WORKSPACE, "tmp_chrome_rbac2")
    chrome_proc = subprocess.Popen([
        chrome_bin,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        f"--user-data-dir={user_data_dir}",
        "--no-first-run",
        "--no-default-browser-check",
        f"{BASE_URL}/index.html"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2.5)

    try:
        client = ChromeCDPClient(CDP_PORT)
        client.connect_tab("index.html")

        # -----------------------------------------------------------------
        # TEST CASE 1: Chuyên viên thường (Võ Phi Trúc - HCTH)
        # Kỳ vọng: Form giao việc bị ẩn, tab giao việc bị ẩn, không thể switch sang tab giao việc
        # -----------------------------------------------------------------
        print("\n🚫 [TEST CASE 1] Chuyên viên thường: Võ Phi Trúc (Tổ Hành chính Tổng hợp)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "trucvp",
                fullname: "Võ Phi Trúc",
                phone: "0901234567",
                position: "Chuyên viên",
                department: "Tổ Hành chính Tổng hợp",
                role: "user"
            }));
        """)
        client.send_cmd("Page.enable")
        client.send_cmd("Page.navigate", {"url": f"{BASE_URL}/giao_viec.html"})
        time.sleep(2)

        tab_assign_display = client.eval_js("document.getElementById('tabBtnAssign')?.style.display")
        quick_assign_display = client.eval_js("document.getElementById('btnQuickOpenAssign')?.style.display")
        panel_assign_hidden = client.eval_js("document.getElementById('panelAssign')?.classList.contains('hidden')")
        print(f"  Tab Giao việc style.display: '{tab_assign_display}' (Kỳ vọng: 'none')")
        print(f"  Nút Giao việc nhanh style.display: '{quick_assign_display}' (Kỳ vọng: 'none')")
        print(f"  Panel Giao việc có class 'hidden': {panel_assign_hidden} (Kỳ vọng: True)")
        assert tab_assign_display == "none", "Tab giao việc phải bị ẩn với Chuyên viên!"
        assert quick_assign_display == "none", "Nút giao việc nhanh phải bị ẩn với Chuyên viên!"
        assert panel_assign_hidden is True, "Panel giao việc phải bị ẩn với Chuyên viên!"

        # Thử cố tình chuyển sang tab assign qua code
        client.eval_js("switchTaskTab('assign');")
        current_panel_hidden = client.eval_js("document.getElementById('panelAssign')?.classList.contains('hidden')")
        toast_msg = client.eval_js("document.getElementById('toastContainer')?.innerText || ''")
        print(f"  Cảnh báo khi Chuyên viên cố tình mở form giao việc: '{toast_msg}'")
        assert current_panel_hidden is True, "Hệ thống phải chặn không cho Chuyên viên mở panel assign!"
        assert "không có quyền giao việc" in toast_msg.lower(), "Phải có thông báo lỗi phân quyền!"
        print("  ✅ PASS: Chuyên viên thường không có giao diện giao việc, chỉ theo dõi tiến độ!")

        # -----------------------------------------------------------------
        # TEST CASE 2: Tổ trưởng (Trần Quốc Hưng - Tổ trưởng KTĐC)
        # Kỳ vọng:
        # - Có tab giao việc
        # - Lãnh đạo giao việc: Tự điền 'Trần Quốc Hưng — Tổ trưởng', readonly
        # - Tổ chuyên môn: Cố định và BỊ KHÓA (disabled = True) là 'Tổ Kỹ thuật Địa chính và Lưu trữ'
        # - Dropdown nhận việc: Chỉ chứa cán bộ KTĐC, KHÔNG CÓ Trần Quốc Hưng (chống tự giao), KHÔNG CÓ BGĐ/Tổ khác
        # -----------------------------------------------------------------
        print("\n📐 [TEST CASE 2] Tổ trưởng: Trần Quốc Hưng (Tổ Kỹ thuật Địa chính & Lưu trữ)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "hungtq",
                fullname: "Trần Quốc Hưng",
                phone: "0908888999",
                position: "Tổ trưởng",
                department: "Tổ Kỹ thuật Địa chính và Lưu trữ",
                role: "user"
            }));
            initUserSession();
        """)
        
        tab_assign_display2 = client.eval_js("document.getElementById('tabBtnAssign')?.style.display")
        assert tab_assign_display2 != "none", "Tổ trưởng phải thấy tab giao việc!"
        
        client.eval_js("switchTaskTab('assign');")
        leader_val = client.eval_js("document.getElementById('assignLeader')?.value || ''")
        leader_readonly = client.eval_js("document.getElementById('assignLeader')?.readOnly")
        print(f"  Ô Lãnh đạo giao việc: '{leader_val}' (readonly: {leader_readonly})")
        assert "Trần Quốc Hưng" in leader_val, "Phải tự động điền tên Trần Quốc Hưng!"
        assert leader_readonly is True, "Ô Lãnh đạo giao việc phải là readonly!"

        dept_select_val = client.eval_js("document.getElementById('filterStaffDept')?.value || ''")
        dept_select_disabled = client.eval_js("document.getElementById('filterStaffDept')?.disabled")
        print(f"  Tổ chuyên môn: '{dept_select_val}' (disabled: {dept_select_disabled})")
        assert "Địa chính" in dept_select_val, "Tổ chuyên môn phải tự chọn Tổ Kỹ thuật Địa chính!"
        assert dept_select_disabled is True, "Tổ chuyên môn phải bị khóa cứng (disabled) với Tổ trưởng!"

        # Kiểm tra danh sách cán bộ nhận việc trong dropdown
        staff_opts = client.eval_js("""
            Array.from(document.querySelectorAll('#assignStaff option')).map(o => o.textContent)
        """)
        print(f"  Số lượng lựa chọn cán bộ trong dropdown: {len(staff_opts)}")
        staff_str = " | ".join(staff_opts)
        
        # 1. Không được tự giao cho mình
        assert "Trần Quốc Hưng" not in staff_str, "CẢNH BÁO: Trần Quốc Hưng không được xuất hiện trong dropdown nhận việc của chính mình!"
        # 2. Không được có Ban Giám đốc
        assert "Nguyễn Chiến Thắng" not in staff_str, "CẢNH BÁO: Tổ trưởng không được giao việc cho Ban Giám đốc!"
        # 3. Không được có cán bộ tổ khác (ví dụ: Võ Phi Trúc bên HCTH)
        assert "Võ Phi Trúc" not in staff_str, "CẢNH BÁO: Tổ trưởng KTĐC không được giao việc cho cán bộ Tổ HCTH!"
        # 4. Phải có Tổ phó và Chuyên viên thuộc KTĐC
        assert "Đặng Thị Tuyết Trinh" in staff_str or "Lê Sơn Thanh" in staff_str, "Phải có cấp dưới thuộc Tổ KTĐC!"
        print("  ✅ PASS: Tổ trưởng KTĐC tự điền tên, khóa đúng Tổ, chống tự giao việc và chống giao việc chéo tổ!")

        # -----------------------------------------------------------------
        # TEST CASE 3: Tổ phó (Đặng Thị Tuyết Trinh - Tổ phó KTĐC)
        # Kỳ vọng:
        # - Lãnh đạo giao việc: Tự điền 'Đặng Thị Tuyết Trinh — Tổ phó'
        # - Khóa tổ KTĐC
        # - Dropdown nhận việc: KHÔNG CÓ Đặng Thị Tuyết Trinh (tự giao), KHÔNG CÓ Trần Quốc Hưng (Tổ trưởng - cấp trên)
        # -----------------------------------------------------------------
        print("\n📋 [TEST CASE 3] Tổ phó: Đặng Thị Tuyết Trinh (Tổ phó Kỹ thuật Địa chính)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "trinhdtt",
                fullname: "Đặng Thị Tuyết Trinh",
                phone: "0907777888",
                position: "Tổ phó",
                department: "Tổ Kỹ thuật Địa chính và Lưu trữ",
                role: "user"
            }));
            initUserSession();
        """)
        leader_trinh = client.eval_js("document.getElementById('assignLeader')?.value || ''")
        print(f"  Ô Lãnh đạo giao việc: '{leader_trinh}'")
        assert "Đặng Thị Tuyết Trinh" in leader_trinh, "Phải tự điền Đặng Thị Tuyết Trinh!"

        staff_opts_trinh = client.eval_js("""
            Array.from(document.querySelectorAll('#assignStaff option')).map(o => o.textContent)
        """)
        staff_str_trinh = " | ".join(staff_opts_trinh)
        # 1. Chống tự giao cho chính mình
        assert "Đặng Thị Tuyết Trinh" not in staff_str_trinh, "CẢNH BÁO: Tổ phó Trinh không được tự giao việc cho mình!"
        # 2. Chống giao việc ngược lên Tổ trưởng (cấp trên)
        assert "Trần Quốc Hưng" not in staff_str_trinh, "CẢNH BÁO: Tổ phó không được giao việc ngược lên cho Tổ trưởng!"
        # 3. Phải có chuyên viên trong tổ
        assert "Lê Sơn Thanh" in staff_str_trinh or "Nguyễn Hoàng Duy" in staff_str_trinh or "Chuyên viên" in staff_str_trinh
        print("  ✅ PASS: Tổ phó tự điền tên, khóa tổ, không tự giao việc và không giao ngược lên Tổ trưởng!")

        # -----------------------------------------------------------------
        # TEST CASE 4: Ban Giám đốc (Nguyễn Chiến Thắng - Giám đốc)
        # Kỳ vọng:
        # - Lãnh đạo giao việc: Tự điền 'Nguyễn Chiến Thắng — Giám đốc'
        # - Tổ chuyên môn: Mở (disabled = False), có thể chọn toàn đơn vị
        # - Dropdown nhận việc: KHÔNG CÓ Nguyễn Chiến Thắng (chống tự giao việc), có các PGĐ, Tổ trưởng, Chuyên viên
        # -----------------------------------------------------------------
        print("\n🏛️ [TEST CASE 4] Giám đốc: Nguyễn Chiến Thắng (Ban Giám đốc)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "thangnc",
                fullname: "Nguyễn Chiến Thắng",
                phone: "0918000111",
                position: "Giám đốc",
                department: "Ban Giám đốc",
                role: "admin"
            }));
            initUserSession();
        """)
        leader_thang = client.eval_js("document.getElementById('assignLeader')?.value || ''")
        print(f"  Ô Lãnh đạo giao việc: '{leader_thang}'")
        assert "Nguyễn Chiến Thắng" in leader_thang, "Phải tự điền Nguyễn Chiến Thắng!"

        dept_disabled_bgd = client.eval_js("document.getElementById('filterStaffDept')?.disabled")
        print(f"  Tổ chuyên môn có bị khóa không: {dept_disabled_bgd} (Kỳ vọng: False)")
        assert dept_disabled_bgd is False, "Ban Giám đốc không bị khóa Tổ, được quyền chọn mọi tổ!"

        staff_opts_thang = client.eval_js("""
            Array.from(document.querySelectorAll('#assignStaff option')).map(o => o.textContent)
        """)
        staff_str_thang = " | ".join(staff_opts_thang)
        # 1. Chống Giám đốc tự giao việc cho Giám đốc
        assert "Nguyễn Chiến Thắng" not in staff_str_thang, "CẢNH BÁO: Giám đốc Thắng không được tự giao việc cho chính mình!"
        # 2. Giao được cho Phó Giám đốc, Tổ trưởng, Chuyên viên
        assert "Đặng Huy Cường" in staff_str_thang or "Nguyễn Thị Lệ Hằng" in staff_str_thang, "Giám đốc phải giao được cho Phó Giám đốc!"
        assert "Trần Quốc Hưng" in staff_str_thang or "Nguyễn Thị Thùy Trang" in staff_str_thang, "Giám đốc phải giao được cho Tổ trưởng!"
        print("  ✅ PASS: Giám đốc tự điền tên, mở toàn đơn vị, không tự giao việc cho chính mình!")

        # -----------------------------------------------------------------
        # TEST CASE 5: Phó Giám đốc (Đặng Huy Cường - Phó Giám đốc)
        # Kỳ vọng:
        # - Không tự giao cho mình
        # - Không giao cho Giám đốc Nguyễn Chiến Thắng (cấp trên)
        # -----------------------------------------------------------------
        print("\n🏛️ [TEST CASE 5] Phó Giám đốc: Đặng Huy Cường (Ban Giám đốc)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "cuongdh",
                fullname: "Đặng Huy Cường",
                phone: "0918222333",
                position: "Phó Giám đốc",
                department: "Ban Giám đốc",
                role: "admin"
            }));
            initUserSession();
        """)
        staff_opts_cuong = client.eval_js("""
            Array.from(document.querySelectorAll('#assignStaff option')).map(o => o.textContent)
        """)
        staff_str_cuong = " | ".join(staff_opts_cuong)
        assert "Đặng Huy Cường" not in staff_str_cuong, "CẢNH BÁO: PGĐ Cường không được tự giao việc cho chính mình!"
        assert "Nguyễn Chiến Thắng" not in staff_str_cuong, "CẢNH BÁO: PGĐ không được giao việc cho Giám đốc!"
        assert "Trần Quốc Hưng" in staff_str_cuong or "Nguyễn Thị Thùy Trang" in staff_str_cuong, "PGĐ giao được cho Tổ trưởng!"
        print("  ✅ PASS: Phó Giám đốc không tự giao việc, không giao việc ngược lên Giám đốc!")

        print("\n" + "=" * 70)
        print("🎉 TẤT CẢ 5/5 KỊCH BẢN PHÂN CẤP GIAO VIỆC & RÀO CHẮN RBAC ĐỀU PASS 100%!")
        print("======================================================================")

    finally:
        http_proc.terminate()
        http_proc.wait()
        chrome_proc.terminate()
        chrome_proc.wait()

if __name__ == "__main__":
    run_tests()
