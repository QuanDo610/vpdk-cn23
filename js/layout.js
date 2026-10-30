/**
 * =========================================================================
 * LAYOUT.JS: QUẢN LÝ HEADER ĐỒNG BỘ TOÀN HỆ THỐNG (FULL-WIDTH TOPBAR + NAV TABS)
 * Hệ Thống Web Portal - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23
 * =========================================================================
 */

(function () {
  "use strict";

  // Danh mục 5 phân hệ nghiệp vụ + 1 Kho cài đặt (Điều hướng ngang tiện lợi)
  const NAV_ITEMS = [
    { id: "hub", label: "Trang chủ", href: "index.html", icon: "fa-solid fa-house" },
    { id: "lich", label: "Lịch tuần", href: "lich_tuan.html", icon: "fa-solid fa-calendar-week" },
    { id: "it", label: "IT Helpdesk", href: "it_helpdesk.html", icon: "fa-solid fa-headset" },
    { id: "giao-viec", label: "Giao việc", href: "giao_viec.html", icon: "fa-solid fa-list-check" },
    { id: "bao-cao", label: "Báo cáo tổ", href: "bao_cao_to.html", icon: "fa-solid fa-chart-pie" },
    {
      id: "kho",
      label: "Kho cài đặt",
      href: "https://drive.google.com/drive/folders/1T2LVJKymM-52KBLNeabYxtAT4zfXneND",
      icon: "fa-solid fa-cloud-arrow-down",
      target: "_blank"
    }
  ];

  function initAppLayout() {
    if (document.getElementById("appTopbar")) return;

    // Đọc thông tin cán bộ đăng nhập
    let userName = "Cán bộ";
    let userRole = "Chi nhánh số 23";
    let hasSession = false;

    try {
      const storedUser = sessionStorage.getItem("currentUser") || 
                         sessionStorage.getItem("binhduong_user") || 
                         sessionStorage.getItem("vpdk_current_user") || 
                         sessionStorage.getItem("currentStaff");
      if (storedUser) {
        hasSession = true;
        const parsed = JSON.parse(storedUser);
        userName = parsed.fullname || parsed.name || parsed.ho_ten || parsed.username || "Cán bộ";
        userRole = parsed.position || parsed.department || parsed.role || "Chi nhánh 23";
        if (!sessionStorage.getItem("currentUser")) {
          sessionStorage.setItem("currentUser", JSON.stringify(parsed));
        }
      } else {
        const storedName = sessionStorage.getItem("userName") || localStorage.getItem("lastLoginFullName");
        if (storedName) {
          hasSession = true;
          userName = storedName;
        }
      }
    } catch (e) {
      console.warn("Lỗi đọc thông tin đăng nhập:", e);
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const isHubLogin = (currentPath === "index.html" || currentPath === "" || currentPath.endsWith("index.html")) && !hasSession;

    // Tạo các nút Tab điều hướng ngang
    const navTabsHtml = NAV_ITEMS.map((item) => {
      const isActive = currentPath === item.href || (item.id === "hub" && (currentPath === "" || currentPath === "index.html"));
      return `
        <a href="${item.href}" class="nav-tab-btn ${isActive ? 'active' : ''}" target="${item.target || '_self'}" rel="${item.target ? 'noopener noreferrer' : ''}" data-id="${item.id}" title="${item.label}">
          <i class="${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `;
    }).join("");

    // 1. TẠO THANH HEADER CỐ ĐỊNH CHẠY DÀI TRÊN CÙNG (FULL-WIDTH TOPBAR)
    const topbarElement = document.createElement("header");
    topbarElement.id = "appTopbar";
    topbarElement.className = "app-topbar";
    topbarElement.innerHTML = `
      <div class="topbar-left">
        <a href="index.html" class="topbar-brand" title="Trang chủ Cổng Dịch Vụ - VPĐK Chi Nhánh 23">
          <div class="topbar-logo-box">
            <i class="fa-solid fa-landmark"></i>
          </div>
          <div class="topbar-titles">
            <span class="topbar-agency-name">VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI THÀNH PHỐ HỒ CHÍ MINH</span>
            <span class="topbar-sub-agency">CHI NHÁNH SỐ 23 &bull; CỔNG DỊCH VỤ CÔNG NỘI BỘ</span>
          </div>
        </a>
      </div>

      <!-- Thanh điều hướng ngang nằm giữa Header -->
      <nav class="topbar-nav" id="topbarNav" style="${isHubLogin ? 'display: none;' : 'display: flex;'}">
        ${navTabsHtml}
      </nav>

      <!-- Thông tin cán bộ & Đăng xuất nằm bên phải -->
      <div class="topbar-right" id="headerUserArea" style="${isHubLogin ? 'display: none;' : 'display: flex;'}">
        <div class="topbar-user-badge" id="topbarUserBadge" title="${userName} - ${userRole}">
          <div class="topbar-user-avatar">
            <i class="fa-solid fa-user-tie"></i>
          </div>
          <div class="topbar-user-text">
            <span class="topbar-user-name" id="displayUserName">${userName}</span>
            <span class="topbar-user-role" id="displayUserRole">${userRole}</span>
            <span id="displayUserEmail" style="display: none;"></span>
            <span id="headerUserName" style="display: none;">${userName}</span>
            <span id="headerUserRole" style="display: none;">${userRole}</span>
            <span id="itUserName" style="display: none;">${userName}</span>
          </div>
        </div>

        <button type="button" id="btnTopbarLogout" class="topbar-logout-btn" title="Đăng xuất khỏi hệ thống">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span class="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    `;

    // Chèn vào đầu body
    document.body.prepend(topbarElement);

    // Nút đăng xuất trên Header
    const btnLogout = document.getElementById("btnTopbarLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", function () {
        if (confirm("Đồng chí có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
          sessionStorage.clear();
          localStorage.removeItem("loginRememberToken");
          window.location.href = "index.html";
        }
      });
    }
  }

  // Khởi chạy khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAppLayout);
  } else {
    initAppLayout();
  }

  // Xuất API toàn cục
  window.FamilyLayout = {
    updateUser: function (name, role) {
      const nameEl = document.getElementById("displayUserName");
      const roleEl = document.getElementById("displayUserRole");
      if (nameEl && name) nameEl.textContent = name;
      if (roleEl && role) roleEl.textContent = role;
    },
    showSession: function (user) {
      const topbarNav = document.getElementById("topbarNav");
      const headerUserArea = document.getElementById("headerUserArea");
      if (topbarNav) topbarNav.style.display = "flex";
      if (headerUserArea) headerUserArea.style.display = "flex";
      if (user) {
        const name = user.fullname || user.name || user.ho_ten || user.username;
        const role = user.position || user.department || user.role;
        this.updateUser(name, role);
      }
    },
    hideSession: function () {
      const topbarNav = document.getElementById("topbarNav");
      const headerUserArea = document.getElementById("headerUserArea");
      if (topbarNav) topbarNav.style.display = "none";
      if (headerUserArea) headerUserArea.style.display = "none";
    }
  };

  // Hỗ trợ tương thích ngược với code cũ gọi FamilySidebar
  window.FamilySidebar = window.FamilyLayout;
})();
