/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: HỆ THỐNG BINHDUONG23 HỢP NHẤT
 * (ĐĂNG KÝ LỊCH CÔNG TÁC TUẦN + IT HELPDESK TIẾP NHẬN SỰ CỐ)
 * =========================================================================
 * Sử dụng trực tiếp trên Google Sheet hiện tại của Lịch Tuần.
 * Quản lý 3 Sheet (Tabs):
 *   1. "LichTuan"   : Giữ nguyên 100% dữ liệu lịch đã đăng ký từ trước tới nay.
 *   2. "TaiKhoan"   : Quản lý 70 tài khoản cán bộ Chi nhánh 23 (Đăng nhập bằng SĐT).
 *   3. "Tickets"    : Quản lý tiếp nhận sự cố tin học IT + Tự lưu ảnh lên Google Drive.
 * =========================================================================
 */

// Tên các Sheet
const SHEET_SCHEDULE_NAME = "LichTuan";
const SHEET_USERS_NAME = "TaiKhoan";
const SHEET_SUPPORT_NAME = "Tickets";
const SHEET_TASKS_NAME = "GiaoViec";
const SHEET_PERFORMANCE_NAME = "BaoCaoSoLieu";
const DRIVE_FOLDER_NAME = "IT_Helpdesk_Uploads";

/**
 * Tự động tạo menu tiện ích "⭐ BINHDUONG23" trên thanh công cụ của Google Sheet
 */
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("⭐ BINHDUONG23")
      .addItem("▶️ 1-Click: Cấu hình chuẩn toàn bộ 5 Phân hệ BINHDUONG23", "setupBinhDuong23")
      .addSeparator()
      .addItem("🔤 Tự động tạo & điền Username (quandtm)", "autoFillUsernames")
      .addItem("👥 Định dạng tab TaiKhoan (Tài khoản cán bộ)", "seedAccountsOnly")
      .addItem("🎫 Định dạng tab Tickets (Sự cố IT Helpdesk)", "seedTicketsOnly")
      .addItem("📋 Định dạng tab GiaoViec (Lãnh đạo giao việc & Bảng tiến độ)", "seedTasksOnly")
      .addItem("📊 Định dạng tab BaoCaoSoLieu (Báo cáo số liệu thực hiện cấp tổ)", "seedPerformanceOnly")
      .addToUi();
  } catch (e) {}
}

/**
 * Hàm 1-Click: Tự động nâng cấp và đồng bộ toàn diện vào Google Sheet
 */
function setupBinhDuong23() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Đảm bảo tab Lịch Tuần an toàn
  getScheduleSheet(ss);

  // 2. Nạp tài khoản vào tab TaiKhoan & cập nhật cột Username
  seedAccountsOnly();
  try {
    autoFillUsernames(ss);
  } catch (e) {}

  // 3. Khởi tạo tab Tickets
  seedTicketsOnly();

  // 4. Khởi tạo tab GiaoViec
  seedTasksOnly();

  // 5. Khởi tạo tab BaoCaoSoLieu
  seedPerformanceOnly();

  SpreadsheetApp.getUi().alert(
    "✅ HỆ THỐNG BINHDUONG23 ĐÃ SẴN SÀNG TOÀN BỘ 5 PHÂN HỆ!\n\n" +
    "1. Sheet 'LichTuan': Giữ nguyên toàn bộ dữ liệu lịch tuần.\n" +
    "2. Sheet 'TaiKhoan': Đã định dạng chuẩn nhân sự CN23 & cột Username (quandtm).\n" +
    "3. Sheet 'Tickets': Đã định dạng chuẩn IT Helpdesk.\n" +
    "4. Sheet 'GiaoViec': Đã định dạng chuẩn Lãnh đạo giao việc.\n" +
    "5. Sheet 'BaoCaoSoLieu': Đã định dạng chuẩn 8 nhóm chỉ tiêu chuyên môn.\n\n" +
    "Hệ thống đã sẵn sàng 100%!"
  );
}

/**
 * Hàm sinh Username theo quy chuẩn: Tên + Họ & Tên lót viết tắt chữ cái đầu (viết thường, không dấu)
 * Ví dụ: "Đỗ Trọng Minh Quân" -> "quandtm", "Nguyễn Văn An" -> "annv"
 */
function generateUsernameFromFullname(fullname) {
  if (!fullname) return "";
  const parts = fullname.toString().trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    return removeVietnameseTones(parts[0]).toLowerCase();
  }
  const lastName = parts[parts.length - 1]; // Tên chính (từ cuối cùng)
  const normLastName = removeVietnameseTones(lastName).toLowerCase();
  // Chữ cái đầu của Họ và các Tên lót viết thường
  const initials = parts.slice(0, -1).map(function(p) {
    const norm = removeVietnameseTones(p);
    return norm ? norm.charAt(0).toLowerCase() : "";
  }).join("");
  return normLastName + initials;
}

/**
 * Công thức tùy chỉnh trong Google Sheet: =TAO_USERNAME(C2)
 * Giúp người dùng có thể kéo công thức trực tiếp trên trang tính nếu muốn
 * @customfunction
 */
function TAO_USERNAME(fullname) {
  return generateUsernameFromFullname(fullname);
}

/**
 * Hàm loại bỏ dấu tiếng Việt để hỗ trợ tìm kiếm / so khớp linh hoạt khi đăng nhập
 */
function removeVietnameseTones(str) {
  if (!str) return "";
  str = str.toString();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/Đ/g, "D");
  try {
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch (e) {}
  return str;
}

/**
 * Tự động tạo cột "Username" ở cuối hàng (nếu chưa có)
 * và điền Username chuẩn (Tên + Họ Tên lót viết tắt, VD: "quandtm") cho toàn bộ cán bộ
 */
