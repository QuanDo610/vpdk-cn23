/**
 * =========================================================================
 * AUTH.JS: MODULE BẢO MẬT & RÀO CHẮN TRUY CẬP (ZERO-TRUST ROUTE GUARD)
 * Hệ Thống Web Portal - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23
 * =========================================================================
 */

(function () {
  "use strict";

  // Khóa phiên làm việc chuẩn hóa toàn hệ thống
  const PRIMARY_SESSION_KEY = "family_user";
  const LEGACY_SESSION_KEYS = ["binhduong_user", "vpdk_current_user", "currentUser", "currentStaff"];

  /**
   * Làm sạch chuỗi chống tấn công Cross-Site Scripting (XSS)
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Đọc thông tin cán bộ đăng nhập từ sessionStorage
   * Hỗ trợ tương thích ngược 100% với tất cả các khóa cũ
   */
  function getCurrentUser() {
    try {
      // 1. Kiểm tra khóa chuẩn
      let raw = sessionStorage.getItem(PRIMARY_SESSION_KEY);

      // 2. Dự phòng các khóa cũ nếu có
      if (!raw) {
        for (const k of LEGACY_SESSION_KEYS) {
          raw = sessionStorage.getItem(k);
          if (raw) break;
        }
      }

      if (!raw) return null;

      const user = JSON.parse(raw);
      if (!user || typeof user !== "object") return null;

      // Đồng bộ sang khóa chuẩn và duy trì tương thích ngược
      if (!sessionStorage.getItem(PRIMARY_SESSION_KEY)) {
        sessionStorage.setItem(PRIMARY_SESSION_KEY, JSON.stringify(user));
      }
      return user;
    } catch (e) {
      console.warn("Lỗi đọc phiên làm việc:", e);
      return null;
    }
  }

  /**
   * Kiểm tra trạng thái đã đăng nhập hay chưa
   */
  function isAuthenticated() {
    return getCurrentUser() !== null;
  }

  /**
   * Rào chắn bảo vệ bắt buộc (Route Guard):
   * Nếu chưa đăng nhập, lập tức chuyển hướng về trang chủ đăng nhập.
   * Ngăn chặn 100% việc cán bộ/người ngoài vào thẳng các phân hệ con.
   */
  function requireAuth(redirectUrl = "index.html") {
    if (!isAuthenticated()) {
      // Lưu lại trang đích để sau khi đăng nhập có thể quay lại nếu cần
      try {
        const currentPath = window.location.pathname.split("/").pop();
        if (currentPath && currentPath !== "index.html" && currentPath !== "") {
          sessionStorage.setItem("family_redirect_target", currentPath);
        }
      } catch (e) {}

      window.location.replace(redirectUrl);
      return false;
    }
    return true;
  }

  /**
   * Lưu thông tin cán bộ khi đăng nhập thành công
   */
  function saveUserSession(userObj, rememberAccount = false) {
    if (!userObj) return;

    const standardizedUser = {
      ...userObj,
      username: userObj.username || "",
      fullname: userObj.fullname || userObj.name || userObj.ho_ten || "Cán bộ",
      name: userObj.fullname || userObj.name || userObj.ho_ten || "Cán bộ",
      phone: userObj.phone || userObj.so_dien_thoai || "",
      email: userObj.email || userObj.username || "",
      position: userObj.position || userObj.chuc_vu || "Cán bộ",
      department: userObj.department || userObj.don_vi || "Chi nhánh số 23",
      dept: userObj.department || userObj.don_vi || "Chi nhánh số 23",
      role: userObj.role || "user",
      status: userObj.status || "Đang làm việc"
    };

    const userStr = JSON.stringify(standardizedUser);

    // Lưu vào khóa chuẩn và đồng bộ vào các khóa cũ để tương thích 100%
    sessionStorage.setItem(PRIMARY_SESSION_KEY, userStr);
    sessionStorage.setItem("binhduong_user", userStr);
    sessionStorage.setItem("vpdk_current_user", userStr);
    sessionStorage.setItem("currentUser", userStr);

    // Dọn sạch key rác cũ trong localStorage
    localStorage.removeItem("binhduong_user");
    localStorage.removeItem("vpdk_current_user");

    if (rememberAccount && standardizedUser.username) {
      localStorage.setItem("vpdk_remembered_username", standardizedUser.username);
    } else {
      localStorage.removeItem("vpdk_remembered_username");
    }

    return standardizedUser;
  }

  /**
   * Đăng xuất an toàn: Xóa sạch toàn bộ phiên làm việc
   */
  function logout(redirectUrl = "index.html") {
    try {
      sessionStorage.clear();
      localStorage.removeItem("loginRememberToken");
      localStorage.removeItem("binhduong_user");
      localStorage.removeItem("vpdk_current_user");
    } catch (e) {}

    window.location.replace(redirectUrl);
  }

  // Xuất API toàn cục
  window.FamilyAuth = {
    getUser: getCurrentUser,
    isLoggedIn: isAuthenticated,
    requireAuth: requireAuth,
    saveSession: saveUserSession,
    logout: logout,
    escapeHtml: escapeHtml
  };

  // Hỗ trợ hàm escapeHtml trực tiếp toàn cục nếu chưa có
  if (typeof window.escapeHtml !== "function") {
    window.escapeHtml = escapeHtml;
  }
})();
