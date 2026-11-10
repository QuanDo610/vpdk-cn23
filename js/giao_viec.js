/**
 * ==============================================================================
 * CỔNG DỊCH VỤ NỘI BỘ VPĐK CHI NHÁNH 23 - "FAMILY CN23"
 * Module Controller: Lãnh Đạo Giao Việc & Theo Dõi Tiến Độ Nhiệm Vụ
 * File: js/giao_viec.js
 * ==============================================================================
 */

// Hàm mã hóa an toàn chống tấn công XSS
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ========================================================
// 1. DANH SÁCH 82 NHÂN SỰ CHÍNH THỨC CHI NHÁNH SỐ 23
// ========================================================
// 1. DANH SÁCH NHÂN SỰ CHI NHÁNH SỐ 23
// Tự động nạp động 100% từ Google Sheet TaiKhoan thông qua syncStaffFromCloud()
// Đảm bảo nguyên tắc bảo vệ dữ liệu cá nhân Zero-PII trên Git công khai.
const STAFF_CN23 = [];

// Biến lưu danh sách nhân sự hiện hành (Khởi tạo từ danh sách mặc định, tự động đồng bộ từ Sheet TaiKhoan)
let activeStaffList = [...STAFF_CN23];

/**
 * Tự động đồng bộ danh sách cán bộ thời gian thực từ Google Sheet (tab TaiKhoan)
 * - Tự động nhận diện cán bộ mới bổ sung ngoài danh sách
 * - Tự động lọc bỏ các cán bộ có trạng thái "Đã nghỉ"
 * - Tự động gom nhóm theo Tổ và phân cấp chức danh
 */
async function syncStaffFromCloud() {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getUsers&t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        const cloudStaff = data.data
          .filter(u => {
            const st = (u.status || "").trim().toLowerCase();
            return st !== "đã nghỉ" && st !== "nghỉ việc" && st !== "thôi việc";
          })
          .map((u, idx) => ({
            id: u.username || (`STAFF_${idx + 1}`),
            name: u.fullname || "Cán bộ",
            role: u.position || "Cán bộ",
            dept: u.department || "Chi nhánh số 23",
            note: ""
          }));

        if (cloudStaff.length > 0) {
          activeStaffList = cloudStaff;
          updateDeptFilterCounts();
          initUserSession();
          console.log(`Đã nạp động thành công ${cloudStaff.length} cán bộ từ Sheet TaiKhoan.`);
        }
      }
    }
  } catch (err) {
    console.log("Nạp danh sách cán bộ từ bộ nhớ dự phòng (offline mode):", err);
  }
}

const STORAGE_KEY_TASKS = "CN23_TASK_ASSIGNMENTS_V1";
const STORAGE_KEY_DIRECTIVES = "CN23_DIRECTIVES_V4";
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

function getScriptUrl() {
  const saved = localStorage.getItem("vpdk_script_url") || localStorage.getItem("CN23_SCRIPT_URL");
  if (saved && saved.startsWith("https://script.google.com/macros/s/")) {
    return saved.trim();
  }
  return DEFAULT_SCRIPT_URL;
}

const SCRIPT_URL = getScriptUrl();
let currentViewingTaskId = null;
let currentSelectedDirectiveId = null;
let attachedFileInfo = null;
let attachedDirectivePdf = null;
let taskCurrentPage = 1;
let taskPageSize = 10;
window.__sessionDirectiveUrls = window.__sessionDirectiveUrls || {};

// Kho tài liệu PDF gốc mẫu chuẩn của Giám đốc Chi nhánh 23 (dùng làm dự phòng khi Sheet trống / offline)
const DEFAULT_DIRECTIVES = [
  {
    id: "VB-2026-005",
    soHieu: "39266/SNN-VPĐK",
    title: "Thông báo số 39266: Kết luận cuộc họp lãnh đạo Sở NN&PTNT và VPĐKĐĐ (14g30 ngày 10/11)",
    category: "Thông báo",
    sender: "Nguyễn Chiến Thắng — Giám đốc",
    createdAt: "09/11/2026 14:30",
    timestamp: 1794200000000,
    fileName: "39266-SNN-KV1 VPĐK 14g30 ngay 10.11 (2).signed.signed.signed.signed.pdf",
    fileSize: "3.9 MB",
    pages: "Văn bản gốc",
    previewUrl: "data/sample_documents/39266-SNN-KV1%20VP%C4%90K%2014g30%20ngay%2010.11%20(2).signed.signed.signed.signed.pdf",
    downloadUrl: "data/sample_documents/39266-SNN-KV1%20VP%C4%90K%2014g30%20ngay%2010.11%20(2).signed.signed.signed.signed.pdf",
    viewUrl: "data/sample_documents/39266-SNN-KV1%20VP%C4%90K%2014g30%20ngay%2010.11%20(2).signed.signed.signed.signed.pdf",
    notes: "Đề nghị toàn thể Ban Giám đốc, các Tổ trưởng, Tổ phó và chuyên viên khẩn trương rà soát toàn bộ đầu việc theo kết luận chỉ đạo tại cuộc họp ngày 10/11."
  },
  {
    id: "VB-2026-004",
    soHieu: "3987/VPĐKĐĐ",
    title: "Công văn số 3987/VPĐKĐĐ: Hướng dẫn giải quyết hồ sơ người nước ngoài cùng đứng tên quyền sử dụng đất",
    category: "Công văn",
    sender: "Nguyễn Chiến Thắng — Giám đốc",
    createdAt: "09/11/2026 10:15",
    timestamp: 1794150000000,
    fileName: "Cong van so 3987 Người Nước ngoài cùng đứng tên.pdf",
    fileSize: "1.0 MB",
    pages: "Văn bản gốc",
    previewUrl: "data/sample_documents/Cong%20van%20so%203987%20Ng%C6%B0%E1%BB%9Di%20N%C6%B0%E1%BB%9Bc%20ngo%C3%A0i%20c%C3%B9ng%20%C4%91%E1%BB%A9ng%20t%C3%AAn.pdf",
    downloadUrl: "data/sample_documents/Cong%20van%20so%203987%20Ng%C6%B0%E1%BB%9Di%20N%C6%B0%E1%BB%9Bc%20ngo%C3%A0i%20c%C3%B9ng%20%C4%91%E1%BB%A9ng%20t%C3%AAn.pdf",
    viewUrl: "data/sample_documents/Cong%20van%20so%203987%20Ng%C6%B0%E1%BB%9Di%20N%C6%B0%E1%BB%9Bc%20ngo%C3%A0i%20c%C3%B9ng%20%C4%91%E1%BB%A9ng%20t%C3%AAn.pdf",
    notes: "Tổ Đăng ký & Cấp GCN phối hợp chặt chẽ với Tổ Kỹ thuật Địa chính kiểm tra kỹ điều kiện pháp lý đối với hồ sơ có người nước ngoài cùng đứng tên theo đúng tinh thần Công văn 3987."
  }
];

function hydrateSessionUrls(list) {
  const sessionMap = window.__sessionDirectiveUrls || {};
  return list.map(item => {
    const sess = sessionMap[item.id];
    if (sess && (!item.previewUrl || item.previewUrl.startsWith("blob:"))) {
      return {
        ...item,
        previewUrl: sess.previewUrl || item.previewUrl,
        downloadUrl: sess.downloadUrl || item.downloadUrl,
        viewUrl: sess.viewUrl || item.viewUrl
      };
    }
    return item;
  });
}

function getStoredDirectives() {
  const data = localStorage.getItem(STORAGE_KEY_DIRECTIVES);
  if (!data) {
    // Dọn dẹp cache phiên bản cũ (chứa link lỗi docx / file mẫu thừa)
    try {
      localStorage.removeItem("CN23_DIRECTIVES_V1");
      localStorage.removeItem("CN23_DIRECTIVES_V2");
      localStorage.removeItem("CN23_DIRECTIVES_V3");
    } catch (e) {}
    const initialList = [...DEFAULT_DIRECTIVES];
    saveStoredDirectives(initialList);
    return initialList;
  }
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return hydrateSessionUrls(parsed);
    }
    return [...DEFAULT_DIRECTIVES];
  } catch (e) {
    return [...DEFAULT_DIRECTIVES];
  }
}

function saveStoredDirectives(list) {
  // Bảo vệ giới hạn 5MB của localStorage: loại bỏ chuỗi base64 quá lớn (>100KB), giữ link URL Drive/Blob trong phiên
  const safeList = (Array.isArray(list) ? list : []).map(item => {
    const copy = { ...item };
    ["previewUrl", "downloadUrl", "viewUrl", "fileUrl"].forEach(k => {
      if (typeof copy[k] === "string" && copy[k].startsWith("data:") && copy[k].length > 100000) {
        copy[k] = "";
      }
    });
    return copy;
  });
  try {
    localStorage.setItem(STORAGE_KEY_DIRECTIVES, JSON.stringify(safeList));
  } catch (e) {
    console.warn("Bỏ qua lưu localStorage do vượt dung lượng:", e);
  }
}