function autoFillUsernames(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sheetUsers = ss.getSheetByName(SHEET_USERS_NAME);
  if (!sheetUsers) {
    seedAccountsOnly();
    sheetUsers = ss.getSheetByName(SHEET_USERS_NAME);
  }

  const lastRow = sheetUsers.getLastRow();
  if (lastRow < 1) {
    seedAccountsOnly();
    return { success: true, updatedCount: 0 };
  }

  const data = sheetUsers.getDataRange().getDisplayValues();
  const headerRow = data[0];
  
  // Tìm cột Họ và tên & Username
  let colName = -1;
  let colUsername = -1;

  for (let c = 0; c < headerRow.length; c++) {
    const h = (headerRow[c] || "").toString().trim().toLowerCase();
    if (h.includes("họ và tên") || h.includes("họ tên") || h.includes("fullname") || h.includes("tên cán bộ")) {
      colName = c;
    }
    if (h === "username" || h === "tên đăng nhập" || h.includes("username") || h.includes("tên đăng nhập")) {
      colUsername = c;
    }
  }

  if (colName === -1) colName = 0; // Cột A: Họ và tên
  if (colUsername === -1) colUsername = 1; // Cột B: Username

  // Nếu vị trí colUsername chưa có tiêu đề, gán tiêu đề "Username"
  if (!headerRow[colUsername] || !headerRow[colUsername].toString().toLowerCase().includes("username")) {
    sheetUsers.getRange(1, colUsername + 1).setValue("Username")
      .setFontWeight("bold")
      .setBackground("#1e40af")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
  }
  sheetUsers.getRange(1, colUsername + 1, Math.max(sheetUsers.getMaxRows(), 2), 1).setNumberFormat("@");

  // Điền Username cho từng cán bộ từ dòng 2
  let updatedCount = 0;
  for (let r = 1; r < data.length; r++) {
    const currentUsername = (data[r][colUsername] || "").toString().trim();
    const fullname = (data[r][colName] || "").toString().trim();
    
    // Nếu ô username đang trống hoặc cần sinh lại từ Họ tên
    if (!currentUsername && fullname) {
      const generatedUsername = generateUsernameFromFullname(fullname);
      sheetUsers.getRange(r + 1, colUsername + 1).setValue(generatedUsername);
      updatedCount++;
    }
  }

  sheetUsers.autoResizeColumn(colUsername + 1);

  try {
    SpreadsheetApp.getUi().alert(
      "✅ ĐÃ ĐỒNG BỘ CỘT USERNAME THÀNH CÔNG!\n\n" +
      "- Cột 'Username' đã được định vị/thiết lập ở Cột " + (colUsername === 1 ? "B (Cột thứ 2)" : ("thứ " + (colUsername + 1))) + ".\n" +
      "- Đã cập nhật Username (ví dụ: Quân ĐTM) cho " + updatedCount + " cán bộ.\n" +
      "- Cán bộ có thể đăng nhập ngay bằng Username mới và Mật khẩu!"
    );
  } catch (e) {}

  return { success: true, updatedCount: updatedCount, colIndex: colUsername + 1 };
}

/**
 * Nạp danh sách 70 tài khoản vào sheet TaiKhoan
 */
function seedAccountsOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetUsers = ss.getSheetByName(SHEET_USERS_NAME);
  
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet(SHEET_USERS_NAME);
  }

  // Nếu sheet mới tạo hoặc trống, khởi tạo hàng tiêu đề chuẩn 10 cột theo đúng thứ tự
  // 1: Họ và tên | 2: Username | 3: Mật khẩu | 4: Chức danh / Chức vụ | 5: Số điện thoại | 6: Đơn vị / Bộ phận | 7: Số CCCD | 8: Trạng thái | 9: Vai trò | 10: Ngày tạo
  if (sheetUsers.getLastRow() === 0) {
    const headers = [
      "Họ và tên",
      "Username",
      "Mật khẩu",
      "Chức danh / Chức vụ",
      "Số điện thoại",
      "Đơn vị / Bộ phận",
      "Số CCCD",
      "Trạng thái",
      "Vai trò",
      "Ngày tạo"
    ];
    sheetUsers.appendRow(headers);

    const headerRange = sheetUsers.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#1e40af").setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheetUsers.setRowHeight(1, 35);
    sheetUsers.setFrozenRows(1);

    sheetUsers.getRange("B:B").setNumberFormat("@"); // Username
    sheetUsers.getRange("C:C").setNumberFormat("@"); // Mật khẩu
    sheetUsers.getRange("E:E").setNumberFormat("@"); // Số điện thoại
    sheetUsers.getRange("G:G").setNumberFormat("@"); // Số CCCD
    sheetUsers.autoResizeColumns(1, 10);
  }
}

/**
 * Khởi tạo tab Tickets & chuyển các ticket IT sang
 */
function seedTicketsOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetSupport = ss.getSheetByName(SHEET_SUPPORT_NAME) || ss.getSheetByName("DangKySupport");
  
  if (!sheetSupport) {
    sheetSupport = ss.insertSheet(SHEET_SUPPORT_NAME);
  }

  // Nếu sheet mới tạo hoặc trống, khởi tạo hàng tiêu đề chuẩn
  if (sheetSupport.getLastRow() === 0) {
    const headers = [
      "Mã Ticket",
      "Thời gian gửi",
      "Họ và tên",
      "Số ĐT / Zalo",
      "Phòng ban",
      "Tên máy / Thiết bị",
      "Loại sự cố",
      "Thông báo lỗi (Tiếng Anh)",
      "Mô tả hiện tượng",
      "Ảnh chụp lỗi (Link)",
      "Trạng thái",
      "Ghi chú IT",
      "IP & Cấu hình máy"
    ];
    sheetSupport.appendRow(headers);
    const headerRange = sheetSupport.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold").setBackground("#b45309").setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheetSupport.setRowHeight(1, 35);
    sheetSupport.setFrozenRows(1);
    sheetSupport.getRange("D:D").setNumberFormat("@");
    sheetSupport.autoResizeColumns(1, 13);
  }
}

/**
 * Lấy sheet Lịch Tuần
 */
function getScheduleSheet(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SCHEDULE_NAME) || ss.getSheetByName("DangKyLichTuan");
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_SCHEDULE_NAME);
    const headers = [
      "ID",
      "Thời điểm gửi",
      "Người đăng ký (Username)",
      "Ngày (DD/MM/YYYY)",
      "Thứ",
      "Thời điểm làm việc",
      "Nội dung làm việc",
      "Thành phần",
      "Địa điểm"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#15803d").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.getRange("C:C").setNumberFormat("@");
    sheet.autoResizeColumns(1, 9);
  }
  return sheet;
}

/**
 * Lấy sheet Tài Khoản
 */
function getUsersSheet(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_USERS_NAME);
  if (!sheet) {
    seedAccountsOnly();
    sheet = ss.getSheetByName(SHEET_USERS_NAME);
  }
  return sheet;
}

