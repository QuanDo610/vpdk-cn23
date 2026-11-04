# -*- coding: utf-8 -*-
"""
E2E RBAC TEST SUITE FOR GIAO_VIEC MODULE
Kiểm thử rào chắn phân quyền 3 tầng theo chỉ đạo của đ/c Quân:
1. Ban Giám đốc & Quản trị IT: Xem toàn bộ.
2. Lãnh đạo phát lệnh giao việc: Xem việc do mình giao.
3. Người nhận việc: Xem việc của chính mình.
4. Tổ trưởng, Tổ phó: Xem việc của cán bộ thuộc Tổ mình phụ trách.
5. Chuyên viên bình thường: Tuyệt đối không xem việc của người khác.
"""
import os
import sys
import json
import time
import socket
import urllib.request
import subprocess

PORT = 8993
CDP_PORT = 9334
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
                raise RuntimeError("Connection closed while waiting for response")
            l = head[1] & 0x7f
            if l == 126:
                l = int.from_bytes(self.sock.recv(2), "big")
            elif l == 127:
                l = int.from_bytes(self.sock.recv(8), "big")
            
            data = b""
            while len(data) < l:
                chunk = self.sock.recv(l - len(data))
                if not chunk: break
                data += chunk
            
            try:
                res = json.loads(data.decode("utf-8"))
                if res.get("id") == mid:
                    return res
            except Exception:
                pass

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
    chrome_bin = find_chrome()
    if not chrome_bin:
        print("[FAIL] Cannot find Google Chrome")
        sys.exit(1)

    print("==================================================================")
    print("🚀 BẮT ĐẦU KIỂM THỬ PHÂN QUYỀN RBAC PHÂN HỆ GIAO VIỆC")
    print("==================================================================")

    http_proc = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT)],
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
    chrome_proc = subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2)

    try:
        client = ChromeCDPClient(CDP_PORT)
        client.connect_tab("index.html")
        print("✅ Kết nối Chrome DevTools Protocol thành công")

        # Mock Task Data: 4 nhiệm vụ thuộc các tổ khác nhau
        # TASK-01: Giao cho Nguyễn Tiến Thịnh (Tổ ĐKGCN)
        # TASK-02: Giao cho Hoàng Minh Tú (Tổ ĐKGCN)
        # TASK-03: Giao cho Nguyễn Thanh Sang (Tổ KTĐC)
        # TASK-04: Giao cho Võ Phi Trúc (Tổ HCTH)
        test_tasks_json = json.dumps([
            {
                "id": "TASK-01",
                "leader": "Nguyễn Chiến Thắng - Giám đốc",
                "assigneeName": "Nguyễn Tiến Thịnh",
                "assigneeRole": "Chuyên viên",
                "assigneeDept": "Tổ Đăng ký cấp GCN",
                "title": "Thẩm định hồ sơ chuyển nhượng số 452/DKGCN",
                "priority": "Khẩn",
                "status": "Đang thực hiện"
            },
            {
                "id": "TASK-02",
                "leader": "Nguyễn Thành Như Bảo - Tổ phó",
                "assigneeName": "Hoàng Minh Tú",
                "assigneeRole": "Chuyên viên",
                "assigneeDept": "Tổ Đăng ký cấp GCN",
                "title": "In phôi Giấy chứng nhận đợt 34",
                "priority": "Bình thường",
                "status": "Đang thực hiện"
            },
            {
                "id": "TASK-03",
                "leader": "Trần Thanh Triết - Tổ trưởng",
                "assigneeName": "Nguyễn Thanh Sang",
                "assigneeRole": "Chuyên viên",
                "assigneeDept": "Tổ Kỹ thuật Địa chính và Lưu trữ",
                "title": "Đo vẽ trích lục thực địa thửa đất số 89",
                "priority": "Hỏa tốc",
                "status": "Đang thực hiện"
            },
            {
                "id": "TASK-04",
                "leader": "Đặng Huy Cường - Phó Giám đốc",
                "assigneeName": "Võ Phi Trúc",
                "assigneeRole": "Chuyên viên",
                "assigneeDept": "Tổ Hành chính Tổng hợp",
                "title": "Soạn thảo công văn báo cáo tháng 11",
                "priority": "Bình thường",
                "status": "Đang thực hiện"
            }
        ])

        # -------------------------------------------------------------
        # TEST CASE 1: Ban Giám đốc (Nguyễn Chiến Thắng - Giám đốc)
        # -------------------------------------------------------------
        print("\n🏛️ [TEST CASE 1] Ban Giám đốc: Nguyễn Chiến Thắng (Giám đốc)")
        client.eval_js(f"""
            sessionStorage.setItem("family_user", JSON.stringify({{
                username: "thangnc",
                fullname: "Nguyễn Chiến Thắng",
                phone: "0918000111",
                position: "Giám đốc",
                department: "Ban Giám đốc",
                role: "admin"
            }}));
            localStorage.setItem("CN23_TASK_ASSIGNMENTS_V1", '{test_tasks_json}');
        """)

        # Navigate to giao_viec.html
        client.send_cmd("Page.enable")
        client.send_cmd("Page.navigate", {"url": f"{BASE_URL}/giao_viec.html"})
        time.sleep(2)

        badge_text_bgd = client.eval_js("document.getElementById('taskRoleScopeBadge')?.innerText || ''")
        print(f"  Huy hiệu vai trò BGĐ: {badge_text_bgd}")
        assert "Ban Giám đốc" in badge_text_bgd or "Quản trị" in badge_text_bgd

        visible_tasks_bgd = client.eval_js("getVisibleTasks().map(t => t.id)")
        print(f"  Nhiệm vụ BGĐ xem được: {visible_tasks_bgd} (Kỳ vọng: đủ 4 việc)")
        assert len(visible_tasks_bgd) == 4, f"BGĐ phải xem được toàn bộ 4 việc, got: {visible_tasks_bgd}"
        print("  ✅ PASS: Ban Giám đốc xem được 100% nhiệm vụ toàn đơn vị")

        # -------------------------------------------------------------
        # TEST CASE 2: Quản trị IT (Đỗ Trọng Minh Quân - 0973807027)
        # -------------------------------------------------------------
        print("\n🛡️ [TEST CASE 2] Quản trị IT: Đỗ Trọng Minh Quân (0973807027 / quandtm)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "quandtm",
                fullname: "Đỗ Trọng Minh Quân",
                phone: "0973807027",
                position: "Chuyên viên CNTT",
                department: "Tổ Hành chính Tổng hợp",
                role: "admin"
            }));
            initUserSession();
            renderTasksTable();
            updateTaskKPIs();
        """)
        visible_tasks_it = client.eval_js("getVisibleTasks().map(t => t.id)")
        print(f"  Nhiệm vụ Quản trị IT xem được: {visible_tasks_it} (Kỳ vọng: đủ 4 việc)")
        assert len(visible_tasks_it) == 4, f"Quản trị IT phải xem được toàn bộ 4 việc, got: {visible_tasks_it}"
        print("  ✅ PASS: Quản trị viên IT Đỗ Trọng Minh Quân xem được 100% nhiệm vụ")

        # -------------------------------------------------------------
        # TEST CASE 3: Tổ trưởng Tổ KTĐC (Trần Thanh Triết)
        # -------------------------------------------------------------
        print("\n📐 [TEST CASE 3] Tổ trưởng: Trần Thanh Triết (Tổ Kỹ thuật Địa chính & Lưu trữ)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "triettt",
                fullname: "Trần Thanh Triết",
                phone: "0908123456",
                position: "Tổ trưởng",
                department: "Tổ Kỹ thuật Địa chính và Lưu trữ",
                role: "user"
            }));
            initUserSession();
            renderTasksTable();
            updateTaskKPIs();
        """)

        badge_text_triet = client.eval_js("document.getElementById('taskRoleScopeBadge')?.innerText || ''")
        print(f"  Huy hiệu vai trò Tổ trưởng KTĐC: {badge_text_triet}")
        assert "Lãnh đạo Tổ" in badge_text_triet and "Địa chính" in badge_text_triet

        visible_tasks_triet = client.eval_js("getVisibleTasks().map(t => t.id)")
        print(f"  Nhiệm vụ anh Triết xem được: {visible_tasks_triet} (Kỳ vọng: ['TASK-03'])")
        assert visible_tasks_triet == ["TASK-03"], f"Tổ trưởng KTĐC chỉ được xem TASK-03 của tổ mình! Got: {visible_tasks_triet}"
        
        btn_clear_triet_hidden = client.eval_js("document.getElementById('btnClearAllTasks')?.classList.contains('hidden')")
        assert btn_clear_triet_hidden is True, "Nút Xóa tất cả phải bị ẩn với Tổ trưởng!"
        print("  ✅ PASS: Tổ trưởng KTĐC chỉ xem việc của Tổ KTĐC, bị chặn việc của Tổ ĐKGCN và HCTH")

        # -------------------------------------------------------------
        # TEST CASE 4: Tổ phó Tổ ĐKGCN (Nguyễn Thành Như Bảo)
        # -------------------------------------------------------------
        print("\n📜 [TEST CASE 4] Tổ phó: Nguyễn Thành Như Bảo (Tổ Đăng ký cấp GCN)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "baontn",
                fullname: "Nguyễn Thành Như Bảo",
                phone: "0912345678",
                position: "Tổ phó",
                department: "Tổ Đăng ký cấp GCN",
                role: "user"
            }));
            initUserSession();
            renderTasksTable();
            updateTaskKPIs();
        """)

        badge_text_bao = client.eval_js("document.getElementById('taskRoleScopeBadge')?.innerText || ''")
        print(f"  Huy hiệu vai trò Tổ phó ĐKGCN: {badge_text_bao}")
        assert "Lãnh đạo Tổ" in badge_text_bao and "Đăng ký" in badge_text_bao

        visible_tasks_bao = client.eval_js("getVisibleTasks().map(t => t.id)")
        print(f"  Nhiệm vụ anh Bảo xem được: {visible_tasks_bao} (Kỳ vọng: ['TASK-01', 'TASK-02'])")
        assert set(visible_tasks_bao) == {"TASK-01", "TASK-02"}, f"Tổ phó ĐKGCN phải xem được cả 2 việc TASK-01 và TASK-02 của tổ mình! Got: {visible_tasks_bao}"
        print("  ✅ PASS: Tổ phó ĐKGCN xem được các việc thuộc Tổ ĐKGCN, chặn việc Tổ KTĐC và HCTH")

        # -------------------------------------------------------------
        # TEST CASE 5: Chuyên viên cá nhân (Nguyễn Tiến Thịnh - Tổ ĐKGCN)
        # -------------------------------------------------------------
        print("\n👤 [TEST CASE 5] Chuyên viên cá nhân: Nguyễn Tiến Thịnh (Tổ Đăng ký cấp GCN)")
        client.eval_js("""
            sessionStorage.setItem("family_user", JSON.stringify({
                username: "thinhnt",
                fullname: "Nguyễn Tiến Thịnh",
                phone: "0933111222",
                position: "Chuyên viên",
                department: "Tổ Đăng ký cấp GCN",
                role: "user"
            }));
            initUserSession();
            renderTasksTable();
            updateTaskKPIs();
        """)

        badge_text_thinh = client.eval_js("document.getElementById('taskRoleScopeBadge')?.innerText || ''")
        print(f"  Huy hiệu vai trò Chuyên viên: {badge_text_thinh}")
        assert "Cán bộ nhận việc" in badge_text_thinh

        visible_tasks_thinh = client.eval_js("getVisibleTasks().map(t => t.id)")
        print(f"  Nhiệm vụ anh Thịnh xem được: {visible_tasks_thinh} (Kỳ vọng: DUY NHẤT ['TASK-01'])")
        assert visible_tasks_thinh == ["TASK-01"], f"Chuyên viên Thịnh chỉ được xem việc của chính mình TASK-01! Got: {visible_tasks_thinh}"
        
        # Test cố tình mở chi tiết TASK-02 (việc của đồng nghiệp Hoàng Minh Tú cùng tổ)
        client.eval_js("openTaskModal('TASK-02')")
        toast_error = client.eval_js("document.getElementById('toastContainer')?.innerText || ''")
        print(f"  Cảnh báo khi bấm xem việc của người khác: {toast_error}")
        assert "không có quyền" in toast_error.lower(), "Hệ thống phải cảnh báo không có quyền xem!"
        print("  ✅ PASS: Chuyên viên Thịnh chỉ xem được việc của mình, bị chặn 100% việc của đồng nghiệp khác")

        print("\n" + "=" * 66)
        print("🎉 TẤT CẢ 5/5 KỊCH BẢN PHÂN QUYỀN RBAC ĐỀU PASS HOÀN HẢO 100%!")
        print("==================================================================")

    finally:
        http_proc.terminate()
        http_proc.wait()
        chrome_proc.terminate()
        chrome_proc.wait()

if __name__ == "__main__":
    run_tests()
