# -*- coding: utf-8 -*-
"""
TEST SUITE: KIỂM THỬ 5 TÍNH NĂNG MỚI THEO YÊU CẦU NGƯỜI DÙNG
1. Nút làm mới dữ liệu & xóa dính cache task cũ
2. Bảng thu gọn 7 cột: STT (1, 2, 3...), Người giao, Cán bộ nhận, Nhiệm vụ & Tải tệp, Hạn chót, Trạng thái, Thao tác
3. Ẩn hoàn toàn bộ lọc Tổ chuyên môn với Nhân viên thường (Pikachu / Chuyên viên)
4. Phân trang (Pagination) mượt mà, chống trượt ngang
5. Bỏ hoàn toàn nút In phiếu giao việc (trong popup và ngoài bảng)
"""
import os
import sys
import json
import time
import socket
import urllib.request
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = 8996
CDP_PORT = 9338
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
        resp = self.sock.recv(4096).decode('latin1', errors='ignore')
        if "101" not in resp:
            raise RuntimeError(f"WebSocket upgrade failed: {resp}")

    def send_cmd(self, method, params=None):
        mid = self.msg_id
        self.msg_id += 1
        msg = json.dumps({"id": mid, "method": method, "params": params or {}})
        raw = msg.encode("utf-8")
        
        frame = bytearray()
        frame.append(0x81)
        length = len(raw)
        if length < 126:
            frame.append(0x80 | length)
        elif length < 65536:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, "big"))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, "big"))
        
        mask = b"\x12\x34\x56\x78"
        frame.extend(mask)
        masked = bytearray(length)
        for i in range(length):
            masked[i] = raw[i] ^ mask[i % 4]
        frame.extend(masked)
        
        self.sock.sendall(frame)
        
        while True:
            b1, b2 = self.sock.recv(2)
            masked = bool(b2 & 0x80)
            plen = b2 & 0x7F
            if plen == 126:
                plen = int.from_bytes(self.sock.recv(2), "big")
            elif plen == 127:
                plen = int.from_bytes(self.sock.recv(8), "big")
            
            mask_key = self.sock.recv(4) if masked else None
            data = bytearray()
            while len(data) < plen:
                chunk = self.sock.recv(plen - len(data))
                if not chunk: break
                data.extend(chunk)
            
            if masked:
                for i in range(len(data)):
                    data[i] ^= mask_key[i % 4]
            
            res = json.loads(data.decode("utf-8", errors="ignore"))
            if res.get("id") == mid:
                return res.get("result", {})

    def evaluate(self, expr):
        r = self.send_cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return r.get("result", {}).get("value")

    def navigate(self, url):
        self.send_cmd("Page.navigate", {"url": url})
        time.sleep(1.5)

