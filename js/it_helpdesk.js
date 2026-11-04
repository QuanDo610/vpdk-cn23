/**
 * ==============================================================================
 * CỔNG DỊCH VỤ NỘI BỘ VPĐK CHI NHÁNH 23 - "FAMILY CN23"
 * Module Controller: IT Helpdesk Tiếp Nhận & Xử Lý Sự Cố Máy Tính
 * File: js/it_helpdesk.js
 * ==============================================================================
 */

// 1. KẾT NỐI SERVER APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

// Biến toàn cục lưu danh sách Ticket và thông tin máy
let currentTickets = [];
let detectedClient = {
  ip: "Đang quét...",
  os: "Windows",
  machineName: "",
  specs: "",
  imageBase64: ""
};
let currentDetailTicket = null;

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

// 0. HÀM CHUYỂN ĐỔI TAB: 1. BÁO SỰ CỐ MỚI (MẶC ĐỊNH) VS 2. BẢNG THEO DÕI SỰ CỐ (MONITORING)
function switchHelpdeskTab(tab) {
  const listSec = document.getElementById("listSection");
  const formSec = document.getElementById("formSection");
  const btnList = document.getElementById("tabBtnHelpdeskList");
  const btnForm = document.getElementById("tabBtnHelpdeskRegister");
  if (!listSec || !formSec) return;

  if (tab === "list") {
    listSec.style.display = "flex";
    formSec.style.display = "none";
    if (btnList) btnList.classList.add("active");
    if (btnForm) btnForm.classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    listSec.style.display = "none";
    formSec.style.display = "block";
    if (btnList) btnList.classList.remove("active");
    if (btnForm) btnForm.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Kiểm tra xác thực cán bộ từ phiên đăng nhập
function checkAuth() {
  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
               JSON.parse(sessionStorage.getItem("family_user") || sessionStorage.getItem("binhduong_user") || sessionStorage.getItem("vpdk_current_user") || "null");
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  try {
    const nameEl = document.getElementById("itUserName");
    if (nameEl) nameEl.textContent = user.fullname || user.name || "Cán bộ";
    const badgeEl = document.getElementById("itUserBadge");
    if (badgeEl) badgeEl.classList.remove("hidden");
    
    // Tự động gán Họ tên và SĐT vào form và hiển thị badge duy nhất
    const fnVal = user.fullname || user.name || "Cán bộ";
    const phVal = (user.phone || "").trim();
    const fnInput = document.getElementById("fullname");
    if (fnInput) fnInput.value = fnVal;
    const phInput = document.getElementById("phone");
    if (phInput) phInput.value = phVal;

    const reqName = document.getElementById("requesterDisplayName");
    if (reqName) reqName.textContent = fnVal;

    const reqPhone = document.getElementById("requesterDisplayPhone");
    if (reqPhone) {
      reqPhone.textContent = phVal ? phVal : "SĐT: Nội bộ";
    }
    const deptSelect = document.getElementById("department");
    if (deptSelect && user.department) {
      for (let opt of deptSelect.options) {
        if (opt.value && (user.department.toLowerCase().includes(opt.value.toLowerCase()) || opt.value.toLowerCase().includes(user.department.toLowerCase()))) {
          deptSelect.value = opt.value;
          break;
        }
      }
    }
  } catch (e) {
    window.location.href = "index.html";
  }
}

function handleLogout() {
  if (typeof FamilyAuth !== "undefined") {
    FamilyAuth.logout();
  } else {
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

// Chuẩn hóa bỏ dấu tiếng Việt để tìm kiếm & so khớp an toàn
function removeVietnameseTones(str) {
  if (!str) return "";
  str = String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.replace(/[đĐ]/g, "d");
  return str.toLowerCase().trim();
}

// Chuẩn hóa số điện thoại để so sánh (loại bỏ khoảng trắng, dấu chấm, gạch ngang, số 0 đầu, nháy đơn)
function normalizePhone(p) {
  if (!p) return "";
  return String(p).replace(/^'+/, "").replace(/[\s\.\-]+/g, "").replace(/^0+/, "");
}

// Sinh Username từ Họ và tên (Quy chuẩn: Tên + Chữ cái đầu của Họ và Tên lót)
// Ví dụ: "Nguyễn Thị Bích Tuyền" -> "tuyenntb", "Đỗ Trọng Minh Quân" -> "quandtm"
function generateUsernameFromFullname(fullname) {
  if (!fullname) return "";
  const parts = String(fullname).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    return removeVietnameseTones(parts[0]).toLowerCase();
  }
  const lastName = parts[parts.length - 1];
  const normLastName = removeVietnameseTones(lastName).toLowerCase();
  const initials = parts.slice(0, -1).map(function(p) {
    const norm = removeVietnameseTones(p);
    return norm ? norm.charAt(0).toLowerCase() : "";
  }).join("");
  return normLastName + initials;
}

// Nhận diện Quản trị viên IT DUY NHẤT: Đỗ Trọng Minh Quân (0973807027 - quandtm)
// Yêu cầu bảo mật: CHỈ DUY NHẤT Đỗ Trọng Minh Quân mới có quyền xem toàn bộ ticket.
// Mọi tài khoản khác (kể cả có quyền admin ở các phân hệ khác như tuyenntb) đều chỉ xem được ticket của chính mình.
function isUserAdmin() {
  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
               JSON.parse(sessionStorage.getItem("family_user") || sessionStorage.getItem("binhduong_user") || sessionStorage.getItem("vpdk_current_user") || "null");
  // Zero-trust: Chưa đăng nhập thì không mở quyền quản trị
  if (!user) return false;

  const phone = normalizePhone(user.phone);
  const username = (user.username || "").toLowerCase().trim();
  const email = (user.email || "").toLowerCase().trim();

  // 1. Quản trị viên IT Đỗ Trọng Minh Quân: Nhận diện mỏ neo cứng theo SĐT 0973807027 / quandtm / email
  if (
    phone === "973807027" ||
    phone === "0973807027" ||
    username === "quandtm" ||
    username.includes("quandtm") ||
    email.includes("quandtm") ||
    email.includes("quan.vpdk")
  ) {
    return true;
  }

  // 2. Nhận diện theo họ tên Đỗ Trọng Minh Quân
  const rawFullname = (user.fullname || user.name || user.ho_ten || "").normalize("NFC").toLowerCase();
  const noToneName = removeVietnameseTones(rawFullname);
  if (noToneName.includes("do trong minh quan") || rawFullname.includes("đỗ trọng minh quân")) {
    return true;
  }

  // Cán bộ cá nhân khác (kể cả role 'admin' tại các phân hệ khác như tuyenntb) đều chỉ xem ticket của chính mình
  return false;
}

// Cập nhật giao diện theo vai trò Quản trị viên vs Cán bộ cá nhân
function updateUIForUserRole() {
  const isAdmin = isUserAdmin();
  const titleEl = document.getElementById("monitoringTitle");
  const subEl = document.getElementById("monitoringSubtitle");
  const badgeEl = document.getElementById("roleScopeBadge");

  if (isAdmin) {
    if (titleEl) titleEl.textContent = "Bảng Tiếp Nhận & Hàng Đợi Xử Lý (Toàn Cơ Quan)";
    if (subEl) subEl.textContent = "Tiến độ tiếp nhận & điều phối xử lý sự cố máy tính Chi nhánh 23 theo thời gian thực";
    if (badgeEl) {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs";
      badgeEl.innerHTML = '<i class="fa-solid fa-shield-halved text-amber-600"></i> Quản trị IT (Xem & Điều phối toàn bộ sự cố)';
      badgeEl.classList.remove("hidden");
    }
  } else {
    if (titleEl) titleEl.textContent = "Danh Sách Sự Cố Của Tôi";
    if (subEl) subEl.textContent = "Theo dõi tiến độ hỗ trợ và tình trạng xử lý các sự cố máy tính của đồng chí";
    if (badgeEl) {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs";
      badgeEl.innerHTML = '<i class="fa-solid fa-user-shield text-blue-600"></i> Cán bộ cá nhân (Chỉ xem sự cố của bạn)';
      badgeEl.classList.remove("hidden");
    }
  }
}

// Bộ lọc quyền truy cập dữ liệu Ticket (RBAC Dual-Layer: Quản trị xem toàn bộ, Cán bộ chỉ xem của mình)
function getVisibleTickets() {
  if (isUserAdmin()) {
    return currentTickets;
  }
  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
               JSON.parse(sessionStorage.getItem("family_user") || sessionStorage.getItem("binhduong_user") || sessionStorage.getItem("vpdk_current_user") || "null");
  if (!user) {
    return [];
  }
  const myUsername = (user.username || "").toLowerCase().trim();
  const myPhone = normalizePhone(user.phone);
  const myName = removeVietnameseTones(user.fullname || user.name || "");

  return currentTickets.filter(item => {
    // 1. Khớp username trực tiếp
    if (myUsername && item.username && item.username.toLowerCase().trim() === myUsername) {
      return true;
    }
    // 2. Khớp số điện thoại
    if (myPhone && normalizePhone(item.phone) === myPhone) {
      return true;
    }
    // 3. Khớp họ tên
    if (myName) {
      const ticketName = removeVietnameseTones(item.fullname || "");
      if (ticketName === myName) return true;
    }
    // 4. Kiểm tra chuỗi [User: myUsername] trong clientSpecs
    if (myUsername && item.clientSpecs && item.clientSpecs.toLowerCase().includes(`user: ${myUsername}`)) {
      return true;
    }
    return false;
  });
}

// 2. TỰ ĐỘNG QUÉT TÊN MÁY, CẤU HÌNH, VÀ IP
async function autoDetectMachineAndSpecs() {
  let machineTag = localStorage.getItem("IT_LOCAL_MACHINE_TAG");
  if (!machineTag) {
    const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(4, "0");
    machineTag = `PC-${hex}`;
    localStorage.setItem("IT_LOCAL_MACHINE_TAG", machineTag);
  }

  let os = "Windows";
  const ua = navigator.userAgent;
  if (ua.indexOf("Windows NT 10.0") !== -1) os = "Win 10/11";
  else if (ua.indexOf("Mac") !== -1) os = "macOS";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";
  else if (ua.indexOf("Android") !== -1) os = "Android";
  else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS";

  detectedClient.os = os;

  const ram = navigator.deviceMemory ? `${navigator.deviceMemory}GB RAM` : "";
  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "";
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const specsSummary = [os, ram, cores, screenRes].filter(Boolean).join(" • ");
  detectedClient.specs = specsSummary;

  const autoName = `${os} (${machineTag})`;
  detectedClient.machineName = autoName;
  const machineInput = document.getElementById("machineName");
  if (machineInput && !machineInput.value) {
    machineInput.value = autoName;
  }

  const specEl = document.getElementById("detectedSpecText");
  if (specEl) specEl.textContent = `Máy: ${autoName} | ${specsSummary}`;
  detectedClient.ip = "Mạng nội bộ CN23";
}

// 3. TỰ ĐỘNG NHỚ HỌ TÊN, SĐT, PHÒNG BAN TRÊN MÁY NÀY
function loadSavedUserInfo() {
  try {
    const saved = JSON.parse(localStorage.getItem("IT_HELPDESK_USER_INFO") || "{}");
    if (saved.fullname && document.getElementById("fullname")) document.getElementById("fullname").value = saved.fullname;
    if (saved.phone && document.getElementById("phone")) document.getElementById("phone").value = saved.phone;
    if (saved.department && document.getElementById("department")) document.getElementById("department").value = saved.department;
    if (saved.machineName && document.getElementById("machineName")) document.getElementById("machineName").value = saved.machineName;
  } catch(e){}
}

function saveUserInfoIfChecked() {
  const chk = document.getElementById("chkRememberMe");
  if (chk && chk.checked) {
    const info = {
      fullname: (document.getElementById("fullname")?.value || "").trim(),
      phone: (document.getElementById("phone")?.value || "").trim(),
      department: document.getElementById("department")?.value || "",
      machineName: (document.getElementById("machineName")?.value || "").trim()
    };
    localStorage.setItem("IT_HELPDESK_USER_INFO", JSON.stringify(info));
  }
}

// 4. HỖ TRỢ DÁN ẢNH TRỰC TIẾP TỪ CLIPBOARD (CTRL + V)
function setupPasteEventListener() {
  window.addEventListener("paste", (e) => {
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          compressAndPreviewImage(file);
          break;
        }
      }
    }
  });
}

function setupDragAndDrop() {
  const dropZone = document.getElementById("dropZone");
  if (!dropZone) return;

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("dragover");
    }, false);
  });
  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("dragover");
    }, false);
  });
  dropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt?.files;
    if (files && files[0]) {
      compressAndPreviewImage(files[0]);
    }
  }, false);
}

