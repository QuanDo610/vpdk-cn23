/**
 * =========================================================================
 * LAYOUT.JS: BỘ ĐIỀU KHIỂN HEADER & FOOTER ĐỒNG BỘ TOÀN HỆ THỐNG
 * Hệ Thống Cổng Dịch Vụ Cán Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23
 * =========================================================================
 * 
 * Tính năng chính:
 * 1. Tự động khởi tạo Header cố định chuẩn nhận diện cơ quan:
 *    - Nút Icon Tòa nhà (Landmark): Bấm vào để quay về Trang chủ Cổng Dịch Vụ (index.html).
 *    - Tên cơ quan & Chi nhánh chuẩn thể thức.
 *    - Loại bỏ hoàn toàn thanh điều hướng tab rườm rà ở giữa.
 *    - Khu vực Cán bộ bên phải tích hợp Menu Dropdown (Avatar, Thông tin, Đang hoạt động, Đăng xuất).
 * 2. Tự động chèn Footer chuẩn thể thức Nghị định 30/2020/NĐ-CP và bản quyền cơ quan.
 * 3. Cung cấp API toàn cục window.FamilyLayout để các phân hệ cập nhật phiên làm việc dễ dàng.
 */

(function () {
  "use strict";

  // Hàm thực hiện Đăng xuất toàn diện
  function performLogout() {
    if (confirm("Đồng chí có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
      try {
        sessionStorage.clear();
        localStorage.removeItem("loginRememberToken");
        localStorage.removeItem("family_user");
        localStorage.removeItem("binhduong_user");
        localStorage.removeItem("vpdk_current_user");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentStaff");
      } catch (e) {
        console.warn("Lỗi xóa session:", e);
      }
      window.location.href = "index.html";
    }
  }

  // 1. TẠO THANH HEADER CỐ ĐỊNH PHÍA TRÊN (TOPBAR)
  function initAppHeader() {
    if (document.getElementById("appTopbar")) return;

    // Đọc thông tin cán bộ từ phiên đăng nhập (ưu tiên khóa chuẩn family_user)
    let userName = "Cán bộ";
    let userRole = "Chi nhánh số 23";
    let hasSession = false;

    try {
      const storedUser = sessionStorage.getItem("family_user") ||
                         sessionStorage.getItem("currentUser") || 
                         sessionStorage.getItem("binhduong_user") || 
                         sessionStorage.getItem("vpdk_current_user") || 
                         sessionStorage.getItem("currentStaff");
      if (storedUser) {
        hasSession = true;
        const parsed = JSON.parse(storedUser);
        userName = parsed.fullname || parsed.name || parsed.ho_ten || parsed.username || "Cán bộ";
        userRole = parsed.position || parsed.department || parsed.role || parsed.chuc_vu || "Chi nhánh 23";
        if (!sessionStorage.getItem("family_user")) {
          sessionStorage.setItem("family_user", JSON.stringify(parsed));
        }
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

    // Tạo phần tử header
    const topbarElement = document.createElement("header");
    topbarElement.id = "appTopbar";
    topbarElement.className = "app-topbar";
    topbarElement.innerHTML = `
      <!-- Cụm bên trái: Icon Tòa nhà (Nút về trang chủ) & Tên cơ quan -->
      <div class="topbar-left">
        <a href="index.html" class="topbar-brand" id="topbarBrandHome" title="Quay về Trang chủ Cổng Dịch Vụ">
          <div class="topbar-logo-box" id="topbarHomeIcon" title="Quay về Trang chủ (Cổng Dịch Vụ)">
            <i class="fa-solid fa-landmark"></i>
          </div>
          <div class="topbar-titles">
            <span class="topbar-agency-name">VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI THÀNH PHỐ HỒ CHÍ MINH</span>
            <span class="topbar-sub-agency">CHI NHÁNH SỐ 23 &bull; CỔNG DỊCH VỤ CÔNG NỘI BỘ</span>
          </div>
        </a>
      </div>

      <!-- Cụm bên phải: Huy hiệu Cán bộ & Menu Dropdown (Tích hợp Đăng xuất) -->
      <div class="topbar-right" id="headerUserArea" style="${isHubLogin ? 'display: none;' : 'display: flex;'}">
        <div class="topbar-user-dropdown-wrapper" id="topbarUserDropdownWrapper">
          <!-- Nút kích hoạt Dropdown -->
          <button type="button" class="topbar-user-badge" id="topbarUserBtn" aria-haspopup="true" aria-expanded="false" title="Nhấp để xem menu tài khoản: ${userName}">
            <div class="topbar-user-avatar">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div class="topbar-user-text">
              <span class="topbar-user-name" id="displayUserName">${userName}</span>
              <span class="topbar-user-role" id="displayUserRole">${userRole}</span>
              <!-- Các span ẩn để tương thích ngược 100% với code các module cũ -->
              <span id="displayUserEmail" style="display: none;"></span>
              <span id="headerUserName" style="display: none;">${userName}</span>
              <span id="headerUserRole" style="display: none;">${userRole}</span>
              <span id="itUserName" style="display: none;">${userName}</span>
            </div>
            <i class="fa-solid fa-chevron-down topbar-user-caret" id="topbarUserCaret"></i>
          </button>

          <!-- Menu Dropdown sổ xuống -->
          <div class="topbar-user-dropdown-menu" id="topbarUserDropdownMenu">
            <!-- Tóm tắt hồ sơ cán bộ -->
            <div class="user-dropdown-header">
              <div class="user-dropdown-header-avatar">
                <i class="fa-solid fa-circle-user"></i>
              </div>
              <div class="user-dropdown-header-info">
                <div class="user-dropdown-fullname" id="dropdownUserName">${userName}</div>
                <div class="user-dropdown-role" id="dropdownUserRole">${userRole}</div>
                <div class="user-dropdown-status">
                  <span class="status-indicator-dot"></span>
                  <span>Đang trực tuyến</span>
                </div>
              </div>
            </div>

            <div class="user-dropdown-divider"></div>

            <!-- Các liên kết tiện ích -->
            <div class="user-dropdown-links">
              <a href="index.html" class="user-dropdown-item" id="dropdownLinkHome" title="Quay về Trang chủ Cổng Dịch Vụ">
                <i class="fa-solid fa-house"></i>
                <span>Trang chủ Cổng Dịch Vụ</span>
              </a>
              <a href="https://drive.google.com/drive/folders/1T2LVJKymM-52KBLNeabYxtAT4zfXneND" target="_blank" rel="noopener noreferrer" class="user-dropdown-item" title="Tải các phần mềm nội bộ">
                <i class="fa-solid fa-cloud-arrow-down"></i>
                <span>Kho cài đặt nội bộ</span>
              </a>
            </div>

            <div class="user-dropdown-divider"></div>

            <!-- Nút Đăng xuất tích hợp bên trong dropdown -->
            <button type="button" class="user-dropdown-item user-dropdown-logout" id="btnDropdownLogout" title="Đăng xuất khỏi hệ thống">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Đăng xuất tài khoản</span>
            </button>
            <button type="button" id="btnTopbarLogout" style="display: none;" title="Fallback logout button"></button>
          </div>
        </div>
      </div>
    `;

    // Chèn vào đầu body
    document.body.prepend(topbarElement);

    // Gắn sự kiện đóng/mở Dropdown
    const dropdownWrapper = document.getElementById("topbarUserDropdownWrapper");
    const dropdownBtn = document.getElementById("topbarUserBtn");
    if (dropdownBtn && dropdownWrapper) {
      dropdownBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        const isOpen = dropdownWrapper.classList.toggle("is-open");
        dropdownBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    // Đóng Dropdown khi click ra ngoài
    document.addEventListener("click", function (e) {
      if (dropdownWrapper && dropdownWrapper.classList.contains("is-open")) {
        if (!dropdownWrapper.contains(e.target)) {
          dropdownWrapper.classList.remove("is-open");
          if (dropdownBtn) dropdownBtn.setAttribute("aria-expanded", "false");
        }
      }
    });

    // Đóng Dropdown khi bấm phím Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dropdownWrapper && dropdownWrapper.classList.contains("is-open")) {
        dropdownWrapper.classList.remove("is-open");
        if (dropdownBtn) dropdownBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Gắn sự kiện Đăng xuất
    const btnDropdownLogout = document.getElementById("btnDropdownLogout");
    if (btnDropdownLogout) {
      btnDropdownLogout.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        performLogout();
      });
    }
    const btnTopbarLogout = document.getElementById("btnTopbarLogout");
    if (btnTopbarLogout) {
      btnTopbarLogout.addEventListener("click", performLogout);
    }

    // Đảm bảo click vào icon Tòa nhà luôn điều hướng về index.html
    const homeIcon = document.getElementById("topbarHomeIcon");
    if (homeIcon) {
      homeIcon.addEventListener("click", function (e) {
        window.location.href = "index.html";
      });
    }
  }

  // 2. TẠO CHÂN TRANG ĐỒNG BỘ TOÀN HỆ THỐNG (FOOTER TINH GỌN)
  function initAppFooter() {
    if (document.getElementById("appFooter")) return;

    // Dọn dẹp footer tĩnh cũ nếu có (ví dụ trong lịch tuần cũ)
    const existingFooters = document.querySelectorAll("footer.app-footer");
    existingFooters.forEach((el) => {
      if (el.id !== "appFooter") el.remove();
    });

    const footerElement = document.createElement("footer");
    footerElement.id = "appFooter";
    footerElement.className = "app-footer";
    footerElement.innerHTML = `
      <div class="footer-container">
        <p class="footer-text">
          &copy; 2026 VPĐKĐĐ TP.HCM - Chi nhánh số 23 &bull; Phần mềm được phát triển bởi <strong>Đỗ Trọng Minh Quân</strong>
        </p>
      </div>
    `;

    document.body.appendChild(footerElement);
  }

  // Khởi chạy cả Header và Footer
  function initLayout() {
    initAppHeader();
    initAppFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLayout);
  } else {
    initLayout();
  }

  // Xuất API toàn cục để các phân hệ và file con dễ dàng kế thừa / gọi lại
  window.FamilyLayout = {
    // Cập nhật tên và chức vụ cán bộ trên toàn bộ Header và Dropdown
    updateUser: function (name, role) {
      const nameEl = document.getElementById("displayUserName");
      const roleEl = document.getElementById("displayUserRole");
      const dropNameEl = document.getElementById("dropdownUserName");
      const dropRoleEl = document.getElementById("dropdownUserRole");
      
      if (nameEl && name) nameEl.textContent = name;
      if (roleEl && role) roleEl.textContent = role;
      if (dropNameEl && name) dropNameEl.textContent = name;
      if (dropRoleEl && role) dropRoleEl.textContent = role;

      // Cập nhật các ID cũ để tương thích ngược các module
      const hName = document.getElementById("headerUserName");
      const hRole = document.getElementById("headerUserRole");
      const itName = document.getElementById("itUserName");
      if (hName && name) hName.textContent = name;
      if (hRole && role) hRole.textContent = role;
      if (itName && name) itName.textContent = name;
    },

    // Hiển thị thanh Cán bộ khi đăng nhập thành công
    showSession: function (user) {
      const headerUserArea = document.getElementById("headerUserArea");
      if (headerUserArea) headerUserArea.style.display = "flex";
      if (user) {
        const name = user.fullname || user.name || user.ho_ten || user.username || "Cán bộ";
        const role = user.position || user.department || user.role || user.chuc_vu || "Chi nhánh 23";
        this.updateUser(name, role);
      }
    },

    // Ẩn thanh Cán bộ (khi về màn hình đăng nhập)
    hideSession: function () {
      const headerUserArea = document.getElementById("headerUserArea");
      if (headerUserArea) headerUserArea.style.display = "none";
      const dropdownWrapper = document.getElementById("topbarUserDropdownWrapper");
      if (dropdownWrapper) dropdownWrapper.classList.remove("is-open");
    },

    // Kích hoạt đăng xuất chủ động từ script
    logout: performLogout,

    // Khởi chạy lại nếu DOM thay đổi hoặc nạp động
    init: initLayout
  };

  // Tương thích ngược với code cũ gọi FamilySidebar
  window.FamilySidebar = window.FamilyLayout;
})();
