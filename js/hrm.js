/**
 * ==============================================================================
 * CỔNG DỊCH VỤ NỘI BỘ VPĐK CHI NHÁNH 23 - "FAMILY CN23"
 * Module Controller: HRM - Tra Cứu Nhân Sự & Danh Bạ Cán Bộ (Sheet TaiKhoan)
 * File: js/hrm.js
 * ==============================================================================
 */

(function () {
  "use strict";

  const DEFAULT_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

  function getScriptUrl() {
    try {
      const saved =
        localStorage.getItem("vpdk_script_url") ||
        localStorage.getItem("CN23_SCRIPT_URL");
      if (saved && saved.startsWith("https://script.google.com/macros/s/")) {
        return saved.trim();
      }
    } catch (e) {}
    return DEFAULT_SCRIPT_URL;
  }

  const SCRIPT_URL = getScriptUrl();

  // Danh sách từ khóa trường nhạy cảm tuyệt đối không lưu và không hiển thị
  const SENSITIVE_FIELD_PATTERN = /cccd|can_cuoc|căn cước|cmnd|password|mat_khau|mật khẩu|^pass$/i;

  // State bất biến từ server & mảng hiển thị
  let rawServerUsers = [];
  let filteredUsers = [];
  let currentViewMode = "grid"; // "grid" | "table"
  let isLoading = false;

  // DOM Cache
  const DOM = {};

  function cacheDOM() {
    DOM.toastContainer = document.getElementById("toastContainer");
    DOM.statTotalUsers = document.getElementById("statTotalUsers");
    DOM.statActiveUsers = document.getElementById("statActiveUsers");
    DOM.statDeptCount = document.getElementById("statDeptCount");
    DOM.statFilteredUsers = document.getElementById("statFilteredUsers");
    DOM.statLastSync = document.getElementById("statLastSync");

    DOM.searchInput = document.getElementById("searchUserInput");
    DOM.btnClearSearch = document.getElementById("btnClearSearch");
    DOM.hrmFilterControls = document.getElementById("hrmFilterControls");
    DOM.filterDeptSelect = document.getElementById("filterDeptSelect");
    DOM.filterStatusField = document.getElementById("filterStatusField");
    DOM.filterStatusSelect = document.getElementById("filterStatusSelect");
    DOM.sortUserSelect = document.getElementById("sortUserSelect");
    DOM.deptPillsContainer = document.getElementById("deptPillsContainer");

    DOM.btnViewGrid = document.getElementById("btnViewGrid");
    DOM.btnViewTable = document.getElementById("btnViewTable");
    DOM.btnRefreshUsers = document.getElementById("btnRefreshUsers");
    DOM.refreshUsersIcon = document.getElementById("refreshUsersIcon");
    DOM.btnExportUsersCsv = document.getElementById("btnExportUsersCsv");
    DOM.btnPrintUsers = document.getElementById("btnPrintUsers");
    DOM.btnRetryFetch = document.getElementById("btnRetryFetch");
    DOM.btnResetFilters = document.getElementById("btnResetFilters");

    DOM.hrmContentArea = document.getElementById("hrmContentArea");
    DOM.hrmLoadingState = document.getElementById("hrmLoadingState");
    DOM.hrmErrorState = document.getElementById("hrmErrorState");
    DOM.hrmErrorMessage = document.getElementById("hrmErrorMessage");
    DOM.hrmEmptyState = document.getElementById("hrmEmptyState");
    DOM.staffCardGrid = document.getElementById("staffCardGrid");
    DOM.staffTableWrapper = document.getElementById("staffTableWrapper");
    DOM.staffTableBody = document.getElementById("staffTableBody");

    DOM.modalStaffDetail = document.getElementById("modalStaffDetail");
    DOM.modalStaffAvatar = document.getElementById("modalStaffAvatar");
    DOM.modalStaffName = document.getElementById("modalStaffName");
    DOM.modalStaffPosition = document.getElementById("modalStaffPosition");
    DOM.modalStaffBody = document.getElementById("modalStaffBody");
    DOM.btnCloseDetailModal = document.getElementById("btnCloseDetailModal");
    DOM.btnModalCloseFooter = document.getElementById("btnModalCloseFooter");
  }

  // ==================== TIỆN ÍCH AN TOÀN & CHUẨN HÓA ====================
  function escapeHtml(str) {
    if (typeof FamilyAuth !== "undefined" && typeof FamilyAuth.escapeHtml === "function") {
      return FamilyAuth.escapeHtml(str);
    }
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function removeVietnameseTones(str) {
    if (!str) return "";
    return String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .trim();
  }

  function debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function showToast(message, type = "info") {
    if (!DOM.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✓" : type === "error" ? "✗" : "ℹ";
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${escapeHtml(message)}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("hidden");
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  function getInitials(fullname) {
    const clean = (fullname || "").trim();
    if (!clean) return "CB";
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function isInactiveStatus(statusText) {
    const st = removeVietnameseTones(statusText);
    return st.includes("da nghi") || st.includes("nghi viec") || st.includes("thoi viec");
  }

  function normalizePhoneDigits(phone) {
    if (!phone) return "";
    return String(phone).replace(/^'+/, "").replace(/[\s.\-]+/g, "").replace(/^0+/, "");
  }

  function getSessionUser() {
    try {
      if (typeof FamilyAuth !== "undefined" && typeof FamilyAuth.getUser === "function") {
        return FamilyAuth.getUser();
      }
      const raw = sessionStorage.getItem("family_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Phân quyền xem trạng thái nghỉ việc:
   * CHỈ IT (quandtm/admin), Giám đốc, và Nguyễn Thị Bích Tuyền mới được xem nhân sự đã nghỉ.
   * Tất cả cán bộ còn lại chỉ xem danh sách đang làm việc.
   */
  function canViewInactiveStaff(user) {
    if (!user || typeof user !== "object") return false;
    const username = String(user.username || "").trim().toLowerCase();
    const fullname = removeVietnameseTones(user.fullname || user.name || user.ho_ten || "");
    const position = removeVietnameseTones(user.position || user.chuc_vu || "");
    const phone = normalizePhoneDigits(user.phone || user.so_dien_thoai || "");
    const email = String(user.email || "").trim().toLowerCase();

    // 1. IT Quản trị viên (Đỗ Trọng Minh Quân / quandtm / admin)
    if (
      username === "quandtm" ||
      username === "admin" ||
      phone === "973807027" ||
      email === "quan.vpdk@gmail.com" ||
      fullname.includes("do trong minh quan") ||
      position.includes("quan tri vien it") ||
      position.includes("it admin")
    ) {
      return true;
    }

    // 2. Giám đốc Chi nhánh (không bao gồm Phó Giám đốc)
    if (
      (position.includes("giam doc") && !position.includes("pho")) ||
      fullname.includes("nguyen chien thang") ||
      username === "thangnc"
    ) {
      return true;
    }

    // 3. Nguyễn Thị Bích Tuyền
    if (
      username === "tuyenntb" ||
      phone === "909736435" ||
      fullname.includes("nguyen thi bich tuyen")
    ) {
      return true;
    }

    return false;
  }

  function updateStatusFilterVisibility() {
    const canViewInactive = canViewInactiveStaff(getSessionUser());
    if (DOM.filterStatusField) {
      DOM.filterStatusField.classList.toggle("hidden", !canViewInactive);
    }
    if (DOM.hrmFilterControls) {
      DOM.hrmFilterControls.classList.toggle("no-status-filter", !canViewInactive);
    }
    if (!canViewInactive && DOM.filterStatusSelect) {
      DOM.filterStatusSelect.value = "ACTIVE";
    } else if (canViewInactive && DOM.filterStatusSelect && !DOM.filterStatusSelect.value) {
      DOM.filterStatusSelect.value = "ALL";
    }
    return canViewInactive;
  }

  function getPositionPriority(positionText) {
    const p = removeVietnameseTones(positionText);
    if (p.includes("giam doc") && !p.includes("pho")) return 1;
    if (p.includes("pho giam doc")) return 2;
    if (p.includes("to truong") || p.includes("truong phong")) return 3;
    if (p.includes("to pho") || p.includes("pho phong")) return 4;
    return 5;
  }

  /**
   * Làm sạch từng bản ghi từ API getUsers:
   * Tuyệt đối loại bỏ mọi trường liên quan đến CCCD, CMND, mật khẩu.
   */
  function sanitizeUserRecord(raw, idx) {
    if (!raw || typeof raw !== "object") return null;

    const cleanExtraFields = [];
    if (Array.isArray(raw.extraFields)) {
      raw.extraFields.forEach((field) => {
        if (!field || !field.label) return;
        const labelStr = String(field.label).trim();
        const valStr = String(field.value || "").trim();
        if (!labelStr || !valStr) return;
        if (SENSITIVE_FIELD_PATTERN.test(labelStr)) return;
        cleanExtraFields.push({ label: labelStr, value: valStr });
      });
    }

    // Thu thập thêm các thuộc tính mở rộng an toàn nếu backend trả trực tiếp
    const reservedKeys = new Set([
      "fullname",
      "name",
      "ho_ten",
      "username",
      "position",
      "chuc_vu",
      "phone",
      "so_dien_thoai",
      "department",
      "dept",
      "don_vi",
      "status",
      "role",
      "createddate",
      "email",
      "extrafields"
    ]);
    Object.keys(raw).forEach((key) => {
      if (SENSITIVE_FIELD_PATTERN.test(key)) return;
      if (reservedKeys.has(key.toLowerCase())) return;
      const val = raw[key];
      if (val !== null && val !== undefined && typeof val !== "object") {
        const strVal = String(val).trim();
        if (strVal) {
          cleanExtraFields.push({ label: key, value: strVal });
        }
      }
    });

    const fullname = String(raw.fullname || raw.name || raw.ho_ten || "").trim();
    const username = String(raw.username || "").trim();
    const phone = String(raw.phone || raw.so_dien_thoai || "").replace(/^'+/, "").trim();
    if (!fullname && !username && !phone) return null;

    const position = String(raw.position || raw.chuc_vu || "Cán bộ").trim() || "Cán bộ";
    const department = String(raw.department || raw.dept || raw.don_vi || "Chi nhánh số 23").trim() || "Chi nhánh số 23";
    const status = String(raw.status || "Đang làm việc").trim() || "Đang làm việc";
    const roleRaw = String(raw.role || "user").trim().toLowerCase();
    const role = roleRaw.includes("admin") ? "admin" : "user";
    const createdDate = String(raw.createdDate || "").trim();
    const email = String(raw.email || "").trim();

    return {
      uid: `USR_${idx}`,
      fullname: fullname || username || "Cán bộ",
      username: username,
      position: position,
      department: department,
      phone: phone,
      status: status,
      role: role,
      createdDate: createdDate,
      email: email,
      extraFields: cleanExtraFields,
      // Các trường chuẩn hóa phục vụ tìm kiếm nhanh
      _searchText: removeVietnameseTones(`${fullname} ${username} ${position} ${department}`)
    };
  }

  // ==================== TẢI DỮ LIỆU TỪ SHEET TAIKHOAN ====================
  async function loadUsers(isManualRefresh = false) {
    if (isLoading) return;
    isLoading = true;
    setViewState("loading");
    if (DOM.refreshUsersIcon) {
      DOM.refreshUsersIcon.classList.add("fa-spin");
    }

    try {
      const viewer = getSessionUser();
      const canViewInactive = updateStatusFilterVisibility();
      const viewerParams = viewer
        ? `&scope=hrm&viewerUsername=${encodeURIComponent(viewer.username || "")}&viewerPhone=${encodeURIComponent(viewer.phone || "")}&viewerFullname=${encodeURIComponent(viewer.fullname || viewer.name || "")}`
        : "&scope=hrm";

      const res = await fetch(`${SCRIPT_URL}?action=getUsers&t=${Date.now()}${viewerParams}`);
      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${res.status}`);
      }
      const payload = await res.json();
      if (!payload || !payload.success || !Array.isArray(payload.data)) {
        throw new Error((payload && payload.message) || "Dữ liệu Sheet TaiKhoan không hợp lệ.");
      }

      const sanitized = payload.data
        .map((item, idx) => sanitizeUserRecord(item, idx))
        .filter(Boolean)
        .filter((u) => canViewInactive || !isInactiveStatus(u.status));

      rawServerUsers = sanitized;
      buildDepartmentControls(rawServerUsers);
      applyFilters();

      if (DOM.statLastSync) {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        DOM.statLastSync.textContent = `Cập nhật lúc ${hh}:${mm}`;
      }

      if (isManualRefresh) {
        showToast(`Đã đồng bộ ${rawServerUsers.length} cán bộ từ Sheet TaiKhoan.`, "success");
      }
    } catch (err) {
      console.error("Lỗi tải danh sách nhân sự:", err);
      if (DOM.hrmErrorMessage) {
        DOM.hrmErrorMessage.textContent =
          err && err.message
            ? `Chi tiết: ${err.message}`
            : "Không thể kết nối đến Google Sheets. Vui lòng thử lại.";
      }
      setViewState("error");
    } finally {
      isLoading = false;
      if (DOM.refreshUsersIcon) {
        DOM.refreshUsersIcon.classList.remove("fa-spin");
      }
    }
  }

  // ==================== XÂY DỰNG BỘ LỌC PHÒNG BAN ĐỘNG ====================
  function buildDepartmentControls(users) {
    const deptCounts = new Map();
    users.forEach((u) => {
      const dept = u.department || "Chi nhánh số 23";
      deptCounts.set(dept, (deptCounts.get(dept) || 0) + 1);
    });

    const sortedDepts = Array.from(deptCounts.keys()).sort((a, b) =>
      a.localeCompare(b, "vi")
    );

    // 1. Cập nhật Select Dropdown Phòng ban
    if (DOM.filterDeptSelect) {
      const prevVal = DOM.filterDeptSelect.value || "ALL";
      let optionsHtml = `<option value="ALL">-- Tất cả phòng ban (${users.length}) --</option>`;
      sortedDepts.forEach((dept) => {
        const count = deptCounts.get(dept) || 0;
        optionsHtml += `<option value="${escapeHtml(dept)}">${escapeHtml(dept)} (${count})</option>`;
      });
      DOM.filterDeptSelect.innerHTML = optionsHtml;
      if (prevVal === "ALL" || deptCounts.has(prevVal)) {
        DOM.filterDeptSelect.value = prevVal;
      } else {
        DOM.filterDeptSelect.value = "ALL";
      }
    }

    // 2. Cập nhật Quick Pills Phòng ban
    if (DOM.deptPillsContainer) {
      const activeDept = DOM.filterDeptSelect ? DOM.filterDeptSelect.value : "ALL";
      let pillsHtml = `
        <span class="hrm-dept-pills-label">
          <i class="fa-solid fa-filter"></i> Lọc nhanh phòng ban:
        </span>
        <button type="button" class="hrm-dept-pill ${activeDept === "ALL" ? "active" : ""}" data-dept="ALL">
          <span>Tất cả</span>
          <span class="hrm-dept-pill-count">${users.length}</span>
        </button>
      `;
      sortedDepts.forEach((dept) => {
        const count = deptCounts.get(dept) || 0;
        const isActive = activeDept === dept ? "active" : "";
        pillsHtml += `
          <button type="button" class="hrm-dept-pill ${isActive}" data-dept="${escapeHtml(dept)}">
            <span>${escapeHtml(dept)}</span>
            <span class="hrm-dept-pill-count">${count}</span>
          </button>
        `;
      });
      DOM.deptPillsContainer.innerHTML = pillsHtml;
    }

    // Cập nhật KPI tổng quan
    const activeCount = users.filter((u) => !isInactiveStatus(u.status)).length;
    if (DOM.statTotalUsers) DOM.statTotalUsers.textContent = String(users.length);
    if (DOM.statActiveUsers) DOM.statActiveUsers.textContent = String(activeCount);
    if (DOM.statDeptCount) DOM.statDeptCount.textContent = String(sortedDepts.length);
  }

  function syncActiveDeptPill(selectedDept) {
    if (!DOM.deptPillsContainer) return;
    const pills = DOM.deptPillsContainer.querySelectorAll("[data-dept]");
    pills.forEach((pill) => {
      if (pill.dataset.dept === selectedDept) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  // ==================== LỌC, SẮP XẾP & HIỂN THỊ ====================
  function applyFilters() {
    const queryRaw = DOM.searchInput ? DOM.searchInput.value.trim() : "";
    const queryNorm = removeVietnameseTones(queryRaw);
    const deptVal = DOM.filterDeptSelect ? DOM.filterDeptSelect.value : "ALL";
    const statusVal = DOM.filterStatusSelect ? DOM.filterStatusSelect.value : "ALL";
    const sortVal = DOM.sortUserSelect ? DOM.sortUserSelect.value : "SMART";

    if (DOM.btnClearSearch) {
      if (queryRaw.length > 0) {
        DOM.btnClearSearch.classList.remove("hidden");
      } else {
        DOM.btnClearSearch.classList.add("hidden");
      }
    }

    syncActiveDeptPill(deptVal);

    // Lọc trên bản sao, bảo toàn mảng rawServerUsers
    const nextList = rawServerUsers.filter((u) => {
      if (deptVal !== "ALL" && u.department !== deptVal) {
        return false;
      }

      const inactive = isInactiveStatus(u.status);
      if (statusVal === "ACTIVE" && inactive) return false;
      if (statusVal === "INACTIVE" && !inactive) return false;

      if (queryNorm) {
        const nameNorm = removeVietnameseTones(u.fullname);
        const userNorm = removeVietnameseTones(u.username);
        const deptNorm = removeVietnameseTones(u.department);
        const posNorm = removeVietnameseTones(u.position);
        const matched =
          nameNorm.includes(queryNorm) ||
          userNorm.includes(queryNorm) ||
          deptNorm.includes(queryNorm) ||
          posNorm.includes(queryNorm);
        if (!matched) return false;
      }

      return true;
    });

    // Sắp xếp danh sách hiển thị
    nextList.sort((a, b) => {
      if (sortVal === "NAME_ASC") {
        return a.fullname.localeCompare(b.fullname, "vi");
      }
      if (sortVal === "NAME_DESC") {
        return b.fullname.localeCompare(a.fullname, "vi");
      }
      if (sortVal === "DEPT_ASC") {
        const dCmp = a.department.localeCompare(b.department, "vi");
        return dCmp !== 0 ? dCmp : a.fullname.localeCompare(b.fullname, "vi");
      }

      // SMART: Đang làm việc trước -> Cấp lãnh đạo trước -> Phòng ban -> Tên A-Z
      const aInactive = isInactiveStatus(a.status) ? 1 : 0;
      const bInactive = isInactiveStatus(b.status) ? 1 : 0;
      if (aInactive !== bInactive) return aInactive - bInactive;

      const aPrio = getPositionPriority(a.position);
      const bPrio = getPositionPriority(b.position);
      if (aPrio !== bPrio) return aPrio - bPrio;

      const deptCmp = a.department.localeCompare(b.department, "vi");
      if (deptCmp !== 0) return deptCmp;

      return a.fullname.localeCompare(b.fullname, "vi");
    });

    filteredUsers = nextList;
    if (DOM.statFilteredUsers) {
      DOM.statFilteredUsers.textContent = String(filteredUsers.length);
    }

    renderCurrentView();
  }

  function setViewState(state) {
    if (!DOM.hrmLoadingState || !DOM.hrmErrorState || !DOM.hrmEmptyState) return;
    DOM.hrmLoadingState.classList.add("hidden");
    DOM.hrmErrorState.classList.add("hidden");
    DOM.hrmEmptyState.classList.add("hidden");
    if (DOM.staffCardGrid) DOM.staffCardGrid.classList.add("hidden");
    if (DOM.staffTableWrapper) DOM.staffTableWrapper.classList.add("hidden");

    if (state === "loading") {
      DOM.hrmLoadingState.classList.remove("hidden");
    } else if (state === "error") {
      DOM.hrmErrorState.classList.remove("hidden");
    } else if (state === "empty") {
      DOM.hrmEmptyState.classList.remove("hidden");
    } else if (state === "ready") {
      if (currentViewMode === "table") {
        if (DOM.staffTableWrapper) DOM.staffTableWrapper.classList.remove("hidden");
      } else {
        if (DOM.staffCardGrid) DOM.staffCardGrid.classList.remove("hidden");
      }
    }
  }

  function renderCurrentView() {
    if (filteredUsers.length === 0) {
      setViewState("empty");
      return;
    }

    setViewState("ready");
    if (currentViewMode === "table") {
      renderTableView(filteredUsers);
    } else {
      renderCardGridView(filteredUsers);
    }
  }

  function renderCardGridView(users) {
    if (!DOM.staffCardGrid) return;

    const html = users
      .map((u) => {
        const inactive = isInactiveStatus(u.status);
        const isLeader = getPositionPriority(u.position) <= 4;
        const initials = escapeHtml(getInitials(u.fullname));
        const statusBadgeClass = inactive ? "badge-danger" : "badge-success";
        const roleLabel = u.role === "admin" ? "Quản trị viên" : "Cán bộ";
        const roleBadgeClass = u.role === "admin" ? "badge-warning" : "badge-info";

        const phoneHtml = u.phone
          ? `<a href="tel:${escapeHtml(u.phone)}" class="hrm-phone-link">${escapeHtml(u.phone)}</a>`
          : `<span class="text-slate-400">Chưa cập nhật</span>`;

        const copyBtnHtml = u.phone
          ? `<button type="button" class="hrm-copy-mini-btn no-print" data-action="copy-phone" data-phone="${escapeHtml(u.phone)}" title="Sao chép số điện thoại">
               <i class="fa-regular fa-copy"></i>
               <span>Sao chép</span>
             </button>`
          : "";

        const emailRowHtml = u.email
          ? `<div class="hrm-card-meta-item">
               <div class="hrm-card-meta-left">
                 <i class="fa-solid fa-envelope"></i>
                 <span class="hrm-card-meta-text" title="${escapeHtml(u.email)}">${escapeHtml(u.email)}</span>
               </div>
             </div>`
          : "";

        const createdRowHtml = u.createdDate
          ? `<div class="hrm-card-meta-item">
               <div class="hrm-card-meta-left">
                 <i class="fa-regular fa-calendar-check"></i>
                 <span class="hrm-card-meta-text">Ngày tạo: ${escapeHtml(u.createdDate)}</span>
               </div>
             </div>`
          : "";

        return `
          <article class="hrm-staff-card ${isLeader ? "is-leader" : ""} ${inactive ? "is-inactive" : ""}">
            <div class="hrm-card-top">
              <div class="hrm-avatar">
                <span>${initials}</span>
                <span class="hrm-avatar-status-dot ${inactive ? "dot-inactive" : ""}" title="${escapeHtml(u.status)}"></span>
              </div>
              <div class="hrm-card-identity">
                <h3 class="hrm-staff-name">${escapeHtml(u.fullname)}</h3>
                <div class="hrm-card-subrow">
                  ${u.username ? `<span class="hrm-username-pill">@${escapeHtml(u.username)}</span>` : ""}
                  <span class="hrm-position-tag">
                    ${isLeader ? '<i class="fa-solid fa-award"></i>' : '<i class="fa-solid fa-id-badge"></i>'}
                    <span>${escapeHtml(u.position)}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="hrm-card-meta-list">
              <div class="hrm-card-meta-item">
                <div class="hrm-card-meta-left">
                  <i class="fa-solid fa-building-user"></i>
                  <span class="hrm-card-meta-text" title="${escapeHtml(u.department)}">${escapeHtml(u.department)}</span>
                </div>
              </div>

              <div class="hrm-card-meta-item">
                <div class="hrm-card-meta-left">
                  <i class="fa-solid fa-phone"></i>
                  ${phoneHtml}
                </div>
                ${copyBtnHtml}
              </div>

              ${emailRowHtml}
              ${createdRowHtml}
            </div>

            <div class="hrm-card-footer">
              <div class="hrm-card-badges">
                <span class="badge ${statusBadgeClass}">${escapeHtml(u.status)}</span>
                <span class="badge ${roleBadgeClass}">${escapeHtml(roleLabel)}</span>
              </div>
              <button type="button" class="hrm-detail-btn no-print" data-action="view-detail" data-uid="${escapeHtml(u.uid)}">
                <i class="fa-solid fa-circle-info"></i>
                <span>Chi tiết</span>
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    DOM.staffCardGrid.innerHTML = html;
  }

  function renderTableView(users) {
    if (!DOM.staffTableBody) return;

    const html = users
      .map((u, idx) => {
        const inactive = isInactiveStatus(u.status);
        const initials = escapeHtml(getInitials(u.fullname));
        const statusBadgeClass = inactive ? "badge-danger" : "badge-success";
        const roleLabel = u.role === "admin" ? "Quản trị viên" : "Cán bộ";
        const roleBadgeClass = u.role === "admin" ? "badge-warning" : "badge-info";

        const phoneCellHtml = u.phone
          ? `<div class="hrm-table-phone-wrap">
               <a href="tel:${escapeHtml(u.phone)}" class="hrm-phone-link">${escapeHtml(u.phone)}</a>
               <button type="button" class="hrm-copy-mini-btn no-print" data-action="copy-phone" data-phone="${escapeHtml(u.phone)}" title="Sao chép SĐT">
                 <i class="fa-regular fa-copy"></i>
               </button>
             </div>`
          : `<span class="text-slate-400">Chưa cập nhật</span>`;

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <div class="hrm-table-name-cell">
                <div class="hrm-table-avatar">${initials}</div>
                <div>
                  <div class="hrm-table-fullname">${escapeHtml(u.fullname)}</div>
                  ${u.username ? `<div class="hrm-table-username">@${escapeHtml(u.username)}</div>` : ""}
                </div>
              </div>
            </td>
            <td><strong>${escapeHtml(u.position)}</strong></td>
            <td>${escapeHtml(u.department)}</td>
            <td>${phoneCellHtml}</td>
            <td><span class="badge ${roleBadgeClass}">${escapeHtml(roleLabel)}</span></td>
            <td><span class="badge ${statusBadgeClass}">${escapeHtml(u.status)}</span></td>
            <td>${u.createdDate ? escapeHtml(u.createdDate) : "-"}</td>
            <td class="no-print">
              <button type="button" class="hrm-detail-btn" data-action="view-detail" data-uid="${escapeHtml(u.uid)}">
                <i class="fa-solid fa-eye"></i>
                <span>Xem</span>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");

    DOM.staffTableBody.innerHTML = html;
  }

  function switchViewMode(mode) {
    currentViewMode = mode === "table" ? "table" : "grid";
    if (DOM.btnViewGrid && DOM.btnViewTable) {
      DOM.btnViewGrid.classList.toggle("active", currentViewMode === "grid");
      DOM.btnViewTable.classList.toggle("active", currentViewMode === "table");
    }
    if (rawServerUsers.length > 0) {
      renderCurrentView();
    }
  }

  // ==================== MODAL HỒ SƠ CHI TIẾT CÁN BỘ ====================
  function openStaffDetail(uid) {
    const user = rawServerUsers.find((u) => u.uid === uid);
    if (!user || !DOM.modalStaffDetail) return;

    if (DOM.modalStaffAvatar) DOM.modalStaffAvatar.textContent = getInitials(user.fullname);
    if (DOM.modalStaffName) DOM.modalStaffName.textContent = user.fullname;
    if (DOM.modalStaffPosition) {
      DOM.modalStaffPosition.textContent = `${user.position} • ${user.department}`;
    }

    const inactive = isInactiveStatus(user.status);
    const statusBadgeClass = inactive ? "badge-danger" : "badge-success";
    const roleLabel = user.role === "admin" ? "Quản trị viên hệ thống" : "Cán bộ chuyên môn";

    const phoneTileContent = user.phone
      ? `<a href="tel:${escapeHtml(user.phone)}" class="hrm-phone-link">${escapeHtml(user.phone)}</a>
         <button type="button" class="hrm-copy-mini-btn" data-action="copy-phone" data-phone="${escapeHtml(user.phone)}">
           <i class="fa-regular fa-copy"></i>
           <span>Sao chép</span>
         </button>`
      : `<span class="text-slate-400">Chưa cập nhật</span>`;

    const extraTilesHtml = (user.extraFields || [])
      .map(
        (field) => `
          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-circle-info"></i>
              <span>${escapeHtml(field.label)}</span>
            </div>
            <div class="hrm-detail-value">${escapeHtml(field.value)}</div>
          </div>
        `
      )
      .join("");

    const emailTileHtml = user.email
      ? `<div class="hrm-detail-tile is-full">
           <div class="hrm-detail-label">
             <i class="fa-solid fa-envelope"></i>
             <span>Email liên hệ</span>
           </div>
           <div class="hrm-detail-value">${escapeHtml(user.email)}</div>
         </div>`
      : "";

    if (DOM.modalStaffBody) {
      DOM.modalStaffBody.innerHTML = `
        <div class="hrm-detail-grid">
          <div class="hrm-detail-tile is-full">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-building-user"></i>
              <span>Đơn vị / Phòng ban công tác</span>
            </div>
            <div class="hrm-detail-value">${escapeHtml(user.department)}</div>
          </div>

          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-id-badge"></i>
              <span>Chức danh / Chức vụ</span>
            </div>
            <div class="hrm-detail-value">${escapeHtml(user.position)}</div>
          </div>

          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-at"></i>
              <span>Tên đăng nhập (Username)</span>
            </div>
            <div class="hrm-detail-value">
              <span class="hrm-username-pill">${user.username ? "@" + escapeHtml(user.username) : "Chưa có"}</span>
            </div>
          </div>

          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-phone"></i>
              <span>Số điện thoại liên hệ</span>
            </div>
            <div class="hrm-detail-value">${phoneTileContent}</div>
          </div>

          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-circle-dot"></i>
              <span>Trạng thái công tác</span>
            </div>
            <div class="hrm-detail-value">
              <span class="badge ${statusBadgeClass}">${escapeHtml(user.status)}</span>
            </div>
          </div>

          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-solid fa-user-shield"></i>
              <span>Vai trò trên cổng</span>
            </div>
            <div class="hrm-detail-value">${escapeHtml(roleLabel)}</div>
          </div>

          <div class="hrm-detail-tile">
            <div class="hrm-detail-label">
              <i class="fa-regular fa-calendar-check"></i>
              <span>Ngày tạo tài khoản</span>
            </div>
            <div class="hrm-detail-value">${user.createdDate ? escapeHtml(user.createdDate) : "Chưa ghi nhận"}</div>
          </div>

          ${emailTileHtml}
          ${extraTilesHtml}
        </div>

        <div class="hrm-privacy-note">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Dữ liệu đồng bộ từ Sheet TaiKhoan. Thông tin định danh cá nhân nhạy cảm được bảo vệ và không hiển thị công khai.</span>
        </div>
      `;
    }

    DOM.modalStaffDetail.classList.remove("hidden");
  }

  function closeStaffDetail() {
    if (DOM.modalStaffDetail) {
      DOM.modalStaffDetail.classList.add("hidden");
    }
  }

  // ==================== SAO CHÉP & XUẤT EXCEL (CSV) ====================
  function copyPhoneNumber(phone) {
    if (!phone) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(phone)
        .then(() => showToast(`Đã sao chép số điện thoại: ${phone}`, "success"))
        .catch(() => fallbackCopy(phone));
    } else {
      fallbackCopy(phone);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.className = "sr-only";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(`Đã sao chép số điện thoại: ${text}`, "success");
    } catch (e) {
      showToast("Không thể sao chép tự động!", "error");
    }
    document.body.removeChild(ta);
  }

  function sanitizeCsvCell(val) {
    let str = val === null || val === undefined ? "" : String(val);
    if (/^[=+\-@]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  }

  function exportFilteredUsersCsv() {
    if (!filteredUsers.length) {
      showToast("Không có dữ liệu để xuất Excel!", "error");
      return;
    }

    const headers = [
      "STT",
      "Họ và tên",
      "Username",
      "Chức danh / Chức vụ",
      "Đơn vị / Bộ phận",
      "Số điện thoại",
      "Vai trò",
      "Trạng thái",
      "Ngày tạo"
    ];

    const rows = filteredUsers.map((u, idx) => [
      idx + 1,
      u.fullname,
      u.username,
      u.position,
      u.department,
      u.phone,
      u.role === "admin" ? "Quản trị viên" : "Cán bộ",
      u.status,
      u.createdDate
    ]);

    const csvLines = [
      headers.map(sanitizeCsvCell).join(","),
      ...rows.map((r) => r.map(sanitizeCsvCell).join(","))
    ];

    const csvContent = "\uFEFF" + csvLines.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

    link.href = url;
    link.download = `Danh_Ba_Nhan_Su_CN23_${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Đã xuất ${filteredUsers.length} hồ sơ cán bộ ra file CSV.`, "success");
  }

  function resetAllFilters() {
    if (DOM.searchInput) DOM.searchInput.value = "";
    if (DOM.filterDeptSelect) DOM.filterDeptSelect.value = "ALL";
    if (DOM.filterStatusSelect) {
      DOM.filterStatusSelect.value = canViewInactiveStaff(getSessionUser()) ? "ALL" : "ACTIVE";
    }
    if (DOM.sortUserSelect) DOM.sortUserSelect.value = "SMART";
    applyFilters();
  }

  // ==================== GÁN SỰ KIỆN (EVENT DELEGATION) ====================
  function bindEvents() {
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener(
        "input",
        debounce(() => applyFilters(), 300)
      );
    }

    if (DOM.btnClearSearch) {
      DOM.btnClearSearch.addEventListener("click", () => {
        if (DOM.searchInput) {
          DOM.searchInput.value = "";
          DOM.searchInput.focus();
        }
        applyFilters();
      });
    }

    if (DOM.filterDeptSelect) {
      DOM.filterDeptSelect.addEventListener("change", applyFilters);
    }
    if (DOM.filterStatusSelect) {
      DOM.filterStatusSelect.addEventListener("change", applyFilters);
    }
    if (DOM.sortUserSelect) {
      DOM.sortUserSelect.addEventListener("change", applyFilters);
    }

    if (DOM.deptPillsContainer) {
      DOM.deptPillsContainer.addEventListener("click", (e) => {
        const pill = e.target.closest("[data-dept]");
        if (!pill) return;
        const selectedDept = pill.dataset.dept || "ALL";
        if (DOM.filterDeptSelect) {
          DOM.filterDeptSelect.value = selectedDept;
        }
        applyFilters();
      });
    }

    if (DOM.btnViewGrid) {
      DOM.btnViewGrid.addEventListener("click", () => switchViewMode("grid"));
    }
    if (DOM.btnViewTable) {
      DOM.btnViewTable.addEventListener("click", () => switchViewMode("table"));
    }

    if (DOM.btnRefreshUsers) {
      DOM.btnRefreshUsers.addEventListener("click", () => loadUsers(true));
    }
    if (DOM.btnRetryFetch) {
      DOM.btnRetryFetch.addEventListener("click", () => loadUsers(true));
    }
    if (DOM.btnResetFilters) {
      DOM.btnResetFilters.addEventListener("click", resetAllFilters);
    }
    if (DOM.btnExportUsersCsv) {
      DOM.btnExportUsersCsv.addEventListener("click", exportFilteredUsersCsv);
    }
    if (DOM.btnPrintUsers) {
      DOM.btnPrintUsers.addEventListener("click", () => window.print());
    }

    // Event Delegation trên danh sách thẻ & bảng
    if (DOM.hrmContentArea) {
      DOM.hrmContentArea.addEventListener("click", (e) => {
        const actionBtn = e.target.closest("[data-action]");
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        if (action === "copy-phone") {
          copyPhoneNumber(actionBtn.dataset.phone);
        } else if (action === "view-detail") {
          openStaffDetail(actionBtn.dataset.uid);
        }
      });
    }

    // Event Delegation trong Modal chi tiết
    if (DOM.modalStaffDetail) {
      DOM.modalStaffDetail.addEventListener("click", (e) => {
        if (e.target === DOM.modalStaffDetail) {
          closeStaffDetail();
          return;
        }
        const actionBtn = e.target.closest("[data-action]");
        if (actionBtn && actionBtn.dataset.action === "copy-phone") {
          copyPhoneNumber(actionBtn.dataset.phone);
        }
      });
    }

    if (DOM.btnCloseDetailModal) {
      DOM.btnCloseDetailModal.addEventListener("click", closeStaffDetail);
    }
    if (DOM.btnModalCloseFooter) {
      DOM.btnModalCloseFooter.addEventListener("click", closeStaffDetail);
    }

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        DOM.modalStaffDetail &&
        !DOM.modalStaffDetail.classList.contains("hidden")
      ) {
        closeStaffDetail();
      }
    });
  }

  // ==================== KHỞI CHẠY MODULE ====================
  document.addEventListener("DOMContentLoaded", () => {
    cacheDOM();
    updateStatusFilterVisibility();
    bindEvents();
    loadUsers(false);
  });

  // API công khai cho kiểm thử & tích hợp
  window.FamilyHRM = {
    loadUsers: loadUsers,
    applyFilters: applyFilters,
    switchViewMode: switchViewMode,
    openStaffDetail: openStaffDetail,
    closeStaffDetail: closeStaffDetail,
    sanitizeUserRecord: sanitizeUserRecord,
    canViewInactiveStaff: canViewInactiveStaff,
    setUsersForTest: function (list) {
      const canViewInactive = updateStatusFilterVisibility();
      rawServerUsers = (Array.isArray(list) ? list : [])
        .map((item, idx) => sanitizeUserRecord(item, idx))
        .filter(Boolean)
        .filter((u) => canViewInactive || !isInactiveStatus(u.status));
      buildDepartmentControls(rawServerUsers);
      applyFilters();
    },
    getFilteredUsers: function () {
      return [...filteredUsers];
    },
    getRawUsers: function () {
      return [...rawServerUsers];
    }
  };
})();
