/**
 * ==============================================================================
 * CỔNG DỊCH VỤ NỘI BỘ VPĐK CHI NHÁNH 23 - "FAMILY CN23"
 * Module Controller: Báo Cáo Số Liệu Thực Hiện Cấp Tổ & Chỉ Số KPI
 * File: js/bao_cao_to.js
 * ==============================================================================
 */

// Hàm chống XSS an toàn
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const STORAGE_KEY_PERFORMANCE = "CN23_PERFORMANCE_RECORDS_V1";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

// Đồng bộ Cloud Google Apps Script
async function syncPerformanceFromCloud() {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getPerformanceReports`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const local = getStoredPerformanceRecords();
        const mergedMap = new Map();
        local.forEach(r => mergedMap.set(r.id, r));
        result.data.forEach(r => mergedMap.set(r.id, r));
        const merged = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_KEY_PERFORMANCE, JSON.stringify(merged));
        renderPerformanceHistory();
        calculatePerformanceMetrics();
      }
    }
  } catch (err) {
    console.log("Cloud performance sync offline mode");
  }
}

async function syncPerformanceToCloud(action, payload) {
  try {
    fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: action, ...payload })
    }).catch(e => console.log("Cloud sync error:", e));
  } catch (e) {}
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

// User session
function initUserSession() {
  try {
    const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
                 JSON.parse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("family_user") || "null");
    if (user) {
      const userName = user.name || user.fullname || "Cán bộ";
      const userRole = user.role || user.dept || "Chi nhánh 23";
      const nameEl = document.getElementById("headerUserName");
      const roleEl = document.getElementById("headerUserRole");
      if (nameEl) nameEl.textContent = userName;
      if (roleEl) roleEl.textContent = userRole;

      const toSelect = document.getElementById("toChuyenMon");
      if (toSelect && user.dept) {
        for (let i = 0; i < toSelect.options.length; i++) {
          if (toSelect.options[i].value === user.dept) {
            toSelect.selectedIndex = i;
            break;
          }
        }
      }
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
// TÍNH TOÁN CHỈ TIÊU & CẢNH BÁO KPI THỜI GIAN THỰC
// ========================================================
function calculatePerformanceMetrics() {
  const trucTiep = parseInt(document.getElementById("tiepNhanTrucTiep")?.value) || 0;
  const trucTuyen = parseInt(document.getElementById("tiepNhanTrucTuyen")?.value) || 0;
  const tongTN = trucTiep + trucTuyen;
  const elTongTN = document.getElementById("tongTiepNhan");
  if (elTongTN) elTongTN.value = tongTN;

  const tyLeTT = tongTN > 0 ? ((trucTuyen / tongTN) * 100).toFixed(1) : "0.0";
  const elTyLeTT = document.getElementById("tyLeTrucTuyen");
  if (elTyLeTT) elTyLeTT.value = tyLeTT + "%";

  const truocHan = parseInt(document.getElementById("traTruocHan")?.value) || 0;
  const dungHan = parseInt(document.getElementById("traDungHan")?.value) || 0;
  const quaHan = parseInt(document.getElementById("traQuaHan")?.value) || 0;
  const tongGQ = truocHan + dungHan + quaHan;
  const elTongGQ = document.getElementById("tongGiaiQuyet");
  if (elTongGQ) elTongGQ.value = tongGQ;

  const tyLeDH = tongGQ > 0 ? (((truocHan + dungHan) / tongGQ) * 100).toFixed(1) : "0.0";
  const elTyLeDH = document.getElementById("tyLeDungHan");
  if (elTyLeDH) elTyLeDH.value = tyLeDH + "%";

  const tonTH = parseInt(document.getElementById("tonTrongHan")?.value) || 0;
  const tonQH = parseInt(document.getElementById("tonQuaHan")?.value) || 0;
  const elTongDangGQ = document.getElementById("tongDangGiaiQuyet");
  if (elTongDangGQ) elTongDangGQ.value = tonTH + tonQH;

  const hsTC = parseInt(document.getElementById("hsCoNghiaVuTC")?.value) || 0;
  const hsTT = parseInt(document.getElementById("hsThanhToanTT")?.value) || 0;
  const tyLePay = hsTC > 0 ? ((hsTT / hsTC) * 100).toFixed(1) : "0.0";
  const elTyLePay = document.getElementById("tyLeThanhToanTT");
  if (elTyLePay) elTyLePay.value = tyLePay + "%";

  // Cập nhật 4 Card KPI đầu trang
  const elKpiTotRec = document.getElementById("kpiTotalReceive");
  if (elKpiTotRec) elKpiTotRec.textContent = tongTN.toLocaleString("vi-VN");
  const elKpiRecDet = document.getElementById("kpiReceiveDetail");
  if (elKpiRecDet) elKpiRecDet.textContent = `Trực tiếp: ${trucTiep} | Trực tuyến: ${trucTuyen}`;

  const numTT = parseFloat(tyLeTT);
  const elKpiOnl = document.getElementById("kpiOnlineRate");
  if (elKpiOnl) elKpiOnl.textContent = tyLeTT + "%";
  const badgeTT = document.getElementById("kpiOnlineBadge");
  if (badgeTT) {
    if (numTT >= 50.0) {
      badgeTT.className = "text-[11px] font-bold text-emerald-600 truncate";
      badgeTT.textContent = "✓ Đạt chỉ tiêu (≥ 50%)";
    } else {
      badgeTT.className = "text-[11px] font-semibold text-amber-600 truncate";
      badgeTT.textContent = "Chỉ tiêu: ≥ 50.0%";
    }
  }

  const numDH = parseFloat(tyLeDH);
  const elKpiOnTime = document.getElementById("kpiOnTimeRate");
  if (elKpiOnTime) elKpiOnTime.textContent = tyLeDH + "%";
  const badgeDH = document.getElementById("kpiOnTimeBadge");
  if (badgeDH) {
    if (numDH >= 98.0) {
      badgeDH.className = "text-[11px] font-bold text-emerald-600 truncate";
      badgeDH.textContent = "✓ Đạt chỉ tiêu (≥ 98%)";
    } else if (numDH > 0 && numDH < 98.0) {
      badgeDH.className = "text-[11px] font-bold text-rose-600 truncate animate-pulse";
      badgeDH.textContent = "⚠️ Chưa đạt chỉ tiêu (< 98%)";
    } else {
      badgeDH.className = "text-[11px] font-semibold text-slate-500 truncate";
      badgeDH.textContent = "Chỉ tiêu: ≥ 98.0%";
    }
  }

  const numPay = parseFloat(tyLePay);
  const elKpiPay = document.getElementById("kpiPayOnlineRate");
  if (elKpiPay) elKpiPay.textContent = tyLePay + "%";
  const badgePay = document.getElementById("kpiPayOnlineBadge");
  if (badgePay) {
    if (numPay >= 40.0) {
      badgePay.className = "text-[11px] font-bold text-emerald-600 truncate";
      badgePay.textContent = "✓ Đạt chỉ tiêu (≥ 40%)";
    } else {
      badgePay.className = "text-[11px] font-semibold text-amber-600 truncate";
      badgePay.textContent = "Chỉ tiêu: ≥ 40.0%";
    }
  }
}

// ========================================================
// QUẢN LÝ LƯU TRỮ & RENDER BẢNG LỊCH SỬ
// ========================================================
function getStoredPerformanceRecords() {
  const data = localStorage.getItem(STORAGE_KEY_PERFORMANCE);
  return data ? JSON.parse(data) : [];
}

function saveStoredPerformanceRecords(records) {
  localStorage.setItem(STORAGE_KEY_PERFORMANCE, JSON.stringify(records));
  renderPerformanceHistory();
}

function renderPerformanceHistory() {
  const records = getStoredPerformanceRecords();
  const filter = document.getElementById("filterHistoryDept")?.value || "ALL";
  const tbody = document.getElementById("historyTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filtered = filter === "ALL" ? records : records.filter(r => r.toChuyenMon === filter);
  const elBadgeHist = document.getElementById("tabBadgeHistoryCount");
  if (elBadgeHist) elBadgeHist.textContent = records.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" class="text-center py-12 text-slate-400">
          <i class="fa-solid fa-inbox text-3xl mb-2 text-slate-300 block"></i>
          <span>Chưa có dữ liệu kỳ báo cáo nào. Vui lòng nhập số liệu ở Tab 1.</span>
        </td>
      </tr>`;
    return;
  }

  filtered.forEach((rec, idx) => {
    const periodDisplay = rec.tenKyBaoCao || "Kỳ báo cáo";
    const numTT = parseFloat(rec.tyLeTrucTuyen);
    const numDH = parseFloat(rec.tyLeDungHan);

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition cursor-pointer";
    tr.dataset.recordId = rec.id;

    tr.innerHTML = `
      <td class="py-3 px-3 text-center font-bold text-slate-500">${idx + 1}</td>
      <td class="py-3 px-3 font-bold text-blue-900 truncate max-w-[180px]" title="${escapeHtml(periodDisplay)}">
        ${escapeHtml(periodDisplay)}
        <span class="block text-[10px] text-slate-400 font-normal">Kỳ: ${escapeHtml(rec.loaiKyBaoCao || "Tuần")}</span>
      </td>
      <td class="py-3 px-3 font-semibold text-slate-800 truncate max-w-[200px]" title="${escapeHtml(rec.toChuyenMon)}">${escapeHtml(rec.toChuyenMon)}</td>
      <td class="py-3 px-3 text-center text-slate-600">${escapeHtml(rec.ngayChotSoLieu)}</td>
      <td class="py-3 px-3 text-center font-bold text-slate-900">${escapeHtml(rec.tongTiepNhan)}</td>
      <td class="py-3 px-3 text-center">
        <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${numTT >= 50 ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"}">
          ${escapeHtml(rec.tyLeTrucTuyen)}
        </span>
      </td>
      <td class="py-3 px-3 text-center font-bold text-slate-900">${escapeHtml(rec.tongGiaiQuyet)}</td>
      <td class="py-3 px-3 text-center">
        <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${numDH >= 98 ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"}">
          ${escapeHtml(rec.tyLeDungHan)}
        </span>
      </td>
      <td class="py-3 px-3 text-center font-extrabold ${rec.traQuaHan > 0 ? "text-rose-600" : "text-slate-400"}">${escapeHtml(rec.traQuaHan)}</td>
      <td class="py-3 px-3 text-center text-[11px] text-slate-700 font-semibold">${escapeHtml(rec.tongDangGiaiQuyet)} (QH: ${escapeHtml(rec.tonQuaHan)})</td>
      <td class="py-3 px-3 text-center font-bold text-amber-700">${escapeHtml(rec.tyLeThanhToanTT)}</td>
      <td class="py-3 px-3 text-center">
        <div class="inline-flex items-center gap-1">
          <button type="button" data-action="view" data-id="${escapeHtml(rec.id)}" title="Xem chi tiết" class="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center transition active:scale-95">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button type="button" data-action="print" data-id="${escapeHtml(rec.id)}" title="In phiếu báo cáo" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95">
            <i class="fa-solid fa-print"></i>
          </button>
          <button type="button" data-action="delete" data-id="${escapeHtml(rec.id)}" title="Xóa bản ghi" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition active:scale-95">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deletePerformanceRecord(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa bản ghi số liệu này không?")) return;
  let records = getStoredPerformanceRecords();
  records = records.filter(r => r.id !== id);
  saveStoredPerformanceRecords(records);
  syncPerformanceToCloud("deletePerformanceRecord", { id: id });
  showToast("Đã xóa bản ghi số liệu thành công!");
}

function openReportModal(id) {
  const records = getStoredPerformanceRecords();
  const r = records.find(item => item.id === id);
  if (!r) return;

  const container = document.getElementById("modalReportContent");
  if (container) {
    container.innerHTML = `
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 class="text-sm font-bold text-blue-950">${escapeHtml(r.toChuyenMon)}</h4>
          <p class="text-xs text-blue-700">${escapeHtml(r.tenKyBaoCao)} &bull; Chốt ngày: <strong>${escapeHtml(r.ngayChotSoLieu)}</strong></p>
        </div>
        <span class="text-xs font-mono font-bold bg-white text-blue-900 px-2.5 py-1 rounded-lg border border-blue-200">${escapeHtml(r.id)}</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="text-slate-400 font-medium">Tổng tiếp nhận</p>
          <p class="text-base font-extrabold text-slate-800">${escapeHtml(r.tongTiepNhan)} hồ sơ</p>
          <p class="text-[10px] text-slate-500">TT: ${escapeHtml(r.tiepNhanTrucTiep)} | Online: ${escapeHtml(r.tiepNhanTrucTuyen)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="text-slate-400 font-medium">Tỷ lệ trực tuyến</p>
          <p class="text-base font-extrabold text-emerald-600">${escapeHtml(r.tyLeTrucTuyen)}</p>
          <p class="text-[10px] text-emerald-600 font-semibold">Chỉ tiêu ≥ 50%</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="text-slate-400 font-medium">Tổng giải quyết</p>
          <p class="text-base font-extrabold text-slate-800">${escapeHtml(r.tongGiaiQuyet)} hồ sơ</p>
          <p class="text-[10px] text-slate-500">Sớm: ${escapeHtml(r.traTruocHan)} | Đúng: ${escapeHtml(r.traDungHan)} | Trễ: ${escapeHtml(r.traQuaHan)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="text-slate-400 font-medium">Tỷ lệ đúng hạn</p>
          <p class="text-base font-extrabold text-indigo-700">${escapeHtml(r.tyLeDungHan)}</p>
          <p class="text-[10px] text-indigo-600 font-semibold">Chỉ tiêu ≥ 98%</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="font-bold text-slate-800 mb-1">Tồn đọng & Đang xử lý:</p>
          <p>Trong hạn: <strong>${escapeHtml(r.tonTrongHan)}</strong> | Quá hạn: <strong class="text-rose-600">${escapeHtml(r.tonQuaHan)}</strong></p>
          <p>Tổng đang giải quyết: <strong>${escapeHtml(r.tongDangGiaiQuyet)}</strong> hồ sơ</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="font-bold text-slate-800 mb-1">Tài chính & Thanh toán TT:</p>
          <p>Có NV tài chính: <strong>${escapeHtml(r.hsCoNghiaVuTC)}</strong> | Đã TT: <strong>${escapeHtml(r.hsThanhToanTT)}</strong></p>
          <p>Tỷ lệ TT: <strong class="text-amber-700">${escapeHtml(r.tyLeThanhToanTT)}</strong> | Số tiền: <strong>${(r.soTienThanhToanTT || 0).toLocaleString("vi-VN")} đ</strong></p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="font-bold text-slate-800 mb-1">Công tác Số hóa:</p>
          <p>Đầu vào: <strong>${escapeHtml(r.soHoaDauVao)}</strong> | Đầu ra: <strong>${escapeHtml(r.soHoaDauRa)}</strong></p>
          <p>Tái sử dụng: <strong>${escapeHtml(r.taiSuDungSoHoa)}</strong> | Chứng thực BS: <strong>${escapeHtml(r.chungThucBanSaoDT)}</strong></p>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p class="font-bold text-slate-800 mb-1">Hệ thống VBDLIS & Dân cư:</p>
          <p>Đồng bộ VBDLIS: <strong>${escapeHtml(r.dongBoVBDLis)}</strong></p>
          <p>Lỗi nghẽn: <strong class="text-rose-600">${escapeHtml(r.loiNghenPhanMem)}</strong> | Tra cứu CSDL: <strong>${escapeHtml(r.traCuuCSDLDanCu)}</strong></p>
        </div>
      </div>

      ${r.ghiChuVuongMac ? `
        <div class="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
          <p class="font-bold text-amber-900 mb-1">Khó khăn, vướng mắc:</p>
          <p class="text-slate-800 whitespace-pre-wrap">${escapeHtml(r.ghiChuVuongMac)}</p>
        </div>
      ` : ""}

      ${r.deXuatKienNghi ? `
        <div class="bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
          <p class="font-bold text-blue-900 mb-1">Đề xuất kiến nghị với Ban Giám đốc:</p>
          <p class="text-slate-800 whitespace-pre-wrap">${escapeHtml(r.deXuatKienNghi)}</p>
        </div>
      ` : ""}
    `;
  }

  const btnPrint = document.getElementById("modalBtnPrintReport");
  if (btnPrint) btnPrint.onclick = () => printSingleReport(r.id);
  const modal = document.getElementById("reportDetailModal");
  if (modal) modal.classList.remove("hidden");
}

function closeReportModal() {
  const modal = document.getElementById("reportDetailModal");
  if (modal) modal.classList.add("hidden");
}

function printSingleReport(id) {
  const records = getStoredPerformanceRecords();
  const r = records.find(item => item.id === id);
  if (!r) return;

  const printWindow = window.open("", "_blank", "width=850,height=950");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Báo Cáo Số Liệu - ${r.toChuyenMon}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; color: #000; padding: 15px; }
        .header-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .header-table td { vertical-align: top; text-align: center; font-size: 11pt; }
        .title { font-size: 15pt; font-weight: bold; text-align: center; margin: 15px 0 5px 0; text-transform: uppercase; }
        .sub-title { text-align: center; font-style: italic; font-size: 11pt; margin-bottom: 20px; }
        table.data-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        table.data-table th, table.data-table td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; }
        table.data-table th { background: #f0f0f0; text-align: center; }
        .section-head { font-weight: bold; background: #e8e8e8; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
        .sig-block { width: 45%; }
        .sig-title { font-weight: bold; font-size: 11pt; text-transform: uppercase; }
        .sig-note { font-style: italic; font-size: 10pt; }
        .sig-space { height: 60px; }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td style="width: 45%;">
            <strong>SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG TP.HCM</strong><br>
            <strong>VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI</strong><br>
            <strong>CHI NHÁNH SỐ 23</strong><br>
            <strong>${r.toChuyenMon.toUpperCase()}</strong>
          </td>
          <td style="width: 55%;">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
            <span>---------------</span>
          </td>
        </tr>
      </table>

      <div class="title">BÁO CÁO KẾT QUẢ THỰC HIỆN NHIỆM VỤ CHUYÊN MÔN</div>
      <div class="sub-title">(Kỳ báo cáo: <strong>${r.tenKyBaoCao}</strong> - Ngày chốt số liệu: ${r.ngayChotSoLieu})</div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 10%;">STT</th>
            <th style="width: 65%;">Chỉ Tiêu Nhiệm Vụ</th>
            <th style="width: 25%;">Số Liệu Thực Hiện</th>
          </tr>
        </thead>
        <tbody>
          <tr class="section-head"><td colspan="3">I. TÌNH HÌNH TIẾP NHẬN HỒ SƠ</td></tr>
          <tr><td>1</td><td>Tiếp nhận trực tiếp</td><td style="text-align:right;"><strong>${r.tiepNhanTrucTiep}</strong> hồ sơ</td></tr>
          <tr><td>2</td><td>Tiếp nhận trực tuyến</td><td style="text-align:right;"><strong>${r.tiepNhanTrucTuyen}</strong> hồ sơ</td></tr>
          <tr><td>3</td><td><strong>Tổng số hồ sơ tiếp nhận</strong></td><td style="text-align:right;"><strong>${r.tongTiepNhan}</strong> hồ sơ</td></tr>
          <tr><td>4</td><td><strong>Tỷ lệ nộp trực tuyến</strong> (Chỉ tiêu ≥ 50%)</td><td style="text-align:right;"><strong>${r.tyLeTrucTuyen}</strong></td></tr>

          <tr class="section-head"><td colspan="3">II. KẾT QUẢ GIẢI QUYẾT & TRẢ KẾT QUẢ</td></tr>
          <tr><td>5</td><td>Trả kết quả trước hạn</td><td style="text-align:right;">${r.traTruocHan} hồ sơ</td></tr>
          <tr><td>6</td><td>Trả kết quả đúng hạn</td><td style="text-align:right;">${r.traDungHan} hồ sơ</td></tr>
          <tr><td>7</td><td>Trả kết quả quá hạn</td><td style="text-align:right; color:red;">${r.traQuaHan} hồ sơ</td></tr>
          <tr><td>8</td><td><strong>Tổng số hồ sơ đã giải quyết</strong></td><td style="text-align:right;"><strong>${r.tongGiaiQuyet}</strong> hồ sơ</td></tr>
          <tr><td>9</td><td><strong>Tỷ lệ giải quyết đúng hạn</strong> (Chỉ tiêu ≥ 98%)</td><td style="text-align:right;"><strong>${r.tyLeDungHan}</strong></td></tr>
          <tr><td>10</td><td>Số thư xin lỗi đã phát hành</td><td style="text-align:right;">${r.soThuXinLoi} thư</td></tr>

          <tr class="section-head"><td colspan="3">III. HỒ SƠ ĐANG THỤ LÝ (TỒN ĐỌNG)</td></tr>
          <tr><td>11</td><td>Tồn trong hạn quy định</td><td style="text-align:right;">${r.tonTrongHan} hồ sơ</td></tr>
          <tr><td>12</td><td>Tồn quá hạn quy định</td><td style="text-align:right; color:red;">${r.tonQuaHan} hồ sơ</td></tr>
          <tr><td>13</td><td><strong>Tổng số hồ sơ đang giải quyết</strong></td><td style="text-align:right;"><strong>${r.tongDangGiaiQuyet}</strong> hồ sơ</td></tr>

          <tr class="section-head"><td colspan="3">IV. NGHĨA VỤ TÀI CHÍNH & THANH TOÁN TRỰC TUYẾN</td></tr>
          <tr><td>14</td><td>Hồ sơ có phát sinh nghĩa vụ tài chính</td><td style="text-align:right;">${r.hsCoNghiaVuTC} hồ sơ</td></tr>
          <tr><td>15</td><td>Hồ sơ đã thanh toán trực tuyến thành công</td><td style="text-align:right;">${r.hsThanhToanTT} hồ sơ</td></tr>
          <tr><td>16</td><td><strong>Tỷ lệ thanh toán trực tuyến</strong> (Chỉ tiêu ≥ 40%)</td><td style="text-align:right;"><strong>${r.tyLeThanhToanTT}</strong></td></tr>
          <tr><td>17</td><td>Tổng số tiền thanh toán trực tuyến</td><td style="text-align:right;"><strong>${(r.soTienThanhToanTT || 0).toLocaleString("vi-VN")}</strong> VNĐ</td></tr>

          <tr class="section-head"><td colspan="3">V. CÔNG TÁC SỐ HÓA & HỆ THỐNG VBDLIS</td></tr>
          <tr><td>18</td><td>Số hóa hồ sơ đầu vào / Đầu ra</td><td style="text-align:right;">${r.soHoaDauVao} / ${r.soHoaDauRa}</td></tr>
          <tr><td>19</td><td>Hồ sơ đồng bộ VBDLIS thành công</td><td style="text-align:right;">${r.dongBoVBDLis} hồ sơ</td></tr>
          <tr><td>20</td><td>Lỗi nghẽn mạng / Phần mềm ghi nhận</td><td style="text-align:right;">${r.loiNghenPhanMem} lần</td></tr>
        </tbody>
      </table>

      ${r.ghiChuVuongMac ? `<p><strong>Khó khăn, vướng mắc:</strong> ${r.ghiChuVuongMac}</p>` : ""}
      ${r.deXuatKienNghi ? `<p><strong>Đề xuất kiến nghị:</strong> ${r.deXuatKienNghi}</p>` : ""}

      <div class="signatures">
        <div class="sig-block">
          <div class="sig-title">NGƯỜI LẬP BIỂU</div>
          <div class="sig-note">(Ký và ghi rõ họ tên)</div>
          <div class="sig-space"></div>
        </div>
        <div class="sig-block">
          <div class="sig-title">TỔ TRƯỞNG CHUYÊN MÔN</div>
          <div class="sig-note">(Ký và ghi rõ họ tên)</div>
          <div class="sig-space"></div>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); }, 400);
}

// ========================================================
// KHỞI CHẠY & EVENT DELEGATION
// ========================================================
window.addEventListener("DOMContentLoaded", () => {
  initUserSession();
  const dateInput = document.getElementById("ngayChotSoLieu");
  if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
  calculatePerformanceMetrics();
  renderPerformanceHistory();
  syncPerformanceFromCloud();

  // Lắng nghe tính toán chỉ tiêu
  document.querySelectorAll(".calc-trigger").forEach(input => {
    input.addEventListener("input", calculatePerformanceMetrics);
  });

  // Event Delegation cho bảng lịch sử
  const tbody = document.getElementById("historyTableBody");
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (actionBtn) {
        e.stopPropagation();
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === "view") openReportModal(id);
        else if (action === "print") printSingleReport(id);
        else if (action === "delete") deletePerformanceRecord(id);
        return;
      }

      const row = e.target.closest("tr[data-record-id]");
      if (row) {
        openReportModal(row.dataset.recordId);
      }
    });
  }

  // Form submit
  const form = document.getElementById("performanceReportForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      calculatePerformanceMetrics();

      const record = {
        id: "REC_" + Date.now(),
        toChuyenMon: document.getElementById("toChuyenMon")?.value || "",
        loaiKyBaoCao: document.getElementById("loaiKyBaoCao")?.value || "Tuần",
        tenKyBaoCao: document.getElementById("tenKyBaoCao")?.value.trim() || "",
        ngayChotSoLieu: document.getElementById("ngayChotSoLieu")?.value || "",

        tiepNhanTrucTiep: parseInt(document.getElementById("tiepNhanTrucTiep")?.value) || 0,
        tiepNhanTrucTuyen: parseInt(document.getElementById("tiepNhanTrucTuyen")?.value) || 0,
        tongTiepNhan: parseInt(document.getElementById("tongTiepNhan")?.value) || 0,
        tyLeTrucTuyen: document.getElementById("tyLeTrucTuyen")?.value || "0.0%",

        traTruocHan: parseInt(document.getElementById("traTruocHan")?.value) || 0,
        traDungHan: parseInt(document.getElementById("traDungHan")?.value) || 0,
        traQuaHan: parseInt(document.getElementById("traQuaHan")?.value) || 0,
        tongGiaiQuyet: parseInt(document.getElementById("tongGiaiQuyet")?.value) || 0,
        tyLeDungHan: document.getElementById("tyLeDungHan")?.value || "0.0%",
        soThuXinLoi: parseInt(document.getElementById("soThuXinLoi")?.value) || 0,

        tonTrongHan: parseInt(document.getElementById("tonTrongHan")?.value) || 0,
        tonQuaHan: parseInt(document.getElementById("tonQuaHan")?.value) || 0,
        tongDangGiaiQuyet: parseInt(document.getElementById("tongDangGiaiQuyet")?.value) || 0,

        hsCoNghiaVuTC: parseInt(document.getElementById("hsCoNghiaVuTC")?.value) || 0,
        hsThanhToanTT: parseInt(document.getElementById("hsThanhToanTT")?.value) || 0,
        tyLeThanhToanTT: document.getElementById("tyLeThanhToanTT")?.value || "0.0%",
        soTienThanhToanTT: parseInt(document.getElementById("soTienThanhToanTT")?.value) || 0,

        soHoaDauVao: parseInt(document.getElementById("soHoaDauVao")?.value) || 0,
        soHoaDauRa: parseInt(document.getElementById("soHoaDauRa")?.value) || 0,
        taiSuDungSoHoa: parseInt(document.getElementById("taiSuDungSoHoa")?.value) || 0,
        chungThucBanSaoDT: parseInt(document.getElementById("chungThucBanSaoDT")?.value) || 0,

        dongBoVBDLis: parseInt(document.getElementById("dongBoVBDLis")?.value) || 0,
        loiNghenPhanMem: parseInt(document.getElementById("loiNghenPhanMem")?.value) || 0,
        traCuuCSDLDanCu: parseInt(document.getElementById("traCuuCSDLDanCu")?.value) || 0,

        ghiChuVuongMac: document.getElementById("ghiChuVuongMac")?.value.trim() || "",
        deXuatKienNghi: document.getElementById("deXuatKienNghi")?.value.trim() || "",
        createdAt: new Date().toLocaleString("vi-VN")
      };

      const records = getStoredPerformanceRecords();
      const existingIdx = records.findIndex(r => r.toChuyenMon === record.toChuyenMon && r.tenKyBaoCao === record.tenKyBaoCao);
      if (existingIdx !== -1) {
        if (confirm(`Số liệu của ${record.toChuyenMon} cho ${record.tenKyBaoCao} đã tồn tại. Bạn có muốn CẬP NHẬT đè số liệu mới không?`)) {
          records[existingIdx] = record;
        } else {
          return;
        }
      } else {
        records.unshift(record);
      }

      saveStoredPerformanceRecords(records);
      syncPerformanceToCloud("createPerformanceReport", record);
      showToast(`Đã lưu thành công số liệu báo cáo cho ${record.toChuyenMon}!`, "success");

      setTimeout(() => {
        document.getElementById("tabBtnHistory")?.click();
      }, 600);
    });
  }

  // Xuất CSV
  const btnExport = document.getElementById("btnExportPerformanceCsv");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const records = getStoredPerformanceRecords();
      if (records.length === 0) {
        showToast("Chưa có dữ liệu nào để xuất!", "error");
        return;
      }

      const headers = ["ID", "Tổ chuyên môn", "Kỳ báo cáo", "Ngày chốt", "Tổng nhận", "Trực tuyến (%)", "Tổng giải quyết", "Đúng hạn (%)", "Trả quá hạn", "Tồn quá hạn", "Tỷ lệ TT (%)", "Tiền TT (VNĐ)"];
      const rows = [headers.join(",")];

      records.forEach(r => {
        const row = [
          `"${r.id}"`,
          `"${r.toChuyenMon}"`,
          `"${r.tenKyBaoCao}"`,
          `"${r.ngayChotSoLieu}"`,
          `"${r.tongTiepNhan}"`,
          `"${r.tyLeTrucTuyen}"`,
          `"${r.tongGiaiQuyet}"`,
          `"${r.tyLeDungHan}"`,
          `"${r.traQuaHan}"`,
          `"${r.tonQuaHan}"`,
          `"${r.tyLeThanhToanTT}"`,
          `"${r.soTienThanhToanTT}"`
        ];
        rows.push(row.join(","));
      });

      const blob = new Blob(["\uFEFF" + rows.join("\r\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Bao_Cao_So_Lieu_To_CN23_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Đã xuất báo cáo số liệu ra tệp CSV Excel!", "success");
    });
  }

  // Clear & Reset
  const btnClear = document.getElementById("btnClearAllHistory");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (confirm("CẢNH BÁO NGUY HIỂM: Đồng chí có chắc chắn muốn xóa TOÀN BỘ lịch sử số liệu báo cáo không?")) {
        localStorage.removeItem(STORAGE_KEY_PERFORMANCE);
        renderPerformanceHistory();
        calculatePerformanceMetrics();
        showToast("Đã xóa toàn bộ lịch sử báo cáo!");
      }
    });
  }

  const btnReset = document.getElementById("btnResetReportForm");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      document.getElementById("performanceReportForm")?.reset();
      const dt = document.getElementById("ngayChotSoLieu");
      if (dt) dt.value = new Date().toISOString().split("T")[0];
      calculatePerformanceMetrics();
      showToast("Đã làm mới biểu mẫu báo cáo");
    });
  }

  const btnPrint = document.getElementById("btnPrintReportForm");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => window.print());
  }

  const filterDept = document.getElementById("filterHistoryDept");
  if (filterDept) {
    filterDept.addEventListener("change", renderPerformanceHistory);
  }

  // Tab switching
  const tabBtnForm = document.getElementById("tabBtnForm");
  const tabBtnHistory = document.getElementById("tabBtnHistory");
  const panelForm = document.getElementById("panelForm");
  const panelHistory = document.getElementById("panelHistory");

  if (tabBtnForm && tabBtnHistory && panelForm && panelHistory) {
    tabBtnForm.addEventListener("click", () => {
      tabBtnForm.className = "tab-button active flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition bg-white text-blue-900 shadow-sm";
      tabBtnHistory.className = "tab-button flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition";
      panelForm.classList.remove("hidden");
      panelHistory.classList.add("hidden");
    });

    tabBtnHistory.addEventListener("click", () => {
      tabBtnHistory.className = "tab-button active flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition bg-white text-blue-900 shadow-sm";
      tabBtnForm.className = "tab-button flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition";
      panelHistory.classList.remove("hidden");
      panelForm.classList.add("hidden");
      renderPerformanceHistory();
    });
  }
});

// Xuất các hàm ra phạm vi toàn cục
window.deletePerformanceRecord = deletePerformanceRecord;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.printSingleReport = printSingleReport;
