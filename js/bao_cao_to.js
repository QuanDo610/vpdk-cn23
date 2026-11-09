/**
 * =========================================================================
 * BAO_CAO_TO.JS: PHÂN HỆ BÁO CÁO SỐ LIỆU CÔNG VIỆC HẰNG NGÀY CẤP TỔ
 * Hệ Thống Cổng Dịch Vụ Cán Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh Số 23
 * Chuẩn kiến trúc: Pure Vanilla Web ES6+ (Zero Build Step)
 * =========================================================================
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. DANH MỤC 21 HẠNG MỤC CÔNG VIỆC HẰNG NGÀY THEO 3 TỔ CHUYÊN MÔN
  // =========================================================================
  const MASTER_DAILY_ITEMS = [
    // --- PHẦN I: TỔ ĐĂNG KÝ & CẤP GCN (SEC_1) ---
    // 1. Đăng ký biến động nhà đất
    {
      id: "1.1",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "1. Công tác đăng ký biến động nhà đất",
      name: "a) Cấp GCN cho người nhận chuyển nhượng tại các dự án",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Mục 1a (Dự án)"
    },
    {
      id: "1.2",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "1. Công tác đăng ký biến động nhà đất",
      name: "b) Cấp GCN mới + Trình cấp GCN",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Mục 1b (Cấp mới & trình cấp)"
    },
    {
      id: "1.3",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "1. Công tác đăng ký biến động nhà đất",
      name: "c) Đăng ký xác nhận thay đổi chủ sở hữu (Xác nhận trên GCN)",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Mục 1c (Đổi chủ sở hữu)"
    },
    {
      id: "1.4",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "1. Công tác đăng ký biến động nhà đất",
      name: "d) Đơn xin rút hoặc trả hồ sơ (mục 1b, 1c)",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Đơn rút / trả hồ sơ"
    },

    // 2. Đăng ký Giao dịch Bảo đảm (Mẫu 01)
    {
      id: "2.1",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "2. Đăng ký Giao dịch Bảo đảm (Mẫu 01)",
      name: "Thế chấp",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Đăng ký thế chấp"
    },
    {
      id: "2.2",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "2. Đăng ký Giao dịch Bảo đảm (Mẫu 01)",
      name: "Xóa Thế chấp",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Xóa đăng ký thế chấp"
    },
    {
      id: "2.3",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "2. Đăng ký Giao dịch Bảo đảm (Mẫu 01)",
      name: "Văn bản thông báo",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Thông báo thế chấp"
    },
    {
      id: "2.4",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "2. Đăng ký Giao dịch Bảo đảm (Mẫu 01)",
      name: "Đăng ký thay đổi",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Thay đổi nội dung GDBĐ"
    },
    {
      id: "2.5",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "2. Đăng ký Giao dịch Bảo đảm (Mẫu 01)",
      name: "Loại khác",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "GDBĐ loại khác"
    },

    // 3. Các loại đăng ký biến động khác
    {
      id: "3.1",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "3. Các loại đăng ký biến động khác",
      name: "Cập nhật số nhà, CCCD mới, thay đổi họ tên, năm sinh, v.v.",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Cập nhật số nhà, CCCD..."
    },
    {
      id: "3.2",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "3. Các loại đăng ký biến động khác",
      name: "Xóa nợ tiền sử dụng đất",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Xóa nợ tiền SDĐ"
    },
    {
      id: "3.3",
      sectionId: "SEC_1",
      sectionTitle: "I. CÔNG TÁC CẤP GCN VÀ GIAO DỊCH BẢO ĐẢM",
      dept: "Tổ Đăng ký cấp GCN",
      subgroup: "3. Các loại đăng ký biến động khác",
      name: "Đơn xin rút hoặc trả hồ sơ (biến động khác)",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Đơn rút hồ sơ BĐ khác"
    },

    // --- PHẦN II: TỔ KỸ THUẬT ĐỊA CHÍNH & LƯU TRỮ (SEC_2) ---
    {
      id: "4.1",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "1. Công tác đo vẽ hiện trạng",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Đo vẽ hiện trạng"
    },
    {
      id: "4.2",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "2. Xác nhận hồ sơ vị trí đất, cho thửa chính thức",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Xác nhận vị trí đất"
    },
    {
      id: "4.3",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "3. Kiểm tra bản vẽ (của các Công ty đo vẽ) - Tổng số",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Kiểm tra bản vẽ công ty"
    },
    {
      id: "4.3.1",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "  └─ Trong đó: Bản vẽ đạt yêu cầu của công ty",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      isChild: true,
      note: "Đạt yêu cầu"
    },
    {
      id: "4.3.2",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "  └─ Trong đó: Bản vẽ không đạt yêu cầu của công ty",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      isChild: true,
      note: "Không đạt yêu cầu"
    },
    {
      id: "4.4",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "4. Xác minh hiện trạng (khảo sát bản vẽ công ty hoặc trích lục có khảo sát)",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Xác minh hiện trạng"
    },
    {
      id: "4.5",
      sectionId: "SEC_2",
      sectionTitle: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH",
      dept: "Tổ Kỹ thuật Địa chính & Lưu trữ",
      subgroup: "Công tác chuyên môn KTĐC",
      name: "5. Đã trích lục (hồ sơ trích lục)",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Hồ sơ trích lục"
    },

    // --- PHẦN III: TỔ HÀNH CHÍNH - TỔNG HỢP & MỘT CỬA (SEC_3) ---
    {
      id: "5.1",
      sectionId: "SEC_3",
      sectionTitle: "III. TỔNG HỢP CUNG CẤP THÔNG TIN",
      dept: "Tổ Hành chính - Tổng hợp",
      subgroup: "Cung cấp thông tin đất đai",
      name: "1. Cung cấp thông tin cho hộ gia đình, cá nhân",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Một cửa / Cá nhân"
    },
    {
      id: "5.2",
      sectionId: "SEC_3",
      sectionTitle: "III. TỔNG HỢP CUNG CẤP THÔNG TIN",
      dept: "Tổ Hành chính - Tổng hợp",
      subgroup: "Cung cấp thông tin đất đai",
      name: "2. Cung cấp thông tin hỗ trợ tư pháp và các cơ quan (Tòa án, Thi hành án, Công an, Thuế...)",
      tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0,
      note: "Hỗ trợ tư pháp"
    }
  ];

  // Dữ liệu tham chiếu Baseline từ Excel mẫu thực tế của Chi nhánh
  const EXCEL_BASELINE_REFERENCE = [
    { id: "1.1", tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0 },
    { id: "1.2", tonTruoc: 257, tiepNhan: 716, daGiaiQuyet: 504 },
    { id: "1.3", tonTruoc: 1, tiepNhan: 18, daGiaiQuyet: 10 },
    { id: "1.4", tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0 },
    { id: "2.1", tonTruoc: 133, tiepNhan: 441, daGiaiQuyet: 353 },
    { id: "2.2", tonTruoc: 139, tiepNhan: 273, daGiaiQuyet: 229 },
    { id: "2.3", tonTruoc: 7, tiepNhan: 6, daGiaiQuyet: 7 },
    { id: "2.4", tonTruoc: 2, tiepNhan: 31, daGiaiQuyet: 19 },
    { id: "2.5", tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0 },
    { id: "3.1", tonTruoc: 23, tiepNhan: 37, daGiaiQuyet: 39 },
    { id: "3.2", tonTruoc: 3, tiepNhan: 22, daGiaiQuyet: 19 },
    { id: "3.3", tonTruoc: 0, tiepNhan: 3, daGiaiQuyet: 3 },
    { id: "4.1", tonTruoc: 1946, tiepNhan: 611, daGiaiQuyet: 304 },
    { id: "4.2", tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0 },
    { id: "4.3", tonTruoc: 46, tiepNhan: 52, daGiaiQuyet: 50 },
    { id: "4.3.1", tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 24 },
    { id: "4.3.2", tonTruoc: 37, tiepNhan: 0, daGiaiQuyet: 26 },
    { id: "4.4", tonTruoc: 26, tiepNhan: 0, daGiaiQuyet: 0 },
    { id: "4.5", tonTruoc: 508, tiepNhan: 636, daGiaiQuyet: 540 },
    { id: "5.1", tonTruoc: 45, tiepNhan: 536, daGiaiQuyet: 530 },
    { id: "5.2", tonTruoc: 63, tiepNhan: 0, daGiaiQuyet: 0 }
  ];

  // Storage Keys chuẩn
  const STORAGE_KEY_PREFIX = "family_daily_report_";
  const STORAGE_KEY_STATUS_PREFIX = "family_daily_status_";
  const STORAGE_KEY_HISTORY = "CN23_DAILY_REPORT_HISTORY_V3";

  // =========================================================================
  // 2. STATE QUẢN LÝ DỮ LIỆU
  // =========================================================================
  let currentReportDate = getTodayDateString();
  let currentFilterDept = "ALL"; // Mặc định mở TOÀN BỘ ĐƠN VỊ
  let currentFilterItemDirect = "ALL";
  let dailyData = [];
  let currentUser = null;

  function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function getStorageKey(date) {
    return `${STORAGE_KEY_PREFIX}${date}`;
  }

  function getStatusStorageKey(date) {
    return `${STORAGE_KEY_STATUS_PREFIX}${date}`;
  }

  /**
   * Kiểm tra quyền Quản trị viên (Chỉ Đỗ Trọng Minh Quân & Nguyễn Thị Bích Tuyền)
   */
  function isSuperAdmin(user) {
    if (!user) return false;
    const name = (user.fullname || user.name || "").toLowerCase();
    const username = (user.username || user.id || "").toLowerCase();
    const phone = String(user.phone || "");
    const role = (user.role || "").toLowerCase();

    if (username === "admin" || username === "quandtm" || phone.includes("0973807027") || name.includes("quan")) {
      return true; // IT Admin Đỗ Trọng Minh Quân
    }
    if (username === "tuyenntb" || phone.includes("0909736435") || name.includes("tuyen")) {
      return true; // Tổ trưởng HCTH Nguyễn Thị Bích Tuyền
    }
    return role === "admin";
  }

  /**
   * Khởi tạo bộ dữ liệu sạch với giá trị baseline tham chiếu
   */
  function cloneMasterWithBaseline(multiplier = 1.0) {
    return MASTER_DAILY_ITEMS.map(item => {
      const ref = EXCEL_BASELINE_REFERENCE.find(r => r.id === item.id);
      if (!ref) {
        return { ...item, tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0, note: item.note || "" };
      }
      return {
        ...item,
        tonTruoc: Math.round(ref.tonTruoc * multiplier),
        tiepNhan: Math.round(ref.tiepNhan * multiplier),
        daGiaiQuyet: Math.round(ref.daGiaiQuyet * multiplier),
        note: item.note || ""
      };
    });
  }

  function getDateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // =========================================================================
  // 3. TẠO DATA SAMPLES (ÍT NHẤT 4 BỘ DỮ LIỆU MẪU CÁC NGÀY CHO KIỂM THỬ)
  // =========================================================================
  function initSampleData(force = false) {
    const history = getStoredDailyHistory();
    if (!force && history.length >= 3) {
      // Đã có ít nhất 3 ngày trong lịch sử thì chỉ đảm bảo ngày hôm nay có data
      if (!localStorage.getItem(getStorageKey(currentReportDate))) {
        const data = cloneMasterWithBaseline(1.0);
        localStorage.setItem(getStorageKey(currentReportDate), JSON.stringify(data));
      }
      return;
    }

    // 4 ngày mẫu động theo lịch máy tính hiện tại: Hôm nay (0), Hôm qua (1), Hôm kia (2), 3 ngày trước (3)
    const sampleDates = [
      {
        date: getDateOffset(0), // Hôm nay
        mult: 1.0,
        subStatus: {
          SEC_1: { submitted: true, sender: "Trần Quốc Hưng (Tổ trưởng)", time: "16:15" },
          SEC_2: { submitted: true, sender: "Nguyễn Thị Thúy Trang (Tổ trưởng)", time: "16:40" },
          SEC_3: { submitted: true, sender: "Nguyễn Thị Bích Tuyền (Tổ trưởng)", time: "17:05" }
        }
      },
      {
        date: getDateOffset(1), // Hôm qua
        mult: 0.95,
        subStatus: {
          SEC_1: { submitted: true, sender: "Trần Quốc Hưng (Tổ trưởng)", time: "16:30" },
          SEC_2: { submitted: true, sender: "Nguyễn Thị Thúy Trang (Tổ trưởng)", time: "16:45" },
          SEC_3: { submitted: true, sender: "Nguyễn Thị Bích Tuyền (Tổ trưởng)", time: "17:00" }
        }
      },
      {
        date: getDateOffset(2), // Hôm kia
        mult: 0.88,
        subStatus: {
          SEC_1: { submitted: true, sender: "Đặng Thị Tuyết Trinh (Tổ phó)", time: "16:20" },
          SEC_2: { submitted: true, sender: "Huỳnh Tấn Nguyên (Tổ phó)", time: "16:50" },
          SEC_3: { submitted: true, sender: "Nguyễn Thị Bích Tuyền (Tổ trưởng)", time: "17:10" }
        }
      },
      {
        date: getDateOffset(3), // 3 ngày trước
        mult: 0.92,
        subStatus: {
          SEC_1: { submitted: true, sender: "Trần Quốc Hưng (Tổ trưởng)", time: "16:35" },
          SEC_2: { submitted: true, sender: "Nguyễn Thị Thúy Trang (Tổ trưởng)", time: "16:40" },
          SEC_3: { submitted: true, sender: "Nguyễn Thị Bích Tuyền (Tổ trưởng)", time: "16:55" }
        }
      }
    ];

    const newHistoryRecords = [];

    sampleDates.forEach(sd => {
      const data = cloneMasterWithBaseline(sd.mult);
      localStorage.setItem(getStorageKey(sd.date), JSON.stringify(data));
      localStorage.setItem(getStatusStorageKey(sd.date), JSON.stringify(sd.subStatus));

      // Tính tổng hợp cho lịch sử
      let tTon = 0, tNhan = 0, tGQ = 0, tChua = 0;
      data.forEach(it => {
        if (!it.isChild) {
          tTon += it.tonTruoc;
          tNhan += it.tiepNhan;
          tGQ += it.daGiaiQuyet;
          tChua += Math.max(0, (it.tonTruoc + it.tiepNhan) - it.daGiaiQuyet);
        }
      });
      const grandNeed = tTon + tNhan;
      const rate = grandNeed > 0 ? ((tGQ / grandNeed) * 100).toFixed(1) + "%" : "0.0%";

      newHistoryRecords.push({
        id: `SAMPLE_${sd.date}`,
        date: sd.date,
        totalTon: tTon,
        totalNhan: tNhan,
        totalGQ: tGQ,
        totalChua: tChua,
        rateSolve: rate,
        savedAt: `${sd.date} 17:15:00`,
        sender: "Tổng hợp 3 Tổ",
        status: "Đã chốt sổ"
      });
    });

    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistoryRecords));
  }

  /**
   * Tải dữ liệu của ngày:
   * Nếu có trong LocalStorage -> Đọc ra
   * Nếu chưa có -> Tự động nạp baseline mẫu
   */
  function loadDataForDate(date) {
    try {
      const raw = localStorage.getItem(getStorageKey(date));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dailyData = MASTER_DAILY_ITEMS.map(m => {
            const found = parsed.find(p => p.id === m.id);
            if (found) {
              return {
                ...m,
                tonTruoc: Number(found.tonTruoc) || 0,
                tiepNhan: Number(found.tiepNhan) || 0,
                daGiaiQuyet: Number(found.daGiaiQuyet) || 0,
                note: found.note !== undefined ? found.note : m.note
              };
            }
            return { ...m, tonTruoc: 0, tiepNhan: 0, daGiaiQuyet: 0 };
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Lỗi đọc dữ liệu ngày:", e);
    }

    // Tự động nạp baseline mẫu ban đầu
    dailyData = cloneMasterWithBaseline(1.0);
    saveDataForDate(date);
  }

  function saveDataForDate(date) {
    try {
      localStorage.setItem(getStorageKey(date), JSON.stringify(dailyData));
    } catch (e) {
      console.error("Lỗi lưu dữ liệu:", e);
      showToast("Lỗi khi ghi dữ liệu vào bộ nhớ!", "error");
    }
  }

  function getSubmissionStatus(date, secId) {
    try {
      const raw = localStorage.getItem(getStatusStorageKey(date));
      if (raw) {
        const statusMap = JSON.parse(raw);
        if (secId === "ALL") return statusMap;
        return statusMap[secId] || { submitted: false };
      }
    } catch (e) {
      console.warn("Lỗi đọc trạng thái:", e);
    }
    return { submitted: false };
  }

  function setSubmissionStatus(date, secId, statusObj) {
    try {
      let statusMap = {};
      const raw = localStorage.getItem(getStatusStorageKey(date));
      if (raw) statusMap = JSON.parse(raw);
      statusMap[secId] = {
        ...statusMap[secId],
        ...statusObj,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(getStatusStorageKey(date), JSON.stringify(statusMap));
    } catch (e) {
      console.error("Lỗi ghi trạng thái:", e);
    }
  }

  function getStoredDailyHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredDailyHistory(history) {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }

  // =========================================================================
  // 4. TOAST THÔNG BÁO VĂN PHÒNG
  // =========================================================================
  function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    let bg = "bg-blue-900 border-blue-700 text-white";
    let icon = '<i class="fa-solid fa-circle-info text-amber-400"></i>';

    if (type === "success") {
      bg = "bg-emerald-800 border-emerald-600 text-white";
      icon = '<i class="fa-solid fa-circle-check text-emerald-300"></i>';
    } else if (type === "error" || type === "danger") {
      bg = "bg-rose-900 border-rose-700 text-white";
      icon = '<i class="fa-solid fa-triangle-exclamation text-rose-300"></i>';
    } else if (type === "warning") {
      bg = "bg-amber-800 border-amber-600 text-white";
      icon = '<i class="fa-solid fa-clock-rotate-left text-amber-300"></i>';
    }

    toast.className = `${bg} px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition transform duration-200 pointer-events-auto max-w-md`;
    toast.innerHTML = `${icon} <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // =========================================================================
  // 5. RENDER BẢNG DỮ LIỆU & CẬP NHẬT CHỈ SỐ
  // =========================================================================
  function renderDailyTable() {
    const tbody = document.getElementById("dailyTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    let curSection = "";
    let curSubgroup = "";

    let sumTon = 0;
    let sumNhan = 0;
    let sumGQ = 0;
    let sumChua = 0;

    // Bộ đếm cho 3 Thẻ Giám sát Tổ
    const deptStats = {
      SEC_1: { nhan: 0, gq: 0, chua: 0 },
      SEC_2: { nhan: 0, gq: 0, chua: 0 },
      SEC_3: { nhan: 0, gq: 0, chua: 0 }
    };

    dailyData.forEach((item, idx) => {
      const ton = Number(item.tonTruoc) || 0;
      const nhan = Number(item.tiepNhan) || 0;
      const gq = Number(item.daGiaiQuyet) || 0;
      const total = ton + nhan;
      const chua = Math.max(0, total - gq);
      const rate = total > 0 ? ((gq / total) * 100).toFixed(1) : "0.0";

      // Thống kê cho 3 thẻ tổ (trừ dòng con)
      if (!item.isChild && deptStats[item.sectionId]) {
        deptStats[item.sectionId].nhan += nhan;
        deptStats[item.sectionId].gq += gq;
        deptStats[item.sectionId].chua += chua;
      }

      // Bộ lọc theo Tổ
      if (currentFilterDept !== "ALL" && item.sectionId !== currentFilterDept) {
        return;
      }

      // Bộ lọc trực tiếp theo loại hồ sơ
      if (currentFilterItemDirect !== "ALL" && item.id !== currentFilterItemDirect) {
        return;
      }

      // Cộng dồn tổng theo bộ lọc
      if (!item.isChild) {
        sumTon += ton;
        sumNhan += nhan;
        sumGQ += gq;
        sumChua += chua;
      }

      // Hàng Tiêu đề Section (Nếu hiển thị ALL)
      if (currentFilterItemDirect === "ALL" && item.sectionTitle !== curSection) {
        curSection = item.sectionTitle;
        const trSec = document.createElement("tr");
        trSec.className = "tr-section-header";
        trSec.innerHTML = `
          <td colspan="9">
            <div class="flex items-center justify-between">
              <span><i class="fa-solid fa-folder-open mr-2 text-amber-500"></i>${curSection}</span>
              <span class="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">${item.dept}</span>
            </div>
          </td>
        `;
        tbody.appendChild(trSec);
      }

      // Hàng Tiêu đề Phân nhóm (Subgroup)
      if (currentFilterItemDirect === "ALL" && item.subgroup && item.subgroup !== curSubgroup) {
        curSubgroup = item.subgroup;
        const trSub = document.createElement("tr");
        trSub.className = "tr-subgroup-header";
        trSub.innerHTML = `
          <td colspan="9">
            <span class="ml-2 font-bold text-slate-700">${curSubgroup}</span>
          </td>
        `;
        tbody.appendChild(trSub);
      }

      // Hàng chi tiết
      const tr = document.createElement("tr");
      tr.id = `row-item-${item.id.replace(/\./g, "_")}`;
      if (item.isChild) {
        tr.classList.add("child-row-bg");
      }

      let fillBg = "bg-emerald-500";
      if (parseFloat(rate) < 50) fillBg = "bg-rose-500";
      else if (parseFloat(rate) < 80) fillBg = "bg-amber-500";

      tr.innerHTML = `
        <td class="item-code-cell">${item.id}</td>
        <td>
          <div class="${item.isChild ? 'pl-4 text-slate-600 font-normal italic' : 'font-semibold text-slate-800'}">
            ${item.name}
          </div>
        </td>
        <td class="cell-right">
          <input type="number" min="0" class="daily-cell-input" data-idx="${idx}" data-field="tonTruoc" value="${ton}">
        </td>
        <td class="cell-right">
          <input type="number" min="0" class="daily-cell-input text-blue-800 font-extrabold" data-idx="${idx}" data-field="tiepNhan" value="${nhan}">
        </td>
        <td class="cell-right">
          <input type="text" readonly class="daily-cell-input daily-cell-readonly font-bold" value="${total.toLocaleString('vi-VN')}">
        </td>
        <td class="cell-right">
          <input type="number" min="0" class="daily-cell-input text-emerald-800 font-extrabold" data-idx="${idx}" data-field="daGiaiQuyet" value="${gq}">
        </td>
        <td class="cell-right">
          <input type="text" readonly class="daily-cell-input daily-cell-readonly ${chua > 0 ? 'has-backlog' : 'no-backlog'}" value="${chua.toLocaleString('vi-VN')}">
        </td>
        <td>
          <div class="cell-progress-bar">
            <div class="cell-progress-track">
              <div class="cell-progress-fill ${fillBg}" style="width: ${Math.min(100, parseFloat(rate))}%;"></div>
            </div>
            <span class="rate-percent-text">${rate}%</span>
          </div>
        </td>
        <td>
          <input type="text" class="w-full text-xs px-2 py-1 border border-slate-300 rounded bg-white" data-idx="${idx}" data-field="note" value="${item.note || ''}" placeholder="Ghi chú...">
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Hàng Tổng Cộng
    const grandNeed = sumTon + sumNhan;
    const grandRate = grandNeed > 0 ? ((sumGQ / grandNeed) * 100).toFixed(1) : "0.0";
    const trTotal = document.createElement("tr");
    trTotal.className = "tr-grand-total";
    trTotal.innerHTML = `
      <td colspan="2" class="cell-center uppercase">
        <i class="fa-solid fa-calculator mr-1"></i> TỔNG CỘNG THEO BỘ LỌC
      </td>
      <td class="cell-val-total">${sumTon.toLocaleString('vi-VN')}</td>
      <td class="cell-val-total cell-val-navy">${sumNhan.toLocaleString('vi-VN')}</td>
      <td class="cell-val-total">${grandNeed.toLocaleString('vi-VN')}</td>
      <td class="cell-val-total cell-val-green">${sumGQ.toLocaleString('vi-VN')}</td>
      <td class="cell-val-total cell-val-red">${sumChua.toLocaleString('vi-VN')}</td>
      <td class="cell-center text-xs">${grandRate}%</td>
      <td></td>
    `;
    tbody.appendChild(trTotal);

    updateKPICards(sumTon, sumNhan, sumGQ, sumChua, grandNeed, grandRate);
    updateDepartmentMonitorCards(deptStats);
    attachInputListeners();
  }

  function updateDepartmentMonitorCards(stats) {
    const n1 = document.getElementById("monNhanSec1");
    const g1 = document.getElementById("monGqSec1");
    const c1 = document.getElementById("monChuaSec1");
    if (n1) n1.textContent = stats.SEC_1.nhan.toLocaleString("vi-VN");
    if (g1) g1.textContent = stats.SEC_1.gq.toLocaleString("vi-VN");
    if (c1) c1.textContent = stats.SEC_1.chua.toLocaleString("vi-VN");

    const n2 = document.getElementById("monNhanSec2");
    const g2 = document.getElementById("monGqSec2");
    const c2 = document.getElementById("monChuaSec2");
    if (n2) n2.textContent = stats.SEC_2.nhan.toLocaleString("vi-VN");
    if (g2) g2.textContent = stats.SEC_2.gq.toLocaleString("vi-VN");
    if (c2) c2.textContent = stats.SEC_2.chua.toLocaleString("vi-VN");

    const n3 = document.getElementById("monNhanSec3");
    const g3 = document.getElementById("monGqSec3");
    const c3 = document.getElementById("monChuaSec3");
    if (n3) n3.textContent = stats.SEC_3.nhan.toLocaleString("vi-VN");
    if (g3) g3.textContent = stats.SEC_3.gq.toLocaleString("vi-VN");
    if (c3) c3.textContent = stats.SEC_3.chua.toLocaleString("vi-VN");

    const status1 = getSubmissionStatus(currentReportDate, "SEC_1");
    const status2 = getSubmissionStatus(currentReportDate, "SEC_2");
    const status3 = getSubmissionStatus(currentReportDate, "SEC_3");

    const t1 = document.getElementById("monTimeSec1");
    const t2 = document.getElementById("monTimeSec2");
    const t3 = document.getElementById("monTimeSec3");

    if (t1) t1.textContent = status1 && status1.submitted ? `Đã gửi (${status1.time})` : "Chưa gửi";
    if (t2) t2.textContent = status2 && status2.submitted ? `Đã gửi (${status2.time})` : "Chưa gửi";
    if (t3) t3.textContent = status3 && status3.submitted ? `Đã gửi (${status3.time})` : "Chưa gửi";
  }

  function updateKPICards(ton, nhan, gq, chua, total, rate) {
    const elTon = document.getElementById("kpiDailyTon");
    const elNhan = document.getElementById("kpiDailyNhan");
    const elGQ = document.getElementById("kpiDailyGQ");
    const elChua = document.getElementById("kpiDailyChua");
    const elRate = document.getElementById("kpiDailySolveRate");

    if (elTon) elTon.textContent = ton.toLocaleString("vi-VN");
    if (elNhan) elNhan.textContent = nhan.toLocaleString("vi-VN");
    if (elGQ) elGQ.textContent = gq.toLocaleString("vi-VN");
    if (elChua) elChua.textContent = chua.toLocaleString("vi-VN");
    if (elRate) elRate.textContent = `Tỉ lệ giải quyết: ${rate}% (Tổng: ${total.toLocaleString("vi-VN")})`;
  }

  function attachInputListeners() {
    const inputs = document.querySelectorAll(".daily-cell-input[data-field], input[data-field='note']");
    inputs.forEach(inp => {
      inp.addEventListener("input", function (e) {
        const idx = parseInt(e.target.getAttribute("data-idx"), 10);
        const field = e.target.getAttribute("data-field");
        if (isNaN(idx) || !dailyData[idx]) return;

        if (field === "note") {
          dailyData[idx].note = e.target.value;
        } else {
          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
          dailyData[idx][field] = val;
        }

        saveDataForDate(currentReportDate);
        renderDailyTable();
      });
    });
  }

  // =========================================================================
  // 6. NẠP DROPDOWNS & XỬ LÝ QUICK ENTRY
  // =========================================================================
  function populateFilterDirectDropdown() {
    const sel = document.getElementById("selectFilterItemDirect");
    if (!sel) return;

    sel.innerHTML = '<option value="ALL">-- Hiển thị tất cả 21 hạng mục --</option>';

    const secGroups = [
      { sec: "SEC_1", label: "I. CÔNG TÁC CẤP GCN & GIAO DỊCH BẢO ĐẢM" },
      { sec: "SEC_2", label: "II. HỒ SƠ KỸ THUẬT ĐỊA CHÍNH" },
      { sec: "SEC_3", label: "III. TỔNG HỢP CUNG CẤP THÔNG TIN" }
    ];

    secGroups.forEach(grp => {
      if (currentFilterDept !== "ALL" && grp.sec !== currentFilterDept) return;

      const optGroup = document.createElement("optgroup");
      optGroup.label = grp.label;

      const items = dailyData.filter(d => d.sectionId === grp.sec);
      items.forEach(it => {
        const opt = document.createElement("option");
        opt.value = it.id;
        opt.textContent = `${it.id}. ${it.name}`;
        if (it.id === currentFilterItemDirect) opt.selected = true;
        optGroup.appendChild(opt);
      });

      sel.appendChild(optGroup);
    });
  }

  function populateQuickSelectDropdown() {
    const sel = document.getElementById("quickItemSelect");
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Chọn loại hồ sơ / công việc cần cập nhật --</option>';

    const secGroups = [
      { sec: "SEC_1", label: "I. TỔ ĐĂNG KÝ & CẤP GCN" },
      { sec: "SEC_2", label: "II. TỔ KỸ THUẬT ĐỊA CHÍNH" },
      { sec: "SEC_3", label: "III. TỔ HÀNH CHÍNH - TỔNG HỢP / MỘT CỬA" }
    ];

    secGroups.forEach(grp => {
      const optGroup = document.createElement("optgroup");
      optGroup.label = grp.label;
      const items = dailyData.filter(d => d.sectionId === grp.sec);
      items.forEach(it => {
        const opt = document.createElement("option");
        opt.value = it.id;
        opt.textContent = `${it.id}. ${it.name}`;
        optGroup.appendChild(opt);
      });
      sel.appendChild(optGroup);
    });

    sel.addEventListener("change", function () {
      const itemId = this.value;
      if (!itemId) return;
      const found = dailyData.find(d => d.id === itemId);
      if (found) {
        const inTon = document.getElementById("quickInTon");
        const inNhan = document.getElementById("quickInNhan");
        const inGQ = document.getElementById("quickInGQ");

        if (inTon) inTon.value = found.tonTruoc;
        if (inNhan) inNhan.value = found.tiepNhan;
        if (inGQ) inGQ.value = found.daGiaiQuyet;
      }
    });
  }

  function setupQuickEntryEvents() {
    const inTon = document.getElementById("quickInTon");
    const inNhan = document.getElementById("quickInNhan");
    const inGQ = document.getElementById("quickInGQ");
    const btnApply = document.getElementById("btnApplyQuickEntry");

    if (btnApply) {
      btnApply.addEventListener("click", function () {
        const sel = document.getElementById("quickItemSelect");
        const itemId = sel?.value;
        if (!itemId) {
          showToast("Vui lòng chọn loại hồ sơ cần cập nhật!", "warning");
          return;
        }

        const idx = dailyData.findIndex(d => d.id === itemId);
        if (idx !== -1) {
          const ton = Math.max(0, parseInt(inTon?.value, 10) || 0);
          const nhan = Math.max(0, parseInt(inNhan?.value, 10) || 0);
          const gq = Math.max(0, parseInt(inGQ?.value, 10) || 0);

          dailyData[idx].tonTruoc = ton;
          dailyData[idx].tiepNhan = nhan;
          dailyData[idx].daGiaiQuyet = gq;

          saveDataForDate(currentReportDate);

          if (currentFilterItemDirect !== "ALL" && currentFilterItemDirect !== itemId) {
            currentFilterItemDirect = "ALL";
            const selDirect = document.getElementById("selectFilterItemDirect");
            if (selDirect) selDirect.value = "ALL";
          }

          renderDailyTable();

          const rowEl = document.getElementById(`row-item-${itemId.replace(/\./g, "_")}`);
          if (rowEl) {
            rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
            rowEl.classList.remove("flash-highlight");
            void rowEl.offsetWidth;
            rowEl.classList.add("flash-highlight");
          }

          showToast(`Đã cập nhật mục [${itemId}] thành công!`, "success");
        }
      });
    }
  }

  // =========================================================================
  // 7. BẢNG THEO DÕI LỊCH SỬ CÁC NGÀY & BỘ LỌC TỪ NGÀY ĐẾN NGÀY (CHỈ ADMIN)
  // =========================================================================
  function renderDailyHistoryTable(filteredList = null) {
    const tbody = document.getElementById("dailyHistoryTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const list = filteredList || getStoredDailyHistory();

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center py-6 text-slate-400 font-medium">
            <i class="fa-solid fa-folder-open text-2xl mb-1 text-slate-300 block"></i>
            Chưa có bản ghi lịch sử nào phù hợp với bộ lọc ngày
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((rec, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="cell-center font-bold text-slate-500">${idx + 1}</td>
        <td class="font-bold text-blue-900">${rec.date}</td>
        <td><span class="font-semibold text-slate-800">${rec.sender || "Toàn đơn vị"}</span></td>
        <td class="cell-right">${(rec.totalTon || 0).toLocaleString("vi-VN")}</td>
        <td class="cell-right font-bold text-blue-800">${(rec.totalNhan || 0).toLocaleString("vi-VN")}</td>
        <td class="cell-right font-bold text-emerald-700">${(rec.totalGQ || 0).toLocaleString("vi-VN")}</td>
        <td class="cell-right font-bold text-rose-600">${(rec.totalChua || 0).toLocaleString("vi-VN")}</td>
        <td class="cell-center font-extrabold text-blue-900">${rec.rateSolve || "0.0%"}</td>
        <td class="text-xs text-slate-500">${rec.savedAt || rec.date}</td>
        <td class="cell-center">
          <button type="button" class="btn-micro" data-load-history-date="${rec.date}" title="Tải số liệu ngày này lên biểu mẫu">
            <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>Xem lại
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Gắn sự kiện nút xem lại
    document.querySelectorAll("[data-load-history-date]").forEach(btn => {
      btn.addEventListener("click", function () {
        const date = this.getAttribute("data-load-history-date");
        if (date) {
          currentReportDate = date;
          const dateInput = document.getElementById("reportDailyDateInput");
          if (dateInput) dateInput.value = date;

          loadDataForDate(date);
          renderDailyTable();
          updateSubmissionBadge();

          window.scrollTo({ top: 0, behavior: "smooth" });
          showToast(`Đã nạp số liệu báo cáo của ngày ${date}!`, "success");
        }
      });
    });
  }

  function setupHistoryFilterEvents() {
    const btnApply = document.getElementById("btnApplyHistoryFilter");
    const btnReset = document.getElementById("btnResetHistoryFilter");
    const inFrom = document.getElementById("filterHistoryFromDate");
    const inTo = document.getElementById("filterHistoryToDate");
    const inDept = document.getElementById("filterHistoryDept");

    // Đặt mặc định từ ngày đầu tháng đến hôm nay
    if (inFrom && inTo) {
      const now = new Date();
      inTo.value = getTodayDateString();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const mm = String(firstDay.getMonth() + 1).padStart(2, "0");
      inFrom.value = `${firstDay.getFullYear()}-${mm}-01`;
    }

    if (btnApply) {
      btnApply.addEventListener("click", function () {
        const fromDate = inFrom?.value;
        const toDate = inTo?.value;
        const dept = inDept?.value || "ALL";

        const allHistory = getStoredDailyHistory();
        const filtered = allHistory.filter(item => {
          if (fromDate && item.date < fromDate) return false;
          if (toDate && item.date > toDate) return false;
          if (dept !== "ALL" && item.dept && item.dept !== dept) return false;
          return true;
        });

        renderDailyHistoryTable(filtered);
        showToast(`Đã lọc được ${filtered.length} bản ghi báo cáo!`, "info");
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", function () {
        if (inFrom && inTo) {
          const now = new Date();
          inTo.value = getTodayDateString();
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          const mm = String(firstDay.getMonth() + 1).padStart(2, "0");
          inFrom.value = `${firstDay.getFullYear()}-${mm}-01`;
        }
        if (inDept) inDept.value = "ALL";
        renderDailyHistoryTable();
        showToast("Đã đặt lại bộ lọc lịch sử");
      });
    }

    const btnClearHistory = document.getElementById("btnClearDailyHistory");
    if (btnClearHistory) {
      btnClearHistory.addEventListener("click", function () {
        if (confirm("CẢNH BÁO ADMIN: Bạn có chắc chắn muốn xóa toàn bộ lịch sử các ngày báo cáo?")) {
          localStorage.removeItem(STORAGE_KEY_HISTORY);
          renderDailyHistoryTable();
          showToast("Đã xóa toàn bộ lịch sử báo cáo!", "warning");
        }
      });
    }
  }

  // =========================================================================
  // 8. THAO TÁC BÁO CÁO (LƯU NHÁP, GỬI BÁO CÁO, NẠP EXCEL MẪU)
  // =========================================================================
  function setupActionButtons() {
    // 1. Nút nạp số liệu tham chiếu (Excel mẫu)
    const btnLoadBaseline = document.getElementById("btnLoadExcelBaseline");
    if (btnLoadBaseline) {
      btnLoadBaseline.addEventListener("click", function () {
        if (confirm("Nạp toàn bộ số liệu tham chiếu từ file Excel gốc vào ngày hôm nay để đối soát kiểm thử?")) {
          EXCEL_BASELINE_REFERENCE.forEach(ref => {
            const idx = dailyData.findIndex(d => d.id === ref.id);
            if (idx !== -1) {
              dailyData[idx].tonTruoc = ref.tonTruoc;
              dailyData[idx].tiepNhan = ref.tiepNhan;
              dailyData[idx].daGiaiQuyet = ref.daGiaiQuyet;
            }
          });
          saveDataForDate(currentReportDate);
          renderDailyTable();
          showToast("Đã nạp đầy đủ số liệu tham chiếu mẫu từ file Excel cũ!", "success");
        }
      });
    }

    // 2. Nút đưa toàn bộ về 0
    const btnResetAll = document.getElementById("btnResetDailyInputs");
    if (btnResetAll) {
      btnResetAll.addEventListener("click", function () {
        if (confirm("Xác nhận đưa tất cả các chỉ tiêu về 0 để làm mới biểu mẫu?")) {
          dailyData.forEach(item => {
            item.tonTruoc = 0;
            item.tiepNhan = 0;
            item.daGiaiQuyet = 0;
          });
          saveDataForDate(currentReportDate);
          renderDailyTable();
          showToast("Đã làm mới và đưa tất cả số liệu về 0!", "info");
        }
      });
    }

    // 3. Nút Lưu bản nháp
    const btnSaveDraft = document.getElementById("btnSaveDraftReport");
    if (btnSaveDraft) {
      btnSaveDraft.addEventListener("click", function () {
        saveDataForDate(currentReportDate);
        showToast(`Đã lưu bản nháp số liệu ngày ${currentReportDate} vào máy!`, "success");
      });
    }

    // 4. Nút Gửi báo cáo lên Lãnh đạo
    const btnSubmitReport = document.getElementById("btnSubmitDailyReport");
    const btnUserSubmit = document.getElementById("btnUserSubmitReport");

    function executeSubmitReport() {
      const senderName = currentUser ? (currentUser.fullname || currentUser.name) : "Cán bộ";
      const senderDept = currentFilterDept === "ALL" ? "Toàn chi nhánh (3 Tổ)" : (
        currentFilterDept === "SEC_1" ? "Tổ 1: ĐK & Cấp GCN" : (
          currentFilterDept === "SEC_2" ? "Tổ 2: KTĐC & Lưu trữ" : "Tổ 3: HCTH & Một cửa"
        )
      );

      if (confirm(`Xác nhận GỬI BÁO CÁO CÔNG VIỆC NGÀY (${currentReportDate}) của ${senderDept} lên Ban Giám đốc và Lãnh đạo chi nhánh?`)) {
        saveDataForDate(currentReportDate);

        const targetSec = currentFilterDept === "ALL" ? "SEC_1" : currentFilterDept;
        const nowTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

        setSubmissionStatus(currentReportDate, targetSec, {
          submitted: true,
          sender: senderName,
          time: nowTime
        });

        // Ghi vào lịch sử chung
        let tTon = 0, tNhan = 0, tGQ = 0, tChua = 0;
        dailyData.forEach(it => {
          if (!it.isChild) {
            tTon += it.tonTruoc;
            tNhan += it.tiepNhan;
            tGQ += it.daGiaiQuyet;
            tChua += Math.max(0, (it.tonTruoc + it.tiepNhan) - it.daGiaiQuyet);
          }
        });
        const grandNeed = tTon + tNhan;
        const rate = grandNeed > 0 ? ((tGQ / grandNeed) * 100).toFixed(1) + "%" : "0.0%";

        const history = getStoredDailyHistory();
        const existingIdx = history.findIndex(h => h.date === currentReportDate);
        const record = {
          id: `DAILY_${currentReportDate}`,
          date: currentReportDate,
          totalTon: tTon,
          totalNhan: tNhan,
          totalGQ: tGQ,
          totalChua: tChua,
          rateSolve: rate,
          savedAt: `${currentReportDate} ${nowTime}`,
          sender: `${senderName} (${senderDept})`,
          status: "Đã nộp"
        };

        if (existingIdx !== -1) {
          history[existingIdx] = record;
        } else {
          history.unshift(record);
        }
        saveStoredDailyHistory(history);

        updateSubmissionBadge();
        renderDailyTable();
        renderDailyHistoryTable();

        showToast(`Đã gửi báo cáo ngày thành công lên Lãnh đạo (lúc ${nowTime})!`, "success");
      }
    }

    if (btnSubmitReport) btnSubmitReport.addEventListener("click", executeSubmitReport);
    if (btnUserSubmit) btnUserSubmit.addEventListener("click", executeSubmitReport);

    // 5. Nút Xem Tất Cả (Reset filters)
    const btnResetFilters = document.getElementById("btnResetFilters");
    if (btnResetFilters) {
      btnResetFilters.addEventListener("click", function () {
        currentFilterDept = "ALL";
        currentFilterItemDirect = "ALL";

        const selDept = document.getElementById("filterDailyDept");
        if (selDept) selDept.value = "ALL";

        updateDeptFilterUI();
        populateFilterDirectDropdown();
        renderDailyTable();
        showToast("Đã hiển thị toàn bộ 21 hạng mục của cả 3 Tổ!");
      });
    }

    // 6. Dropdown chọn Tổ (filterDailyDept)
    const selFilterDept = document.getElementById("filterDailyDept");
    if (selFilterDept) {
      selFilterDept.addEventListener("change", function () {
        currentFilterDept = this.value || "ALL";
        currentFilterItemDirect = "ALL";
        updateDeptFilterUI();
        populateFilterDirectDropdown();
        renderDailyTable();
      });
    }

    // 7. Dropdown lọc trực tiếp loại hồ sơ (selectFilterItemDirect)
    const selFilterDirect = document.getElementById("selectFilterItemDirect");
    if (selFilterDirect) {
      selFilterDirect.addEventListener("change", function () {
        currentFilterItemDirect = this.value || "ALL";
        renderDailyTable();

        if (currentFilterItemDirect !== "ALL") {
          const rowEl = document.getElementById(`row-item-${currentFilterItemDirect.replace(/\./g, "_")}`);
          if (rowEl) {
            rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
            rowEl.classList.remove("flash-highlight");
            void rowEl.offsetWidth;
            rowEl.classList.add("flash-highlight");
          }
        }
      });
    }

    // 8. Các nút "Xem Tổ 1", "Xem Tổ 2", "Xem Tổ 3" trên 3 Thẻ Giám Sát
    const focusButtons = document.querySelectorAll("[data-focus-dept]");
    focusButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const secId = this.getAttribute("data-focus-dept");
        if (secId) focusDepartmentTable(secId);
      });
    });

    // 9. Các nút Chọn Nhanh Data Samples (Sample 1 Hôm nay, Sample 2 Hôm qua, Sample 3 Hôm kia)
    const sampleDayButtons = document.querySelectorAll("[data-sample-day]");
    sampleDayButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const offset = parseInt(this.getAttribute("data-sample-day"), 10) || 0;
        const targetDate = getDateOffset(offset);

        currentReportDate = targetDate;
        const dateInput = document.getElementById("reportDailyDateInput");
        if (dateInput) dateInput.value = targetDate;

        loadDataForDate(targetDate);
        renderDailyTable();
        updateSubmissionBadge();

        const labels = ["Hôm nay (Sample 1)", "Hôm qua (Sample 2)", "Hôm kia (Sample 3)"];
        showToast(`Đã mở bộ dữ liệu mẫu: ${labels[offset] || targetDate} (${targetDate})!`, "success");
      });
    });

    // 10. Nút Nạp Lại Toàn Bộ Data Samples
    const btnRecreate = document.getElementById("btnForceRecreateSamples");
    if (btnRecreate) {
      btnRecreate.addEventListener("click", function () {
        initSampleData(true);
        loadDataForDate(currentReportDate);
        renderDailyTable();
        renderDailyHistoryTable();
        showToast("Đã nạp mới và đồng bộ thành công toàn bộ dữ liệu mẫu các ngày!", "success");
      });
    }
  }

  function focusDepartmentTable(secId) {
    currentFilterDept = secId;
    currentFilterItemDirect = "ALL";

    const selDept = document.getElementById("filterDailyDept");
    if (selDept) selDept.value = secId;

    updateDeptFilterUI();
    populateFilterDirectDropdown();
    renderDailyTable();

    const tbody = document.getElementById("dailyTableBody");
    if (tbody) {
      tbody.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const secNames = {
      "SEC_1": "Tổ 1: Đăng ký & Cấp GCN",
      "SEC_2": "Tổ 2: Kỹ thuật địa chính & Lưu trữ",
      "SEC_3": "Tổ 3: Hành chính - Tổng hợp & Một cửa"
    };
    showToast(`Đã lọc bảng theo ${secNames[secId] || secId}!`);
  }

  function updateSubmissionBadge() {
    const badge = document.getElementById("submissionStatusBadge");
    if (!badge) return;

    const status = getSubmissionStatus(currentReportDate, currentFilterDept);
    if (status && status.submitted) {
      badge.className = "submit-status-badge submitted";
      badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã gửi báo cáo (${status.time || ''} - ${status.sender || ''})`;
    } else {
      badge.className = "submit-status-badge pending";
      badge.innerHTML = `<i class="fa-solid fa-clock"></i> Chưa gửi báo cáo hôm nay`;
    }
  }

  function updateDeptFilterUI() {
    const buttons = document.querySelectorAll(".dept-pill-btn");
    buttons.forEach(btn => {
      const sec = btn.getAttribute("data-sec");
      if (sec === currentFilterDept) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const titleEl = document.getElementById("displayCurrentDeptTitle");
    if (titleEl) {
      const titles = {
        "SEC_1": "TỔ 1: ĐĂNG KÝ & CẤP GCN",
        "SEC_2": "TỔ 2: KỸ THUẬT ĐỊA CHÍNH & LƯU TRỮ",
        "SEC_3": "TỔ 3: HÀNH CHÍNH - TỔNG HỢP & MỘT CỬA",
        "ALL": "TOÀN CHI NHÁNH (TỔNG HỢP 3 TỔ)"
      };
      titleEl.textContent = titles[currentFilterDept] || "BÁO CÁO CÔNG VIỆC";
    }

    updateSubmissionBadge();
  }

  // =========================================================================
  // 9. PHÂN QUYỀN TRUY CẬP (APPLY ROLE PERMISSIONS: ADMIN VS USER)
  // =========================================================================
  function applyRolePermissions() {
    const adminSection = document.getElementById("adminMonitoringSection");
    const userWorkspace = document.getElementById("userWorkspaceHub");
    const historySection = document.getElementById("historyTrackingSection");
    const btnBaseline = document.getElementById("btnLoadExcelBaseline");
    const btnResetAll = document.getElementById("btnResetDailyInputs");
    const userTitle = document.getElementById("userWorkspaceTitle");

    const isAdmin = isSuperAdmin(currentUser);

    if (isAdmin) {
      // ADMIN: Hiển thị Đầy đủ Quyền Quản trị & Giám sát & Bảng Theo Dõi
      if (adminSection) adminSection.style.display = "grid";
      if (historySection) historySection.style.display = "block";
      if (userWorkspace) userWorkspace.style.display = "none";
      if (btnBaseline) btnBaseline.style.display = "inline-flex";
      if (btnResetAll) btnResetAll.style.display = "inline-flex";
    } else {
      // USER: Ẩn Giám Sát, Ẩn Lịch Sử Toàn Cơ Quan, Chỉ Hiện Không Gian Cán Bộ
      if (adminSection) adminSection.style.display = "none";
      if (historySection) historySection.style.display = "none";
      if (userWorkspace) userWorkspace.style.display = "flex";
      if (btnBaseline) btnBaseline.style.display = "none";
      if (btnResetAll) btnResetAll.style.display = "none";

      // Khóa hoặc gán Tổ làm việc theo tài khoản User
      const dept = (currentUser?.department || currentUser?.dept || "").toLowerCase();
      let userSec = "SEC_2";
      let userSecName = "TỔ KỸ THUẬT ĐỊA CHÍNH VÀ LƯU TRỮ";

      if (dept.includes("dang ky") || dept.includes("cap gcn")) {
        userSec = "SEC_1";
        userSecName = "TỔ ĐĂNG KÝ VÀ CẤP GCN";
      } else if (dept.includes("hanh chinh") || dept.includes("hcth") || dept.includes("mot cua")) {
        userSec = "SEC_3";
        userSecName = "TỔ HÀNH CHÍNH - TỔNG HỢP & MỘT CỬA";
      }

      currentFilterDept = userSec;
      if (userTitle) userTitle.textContent = userSecName;

      const selDept = document.getElementById("filterDailyDept");
      if (selDept) selDept.value = userSec;

      updateDeptFilterUI();
      populateFilterDirectDropdown();
    }
  }

  // =========================================================================
  // 10. KHỞI TẠO TOÀN DIỆN HỆ THỐNG
  // =========================================================================
  function initUserAndForm() {
    // 1. Nhận diện tài khoản
    if (window.FamilyAuth) {
      currentUser = window.FamilyAuth.getCurrentUser();
    }

    if (currentUser) {
      const userDisplay = document.getElementById("displayReporterInfo");
      if (userDisplay) {
        const name = currentUser.fullname || currentUser.name || "Cán bộ";
        const role = currentUser.position || currentUser.role || "Chuyên viên";
        const isAdmin = isSuperAdmin(currentUser);
        userDisplay.innerHTML = `<i class="fa-solid fa-user-shield mr-1 ${isAdmin ? 'text-amber-500' : 'text-teal-600'}"></i> ${isAdmin ? 'Quản trị viên' : 'Cán bộ'}: <strong>${name}</strong> (${role})`;
      }
    }

    // 2. Khởi tạo Data Samples (4 ngày mẫu)
    initSampleData();

    // 3. Khởi tạo chọn ngày
    const dateInput = document.getElementById("reportDailyDateInput");
    if (dateInput) {
      dateInput.value = currentReportDate;
      dateInput.addEventListener("change", function () {
        currentReportDate = this.value || getTodayDateString();
        loadDataForDate(currentReportDate);
        renderDailyTable();
        updateSubmissionBadge();
        showToast(`Đã chuyển sang ngày làm việc: ${currentReportDate}`);
      });
    }

    // 4. Sự kiện chuyển đổi nút Pills
    const deptPills = document.querySelectorAll(".dept-pill-btn");
    deptPills.forEach(btn => {
      btn.addEventListener("click", function () {
        currentFilterDept = this.getAttribute("data-sec") || "ALL";
        currentFilterItemDirect = "ALL";

        const selDept = document.getElementById("filterDailyDept");
        if (selDept) selDept.value = currentFilterDept;

        updateDeptFilterUI();
        populateFilterDirectDropdown();
        renderDailyTable();
      });
    });

    // 5. Tải dữ liệu và Render
    loadDataForDate(currentReportDate);
    updateDeptFilterUI();
    populateFilterDirectDropdown();
    populateQuickSelectDropdown();
    setupQuickEntryEvents();
    setupActionButtons();
    setupHistoryFilterEvents();
    renderDailyTable();
    renderDailyHistoryTable();

    // 6. Áp dụng phân quyền Admin vs User
    applyRolePermissions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUserAndForm);
  } else {
    initUserAndForm();
  }
})();