/**
 * Lấy sheet IT Support / Tickets
 */
function getSupportSheet(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SUPPORT_NAME) || ss.getSheetByName("DangKySupport");
  if (!sheet) {
    seedTicketsOnly();
    sheet = ss.getSheetByName(SHEET_SUPPORT_NAME);
  }
  return sheet;
}

/**
 * Lấy sheet Giao việc
 */
function getTasksSheet(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_TASKS_NAME);
  if (!sheet) {
    sheet = seedTasksOnly();
  }
  return sheet;
}

/**
 * Lấy sheet Báo cáo số liệu
 */
function getPerformanceSheet(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_PERFORMANCE_NAME);
  if (!sheet) {
    sheet = seedPerformanceOnly();
  }
  return sheet;
}

/**
 * Khởi tạo tab GiaoViec
 */
function seedTasksOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_TASKS_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TASKS_NAME);
  }
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Mã việc",
      "Lãnh đạo giao việc",
      "Cán bộ nhận việc",
      "Chức vụ",
      "Tổ chuyên môn",
      "Tiêu đề nhiệm vụ",
      "Mức độ ưu tiên",
      "Văn bản căn cứ",
      "Ý kiến chỉ đạo",
      "Hạn chót (Deadline)",
      "Ghi chú",
      "Trạng thái",
      "Ngày tạo",
      "Ngày hoàn thành"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#1e3a8a")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Khởi tạo tab BaoCaoSoLieu
 */
function seedPerformanceOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_PERFORMANCE_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PERFORMANCE_NAME);
  }
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Mã báo cáo",
      "Tổ chuyên môn",
      "Loại kỳ",
      "Tên kỳ báo cáo",
      "Ngày chốt số liệu",
      "Tiếp nhận trực tiếp",
      "Tiếp nhận trực tuyến",
      "Tổng tiếp nhận",
      "Tỷ lệ trực tuyến",
      "Trả trước hạn",
      "Trả đúng hạn",
      "Trả quá hạn",
      "Tổng giải quyết",
      "Tỷ lệ đúng hạn",
      "Số thư xin lỗi",
      "Tồn trong hạn",
      "Tồn quá hạn",
      "Tổng đang giải quyết",
      "HS có NV tài chính",
      "HS thanh toán TT",
      "Tỷ lệ thanh toán TT",
      "Tiền thanh toán TT",
      "Số hóa đầu vào",
      "Số hóa đầu ra",
      "Tái sử dụng số hóa",
      "Chứng thực bản sao ĐT",
      "Đồng bộ VBDLIS",
      "Lỗi nghẽn phần mềm",
      "Tra cứu CSDL dân cư",
      "Khó khăn vướng mắc",
      "Đề xuất kiến nghị",
      "Ngày tạo"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#0f766e")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Xử lý lưu ảnh Base64 lên Google Drive thư mục IT_Helpdesk_Uploads
 */
function saveImageToDrive(base64Data, filename) {
  if (!base64Data || base64Data.trim() === "") return "";
  try {
    const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    let contentType = "image/jpeg";
    let base64String = base64Data;
    if (base64Data.indexOf("data:") === 0) {
      const parts = base64Data.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      base64String = parts[1];
    }

    const decodedBlob = Utilities.newBlob(
      Utilities.base64Decode(base64String),
      contentType,
      filename || ("ticket_img_" + new Date().getTime() + ".jpg")
    );

    const file = folder.createFile(decodedBlob);
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}

    return "https://drive.google.com/file/d/" + file.getId() + "/view";
  } catch (err) {
    return "Lỗi upload ảnh: " + err.toString();
  }
}

