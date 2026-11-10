# -*- coding: utf-8 -*-
"""
TEST SUITE: KIỂM THỬ PHÂN HỆ THÔNG CÁO & CHỈ THỊ VĂN BẢN PDF (MODULE 3 GIAO VIỆC)
Tuân thủ đặc tả kỹ thuật:
1. Giao diện Document Viewer 2 cột (Danh mục văn bản bên trái, Khung đọc PDF bên phải)
2. Phân quyền RBAC nghiêm ngặt:
   - Chỉ Giám đốc Nguyễn Chiến Thắng (và IT Admin Đỗ Trọng Minh Quân) mới có quyền Upload văn bản mới.
   - Nhân viên (Pikachu, Chuyên viên, Lãnh đạo cấp tổ...) chỉ có quyền Xem và Tải về, KHÔNG THẤY nút Upload.
3. Sắp xếp danh sách: Từ MỚI NHẤT đến CŨ NHẤT (Newest on top).
4. Chuẩn tệp tin: BẮT BUỘC duy nhất định dạng PDF (*.pdf).
5. Các nút thao tác đọc: Xem trực tiếp (Iframe), Mở tab mới, Tải tệp PDF về máy.
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
CDP_PORT = 9339
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
        if "exceptionDetails" in r:
            return {"ERROR": r["exceptionDetails"]}
        return r.get("result", {}).get("value")

    def navigate(self, url):
        self.send_cmd("Page.navigate", {"url": url})
        time.sleep(1.5)

def run_tests():
    print("=" * 70)
    print("📜 BẮT ĐẦU KIỂM THỬ: THÔNG CÁO & CHỈ THỊ PDF (MODULE 3 GIAO VIỆC)")
    print("=" * 70)

    server_proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT)],
        cwd=WORKSPACE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    chrome_proc = None
    client = None

    try:
        chrome_path = find_chrome()
        if not chrome_path:
            print("❌ Không tìm thấy Chrome!")
            return False

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
        client.send_cmd("Page.enable")
        # Chặn tuyệt đối các request test ghi dữ liệu rác lên Google Sheet/Drive thật của người dùng
        client.send_cmd("Page.addScriptToEvaluateOnNewDocument", {
            "source": """
                const __origFetch = window.fetch;
                window.fetch = function(url, opts) {
                    const u = (typeof url === 'string') ? url : (url && url.url ? url.url : '');
                    if (u.includes('script.google.com')) {
                        if (opts && opts.method === 'POST') {
                            return Promise.resolve(new Response(JSON.stringify({
                                success: true,
                                message: 'MOCK_TEST_OK',
                                fileUrl: ''
                            }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
                        }
                        if (u.includes('getDirectives')) {
                            return Promise.resolve(new Response(JSON.stringify({
                                success: true,
                                directives: []
                            }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
                        }
                    }
                    return __origFetch.apply(this, arguments);
                };
            """
        })

        # -------------------------------------------------------------
        # TEST CASE 1: Đăng nhập vai trò Chuyên viên (Trần Văn Tuấn - user demo & Pikachu)
        # Kỳ vọng:
        # - Chuyển sang Tab 1 mặc định, thấy danh mục văn bản & khung đọc PDF
        # - Nút Đăng văn bản nhanh (#btnQuickOpenUploadDirective) BỊ ẨN HOÀN TOÀN (chống đăng tầm bậy)
        # - Gọi lệnh mở modal hoặc upload trực tiếp sẽ bị từ chối đặc quyền
        # -------------------------------------------------------------
        print("\n🔒 [TEST CASE 1] Kiểm tra phân quyền Chuyên viên (Trần Văn Tuấn & Pikachu - Rank 5)...")
        client.evaluate("""
            sessionStorage.setItem('family_user', JSON.stringify({
                username: 'user',
                fullname: 'Trần Văn Tuấn',
                name: 'Trần Văn Tuấn',
                position: 'Chuyên viên',
                department: 'Tổ Hành chính Tổng hợp',
                phone: '0912345678',
                rank: 5
            }));
            localStorage.removeItem('CN23_DIRECTIVES_V1');
            localStorage.removeItem('CN23_DIRECTIVES_V2');
            localStorage.removeItem('CN23_DIRECTIVES_V3');
            localStorage.removeItem('CN23_DIRECTIVES_V4');
        """)
        client.navigate(f"{BASE_URL}/giao_viec.html")
        time.sleep(1.5)

        # Kiểm tra Tab 1 mặc định là Thông Cáo & Chỉ Thị PDF
        tab1_default_active = client.evaluate("""
            document.getElementById('tabBtnDirectives')?.classList.contains('active') &&
            !document.getElementById('panelDirectives')?.classList.contains('hidden');
        """)
        print(f"  Tab 1 (Thông Cáo & Chỉ Thị PDF) mặc định active: {tab1_default_active}")
        assert tab1_default_active is True, "LỖI: Tab 1 không phải là tab mở đầu mặc định!"

        # Kiểm tra KPI đã được dời vào Tab 3, không còn hiển thị ở Tab 1
        kpi_in_tab1_hidden = client.evaluate("""
            document.getElementById("panelTracking")?.classList.contains("hidden");
        """)
        print(f"  Thẻ KPI đã được ẩn khỏi Tab 1 để tiết kiệm diện tích: {kpi_in_tab1_hidden}")
        assert kpi_in_tab1_hidden is True, "LỖI: Thẻ KPI vẫn xuất hiện ở Tab 1!"

        # Kiểm tra nút upload nhanh trên thanh tab bar: PHẢI BỊ ẨN ĐỐI VỚI TRẦN VĂN TUẤN
        btn_quick_visible = client.evaluate("""
            (() => {
                const b = document.getElementById("btnQuickOpenUploadDirective");
                return b && !b.classList.contains("hidden") && b.style.display !== "none";
            })()
        """)
        print(f"  Trần Văn Tuấn: Nút #btnQuickOpenUploadDirective bị ẩn (an toàn): {btn_quick_visible is False}")
        assert btn_quick_visible is False, "LỖI BẢO MẬT: Trần Văn Tuấn không được phép nhìn thấy nút Đăng văn bản PDF!"

        # Thử gọi hàm upload khi đang là chuyên viên Trần Văn Tuấn: phải bị từ chối quyền
        attempt_upload = client.evaluate("""
            (() => {
                let toastMsg = "";
                const originalToast = window.showToast;
                window.showToast = (msg, type) => { toastMsg = msg; };
                triggerDirectPdfUpload();
                window.showToast = originalToast;
                return toastMsg;
            })()
        """)
        print(f"  Trần Văn Tuấn bấm nút Upload bị chặn với thông báo: '{attempt_upload}'")
        assert "Đặc quyền từ chối" in attempt_upload or "Giám đốc" in attempt_upload, "LỖI: Chuyên viên không bị chặn quyền upload!"

        # Thử gọi hàm mở modal upload trực tiếp
        attempt_open = client.evaluate("""
            (() => {
                if (typeof openUploadDirectiveModal === "function") openUploadDirectiveModal();
                const modal = document.getElementById("uploadDirectiveModal");
                return modal ? modal.classList.contains("hidden") : true;
            })()
        """)
        print(f"  Trần Văn Tuấn: Modal #uploadDirectiveModal vẫn bị ẩn khi cố gọi hàm: {attempt_open}")
        assert attempt_open is True, "LỖI: Modal bị mở trái phép cho nhân viên!"

        print("  ✅ PASS: Rào chắn RBAC bảo vệ tuyệt đối: Trần Văn Tuấn KHÔNG THỂ nhìn thấy nút hoặc đăng tệp!")

        # -------------------------------------------------------------
        # TEST CASE 2: Kiểm tra Document Viewer (Cột trái danh mục, Cột phải trình đọc - Chuẩn 2 cột song song)
        # -------------------------------------------------------------
        print("\n📖 [TEST CASE 2] Kiểm tra Giao diện Document Viewer 2 Cột & Đọc trực tiếp...")
        
        layout_checks = client.evaluate("""
            (() => {
                const container = document.querySelector('.directive-viewer-layout');
                const sidebar = document.querySelector('.directive-sidebar-col');
                const main = document.querySelector('.directive-main-col');
                if (!container || !sidebar || !main) return { found: false };
                const cs = window.getComputedStyle(container);
                const crC = container.getBoundingClientRect();
                const crS = sidebar.getBoundingClientRect();
                const crM = main.getBoundingClientRect();
                return {
                    found: true,
                    flexDir: cs.flexDirection,
                    containerWidth: Math.round(crC.width),
                    sidebarWidth: Math.round(crS.width),
                    mainWidth: Math.round(crM.width),
                    sidebarRight: Math.round(crS.right),
                    mainLeft: Math.round(crM.left),
                    sidebarTop: Math.round(crS.top),
                    mainTop: Math.round(crM.top),
                    isTwoColumns: (crS.right <= crM.left + 5) && (Math.abs(crS.top - crM.top) < 15)
                };
            })()
        """)
        print(f"  Container flex-direction: '{layout_checks.get('flexDir')}' (Kỳ vọng: 'row')")
        print(f"  Chiều rộng Container: {layout_checks.get('containerWidth')}px | Cột Trái (Sidebar): {layout_checks.get('sidebarWidth')}px | Cột Phải (Viewer): {layout_checks.get('mainWidth')}px")
        print(f"  Hai cột nằm ngang cạnh nhau (isTwoColumns): {layout_checks.get('isTwoColumns')}")

        assert layout_checks.get("found") is True, "LỖI: Không tìm thấy các class layout 2 cột .directive-viewer-layout!"
        assert layout_checks.get("flexDir") == "row", f"LỖI: flex-direction không phải là row ({layout_checks.get('flexDir')})!"
        assert layout_checks.get("isTwoColumns") is True, "LỖI: Cột trái và cột phải không nằm song song 2 cột!"

        viewer_checks = client.evaluate("""
            (() => {
                const listItems = document.querySelectorAll("#directiveListContainer > [data-directive-id]");
                const iframe = document.getElementById("directivePdfIframe");
                const titleEl = document.getElementById("viewingDirectiveTitle");
                const btnOpenTab = document.getElementById("btnDirectiveOpenTab");
                const btnDownload = document.getElementById("btnDirectiveDownload");
                
                return {
                    docCount: listItems.length,
                    firstDocTitle: listItems[0] ? listItems[0].querySelector("p")?.innerText : "",
                    iframeSrc: iframe ? iframe.src : "",
                    viewingTitle: titleEl ? titleEl.innerText : "",
                    openTabHref: btnOpenTab ? btnOpenTab.href : "",
                    downloadHref: btnDownload ? btnDownload.href : ""
                };
            })()
        """)
        print(f"  Số văn bản ban đầu trong danh sách: {viewer_checks.get('docCount')}")
        print(f"  Văn bản hiển thị đầu tiên: {viewer_checks.get('firstDocTitle')[:50]}...")
        print(f"  Iframe PDF src: {viewer_checks.get('iframeSrc')[:60]}...")
        print(f"  Nút mở tab mới link: {viewer_checks.get('openTabHref')[:60]}...")

        assert viewer_checks.get("docCount") >= 2, "LỖI: Thiếu danh mục văn bản mặc định (phải có ít nhất 2 file PDF mẫu thật)!"
        assert "39266" in viewer_checks.get("firstDocTitle") or "39266" in viewer_checks.get("iframeSrc"), "LỖI: Văn bản mới nhất (39266) chưa nằm ở đầu danh sách!"
        print("  ✅ PASS: Giao diện Document Viewer hiển thị trực quan 2 file mẫu mới từ mới tới cũ, hỗ trợ xem và tải về!")

        # -------------------------------------------------------------
        # TEST CASE 3: Tìm kiếm văn bản trong danh mục
        # -------------------------------------------------------------
        print("\n🔍 [TEST CASE 3] Kiểm tra Tìm kiếm văn bản...")
        search_result = client.evaluate("""
            (() => {
                const searchInput = document.getElementById("searchDirectiveInput");
                searchInput.value = "3987";
                searchInput.dispatchEvent(new Event("input"));
                
                const listItems = document.querySelectorAll("#directiveListContainer > [data-directive-id]");
                return {
                    foundCount: listItems.length,
                    firstMatch: listItems[0] ? listItems[0].innerText : ""
                };
            })()
        """)
        print(f"  Tìm từ khóa '3987': Thấy {search_result.get('foundCount')} kết quả")
        assert search_result.get("foundCount") == 1, "LỖI: Bộ lọc tìm kiếm văn bản trả về sai số lượng!"
        assert "3987" in search_result.get("firstMatch"), "LỖI: Kết quả tìm kiếm công văn 3987 không khớp!"
        print("  ✅ PASS: Tìm kiếm văn bản theo số hiệu và từ khóa hoạt động chuẩn xác!")

        # -------------------------------------------------------------
        # TEST CASE 4: Đăng nhập vai trò Giám đốc Nguyễn Chiến Thắng
        # Kỳ vọng:
        # - Nút Đăng văn bản nhanh #btnQuickOpenUploadDirective trên tab bar HIỂN THỊ
        # - Vùng upload ở panel và danh sách đã được tinh gọn bỏ bớt theo yêu cầu
        # -------------------------------------------------------------
        print("\n👑 [TEST CASE 4] Kiểm tra đặc quyền Giám đốc Nguyễn Chiến Thắng...")
        client.evaluate("""
            sessionStorage.setItem('family_user', JSON.stringify({
                username: 'thangnc',
                fullname: 'Nguyễn Chiến Thắng',
                position: 'Giám đốc',
                department: 'Ban Giám đốc',
                phone: '0918000001',
                rank: 1
            }));
        """)
        client.navigate(f"{BASE_URL}/giao_viec.html")
        time.sleep(1.5)

        client.evaluate("""
            if (typeof switchTaskTab === 'function') {
                switchTaskTab('directives');
            }
        """)
        time.sleep(0.5)

        dir_buttons = client.evaluate("""
            (() => {
                const bQuick = document.getElementById("btnQuickOpenUploadDirective");
                return {
                    quickBtnVisible: bQuick && !bQuick.classList.contains("hidden") && bQuick.style.display !== "none"
                };
            })()
        """)
        print(f"  Giám đốc Nguyễn Chiến Thắng: Nút Đăng văn bản nhanh hiển thị: {dir_buttons.get('quickBtnVisible')}")
        assert dir_buttons.get("quickBtnVisible") is True, "LỖI: Giám đốc Nguyễn Chiến Thắng không thấy nút Đăng văn bản nhanh trên tab bar!"

        # Kiểm tra thêm vai trò IT Admin Đỗ Trọng Minh Quân
        client.evaluate("""
            sessionStorage.setItem('family_user', JSON.stringify({
                username: 'quandtm',
                fullname: 'Đỗ Trọng Minh Quân',
                position: 'Quản trị viên IT',
                department: 'Tổ Hành chính Tổng hợp',
                phone: '0973807027',
                rank: 0
            }));
            if (typeof switchTaskTab === 'function') {
                switchTaskTab('directives');
            }
        """)
        time.sleep(0.5)

        it_buttons = client.evaluate("""
            (() => {
                const bQuick = document.getElementById("btnQuickOpenUploadDirective");
                return {
                    quickBtnVisible: bQuick && !bQuick.classList.contains("hidden") && bQuick.style.display !== "none"
                };
            })()
        """)
        print(f"  IT Admin Đỗ Trọng Minh Quân: Nút Đăng văn bản nhanh hiển thị: {it_buttons.get('quickBtnVisible')}")
        assert it_buttons.get("quickBtnVisible") is True, "LỖI: IT Admin Đỗ Trọng Minh Quân không thấy nút Đăng văn bản nhanh!"
        print("  ✅ PASS: Chỉ Giám đốc Nguyễn Chiến Thắng và IT Admin Quân mới có toàn quyền thấy nút và đăng tải văn bản!")

        # -------------------------------------------------------------
        # TEST CASE 5: Kiểm tra Đăng tải văn bản mới & SẮP XẾP TỪ MỚI TỚI CŨ
        # Kỳ vọng:
        # - Sau khi đăng, văn bản mới lập tức đứng ở VỊ TRÍ SỐ 1 TRÊN CÙNG
        # - Có huy hiệu 'MỚI' (animate-pulse)
        # - Iframe tự động hiển thị ngay văn bản mới này
        # -------------------------------------------------------------
        print("\n⚡ [TEST CASE 5] Kiểm tra Đăng văn bản mới & Thứ tự MỚI NHẤT TRÊN ĐẦU...")
        post_new_doc = """
        (() => {
            document.getElementById("directiveDocRef").value = "9999/TB-CN23";
            document.getElementById("directiveTitle").value = "Thông báo Khẩn: Triển khai kiểm tra toàn diện hồ sơ địa chính tháng 11/2026";
            document.getElementById("directiveNotes").value = "Đề nghị tất cả lãnh đạo tổ quán triệt 100% cán bộ thực hiện.";
            
            // Giả lập tệp PDF đính kèm (Data URL hợp lệ của PDF)
            window.attachedDirectivePdf = {
                name: "Thong_bao_khan_9999_CN23.pdf",
                size: "2.4 MB",
                base64: "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0tpZHMgWzUgMCBSXQovQ291bnQgMQovVHlwZSAvUGFnZXMKPj4KZW5kb2JqCg=="
            };
            
            // Submit form
            const form = document.getElementById("directiveUploadForm");
            form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
            return true;
        })()
        """
        client.evaluate(post_new_doc)
        time.sleep(1)

        new_top_check = client.evaluate("""
            (() => {
                const listItems = document.querySelectorAll("#directiveListContainer > [data-directive-id]");
                const topItem = listItems[0];
                const topTitle = topItem ? topItem.innerText : "";
                const topBadge = topItem ? topItem.querySelector(".animate-pulse")?.innerText : "";
                const iframe = document.getElementById("directivePdfIframe");
                const viewingTitle = document.getElementById("viewingDirectiveTitle")?.innerText;
                const viewingNotes = document.getElementById("viewingDirectiveNotes")?.innerText;
                
                return {
                    topTitle: topTitle,
                    hasNewBadge: topBadge === "MỚI",
                    iframeSrc: iframe ? iframe.src : "",
                    viewingTitle: viewingTitle,
                    viewingNotes: viewingNotes
                };
            })()
        """)
        print(f"  Văn bản ở hàng đầu tiên (STT 1): {new_top_check.get('topTitle')}")
        print(f"  Có huy hiệu 'MỚI': {new_top_check.get('hasNewBadge')}")
        print(f"  Iframe đang xem tệp PDF mới: {new_top_check.get('iframeSrc')[:40]}...")
        print(f"  Ý kiến quán triệt: {new_top_check.get('viewingNotes')}")

        assert "Thông báo Khẩn: Triển khai kiểm tra toàn diện" in new_top_check.get("topTitle"), "LỖI: Văn bản mới không nằm ở trên đầu danh mục!"
        assert new_top_check.get("hasNewBadge") is True, "LỖI: Văn bản mới thiếu huy hiệu 'MỚI'!"
        assert "data:application/pdf" in new_top_check.get("iframeSrc"), "LỖI: Iframe chưa tự động nạp tệp PDF vừa đăng!"
        print("  ✅ PASS: Văn bản mới ban hành luôn xuất hiện trên đầu (mới tới cũ) và nạp xem ngay lập tức!")

        # -------------------------------------------------------------
        # TEST CASE 6: Tải lên trực tiếp Zero-Friction (Bấm là nạp ngay, KHÔNG CẦN ĐIỀN FORM)
        # Kỳ vọng:
        # - Giả lập nạp trực tiếp file PDF qua handleDirectPdfUpload
        # - Tự động trích xuất tên file, tự động gán trích yếu & số hiệu
        # - Lập tức đưa lên vị trí STT 1 trên cùng và nạp thẳng vào Iframe xem bên phải
        # - Kiểm tra chuyển sang Tab 3 thì các thẻ KPI xuất hiện bình thường
        # -------------------------------------------------------------
        print("\n🚀 [TEST CASE 6] Kiểm tra Tải lên PDF trực tiếp & Chuyển Tab 3 hiển thị KPI...")
        
        # Giả lập tải file nhanh
        client.evaluate("""
            (() => {
                const dummyContent = "%PDF-1.4\\n1 0 obj\\n<< /Type /Catalog >>\\nendobj\\nxref\\n0 0\\ntrailer\\n<< /Root 1 0 R >>\\n%%EOF";
                const file = new File([dummyContent], "123_QD_UBND_Ke_hoach_giam_sat_dat_dai_2026.pdf", { type: "application/pdf" });
                handleDirectPdfUpload(file);
            })()
        """)
        time.sleep(1)

        direct_check = client.evaluate("""
            (() => {
                const listItems = document.querySelectorAll("#directiveListContainer > [data-directive-id]");
                const topItem = listItems[0];
                const topText = topItem ? topItem.innerText : "";
                const iframe = document.getElementById("directivePdfIframe");
                const viewingTitle = document.getElementById("viewingDirectiveTitle")?.innerText;
                const modal = document.getElementById("uploadDirectiveModal");
                
                return {
                    docCount: listItems.length,
                    topText: topText,
                    iframeSrc: iframe ? iframe.src : "",
                    viewingTitle: viewingTitle,
                    modalStayedHidden: modal ? modal.classList.contains("hidden") : true
                };
            })()
        """)
        print(f"  Văn bản vừa tải nhanh chiếm STT 1: '{direct_check.get('topText')[:60]}...'")
        print(f"  Tiêu đề xem bên phải: '{direct_check.get('viewingTitle')}'")
        print(f"  Modal form vẫn đóng hoàn toàn: {direct_check.get('modalStayedHidden')}")

        assert "123" in direct_check.get("topText"), "LỖI: Văn bản nhanh chưa lên đầu danh mục!"
        assert direct_check.get("modalStayedHidden") is True, "LỖI: Tự ý bật modal điền form trái với yêu cầu Zero-friction!"
        assert "data:application/pdf" in direct_check.get("iframeSrc"), "LỖI: Iframe chưa nạp tệp trực tiếp!"

        # Chuyển sang Tab 3 kiểm tra KPI hiển thị
        tab3_kpi_check = client.evaluate("""
            (() => {
                switchTaskTab('tracking');
                const panelTracking = document.getElementById('panelTracking');
                const kpi = document.getElementById('taskKpiSection');
                return {
                    trackingVisible: panelTracking && !panelTracking.classList.contains('hidden'),
                    kpiVisible: kpi && !kpi.classList.contains('hidden')
                };
            })()
        """)
        print(f"  Chuyển sang Tab 3: Bảng tiến độ và KPI hiển thị đầy đủ: {tab3_kpi_check.get('trackingVisible')} / {tab3_kpi_check.get('kpiVisible')}")
        assert tab3_kpi_check.get("trackingVisible") is True, "LỖI: Tab 3 không hiển thị!"
        assert tab3_kpi_check.get("kpiVisible") is True, "LỖI: KPI không hiển thị trong Tab 3!"

        print("  ✅ PASS: Tải lên trực tiếp PDF nhanh không form và KPI hoạt động chuẩn xác trong Tab 3!")

        # -------------------------------------------------------------
        # TEST CASE 7: Kiểm tra Nút Làm Mới / Đồng Bộ Google Sheet
        # Kỳ vọng:
        # - Nút #btnSyncDirectives hiển thị ở Tab 1
        # - Nút biểu tượng #btnReloadDirectivesList ở tiêu đề danh mục
        # - Chuyển sang Tab 2 hoặc 3 thì nút #btnSyncDirectives bị ẩn
        # - Hàm syncDirectivesFromCloud() và refreshDirectivesFromCloud() tồn tại và thực thi an toàn
        # -------------------------------------------------------------
        print("\n🔄 [TEST CASE 7] Kiểm tra Nút Làm Mới / Đồng Bộ Google Sheet...")
        sync_check = client.evaluate("""
            (() => {
                switchTaskTab('directives');
                const btnSync = document.getElementById('btnSyncDirectives');
                const btnReloadList = document.getElementById('btnReloadDirectivesList');
                const isSyncVisibleInTab1 = btnSync && !btnSync.classList.contains('hidden') && btnSync.style.display !== 'none';
                const isReloadListVisible = btnReloadList && !btnReloadList.classList.contains('hidden');

                // Chuyển sang Tab 3 kiểm tra nút bị ẩn
                switchTaskTab('tracking');
                const isSyncHiddenInTab3 = btnSync && (btnSync.classList.contains('hidden') || btnSync.style.display === 'none');

                // Quay lại Tab 1
                switchTaskTab('directives');

                return {
                    syncVisibleTab1: isSyncVisibleInTab1,
                    reloadListVisible: isReloadListVisible,
                    syncHiddenTab3: isSyncHiddenInTab3,
                    hasFunction: typeof window.syncDirectivesFromCloud === 'function' && typeof window.refreshDirectivesFromCloud === 'function'
                };
            })()
        """)
        print(f"  Nút Tải Lại Sheet hiển thị ở Tab 1: {sync_check.get('syncVisibleTab1')}")
        print(f"  Nút Reload List hiển thị ở header danh mục: {sync_check.get('reloadListVisible')}")
        print(f"  Nút Tải Lại Sheet bị ẩn khi sang Tab 3: {sync_check.get('syncHiddenTab3')}")
        print(f"  Hàm syncDirectivesFromCloud khả dụng: {sync_check.get('hasFunction')}")

        assert sync_check.get("syncVisibleTab1") is True, "LỖI: Nút Tải Lại Sheet không hiển thị ở Tab 1!"
        assert sync_check.get("reloadListVisible") is True, "LỖI: Nút reload trên danh mục không hiển thị!"
        assert sync_check.get("syncHiddenTab3") is True, "LỖI: Nút Tải Lại Sheet không bị ẩn ở Tab 3!"
        assert sync_check.get("hasFunction") is True, "LỖI: Thiếu hàm syncDirectivesFromCloud / refreshDirectivesFromCloud!"

        print("  ✅ PASS: Nút Tải Lại / Đồng Bộ Google Sheet hoạt động hoàn hảo!")

        print("\n" + "=" * 70)
        print("🎉 TẤT CẢ 7/7 TEST CASE VỀ THÔNG CÁO & CHỈ THỊ PDF ĐỀU THÀNH CÔNG 100%!")
        print("=" * 70)
        return True

    except Exception as e:
        print(f"\n❌ LỖI TRONG QUÁ TRÌNH KIỂM THỬ: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if client and client.sock:
            try: client.sock.close()
            except: pass
        if chrome_proc:
            try:
                chrome_proc.terminate()
                chrome_proc.wait(timeout=3)
            except:
                try: chrome_proc.kill()
                except: pass
        if server_proc:
            try:
                server_proc.terminate()
                server_proc.wait(timeout=3)
            except:
                try: server_proc.kill()
                except: pass

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
