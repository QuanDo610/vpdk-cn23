/**
 * =========================================================================
 * SIDEBAR.JS: MODULE MENU ĐIỀU HƯỚNG CỐ ĐỊNH BÊN TRÁI (SOLID ROYAL NAVY)
 * Hệ Thống Web Portal - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23
 * =========================================================================
 */

(function () {
  "use strict";

  // Danh mục 5 phân hệ cốt lõi + 1 Kho cài đặt (Tên gọi chuẩn hóa ngắn gọn, không badge)
  const MENU_ITEMS = [
    {
      id: "hub",
      label: "Trang chủ",
      href: "index.html",
      icon: "fa-solid fa-house"
    },
    {
      id: "lich",
      label: "Đăng ký lịch tuần",
      href: "lich_tuan.html",
      icon: "fa-solid fa-calendar-week"
    },
    {
      id: "it",
      label: "IT Helpdesk",
      href: "it_helpdesk.html",
      icon: "fa-solid fa-headset"
    },
    {
      id: "giao-viec",
      label: "Giao việc",
      href: "giao_viec.html",
      icon: "fa-solid fa-list-check"
    },
    {
      id: "bao-cao",
      label: "Báo cáo số liệu",
      href: "bao_cao_to.html",
      icon: "fa-solid fa-chart-pie"
    }
  ];

  const UTILITY_ITEMS = [
    {
      id: "kho",
      label: "Kho cài đặt",
      href: "https://drive.google.com/drive/folders/1T2LVJKymM-52KBLNeabYxtAT4zfXneND",
      icon: "fa-solid fa-cloud-arrow-down",
      target: "_blank"
    }
  ];

  // Khởi tạo Sidebar khi DOM sẵn sàng
  function initSidebar() {
    if (document.getElementById("appSidebar")) return;

    // Đánh dấu body có Sidebar
    document.body.classList.add("has-sidebar");

    // Kiểm tra trạng thái thu gọn đã lưu từ trước
    const isCollapsedSaved = localStorage.getItem("sidebar_collapsed") === "true";
    const isDesktop = window.innerWidth >= 1024;
    if (isCollapsedSaved && isDesktop) {
      document.body.classList.add("sidebar-collapsed");
    }

    // Xác định trang hiện tại
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // Lấy thông tin cán bộ đăng nhập
    let userName = "Cán bộ";
    let userRole = "Chi nhánh số 23";

    try {
      const storedUser = sessionStorage.getItem("currentUser") || 
                         sessionStorage.getItem("binhduong_user") || 
                         sessionStorage.getItem("vpdk_current_user") || 
                         sessionStorage.getItem("currentStaff");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userName = parsed.fullname || parsed.name || parsed.ho_ten || parsed.username || "Cán bộ";
        userRole = parsed.position || parsed.department || parsed.role || "Chi nhánh 23";
        if (!sessionStorage.getItem("currentUser")) {
          sessionStorage.setItem("currentUser", JSON.stringify(parsed));
        }
      } else {
        const storedName = sessionStorage.getItem("userName") || localStorage.getItem("lastLoginFullName");
        if (storedName) userName = storedName;
      }
    } catch (e) {
      console.warn("Lỗi đọc thông tin cán bộ:", e);
    }

    // Tạo HTML cho Menu Items (gọn gàng, không badge bên cạnh để chữ không bị ...)
    const menuHtml = MENU_ITEMS.map((item) => {
      const isActive = currentPath === item.href || (item.id === "hub" && (currentPath === "" || currentPath === "index.html"));
      return `
        <li>
          <a href="${item.href}" class="sidebar-nav-item ${isActive ? 'active' : ''}" data-id="${item.id}" title="${item.label}">
            <div class="sidebar-nav-icon">
              <i class="${item.icon}"></i>
            </div>
            <span class="sidebar-nav-label">${item.label}</span>
          </a>
        </li>
      `;
    }).join("");

    // Tạo HTML cho Tiện ích
    const utilityHtml = UTILITY_ITEMS.map((item) => {
      return `
        <li>
          <a href="${item.href}" target="${item.target || '_self'}" rel="noopener noreferrer" class="sidebar-nav-item" data-id="${item.id}" title="${item.label} (Google Drive)">
            <div class="sidebar-nav-icon">
              <i class="${item.icon}"></i>
            </div>
            <span class="sidebar-nav-label">${item.label}</span>
          </a>
        </li>
      `;
    }).join("");

    // Cấu trúc Sidebar chính
    const sidebarElement = document.createElement("aside");
    sidebarElement.id = "appSidebar";
    sidebarElement.className = `app-sidebar ${isCollapsedSaved && isDesktop ? 'collapsed' : ''}`;
    sidebarElement.innerHTML = `
      <!-- Brand Logo Header (Văn phòng Đăng ký đất đai Chi nhánh số 23) -->
      <div class="sidebar-brand">
        <a href="index.html" class="sidebar-brand-main" title="Cổng Dịch Vụ - VPĐK Chi Nhánh 23">
          <div class="sidebar-brand-icon">
            <i class="fa-solid fa-landmark"></i>
          </div>
          <div class="sidebar-brand-text">
            <div class="sidebar-brand-title">VP ĐĂNG KÝ ĐẤT ĐAI</div>
            <div class="sidebar-brand-sub">Chi nhánh số 23 &bull; Portal</div>
          </div>
        </a>
        <button type="button" id="btnToggleSidebarCollapse" class="sidebar-collapse-btn" title="Thu gọn / Mở rộng menu (Icon mode)">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>

      <!-- Navigation Menus -->
      <div class="sidebar-menu-wrapper">
        <div class="sidebar-group-label">Phân Hệ Làm Việc</div>
        <ul class="sidebar-nav-list">
          ${menuHtml}
        </ul>

        <div class="sidebar-group-label" style="margin-top: 16px;">Tiện Ích</div>
        <ul class="sidebar-nav-list">
          ${utilityHtml}
        </ul>
      </div>

      <!-- Sidebar Footer (Thông tin Cán bộ & Đăng xuất) -->
      <div class="sidebar-footer">
        <div class="sidebar-user-card" title="${userName} - ${userRole}">
          <div class="sidebar-user-avatar">
            <i class="fa-solid fa-user-tie"></i>
          </div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name" id="sidebarUserName">${userName}</div>
            <div class="sidebar-user-role" id="sidebarUserRole">${userRole}</div>
          </div>
        </div>

        <div class="sidebar-action-row">
          <span class="sidebar-version-tag">v3.6 CN23</span>
          <button type="button" id="sidebarBtnLogout" class="sidebar-btn-logout" title="Đăng xuất khỏi hệ thống">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    `;

    // Tạo Backdrop mờ cho màn hình nhỏ
    const backdropElement = document.createElement("div");
    backdropElement.id = "sidebarBackdrop";
    backdropElement.className = "sidebar-backdrop";

    // Tạo Mobile Topbar cho màn hình nhỏ (< 1024px)
    const mobileTopbar = document.createElement("div");
    mobileTopbar.id = "mobileTopbar";
    mobileTopbar.className = "mobile-topbar";
    mobileTopbar.innerHTML = `
      <div class="mobile-topbar-left">
        <button type="button" class="sidebar-hamburger-btn" data-toggle="sidebar" aria-label="Mở Menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div>
          <div class="mobile-topbar-brand">
            <span>VP ĐĂNG KÝ ĐẤT ĐAI</span>
          </div>
          <div class="mobile-topbar-sub">Chi nhánh số 23 &bull; Portal</div>
        </div>
      </div>
      <div class="mobile-topbar-user" id="mobileTopbarUser">
        <i class="fa-solid fa-circle-user text-amber-300"></i>
        <span class="truncate max-w-[120px]">${userName}</span>
      </div>
    `;

    // Chèn vào đầu body
    document.body.prepend(backdropElement);
    document.body.prepend(sidebarElement);
    document.body.prepend(mobileTopbar);

    // Xử lý nút thu gọn / mở rộng Sidebar (Dấu 3 gạch trên Desktop)
    const btnCollapse = document.getElementById("btnToggleSidebarCollapse");
    if (btnCollapse) {
      btnCollapse.addEventListener("click", function (e) {
        e.preventDefault();
        const sidebar = document.getElementById("appSidebar");
        const isCollapsed = sidebar.classList.toggle("collapsed");
        document.body.classList.toggle("sidebar-collapsed", isCollapsed);
        localStorage.setItem("sidebar_collapsed", isCollapsed ? "true" : "false");
      });
    }

    // Xử lý sự kiện Đăng xuất
    const btnLogout = document.getElementById("sidebarBtnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", function () {
        if (confirm("Đồng chí có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
          sessionStorage.clear();
          localStorage.removeItem("loginRememberToken");
          window.location.href = "index.html";
        }
      });
    }

    // Đóng sidebar khi bấm vào Backdrop trên điện thoại
    backdropElement.addEventListener("click", function () {
      closeSidebarMobile();
    });

    // Gắn sự kiện cho các nút Hamburger trên Mobile
    setupHamburgerButtons();
  }

  // Mở Sidebar trên Mobile
  function openSidebarMobile() {
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.add("sidebar-open");
    if (backdrop) backdrop.classList.add("active");
  }

  // Đóng Sidebar trên Mobile
  function closeSidebarMobile() {
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar) sidebar.classList.remove("sidebar-open");
    if (backdrop) backdrop.classList.remove("active");
  }

  // Tìm và gắn sự kiện cho mọi nút Hamburger Mobile
  function setupHamburgerButtons() {
    const hamburgerBtns = document.querySelectorAll(".sidebar-hamburger-btn, [data-toggle='sidebar']");
    hamburgerBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const sidebar = document.getElementById("appSidebar");
        if (sidebar && sidebar.classList.contains("sidebar-open")) {
          closeSidebarMobile();
        } else {
          openSidebarMobile();
        }
      });
    });
  }

  // Tự động khởi chạy
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar);
  } else {
    initSidebar();
  }

  // Xuất API toàn cục
  window.FamilySidebar = {
    open: openSidebarMobile,
    close: closeSidebarMobile,
    toggleCollapse: function () {
      const sidebar = document.getElementById("appSidebar");
      if (sidebar) {
        const isCollapsed = sidebar.classList.toggle("collapsed");
        document.body.classList.toggle("sidebar-collapsed", isCollapsed);
        localStorage.setItem("sidebar_collapsed", isCollapsed ? "true" : "false");
      }
    },
    updateUser: function (name, role) {
      const nameEl = document.getElementById("sidebarUserName");
      const roleEl = document.getElementById("sidebarUserRole");
      const mobileUserEl = document.querySelector("#mobileTopbarUser span");
      if (nameEl && name) nameEl.textContent = name;
      if (roleEl && role) roleEl.textContent = role;
      if (mobileUserEl && name) mobileUserEl.textContent = name;
    }
  };
})();
