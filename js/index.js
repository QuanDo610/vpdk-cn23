/**
 * Escape HTML chống XSS
 */
function escapeHtml(str) {
  if (typeof FamilyAuth !== 'undefined' && FamilyAuth.escapeHtml) {
    return FamilyAuth.escapeHtml(str);
  }
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * ==============================================================================
 * CỔNG DỊCH VỤ NỘI BỘ VPĐK CHI NHÁNH 23 - "FAMILY CN23"
 * Module Controller: Cổng Dịch Vụ & Đăng Nhập Hệ Thống (Hub)
 * File: js/index.js
 * ==============================================================================
 */

// Endpoint kết nối trực tiếp đến Google Apps Script & Google Sheets
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === "success" ? "✓" : (type === "error" ? "✗" : "ℹ")}</span><span class="toast-message">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==================== CẬP NHẬT THỜI GIAN & LỜI CHÀO ====================
function updateCurrentDate() {
  const now = new Date();
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const el = document.getElementById("hubCurrentDate");
  if (el) el.textContent = `${days[now.getDay()]}, ${dd}/${mm}/${yyyy}`;
}

function updateTimeGreeting() {
  const hour = new Date().getHours();
  const greetingEl = document.getElementById("hubTimeGreeting");
  const iconEl = document.getElementById("hubTimeIcon");
  const subEl = document.getElementById("hubGreetingSub");

  let greetingText = "Chào buổi sáng / Good morning";
  let iconHtml = '<i class="fa-solid fa-sun text-amber-500"></i>';
  let subText = "Chúc đồng chí một ngày mới tràn đầy năng lượng và làm việc hiệu quả!";

  if (hour >= 12 && hour < 18) {
    greetingText = "Chào buổi chiều / Good afternoon";
    iconHtml = '<i class="fa-solid fa-cloud-sun text-sky-400"></i>';
    subText = "Chúc đồng chí buổi chiều làm việc tập trung, thuận lợi và hoàn thành tốt nhiệm vụ!";
  } else if (hour >= 18 || hour < 5) {
    greetingText = "Chào buổi tối / Good evening";
    iconHtml = '<i class="fa-solid fa-moon text-purple-400"></i>';
    subText = "Chúc đồng chí buổi tối bình an, thư thái bên gia đình sau ngày làm việc cống hiến!";
  }

  if (greetingEl) greetingEl.textContent = greetingText;
  if (iconEl) iconEl.innerHTML = iconHtml;
  if (subEl) subEl.textContent = subText;
}

// ==================== QUẢN LÝ DANH NGÔN VĨ NHÂN ====================
let currentQuoteIndex = -1;

function renderQuote(index, animate = false) {
  const quotes = window.QUOTES_DATA || [];
  if (!quotes.length) return;
  if (index < 0 || index >= quotes.length) {
    index = Math.floor(Math.random() * quotes.length);
  }
  currentQuoteIndex = index;
  const q = quotes[index];

  const bodyEl = document.getElementById("quoteBodyContent");
  if (animate && bodyEl) {
    bodyEl.style.opacity = "0.2";
  }

  setTimeout(() => {
    const textVi = document.getElementById("quoteTextVi");
    const textEn = document.getElementById("quoteTextEn");
    const authorName = document.getElementById("quoteAuthorName");
    const authorEra = document.getElementById("quoteAuthorEra");
    const authorTitle = document.getElementById("quoteAuthorTitle");
    const category = document.getElementById("quoteCategory");
    const source = document.getElementById("quoteSource");
    const indexBadge = document.getElementById("quoteIndexBadge");

    if (textVi) textVi.textContent = `"${q.quote_vi}"`;
    if (textEn) textEn.textContent = q.quote_en ? `"${q.quote_en}"` : "";
    if (authorName) authorName.textContent = q.author;
    if (authorEra) authorEra.textContent = q.era ? `(${q.era})` : "";
    if (authorTitle) authorTitle.textContent = q.author_title || "Danh nhân thế giới";
    if (category) category.textContent = q.category || "Danh ngôn";
    if (source) source.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> <span>Xuất xứ: ${escapeHtml(q.source || "Kinh điển")}</span>`;
    if (indexBadge) indexBadge.textContent = `#${q.id} / ${quotes.length}`;

    if (animate && bodyEl) {
      bodyEl.style.opacity = "1";
    }
  }, animate ? 150 : 0);
}