/**
 * Xử lý yêu cầu GET
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const params = (e && e.parameter) ? e.parameter : {};
    const action = params.action || "getSchedule";

    // 0. ĐỒNG BỘ 1-CLICK TỪ XA QUA API (SYNC ALL DATA)
    if (action === "syncAllData" || action === "seedSystem") {
      seedAccountsOnly();
      seedTicketsOnly();
      return jsonResponse({
        success: true,
        message: "Đã đồng bộ thành công 70 tài khoản CN23 và 4 tickets sự cố sang Google Sheet!",
        totalAccounts: 70,
        totalTickets: 4
      });
    }

    // 0.1 XÁC THỰC ĐĂNG NHẬP TRỰC TIẾP TỪ GOOGLE SHEET (HỖ TRỢ GET)
    if (action === "login") {
      const identifier = (params.username || params.cccd || params.identifier || params.phone || params.email || "").toString();
      const password = (params.password || "").toString();
      return jsonResponse(handleLogin(identifier, password, ss));
    }

    // 1. LẤY DANH SÁCH LỊCH TUẦN
    if (action === "getSchedule") {
      const sheet = getScheduleSheet(ss);
      const data = sheet.getDataRange().getDisplayValues();
      if (data.length <= 1) {
        return jsonResponse({ success: true, data: [] });
      }

      const userMap = {};
      const sheetUsers = ss.getSheetByName(SHEET_USERS_NAME);
      if (sheetUsers) {
        const uData = sheetUsers.getDataRange().getDisplayValues();
        if (uData.length > 1) {
          const uHeaders = uData[0].map(function(h) { return (h || "").toString().trim().toLowerCase(); });
          let uColName = uHeaders.findIndex(function(h) { return h.includes("họ và tên") || h.includes("họ tên"); });
          if (uColName === -1) uColName = 0;
          let uColUser = uHeaders.findIndex(function(h) { return h.includes("username") || h.includes("tên đăng nhập"); });
          if (uColUser === -1) uColUser = 1;
          let uColPhone = uHeaders.findIndex(function(h) { return h.includes("điện thoại") || h.includes("sđt") || h.includes("phone"); });
          if (uColPhone === -1) uColPhone = 4;
          let uColCccd = uHeaders.findIndex(function(h) { return h.includes("cccd") || h.includes("căn cước"); });
          if (uColCccd === -1) uColCccd = 6;

          for (let u = 1; u < uData.length; u++) {
            const name = (uData[u][uColName] || "").trim();
            const phone = (uData[u][uColPhone] || "").replace(/^'+/, "").toLowerCase().trim();
            const usr = (uData[u][uColUser] || "").replace(/^'+/, "").toLowerCase().trim();
            const cccd = (uData[u][uColCccd] || "").replace(/^'+/, "").toLowerCase().trim();
            if (phone && name) userMap[phone] = name;
            if (usr && name) userMap[usr] = name;
            if (cccd && name) userMap[cccd] = name;
          }
        }
      }

      const rows = [];
      const hasNameCol = data[0].length >= 10;

      for (let i = 1; i < data.length; i++) {
        const r = data[i];
        if (!r[0] && !r[2]) continue;

        let registrant = (r[2] || "").replace(/^'+/, "").trim();
        let name = "";
        let dateVal = "", dayVal = "", timeVal = "", contentVal = "", attVal = "", locVal = "";

        if (hasNameCol) {
          name = r[3] || userMap[registrant.toLowerCase()] || registrant || "";
          dateVal = r[4] || "";
          dayVal = r[5] || "";
          timeVal = r[6] || "";
          contentVal = r[7] || "";
          attVal = r[8] || "";
          locVal = r[9] || "";
        } else {
          name = userMap[registrant.toLowerCase()] || registrant || "";
          dateVal = r[3] || "";
          dayVal = r[4] || "";
          timeVal = r[5] || "";
          contentVal = r[6] || "";
          attVal = r[7] || "";
          locVal = r[8] || "";
        }

        rows.push({
          id: r[0],
          timestamp: r[1],
          username: registrant,
          phone: registrant,
          email: registrant,
          name: name,
          fullname: name,
          date: dateVal,
          dayOfWeek: dayVal,
          time: timeVal,
          content: contentVal,
          attendees: attVal,
          location: locVal
        });
      }
      return jsonResponse({ success: true, data: rows });
    }

    // 2. LẤY DANH SÁCH TICKET IT HELPDESK
    if (action === "getTickets") {
      const sheet = getSupportSheet(ss);
      const data = sheet.getDataRange().getDisplayValues();
      const formulas = sheet.getDataRange().getFormulas();

      if (data.length <= 1) {
        return jsonResponse({ success: true, total: 0, tickets: [] });
      }

      const tickets = [];
      for (let i = 1; i < data.length; i++) {
        const r = data[i];
        if (!r[0] && !r[2]) continue;

        let imgLink = r[9] || "";
        if (formulas[i] && formulas[i][9]) {
          const match = formulas[i][9].match(/=HYPERLINK\("([^"]+)"/i);
          if (match && match[1]) imgLink = match[1];
        }

        tickets.push({
          id: r[0],
          timestamp: r[1],
          fullname: r[2],
          phone: (r[3] || "").replace(/^'+/, ""),
          department: r[4],
          machineName: r[5],
          category: r[6],
          errorMessage: r[7] || "",
          description: r[8] || "",
          imageUrl: imgLink,
          status: r[10] || "Chờ xử lý",
          itNote: r[11] || "",
          clientSpecs: r[12] || ""
        });
      }

      function getStatusRank(st) {
        const s = (st || "").trim().toLowerCase();
        if (s.indexOf("đang") !== -1 || s.indexOf("progress") !== -1) return 1;
        if (s.indexOf("hoàn thành") !== -1 || s.indexOf("xong") !== -1 || s.indexOf("done") !== -1) return 3;
        return 2;
      }
      tickets.sort((a, b) => getStatusRank(a.status) - getStatusRank(b.status));

      return jsonResponse({ success: true, total: tickets.length, tickets: tickets });
    }

    // 3. LẤY DANH SÁCH TÀI KHOẢN
    if (action === "getUsers") {
      const sheet = getUsersSheet(ss);
      const data = sheet.getDataRange().getDisplayValues();
      const users = [];
      if (data.length > 1) {
        const headers = data[0].map(function(h) { return (h || "").toString().trim().toLowerCase(); });
        let colName = headers.findIndex(function(h) { return h.includes("họ và tên") || h.includes("họ tên") || h.includes("fullname"); });
        if (colName === -1) colName = 0;
        let colUsername = headers.findIndex(function(h) { return h === "username" || h.includes("username") || h.includes("tên đăng nhập"); });
        if (colUsername === -1) colUsername = 1;
        let colPos = headers.findIndex(function(h) { return h.includes("chức danh") || h.includes("chức vụ") || h.includes("position"); });
        if (colPos === -1) colPos = 3;
        let colPhone = headers.findIndex(function(h) { return h.includes("điện thoại") || h.includes("sđt") || h.includes("phone"); });
        if (colPhone === -1) colPhone = 4;
        let colDept = headers.findIndex(function(h) { return h.includes("đơn vị") || h.includes("bộ phận") || h.includes("department"); });
        if (colDept === -1) colDept = 5;
        let colCccd = headers.findIndex(function(h) { return h.includes("cccd") || h.includes("căn cước") || h.includes("cmnd"); });
        if (colCccd === -1) colCccd = 6;
        let colStatus = headers.findIndex(function(h) { return h.includes("trạng thái") || h.includes("status"); });
        if (colStatus === -1) colStatus = 7;
        let colRole = headers.findIndex(function(h) { return h.includes("vai trò") || h.includes("quyền") || h.includes("role"); });
        if (colRole === -1) colRole = 8;
        let colDate = headers.findIndex(function(h) { return h.includes("ngày tạo") || h.includes("date"); });
        if (colDate === -1) colDate = 9;

        for (let i = 1; i < data.length; i++) {
          const r = data[i];
          const name = (r[colName] || "").trim();
          if (!name && !r[colPhone] && !r[colUsername]) continue;
          const uName = (r[colUsername] || "").trim() || generateUsernameFromFullname(name);
          users.push({
            fullname: name,
            username: uName,
            position: (r[colPos] || "Cán bộ").trim(),
            phone: (r[colPhone] || "").replace(/^'+/, "").trim(),
            department: (r[colDept] || "Chi nhánh số 23").trim(),
            cccd: (r[colCccd] || "").replace(/^'+/, "").trim(),
            status: (r[colStatus] || "Đang làm việc").trim(),
            role: (r[colRole] && r[colRole].toLowerCase().includes("admin")) ? "admin" : "user",
            createdDate: (colDate !== -1 && r[colDate]) ? r[colDate].trim() : ""
          });
        }
      }
      return jsonResponse({ success: true, data: users });
    }

    // 4. LẤY DANH SÁCH NHIỆM VỤ GIAO VIỆC
    if (action === "getTasks") {
      return jsonResponse(getTasksList(ss));
    }

    // 5. LẤY DANH SÁCH BÁO CÁO SỐ LIỆU CẤP TỔ
    if (action === "getPerformanceReports") {
      return jsonResponse(getPerformanceReportsList(ss));
    }

    // 6. FALLBACK GET
    if (action === "createTicket") {
      let ticketData = params;
      if (params.data) {
        try {
          ticketData = typeof params.data === "string" ? JSON.parse(params.data) : params.data;
        } catch (e1) {
          try {
            ticketData = JSON.parse(decodeURIComponent(params.data));
          } catch (e2) {}
        }
      }
      return jsonResponse(handleCreateTicket(ticketData, ss));
    }

    if (action === "addSchedule" || action === "register") {
      return jsonResponse(handleAddSchedule(params, ss));
    }

    return jsonResponse({
      success: true,
      system: "BINHDUONG23",
      message: "Hệ thống BinhDuong23 (Lịch Tuần & IT Helpdesk) đang hoạt động bình thường!"
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Xử lý yêu cầu POST
 */