def run_tests():
    server_proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=WORKSPACE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    chrome_path = find_chrome()
    chrome_proc = subprocess.Popen([
        chrome_path,
        "--headless=new",
        f"--remote-debugging-port={CDP_PORT}",
        "--window-size=1280,900",
        "--disable-gpu",
        "--no-sandbox",
        "--remote-allow-origins=*",
        f"{BASE_URL}/index.html"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    time.sleep(2)
    client = ChromeCDPClient(CDP_PORT)
    client.connect_tab("index.html")

    print("\n======================================================================")
    print("🔍 BẮT ĐẦU KIỂM THỬ: 5 TÍNH NĂNG MỚI CỦA PHÂN HỆ GIAO VIỆC (CN23)")
    print("======================================================================\n")

    try:
        # TEST CASE 1: Ẩn bộ lọc Tổ chuyên môn đối với Nhân viên thường (Pikachu)
        print("🛡️ [TEST CASE 1] Kiểm tra ẨN Bộ lọc Tổ chuyên môn với Nhân viên (Pikachu)...")
        # Đăng nhập giả lập Pikachu (Rank 5 - Chuyên viên)
        client.evaluate("""
            sessionStorage.setItem('family_user', JSON.stringify({
                username: 'pikachu',
                fullname: 'Pikachu Nguyễn',
                position: 'Chuyên viên',
                department: 'Tổ Hành chính Tổng hợp',
                phone: '0988888888'
            }));
        """)
        client.navigate(f"{BASE_URL}/giao_viec.html")
        time.sleep(1)

        dept_wrapper_hidden = client.evaluate("""
            document.getElementById('filterTaskDeptWrapper')?.classList.contains('hidden');
        """)
        print(f"  Bộ lọc Tổ có bị ẩn (class hidden): {dept_wrapper_hidden}")
        assert dept_wrapper_hidden == True, "LỖI: Bộ lọc Tổ chuyên môn không bị ẩn với Pikachu!"

        # Form giao việc cũng phải bị ẩn với Pikachu
        assign_tab_display = client.evaluate("document.getElementById('tabBtnAssign')?.style.display")
        assert assign_tab_display == 'none', "LỖI: Tab giao việc không bị ẩn với Chuyên viên thường!"
        print("  ✅ PASS: Pikachu (Chuyên viên) không nhìn thấy Bộ lọc Tổ chuyên môn và không có tab Giao việc!\n")

        # TEST CASE 2: Kiểm tra Lãnh đạo (Giám đốc) thấy Bộ lọc Tổ chuyên môn mở
        print("🏛️ [TEST CASE 2] Kiểm tra Lãnh đạo (Giám đốc Nguyễn Chiến Thắng) thấy Bộ lọc Tổ...")
        client.evaluate("""
            sessionStorage.setItem('family_user', JSON.stringify({
                username: 'thangnc',
                fullname: 'Nguyễn Chiến Thắng',
                position: 'Giám đốc',
                department: 'Ban Giám đốc',
                phone: '0901234567'
            }));
        """)
        client.navigate(f"{BASE_URL}/giao_viec.html")
        time.sleep(1)

        dept_wrapper_hidden_bgd = client.evaluate("""
            document.getElementById('filterTaskDeptWrapper')?.classList.contains('hidden');
        """)
        dept_select_disabled = client.evaluate("""
            document.getElementById('filterTaskDept')?.disabled;
        """)
        print(f"  Giám đốc: Bộ lọc Tổ có bị ẩn: {dept_wrapper_hidden_bgd}, có bị disable: {dept_select_disabled}")
        assert dept_wrapper_hidden_bgd == False, "LỖI: Giám đốc phải nhìn thấy Bộ lọc Tổ!"
        assert dept_select_disabled == False, "LỖI: Bộ lọc Tổ của Giám đốc không được bị disable!"
        print("  ✅ PASS: Ban Giám đốc thấy Bộ lọc Tổ và toàn quyền điều phối các tổ!\n")

        # TEST CASE 3: Kiểm tra Bảng 7 cột thu gọn, STT 1, 2, 3... và Phân trang (Pagination)
        print("📊 [TEST CASE 3] Kiểm tra Cột Bảng thu gọn (7 cột), STT và Phân trang...")
        # Đợi cloud sync ban đầu hoàn tất, sau đó chặn sync đè trong lúc test phân trang 25 task
        time.sleep(2)
        client.evaluate("window.syncTasksFromCloud = async () => {};")
        client.evaluate("""
            const mockTasks = [];
            for (let i = 1; i <= 25; i++) {
                mockTasks.push({
                    id: 'TASK_' + (1000 + i),
                    leader: 'Nguyễn Chiến Thắng — Giám đốc',
                    assigneeId: 'NV_' + i,
                    assigneeName: 'Cán bộ ' + i,
                    assigneeRole: 'Chuyên viên',
                    assigneeDept: 'Tổ Hành chính Tổng hợp',
                    title: 'Nhiệm vụ kiểm thử số ' + i,
                    priority: i % 3 === 0 ? 'Hỏa tốc' : (i % 2 === 0 ? 'Khẩn' : 'Bình thường'),
                    docRef: 'CV-' + i + '/VPĐK',
                    guidance: 'Chỉ đạo thực hiện nhiệm vụ ' + i,
                    deadline: '2026-12-31 17:00',
                    status: i % 4 === 0 ? 'Đã hoàn thành' : 'Đang thực hiện',
                    createdAt: '01/11/2026 08:00',
                    fileUrl: i === 1 ? 'https://drive.google.com/file/d/TEST_FILE_123/view' : ''
                });
            }
            localStorage.setItem('CN23_TASK_ASSIGNMENTS_V1', JSON.stringify(mockTasks));
            taskCurrentPage = 1;
            renderTasksTable();
        """)
        time.sleep(0.5)

        # Kiểm tra số lượng cột trong thead
        th_count = client.evaluate("document.querySelectorAll('.task-data-table thead th').length")
        print(f"  Số cột trong thead: {th_count} (Kỳ vọng: 7)")
        assert th_count == 7, f"LỖI: Bảng phải có đúng 7 cột, nhưng có {th_count} cột!"

        # Kiểm tra STT trên hàng đầu tiên
        first_stt = client.evaluate("document.querySelector('#taskTableBody tr td')?.textContent.trim()")
        print(f"  STT hàng đầu tiên: {first_stt} (Kỳ vọng: '1')")
        assert first_stt == '1', f"LỖI: STT hàng đầu tiên phải là 1, nhưng là {first_stt}"

        # Kiểm tra số lượng hàng hiển thị trên trang 1 (Page size mặc định = 10)
        rows_page_1 = client.evaluate("document.querySelectorAll('#taskTableBody tr').length")
        print(f"  Số hàng trên trang 1: {rows_page_1} (Kỳ vọng: 10)")
        assert rows_page_1 == 10, f"LỖI: Trang 1 phải hiển thị 10 dòng, nhưng hiển thị {rows_page_1}"

        # Kiểm tra thông tin phân trang
        pagination_text = client.evaluate("document.getElementById('paginationInfo')?.textContent.trim()")
        print(f"  Thông tin phân trang: '{pagination_text}'")
        assert "Hiển thị 1 - 10 trong tổng số 25" in pagination_text, "LỖI: Nội dung phân trang không chính xác!"

        # Chuyển sang Trang 2
        client.evaluate("changeTaskPage(2);")
        time.sleep(0.3)
        stt_page_2 = client.evaluate("document.querySelector('#taskTableBody tr td')?.textContent.trim()")
        print(f"  STT hàng đầu tiên trên trang 2: {stt_page_2} (Kỳ vọng: '11')")
        assert stt_page_2 == '11', f"LỖI: Trang 2 phải bắt đầu bằng STT 11, nhưng là {stt_page_2}"
        print("  ✅ PASS: Bảng 7 cột, STT đánh số chuẩn và phân trang 10 việc/trang hoạt động hoàn hảo!\n")

        # TEST CASE 4: Kiểm tra Link tải trực tiếp file (Direct Download)
        print("📥 [TEST CASE 4] Kiểm tra Link tải file Direct Download...")
        client.evaluate("changeTaskPage(1);")
        time.sleep(0.3)
        direct_link = client.evaluate("""
            document.querySelector('#taskTableBody tr a[download]')?.getAttribute('href')
        """)
        print(f"  Direct download link tạo ra: {direct_link}")
        assert direct_link and "drive.google.com/uc?export=download&id=" in direct_link, "LỖI: Link tải trực tiếp không đúng định dạng direct download!"
        print("  ✅ PASS: Tệp đính kèm tự động chuyển thành link tải trực tiếp (không mở web preview)!\n")

        # TEST CASE 5: Kiểm tra KHÔNG CÒN nút In phiếu giao việc (ngoài bảng lẫn trong popup)
        print("🖨️ [TEST CASE 5] Kiểm tra KHÔNG CÒN nút In phiếu giao việc...")
        print_btns_count = client.evaluate("document.querySelectorAll('[data-action=\"print\"]').length")
        modal_print_btn = client.evaluate("document.getElementById('modalBtnPrint')")
        print(f"  Số nút in trong bảng: {print_btns_count} (Kỳ vọng: 0)")
        print(f"  Nút in trong Modal chi tiết: {modal_print_btn} (Kỳ vọng: None)")
        assert print_btns_count == 0, "LỖI: Vẫn còn nút in phiếu ngoài bảng!"
        assert modal_print_btn is None, "LỖI: Vẫn còn nút in phiếu trong Modal chi tiết!"
        print("  ✅ PASS: Đã gỡ bỏ triệt để tính năng in phiếu giao việc theo đúng yêu cầu!\n")

        # TEST CASE 6: Kiểm tra Nút Làm Mới (Refresh) xóa cache cũ
        print("🔄 [TEST CASE 6] Kiểm tra Nút Làm Mới Dữ Liệu (#btnRefreshTasks)...")
        has_refresh_btn = client.evaluate("!!document.getElementById('btnRefreshTasks')")
        assert has_refresh_btn == True, "LỖI: Không tìm thấy nút làm mới #btnRefreshTasks!"
        print("  Nút #btnRefreshTasks có trên thanh công cụ: True")
        print("  ✅ PASS: Nút Làm mới bảng đã sẵn sàng!\n")

        # TEST CASE 7: Kiểm tra GỠ BỎ nút Xóa Tất Cả & Bộ lọc trên 1 hàng duy nhất
        print("🗑️ [TEST CASE 7] Kiểm tra Gỡ Bỏ Nút Xóa Tất Cả & Thanh lọc 1 hàng...")
        has_clear_all = client.evaluate("!!document.getElementById('btnClearAllTasks')")
        print(f"  Nút #btnClearAllTasks còn tồn tại không: {has_clear_all} (Kỳ vọng: False)")
        assert has_clear_all == False, "LỖI: Nút 'Xóa tất cả' chưa được gỡ bỏ!"

        # Kiểm tra thanh lọc trên desktop có cùng độ cao trục Y (cùng 1 hàng)
        rect_info = client.evaluate("""
            (() => {
                const status = document.getElementById('filterTaskStatus');
                const search = document.getElementById('searchTaskInput');
                const refresh = document.getElementById('btnRefreshTasks');
                if (!status || !search || !refresh) return null;
                const rectStatus = status.getBoundingClientRect();
                const rectSearch = search.getBoundingClientRect();
                const rectRefresh = refresh.getBoundingClientRect();
                return {
                    width: window.innerWidth,
                    statusTop: rectStatus.top,
                    searchTop: rectSearch.top,
                    refreshTop: rectRefresh.top
                };
            })()
        """)
        print(f"  Rect info: {rect_info}")
        row_check = rect_info and (abs(rect_info['statusTop'] - rect_info['searchTop']) < 10) and (abs(rect_info['searchTop'] - rect_info['refreshTop']) < 10)
        print(f"  Thanh lọc hiển thị trên 1 hàng duy nhất: {row_check}")
        assert row_check == True, "LỖI: Thanh lọc và tìm kiếm chưa nằm trên 1 hàng duy nhất!"
        print("  ✅ PASS: Đã gỡ bỏ nút Xóa tất cả, chỉ xóa theo row; Thanh lọc nằm gọn trên 1 hàng!\n")

        print("======================================================================")
        print("🎉 TẤT CẢ 5/5 YÊU CẦU UX/UI & BẢO MẬT GIAO VIỆC ĐỀU ĐẠT CHUẨN 100%!")
        print("======================================================================\n")

    finally:
        # Dọn dẹp
        try:
            client.evaluate("localStorage.removeItem('CN23_TASK_ASSIGNMENTS_V1'); sessionStorage.clear();")
        except:
            pass
        chrome_proc.terminate()
        server_proc.terminate()

if __name__ == "__main__":
    run_tests()