function rollRandomQuote() {
  const quotes = window.QUOTES_DATA || [];
  if (!quotes.length) return;
  let nextIndex = Math.floor(Math.random() * quotes.length);
  if (quotes.length > 1 && nextIndex === currentQuoteIndex) {
    nextIndex = (currentQuoteIndex + 1) % quotes.length;
  }
  renderQuote(nextIndex, true);
}

function copyCurrentQuote() {
  const quotes = window.QUOTES_DATA || [];
  if (currentQuoteIndex < 0 || !quotes[currentQuoteIndex]) return;
  const q = quotes[currentQuoteIndex];
  const textToCopy = `"${q.quote_vi}"\n— ${q.author} (${q.author_title})\n[Xuất xứ: ${q.source}]`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast("Đã sao chép câu nói danh ngôn vào bộ nhớ tạm!", "success");
    }).catch(() => {
      fallbackCopyText(textToCopy);
    });
  } else {
    fallbackCopyText(textToCopy);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast("Đã sao chép câu nói danh ngôn vào bộ nhớ tạm!", "success");
  } catch (err) {
    showToast("Không thể tự động sao chép!", "error");
  }
  document.body.removeChild(ta);
}

// ==================== QUẢN LÝ GIAO DIỆN PHÂN HỆ ====================
function showHub(user) {
  const loginSec = document.getElementById("loginSection");
  const hubSec = document.getElementById("portalHubSection");
  const headerArea = document.getElementById("headerUserArea");

  if (loginSec) {
    loginSec.style.display = "none";
    loginSec.classList.add("d-none");
  }
  if (hubSec) {
    hubSec.style.display = "block";
    hubSec.classList.remove("d-none");
  }
  if (headerArea) headerArea.style.display = "flex";

  if (window.FamilyLayout) {
    FamilyLayout.showSession(user);
  }

  const name = user.fullname || user.ho_ten || user.name || "Cán bộ";
  const username = user.username || "";
  const phone = user.phone || user.so_dien_thoai || "";
  const role = user.position || user.chuc_vu || "Cán bộ";

  const nameEl = document.getElementById("displayUserName");
  if (nameEl) nameEl.textContent = name;
  const roleEl = document.getElementById("displayUserRole");
  if (roleEl) roleEl.textContent = role;
  
  const greetNameEl = document.getElementById("hubGreetingName");
  if (greetNameEl) greetNameEl.textContent = name;
  
  const userRoleEl = document.getElementById("hubUserRole");
  if (userRoleEl) userRoleEl.innerHTML = `Chức vụ: <strong>${escapeHtml(role)}</strong>`;
  
  const accountEl = document.getElementById("hubUserAccount");
  if (accountEl) {
    let displayStr = username || name;
    if (phone) displayStr += ` • SĐT: ${phone}`;
    accountEl.innerHTML = `Tài khoản: <strong>${escapeHtml(displayStr || "Đã xác thực")}</strong>`;
  }
  updateCurrentDate();
  updateTimeGreeting();
  rollRandomQuote();
}

function showLogin() {
  const loginSec = document.getElementById("loginSection");
  const hubSec = document.getElementById("portalHubSection");
  const headerArea = document.getElementById("headerUserArea");

  if (loginSec) {
    loginSec.style.display = "flex";
    loginSec.classList.remove("d-none");
  }
  if (hubSec) {
    hubSec.style.display = "none";
    hubSec.classList.add("d-none");
  }
  if (headerArea) headerArea.style.display = "none";

  if (window.FamilyLayout) {
    FamilyLayout.hideSession();
  }
}

function checkSession() {
  localStorage.removeItem("vpdk_current_user");
  localStorage.removeItem("binhduong_user");

  const rememberedAccount = localStorage.getItem("vpdk_remembered_username");
  const usernameInput = document.getElementById("loginUsername");
  if (rememberedAccount && usernameInput) {
    usernameInput.value = rememberedAccount;
  }

  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
               JSON.parse(sessionStorage.getItem("family_user") || sessionStorage.getItem("binhduong_user") || "null");
  if (user) {
    showHub(user);
    return true;
  }

  showLogin();
  return false;
}