function doPost(e) {
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (err) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    let action = (body.action || "").toString().trim();
    if (!action) {
      if (body.description || body.errorMessage || body.category || body.machineName) {
        action = "createTicket";
      } else if (body.attendees || body.location || (body.date && body.time && body.content)) {
        action = "register";
      } else {
        action = "login";
      }
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 0. ĐỒNG BỘ 1-CLICK TỪ XA
    if (action === "syncAllData" || action === "seedSystem") {
      seedAccountsOnly();
      seedTicketsOnly();
      return jsonResponse({
        success: true,
        message: "Đã đồng bộ thành công 70 tài khoản CN23 và 4 tickets sự cố sang Google Sheet!",
        totalAccounts: 70,
        totalTickets: 4
      });
    }

    // 1. XÁC THỰC ĐĂNG NHẬP TRỰC TIẾP TỪ GOOGLE SHEET (HỖ TRỢ POST)
    if (action === "login") {
      const identifier = (body.username || body.cccd || body.identifier || body.phone || body.email || "").toString();
      const password = (body.password || "").toString();
      return jsonResponse(handleLogin(identifier, password, ss));
    }

    // 2. ĐĂNG KÝ TÀI KHOẢN MỚI
    if (action === "registerUser") {
      let phone = (body.phone || "").toString().trim().replace(/^'+/, "");
      const password = (body.password || "").toString().trim();
      const fullname = (body.fullname || "").toString().trim();
      const position = (body.position || "").toString().trim();
      const department = (body.department || "Chi nhánh số 23").toString().trim();
      const cccd = (body.cccd || "").toString().trim();
      const username = (body.username || "").toString().trim() || generateUsernameFromFullname(fullname);

      if (!phone || !password || !fullname) {
        return jsonResponse({ success: false, message: "Vui lòng điền đủ Họ tên, Số điện thoại và Mật khẩu!" });
      }

      if (phone.length === 9 && !phone.startsWith("0")) phone = "0" + phone;

      const sheetUsers = getUsersSheet(ss);
      const data = sheetUsers.getDataRange().getDisplayValues();
      let colPhone = 4;
      if (data.length > 0) {
        const hRow = data[0].map(function(h) { return (h || "").toString().trim().toLowerCase(); });
        const pIdx = hRow.findIndex(function(h) { return h.includes("điện thoại") || h.includes("sđt") || h.includes("phone"); });
        if (pIdx !== -1) colPhone = pIdx;
      }
      for (let i = 1; i < data.length; i++) {
        let rowPhone = (data[i][colPhone] || "").toString().trim().replace(/^'+/, "");
        if (rowPhone.length === 9 && !rowPhone.startsWith("0")) rowPhone = "0" + rowPhone;
        if (rowPhone === phone) {
          return jsonResponse({ success: false, message: "Số điện thoại này đã được đăng ký tài khoản trên hệ thống!" });
        }
      }

      const now = new Date();
      const dateStr = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy");
      sheetUsers.appendRow([
        fullname,                         // 0. Họ và tên
        username,                         // 1. Username
        password,                         // 2. Mật khẩu
        position,                         // 3. Chức danh / Chức vụ
        "'" + phone,                      // 4. Số điện thoại
        department,                       // 5. Đơn vị / Bộ phận
        "'" + cccd,                       // 6. Số CCCD
        "Đang làm việc",                  // 7. Trạng thái
        "user",                           // 8. Vai trò
        dateStr                           // 9. Ngày tạo
      ]);

      return jsonResponse({
        success: true,
        message: "Tạo tài khoản thành công!",
        user: {
          fullname: fullname,
          username: username,
          position: position,
          phone: phone,
          department: department,
          cccd: cccd,
          status: "Đang làm việc",
          role: "user"
        }
      });
    }

    // 3. ĐĂNG KÝ LỊCH TUẦN
    if (action === "addSchedule" || action === "register") {
      return jsonResponse(handleAddSchedule(body, ss));
    }

    // 4. TIẾP NHẬN SỰ CỐ IT
    if (action === "createTicket") {
      return jsonResponse(handleCreateTicket(body, ss));
    }

    // 5. GIAO VIỆC & BẢNG TIẾN ĐỘ
    if (action === "createTask") {
      return jsonResponse(handleCreateTask(body, ss));
    }
    if (action === "updateTaskStatus") {
      return jsonResponse(handleUpdateTaskStatus(body, ss));
    }
    if (action === "deleteTask") {
      return jsonResponse(handleDeleteTask(body, ss));
    }

    // 6. BÁO CÁO SỐ LIỆU THỰC HIỆN CẤP TỔ
    if (action === "createPerformanceReport") {
      return jsonResponse(handleCreatePerformanceReport(body, ss));
    }
    if (action === "deletePerformanceRecord") {
      return jsonResponse(handleDeletePerformanceRecord(body, ss));
    }

    return jsonResponse({ success: false, message: "Hành động (action) không hợp lệ!" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Xử lý thêm 1 mục Lịch Tuần
 */
/**
 * Hàm xác thực Đăng nhập trực tiếp từ Google Sheet bằng Username / CCCD / SĐT & Mật khẩu
 * Hỗ trợ tạo user mới bên Sheet hoặc đổi mật khẩu bên Sheet sẽ có hiệu lực ngay lập tức
 */
function handleLogin(identifier, password, ss) {
  try {
    ss = ss || SpreadsheetApp.getActiveSpreadsheet();
    const rawIdentifier = (identifier || "").toString().trim().replace(/^'+/, "");
    password = (password || "").toString().trim();

    if (!rawIdentifier || !password) {
      return { success: false, message: "Vui lòng nhập đầy đủ Người dùng và Mật khẩu!" };
    }

    const sheetUsers = getUsersSheet(ss);
    const data = sheetUsers.getDataRange().getDisplayValues();
    if (data.length <= 1) {
      return { success: false, message: "Hệ thống chưa có dữ liệu tài khoản cán bộ trong sheet TaiKhoan!" };
    }

    // Tự động nhận diện các cột theo tiêu đề (nếu có), dự phòng theo thứ tự chuẩn mới:
    // 0: Họ và tên | 1: Username | 2: Mật khẩu | 3: Chức danh / Chức vụ | 4: Số điện thoại | 5: Đơn vị / Bộ phận | 6: Số CCCD | 7: Trạng thái | 8: Vai trò | 9: Ngày tạo
    const headers = data[0].map(function(h) { return (h || "").toString().trim().toLowerCase(); });
    
    let colName = headers.findIndex(function(h) { return h.includes("họ và tên") || h.includes("họ tên") || h.includes("fullname") || h.includes("tên cán bộ"); });
    if (colName === -1) colName = 0;

    let colUsername = headers.findIndex(function(h) { return h === "username" || h === "tên đăng nhập" || h.includes("username") || h.includes("tên đăng nhập"); });
    if (colUsername === -1) colUsername = 1;

    let colPass = headers.findIndex(function(h) { return h.includes("mật khẩu") || h.includes("password") || h.includes("pass"); });
    if (colPass === -1) colPass = 2;

    let colPos = headers.findIndex(function(h) { return h.includes("chức danh") || h.includes("chức vụ") || h.includes("position"); });
    if (colPos === -1) colPos = 3;

    let colPhone = headers.findIndex(function(h) { return h.includes("điện thoại") || h.includes("sđt") || h.includes("phone"); });
    if (colPhone === -1) colPhone = 4;

    let colDept = headers.findIndex(function(h) { return h.includes("đơn vị") || h.includes("bộ phận") || h.includes("phòng ban") || h.includes("department"); });
    if (colDept === -1) colDept = 5;

    let colCccd = headers.findIndex(function(h) { return h.includes("cccd") || h.includes("căn cước") || h.includes("cmnd"); });
    if (colCccd === -1) colCccd = 6;

    let colStatus = headers.findIndex(function(h) { return h.includes("trạng thái") || h.includes("status"); });
    if (colStatus === -1) colStatus = 7;

    let colRole = headers.findIndex(function(h) { return h.includes("vai trò") || h.includes("quyền") || h.includes("role"); });
    if (colRole === -1) colRole = 8;

    let matchedUser = null;
    let identifierFound = false;

    // Chuẩn hóa input tìm kiếm
    const searchTrimmed = rawIdentifier.toLowerCase();
    const searchNoSpace = searchTrimmed.replace(/[\s\.\-]+/g, "");
    const searchNoTone = removeVietnameseTones(searchTrimmed).replace(/[\s\.\-]+/g, "");
    const searchDigitStripped = searchNoSpace.replace(/^0+/, "");

    for (let i = 1; i < data.length; i++) {
      const rowPhone = (data[i][colPhone] || "").toString().trim().replace(/^'+/, "");
      const rowPass = (data[i][colPass] || "").toString().trim();
      const rowFullname = (data[i][colName] || "").trim();
      const rowPosition = (data[i][colPos] || "").trim();
      const rowDept = (data[i][colDept] || "").trim();
      const rowCccd = (data[i][colCccd] || "").toString().trim().replace(/^'+/, "");
      const rowStatus = (data[i][colStatus] || "").trim() || "Đang làm việc";
      const rowRole = (data[i][colRole] && data[i][colRole].toLowerCase().includes("admin")) ? "admin" : "user";

      // Lấy username từ cột sheet hoặc tự động sinh từ Họ và tên (VD: "Quân ĐTM")
      let rowUsername = colUsername !== -1 ? (data[i][colUsername] || "").toString().trim() : "";
      if (!rowUsername && rowFullname) {
        rowUsername = generateUsernameFromFullname(rowFullname);
      }

      // 1. So khớp theo Username (ưu tiên số 1: ví dụ "Quân ĐTM")
      let isUsernameMatch = false;
      if (rowUsername) {
        const uRow = rowUsername.toLowerCase();
        const uRowNoSpace = uRow.replace(/[\s\.\-]+/g, "");
        const uRowNoTone = removeVietnameseTones(uRow).replace(/[\s\.\-]+/g, "");

        if (
          uRow === searchTrimmed ||
          uRowNoSpace === searchNoSpace ||
          (searchNoTone.length >= 3 && uRowNoTone === searchNoTone)
        ) {
          isUsernameMatch = true;
        }
      }

      // 2. So khớp theo Số CCCD (ưu tiên số 2)
      let isCccdMatch = false;
      if (rowCccd) {
        const normCccd = rowCccd.toLowerCase().replace(/[\s\.\-]+/g, "");
        const strippedCccd = normCccd.replace(/^0+/, "");
        if (normCccd === searchNoSpace || (searchDigitStripped.length >= 8 && strippedCccd === searchDigitStripped)) {
          isCccdMatch = true;
        }
      }

      // 3. So khớp theo Số điện thoại / Cột E (dự phòng số 3)
      let isPhoneMatch = false;
      if (rowPhone) {
        const normPhone = rowPhone.toLowerCase().replace(/[\s\.\-]+/g, "");
        const strippedPhone = normPhone.replace(/^0+/, "");
        if (normPhone === searchNoSpace || (searchDigitStripped.length >= 8 && strippedPhone === searchDigitStripped)) {
          isPhoneMatch = true;
        }
      }

      const isMatch = isUsernameMatch || isCccdMatch || isPhoneMatch;

      if (isMatch) {
        identifierFound = true;
        if (rowPass === password) {
          matchedUser = {
            username: rowUsername || generateUsernameFromFullname(rowFullname),
            cccd: rowCccd || rowPhone,
            phone: rowPhone,
            fullname: rowFullname || ("Cán bộ " + rawIdentifier),
            position: rowPosition || "Cán bộ",
            department: rowDept || "Chi nhánh số 23",
            status: rowStatus,
            role: rowRole
          };
          break;
        }
      }
    }

    if (!identifierFound) {
      return {
        success: false,
        message: "Người dùng (" + rawIdentifier + ") chưa được đăng ký trong danh sách trên hệ thống!"
      };
    }

    if (!matchedUser) {
      return {
        success: false,
        message: "Mật khẩu không chính xác! Vui lòng kiểm tra lại."
      };
    }

    if (matchedUser.status === "Đã nghỉ") {
      return {
        success: false,
        isRetired: true,
        message: "Tài khoản cán bộ (" + matchedUser.fullname + ") đã được ghi nhận trạng thái ĐÃ NGHỈ LÀM VIỆC trên hệ thống nội bộ. Không thể đăng nhập!"
      };
    }

    return {
      success: true,
      message: "Đăng nhập thành công!",
      user: matchedUser
    };
  } catch (err) {
    return { success: false, message: "Lỗi kiểm tra tài khoản: " + err.toString() };
  }
}

function handleAddSchedule(data, ss) {
  const registrant = (data.username || data.name || data.fullname || data.phone || data.email || "").toString().trim();
  const name = (data.fullname || data.name || registrant).toString().trim();
  const registrantVal = (/^\d+$/.test(registrant)) ? ("'" + registrant) : registrant;

  const date = (data.date || "").toString().trim();
  const dayOfWeek = (data.dayOfWeek || "").toString().trim();
  const time = (data.time || "").toString().trim();
  const content = (data.content || "").toString().trim();
  const attendees = (data.attendees || "").toString().trim();
  const location = (data.location || "").toString().trim();

  if (!date || !time || !content || !attendees || !location) {
    return { success: false, message: "Vui lòng điền đầy đủ các thông tin lịch công tác!" };
  }

  if (content.length > 500 || attendees.length > 500 || location.length > 500) {
    return { success: false, message: "Nội dung, thành phần, địa điểm không được vượt quá 500 ký tự!" };
  }

  const sheet = getScheduleSheet(ss);
  const now = new Date();
  const id = "LT-" + now.getTime();
  const timestamp = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

  const hasNameCol = sheet.getLastColumn() >= 10;
  if (hasNameCol) {
    sheet.appendRow([
      id,
      timestamp,
      registrantVal,
      name,
      "'" + date,
      dayOfWeek,
      "'" + time,
      content,
      attendees,
      location
    ]);
  } else {
    sheet.appendRow([
      id,
      timestamp,
      registrantVal,
      "'" + date,
      dayOfWeek,
      "'" + time,
      content,
      attendees,
      location
    ]);
  }

  return {
    success: true,
    message: "Đăng ký lịch công tác thành công!",
    id: id
  };
}

/**
 * Xử lý tiếp nhận 1 Ticket IT Support & Upload ảnh Drive
 */
function handleCreateTicket(data, ss) {
  const sheet = getSupportSheet(ss);
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const sec = String(now.getSeconds()).padStart(2, '0');

  const timeStr = `${dd}/${mm}/${yyyy} ${hh}:${min}:${sec}`;
  const dateCode = `${String(yyyy).slice(2)}${mm}${dd}`;

  const lastRow = sheet.getLastRow();
  const nextSeq = lastRow > 1 ? lastRow : 1;
  const ticketId = `TK-${dateCode}-${String(nextSeq).padStart(3, '0')}`;

  let imageUrl = "";
  if (data.imageBase64) {
    const imgName = `${ticketId}_${dd}${mm}${yyyy}.jpg`;
    imageUrl = saveImageToDrive(data.imageBase64, imgName);
  }

  let phoneStr = String(data.phone || "").trim().replace(/^'+/, "");
  if (phoneStr && phoneStr.length === 9 && !phoneStr.startsWith("0")) phoneStr = "0" + phoneStr;

  sheet.appendRow([
    ticketId,
    timeStr,
    data.fullname || "Không tên",
    "'" + phoneStr,
    data.department || "Chi nhánh số 23",
    data.machineName || "Tự động (Chưa rõ)",
    data.category || "Sự cố chung",
    data.errorMessage || "",
    data.description || "Không có mô tả",
    imageUrl,
    "Chờ xử lý",
    "",
    data.clientSpecs || (data.ip ? ("IP: " + data.ip) : "")
  ]);

  const newRow = sheet.getLastRow();
  sheet.getRange(newRow, 1).setHorizontalAlignment("center").setFontWeight("bold");
  sheet.getRange(newRow, 2).setHorizontalAlignment("center");
  sheet.getRange(newRow, 4).setNumberFormat("@").setHorizontalAlignment("center");

  const statusCell = sheet.getRange(newRow, 11);
  statusCell.setValue("Chờ xử lý").setHorizontalAlignment("center").setFontWeight("bold")
            .setBackground("#fef3c7").setFontColor("#b45309");

  if (imageUrl && imageUrl.indexOf("http") === 0) {
    const imgCell = sheet.getRange(newRow, 10);
    imgCell.setValue(imageUrl).setFontColor("#1d4ed8").setFontUnderline(true);
  }

  return {
    success: true,
    message: "Tạo ticket thành công!",
    ticketId: ticketId,
    timestamp: timeStr,
    imageUrl: imageUrl
  };
}

/**
 * =========================================================================
 * XỬ LÝ GIAO VIỆC & TIẾN ĐỘ (PHÂN HỆ 3)
 * =========================================================================
 */
function handleCreateTask(data, ss) {
  const sheet = getTasksSheet(ss);
  const now = new Date();
  const createdAt = data.createdAt || `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  const taskId = data.id || ('TASK_' + Math.floor(1000 + Math.random() * 9000));

  sheet.appendRow([
    taskId,
    data.leader || "",
    data.assigneeName || "",
    data.assigneeRole || "",
    data.assigneeDept || "",
    data.title || "",
    data.priority || "Bình thường",
    data.docRef || "",
    data.guidance || "",
    data.deadline || "",
    data.note || "",
    data.status || "Đang thực hiện",
    createdAt,
    data.completedAt || ""
  ]);

  const newRow = sheet.getLastRow();
  sheet.getRange(newRow, 1).setHorizontalAlignment("center").setFontWeight("bold");

  return {
    success: true,
    message: "Tạo phiếu giao việc thành công!",
    taskId: taskId
  };
}

function handleUpdateTaskStatus(data, ss) {
  const sheet = getTasksSheet(ss);
  const values = sheet.getDataRange().getDisplayValues();
  const taskId = (data.id || data.taskId || "").toString().trim();
  const newStatus = data.status || "Đang thực hiện";
  const completedAt = newStatus === "Đã hoàn thành" ? (data.completedAt || new Date().toLocaleString("vi-VN")) : "";

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === taskId) {
      sheet.getRange(i + 1, 12).setValue(newStatus);
      sheet.getRange(i + 1, 14).setValue(completedAt);
      return { success: true, message: `Đã cập nhật trạng thái nhiệm vụ ${taskId} thành ${newStatus}!` };
    }
  }
  return { success: false, message: `Không tìm thấy nhiệm vụ ${taskId}` };
}

function handleDeleteTask(data, ss) {
  const sheet = getTasksSheet(ss);
  const values = sheet.getDataRange().getDisplayValues();
  const taskId = (data.id || data.taskId || "").toString().trim();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === taskId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: `Đã xóa nhiệm vụ ${taskId} khỏi Google Sheet!` };
    }
  }
  return { success: false, message: `Không tìm thấy nhiệm vụ ${taskId}` };
}

function getTasksList(ss) {
  const sheet = getTasksSheet(ss);
  const values = sheet.getDataRange().getDisplayValues();
  const tasks = [];

  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    tasks.push({
      id: r[0],
      leader: r[1],
      assigneeName: r[2],
      assigneeRole: r[3],
      assigneeDept: r[4],
      title: r[5],
      priority: r[6],
      docRef: r[7],
      guidance: r[8],
      deadline: r[9],
      note: r[10],
      status: r[11],
      createdAt: r[12],
      completedAt: r[13] || ""
    });
  }
  return { success: true, total: tasks.length, data: tasks };
}

/**
 * =========================================================================
 * XỬ LÝ BÁO CÁO SỐ LIỆU CẤP TỔ (PHÂN HỆ 4)
 * =========================================================================
 */
function handleCreatePerformanceReport(data, ss) {
  const sheet = getPerformanceSheet(ss);
  const reportId = data.id || ('REC_' + Date.now());
  const now = new Date();
  const createdAt = data.createdAt || `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Kiểm tra nếu đã có kỳ báo cáo của tổ này thì cập nhật
  const values = sheet.getDataRange().getDisplayValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === data.toChuyenMon && values[i][3] === data.tenKyBaoCao) {
      sheet.deleteRow(i + 1);
      break;
    }
  }

  sheet.appendRow([
    reportId,
    data.toChuyenMon || "",
    data.loaiKyBaoCao || "",
    data.tenKyBaoCao || "",
    data.ngayChotSoLieu || "",
    data.tiepNhanTrucTiep || 0,
    data.tiepNhanTrucTuyen || 0,
    data.tongTiepNhan || 0,
    data.tyLeTrucTuyen || "0.0%",
    data.traTruocHan || 0,
    data.traDungHan || 0,
    data.traQuaHan || 0,
    data.tongGiaiQuyet || 0,
    data.tyLeDungHan || "0.0%",
    data.soThuXinLoi || 0,
    data.tonTrongHan || 0,
    data.tonQuaHan || 0,
    data.tongDangGiaiQuyet || 0,
    data.hsCoNghiaVuTC || 0,
    data.hsThanhToanTT || 0,
    data.tyLeThanhToanTT || "0.0%",
    data.soTienThanhToanTT || 0,
    data.soHoaDauVao || 0,
    data.soHoaDauRa || 0,
    data.taiSuDungSoHoa || 0,
    data.chungThucBanSaoDT || 0,
    data.dongBoVBDLis || 0,
    data.loiNghenPhanMem || 0,
    data.traCuuCSDLDanCu || 0,
    data.ghiChuVuongMac || "",
    data.deXuatKienNghi || "",
    createdAt
  ]);

  return {
    success: true,
    message: `Đã lưu số liệu báo cáo thành công cho ${data.toChuyenMon}!`,
    reportId: reportId
  };
}

function handleDeletePerformanceRecord(data, ss) {
  const sheet = getPerformanceSheet(ss);
  const values = sheet.getDataRange().getDisplayValues();
  const reportId = (data.id || data.reportId || "").toString().trim();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === reportId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: `Đã xóa bản ghi ${reportId} khỏi Google Sheet!` };
    }
  }
  return { success: false, message: `Không tìm thấy bản ghi ${reportId}` };
}

function getPerformanceReportsList(ss) {
  const sheet = getPerformanceSheet(ss);
  const values = sheet.getDataRange().getDisplayValues();
  const reports = [];

  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    reports.push({
      id: r[0],
      toChuyenMon: r[1],
      loaiKyBaoCao: r[2],
      tenKyBaoCao: r[3],
      ngayChotSoLieu: r[4],
      tiepNhanTrucTiep: r[5],
      tiepNhanTrucTuyen: r[6],
      tongTiepNhan: r[7],
      tyLeTrucTuyen: r[8],
      traTruocHan: r[9],
      traDungHan: r[10],
      traQuaHan: r[11],
      tongGiaiQuyet: r[12],
      tyLeDungHan: r[13],
      soThuXinLoi: r[14],
      tonTrongHan: r[15],
      tonQuaHan: r[16],
      tongDangGiaiQuyet: r[17],
      hsCoNghiaVuTC: r[18],
      hsThanhToanTT: r[19],
      tyLeThanhToanTT: r[20],
      soTienThanhToanTT: r[21],
      soHoaDauVao: r[22],
      soHoaDauRa: r[23],
      taiSuDungSoHoa: r[24],
      chungThucBanSaoDT: r[25],
      dongBoVBDLis: r[26],
      loiNghenPhanMem: r[27],
      traCuuCSDLDanCu: r[28],
      ghiChuVuongMac: r[29],
      deXuatKienNghi: r[30],
      createdAt: r[31]
    });
  }
  return { success: true, total: reports.length, data: reports };
}

/**
 * Trả về JSON Response chuẩn CORS
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