function triggerFileInput() {
  const el = document.getElementById("fileInput");
  if (el) el.click();
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) compressAndPreviewImage(file);
}

// 5. NÉN ẢNH (CANVAS COMPRESSION) XUỐNG < 250KB ĐỂ UPLOAD SIÊU NHANH
function compressAndPreviewImage(file) {
  if (!file.type.match("image.*")) {
    alert("Vui lòng chỉ chọn file ảnh (PNG, JPG, JPEG)!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1280;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
      detectedClient.imageBase64 = compressedDataUrl;

      const promptEl = document.getElementById("dropZonePrompt");
      if (promptEl) promptEl.classList.add("hidden");
      const previewContainer = document.getElementById("imagePreviewContainer");
      if (previewContainer) previewContainer.classList.remove("hidden");
      const previewImg = document.getElementById("imagePreview");
      if (previewImg) previewImg.src = compressedDataUrl;
      
      const sizeKb = Math.round((compressedDataUrl.length * 3 / 4) / 1024);
      const sizeInfo = document.getElementById("imageSizeInfo");
      if (sizeInfo) sizeInfo.textContent = `Ảnh đã nén: ~${sizeKb} KB (Sẵn sàng gửi)`;
    };
    img.src = readerEvent.target.result;
  };
  reader.readAsDataURL(file);
}

