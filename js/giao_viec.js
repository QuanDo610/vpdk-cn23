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
const STAFF_CN23 = [
  // Ban Giám đốc (3)
  { id: "BGD_01", name: "Nguyễn Chiến Thắng", role: "Giám đốc", dept: "Ban Giám đốc", note: "" },
  { id: "BGD_02", name: "Đặng Huy Cường", role: "Phó Giám đốc", dept: "Ban Giám đốc", note: "" },
  { id: "BGD_03", name: "Nguyễn Thị Lệ Hằng", role: "Phó Giám đốc", dept: "Ban Giám đốc", note: "" },

  // Tổ Kỹ thuật Địa chính và Lưu trữ (30)
  { id: "KTDC_01", name: "Trần Thanh Triết", role: "Tổ trưởng", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_02", name: "Đặng Thị Tuyết Trinh", role: "Tổ phó", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_03", name: "Đỗ Văn Đông", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_04", name: "Nguyễn Văn Tiến", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_05", name: "Nguyễn Thanh Sang", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_06", name: "Lưu Văn Tuấn", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_07", name: "Đoàn Văn Sang", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_08", name: "Ân Văn Tuấn", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_09", name: "Phạm Minh Trí", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_10", name: "Phạm Thành Vũ", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_11", name: "Nguyễn Quốc Danh", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_12", name: "Lê Quang Khoa", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_13", name: "Đoàn Thanh Phong", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_14", name: "Ngô Thị Cẩm Thúy", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_15", name: "Phạm Trần Hồng Như", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_16", name: "Phạm Hoàng Oanh", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_17", name: "Lê Thị Thùy Duyên", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_18", name: "Nguyễn Thanh Điền", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_19", name: "Huỳnh Thành Duy", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_20", name: "Vương Ánh Xuân", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_21", name: "Nguyễn Tuấn Anh", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_22", name: "Nguyễn Hoàng Xuân", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_23", name: "Lê Thị Phương Mai", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_24", name: "Lê Ngọc Bảo Ngân", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_25", name: "Hồ Lê Thanh Vũ", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_26", name: "Huỳnh Quốc Nam", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_27", name: "Phạm Minh Hoàng", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_28", name: "Nguyễn Tuấn Kiệt", role: "Chuyên viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_29", name: "Trần Thị Hoàng Yến", role: "Nhân viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },
  { id: "KTDC_30", name: "Nguyễn Hoài Bảo Phúc", role: "Nhân viên", dept: "Tổ Kỹ thuật Địa chính và Lưu trữ", note: "" },

  // Tổ Đăng ký cấp GCN (27)
  { id: "DKGCN_01", name: "Nguyễn Thị Thùy Trang", role: "Tổ trưởng", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_02", name: "Nguyễn Thị Thu Minh", role: "Tổ phó", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_03", name: "Huỳnh Tấn Nguyên", role: "Tổ phó", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_04", name: "Nguyễn Thành Như Bảo", role: "Tổ phó", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_05", name: "Nguyễn Tiến Thịnh", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_06", name: "Hoàng Minh Tú", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_07", name: "Huỳnh Thị Ái Nhi", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_08", name: "Trần Nguyễn Hoài Lam", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_09", name: "Nguyễn Thị Huỳnh Mai", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_10", name: "Nguyễn Văn Khánh", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_11", name: "Trần Thị Thùy Trang", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_12", name: "Tạ Nguyễn Bích Trang", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_13", name: "Nguyễn Thị Lệ Thu", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_14", name: "Phạm Nguyễn Lan Anh", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_15", name: "Nguyễn Trần Thảo Vy", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_16", name: "Lê Sơn Thanh", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_17", name: "Nguyễn Bích Ngọc", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_18", name: "Nguyễn Trung Thành", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_19", name: "Nguyễn Thị Dáng", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_20", name: "Phạm Thị Yến Nhi", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_21", name: "Phan Trọng Hiệp", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_22", name: "Nguyễn Thị Ngọc Thảo", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_23", name: "Nguyễn Nhật Quyền Trinh", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_24", name: "Đỗ Thị Yến", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_25", name: "Võ Tường Lam", role: "Nhân viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_26", name: "Nguyễn Ngọc Quế Trân", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },
  { id: "DKGCN_27", name: "Trần Đình Siêu", role: "Chuyên viên", dept: "Tổ Đăng ký cấp GCN", note: "" },

  // Tổ Hành chính Tổng hợp (22)
  { id: "HCTH_01", name: "Nguyễn Thị Bích Tuyền", role: "Tổ trưởng", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_02", name: "Bùi Thị Minh Nguyệt", role: "Tổ phó", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_03", name: "Hồ Thị Hồng Linh", role: "Tổ phó", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_04", name: "Nguyễn Thị Mai", role: "Tổ phó", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_05", name: "Võ Phi Trúc", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_06", name: "Trương Ngô Hồng Duyên", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_07", name: "Nguyễn Anh Khôi", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_08", name: "Quản Nguyễn Thảo Nguyên", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_09", name: "Nguyễn Hoàng Duy", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_10", name: "Nguyễn Thị Trúc Phương", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_11", name: "Trần Quốc Hưng", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_12", name: "Đoàn Thị Hoàng An", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_13", name: "Nguyễn Thị Ngọc Trản", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_14", name: "Nguyễn Khánh Duy", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_15", name: "Nguyễn Duy Tấn", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_16", name: "Nguyễn Thảo Tuyết Nhi", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_17", name: "Lê Hồng Phong", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_18", name: "Nguyễn Thanh Phú", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_19", name: "Hồ Lê Thanh Vũ", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_20", name: "Nguyễn Hoàng Tiến", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_21", name: "Lê Thị Thúy Hằng", role: "Chuyên viên", dept: "Tổ Hành chính Tổng hợp", note: "" },
  { id: "HCTH_22", name: "Đỗ Trọng Minh Quân", role: "Nhân viên", dept: "Tổ Hành chính Tổng hợp", note: "" }
];

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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";
let currentViewingTaskId = null;
let attachedFileInfo = null;
let taskCurrentPage = 1;
let taskPageSize = 10;

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

      if (!isLeader) {
        if (tabBtnAssign) tabBtnAssign.style.display = "none";
        if (btnQuickOpenAssign) btnQuickOpenAssign.style.display = "none";
        if (panelAssign) panelAssign.classList.add("hidden");
        if (panelTracking) panelTracking.classList.remove("hidden");
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
// 5. KHỞI CHẠY & EVENT DELEGATION
// ========================================================
window.addEventListener("DOMContentLoaded", () => {
  initUserSession();
  populateStaffDropdown();
  syncStaffFromCloud();
  updateTaskKPIs();
  renderTasksTable();
  syncTasksFromCloud();

  // Nút Làm mới dữ liệu từ Google Sheet (xóa sạch bộ nhớ đệm, cập nhật mới nhất)
  const btnRefresh = document.getElementById("btnRefreshTasks");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      syncTasksFromCloud(true);
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

  // Tab switching đồng bộ hệ sinh thái (Tracking vs Assign)
  function switchTaskTab(tabName) {
    const tabBtnAssign = document.getElementById("tabBtnAssign");
    const tabBtnTracking = document.getElementById("tabBtnTracking");
    const panelAssign = document.getElementById("panelAssign");
    const panelTracking = document.getElementById("panelTracking");

    const currentUser = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) || 
                        JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");

    if (tabName === "assign") {
      const myRank = getUserRank(currentUser);
      if (myRank >= 5) {
        showToast("Đồng chí không có quyền giao việc! Chức năng này chỉ dành cho Ban Giám đốc và Lãnh đạo các Tổ chuyên môn.", "error");
        tabName = "tracking";
      }
    }

    if (tabName === "assign") {
      if (tabBtnAssign) tabBtnAssign.classList.add("active");
      if (tabBtnTracking) tabBtnTracking.classList.remove("active");
      if (panelAssign) panelAssign.classList.remove("hidden");
      if (panelTracking) panelTracking.classList.add("hidden");
    } else {
      if (tabBtnTracking) tabBtnTracking.classList.add("active");
      if (tabBtnAssign) tabBtnAssign.classList.remove("active");
      if (panelTracking) panelTracking.classList.remove("hidden");
      if (panelAssign) panelAssign.classList.add("hidden");
      renderTasksTable();
    }
  }
  window.switchTaskTab = switchTaskTab;

  document.getElementById("tabBtnTracking")?.addEventListener("click", () => switchTaskTab("tracking"));
  document.getElementById("tabBtnAssign")?.addEventListener("click", () => switchTaskTab("assign"));
  document.getElementById("btnQuickOpenAssign")?.addEventListener("click", () => switchTaskTab("assign"));
  document.getElementById("btnBackToTracking")?.addEventListener("click", () => switchTaskTab("tracking"));

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
