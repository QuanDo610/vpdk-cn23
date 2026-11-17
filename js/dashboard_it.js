/**
 * =========================================================================
 * DASHBOARD_IT.JS: LOGIC ĐIỀU KHIỂN PHÂN HỆ DASHBOARD IT & QUẢN TRỊ THIẾT BỊ
 * Hệ Thống Cổng Dịch Vụ Cán Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23
 * =========================================================================
 */

(function () {
  "use strict";

  const tabTitles = {
    'tab-overview': {
      breadcrumb: 'Tổng Quan Thiết Bị Đang Dùng',
      heading: 'Bảng Điều Hành & Quản Trị Hệ Thống IT'
    },
    'tab-inventory': {
      breadcrumb: 'Kiểm Kê Thiết Bị',
      heading: 'Sổ Kiểm Kê: Thiết Bị Đang Hoạt Động vs Chờ Thanh Lý'
    },
    'tab-network': {
      breadcrumb: 'Hạ Tầng / Mạng & Server',
      heading: 'Sơ Đồ Phòng Máy Chủ, Switch & Dải IP Chuyên Dùng'
    },
    'tab-toner': {
      breadcrumb: 'Vật Tư / Hộp Mực In',
      heading: 'Bảng Tra Cứu Mã Hộp Mực Cho Toàn Bộ 38 Máy In Đang Dùng'
    }
  };

  /**
   * Đóng / mở thanh điều hướng Sidebar trên thiết bị di động
   */
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('is-open') || !sidebar.classList.contains('-translate-x-full');

    if (isOpen) {
      sidebar.classList.remove('is-open');
      sidebar.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    } else {
      sidebar.classList.add('is-open');
      sidebar.classList.remove('-translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
    }
  }

  /**
   * Chuyển đổi giữa 4 tab chức năng cốt lõi
   * @param {string} tabId 
   */
  function switchTab(tabId) {
    if (!tabTitles[tabId]) return;

    // 1. Ẩn tất cả tab nội dung
    document.querySelectorAll('.tab-content').forEach(el => {
      el.classList.add('hidden');
      el.classList.remove('block');
    });

    // 2. Xóa trạng thái active trên các nút menu sidebar
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.remove('nav-item-active');
    });

    // 3. Hiển thị tab mục tiêu
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
      targetContent.classList.remove('hidden');
      targetContent.classList.add('block');
    }

    // 4. Kích hoạt nút menu tương ứng
    const targetBtn = document.getElementById('btn-' + tabId);
    if (targetBtn) {
      targetBtn.classList.add('nav-item-active');
    }

    // 5. Cập nhật Breadcrumb & Tiêu đề thanh Topbar (nếu có)
    const breadcrumbEl = document.getElementById('breadcrumb-title');
    const headingEl = document.getElementById('topbar-heading');
    const mobileTabEl = document.getElementById('mobileCurrentTab');
    if (breadcrumbEl && tabTitles[tabId]) {
      breadcrumbEl.textContent = tabTitles[tabId].breadcrumb;
    }
    if (headingEl && tabTitles[tabId]) {
      headingEl.textContent = tabTitles[tabId].heading;
    }
    if (mobileTabEl && tabTitles[tabId]) {
      mobileTabEl.textContent = tabTitles[tabId].breadcrumb;
    }

    // 6. Đóng sidebar nếu đang mở trên màn hình nhỏ
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (sidebar) {
        sidebar.classList.remove('is-open');
        sidebar.classList.add('-translate-x-full');
      }
      if (overlay) overlay.classList.add('hidden');
    }

    // 7. Cuộn mượt lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Tìm kiếm tức thì trong bảng vật tư hộp mực máy in
   */
  function initTonerSearch() {
    const input = document.getElementById('searchTonerInput');
    const table = document.getElementById('tableToner');
    if (!input || !table) return;

    input.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const rows = table.querySelectorAll('tbody tr');
      let visibleCount = 0;

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });

      const countBadge = document.getElementById('tonerMatchCount');
      if (countBadge) {
        countBadge.textContent = q ? `${visibleCount} kết quả` : '';
      }
    });
  }

  /**
   * Tìm kiếm tức thì trong bảng kiểm kê thiết bị
   */
  function initInventorySearch() {
    const input = document.getElementById('searchInventoryInput');
    const table = document.getElementById('tableInventory');
    if (!input || !table) return;

    input.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Phơi API ra cửa sổ window
  window.switchTab = switchTab;
  window.toggleSidebar = toggleSidebar;

  // Khởi tạo sự kiện khi trang đã tải xong DOM
  document.addEventListener('DOMContentLoaded', function () {
    initTonerSearch();
    initInventorySearch();

    // Hỗ trợ đóng overlay khi nhấn ra ngoài
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', toggleSidebar);
    }
  });

})();