function removeSelectedImage(e) {
  if (e) e.stopPropagation();
  detectedClient.imageBase64 = "";
  const fi = document.getElementById("fileInput");
  if (fi) fi.value = "";
  const pc = document.getElementById("imagePreviewContainer");
  if (pc) pc.classList.add("hidden");
  const dz = document.getElementById("dropZonePrompt");
  if (dz) dz.classList.remove("hidden");
}

// 6. XỬ LÝ GỬI TICKET
async function handleSubmitTicket(e) {
  if (e) e.preventDefault();

  const btn = document.getElementById("btnSubmitTicket");
  const originalHtml = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Đang gửi lên hệ thống...`;
  }

  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || "Máy tính / PC";
  const machineVal = document.getElementById("machineName")?.value.trim() || detectedClient.machineName;

  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
               JSON.parse(sessionStorage.getItem("family_user") || sessionStorage.getItem("binhduong_user") || sessionStorage.getItem("vpdk_current_user") || "{}");
  let currentUsername = (user.username || "").trim();
  const currentFullname = document.getElementById("fullname")?.value.trim() || user.fullname || user.name || "";
  if (!currentUsername && currentFullname) {
    currentUsername = generateUsernameFromFullname(currentFullname);
  }

  const payload = {
    action: "createTicket",
    username: currentUsername,
    fullname: currentFullname,
    phone: document.getElementById("phone")?.value.trim() || user.phone || "",
    department: document.getElementById("department")?.value || "",
    machineName: machineVal,
    category: selectedCategory,
    errorMessage: document.getElementById("errorMessage")?.value.trim() || "",
    description: document.getElementById("description")?.value.trim() || "",
    imageBase64: detectedClient.imageBase64,
    ip: detectedClient.ip,
    clientSpecs: `IP: ${detectedClient.ip} | ${detectedClient.specs}`
  };

  saveUserInfoIfChecked();

  const now = new Date();
  const dCode = `${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  let finalTicketId = `TK-${dCode}-${Math.floor(100 + Math.random() * 900)}`;
  let finalTimestamp = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
  let serverSuccess = false;

  if (SCRIPT_URL && SCRIPT_URL.trim() !== "") {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result && result.success) {
        serverSuccess = true;
        if (result.ticketId) finalTicketId = result.ticketId;
        if (result.timestamp) finalTimestamp = result.timestamp;
      }
    } catch (err) {
      console.warn("Lỗi gửi POST, kích hoạt GET fallback:", err);
      try {
        const clonePayload = Object.assign({}, payload);
        delete clonePayload.imageBase64;
        const resGet = await fetch(`${SCRIPT_URL}?action=createTicket&data=${encodeURIComponent(JSON.stringify(clonePayload))}`);
        const resultGet = await resGet.json();
        if (resultGet && resultGet.success) {
          serverSuccess = true;
          if (resultGet.ticketId) finalTicketId = resultGet.ticketId;
          if (resultGet.timestamp) finalTimestamp = resultGet.timestamp;
        }
      } catch(e2) {
        console.error("GET fallback lỗi:", e2);
      }
    }
  }

  const createdTicket = {
    id: finalTicketId,
    timestamp: finalTimestamp,
    fullname: payload.fullname,
    username: currentUsername,
    phone: payload.phone,
    department: payload.department,
    machineName: payload.machineName,
    category: payload.category,
    errorMessage: payload.errorMessage,
    description: payload.description,
    imageUrl: detectedClient.imageBase64,
    status: "Chờ xử lý",
    itNote: "",
    clientSpecs: payload.clientSpecs
  };

  currentTickets.unshift(createdTicket);

  if (!SCRIPT_URL) {
    localStorage.setItem("IT_HELPDESK_LOCAL_TICKETS", JSON.stringify(currentTickets));
  }

  const em = document.getElementById("errorMessage");
  if (em) em.value = "";
  const desc = document.getElementById("description");
  if (desc) desc.value = "";
  removeSelectedImage();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }

  updateStats();
  renderTickets();

  const rId = document.getElementById("resTicketId");
  if (rId) rId.textContent = `#${finalTicketId}`;
  const rMach = document.getElementById("resMachine");
  if (rMach) rMach.textContent = payload.machineName;
  const ms = document.getElementById("modalSuccess");
  if (ms) ms.classList.remove("hidden");
  switchHelpdeskTab("list");

  if (serverSuccess) {
    setTimeout(() => {
      fetchTickets(false);
    }, 1200);
  }
}

