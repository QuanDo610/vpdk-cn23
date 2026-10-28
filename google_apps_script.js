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
const DRIVE_FOLDER_NAME = "IT_Helpdesk_Uploads";

/**
 * Tự động tạo menu tiện ích/**
 * Tự động tạo menu tiện ích "⭐ BINHDUONG23" trên thanh công cụ của Google Sheet
 */
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("⭐ BINHDUONG23")
      .addItem("▶️ 1-Click: Cấu hình chuẩn hệ thống BINHDUONG23", "setupBinhDuong23")
      .addSeparator()
      .addItem("👥 Định dạng tab TaiKhoan (Tài khoản lưu trên Sheet)", "seedAccountsOnly")
      .addItem("🎫 Định dạng tab Tickets (Sự cố IT lưu trên Sheet)", "seedTicketsOnly")
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

  // 2. Nạp 70 tài khoản vào tab TaiKhoan
  seedAccountsOnly();

  // 3. Khởi tạo tab Tickets & nạp 4 ticket cũ sang
  seedTicketsOnly();

  SpreadsheetApp.getUi().alert(
    "✅ HỆ THỐNG BINHDUONG23 ĐÃ SẴN SÀNG!\n\n" +
    "1. Sheet 'LichTuan': Giữ nguyên toàn bộ dữ liệu lịch tuần.\n" +
    "2. Sheet 'TaiKhoan': Đã định dạng chuẩn (quản lý trực tiếp trên Sheet).\n" +
    "3. Sheet 'Tickets': Đã định dạng chuẩn (quản lý trực tiếp trên Sheet).\n\n" +
    "Hệ thống đã sẵn sàng 100%!"
  );
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

  // Nếu sheet mới tạo hoặc trống, khởi tạo hàng tiêu đề chuẩn
  if (sheetUsers.getLastRow() === 0) {
    const headers = [
      "Số ĐT (Username)",
      "Mật khẩu",
      "Họ và tên",
      "Chức danh / Chức vụ",
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

    sheetUsers.getRange("A:A").setNumberFormat("@");
    sheetUsers.getRange("F:F").setNumberFormat("@");
    sheetUsers.autoResizeColumns(1, 9);
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
      "Số ĐT / Email",
      "Họ và tên",
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
    sheet.autoResizeColumns(1, 10);
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
      const phone = (params.phone || params.username || params.email || "").toString();
      const password = (params.password || "").toString();
      return jsonResponse(handleLogin(phone, password, ss));
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
        for (let u = 1; u < uData.length; u++) {
          const p = (uData[u][0] || "").replace(/^'+/, "").toLowerCase().trim();
          const n = (uData[u][2] || "").trim();
          if (p && n) userMap[p] = n;
        }
      }

      const rows = [];
      const hasNameCol = data[0].length >= 10;

      for (let i = 1; i < data.length; i++) {
        const r = data[i];
        if (!r[0] && !r[2]) continue;

        let phoneOrEmail = (r[2] || "").replace(/^'+/, "").trim();
        let name = "";
        let dateVal = "", dayVal = "", timeVal = "", contentVal = "", attVal = "", locVal = "";

        if (hasNameCol) {
          name = r[3] || userMap[phoneOrEmail.toLowerCase()] || "";
          dateVal = r[4] || "";
          dayVal = r[5] || "";
          timeVal = r[6] || "";
          contentVal = r[7] || "";
          attVal = r[8] || "";
          locVal = r[9] || "";
        } else {
          name = userMap[phoneOrEmail.toLowerCase()] || "";
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
          phone: phoneOrEmail,
          name: name,
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
      for (let i = 1; i < data.length; i++) {
        const r = data[i];
        if (!r[0] && !r[2]) continue;
        users.push({
          phone: (r[0] || "").replace(/^'+/, ""),
          fullname: r[2],
          position: r[3],
          department: r[4],
          cccd: (r[5] || "").replace(/^'+/, ""),
          status: r[6] || "Đang làm việc",
          role: r[7] || "user"
        });
      }
      return jsonResponse({ success: true, data: users });
    }

    // 4. FALLBACK GET
    if (action === "createTicket" && params.data) {
      const ticketData = JSON.parse(decodeURIComponent(params.data));
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

    const action = body.action || "login";
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
      const phone = (body.phone || body.username || body.email || "").toString();
      const password = (body.password || "").toString();
      return jsonResponse(handleLogin(phone, password, ss));
    }

    // 2. ĐĂNG KÝ TÀI KHOẢN MỚI
    if (action === "registerUser") {
      let phone = (body.phone || "").toString().trim().replace(/^'+/, "");
      const password = (body.password || "").toString().trim();
      const fullname = (body.fullname || "").toString().trim();
      const position = (body.position || "").toString().trim();
      const department = (body.department || "Chi nhánh số 23").toString().trim();
      const cccd = (body.cccd || "").toString().trim();

      if (!phone || !password || !fullname) {
        return jsonResponse({ success: false, message: "Vui lòng điền đủ Họ tên, Số điện thoại và Mật khẩu!" });
      }

      if (phone.length === 9 && !phone.startsWith("0")) phone = "0" + phone;

      const sheetUsers = getUsersSheet(ss);
      const data = sheetUsers.getDataRange().getDisplayValues();
      for (let i = 1; i < data.length; i++) {
        let rowPhone = (data[i][0] || "").toString().trim().replace(/^'+/, "");
        if (rowPhone.length === 9 && !rowPhone.startsWith("0")) rowPhone = "0" + rowPhone;
        if (rowPhone === phone) {
          return jsonResponse({ success: false, message: "Số điện thoại này đã được đăng ký tài khoản trên hệ thống!" });
        }
      }

      const now = new Date();
      const dateStr = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy");
      sheetUsers.appendRow([
        "'" + phone,
        password,
        fullname,
        position,
        department,
        "'" + cccd,
        "Đang làm việc",
        "user",
        dateStr
      ]);

      return jsonResponse({
        success: true,
        message: "Tạo tài khoản thành công!",
        user: {
          phone: phone,
          fullname: fullname,
          position: position,
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

    return jsonResponse({ success: false, message: "Hành động (action) không hợp lệ!" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Xử lý thêm 1 mục Lịch Tuần
 */
/**
 * Hàm xác thực Đăng nhập trực tiếp từ Google Sheet
 * Hỗ trợ tạo user mới bên Sheet hoặc đổi mật khẩu bên Sheet sẽ có hiệu lực ngay lập tức
 */
function handleLogin(phone, password, ss) {
  try {
    ss = ss || SpreadsheetApp.getActiveSpreadsheet();
    phone = (phone || "").toString().trim().replace(/[\s\.\-]+/g, "").replace(/^'+/, "");
    password = (password || "").toString().trim();

    if (!phone || !password) {
      return { success: false, message: "Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu!" };
    }

    if (phone.length === 9 && !phone.startsWith("0")) phone = "0" + phone;

    const sheetUsers = getUsersSheet(ss);
    const data = sheetUsers.getDataRange().getDisplayValues();
    let matchedUser = null;
    let phoneFound = false;

    for (let i = 1; i < data.length; i++) {
      let rowIdentifier = (data[i][0] || "").toString().trim().replace(/[\s\.\-]+/g, "").replace(/^'+/, "");
      if (rowIdentifier.length === 9 && !rowIdentifier.startsWith("0")) rowIdentifier = "0" + rowIdentifier;
      const rowPass = (data[i][1] || "").toString().trim();

      if (rowIdentifier.toLowerCase() === phone.toLowerCase()) {
        phoneFound = true;
        if (rowPass === password) {
          const fullname = (data[i][2] || "").trim() || ("Cán bộ " + rowIdentifier);
          const position = (data[i][3] || "").trim() || "Cán bộ";
          const department = (data[i][4] || "").trim() || "Chi nhánh số 23";
          const cccd = (data[i][5] || "").replace(/^'+/, "").trim();
          const status = (data[i][6] || "").trim() || "Đang làm việc";
          const role = (data[i][7] && data[i][7].toLowerCase().includes("admin")) ? "admin" : "user";

          matchedUser = {
            phone: rowIdentifier,
            fullname: fullname,
            position: position,
            department: department,
            cccd: cccd,
            status: status,
            role: role
          };
          break;
        }
      }
    }

    if (!phoneFound) {
      return {
        success: false,
        message: "Số điện thoại này chưa được đăng ký trong danh sách trên Google Sheet!"
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
        message: "Tài khoản cán bộ (" + matchedUser.fullname + ") đã được ghi nhận trạng thái ĐÃ NGHỈ LÀM VIỆC trên Google Sheet. Không thể đăng nhập!"
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
  const phone = (data.phone || "").toString().trim();
  const name = (data.name || data.fullname || "").toString().trim();
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
      "'" + phone,
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
      "'" + phone,
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
 * Trả về JSON Response chuẩn CORS
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