// ==================== KHỞI TẠO SỰ KIỆN & LẮNG NGHE DOM ====================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Toggle mật khẩu
  const btnToggle = document.getElementById("btnToggleLoginPassword");
  const passInput = document.getElementById("loginPassword");
  if (btnToggle && passInput) {
    btnToggle.addEventListener("click", () => {
      const isPass = passInput.type === "password";
      passInput.type = isPass ? "text" : "password";
      btnToggle.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
  }

  // 2. Quên mật khẩu
  const btnForgot = document.getElementById("btnForgotPassword");
  if (btnForgot) {
    btnForgot.addEventListener("click", () => {
      alert("THÔNG BÁO QUÊN MẬT KHẨU:\n\nVui lòng liên hệ Tổ Hành chính - Tổng hợp (Đ/c Tuyền - SĐT: 0909736435) hoặc Quản trị viên để được cấp lại mật khẩu đăng nhập.");
    });
  }

  // 3. Nút Quote điều khiển
  const btnRandom = document.getElementById("btnRandomQuote");
  if (btnRandom) btnRandom.addEventListener("click", rollRandomQuote);

  const btnCopy = document.getElementById("btnCopyQuote");
  if (btnCopy) btnCopy.addEventListener("click", copyCurrentQuote);

  // 4. Nút Đăng xuất
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (typeof FamilyAuth !== "undefined") {
        FamilyAuth.logout();
      } else {
        sessionStorage.clear();
        showToast("Đã đăng xuất khỏi hệ thống thành công.", "info");
        showLogin();
      }
    });
  }

  // 5. Form Đăng nhập
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inputEl = document.getElementById("loginUsername");
      let identifier = (inputEl ? inputEl.value : "").trim().replace(/^'+/, "");
      const password = (document.getElementById("loginPassword").value || "").trim();
      const rememberCheckbox = document.getElementById("rememberMe");
      const remember = rememberCheckbox ? rememberCheckbox.checked : false;

      if (!identifier || !password) {
        showToast("Vui lòng nhập đầy đủ Người dùng và Mật khẩu!", "error");
        return;
      }

      const idLower = identifier.toLowerCase();

      // =========================================================================
      // BYPASS LOGIN LOCAL SIÊU TỐC CHO KIỂM THỬ (admin/admin, quandtm, tuyenntb)
      // =========================================================================
      if ((idLower === "admin" && password === "admin") ||
          (idLower === "quandtm" && (password === "admin" || password === "123456"))) {
        const adminUser = {
          username: "quandtm",
          fullname: "Đỗ Trọng Minh Quân",
          name: "Đỗ Trọng Minh Quân",
          phone: "0973807027",
          position: "Quản trị viên IT",
          department: "Tổ Hành chính - Tổng hợp",
          dept: "Tổ Hành chính - Tổng hợp",
          role: "admin",
          status: "Đang làm việc"
        };
        if (typeof FamilyAuth !== "undefined") {
          FamilyAuth.saveSession(adminUser, remember);
        } else {
          sessionStorage.setItem("family_user", JSON.stringify(adminUser));
        }
        const redirectTarget = sessionStorage.getItem("family_redirect_target");
        if (redirectTarget) {
          sessionStorage.removeItem("family_redirect_target");
          window.location.href = redirectTarget;
          return;
        }
        showHub(adminUser);
        showToast("Đăng nhập thành công với quyền Quản trị viên IT!");
        return;
      }

      if (idLower === "tuyenntb" && (password === "admin" || password === "123456")) {
        const tuyenUser = {
          username: "tuyenntb",
          fullname: "Nguyễn Thị Bích Tuyền",
          name: "Nguyễn Thị Bích Tuyền",
          phone: "0909736435",
          position: "Tổ trưởng",
          department: "Tổ Hành chính - Tổng hợp",
          dept: "Tổ Hành chính - Tổng hợp",
          role: "admin",
          status: "Đang làm việc"
        };
        if (typeof FamilyAuth !== "undefined") {
          FamilyAuth.saveSession(tuyenUser, remember);
        } else {
          sessionStorage.setItem("family_user", JSON.stringify(tuyenUser));
        }
        const redirectTarget = sessionStorage.getItem("family_redirect_target");
        if (redirectTarget) {
          sessionStorage.removeItem("family_redirect_target");
          window.location.href = redirectTarget;
          return;
        }
        showHub(tuyenUser);
        showToast("Đăng nhập thành công với quyền Tổ trưởng HCTH!");
        return;
      }

      // =========================================================================
      // TÀI KHOẢN CHUYÊN VIÊN / USER (user / 123456) ĐỂ KIỂM THỬ PHÂN QUYỀN
      // =========================================================================
      if (idLower === "user" && (password === "123456" || password === "user")) {
        const normalUser = {
          username: "user",
          fullname: "Trần Văn Tuấn",
          name: "Trần Văn Tuấn",
          phone: "0912345678",
          position: "Chuyên viên",
          department: "Tổ Kỹ thuật Địa chính và Lưu trữ",
          dept: "Tổ Kỹ thuật Địa chính và Lưu trữ",
          role: "user",
          status: "Đang làm việc"
        };
        if (typeof FamilyAuth !== "undefined") {
          FamilyAuth.saveSession(normalUser, remember);
        } else {
          sessionStorage.setItem("family_user", JSON.stringify(normalUser));
        }
        const redirectTarget = sessionStorage.getItem("family_redirect_target");
        if (redirectTarget) {
          sessionStorage.removeItem("family_redirect_target");
          window.location.href = redirectTarget;
          return;
        }
        showHub(normalUser);
        showToast("Đăng nhập thành công với vai trò Chuyên viên (User)!");
        return;
      }

      const btnLogin = document.getElementById("btnLogin");
      if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang xác thực...';
      }

      let result = null;

      try {
        const res = await fetch(DEFAULT_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "login", username: identifier, cccd: identifier, password: password })
        });
        result = await res.json();
      } catch (postErr) {
        console.warn("Lỗi kết nối máy chủ:", postErr);
      }

      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket mr-1"></i> <span class="btn-text">Đăng Nhập Vào Hệ Thống</span>';
      }

      if (result) {
        if (result.success && result.user) {
          const u = result.user;
          if (u.status === "Đã nghỉ") {
            alert(`❌ CẢNH BÁO TRUY CẬP:\n\nCán bộ ${u.fullname} đã được ghi nhận trạng thái ĐÃ NGHỈ LÀM VIỆC trên hệ thống nội bộ.\nTài khoản đã bị vô hiệu hóa.`);
            return;
          }

          const userObj = {
            ...u,
            username: u.username || identifier,
            fullname: u.fullname || ("Cán bộ " + (u.username || identifier)),
            name: u.fullname || ("Cán bộ " + (u.username || identifier)),
            phone: u.phone || "",
            email: u.email || u.username || identifier,
            position: u.position || "Cán bộ",
            department: u.department || "Chi nhánh số 23",
            role: u.role || "user",
            status: u.status || "Đang làm việc"
          };

          if (typeof FamilyAuth !== "undefined") {
            FamilyAuth.saveSession(userObj, remember);
          } else {
            sessionStorage.setItem("family_user", JSON.stringify(userObj));
          }

          if (window.FamilySidebar) {
            FamilySidebar.updateUser(userObj.fullname, userObj.position || userObj.department);
          }

          const redirectTarget = sessionStorage.getItem("family_redirect_target");
          if (redirectTarget) {
            sessionStorage.removeItem("family_redirect_target");
            window.location.href = redirectTarget;
            return;
          }

          showHub(userObj);
          return;
        } else {
          if (result.isRetired) {
            alert(`❌ CẢNH BÁO TRUY CẬP:\n\n${result.message}`);
          } else {
            showToast(result.message || "Tên người dùng hoặc Mật khẩu không chính xác!", "error");
          }
          return;
        }
      } else {
        showToast("Không thể kết nối đến máy chủ hệ thống! Vui lòng kiểm tra lại đường truyền mạng.", "error");
      }
    });
  }

  // Khởi chạy kiểm tra phiên làm việc ban đầu
  checkSession();
});