// 7. LẤY DỮ LIỆU TICKET TỪ GOOGLE SHEET
async function fetchTickets(isManual = false) {
  const refreshIcon = document.getElementById("refreshIcon");
  if (refreshIcon) refreshIcon.classList.add("fa-spin");

  const user = (typeof FamilyAuth !== "undefined" && FamilyAuth.getUser()) ||
               JSON.parse(sessionStorage.getItem("family_user") || sessionStorage.getItem("binhduong_user") || sessionStorage.getItem("vpdk_current_user") || "null");
  const authQuery = user ? `&username=${encodeURIComponent(user.username || "")}&phone=${encodeURIComponent(user.phone || "")}&fullname=${encodeURIComponent(user.fullname || user.name || "")}` : "";

  if (SCRIPT_URL && SCRIPT_URL.trim() !== "") {
    try {
      const res = await fetch(`${SCRIPT_URL}?action=getTickets&t=${new Date().getTime()}${authQuery}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.tickets)) {
        currentTickets = data.tickets.map(t => {
          if (!t.username && t.itNote) {
            t.username = t.itNote;
            t.itNote = ""; // Vì cột L trên Sheet đã đổi thành Username
          } else if (t.itNote && t.username && t.itNote.toLowerCase() === t.username.toLowerCase()) {
            t.itNote = "";
          }
          return t;
        });
        try {
          localStorage.setItem("IT_HELPDESK_LOCAL_TICKETS", JSON.stringify(currentTickets));
        } catch(e){}
      }
    } catch (err) {
      console.warn("Không kết nối được server, tải cache:", err);
      loadDemoTickets();
    }
  } else {
    loadDemoTickets();
  }

  if (refreshIcon) refreshIcon.classList.remove("fa-spin");
  updateUIForUserRole();
  updateStats();
  renderTickets();
}

function loadDemoTickets() {
  const saved = localStorage.getItem("IT_HELPDESK_LOCAL_TICKETS");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        currentTickets = parsed;
        return;
      }
    } catch(e){}
  }
  currentTickets = [
    {
      id: "TK-261026-003",
      timestamp: "26/10/2026 08:35:10",
      fullname: "Nguyễn Thị Mai",
      username: "mai.tp",
      phone: "0908.123.456",
      department: "Tổ Kế hoạch - Tài chính",
      machineName: "Win 10/11 (PC-48A2) - Bàn 02",
      category: "Máy in / Scan",
      errorMessage: "Paper Jam inside tray 2",
      description: "Máy in kẹt giấy, đã kéo khay ra nhưng đèn báo đỏ vẫn nhấp nháy liên tục.",
      imageUrl: "",
      status: "Chờ xử lý",
      itNote: "",
      clientSpecs: "IP: 14.161.xx.xx | Win 10/11 • 8GB RAM"
    },
    {
      id: "TK-261026-002",
      timestamp: "26/10/2026 08:12:05",
      fullname: "Trần Văn Bình",
      username: "binh.tv",
      phone: "0912.345.678",
      department: "Tổ Đăng ký và Cấp GCN",
      machineName: "Win 10/11 (PC-91F0) - Bàn 05",
      category: "Chữ ký số / Cổng DVC",
      errorMessage: "Cannot find valid certificate in token",
      description: "Cắm USB Token ký số văn bản nhưng hệ thống báo lỗi không tìm thấy chứng thư.",
      imageUrl: "",
      status: "Đang xử lý",
      itNote: "Đang cài lại driver VNPT Token",
      clientSpecs: "IP: 14.161.xx.xx | Win 10/11 • 16GB RAM"
    },
    {
      id: "TK-261026-001",
      timestamp: "26/10/2026 07:50:22",
      fullname: "Lê Hoàng Nam",
      username: "nam.lh",
      phone: "Ext 101",
      department: "Bộ phận Một Cửa",
      machineName: "Win 10/11 (PC-1A3C) - Quầy 01",
      category: "Mạng Internet / Wifi",
      errorMessage: "No Internet Access (Yellow Exclamation)",
      description: "Mất mạng dây, không kết nối được vào máy chủ chia sẻ tài liệu Z:.",
      imageUrl: "",
      status: "Đã hoàn thành",
      itNote: "Đã bấm lại đầu hạt mạng RJ45",
      clientSpecs: "IP: 14.161.xx.xx | Win 10/11 • 8GB RAM"
    }
  ];
}

function getStatusRank(status) {
  const s = (status || "").trim().toLowerCase();
  if (s.includes("đang") || s.includes("progress")) return 1;
  if (s.includes("hoàn thành") || s.includes("xong") || s.includes("done")) return 3;
  return 2;
}

function parseTicketTime(item) {
  if (!item) return 0;
  const ts = (item.timestamp || "").trim();
  if (ts) {
    const m1 = ts.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/);
    if (m1) {
      return new Date(m1[3], m1[2] - 1, m1[1], m1[4], m1[5], m1[6] || 0).getTime();
    }
    const m2 = ts.match(/^(\d{1,2}):(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m2) {
      return new Date(m2[5], m2[4] - 1, m2[3], m2[1], m2[2], 0).getTime();
    }
    const m3 = ts.match(/^(\d{1,2}):(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})/);
    if (m3) {
      return new Date(new Date().getFullYear(), m3[4] - 1, m3[3], m3[1], m3[2], 0).getTime();
    }
  }
  const idMatch = (item.id || "").match(/TK-(\d{2})(\d{2})(\d{2})-(\d+)/);
  if (idMatch) {
    const yr = 2000 + parseInt(idMatch[1], 10);
    const mo = parseInt(idMatch[2], 10) - 1;
    const da = parseInt(idMatch[3], 10);
    const seq = parseInt(idMatch[4], 10);
    return new Date(yr, mo, da).getTime() + seq * 1000;
  }
  return 0;
}

function getStatusBadgeHtml(status) {
  const st = (status || "Chờ xử lý").trim();
  if (st === "Đã hoàn thành" || st === "Đã xong" || st === "Done") {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
      <i class="fa-solid fa-check mr-1 text-emerald-600"></i> Đã hoàn thành
    </span>`;
  } else if (st === "Đang xử lý") {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300 whitespace-nowrap">
      <i class="fa-solid fa-spinner fa-spin mr-1 text-sky-600"></i> Đang xử lý
    </span>`;
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
    <i class="fa-regular fa-clock mr-1 text-amber-600"></i> Chờ xử lý
  </span>`;
}

// 8. RENDER BẢNG MONITORING & DANH SÁCH THẺ MOBILE (HIỂN THỊ TOÀN BỘ SỰ CỐ)
function renderTickets() {
  const tbody = document.getElementById("ticketTableBody");
  const mobileContainer = document.getElementById("ticketCardsMobile");
  const emptyState = document.getElementById("emptyTableState");
  const searchQuery = (document.getElementById("filterSearch")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("filterStatus")?.value || "ALL";

  const visibleTickets = getVisibleTickets();

  const filtered = visibleTickets.filter(item => {
    if (statusFilter !== "ALL") {
      const s = (item.status || "").trim().toLowerCase();
      if (s !== statusFilter.toLowerCase()) return false;
    }
    if (searchQuery) {
      const text = `${item.id} ${item.fullname} ${item.username || ""} ${item.phone} ${item.department} ${item.machineName} ${item.errorMessage} ${item.description}`.toLowerCase();
      if (!text.includes(searchQuery)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    const rankA = getStatusRank(a.status);
    const rankB = getStatusRank(b.status);
    if (rankA !== rankB) return rankA - rankB;
    return parseTicketTime(b) - parseTicketTime(a);
  });

  if (filtered.length === 0) {
    if (tbody) tbody.innerHTML = "";
    if (mobileContainer) mobileContainer.innerHTML = "";
    if (emptyState) {
      emptyState.classList.remove("hidden");
      const emptyTitle = document.getElementById("emptyStateTitle");
      const emptyDesc = document.getElementById("emptyStateDesc");
      if (emptyTitle) {
        emptyTitle.textContent = isUserAdmin() 
          ? "Chưa có ticket nào phù hợp" 
          : "Đồng chí chưa có yêu cầu sự cố nào";
      }
      if (emptyDesc) {
        emptyDesc.textContent = isUserAdmin() 
          ? "Không tìm thấy yêu cầu sự cố nào trong bộ lọc này." 
          : "Hiện tại máy tính và thiết bị của bạn đang hoạt động bình thường, chưa có sự cố nào cần hỗ trợ.";
      }
    }
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  // 1. RENDER CHẾ ĐỘ MÁY TÍNH / TABLET (TABLE)
  if (tbody) {
    tbody.innerHTML = filtered.map(item => {
      const statusBadge = getStatusBadgeHtml(item.status);
      const cleanPhone = String(item.phone || "").trim().replace(/^'+/, "");

      let imageCell = '<span class="text-slate-300 text-[10px]">—</span>';
      if (item.imageUrl && item.imageUrl.trim() !== "") {
        imageCell = `
          <button type="button" data-action="view-image" data-img="${encodeURIComponent(item.imageUrl)}" data-id="${encodeURIComponent(item.id)}"
            class="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200 transition inline-flex items-center">
            <i class="fa-solid fa-image mr-1"></i> Xem ảnh
          </button>
        `;
      }

      return `
        <tr class="hover:bg-blue-50/40 transition cursor-pointer group" data-action="open-detail" data-id="${escapeHtml(item.id)}" title="Bấm vào để xem đầy đủ chi tiết ticket #${escapeHtml(item.id)}">
          <td class="py-3 px-3 align-top whitespace-nowrap">
            <div class="font-mono font-bold text-blue-900">${escapeHtml(item.id)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${escapeHtml(item.timestamp)}</div>
          </td>
          <td class="py-3 px-3 align-top">
            <div class="font-bold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]" title="${escapeHtml(item.fullname)}">${escapeHtml(item.fullname)}</div>
            <div class="text-[11px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] mt-0.5" title="${escapeHtml(item.department)}">${escapeHtml(item.department)}</div>
            <div class="flex items-center gap-1.5 mt-1 flex-wrap">
              ${item.username ? `
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold border border-indigo-200" title="Tài khoản: @${escapeHtml(item.username)}">
                  <i class="fa-regular fa-user text-[9px]"></i>@${escapeHtml(item.username)}
                </span>
              ` : ""}
              ${cleanPhone ? `<span class="text-[10px] text-blue-700 font-mono font-medium whitespace-nowrap"><i class="fa-solid fa-phone text-[9px] mr-1"></i>${escapeHtml(cleanPhone)}</span>` : ""}
            </div>
          </td>
          <td class="py-3 px-3 align-top">
            <div class="font-semibold text-slate-800 text-[11px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]" title="${escapeHtml(item.machineName || "Chưa rõ")}">
              <i class="fa-solid fa-desktop text-slate-400 text-[10px] mr-1"></i>${escapeHtml(item.machineName || "PC nội bộ")}
            </div>
            <span class="inline-block mt-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] border border-slate-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
              ${escapeHtml(item.category)}
            </span>
          </td>
          <td class="py-3 px-3 align-top">
            ${item.errorMessage ? `
              <div class="mb-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[10px] font-semibold truncate max-w-[240px]" title="${escapeHtml(item.errorMessage)}">
                <i class="fa-solid fa-triangle-exclamation text-rose-500 mr-1 text-[9px]"></i>${escapeHtml(item.errorMessage)}
              </div>
            ` : ""}
            <div class="text-slate-700 leading-relaxed text-[11px] line-clamp-2" title="${escapeHtml(item.description)}">
              ${escapeHtml(item.description)}
            </div>
          </td>
          <td class="py-3 px-3 align-top text-center" onclick="event.stopPropagation()">
            ${imageCell}
          </td>
          <td class="py-3 px-3 align-top text-center whitespace-nowrap">
            ${statusBadge}
            ${item.itNote ? `<div class="text-[9px] text-sky-700 mt-1 font-semibold truncate max-w-[100px]" title="IT: ${escapeHtml(item.itNote)}"><i class="fa-solid fa-comment-dots mr-0.5"></i>Có ghi chú</div>` : ""}
          </td>
          <td class="py-3 px-3 align-top text-center whitespace-nowrap" onclick="event.stopPropagation()">
            <button type="button" data-action="open-detail" data-id="${escapeHtml(item.id)}"
              class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center text-xs transition" title="Xem chi tiết ticket">
              <i class="fa-regular fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  // 2. RENDER CHẾ ĐỘ ĐIỆN THOẠI (DANH SÁCH THẺ DỌC)
  if (mobileContainer) {
    mobileContainer.innerHTML = filtered.map(item => {
      const statusBadge = getStatusBadgeHtml(item.status);
      const cleanPhone = String(item.phone || "").trim().replace(/^'+/, "");

      let imageButtonMobile = "";
      if (item.imageUrl && item.imageUrl.trim() !== "") {
        imageButtonMobile = `
          <button type="button" data-action="view-image" data-img="${encodeURIComponent(item.imageUrl)}" data-id="${encodeURIComponent(item.id)}"
            class="px-2.5 py-1 rounded-xl bg-blue-50 active:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 transition inline-flex items-center gap-1">
            <i class="fa-solid fa-image text-xs"></i> Xem ảnh
          </button>
        `;
      }

      return `
        <div class="bg-slate-50/90 hover:bg-blue-50/30 rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-xs cursor-pointer transition" data-action="open-detail" data-id="${escapeHtml(item.id)}">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200/60 gap-1.5">
            <div class="flex items-center space-x-1.5">
              <span class="font-mono font-bold text-xs bg-white text-blue-900 px-2 py-0.5 rounded border border-slate-200">${escapeHtml(item.id)}</span>
              <span class="text-[10px] text-slate-400 font-medium">${escapeHtml(item.timestamp)}</span>
            </div>
            <div>${statusBadge}</div>
          </div>
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-bold text-slate-900 text-xs">${escapeHtml(item.fullname)}</span>
                ${item.username ? `<span class="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold border border-indigo-200">@${escapeHtml(item.username)}</span>` : ""}
              </div>
              <div class="text-[11px] text-slate-500 mt-0.5">${escapeHtml(item.department)}</div>
            </div>
            ${cleanPhone ? `
              <a href="tel:${escapeHtml(cleanPhone)}" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-xl border border-blue-200 shrink-0 active:scale-95 transition">
                <i class="fa-solid fa-phone text-[9px]"></i> ${escapeHtml(cleanPhone)}
              </a>` : ""}
          </div>
          <div class="flex flex-wrap items-center gap-1 text-[10px]">
            <span class="px-2 py-0.5 bg-white text-slate-700 rounded-md border border-slate-200 font-semibold truncate max-w-[190px]">
              <i class="fa-solid fa-desktop text-blue-600 mr-1"></i> ${escapeHtml(item.machineName || "Chưa rõ máy")}
            </span>
            <span class="px-2 py-0.5 bg-white text-slate-600 rounded-md border border-slate-200 font-medium">
              ${escapeHtml(item.category)}
            </span>
          </div>
          ${item.errorMessage ? `
            <div class="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] font-semibold flex items-start gap-1.5">
              <i class="fa-solid fa-triangle-exclamation text-rose-500 mt-0.5 text-[10px] shrink-0"></i>
              <span class="break-words">${escapeHtml(item.errorMessage)}</span>
            </div>
          ` : ""}
          <div class="text-xs text-slate-700 leading-relaxed font-normal line-clamp-2">${escapeHtml(item.description)}</div>
          <div class="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100" onclick="event.stopPropagation()">
            <div class="flex items-center gap-1.5">
              ${imageButtonMobile}
              <button type="button" data-action="open-detail" data-id="${escapeHtml(item.id)}"
                class="px-2 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-semibold hover:bg-slate-200 transition inline-flex items-center gap-1">
                <i class="fa-regular fa-eye"></i> Chi tiết
              </button>
            </div>
            ${item.itNote ? `
              <div class="text-[10px] text-sky-900 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 max-w-[140px] truncate" title="IT: ${escapeHtml(item.itNote)}">
                <span class="font-bold text-sky-700">IT:</span> ${escapeHtml(item.itNote)}
              </div>` : '<div class="text-[10px] text-slate-400 italic">Chưa có ghi chú</div>'}
          </div>
        </div>
      `;
    }).join("");
  }
}

// 9. CẬP NHẬT SỐ LIỆU THỐNG KÊ (THEO PHẠM VI QUYỀN TRUY CẬP)
function updateStats() {
  const visible = getVisibleTickets();
  const total = visible.length;
  let pending = 0, processing = 0, completed = 0;

  visible.forEach(t => {
    const s = (t.status || "").trim().toLowerCase();
    if (s.includes("hoàn thành") || s.includes("xong") || s.includes("done")) completed++;
    else if (s.includes("đang")) processing++;
    else pending++;
  });

  const st = document.getElementById("statTotal");
  if (st) st.textContent = total;
  const sp = document.getElementById("statPending");
  if (sp) sp.textContent = pending;
  const spr = document.getElementById("statProcessing");
  if (spr) spr.textContent = processing;
  const sc = document.getElementById("statCompleted");
  if (sc) sc.textContent = completed;
}

// 9.1 MODAL XEM CHI TIẾT TICKET
function openTicketDetail(ticketId) {
  const ticket = currentTickets.find(t => t.id === ticketId);
  if (!ticket) return;
  currentDetailTicket = ticket;

  const dtId = document.getElementById("detailTicketId");
  if (dtId) dtId.textContent = ticket.id;
  const dtSt = document.getElementById("detailTicketStatus");
  if (dtSt) dtSt.innerHTML = getStatusBadgeHtml(ticket.status);
  const dtTm = document.getElementById("detailTicketTime");
  if (dtTm) dtTm.textContent = `Gửi lúc: ${ticket.timestamp}`;
  const dtFn = document.getElementById("detailFullname");
  if (dtFn) dtFn.textContent = ticket.fullname || "Cán bộ";
  const dtUn = document.getElementById("detailUsername");
  if (dtUn) {
    if (ticket.username) {
      dtUn.textContent = `@${ticket.username}`;
      dtUn.classList.remove("hidden");
    } else {
      dtUn.classList.add("hidden");
    }
  }
  const dtDp = document.getElementById("detailDepartment");
  if (dtDp) dtDp.textContent = ticket.department || "Chi nhánh số 23";
  const dtPh = document.getElementById("detailPhone");
  if (dtPh) dtPh.textContent = ticket.phone ? `SĐT: ${ticket.phone}` : "Chưa có SĐT";
  const dtMn = document.getElementById("detailMachineName");
  if (dtMn) dtMn.textContent = ticket.machineName || "PC nội bộ";
  const dtCt = document.getElementById("detailCategory");
  if (dtCt) dtCt.textContent = ticket.category || "Sự cố tin học";
  const dtSp = document.getElementById("detailSpecs");
  if (dtSp) dtSp.textContent = ticket.clientSpecs || "";

  const errBox = document.getElementById("detailErrorBox");
  const errText = document.getElementById("detailErrorMessage");
  if (ticket.errorMessage && ticket.errorMessage.trim()) {
    if (errText) errText.textContent = ticket.errorMessage;
    if (errBox) errBox.classList.remove("hidden");
  } else {
    if (errBox) errBox.classList.add("hidden");
  }

  const dtDs = document.getElementById("detailDescription");
  if (dtDs) dtDs.textContent = ticket.description || "(Không có mô tả chi tiết)";

  const imgBox = document.getElementById("detailImageBox");
  const imgPrev = document.getElementById("detailImagePreview");
  if (ticket.imageUrl && ticket.imageUrl.trim() && ticket.imageUrl !== "Xem ảnh chụp lỗi") {
    if (imgPrev) imgPrev.src = ticket.imageUrl;
    if (imgBox) imgBox.classList.remove("hidden");
  } else {
    if (imgBox) imgBox.classList.add("hidden");
    if (imgPrev) imgPrev.src = "";
  }

  const modal = document.getElementById("modalTicketDetail");
  if (modal) modal.classList.remove("hidden");
}

function closeTicketDetail() {
  const modal = document.getElementById("modalTicketDetail");
  if (modal) modal.classList.add("hidden");
  currentDetailTicket = null;
}

function openImageViewerFromDetail() {
  if (currentDetailTicket && currentDetailTicket.imageUrl) {
    openImageViewer(encodeURIComponent(currentDetailTicket.imageUrl), encodeURIComponent(currentDetailTicket.id));
  }
}

// 10. MODAL XEM ẢNH PHÓNG TO
function openImageViewer(encodedUrl, encodedId) {
  let rawUrl = decodeURIComponent(encodedUrl || "").trim();
  const id = decodeURIComponent(encodedId || "").trim();

  const titleEl = document.getElementById("modalImgTitle");
  if (titleEl) titleEl.textContent = `Ảnh chụp lỗi của Ticket #${id}`;

  const loadingBox = document.getElementById("modalImgLoading");
  const errorBox = document.getElementById("modalImgError");
  const imgEl = document.getElementById("modalFullImg");
  const driveLink = document.getElementById("modalDriveLink");
  const btnOpenDrive = document.getElementById("btnOpenDriveDirect");

  if (loadingBox) loadingBox.classList.remove("hidden");
  if (errorBox) errorBox.classList.add("hidden");
  if (imgEl) {
    imgEl.classList.add("hidden");
    imgEl.src = "";
  }

  let driveUrl = rawUrl;
  let streamUrl = rawUrl;

  if (rawUrl.startsWith("data:image/")) {
    if (driveLink) driveLink.classList.add("hidden");
    if (imgEl) imgEl.src = rawUrl;
    const mv = document.getElementById("modalImageViewer");
    if (mv) mv.classList.remove("hidden");
    return;
  }

  const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
    streamUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
  } else if (rawUrl === "Xem ảnh chụp lỗi" || !rawUrl.startsWith("http")) {
    if (loadingBox) loadingBox.classList.add("hidden");
    if (errorBox) errorBox.classList.remove("hidden");
    if (btnOpenDrive) btnOpenDrive.href = "https://drive.google.com";
    const mv = document.getElementById("modalImageViewer");
    if (mv) mv.classList.remove("hidden");
    return;
  }

  if (driveLink) {
    driveLink.href = driveUrl;
    driveLink.classList.remove("hidden");
  }
  if (btnOpenDrive) btnOpenDrive.href = driveUrl;

  if (imgEl) imgEl.src = streamUrl;
  const mv = document.getElementById("modalImageViewer");
  if (mv) mv.classList.remove("hidden");
}

function onModalImgLoaded() {
  const lb = document.getElementById("modalImgLoading");
  if (lb) lb.classList.add("hidden");
  const eb = document.getElementById("modalImgError");
  if (eb) eb.classList.add("hidden");
  const img = document.getElementById("modalFullImg");
  if (img) img.classList.remove("hidden");
}

function onModalImgError() {
  const imgEl = document.getElementById("modalFullImg");
  if (!imgEl) return;
  const currentSrc = imgEl.src;

  const driveMatch = currentSrc.match(/\/d\/([a-zA-Z0-9_-]+)/) || currentSrc.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1] && !currentSrc.includes("thumbnail")) {
    const fileId = driveMatch[1];
    imgEl.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    return;
  }

  const lb = document.getElementById("modalImgLoading");
  if (lb) lb.classList.add("hidden");
  imgEl.classList.add("hidden");
  const eb = document.getElementById("modalImgError");
  if (eb) eb.classList.remove("hidden");
}

function closeImageViewer() {
  const mv = document.getElementById("modalImageViewer");
  if (mv) mv.classList.add("hidden");
  const img = document.getElementById("modalFullImg");
  if (img) img.src = "";
}

// ==================== KHỞI CHẠY & EVENT DELEGATION ====================
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  updateUIForUserRole();
  autoDetectMachineAndSpecs();
  loadSavedUserInfo();
  setupPasteEventListener();
  setupDragAndDrop();

  try {
    const cached = localStorage.getItem("IT_HELPDESK_LOCAL_TICKETS");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        currentTickets = parsed;
        updateStats();
        renderTickets();
      }
    }
  } catch(e){}

  fetchTickets();

  // Event Delegation cho bảng và container mobile
  document.addEventListener("click", (e) => {
    // 1. Chuyển tab
    const tabBtn = e.target.closest("[data-tab-action]");
    if (tabBtn) {
      e.preventDefault();
      switchHelpdeskTab(tabBtn.dataset.tabAction);
      return;
    }

    // 2. Xem ảnh
    const viewImgBtn = e.target.closest('[data-action="view-image"]');
    if (viewImgBtn) {
      e.stopPropagation();
      openImageViewer(viewImgBtn.dataset.img, viewImgBtn.dataset.id);
      return;
    }

    // 3. Xem chi tiết
    const detailBtn = e.target.closest('[data-action="open-detail"]');
    if (detailBtn) {
      e.stopPropagation();
      openTicketDetail(detailBtn.dataset.id);
      return;
    }
  });

  // Tìm kiếm và lọc
  const filterSearch = document.getElementById("filterSearch");
  if (filterSearch) {
    let searchTimeout;
    filterSearch.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(renderTickets, 300);
    });
  }

  const filterStatus = document.getElementById("filterStatus");
  if (filterStatus) {
    filterStatus.addEventListener("change", renderTickets);
  }

  const helpdeskForm = document.getElementById("helpdeskForm");
  if (helpdeskForm) {
    helpdeskForm.addEventListener("submit", handleSubmitTicket);
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.addEventListener("change", handleFileSelect);
  }
});

// Xuất các hàm ra phạm vi toàn cục để hỗ trợ tương thích ngược
window.switchHelpdeskTab = switchHelpdeskTab;
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
window.isUserAdmin = isUserAdmin;
window.updateUIForUserRole = updateUIForUserRole;
window.autoDetectMachineAndSpecs = autoDetectMachineAndSpecs;
window.triggerFileInput = triggerFileInput;
window.handleFileSelect = handleFileSelect;
window.removeSelectedImage = removeSelectedImage;
window.handleSubmitTicket = handleSubmitTicket;
window.fetchTickets = fetchTickets;
window.openTicketDetail = openTicketDetail;
window.closeTicketDetail = closeTicketDetail;
window.openImageViewerFromDetail = openImageViewerFromDetail;
window.openImageViewer = openImageViewer;
window.onModalImgLoaded = onModalImgLoaded;
window.onModalImgError = onModalImgError;
window.closeImageViewer = closeImageViewer;
