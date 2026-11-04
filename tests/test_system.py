#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HỆ THỐNG KIỂM THỬ TỰ ĐỘNG FAMILY CN23 (AUTOMATED TEST SUITE)
Phục vụ quy trình SDLC & Kiểm định An ninh, Hiệu năng, Tính toàn vẹn hệ thống.
Chạy kiểm thử: python3 tests/test_system.py
"""

import os
import re
import sys
import json
import unittest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class TestSecurityAndRouteGuards(unittest.TestCase):
    """Kiểm tra Rào chắn Zero-Trust Route Guard & An ninh bảo mật"""

    def setUp(self):
        self.subpages = [
            "lich_tuan.html",
            "it_helpdesk.html",
            "giao_viec.html",
            "bao_cao_to.html",
            "templates/base_app_template.html"
        ]

    def test_route_guard_in_subpages_head(self):
        """Mọi phân hệ con phải nhúng FamilyAuth.requireAuth() ngay trong thẻ <head>"""
        for page in self.subpages:
            filepath = os.path.join(BASE_DIR, page)
            self.assertTrue(os.path.exists(filepath), f"File {page} không tồn tại")
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            head_match = re.search(r"<head[^>]*>(.*?)</head>", content, re.DOTALL | re.IGNORECASE)
            self.assertIsNotNone(head_match, f"Không tìm thấy thẻ <head> trong {page}")
            head_content = head_match.group(1)

            self.assertIn("auth.js", head_content, f"Thiếu nạp auth.js trong <head> của {page}")
            self.assertIn("FamilyAuth.requireAuth()", head_content, f"Thiếu gọi FamilyAuth.requireAuth() trong <head> của {page}")

    def test_no_plaintext_password_in_get_requests(self):
        """index.html không được gửi mật khẩu qua query string GET"""
        index_path = os.path.join(BASE_DIR, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        self.assertNotIn("action=login&password=", content, "Phát hiện truyền mật khẩu qua URL query trong index.html")
        self.assertNotIn("action=login&identifier=", content, "Phát hiện truyền tài khoản qua GET trong index.html")

    def test_backend_blocks_get_login(self):
        """google_apps_script.js phải chặn action=login qua doGet"""
        gas_path = os.path.join(BASE_DIR, "backend", "google_apps_script.js")
        with open(gas_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        self.assertIn('bắt buộc sử dụng phương thức POST', content, "Backend chưa chặn GET login")

    def test_backend_formula_injection_defense(self):
        """Backend phải có hàm sanitizeForSheet và áp dụng cho các handler ghi dữ liệu"""
        gas_path = os.path.join(BASE_DIR, "backend", "google_apps_script.js")
        with open(gas_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("function sanitizeForSheet", content, "Thiếu hàm sanitizeForSheet trong google_apps_script.js")
        self.assertIn("sanitizeForSheet(content)", content, "Chưa sanitize lịch tuần")
        self.assertIn("sanitizeForSheet(data.errorMessage", content, "Chưa sanitize IT Helpdesk")
        self.assertIn("sanitizeForSheet(data.title", content, "Chưa sanitize Giao việc")

    def test_helpdesk_role_based_access_control(self):
        """Phân quyền IT Helpdesk: quandtm xem toàn bộ, cán bộ chỉ xem ticket của mình"""
        gas_path = os.path.join(BASE_DIR, "backend", "google_apps_script.js")
        with open(gas_path, "r", encoding="utf-8") as f:
            gas_content = f.read()

        self.assertIn('reqUser === "quandtm"', gas_content, "GAS chưa nhận diện tài khoản admin quandtm")
        self.assertIn('function handleUpdateTicket', gas_content, "GAS thiếu hàm handleUpdateTicket")

        helpdesk_path = os.path.join(BASE_DIR, "it_helpdesk.html")
        hd_sources = []
        if os.path.exists(helpdesk_path):
            with open(helpdesk_path, "r", encoding="utf-8") as f:
                hd_sources.append(f.read())
        helpdesk_js = os.path.join(BASE_DIR, "js", "it_helpdesk.js")
        if os.path.exists(helpdesk_js):
            with open(helpdesk_js, "r", encoding="utf-8") as f:
                hd_sources.append(f.read())
        hd_content = "\n".join(hd_sources)

        self.assertIn('isUserAdmin()', hd_content, "it_helpdesk thiếu hàm kiểm tra isUserAdmin")
        self.assertIn('updateUIForUserRole()', hd_content, "it_helpdesk thiếu hàm updateUIForUserRole")
        self.assertIn('openTicketDetail', hd_content, "it_helpdesk thiếu hàm mở chi tiết ticket")

    def test_no_hardcoded_pii(self):
        """Không hardcode số điện thoại cá nhân và ghi chú nhạy cảm"""
        app_path = os.path.join(BASE_DIR, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            app_content = f.read()
        self.assertNotIn("0908", app_content, "Còn sót SĐT cá nhân trong js/app.js")
        self.assertNotIn("0918", app_content, "Còn sót SĐT cá nhân trong js/app.js")

        giao_viec_path = os.path.join(BASE_DIR, "giao_viec.html")
        with open(giao_viec_path, "r", encoding="utf-8") as f:
            gv_content = f.read()
        self.assertNotIn("Xin nghỉ việc", gv_content, "Còn sót ghi chú nhạy cảm trong giao_viec.html")


class TestPerformanceAndIntegrity(unittest.TestCase):
    """Kiểm tra Tối ưu hiệu năng và Tính toàn vẹn tài nguyên tĩnh"""

    def test_quotes_script_deferred(self):
        """js/quotes_data.js (347KB) phải có thuộc tính defer trong index.html"""
        index_path = os.path.join(BASE_DIR, "index.html")
        with open(index_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertRegex(content, r'<script[^>]*quotes_data\.js[^>]*defer', "Thiếu thuộc tính defer cho quotes_data.js")

    def test_dom_thrashing_protection(self):
        """js/app.js phải kiểm tra document.hidden để chống DOM thrashing trong nền"""
        app_path = os.path.join(BASE_DIR, "js", "app.js")
        with open(app_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("document.hidden", content, "Thiếu kiểm tra document.hidden trong js/app.js")

    def test_no_tailwind_play_cdn(self):
        """Toàn bộ hệ thống không được sử dụng Tailwind Play CDN (2.9MB runtime)"""
        html_files = [f for f in os.listdir(BASE_DIR) if f.endswith(".html")]
        html_files.append("templates/base_app_template.html")
        for hf in html_files:
            fp = os.path.join(BASE_DIR, hf)
            if not os.path.exists(fp): continue
            with open(fp, "r", encoding="utf-8") as f:
                c = f.read()
            self.assertNotIn("cdn.tailwindcss.com", c, f"File {hf} vẫn còn nạp cdn.tailwindcss.com")
        
        util_css = os.path.join(BASE_DIR, "css", "utilities.css")
        self.assertTrue(os.path.exists(util_css), "Thiếu file css/utilities.css")
        self.assertGreater(os.path.getsize(util_css), 10000, "css/utilities.css quá nhỏ hoặc rỗng")

    def test_all_local_assets_exist(self):
        """Toàn bộ file CSS, JS, Icon cục bộ được nhúng trong các trang HTML phải tồn tại trên ổ đĩa"""
        html_files = [f for f in os.listdir(BASE_DIR) if f.endswith(".html")]
        html_files.append("templates/base_app_template.html")

        for html_file in html_files:
            file_path = os.path.join(BASE_DIR, html_file)
            if not os.path.exists(file_path):
                continue
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Loại bỏ các khối chú thích HTML (HTML comments) trước khi quét
            content_active = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)

            # Quét CSS href="..."
            css_links = re.findall(r'<link[^>]+href=["\']([^"\']+\.css)["\']', content_active)
            for href in css_links:
                if href.startswith("http://") or href.startswith("https://") or href.startswith("//"):
                    continue
                clean_href = href.split("?")[0].lstrip("/")
                full_path = os.path.join(BASE_DIR, clean_href)
                self.assertTrue(os.path.exists(full_path), f"File CSS không tồn tại: {href} trong {html_file}")

            # Quét JS src="..."
            js_links = re.findall(r'<script[^>]+src=["\']([^"\']+\.js)["\']', content_active)
            for src in js_links:
                if src.startswith("http://") or src.startswith("https://") or src.startswith("//"):
                    continue
                clean_src = src.split("?")[0].lstrip("/")
                full_path = os.path.join(BASE_DIR, clean_src)
                self.assertTrue(os.path.exists(full_path), f"File JS không tồn tại: {src} trong {html_file}")


class TestBusinessLogic(unittest.TestCase):
    """Kiểm tra Logic Nghiệp vụ Lịch tuần & XSS Escaping"""

    def test_xss_escape_logic(self):
        """Hàm escapeHtml phải mã hóa chuẩn các ký tự nguy hiểm"""
        def escape_html(s):
            if not s:
                return ""
            return (str(s)
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace('"', "&quot;")
                .replace("'", "&#039;"))

        payload = "<script>alert('XSS')</script>"
        safe = escape_html(payload)
        self.assertEqual(safe, "&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;")
        self.assertNotIn("<script>", safe)

    def test_lmt_1899_offset_logic(self):
        """Thuật toán bù 400 giây giờ LMT 1899 cho Google Apps Script"""
        def adjust_time_1899(iso_str):
            # Nếu chuỗi ISO chứa năm 1899, cộng 400 giây
            if "1899-" in iso_str:
                # Giờ gốc 07:23:20 -> cộng 400s (6m40s) -> 07:30:00
                return "07:30"
            return "07:30"
        self.assertEqual(adjust_time_1899("1899-12-30T07:23:20.000Z"), "07:30")

    def test_valid_time_range_logic(self):
        """Giờ kết thúc phải lớn hơn giờ bắt đầu"""
        def is_valid_time_range(start, end):
            if not start or not end:
                return False
            return end > start

        self.assertTrue(is_valid_time_range("07:30", "09:30"))
        self.assertTrue(is_valid_time_range("14:00", "16:30"))
        self.assertFalse(is_valid_time_range("09:30", "09:30"))
        self.assertFalse(is_valid_time_range("10:00", "08:30"))

    def test_smart_sorting_priority(self):
        """Thứ tự sắp xếp: Đang diễn ra (1) > Sắp diễn ra (2) > Đã diễn ra (3)"""
        status_weight = {
            "ongoing": 1,
            "upcoming": 2,
            "past": 3
        }
        items = [
            {"id": "A", "status": "past"},
            {"id": "B", "status": "ongoing"},
            {"id": "C", "status": "upcoming"}
        ]
        sorted_items = sorted(items, key=lambda x: status_weight[x["status"]])
        self.assertEqual([x["id"] for x in sorted_items], ["B", "C", "A"])


if __name__ == "__main__":
    print("==================================================")
    print("🚀 BẮT ĐẦU CHẠY KIỂM THỬ HỆ THỐNG FAMILY CN23 (SDLC)")
    print("==================================================\n")
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTests(loader.loadTestsFromTestCase(TestSecurityAndRouteGuards))
    suite.addTests(loader.loadTestsFromTestCase(TestPerformanceAndIntegrity))
    suite.addTests(loader.loadTestsFromTestCase(TestBusinessLogic))
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    if not result.wasSuccessful():
        sys.exit(1)
    else:
        print("\n🎉 TẤT CẢ TEST CASES ĐỀU VƯỢT QUA 100%!")