// Đồng bộ Cloud Google Apps Script & Xóa cache dữ liệu cũ
async function syncTasksFromCloud(forceRefresh = false) {
  const refreshBtn = document.getElementById("btnRefreshTasks");
  const refreshIcon = refreshBtn?.querySelector("i");
  if (refreshIcon) refreshIcon.classList.add("fa-spin");

  try {
    const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                 JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");
    const authQuery = user ? `&username=${encodeURIComponent(user.username || "")}&fullname=${encodeURIComponent(user.fullname || user.name || "")}&phone=${encodeURIComponent(user.phone || "")}&position=${encodeURIComponent(user.position || "")}&department=${encodeURIComponent(user.department || "")}` : "";
    const res = await fetch(`${SCRIPT_URL}?action=getTasks&t=${Date.now()}${authQuery}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        // Ghi đè trực tiếp danh sách chuẩn từ Google Sheet để xóa hoàn toàn các task đã xóa (chống dính cache)
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(result.data));
        taskCurrentPage = 1;
        updateTaskKPIs();
        renderTasksTable();
        if (forceRefresh) {
          showToast("Đã làm mới dữ liệu và xóa bộ nhớ đệm thành công!", "success");
        }
      }
    } else {
      if (forceRefresh) showToast("Không thể kết nối đến máy chủ Cloud!", "error");
    }
  } catch (err) {
    console.log("Cloud tasks sync offline mode:", err);
    if (forceRefresh) showToast("Lỗi kết nối máy chủ Cloud!", "error");
  } finally {
    if (refreshIcon) refreshIcon.classList.remove("fa-spin");
  }
}

async function syncTaskToCloud(action, payload) {
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: action, ...payload })
    });
    const result = await res.json();
    if (result && result.fileUrl && payload && payload.id) {
      if (result.fileUrl.startsWith("http")) {
        const tasks = getStoredTasks();
        const t = tasks.find(item => item.id === payload.id);
        if (t) {
          t.fileUrl = result.fileUrl;
          if (t.attachedFile) t.attachedFile.url = result.fileUrl;
          saveStoredTasks(tasks);
          renderTasksTable();
        }
      } else {
        console.warn("Lưu ý từ Google Apps Script khi upload file:", result.fileUrl);
      }
    }
    return result;
  } catch (e) {
    console.log("Cloud sync error:", e);
  }
}

// Toast Notification
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `pointer-events-auto px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2.5 transition-all transform duration-300 border ${
    type === "success" ? "bg-emerald-600 text-white border-emerald-500" :
    type === "error" ? "bg-rose-600 text-white border-rose-500" :
    "bg-slate-900 text-white border-slate-700"
  }`;
  const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info";
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ========================================================
// 2. CHUẨN HÓA DỮ LIỆU & PHÂN HẠNG VAI TRÒ (RBAC HIERARCHY)
// ========================================================
/**
 * Chuẩn hóa bỏ dấu tiếng Việt để tìm kiếm & so khớp an toàn
 */
function removeVietnameseTones(str) {
  if (!str) return "";
  str = String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/[đĐ]/g, "d");
  return str.toLowerCase().trim();
}

/**
 * Chuẩn hóa số điện thoại để so sánh an toàn
 */
function normalizePhone(p) {
  if (!p) return "";
  let s = String(p).replace(/^'+/, "").replace(/[\s\.\-]+/g, "");
  return s.replace(/^0+/, "");
}

/**
 * Lấy thứ bậc (Rank) phân cấp hành chính:
 * - Rank 0: IT Admin (Quản trị hệ thống - Đỗ Trọng Minh Quân 0973807027 / quandtm)
 * - Rank 1: Giám đốc Chi nhánh (Nguyễn Chiến Thắng)
 * - Rank 2: Phó Giám đốc Chi nhánh (Đặng Huy Cường, Nguyễn Thị Lệ Hằng)
 * - Rank 3: Tổ trưởng (Trần Quốc Hưng, Nguyễn Thị Thùy Trang, Nguyễn Thị Bích Tuyền,...)
 * - Rank 4: Tổ phó (Đặng Thị Tuyết Trinh, Huỳnh Tấn Nguyên, Nguyễn Thành Như Bảo,...)
 * - Rank 5: Chuyên viên / Nhân viên (không có quyền giao việc)
 */
function getUserRank(user) {
  if (!user) return 99;
  const name = removeVietnameseTones(user.fullname || user.name || "");
  const phone = normalizePhone(user.phone || "");
  const username = (user.username || user.id || "").toLowerCase();
  const pos = removeVietnameseTones(user.position || user.chuc_vu || user.role || "");

  if (phone === "973807027" || phone === "0973807027" || username === "quandtm" || name.includes("do trong minh quan")) {
    return 0; // IT Admin
  }
  if (pos.includes("giam doc") && !pos.includes("pho")) return 1;
  if (pos.includes("pho giam doc")) return 2;
  if (pos.includes("to truong") || pos.includes("truong phong")) return 3;
  if (pos.includes("to pho") || pos.includes("pho phong")) return 4;
  return 5;
}

/**
 * Kiểm tra xem 2 đối tượng có phải cùng 1 người không (chống tự giao việc cho mình)
 */
function isSamePerson(personA, personB) {
  if (!personA || !personB) return false;
  const nameA = removeVietnameseTones(personA.fullname || personA.name || "");
  const nameB = removeVietnameseTones(personB.fullname || personB.name || "");
  const userA = (personA.username || personA.id || "").toLowerCase().trim();
  const userB = (personB.username || personB.id || "").toLowerCase().trim();
  const phoneA = normalizePhone(personA.phone || "");
  const phoneB = normalizePhone(personB.phone || "");

  if (userA && userB && userA === userB) return true;
  if (nameA && nameB && nameA === nameB) return true;
  if (phoneA && phoneB && phoneA === phoneB) return true;
  return false;
}

/**
 * Kiểm tra xem 2 đơn vị / bộ phận có cùng 1 Tổ chuyên môn hay không
 */
function isSameDepartment(deptA, deptB) {
  if (!deptA || !deptB) return false;
  const a = removeVietnameseTones(deptA);
  const b = removeVietnameseTones(deptB);
  if (a === b) return true;
  if (a.includes("dia chinh") && b.includes("dia chinh")) return true;
  if (a.includes("dang ky") && b.includes("dang ky")) return true;
  if (a.includes("hanh chinh") && b.includes("hanh chinh")) return true;
  if (a.includes("ban giam doc") && b.includes("ban giam doc")) return true;
  return false;
}

/**
 * QUY TẮC PHÂN CẤP GIAO VIỆC (QUY TẮC BẮT BUỘC):
 * 1. Không tự giao việc cho chính mình (Giám đốc không giao cho Giám đốc).
 * 2. Cây phân cấp: Giám đốc > Phó Giám đốc > Tổ trưởng > Tổ phó > Chuyên viên / Nhân viên.
 * 3. Ban Giám đốc:
 *    - Giám đốc (Rank 1): Giao cho PGĐ, Tổ trưởng, Tổ phó, Chuyên viên toàn đơn vị (tRank >= 2).
 *    - Phó Giám đốc (Rank 2): Giao cho Tổ trưởng, Tổ phó, Chuyên viên toàn đơn vị (không giao cho Giám đốc, tRank >= 3).
 * 4. Lãnh đạo cấp Tổ (Tổ trưởng: Rank 3, Tổ phó: Rank 4):
 *    - Bắt buộc giao trong nội bộ tổ của mình (không giao chéo tổ).
 *    - Cấp bậc người nhận phải thấp hơn người giao (tRank > aRank).
 *      (Tổ trưởng giao cho Tổ phó & Chuyên viên cùng tổ; Tổ phó chỉ giao cho Chuyên viên cùng tổ).
 * 5. Chuyên viên / Nhân viên (Rank 5):
 *    - Không có thẩm quyền giao việc.
 * 6. IT Admin (Rank 0):
 *    - Toàn quyền hỗ trợ kỹ thuật và kiểm thử hệ thống.
 */
function canAssignTaskTo(assigner, targetStaff) {
  if (!assigner || !targetStaff) return false;
  // 1. Tuyệt đối không tự giao việc cho chính mình
  if (isSamePerson(assigner, targetStaff)) return false;

  const aRank = getUserRank(assigner);
  const tRank = getUserRank(targetStaff);

  // 2. Chuyên viên thường không được giao việc
  if (aRank >= 5) return false;

  // 3. Quản trị IT (Rank 0)
  if (aRank === 0) return true;

  // 4. Giám đốc (Rank 1): Toàn cơ quan (tRank >= 2)
  if (aRank === 1) {
    return tRank >= 2;
  }

  // 5. Phó Giám đốc (Rank 2): Toàn cơ quan (tRank >= 3: Tổ trưởng, Tổ phó, Chuyên viên)
  if (aRank === 2) {
    return tRank >= 3;
  }

  // 6. Lãnh đạo cấp Tổ (Tổ trưởng: Rank 3, Tổ phó: Rank 4)
  if (aRank === 3 || aRank === 4) {
    const aDept = assigner.department || assigner.don_vi || assigner.dept || "";
    const tDept = targetStaff.dept || targetStaff.department || "";
    // Bắt buộc trong cùng tổ chuyên môn
    if (!isSameDepartment(aDept, tDept)) return false;
    // Bắt buộc giao cho cấp dưới
    return tRank > aRank;
  }

  return false;
}

/**
 * QUY TẮC BẢO MẬT: ĐĂNG TẢI THÔNG CÁO & CHỈ THỊ PDF TOÀN CƠ QUAN
 * - CHỈ DUY NHẤT Giám đốc Nguyễn Chiến Thắng (và Quản trị IT Đỗ Trọng Minh Quân) mới có thẩm quyền upload.
 * - Toàn bộ các tài khoản khác (Phó Giám đốc, Tổ trưởng, Tổ phó, Chuyên viên, Nhân viên...) chỉ có quyền XEM và TẢI VỀ.
 */
function canUploadDirectives(user) {
  if (!user) return false;
  const myRank = getUserRank(user);
  const myName = removeVietnameseTones(user.fullname || user.name || "");
  const myUsername = (user.username || "").toLowerCase().trim();
  const myPhone = normalizePhone(user.phone || "");

  // 1. Quản trị viên IT Đỗ Trọng Minh Quân (quandtm / 0973807027)
  if (myRank === 0 || myPhone === "973807027" || myPhone === "0973807027" || myUsername === "quandtm" || myName.includes("do trong minh quan")) {
    return true;
  }
  // 2. Giám đốc Nguyễn Chiến Thắng (Rank 1 hoặc họ tên chứa Nguyễn Chiến Thắng)
  if (myRank === 1 || myName.includes("nguyen chien thang")) {
    return true;
  }
  // Các tài khoản khác: Phó Giám đốc, Tổ trưởng, Tổ phó, Chuyên viên, Nhân viên... KHÔNG CÓ QUYỀN
  return false;
}

/**
 * Hiển thị Huy hiệu phạm vi vai trò (Role Scope Badge) và kiểm soát nút nguy hiểm
 */
function updateTaskRoleScopeBadge(user) {
  const badgeEl = document.getElementById("taskRoleScopeBadge");
  if (!user) return;

  const userRank = getUserRank(user);
  const isITAdmin = (userRank === 0);
  const isBGD = (userRank === 1 || userRank === 2);
  const isDeptLeader = (userRank === 3 || userRank === 4);

  if (badgeEl) {
    badgeEl.classList.remove("hidden");
    if (isITAdmin || isBGD) {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs";
      badgeEl.innerHTML = '<i class="fa-solid fa-shield-halved text-amber-600"></i> Quản trị / Ban Giám đốc (Theo dõi & điều phối toàn đơn vị)';
    } else if (isDeptLeader) {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 shadow-2xs";
      badgeEl.innerHTML = `<i class="fa-solid fa-user-group text-purple-600"></i> Lãnh đạo Tổ: <strong>${user.department || "Tổ chuyên môn"}</strong> (Giao việc & theo dõi trong tổ)`;
    } else {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs";
      badgeEl.innerHTML = '<i class="fa-solid fa-user-check text-blue-600"></i> Cán bộ nhận việc (Theo dõi tiến độ nhiệm vụ được phân công)';
    }
  }
}

function initUserSession() {
  try {
    const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                 JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");
    if (user) {
      const userName = user.name || user.fullname || "Cán bộ";
      const userRole = user.position || user.role || user.dept || "Chi nhánh 23";
      const userDept = user.department || user.don_vi || user.dept || "Chi nhánh số 23";
      const nameEl = document.getElementById("headerUserName");
      const roleEl = document.getElementById("headerUserRole");
      if (nameEl) nameEl.textContent = userName;
      if (roleEl) roleEl.textContent = userRole;

      updateTaskRoleScopeBadge(user);

      const userRank = getUserRank(user);
      const isLeader = (userRank <= 4); // Rank 0, 1, 2, 3, 4 có quyền giao việc

      // Ẩn/Hiện phân hệ giao việc dựa theo cấp bậc:
      // Nhân viên / Chuyên viên thông thường (Rank 5) không có form giao việc, chỉ xem tiến độ
      const tabBtnAssign = document.getElementById("tabBtnAssign");
      const btnQuickOpenAssign = document.getElementById("btnQuickOpenAssign");
      const panelAssign = document.getElementById("panelAssign");
      const panelTracking = document.getElementById("panelTracking");

      // Rào chắn bảo mật: Bộ lọc Tổ chuyên môn trên Bảng theo dõi tiến độ
      // - Chuyên viên/Nhân viên thường (userRank >= 5): Tuyệt đối ẨN bộ lọc Tổ chuyên môn
      // - Tổ trưởng / Tổ phó (userRank 3, 4): Hiển thị và CỐ ĐỊNH theo đúng tổ của mình
      // - Ban Giám đốc & IT Admin (userRank <= 2): Mở toàn quyền xem và chọn các tổ
      const filterTaskDeptWrapper = document.getElementById("filterTaskDeptWrapper");
      const filterTaskDeptSelect = document.getElementById("filterTaskDept");

      if (userRank >= 5) {
        if (filterTaskDeptWrapper) filterTaskDeptWrapper.classList.add("hidden");
        if (filterTaskDeptSelect) filterTaskDeptSelect.value = "ALL";
      } else if (userRank === 3 || userRank === 4) {
        if (filterTaskDeptWrapper) filterTaskDeptWrapper.classList.remove("hidden");
        if (filterTaskDeptSelect) {
          for (let i = 0; i < filterTaskDeptSelect.options.length; i++) {
            const optVal = filterTaskDeptSelect.options[i].value;
            if (optVal !== "ALL" && isSameDepartment(optVal, userDept)) {
              filterTaskDeptSelect.selectedIndex = i;
              break;
            }
          }
          filterTaskDeptSelect.disabled = true;
          filterTaskDeptSelect.classList.add("bg-slate-100", "cursor-not-allowed", "opacity-90");
        }
      } else {
        if (filterTaskDeptWrapper) filterTaskDeptWrapper.classList.remove("hidden");
        if (filterTaskDeptSelect) {
          filterTaskDeptSelect.disabled = false;
          filterTaskDeptSelect.classList.remove("bg-slate-100", "cursor-not-allowed", "opacity-90");
        }
      }

      // Quyền Đăng tải Thông cáo / Chỉ thị PDF toàn cơ quan:
      // ĐẶC QUYỀN DUY NHẤT: Giám đốc Nguyễn Chiến Thắng & IT Admin Đỗ Trọng Minh Quân
      // Toàn bộ cán bộ khác (Chuyên viên, Trần Văn Tuấn, Lãnh đạo cấp tổ...) bị ẨN HOÀN TOÀN
      const canUploadDoc = canUploadDirectives(user);
      const btnQuickOpenUploadDirective = document.getElementById("btnQuickOpenUploadDirective");
      if (btnQuickOpenUploadDirective) {
        if (canUploadDoc) {
          btnQuickOpenUploadDirective.classList.remove("hidden");
          btnQuickOpenUploadDirective.style.display = "";
        } else {
          btnQuickOpenUploadDirective.classList.add("hidden");
          btnQuickOpenUploadDirective.style.display = "none";
        }
      }

      if (!isLeader) {
        if (tabBtnAssign) tabBtnAssign.style.display = "none";
        if (btnQuickOpenAssign) btnQuickOpenAssign.style.display = "none";
        if (panelAssign) panelAssign.classList.add("hidden");
      } else {
        if (tabBtnAssign) tabBtnAssign.style.display = "";
        if (btnQuickOpenAssign) btnQuickOpenAssign.style.display = "";

        // 1. Tự động điền Người giao việc = Thông tin người đang đăng nhập
        const leaderInput = document.getElementById("assignLeader");
        if (leaderInput) {
          leaderInput.value = `${userName} — ${userRole}`;
        }
        const leaderNote = document.getElementById("assignLeaderDeptNote");
        if (leaderNote) {
          leaderNote.textContent = `Tài khoản: ${userName} (${userRole} - ${userDept})`;
        }

        // 2. Tự động điền và khóa Tổ chuyên môn đối với Tổ trưởng, Tổ phó
        const filterDeptSelect = document.getElementById("filterStaffDept");
        const lockIcon = document.getElementById("lockStaffDeptIcon");
        const deptHint = document.getElementById("filterStaffDeptHint");

        if (userRank === 3 || userRank === 4) {
          // Khóa cứng theo Tổ chuyên môn của Tổ trưởng / Tổ phó
          if (filterDeptSelect) {
            for (let i = 0; i < filterDeptSelect.options.length; i++) {
              const optVal = filterDeptSelect.options[i].value;
              if (optVal !== "ALL" && isSameDepartment(optVal, userDept)) {
                filterDeptSelect.selectedIndex = i;
                break;
              }
            }
            filterDeptSelect.disabled = true;
            filterDeptSelect.classList.add("bg-slate-100", "cursor-not-allowed", "opacity-90");
          }
          if (lockIcon) lockIcon.classList.remove("hidden");
          if (deptHint) {
            deptHint.innerHTML = `<span class="text-amber-700 font-semibold"><i class="fa-solid fa-lock mr-1"></i> Cố định theo ${userDept}</span>`;
          }
        } else {
          // Ban Giám đốc hoặc IT Admin: Toàn quyền chọn hoặc để Tất cả
          if (filterDeptSelect) {
            filterDeptSelect.disabled = false;
            filterDeptSelect.classList.remove("bg-slate-100", "cursor-not-allowed", "opacity-90");
            filterDeptSelect.value = "ALL";
          }
          if (lockIcon) lockIcon.classList.add("hidden");
          if (deptHint) {
            deptHint.textContent = "Chọn tổ để thu hẹp danh sách cán bộ bên cạnh (hoặc để Tất cả)";
          }
        }
      }

      // Nạp danh sách cán bộ nhận việc tương ứng với quyền hạn của người đăng nhập
      const currentDeptFilter = (userRank === 3 || userRank === 4) 
        ? userDept 
        : (document.getElementById("filterStaffDept")?.value || "ALL");
      populateStaffDropdown(currentDeptFilter);
    }
  } catch (e) {
    console.warn("Lỗi đọc session:", e);
  }

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("Đồng chí có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
        if (typeof FamilyAuth !== "undefined") {
          FamilyAuth.logout();
        } else {
          sessionStorage.clear();
          window.location.href = "index.html";
        }
      }
    });
  }
}

// ========================================================
// 3. DROPDOWN CÁN BỘ NHẬN VIỆC (TUÂN THỦ CÂY PHÂN CẤP & CHỐNG TỰ GIAO VIỆC)
// ========================================================
/**
 * Tự động cập nhật số lượng nhân sự hiển thị trên dropdown Lọc Tổ
 */
function updateDeptFilterCounts() {
  const deptFilter = document.getElementById("filterStaffDept");
  if (!deptFilter) return;

  const total = activeStaffList.length;
  for (let opt of deptFilter.options) {
    if (opt.value === "ALL") {
      opt.textContent = `-- Tất cả cán bộ trong cơ quan (${total} nhân sự) --`;
    } else {
      const count = activeStaffList.filter(s => {
        const d = (s.dept || "").trim().toLowerCase();
        const target = opt.value.trim().toLowerCase();
        return isSameDepartment(d, target);
      }).length;
      opt.textContent = `${opt.value} (${count})`;
    }
  }
}

function populateStaffDropdown(filterDept = "ALL") {
  const staffSelect = document.getElementById("assignStaff");
  if (!staffSelect) return;
  staffSelect.innerHTML = '<option value="" disabled selected>-- Chọn cán bộ nhận việc --</option>';

  const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                      JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

  const myRank = getUserRank(currentUser);

  // Nếu người dùng là Chuyên viên/Nhân viên (Rank 5): Không có quyền giao việc
  if (myRank >= 5) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.textContent = "-- Đồng chí không có thẩm quyền giao việc --";
    staffSelect.appendChild(opt);
    return;
  }

  // Nếu là Tổ trưởng / Tổ phó: Cố định theo tổ của mình
  if ((myRank === 3 || myRank === 4) && currentUser) {
    const userDept = currentUser.department || currentUser.don_vi || currentUser.dept || "";
    if (userDept) {
      filterDept = userDept;
    }
  }

  // Lọc danh sách nhân sự đủ điều kiện nhận việc từ người đang đăng nhập
  const eligibleStaff = activeStaffList.filter(s => canAssignTaskTo(currentUser, s));

  // Lấy các tổ có trong danh sách đủ điều kiện
  const rawDepts = Array.from(new Set(eligibleStaff.map(s => (s.dept || "Chi nhánh số 23").trim()))).filter(Boolean);

  const priorityOrder = ["Ban Giám đốc", "Tổ Kỹ thuật Địa chính và Lưu trữ", "Tổ Đăng ký cấp GCN", "Tổ Hành chính Tổng hợp"];
  rawDepts.sort((a, b) => {
    const idxA = priorityOrder.findIndex(p => a.toLowerCase().includes(p.toLowerCase()));
    const idxB = priorityOrder.findIndex(p => b.toLowerCase().includes(p.toLowerCase()));
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b, "vi");
  });

  const depts = (filterDept === "ALL" || !filterDept)
    ? rawDepts
    : rawDepts.filter(d => isSameDepartment(d, filterDept));

  let totalCount = 0;

  depts.forEach(deptName => {
    const staffInDept = eligibleStaff.filter(s => {
      const d = (s.dept || "").trim().toLowerCase();
      const target = deptName.trim().toLowerCase();
      return isSameDepartment(d, target);
    });

    if (staffInDept.length > 0) {
      const rankOrder = ["giám đốc", "phó giám đốc", "tổ trưởng", "tổ phó", "chuyên viên", "nhân viên", "cán bộ"];
      staffInDept.sort((a, b) => {
        const rA = rankOrder.findIndex(r => (a.role || "").toLowerCase().includes(r));
        const rB = rankOrder.findIndex(r => (b.role || "").toLowerCase().includes(r));
        const rankA = rA !== -1 ? rA : 99;
        const rankB = rB !== -1 ? rB : 99;
        if (rankA !== rankB) return rankA - rankB;
        return (a.name || "").localeCompare(b.name || "", "vi");
      });

      const optGroup = document.createElement("optgroup");
      optGroup.label = `${deptName} (${staffInDept.length} cán bộ)`;
      staffInDept.forEach(staff => {
        const opt = document.createElement("option");
        opt.value = staff.id;
        const noteText = staff.note ? ` [${staff.note}]` : "";
        opt.textContent = `${staff.name} — ${staff.role}${noteText}`;
        optGroup.appendChild(opt);
        totalCount++;
      });
      staffSelect.appendChild(optGroup);
    }
  });

  if (totalCount === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.textContent = "-- Không có cán bộ cấp dưới trong tổ này --";
    staffSelect.appendChild(opt);
  }
}

function removeAttachedFile() {
  const fileInput = document.getElementById("taskFileInput");
  if (fileInput) fileInput.value = "";
  attachedFileInfo = null;
  const filePreview = document.getElementById("fileUploadPreview");
  if (filePreview) filePreview.classList.add("hidden");
  const fileLabel = document.getElementById("fileUploadLabel");
  if (fileLabel) fileLabel.textContent = "Nhấp để chọn tệp từ máy tính...";
}

/**
 * Chuyển đổi mọi đường link Google Drive thành đường link TỰ ĐỘNG TẢI TRỰC TIẾP (Direct Download)
 * Bấm vào là trình duyệt lập tức tải file về máy tính, không mở trang xem trước.
 */
function getDirectDownloadUrl(url) {
  if (!url) return "";
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1] && url.includes("drive.google.com")) {
    return `https://drive.google.com/uc?export=download&id=${matchId[1]}`;
  }
  return url;
}



/**
 * Rào chắn Phân Quyền Truy Cập Nhiệm Vụ Giao Việc (RBAC 3 Tầng):
 * 1. Ban Giám đốc & Quản trị IT (Đỗ Trọng Minh Quân): Xem toàn bộ nhiệm vụ toàn đơn vị.
 * 2. Lãnh đạo phát lệnh giao việc (task.leader): Xem nhiệm vụ do chính mình phát lệnh.
 * 3. Cán bộ trực tiếp nhận việc (task.assigneeName / task.assigneeId): Xem nhiệm vụ của mình.
 * 4. Tổ trưởng, Tổ phó của phòng ban người nhận việc: Xem tất cả nhiệm vụ thuộc Tổ mình.
 * 5. Chuyên viên / nhân viên khác: Tuyệt đối không xem nhiệm vụ của người khác.
 */
function canUserViewTask(user, task) {
  if (!user || !task) return false;

  const myName = removeVietnameseTones(user.fullname || user.name || "");
  const myUsername = (user.username || "").toLowerCase().trim();
  const myPhone = normalizePhone(user.phone || "");
  const myPos = removeVietnameseTones(user.position || user.chuc_vu || "");
  const myDept = removeVietnameseTones(user.department || user.don_vi || user.dept || "");

  // 1. Quản trị viên IT Đỗ Trọng Minh Quân: Nhận diện mỏ neo cứng 0973807027 / quandtm
  if (
    myPhone === "973807027" ||
    myPhone === "0973807027" ||
    myUsername === "quandtm" ||
    myName.includes("do trong minh quan")
  ) {
    return true;
  }

  // 2. Ban Giám đốc: Toàn quyền chỉ đạo & giám sát toàn cơ quan
  if (
    myDept.includes("ban giam doc") ||
    myPos.includes("giam doc") ||
    myPos.includes("pho giam doc") ||
    myName.includes("nguyen chien thang") ||
    myName.includes("dang huy cuong") ||
    myName.includes("nguyen thi le hang")
  ) {
    return true;
  }

  // 3. Người phát lệnh giao việc (Lãnh đạo giao việc)
  const taskLeader = removeVietnameseTones(task.leader || "");
  if (taskLeader && myName && (taskLeader.includes(myName) || myName.includes(taskLeader))) {
    return true;
  }

  // 4. Người được giao việc (Assignee)
  const taskAssignee = removeVietnameseTones(task.assigneeName || "");
  const taskAssigneeId = (task.assigneeId || "").toLowerCase().trim();
  if (
    (taskAssignee && myName && (taskAssignee === myName || taskAssignee.includes(myName) || myName.includes(taskAssignee))) ||
    (taskAssigneeId && myUsername && (taskAssigneeId === myUsername || taskAssigneeId.includes(myUsername)))
  ) {
    return true;
  }

  // 5. Tổ trưởng & Tổ phó của phòng ban của người được giao việc
  const isDeptLeader = myPos.includes("to truong") || myPos.includes("to pho") || 
                       myPos.includes("truong phong") || myPos.includes("pho phong");

  if (isDeptLeader && myDept) {
    const taskDept = removeVietnameseTones(task.assigneeDept || "");
    const isSameDept = (
      (myDept.includes("dia chinh") && taskDept.includes("dia chinh")) ||
      (myDept.includes("dang ky") && taskDept.includes("dang ky")) ||
      (myDept.includes("hanh chinh") && taskDept.includes("hanh chinh")) ||
      (myDept === taskDept)
    );
    if (isSameDept) {
      return true;
    }
  }

  return false;
}

/**
 * Trả về danh sách nhiệm vụ đã qua bộ lọc phân quyền RBAC
 */
function getVisibleTasks() {
  const allTasks = getStoredTasks();
  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
               JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");
  if (!user) return [];
  return allTasks.filter(t => canUserViewTask(user, t));
}

// 4. QUẢN LÝ DỮ LIỆU & BẢNG TIẾN ĐỘ
// ========================================================
function getStoredTasks() {
  const data = localStorage.getItem(STORAGE_KEY_TASKS);
  return data ? JSON.parse(data) : [];
}

function saveStoredTasks(tasks) {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  updateTaskKPIs();
  renderTasksTable();
}

function updateTaskKPIs() {
  const tasks = getVisibleTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Đã hoàn thành").length;

  const now = new Date();
  let overdue = 0;
  let inProgress = 0;

  tasks.forEach(t => {
    if (t.status !== "Đã hoàn thành") {
      if (t.deadline && new Date(t.deadline) < now) {
        overdue++;
      } else {
        inProgress++;
      }
    }
  });

  const elTot = document.getElementById("kpiTotalTasks");
  if (elTot) elTot.textContent = total;
  const elInp = document.getElementById("kpiInProgressTasks");
  if (elInp) elInp.textContent = inProgress;
  const elOvd = document.getElementById("kpiOverdueTasks");
  if (elOvd) elOvd.textContent = overdue;
  const elCmp = document.getElementById("kpiCompletedTasks");
  if (elCmp) elCmp.textContent = completed;
  const elBdg = document.getElementById("tabBadgeCount");
  if (elBdg) elBdg.textContent = total;

  const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";
  const elRate = document.getElementById("kpiCompletionRate");
  if (elRate) elRate.textContent = `${rate}%`;

  const overdueBadge = document.getElementById("kpiOverdueBadge");
  if (overdueBadge) {
    if (overdue > 0) {
      overdueBadge.className = "text-[11px] font-bold text-rose-600 truncate animate-pulse";
      overdueBadge.textContent = `⚠️ Có ${overdue} việc quá hạn!`;
    } else {
      overdueBadge.className = "text-[11px] font-semibold text-emerald-600 truncate";
      overdueBadge.textContent = "✓ 100% trong hạn";
    }
  }
}

function changeTaskPage(page) {
  taskCurrentPage = page;
  renderTasksTable();
  const tableTop = document.getElementById("panelTracking");
  if (tableTop) {
    tableTop.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
window.changeTaskPage = changeTaskPage;

function renderPagination(totalCount, startIndex, currentCount, currentPage, totalPages) {
  const infoEl = document.getElementById("paginationInfo");
  const controlsEl = document.getElementById("paginationControls");
  if (!infoEl || !controlsEl) return;

  if (totalCount === 0) {
    infoEl.textContent = "Hiển thị 0 - 0 trong tổng số 0 nhiệm vụ";
    controlsEl.innerHTML = "";
    return;
  }

  const end = startIndex + currentCount;
  infoEl.textContent = `Hiển thị ${startIndex + 1} - ${end} trong tổng số ${totalCount} nhiệm vụ`;

  if (totalPages <= 1) {
    controlsEl.innerHTML = "";
    return;
  }

  let html = "";
  // Nút Trước (Prev)
  html += `
    <button type="button" class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${currentPage <= 1 ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"}"
            ${currentPage <= 1 ? "disabled" : `onclick="changeTaskPage(${currentPage - 1})"`}>
      <i class="fa-solid fa-chevron-left mr-1"></i> Trước
    </button>
  `;

  // Các nút số trang
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7) {
      if (p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 2) {
        if (p === 2 || p === totalPages - 1) {
          html += `<span class="px-1 text-slate-400">...</span>`;
        }
        continue;
      }
    }
    const isActive = p === currentPage;
    html += `
      <button type="button" class="w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${isActive ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"}"
              onclick="changeTaskPage(${p})">
        ${p}
      </button>
    `;
  }

  // Nút Sau (Next)
  html += `
    <button type="button" class="px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${currentPage >= totalPages ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"}"
            ${currentPage >= totalPages ? "disabled" : `onclick="changeTaskPage(${currentPage + 1})"`}>
      Sau <i class="fa-solid fa-chevron-right ml-1"></i>
    </button>
  `;

  controlsEl.innerHTML = html;
}

function renderTasksTable() {
  const tasks = getVisibleTasks();
  const filterStatus = document.getElementById("filterTaskStatus")?.value || "ALL";
  const filterDept = document.getElementById("filterTaskDept")?.value || "ALL";
  const searchTerm = (document.getElementById("searchTaskInput")?.value || "").toLowerCase().trim();
  const tbody = document.getElementById("taskTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  let filtered = tasks;

  if (filterStatus !== "ALL") {
    if (filterStatus === "Quá hạn") {
      const now = new Date();
      filtered = filtered.filter(t => t.status !== "Đã hoàn thành" && t.deadline && new Date(t.deadline) < now);
    } else {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
  }

  if (filterDept !== "ALL") {
    filtered = filtered.filter(t => isSameDepartment(t.assigneeDept || "", filterDept));
  }

  if (searchTerm) {
    filtered = filtered.filter(t => 
      (t.title && t.title.toLowerCase().includes(searchTerm)) ||
      (t.id && t.id.toLowerCase().includes(searchTerm)) ||
      (t.assigneeName && t.assigneeName.toLowerCase().includes(searchTerm)) ||
      (t.leader && t.leader.toLowerCase().includes(searchTerm)) ||
      (t.guidance && t.guidance.toLowerCase().includes(searchTerm))
    );
  }

  const totalTasks = filtered.length;
  const totalPages = Math.ceil(totalTasks / taskPageSize) || 1;
  if (taskCurrentPage > totalPages) taskCurrentPage = totalPages;
  if (taskCurrentPage < 1) taskCurrentPage = 1;

  if (totalTasks === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-12 text-slate-400">
          <i class="fa-solid fa-inbox text-3xl mb-2 text-slate-300 block"></i>
          <span>Chưa có nhiệm vụ giao việc nào phù hợp với bộ lọc hiện tại.</span>
        </td>
      </tr>`;
    renderPagination(0, 0, 0, 1, 1);
    return;
  }

  const startIndex = (taskCurrentPage - 1) * taskPageSize;
  const pageTasks = filtered.slice(startIndex, startIndex + taskPageSize);
  const now = new Date();

  const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                      JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");
  const userRank = getUserRank(currentUser);
  const isITAdmin = userRank === 0;

  pageTasks.forEach((t, idx) => {
    const stt = startIndex + idx + 1;
    const isOverdue = t.status !== "Đã hoàn thành" && t.deadline && new Date(t.deadline) < now;

    let priorityPill = "";
    if (t.priority === "Hỏa tốc") {
      priorityPill = '<span class="task-priority-pill task-priority-fire"><i class="fa-solid fa-bolt"></i> Hỏa tốc</span>';
    } else if (t.priority === "Khẩn") {
      priorityPill = '<span class="task-priority-pill task-priority-urgent"><i class="fa-solid fa-triangle-exclamation"></i> Khẩn</span>';
    } else {
      priorityPill = '<span class="task-priority-pill task-priority-normal">Bình thường</span>';
    }

    let statusPill = "";
    if (t.status === "Đã hoàn thành") {
      statusPill = '<span class="task-status-pill task-status-completed"><i class="fa-solid fa-check"></i> Hoàn thành</span>';
    } else if (isOverdue) {
      statusPill = '<span class="task-status-pill task-status-overdue"><i class="fa-solid fa-clock"></i> Quá hạn</span>';
    } else {
      statusPill = '<span class="task-status-pill task-status-inprogress"><i class="fa-solid fa-spinner fa-spin"></i> Đang làm</span>';
    }

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition cursor-pointer";
    tr.dataset.taskId = t.id;

    // Tệp đính kèm & Tải trực tiếp (Direct Download)
    const rawUrl = (t.fileUrl && t.fileUrl.startsWith('http')) ? t.fileUrl : (t.attachedFile?.url && t.attachedFile.url.startsWith('http')) ? t.attachedFile.url : "";
    const downloadUrl = rawUrl ? getDirectDownloadUrl(rawUrl) : (t.fileBase64 || t.attachedFile?.base64 || "");
    const fileName = t.fileName || t.attachedFile?.name || "Tệp đính kèm";

    let fileLinkHtml = "";
    if (downloadUrl) {
      fileLinkHtml = `
        <a href="${escapeHtml(downloadUrl)}" download="${escapeHtml(fileName)}"
           class="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition truncate max-w-[150px] shadow-2xs"
           title="Bấm để tải tệp về máy tính: ${escapeHtml(fileName)}"
           onclick="event.stopPropagation()">
          <i class="fa-solid fa-download text-[9px] text-blue-600 shrink-0"></i>
          <span class="truncate">Tải ${escapeHtml(fileName)}</span>
        </a>`;
    } else if (t.attachedFile?.name) {
      fileLinkHtml = `<span class="text-[10px] text-slate-500 truncate max-w-[130px]" title="${escapeHtml(t.attachedFile.name)}">📎 ${escapeHtml(t.attachedFile.name)}</span>`;
    }

    const canDelete = isITAdmin || userRank <= 2 || (currentUser && isSamePerson(currentUser, { fullname: t.leader, name: t.leader }));

    tr.innerHTML = `
      <td class="py-3 px-3 text-center font-bold text-slate-700">${stt}</td>
      <td class="py-3 px-3 text-slate-700 font-medium truncate max-w-[160px]" title="${escapeHtml(t.leader)}">${escapeHtml(t.leader)}</td>
      <td class="py-3 px-3 font-bold text-slate-900 truncate max-w-[160px]">
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-user-check text-blue-600 text-xs shrink-0"></i>
          <span class="truncate" title="${escapeHtml(t.assigneeName)}">${escapeHtml(t.assigneeName)}</span>
        </div>
        <span class="text-[10px] text-slate-400 font-normal block truncate">${escapeHtml(t.assigneeRole)}</span>
      </td>
      <td class="py-3 px-3">
        <div class="font-bold text-slate-800 line-clamp-1" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>
        ${t.guidance ? `<p class="text-[10px] text-slate-400 truncate mt-0.5" title="${escapeHtml(t.guidance)}">${escapeHtml(t.guidance)}</p>` : ""}
        <div class="mt-1 flex flex-wrap items-center gap-2">
          ${t.docRef ? `<span class="text-[10px] text-slate-500 font-semibold truncate max-w-[160px]" title="${escapeHtml(t.docRef)}">📜 ${escapeHtml(t.docRef)}</span>` : ""}
          ${fileLinkHtml}
        </div>
      </td>
      <td class="py-3 px-3 text-center ${isOverdue ? "text-rose-600 font-bold" : "text-slate-700"}">
        ${t.deadline ? escapeHtml(t.deadline.replace("T", " ")) : '<span class="text-slate-400">Chưa đặt</span>'}
      </td>
      <td class="py-3 px-3 text-center">${statusPill}</td>
      <td class="py-3 px-3 text-center">
        <div class="inline-flex items-center gap-1">
          <button type="button" data-action="view" data-id="${escapeHtml(t.id)}" title="Xem chi tiết nhiệm vụ" class="btn-icon btn-icon-secondary">
            <i class="fa-solid fa-eye"></i>
          </button>
          ${t.status !== "Đã hoàn thành" ? `
            <button type="button" data-action="done" data-id="${escapeHtml(t.id)}" title="Đánh dấu hoàn thành" class="btn-icon btn-icon-success">
              <i class="fa-solid fa-check"></i>
            </button>
          ` : `
            <button type="button" data-action="reopen" data-id="${escapeHtml(t.id)}" title="Mở lại nhiệm vụ" class="btn-icon btn-icon-warning">
              <i class="fa-solid fa-rotate-left"></i>
            </button>
          `}
          ${canDelete ? `
            <button type="button" data-action="delete" data-id="${escapeHtml(t.id)}" title="Xóa nhiệm vụ" class="btn-icon btn-icon-danger">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : ""}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderPagination(totalTasks, startIndex, pageTasks.length, taskCurrentPage, totalPages);
}

function markTaskDone(id) {
  const tasks = getStoredTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = "Đã hoàn thành";
    task.completedAt = new Date().toLocaleString("vi-VN");
    saveStoredTasks(tasks);
    syncTaskToCloud("updateTaskStatus", { id: task.id, status: task.status, completedAt: task.completedAt });
    showToast(`Đã ghi nhận hoàn thành nhiệm vụ ${id}!`, "success");
    if (currentViewingTaskId === id) openTaskModal(id);
  }
}

function markTaskReopen(id) {
  const tasks = getStoredTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = "Đang thực hiện";
    delete task.completedAt;
    saveStoredTasks(tasks);
    syncTaskToCloud("updateTaskStatus", { id: task.id, status: task.status, completedAt: "" });
    showToast(`Đã chuyển nhiệm vụ ${id} về trạng thái đang làm!`);
    if (currentViewingTaskId === id) openTaskModal(id);
  }
}

function deleteTask(id) {
  if (!confirm(`Bạn có chắc muốn xóa nhiệm vụ ${id} không?`)) return;
  let tasks = getStoredTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveStoredTasks(tasks);
  syncTaskToCloud("deleteTask", { id: id });
  showToast("Đã xóa nhiệm vụ thành công!");
  closeTaskModal();
}

function openTaskModal(id) {
  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
               JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");
  const tasks = getStoredTasks();
  const t = tasks.find(item => item.id === id);
  if (!t) return;
  if (user && !canUserViewTask(user, t)) {
    showToast("Đồng chí không có quyền xem chi tiết nhiệm vụ này!", "error");
    return;
  }

  currentViewingTaskId = id;
  const mtId = document.getElementById("modalTaskId");
  if (mtId) mtId.textContent = t.id;
  const mtCa = document.getElementById("modalTaskCreatedAt");
  if (mtCa) mtCa.textContent = `Ngày giao: ${t.createdAt}`;
  const mtTl = document.getElementById("modalTaskTitle");
  if (mtTl) mtTl.textContent = t.title;
  const mtLd = document.getElementById("modalTaskLeader");
  if (mtLd) mtLd.textContent = t.leader;
  const mtAs = document.getElementById("modalTaskAssignee");
  if (mtAs) mtAs.textContent = `${t.assigneeName} (${t.assigneeRole})`;
  const mtDp = document.getElementById("modalTaskDept");
  if (mtDp) mtDp.textContent = t.assigneeDept;
  const mtDl = document.getElementById("modalTaskDeadline");
  if (mtDl) mtDl.textContent = t.deadline ? t.deadline.replace("T", " ") : "Chưa đặt";
  const mtDr = document.getElementById("modalTaskDocRef");
  if (mtDr) {
    const docText = t.docRef ? escapeHtml(t.docRef) : "Không ghi số hiệu";
    const rawUrl = (t.fileUrl && t.fileUrl.startsWith('http')) ? t.fileUrl : (t.attachedFile?.url && t.attachedFile.url.startsWith('http')) ? t.attachedFile.url : "";
    const downloadUrl = rawUrl ? getDirectDownloadUrl(rawUrl) : (t.fileBase64 || t.attachedFile?.base64 || "");
    const fileName = t.fileName || t.attachedFile?.name || "Tệp đính kèm";

    let fileLink = "";
    if (downloadUrl) {
      fileLink = `<a href="${escapeHtml(downloadUrl)}" download="${escapeHtml(fileName)}" class="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"><i class="fa-solid fa-download"></i> Tải tệp xuống máy (${escapeHtml(fileName)})</a>`;
    } else if (t.attachedFile?.name) {
      fileLink = `<span class="ml-2 text-slate-600 font-medium">(📎 ${escapeHtml(fileName)})</span>`;
    }

    mtDr.innerHTML = `${docText} ${fileLink}`;
  }
  const mtGd = document.getElementById("modalTaskGuidance");
  if (mtGd) mtGd.textContent = t.guidance;

  const noteWrap = document.getElementById("modalTaskNoteWrapper");
  const noteEl = document.getElementById("modalTaskNote");
  if (t.note) {
    if (noteWrap) noteWrap.classList.remove("hidden");
    if (noteEl) noteEl.textContent = t.note;
  } else {
    if (noteWrap) noteWrap.classList.add("hidden");
  }

  const badgesContainer = document.getElementById("modalTaskBadges");
  if (badgesContainer) {
    badgesContainer.innerHTML = "";
    if (t.priority === "Hỏa tốc") {
      badgesContainer.innerHTML += '<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">🔴 HỎA TỐC</span>';
    } else if (t.priority === "Khẩn") {
      badgesContainer.innerHTML += '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">🟠 KHẨN</span>';
    }
  }

  const btnToggle = document.getElementById("modalBtnToggleStatus");
  if (btnToggle) {
    if (t.status === "Đã hoàn thành") {
      btnToggle.className = "btn btn-secondary btn-sm";
      btnToggle.innerHTML = '<i class="fa-solid fa-rotate-left"></i> <span>Chuyển Về Đang Làm</span>';
      btnToggle.onclick = () => markTaskReopen(t.id);
    } else {
      btnToggle.className = "btn btn-success btn-sm";
      btnToggle.innerHTML = '<i class="fa-solid fa-check"></i> <span>Xác Nhận Hoàn Thành</span>';
      btnToggle.onclick = () => markTaskDone(t.id);
    }
  }

  const modal = document.getElementById("taskDetailModal");
  if (modal) modal.classList.remove("hidden");
}

function closeTaskModal() {
  const modal = document.getElementById("taskDetailModal");
  if (modal) modal.classList.add("hidden");
  currentViewingTaskId = null;
}

// ========================================================
// 4B. QUẢN LÝ THÔNG CÁO & CHỈ THỊ PDF TOÀN CƠ QUAN
// (CHỈ GIÁM ĐỐC NGUYỄN CHIẾN THẮNG & IT ADMIN ĐƯỢC PHÉP ĐĂNG)
// ========================================================

/**
 * So sánh 2 văn bản xem có phải là cùng một tài liệu không (dùng để gộp và ghi đè dữ liệu từ Sheet)
 */
function isSameDocument(docA, docB) {
  if (!docA || !docB) return false;
  if (docA.id && docB.id && docA.id === docB.id) return true;

  const clean = (name) => (name || "")
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .replace(/(\.signed)+/gi, "")
    .replace(/[^a-z0-9]/gi, "");

  const nameA = clean(docA.fileName);
  const nameB = clean(docB.fileName);
  if (nameA && nameB && (nameA === nameB || nameA.includes(nameB) || nameB.includes(nameA))) {
    return true;
  }

  const cleanCode = (code) => (code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const codeA = cleanCode(docA.soHieu);
  const codeB = cleanCode(docB.soHieu);
  if (codeA && codeB && codeA.length >= 4 && codeB.length >= 4 && (codeA === codeB || codeA.includes(codeB) || codeB.includes(codeA))) {
    return true;
  }
  return false;
}

/**
 * Chuyển đổi linh hoạt chuỗi ngày tháng dd/MM/yyyy HH:mm sang Timestamp dạng số để sắp xếp chuẩn
 */
function parseDirectiveTimestamp(d) {
  if (!d) return 0;
  if (typeof d.timestamp === "number" && !isNaN(d.timestamp) && d.timestamp > 0) {
    return d.timestamp;
  }

  // Ưu tiên chuỗi có cả ngày và giờ (chứa ký tự :)
  let str = "";
  if (typeof d.timestamp === "string" && d.timestamp.includes(":")) {
    str = d.timestamp;
  } else if (typeof d.createdAt === "string" && d.createdAt.includes(":")) {
    str = d.createdAt;
  } else if (typeof d.timestamp === "string" && d.timestamp.trim()) {
    str = d.timestamp;
  } else if (typeof d.createdAt === "string" && d.createdAt.trim()) {
    str = d.createdAt;
  }

  if (str) {
    str = str.trim();
    const parts = str.split(/\s+/);
    const dateParts = (parts[0] || "").split("/");
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10) || 1;
      const month = (parseInt(dateParts[1], 10) || 1) - 1;
      const year = parseInt(dateParts[2], 10) || 2026;
      let hour = 0, min = 0, sec = 0;
      if (parts[1]) {
        const timeParts = parts[1].split(":");
        hour = parseInt(timeParts[0], 10) || 0;
        min = parseInt(timeParts[1], 10) || 0;
        sec = parseInt(timeParts[2], 10) || 0;
      }
      const dt = new Date(year, month, day, hour, min, sec);
      if (!isNaN(dt.getTime())) return dt.getTime();
    }
    const dt = new Date(str);
    if (!isNaN(dt.getTime())) return dt.getTime();
  }
  return 0;
}

function renderDirectives() {
  const listContainer = document.getElementById("directiveListContainer");
  const countBadge = document.getElementById("directiveCountBadge");
  const searchInput = document.getElementById("searchDirectiveInput");
  if (!listContainer) return;

  const rawList = getStoredDirectives();
  // QUY TẮC BẮT BUỘC: SẮP XẾP TỪ MỚI TỚI CŨ (Timestamp giảm dần)
  rawList.sort((a, b) => parseDirectiveTimestamp(b) - parseDirectiveTimestamp(a));

  const keyword = (searchInput?.value || "").toLowerCase().trim();
  const filtered = keyword ? rawList.filter(d => 
    (d.title && d.title.toLowerCase().includes(keyword)) ||
    (d.soHieu && d.soHieu.toLowerCase().includes(keyword)) ||
    (d.sender && d.sender.toLowerCase().includes(keyword)) ||
    (d.notes && d.notes.toLowerCase().includes(keyword))
  ) : rawList;

  if (countBadge) {
    countBadge.textContent = `${filtered.length} files`;
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="p-6 text-center text-slate-400">
        <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300 block"></i>
        <span class="text-xs">Không tìm thấy thông cáo/văn bản nào phù hợp.</span>
      </div>`;
    return;
  }

  // Tự động chọn văn bản đầu tiên nếu văn bản hiện tại không tồn tại
  if (!currentSelectedDirectiveId || !rawList.some(d => d.id === currentSelectedDirectiveId)) {
    if (filtered.length > 0) {
      currentSelectedDirectiveId = filtered[0].id;
    }
  }

  listContainer.innerHTML = "";
  filtered.forEach((d, index) => {
    const isNewest = (index === 0 && !keyword);
    const isSelected = (d.id === currentSelectedDirectiveId) || (!currentSelectedDirectiveId && index === 0);
    if (!currentSelectedDirectiveId && index === 0) {
      currentSelectedDirectiveId = d.id;
    }

    const item = document.createElement("button");
    item.type = "button";
    item.setAttribute("data-directive-id", d.id);
    item.className = `doc-nav-item w-full text-left p-2.5 rounded-lg border text-xs transition flex items-start space-x-2.5 ${
      isSelected 
        ? "border-sky-500 bg-sky-50 text-sky-950 font-semibold shadow-xs ring-1 ring-sky-400/40" 
        : "border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;
    item.onclick = () => selectDirective(d.id);

    item.innerHTML = `
      <i class="fa-regular fa-file-pdf ${isSelected ? "text-rose-600" : "text-rose-700"} font-semibold text-sm mt-0.5 shrink-0"></i>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-1 mb-0.5">
          <p class="font-bold truncate ${isSelected ? "text-sky-950" : "text-slate-900"} text-[11px]">
            ${escapeHtml(d.soHieu || "CHỈ ĐẠO CHUNG")}
          </p>
          <div class="flex items-center gap-1 shrink-0">
            ${isNewest ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-600 text-white animate-pulse uppercase">MỚI</span>' : ""}
            <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(d.createdAt ? d.createdAt.split(" ")[0] : "")}</span>
          </div>
        </div>
        <p class="font-medium ${isSelected ? "text-slate-900" : "text-slate-700"} truncate text-xs leading-snug">${escapeHtml(d.title)}</p>
        <p class="text-[10px] text-slate-500 font-mono truncate mt-0.5">
          ${escapeHtml(d.fileName || "Tệp PDF")} ${d.fileSize ? `(${escapeHtml(d.fileSize)})` : ""}
        </p>
      </div>
    `;
    listContainer.appendChild(item);
  });

  // Hiển thị nội dung chi tiết của văn bản đang chọn sang khung đọc bên phải
  if (currentSelectedDirectiveId) {
    const activeDoc = rawList.find(d => d.id === currentSelectedDirectiveId) || filtered[0];
    if (activeDoc) renderDirectiveDetail(activeDoc);
  }
}

function selectDirective(id) {
  currentSelectedDirectiveId = id;
  renderDirectives();
}

function renderDirectiveDetail(d) {
  const titleEl = document.getElementById("viewingDirectiveTitle");
  const dateEl = document.getElementById("viewingDirectiveDate");
  const metaEl = document.getElementById("viewingDirectiveMeta");
  const badgeEl = document.getElementById("viewingDirectiveBadge");
  const notesContainer = document.getElementById("directiveNotesContainer");
  const notesEl = document.getElementById("viewingDirectiveNotes");
  const fileLabelEl = document.getElementById("viewingDirectiveFileLabel");
  const btnOpenTab = document.getElementById("btnDirectiveOpenTab");
  const btnOpenTabInline = document.getElementById("btnDirectiveOpenTabInline");
  const btnDownload = document.getElementById("btnDirectiveDownload");
  const iframe = document.getElementById("directivePdfIframe");
  const placeholder = document.getElementById("directiveEmptyPlaceholder");

  if (titleEl) titleEl.textContent = d.title;
  if (dateEl) dateEl.textContent = `Ban hành: ${d.createdAt || "--"}`;
  if (metaEl) {
    metaEl.innerHTML = `<span class="inline-flex items-center gap-1.5 font-semibold text-slate-700"><i class="fa-solid fa-signature text-blue-600"></i> ${escapeHtml(d.sender)}</span> • <span class="font-mono text-slate-500">${escapeHtml(d.fileName || "Tệp PDF")} (${escapeHtml(d.fileSize || "PDF")})</span>`;
  }
  if (badgeEl) {
    badgeEl.textContent = d.soHieu || "CHỈ ĐẠO CHUNG";
  }

  if (fileLabelEl) {
    fileLabelEl.textContent = `${d.fileName || "Van_ban_chi_dao.pdf"} (${d.fileSize || "PDF"})`;
  }

  if (d.notes) {
    if (notesContainer) notesContainer.classList.remove("hidden");
    if (notesEl) notesEl.textContent = d.notes;
  } else {
    if (notesContainer) notesContainer.classList.add("hidden");
  }

  const pdfUrl = d.previewUrl || d.fileUrl || d.downloadUrl || "";
  const directDownload = d.downloadUrl || d.fileUrl || "";
  const openUrl = d.viewUrl || pdfUrl || directDownload;

  if (btnOpenTab) {
    btnOpenTab.href = openUrl;
  }
  if (btnOpenTabInline) {
    btnOpenTabInline.href = openUrl;
  }
  if (btnDownload) {
    btnDownload.href = directDownload;
    btnDownload.download = d.fileName || "Van_ban_chi_dao.pdf";
  }

  if (iframe) {
    if (pdfUrl) {
      iframe.src = pdfUrl;
      iframe.classList.remove("hidden");
      if (placeholder) placeholder.classList.add("hidden");
    } else {
      iframe.src = "";
      iframe.classList.add("hidden");
      if (placeholder) placeholder.classList.remove("hidden");
    }
  }
}

function openUploadDirectiveModal() {
  const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                      JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

  if (!canUploadDirectives(currentUser)) {
    showToast("Đặc quyền từ chối: Chỉ có Giám đốc Nguyễn Chiến Thắng mới có thẩm quyền ban hành/đăng tải văn bản chỉ đạo toàn cơ quan!", "error");
    return;
  }

  // Reset form trước khi điền dữ liệu
  const form = document.getElementById("directiveUploadForm");
  if (form) form.reset();
  removeAttachedDirectivePdf();

  const senderInput = document.getElementById("directiveSender");
  if (senderInput) {
    senderInput.value = "Nguyễn Chiến Thắng — Giám đốc Chi nhánh 23";
  }

  const modal = document.getElementById("uploadDirectiveModal");
  if (modal) modal.classList.remove("hidden");
}

function closeUploadDirectiveModal() {
  const modal = document.getElementById("uploadDirectiveModal");
  if (modal) modal.classList.add("hidden");
}

function removeAttachedDirectivePdf() {
  const dirFileInput = document.getElementById("directiveFileInput");
  if (dirFileInput) dirFileInput.value = "";
  attachedDirectivePdf = null;
  window.attachedDirectivePdf = null;
  const filePreview = document.getElementById("directiveFilePreview");
  if (filePreview) filePreview.classList.add("hidden");
  const fileLabel = document.getElementById("directiveFileLabel");
  if (fileLabel) fileLabel.textContent = "Bấm để chọn tệp PDF từ máy tính hoặc kéo thả vào đây";
}

/**
 * Tải lên tệp PDF trực tiếp & không yêu cầu điền form rườm rà (Zero-friction upload)
 * Dành riêng cho Giám đốc Nguyễn Chiến Thắng & IT Admin
 */
function triggerDirectPdfUpload() {
  const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                      JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

  if (!canUploadDirectives(currentUser)) {
    showToast("Đặc quyền từ chối: Chỉ có Giám đốc Nguyễn Chiến Thắng mới có thẩm quyền ban hành/đăng tải văn bản chỉ đạo toàn cơ quan!", "error");
    return;
  }
  const input = document.getElementById("quickDirectiveFileInput");
  if (input) {
    input.click();
  }
}

function handleDirectPdfUpload(file) {
  if (!file) return;

  const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                      JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

  if (!canUploadDirectives(currentUser)) {
    showToast("Đặc quyền từ chối: Chỉ có Giám đốc Nguyễn Chiến Thắng mới có thẩm quyền ban hành/đăng tải văn bản chỉ đạo toàn cơ quan!", "error");
    return;
  }

  const fileNameLower = file.name.toLowerCase();
  if (!fileNameLower.endsWith(".pdf") && file.type !== "application/pdf") {
    showToast("Lỗi định dạng: Chỉ chấp nhận duy nhất tệp văn bản chuẩn PDF (*.pdf)! Vui lòng không chọn file Word hay Excel.", "error");
    return;
  }

  if (file.size > 25 * 1024 * 1024) {
    showToast("Dung lượng tệp PDF vượt quá 25MB! Vui lòng chọn tệp nhỏ hơn.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const base64Data = evt.target.result;
    const now = new Date();
    const dateStr = now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + 
                    now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    // Tự động làm sạch tên file làm trích yếu văn bản
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    let cleanTitle = baseName.replace(/[_-]+/g, " ").trim();
    if (cleanTitle.length > 0) {
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
    }

    // Nhận diện số hiệu nếu tên tệp bắt đầu bằng số/ký tự văn bản (vd: 2637_QD_SNNMT, 9999-TB-CN23...)
    let detectedSoHieu = "CHỈ ĐẠO CHUNG";
    const soHieuMatch = baseName.match(/^([0-9]+[\/_-][A-Za-z0-9đĐ_-]+)/);
    if (soHieuMatch) {
      detectedSoHieu = soHieuMatch[1].replace(/[_-]/g, "/").toUpperCase();
    }

    const sizeStr = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(2) + " MB" 
      : (file.size / 1024).toFixed(1) + " KB";

    const docId = "VB-" + now.getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    // Dùng Blob URL cho tệp lớn để trình duyệt hiển thị PDF mượt mà, không gây tràn bộ nhớ localStorage
    const localPreviewUrl = (base64Data.length > 100000 && typeof URL !== "undefined" && URL.createObjectURL)
      ? URL.createObjectURL(file)
      : base64Data;

    window.__sessionDirectiveUrls = window.__sessionDirectiveUrls || {};
    window.__sessionDirectiveUrls[docId] = {
      previewUrl: localPreviewUrl,
      downloadUrl: localPreviewUrl,
      viewUrl: localPreviewUrl
    };

    const newDirective = {
      id: docId,
      soHieu: detectedSoHieu,
      title: cleanTitle || file.name,
      sender: "Nguyễn Chiến Thắng — Giám đốc",
      createdAt: dateStr,
      timestamp: now.getTime(), // BẮT BUỘC timestamp mới nhất để luôn hiển thị trên đầu
      fileName: file.name,
      fileSize: sizeStr,
      previewUrl: localPreviewUrl,
      downloadUrl: localPreviewUrl,
      viewUrl: localPreviewUrl,
      notes: "Văn bản ban hành trực tiếp từ Ban Giám đốc"
    };

    const directives = getStoredDirectives();
    directives.unshift(newDirective); // Đưa lên vị trí đầu tiên (MỚI NHẤT)
    saveStoredDirectives(directives);

    currentSelectedDirectiveId = newDirective.id;
    renderDirectives();

    showToast(`Đang lưu "${file.name}" lên Google Drive & Google Sheet...`, "info");
    // Đồng bộ cloud trong nền kèm dữ liệu base64 gốc
    syncDirectiveToCloud(newDirective, base64Data);
  };

  reader.readAsDataURL(file);
}

async function syncDirectiveToCloud(directive, rawBase64 = "") {
  try {
    const fileBase64 = rawBase64 || (directive.previewUrl && directive.previewUrl.startsWith("data:") ? directive.previewUrl : "");
    const targetScriptUrl = getScriptUrl();
    const res = await fetch(targetScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "createDirective",
        ...directive,
        previewUrl: "",
        downloadUrl: "",
        viewUrl: "",
        fileBase64: fileBase64
      })
    });
    const result = await res.json();
    if (result && result.success && result.fileUrl) {
      directive.previewUrl = result.previewUrl || result.fileUrl;
      directive.downloadUrl = result.downloadUrl || result.fileUrl;
      directive.viewUrl = result.fileUrl;
      const list = getStoredDirectives();
      const idx = list.findIndex(d => d.id === directive.id);
      if (idx !== -1) {
        list[idx] = directive;
        saveStoredDirectives(list);
      }
      showToast(`Đã lưu "${directive.fileName}" lên Google Drive & Google Sheet thành công!`, "success");
    } else if (result && result.message) {
      showToast("Cảnh báo đồng bộ Drive: " + result.message, "warning");
    }
  } catch (err) {
    console.log("Cloud directive sync local mode:", err);
  }
}

let isSyncingDirectives = false;

/**
 * Đồng bộ văn bản chỉ đạo trực tiếp từ Google Sheet tab ThongCaoChiThi
 * @param {boolean} forceRefresh - Bấm thủ công thì hiển thị thông báo toast
 */
async function syncDirectivesFromCloud(forceRefresh = false) {
  if (isSyncingDirectives) return false;
  isSyncingDirectives = true;

  const syncBtn = document.getElementById("btnSyncDirectives");
  const syncIcon = document.getElementById("syncDirectiveIcon");
  const reloadIcon = document.getElementById("reloadDirectivesListIcon");

  if (syncIcon) syncIcon.classList.add("fa-spin");
  if (reloadIcon) reloadIcon.classList.add("fa-spin");
  if (syncBtn) syncBtn.classList.add("opacity-75", "pointer-events-none");

  try {
    const targetScriptUrl = getScriptUrl();
    const res = await fetch(`${targetScriptUrl}?action=getDirectives&t=${Date.now()}`);
    if (res.ok) {
      const result = await res.json();
      if (result && result.success && Array.isArray(result.directives)) {
        // Loại bỏ các dòng dữ liệu test cũ (tệp giả rỗng 79 bytes không xem trước được)
        const brokenDriveIds = [
          "1AkcbxXsehvLWdrW7lnsANJ3vePdDqAkh",
          "1Ts2xwJ4TNfFaDt2t-OHvP1WrtzRxJukG",
          "1njx_9KZMmVYse8v047ov352ZI-H1D93D",
          "1gC7vJbRPJ-9xNMg2C8Jm1rzFXhPBRSeF",
          "1FZSoC3p-Fqhh_F1IxynQrH1lP7n5Bw9h",
          "1Mv76Y49TASsdbAukya_aNDml_bmmdGan"
        ];
        const brokenTestNames = [
          "thong_bao_khan_9999_cn23.pdf",
          "123_qd_ubnd_ke_hoach_giam_sat_dat_dai_2026.pdf"
        ];

        const validDirectives = result.directives.filter(d => {
          const fname = (d.fileName || "").toLowerCase().trim();
          const url = `${d.previewUrl || ""} ${d.viewUrl || ""} ${d.fileUrl || ""}`;
          if (brokenTestNames.includes(fname)) return false;
          if (brokenDriveIds.some(bid => url.includes(bid))) return false;
          return true;
        });

        if (validDirectives.length > 0) {
          const cloudDocs = validDirectives.map((d, idx) => {
            const rawName = d.fileName || `Van_ban_${idx + 1}.pdf`;
            const cleanName = rawName.replace(/\.pdf$/i, "").replace(/(\.signed)+/gi, "").trim();

            let detectedSoHieu = d.soHieu || d.code || "";
            if (!detectedSoHieu || detectedSoHieu === "CHỈ ĐẠO CHUNG") {
              const m = cleanName.match(/^([0-9]+[\/_-][A-Za-z0-9đĐ_-]+)/);
              if (m) {
                detectedSoHieu = m[1].replace(/_/g, "/").toUpperCase();
              } else {
                const numMatch = cleanName.match(/^([0-9]+)/);
                if (numMatch) {
                  detectedSoHieu = `${numMatch[1]}/VPĐK`;
                } else {
                  detectedSoHieu = "CHỈ ĐẠO CHUNG";
                }
              }
            }

            const numTs = parseDirectiveTimestamp(d) || (Date.now() - idx * 1000);

            // Chuẩn hóa link Google Drive preview/download
            let viewUrl = d.viewUrl || d.previewUrl || d.downloadUrl || d.fileUrl || "";
            let downloadUrl = d.downloadUrl || d.fileUrl || viewUrl;
            let previewUrl = d.previewUrl || viewUrl;

            if (viewUrl && viewUrl.includes("drive.google.com")) {
              const fileIdMatch = viewUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
              if (fileIdMatch) {
                const fileId = fileIdMatch[1];
                previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
              }
            }

            return {
              id: d.id || `CLOUD_${idx + 1}_${numTs}`,
              soHieu: detectedSoHieu,
              title: d.title || cleanName.replace(/[_-]+/g, " "),
              sender: d.sender || d.signer || "Nguyễn Chiến Thắng — Giám đốc",
              createdAt: (typeof d.timestamp === "string" && d.timestamp) || d.createdAt || new Date(numTs).toLocaleDateString("vi-VN"),
              timestamp: numTs,
              fileName: rawName,
              fileSize: d.fileSize || "PDF",
              previewUrl: previewUrl,
              viewUrl: viewUrl,
              downloadUrl: downloadUrl,
              fileUrl: previewUrl || downloadUrl,
              notes: d.notes || ""
            };
          });

          // Hợp nhất: Toàn bộ cloudDocs từ Google Sheet là nguồn chuẩn mực
          // Loại bỏ các mục cloud cũ (VB_*, CLOUD_*) đã bị xóa trên Sheet; chỉ giữ lại văn bản mẫu offline nếu không trùng
          const existingList = getStoredDirectives();
          const mergedList = [...cloudDocs];
          existingList.forEach(localItem => {
            const isOldCloudItem = localItem.id && (localItem.id.startsWith("VB_") || localItem.id.startsWith("CLOUD_"));
            if (isOldCloudItem) return; // Bỏ qua cache cloud cũ đã xóa trên Sheet
            const isDuplicate = cloudDocs.some(c => isSameDocument(c, localItem));
            if (!isDuplicate) {
              mergedList.push(localItem);
            }
          });

          // QUY TẮC BẮT BUỘC: Sắp xếp văn bản từ MỚI NHẤT tới CŨ NHẤT (Timestamp giảm dần)
          mergedList.sort((a, b) => parseDirectiveTimestamp(b) - parseDirectiveTimestamp(a));
          saveStoredDirectives(mergedList);

          // Tự động chọn văn bản mới nhất trên đầu để xem ngay trong Document Viewer
          if (mergedList.length > 0) {
            currentSelectedDirectiveId = mergedList[0].id;
          }
          renderDirectives();

          if (forceRefresh) {
            showToast(`Đã đồng bộ thành công ${cloudDocs.length} văn bản từ Google Sheet!`, "success");
          }
          return true;
        } else {
          // Trường hợp tab trên sheet trống (0 dòng): dọn bỏ toàn bộ bản ghi cloud cũ, chỉ giữ tệp mẫu gốc cục bộ
          const cleanLocalList = [...DEFAULT_DIRECTIVES];
          saveStoredDirectives(cleanLocalList);
          currentSelectedDirectiveId = cleanLocalList[0]?.id || null;
          renderDirectives();
          if (forceRefresh) {
            showToast("Tab ThongCaoChiThi trên Google Sheet hiện đang trống — hiển thị tài liệu mẫu nội bộ.", "info");
          }
          return true;
        }
      } else {
        if (forceRefresh) {
          showToast(result.message || "Không thể nạp danh sách từ Google Sheet!", "warning");
        }
      }
    } else if (forceRefresh) {
      showToast("Không thể kết nối đến máy chủ Google Sheet! (HTTP " + res.status + ")", "error");
    }
  } catch (err) {
    console.warn("Lỗi syncDirectivesFromCloud:", err);
    if (forceRefresh) {
      showToast("Lỗi đồng bộ: " + (err.message || String(err)), "warning");
    }
  } finally {
    if (syncIcon) syncIcon.classList.remove("fa-spin");
    if (reloadIcon) reloadIcon.classList.remove("fa-spin");
    if (syncBtn) syncBtn.classList.remove("opacity-75", "pointer-events-none");
    isSyncingDirectives = false;
  }
  return false;
}
window.syncDirectivesFromCloud = syncDirectivesFromCloud;
window.refreshDirectivesFromCloud = () => syncDirectivesFromCloud(true);

// ========================================================
// 5. KHỞI CHẠY & EVENT DELEGATION
// ========================================================
window.addEventListener("DOMContentLoaded", () => {
  try {
    initUserSession();
    populateStaffDropdown();
    syncStaffFromCloud();
    updateTaskKPIs();
    renderTasksTable();
    renderDirectives();
    syncTasksFromCloud();
    syncDirectivesFromCloud(false);
  } catch (err) {
    console.error("LỖI KHỞI ĐỘNG GIAO VIỆC:", err);
    window.__dom_error = err.stack || String(err);
  }

  // Nút Làm mới dữ liệu từ Google Sheet (xóa sạch bộ nhớ đệm, cập nhật mới nhất)
  const btnRefresh = document.getElementById("btnRefreshTasks");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      syncTasksFromCloud(true);
    });
  }

  // Nút Đồng bộ văn bản chỉ đạo PDF từ Google Sheet
  const btnSyncDirectives = document.getElementById("btnSyncDirectives");
  if (btnSyncDirectives) {
    btnSyncDirectives.addEventListener("click", (e) => {
      e.preventDefault();
      syncDirectivesFromCloud(true);
    });
  }
  const btnReloadList = document.getElementById("btnReloadDirectivesList");
  if (btnReloadList) {
    btnReloadList.addEventListener("click", (e) => {
      e.preventDefault();
      syncDirectivesFromCloud(true);
    });
  }

  // Chọn số lượng hiển thị trên mỗi trang (Pagination Page Size)
  const pageSizeSelect = document.getElementById("pageSizeSelect");
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener("change", (e) => {
      taskPageSize = parseInt(e.target.value, 10) || 10;
      taskCurrentPage = 1;
      renderTasksTable();
    });
  }

  // Dropdown lọc tổ giao việc
  const deptFilterSelect = document.getElementById("filterStaffDept");
  const staffDetailHint = document.getElementById("assignStaffDetail");
  const staffSelect = document.getElementById("assignStaff");

  if (deptFilterSelect) {
    deptFilterSelect.addEventListener("change", () => {
      populateStaffDropdown(deptFilterSelect.value);
      if (staffDetailHint) staffDetailHint.textContent = "Đã cập nhật danh sách theo Tổ đã lọc";
    });
  }

  if (staffSelect) {
    staffSelect.addEventListener("change", () => {
      const selectedId = staffSelect.value;
      const staff = activeStaffList.find(s => s.id === selectedId);
      if (staff && staffDetailHint) {
        staffDetailHint.innerHTML = `<span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-id-badge text-amber-500"></i> <strong>Tổ:</strong> ${staff.dept} | <strong>Chức vụ:</strong> ${staff.role} ${staff.note ? `<span class="text-rose-600 font-bold">(${staff.note})</span>` : ""}</span>`;
      }
    });
  }

  // File Upload
  const fileInput = document.getElementById("taskFileInput");
  const filePreview = document.getElementById("fileUploadPreview");
  const fileLabel = document.getElementById("fileUploadLabel");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 15 * 1024 * 1024) {
          showToast("Dung lượng tệp vượt quá 15MB! Vui lòng chọn tệp nhỏ hơn.", "error");
          fileInput.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          attachedFileInfo = {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            type: file.type || "application/octet-stream",
            base64: evt.target.result
          };
        };
        reader.readAsDataURL(file);

        if (filePreview) {
          filePreview.classList.remove("hidden");
          filePreview.innerHTML = `<span><i class="fa-solid fa-file mr-1"></i> <strong>${escapeHtml(file.name)}</strong> (${(file.size / 1024).toFixed(1)} KB)</span> <button type="button" class="text-rose-600 hover:text-rose-800 font-bold ml-2" onclick="removeAttachedFile()">✕ Hủy</button>`;
        }
        if (fileLabel) fileLabel.textContent = file.name;
      }
    });
  }

  // Event Delegation cho bảng task
  const tbody = document.getElementById("taskTableBody");
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (actionBtn) {
        e.stopPropagation();
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === "view") openTaskModal(id);
        else if (action === "done") markTaskDone(id);
        else if (action === "reopen") markTaskReopen(id);
        else if (action === "delete") deleteTask(id);
        return;
      }

      const row = e.target.closest("tr[data-task-id]");
      if (row) {
        openTaskModal(row.dataset.taskId);
      }
    });
  }

  // Form submit
  const form = document.getElementById("taskAssignmentForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                          JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

      const myRank = getUserRank(currentUser);
      if (myRank >= 5) {
        showToast("Đồng chí không có thẩm quyền phát lệnh giao việc!", "error");
        return;
      }

      const staffId = staffSelect?.value;
      const staff = activeStaffList.find(s => s.id === staffId);
      if (!staff) {
        showToast("Vui lòng chọn cán bộ tiếp nhận việc!", "error");
        return;
      }

      if (!canAssignTaskTo(currentUser, staff)) {
        showToast("Vi phạm quy tắc giao việc: Cấp lãnh đạo chỉ được giao cho cấp dưới thuộc thẩm quyền trong tổ chuyên môn!", "error");
        return;
      }

      const leaderValue = document.getElementById("assignLeader")?.value || 
                          (currentUser ? `${currentUser.fullname || currentUser.name} — ${currentUser.position || currentUser.role}` : "");

      const newTask = {
        id: "TASK_" + Math.floor(1000 + Math.random() * 9000),
        leader: leaderValue,
        assigneeId: staff.id,
        assigneeName: staff.name,
        assigneeRole: staff.role,
        assigneeDept: staff.dept,
        title: document.getElementById("taskTitle")?.value.trim() || "",
        priority: document.getElementById("taskPriority")?.value || "Bình thường",
        docRef: document.getElementById("taskDocRef")?.value.trim() || "",
        attachedFile: attachedFileInfo,
        fileBase64: attachedFileInfo?.base64 || "",
        fileName: attachedFileInfo?.name || "",
        guidance: document.getElementById("leaderGuidance")?.value.trim() || "",
        deadline: document.getElementById("taskDeadline")?.value || "",
        note: document.getElementById("taskNote")?.value.trim() || "",
        status: "Đang thực hiện",
        createdAt: new Date().toLocaleString("vi-VN")
      };

      const tasks = getStoredTasks();
      tasks.unshift(newTask);
      saveStoredTasks(tasks);

      syncTaskToCloud("createTask", newTask);
      showToast(`Đã phát lệnh giao việc thành công cho đồng chí ${staff.name}!`, "success");

      const tt = document.getElementById("taskTitle");
      if (tt) tt.value = "";
      const tdr = document.getElementById("taskDocRef");
      if (tdr) tdr.value = "";
      const lg = document.getElementById("leaderGuidance");
      if (lg) lg.value = "";
      const tn = document.getElementById("taskNote");
      if (tn) tn.value = "";
      removeAttachedFile();

      setTimeout(() => {
        switchTaskTab("tracking");
      }, 600);
    });
  }

  // Tab switching đồng bộ hệ sinh thái (1. Thông cáo & Chỉ thị PDF vs 2. Giao việc & Chỉ đạo vs 3. Bảng tiến độ)
  function switchTaskTab(tabName = "directives") {
    const tabBtnAssign = document.getElementById("tabBtnAssign");
    const tabBtnTracking = document.getElementById("tabBtnTracking");
    const tabBtnDirectives = document.getElementById("tabBtnDirectives");

    const panelAssign = document.getElementById("panelAssign");
    const panelTracking = document.getElementById("panelTracking");
    const panelDirectives = document.getElementById("panelDirectives");

    const btnQuickOpenAssign = document.getElementById("btnQuickOpenAssign");
    const btnQuickOpenUploadDirective = document.getElementById("btnQuickOpenUploadDirective");

    const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                        JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

    if (tabName === "assign") {
      const myRank = getUserRank(currentUser);
      if (myRank >= 5) {
        showToast("Đồng chí không có quyền giao việc! Chức năng này chỉ dành cho Ban Giám đốc và Lãnh đạo các Tổ chuyên môn.", "error");
        tabName = "directives";
      }
    }

    // Xóa active toàn bộ tabs & ẩn toàn bộ panels
    [tabBtnDirectives, tabBtnAssign, tabBtnTracking].forEach(btn => btn?.classList.remove("active"));
    [panelDirectives, panelAssign, panelTracking].forEach(p => p?.classList.add("hidden"));
    if (btnQuickOpenAssign) btnQuickOpenAssign.style.display = "none";
    if (btnQuickOpenUploadDirective) btnQuickOpenUploadDirective.classList.add("hidden");
    const btnSyncDirectives = document.getElementById("btnSyncDirectives");
    if (btnSyncDirectives) btnSyncDirectives.classList.add("hidden");

    if (tabName === "assign") {
      tabBtnAssign?.classList.add("active");
      panelAssign?.classList.remove("hidden");
    } else if (tabName === "tracking") {
      tabBtnTracking?.classList.add("active");
      panelTracking?.classList.remove("hidden");
      const isLeader = (getUserRank(currentUser) <= 4);
      if (isLeader && btnQuickOpenAssign) {
        btnQuickOpenAssign.style.display = "";
      }
      renderTasksTable();
    } else {
      // MẶC ĐỊNH: TAB 1 - THÔNG CÁO & CHỈ THỊ PDF (DOCUMENT VIEWER)
      tabBtnDirectives?.classList.add("active");
      panelDirectives?.classList.remove("hidden");
      // CHỈ hiển thị nút Đăng văn bản nhanh nếu là Giám đốc Nguyễn Chiến Thắng hoặc IT Admin Đỗ Trọng Minh Quân
      const canUploadDoc = canUploadDirectives(currentUser);
      if (btnQuickOpenUploadDirective) {
        if (canUploadDoc) {
          btnQuickOpenUploadDirective.classList.remove("hidden");
          btnQuickOpenUploadDirective.style.display = "";
        } else {
          btnQuickOpenUploadDirective.classList.add("hidden");
          btnQuickOpenUploadDirective.style.display = "none";
        }
      }
      // Hiển thị nút Tải lại Sheet ở Tab 1
      if (btnSyncDirectives) {
        btnSyncDirectives.classList.remove("hidden");
        btnSyncDirectives.style.display = "";
      }
      renderDirectives();
    }
  }
  window.switchTaskTab = switchTaskTab;

  document.getElementById("tabBtnTracking")?.addEventListener("click", () => switchTaskTab("tracking"));
  document.getElementById("tabBtnAssign")?.addEventListener("click", () => switchTaskTab("assign"));
  document.getElementById("tabBtnDirectives")?.addEventListener("click", () => switchTaskTab("directives"));
  document.getElementById("btnQuickOpenAssign")?.addEventListener("click", () => switchTaskTab("assign"));
  document.getElementById("btnBackToTracking")?.addEventListener("click", () => switchTaskTab("tracking"));
  document.getElementById("searchDirectiveInput")?.addEventListener("input", renderDirectives);

  // Kéo thả & Tải lên nhanh PDF không cần điền form (Zero-friction Directive PDF upload)
  const quickDirectiveFileInput = document.getElementById("quickDirectiveFileInput");
  if (quickDirectiveFileInput) {
    quickDirectiveFileInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleDirectPdfUpload(file);
      }
      e.target.value = "";
    });
  }

  const dropDirectiveArea = document.getElementById("dropDirectiveArea");
  if (dropDirectiveArea) {
    dropDirectiveArea.addEventListener("click", () => {
      triggerDirectPdfUpload();
    });
    dropDirectiveArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropDirectiveArea.classList.add("border-sky-600", "bg-sky-100");
    });
    dropDirectiveArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropDirectiveArea.classList.remove("border-sky-600", "bg-sky-100");
    });
    dropDirectiveArea.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropDirectiveArea.classList.remove("border-sky-600", "bg-sky-100");
      const dt = e.dataTransfer;
      const file = dt?.files?.[0];
      if (file) {
        handleDirectPdfUpload(file);
      }
    });
  }

  // File Upload cho Thông cáo PDF (Bắt buộc *.pdf)
  const dirFileInput = document.getElementById("directiveFileInput");
  if (dirFileInput) {
    dirFileInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileNameLower = file.name.toLowerCase();
      if (!fileNameLower.endsWith(".pdf") && file.type !== "application/pdf") {
        showToast("Lỗi định dạng: Chỉ chấp nhận duy nhất tệp văn bản chuẩn PDF (*.pdf)! Vui lòng không chọn file Word hay Excel.", "error");
        dirFileInput.value = "";
        return;
      }

      if (file.size > 25 * 1024 * 1024) {
        showToast("Dung lượng tệp PDF vượt quá 25MB! Vui lòng nén tệp trước khi tải lên.", "error");
        dirFileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        attachedDirectivePdf = {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          base64: evt.target.result
        };
      };
      reader.readAsDataURL(file);

      const fileLabel = document.getElementById("directiveFileLabel");
      if (fileLabel) fileLabel.textContent = file.name;

      const filePreview = document.getElementById("directiveFilePreview");
      if (filePreview) {
        filePreview.classList.remove("hidden");
        filePreview.innerHTML = `
          <div class="flex items-center gap-2 font-bold truncate">
            <i class="fa-solid fa-file-pdf text-rose-600 text-base"></i>
            <span class="truncate">${escapeHtml(file.name)}</span>
            <span class="text-[11px] text-slate-500 font-mono">(${(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
          <button type="button" class="text-rose-600 hover:text-rose-800 font-bold ml-2 shrink-0" onclick="removeAttachedDirectivePdf()">✕ Hủy</button>
        `;
      }
    });
  }

  // Submit Form Đăng Văn Bản Chỉ Đạo PDF
  const dirForm = document.getElementById("directiveUploadForm");
  if (dirForm) {
    dirForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                          JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

      if (!canUploadDirectives(currentUser)) {
        showToast("Đặc quyền từ chối: Chỉ có Giám đốc Nguyễn Chiến Thắng mới có thẩm quyền đăng tải văn bản chỉ đạo!", "error");
        return;
      }

      const effectivePdf = attachedDirectivePdf || window.attachedDirectivePdf;
      if (!effectivePdf || !effectivePdf.base64) {
        showToast("Vui lòng chọn tệp văn bản PDF trước khi đăng tải!", "error");
        return;
      }

      const docRef = document.getElementById("directiveDocRef")?.value.trim() || "";
      const title = document.getElementById("directiveTitle")?.value.trim() || "";
      const notes = document.getElementById("directiveNotes")?.value.trim() || "";

      const now = new Date();
      const dateStr = now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + 
                      now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      const newDirective = {
        id: "VB-" + now.getFullYear() + "-" + Math.floor(100 + Math.random() * 900),
        soHieu: docRef || "CHỈ ĐẠO CHUNG",
        title: title,
        sender: "Nguyễn Chiến Thắng — Giám đốc",
        createdAt: dateStr,
        timestamp: now.getTime(), // BẮT BUỘC timestamp mới nhất để luôn hiển thị trên đầu
        fileName: effectivePdf.name,
        fileSize: effectivePdf.size,
        previewUrl: effectivePdf.base64,
        downloadUrl: effectivePdf.base64,
        viewUrl: effectivePdf.base64,
        notes: notes
      };

      const directives = getStoredDirectives();
      directives.unshift(newDirective); // Đưa lên vị trí đầu tiên (MỚI NHẤT)
      saveStoredDirectives(directives);

      currentSelectedDirectiveId = newDirective.id;
      renderDirectives();

      // Đồng bộ cloud trong nền (nếu có mạng)
      syncDirectiveToCloud(newDirective, effectivePdf.base64);

      showToast(`Đã ban hành văn bản chỉ đạo "${title.slice(0, 30)}..." thành công!`, "success");
      closeUploadDirectiveModal();
    });
  }

  // Xuất CSV
  const btnExport = document.getElementById("btnExportTaskCsv");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const tasks = getStoredTasks();
      if (tasks.length === 0) {
        showToast("Chưa có dữ liệu nhiệm vụ nào để xuất!", "error");
        return;
      }
      const headers = ["Mã việc", "Người giao việc", "Cán bộ nhận", "Chức danh", "Tổ chuyên môn", "Tên nhiệm vụ", "Độ khẩn", "Văn bản căn cứ", "Ý kiến chỉ đạo", "Hạn chót Deadline", "Trạng thái", "Ngày tạo"];
      const rows = [headers.join(",")];
      tasks.forEach(t => {
        const row = [
          `"${t.id}"`,
          `"${t.leader}"`,
          `"${t.assigneeName}"`,
          `"${t.assigneeRole}"`,
          `"${t.assigneeDept}"`,
          `"${t.title.replace(/"/g, '""')}"`,
          `"${t.priority}"`,
          `"${(t.docRef || "").replace(/"/g, '""')}"`,
          `"${t.guidance.replace(/"/g, '""')}"`,
          `"${t.deadline || ""}"`,
          `"${t.status}"`,
          `"${t.createdAt}"`
        ];
        rows.push(row.join(","));
      });
      const blob = new Blob(["\uFEFF" + rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DS_Giao_Viec_CN23_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Đã xuất danh sách giao việc ra tệp Excel CSV!", "success");
    });
  }

  // Nút xóa tất cả đã được lược bỏ (chỉ xóa theo từng dòng nhiệm vụ)

  const btnReset = document.getElementById("btnResetTaskForm");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      document.getElementById("taskAssignmentForm")?.reset();
      removeAttachedFile();
      initUserSession(); // Khôi phục lại tên lãnh đạo, tổ cố định và dropdown
      showToast("Đã làm mới biểu mẫu giao việc");
    });
  }

  // Bộ lọc kết hợp phân trang
  const resetPageAndRender = () => {
    taskCurrentPage = 1;
    renderTasksTable();
  };
  document.getElementById("filterTaskStatus")?.addEventListener("change", resetPageAndRender);
  document.getElementById("filterTaskDept")?.addEventListener("change", resetPageAndRender);
  document.getElementById("searchTaskInput")?.addEventListener("input", resetPageAndRender);
});

// Xuất các hàm ra phạm vi toàn cục
window.markTaskDone = markTaskDone;
window.markTaskReopen = markTaskReopen;
window.deleteTask = deleteTask;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.removeAttachedFile = removeAttachedFile;
window.openUploadDirectiveModal = openUploadDirectiveModal;
window.closeUploadDirectiveModal = closeUploadDirectiveModal;
window.selectDirective = selectDirective;
window.removeAttachedDirectivePdf = removeAttachedDirectivePdf;
window.triggerDirectPdfUpload = triggerDirectPdfUpload;
window.handleDirectPdfUpload = handleDirectPdfUpload;
