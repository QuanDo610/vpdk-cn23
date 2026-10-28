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

// Tên các Sheet (Hỗ trợ linh hoạt cả tên cũ và tên mới)
const SHEET_SCHEDULE_NAME = "LichTuan";
const SHEET_USERS_NAME = "TaiKhoan";
const SHEET_SUPPORT_NAME = "Tickets";
const DRIVE_FOLDER_NAME = "IT_Helpdesk_Uploads";

// Danh sách 70 tài khoản cán bộ Chi nhánh 23 nạp sẵn
const INITIAL_ACCOUNTS = [
  [
    "0918606045",
    "V#5h84m4",
    "Nguyễn Thị Lệ Hằng",
    "Phó giám đốc",
    "Chi nhánh số 23",
    "074182013514",
    "Đã nghỉ",
    "user",
    "10/09/2026"
  ],
  [
    "0913975579",
    "PYVCQ3w@",
    "Đặng Huy Cường",
    "Phó giám đốc",
    "Chi nhánh số 23",
    "074082001909",
    "Đã nghỉ",
    "user",
    "10/09/2026"
  ],
  [
    "0907259775",
    "6#xMqhhe",
    "Nguyễn Thành Như Bảo",
    "Tổ phó  Tổ Đăng ký Cấp GCN",
    "Chi nhánh số 23",
    "074184006938",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0907259775",
    "Q%TVr**2",
    "Đoàn Thị Hoàng An",
    "Nhân viên",
    "Chi nhánh số 23",
    "074185000312",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0942245858",
    "SaCmQ3*m",
    "Nguyễn Duy Tấn",
    "Nhân viên",
    "Chi nhánh số 23",
    "074089005525",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0985992556",
    "USf4g@%#",
    "Lê Ngọc Bảo Ngân",
    "Nhân viên",
    "Chi nhánh số 23",
    "074187000969",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0984506056",
    "cz6QB5X$",
    "Nguyễn Thị Mai",
    "nhân viên",
    "Chi nhánh số 23",
    "066187007583",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0903523534",
    "&q8xQDLg",
    "Nguyễn Thị Ngọc Thảo",
    "Nhân viên",
    "Chi nhánh số 23",
    "079191004702",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0928517724",
    "TMun4$ma",
    "Trần Đình Siêu",
    "Nhân viên",
    "Chi nhánh số 23",
    "074202008455",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0982436448",
    "Hxj!EGR7",
    "Phạm Hoàng Oanh",
    "nhân viên",
    "Chi nhánh số 23",
    "074186000948",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0911496161",
    "3qr$G3hy",
    "Nguyễn Thanh Điền",
    "nhân viên",
    "Chi nhánh số 23",
    "074090000994",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0918856839",
    "yt4&u!B&",
    "Nguyễn Văn Khánh",
    "nhân viên",
    "Chi nhánh số 23",
    "1084041275",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0927988753",
    "Hmr3PUA$",
    "Nguyễn Tiến Thịnh",
    "nhân viên",
    "Chi nhánh số 23",
    "074097008452",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0813441815",
    "P@pH38Ax",
    "Nguyễn Hoàng Tiến",
    "nhân viên",
    "Chi nhánh số 23",
    "074202004657",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0855572555",
    "iLT4#Q9C",
    "Nguyễn Trung Thành",
    "nhân viên",
    "Chi nhánh số 23",
    "074088008228",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0909736435",
    "uivBB%3L",
    "Nguyễn Thị Bích Tuyền",
    "Tổ trưởng Tổ HCTH",
    "Chi nhánh số 23",
    "070182000478",
    "Đang làm việc",
    "admin",
    "10/09/2026"
  ],
  [
    "0356039473",
    "4&xCy#iG",
    "Hồ Lê Thanh Vũ",
    "Nhân viên",
    "Chi nhánh số 23",
    "074092001148",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0945859956",
    "3h@JB&rt",
    "Nguyễn Thị Thùy Trang",
    "Tổ Trưởng Tổ ĐKCGCN",
    "Chi nhánh số 23",
    "070181000414",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0919266474",
    "N@52S2&n",
    "Trần Thanh Triết",
    "Tổ trưởng  Tổ KTĐC và LT",
    "Chi nhánh số 23",
    "089081000484",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0909409961",
    "d%K3y%pG",
    "Nguyễn Bích Ngọc",
    "Nhân viên",
    "Chi nhánh số 23",
    "074184029295",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0933991003",
    "e3&F6JAn",
    "Phạm Nguyễn Lan Anh",
    "Nhân viên",
    "Chi nhánh số 23",
    "074186001229",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0937496139",
    "qY!pu26Y",
    "Nguyễn Thị Dáng",
    "Nhân viên",
    "Chi nhánh số 23",
    "030183016846",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0387805470",
    "ABaT2!2i",
    "Đỗ Thị Yến",
    "Nhân viên",
    "Chi nhánh số 23",
    "038193048288",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0918047179",
    "9yw3SQ*H",
    "Phạm Thị Yến Nhi",
    "Nhân viên",
    "Chi nhánh số 23",
    "074184007130",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0914645945",
    "gdGF7v!e",
    "Hoàng Minh Tú",
    "Nhân viên",
    "Chi nhánh số 23",
    "074093005624",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0917339468",
    "P5&Cv#qL",
    "Trần Thị Thùy Trang",
    "Nhân viên",
    "Chi nhánh số 23",
    "074190008803",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0916646669",
    "ws&DzU89",
    "Trần Nguyễn Hoài Lam",
    "Nhân viên",
    "Chi nhánh số 23",
    "074184005637",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0395780608",
    "EMh!Vz7G",
    "Nguyễn Anh Khôi",
    "Nhân viên",
    "Chi nhánh số 23",
    "074202003866",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0974118474",
    "%5tYdx3w",
    "Đoàn Văn Sang",
    "Nhân viên",
    "Chi nhánh số 23",
    "074086005188",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0906395984",
    "QHnCa!g9",
    "Hồ Thị Hồng Linh",
    "Tổ phó Tổ HCTH",
    "Chi nhánh số 23",
    "083184009837",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0945004594",
    "3$6&EyzN",
    "Vương Ánh Xuân",
    "Nhân viên",
    "Chi nhánh số 23",
    "074189007529",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0342242523",
    "*wd@xDG6",
    "Nguyễn Thảo Tuyết Nhi",
    "Nhân viên",
    "Chi nhánh số 23",
    "070199005001",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0902373837",
    "6C&qG3V$",
    "Nguyễn Khánh Duy",
    "Nhân viên",
    "Chi nhánh số 23",
    "074097004501",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0917711148",
    "NT32jxf@",
    "Nguyễn Thị Thu Minh",
    "Tổ phó Tổ Đăng ký Cấp GCN",
    "Chi nhánh số 23",
    "060181004687",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0815433332",
    "*T6iPk23",
    "Huỳnh Thành Duy",
    "Nhân viên",
    "Chi nhánh số 23",
    "074092001090",
    "Đã nghỉ",
    "user",
    "10/09/2026"
  ],
  [
    "0786186199",
    "pFjsV3$!",
    "Nguyễn Trần Thảo Vy",
    "Nhân viên",
    "Chi nhánh số 23",
    "079190029572",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0913789990",
    "Kg%2y%7V",
    "Nguyễn Hoàng Xuân",
    "Nhân viên",
    "Chi nhánh số 23",
    "074084026863",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0839676646",
    "fzsD3X3@",
    "Phạm Minh Trí",
    "Nhân viên",
    "Chi nhánh số 23",
    "074084003392",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0909364549",
    "F5*nY#CT",
    "Ngô Thị Cẩm Thúy",
    "Nhân viên",
    "Chi nhánh số 23",
    "074180001297",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0961395817",
    "R#$aUK46",
    "Trương Ngô Hồng Duyên",
    "Nhân viên",
    "Chi nhánh số 23",
    "074300000890",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0909195709",
    "X*q@bTV6",
    "Huỳnh Tấn Nguyên",
    "Tổ phó  Tổ Đăng ký & Cấp GCN",
    "Chi nhánh số 23",
    "074084006084",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0974751752",
    "B#mrWL3y",
    "Nguyễn Thị Lệ Thu",
    "Nhân viên",
    "Chi nhánh số 23",
    "051181020203",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0795300995",
    "Nx7#%UJn",
    "Nguyễn Tuấn Anh",
    "Nhân viên",
    "Chi nhánh số 23",
    "074095007388",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0972888838",
    "TTh#xv4T",
    "Phạm Thành Vũ",
    "Nhân viên",
    "Chi nhánh số 23",
    "089089005666",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0903052099",
    "73ZJm*!k",
    "Nguyễn Thị Ngọc Trản",
    "Nhân viên",
    "Chi nhánh số 23",
    "074182004180",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0335817578",
    "n!VC5kdk",
    "Quản Nguyễn Thảo Nguyên",
    "Nhân viên",
    "Chi nhánh số 23",
    "074300000239",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0909348840",
    "E36eBW@9",
    "Phạm Trần Hồng Như",
    "Nhân viên",
    "Chi nhánh số 23",
    "074180008326",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0917540409",
    "bZ4*a%Q8",
    "Trần Quốc Hưng",
    "Nhân viên",
    "Chi nhánh số 23",
    "074083003636",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0919037479",
    "@ewCSn2W",
    "Võ Phi Trúc",
    "Kế toán viên",
    "Chi nhánh số 23",
    "074178009735",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0983771739",
    "#2nN8WLm",
    "Nguyễn Thị Huỳnh Mai",
    "Nhân viên",
    "Chi nhánh số 23",
    "074184000428",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0334505304",
    "h#9z3YKS",
    "Đặng Thị Tuyết Trinh",
    "Tổ phó  Tổ KTĐC và Lưu trữ",
    "Chi nhánh số 23",
    "046194012557",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0918352101",
    "%5qN8%NV",
    "Nguyễn Hoàng Duy",
    "Người lao động",
    "Chi nhánh số 23",
    "074072008426",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0972709729",
    "Nv7GC@T7",
    "Lê Thị Phương Mai",
    "Người lao động",
    "Chi nhánh số 23",
    "074184000430",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0839655449",
    "Q3X$pHwG",
    "Nguyễn Nhật Quyền Trinh",
    "Người lao động",
    "Chi nhánh số 23",
    "074196001328",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0947810655",
    "gRJp#3N%",
    "Lê Sơn Thanh",
    "Nhân viên",
    "Chi nhánh số 23",
    "074189008338",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0964610889",
    "wA2W$%ws",
    "Huỳnh Thị Ái Nhi",
    "Nhân viên",
    "Chi nhánh số 23",
    "052197013121",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0934043647",
    "8ZyVk@*4",
    "Lý Minh Tân",
    "Tổ phó  Tổ KTĐC và Lưu trữ",
    "Chi nhánh số 23",
    "074084008297",
    "Đã nghỉ",
    "user",
    "10/09/2026"
  ],
  [
    "0373445790",
    "&FxHi9Uj",
    "Đoàn Thanh Phong",
    "Nhân viên",
    "Chi nhánh số 23",
    "074096005075",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0918983455",
    "nMP@57jD",
    "Bùi Thị Minh Nguyệt",
    "Tổ phó Tổ HCTH",
    "Chi nhánh số 23",
    "074182013628",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0938940303",
    "3LUK$GhS",
    "Tạ Nguyễn Bích Trang",
    "Nhân viên",
    "Chi nhánh số 23",
    "074189001179",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0918949878",
    "%8K!uqFd",
    "Lê Quang Khoa",
    "Nhân viên",
    "Chi nhánh số 23",
    "087093014630",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0949309399",
    "KEv2s!j9",
    "Phan Trọng Hiệp",
    "Nhân viên",
    "Chi nhánh số 23",
    "040079007604",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0917624629",
    "n*TEJ2xS",
    "Nguyễn Thị Trúc Phương",
    "Nhân viên",
    "Chi nhánh số 23",
    "074189007600",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0978945739",
    "4u%xgY2b",
    "Ân Văn Tuấn",
    "Nhân viên",
    "Chi nhánh số 23",
    "074082007752",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0936688880",
    "S5$P9PNb",
    "Lê Thị Thùy Duyên",
    "Nhân viên",
    "Chi nhánh số 23",
    "074192006524",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0906488008",
    "%8HqjYNc",
    "Nguyễn Thanh Sang",
    "Nhân viên",
    "Chi nhánh số 23",
    "074082000355",
    "Đã nghỉ",
    "user",
    "10/09/2026"
  ],
  [
    "0963252038",
    "U%jiaS@2",
    "Nguyễn Quốc Danh",
    "Nhân viên",
    "Chi nhánh số 23",
    "074094004258",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0868644860",
    "!y8JKZ&U",
    "Nguyễn Tuấn Kiệt",
    "Nhân viên",
    "Chi nhánh số 23",
    "074097007620",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ],
  [
    "0909912281",
    "gq$&gR%3",
    "Lưu Văn Tuấn",
    "Nhân viên",
    "Chi nhánh số 23",
    "074084010128",
    "Đã nghỉ",
    "user",
    "10/09/2026"
  ],
  [
    "0977000369",
    "5@65RZhj",
    "Phạm Minh Hoàng",
    "Nhân viên",
    "Chi nhánh số 23",
    "074086002733",
    "Đang làm việc",
    "user",
    "10/09/2026"
  ]
];

/**
 * Tự động tạo menu tiện ích "⭐ BINHDUONG23" trên thanh công cụ của Google Sheet
 * khi mở file tính.
 */
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("⭐ BINHDUONG23")
      .addItem("▶️ 1-Click: Nạp 70 Tài Khoản CN23 + Tạo Tab Tickets", "setupBinhDuong23")
      .addSeparator()
      .addItem("👥 Chỉ nạp lại 70 Tài Khoản vào sheet TaiKhoan", "seedAccountsOnly")
      .addItem("🎫 Chỉ tạo mới / Định dạng sheet Tickets (IT Helpdesk)", "setupTicketsOnly")
      .addToUi();
  } catch (e) {}
}

/**
 * Hàm 1-Click: Tự động nâng cấp Google Sheet hiện tại thành hệ thống BINHDUONG23
 */
function setupBinhDuong23() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Kiểm tra & đảm bảo tab Lịch Tuần an toàn
  getScheduleSheet(ss);

  // 2. Nạp 70 tài khoản vào tab TaiKhoan
  seedAccountsOnly();

  // 3. Khởi tạo tab Tickets
  setupTicketsOnly();

  SpreadsheetApp.getUi().alert(
    "✅ THÀNH CÔNG!\n\n" +
    "Đã hoàn tất cấu hình hệ thống BINHDUONG23:\n" +
    "1. Sheet 'LichTuan': Giữ nguyên dữ liệu an toàn.\n" +
    "2. Sheet 'TaiKhoan': Đã nạp đủ 70 cán bộ Chi nhánh 23.\n" +
    "3. Sheet 'Tickets': Đã tạo sẵn sàng tiếp nhận sự cố IT.\n\n" +
    "Bạn có thể vào Triển khai (Deploy) -> Quản lý bản triển khai để cập nhật phiên bản mới nhất!"
  );
}

/**
 * Nạp / ghi đè danh sách 70 tài khoản vào sheet TaiKhoan
 */
function seedAccountsOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetUsers = ss.getSheetByName(SHEET_USERS_NAME);
  
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet(SHEET_USERS_NAME);
  } else {
    sheetUsers.clear(); // Làm sạch để cập nhật chuẩn cột mới
  }

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

  // Định dạng dòng tiêu đề
  const headerRange = sheetUsers.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold").setBackground("#1e40af").setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheetUsers.setRowHeight(1, 35);
  sheetUsers.setFrozenRows(1);

  // Cột Số ĐT và CCCD định dạng Text thuần '@' để không bao giờ mất số 0
  sheetUsers.getRange("A:A").setNumberFormat("@");
  sheetUsers.getRange("F:F").setNumberFormat("@");

  // Nạp 70 tài khoản
  for (let i = 0; i < INITIAL_ACCOUNTS.length; i++) {
    const acc = INITIAL_ACCOUNTS[i];
    sheetUsers.appendRow([
      "'" + acc[0],
      acc[1],
      acc[2],
      acc[3],
      acc[4],
      "'" + acc[5],
      acc[6],
      acc[7],
      acc[8]
    ]);
  }

  sheetUsers.autoResizeColumns(1, 9);
}

/**
 * Khởi tạo / Định dạng tab Tickets dành cho IT Helpdesk
 */
function setupTicketsOnly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetSupport = getSupportSheet(ss);
  
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
 * Lấy sheet Lịch Tuần (Hỗ trợ linh hoạt LichTuan hoặc DangKyLichTuan)
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
    sheet = ss.insertSheet(SHEET_SUPPORT_NAME);
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

    // 1. LẤY DANH SÁCH LỊCH TUẦN
    if (action === "getSchedule") {
      const sheet = getScheduleSheet(ss);
      const data = sheet.getDataRange().getDisplayValues();
      if (data.length <= 1) {
        return jsonResponse({ success: true, data: [] });
      }

      // Đọc map tài khoản để bổ sung tên nếu là schema cũ (chỉ có Email)
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
      const hasNameCol = data[0].length >= 10; // Cột 4 là Họ và tên trong schema mới

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
          // Schema cũ 9 cột
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

    // 4. FALLBACK GET NẾU CẦN
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

    // 1. XÁC THỰC ĐĂNG NHẬP
    if (action === "login") {
      let phone = (body.phone || body.username || body.email || "").toString().trim().replace(/^'+/, "");
      const password = (body.password || "").toString().trim();

      if (!phone || !password) {
        return jsonResponse({ success: false, message: "Vui lòng nhập đầy đủ Số điện thoại/Tài khoản và Mật khẩu!" });
      }

      if (phone.length === 9 && !phone.startsWith("0")) phone = "0" + phone;

      const sheetUsers = getUsersSheet(ss);
      const data = sheetUsers.getDataRange().getDisplayValues();
      let matchedUser = null;

      for (let i = 1; i < data.length; i++) {
        let rowIdentifier = (data[i][0] || "").toString().trim().replace(/^'+/, "");
        if (rowIdentifier.length === 9 && !rowIdentifier.startsWith("0")) rowIdentifier = "0" + rowIdentifier;
        const rowPass = (data[i][1] || "").toString().trim();

        if (rowIdentifier.toLowerCase() === phone.toLowerCase() && rowPass === password) {
          matchedUser = {
            phone: rowIdentifier,
            fullname: data[i][2],
            position: data[i][3] || "",
            department: data[i][4] || "Chi nhánh số 23",
            cccd: (data[i][5] || "").replace(/^'+/, ""),
            status: data[i][6] || "Đang làm việc",
            role: (data[i][7] && data[i][7].toLowerCase().includes("admin")) ? "admin" : "user"
          };
          break;
        }
      }

      if (!matchedUser) {
        return jsonResponse({ success: false, message: "Số điện thoại hoặc mật khẩu không chính xác!" });
      }

      if (matchedUser.status === "Đã nghỉ") {
        return jsonResponse({
          success: false,
          isRetired: true,
          message: "Tài khoản của cán bộ (" + matchedUser.fullname + ") đã được ghi nhận trạng thái ĐÃ NGHỈ LÀM VIỆC tại Chi nhánh. Vui lòng liên hệ Tổ CNTT/HCTH nếu cần hỗ trợ!"
        });
      }

      return jsonResponse({
        success: true,
        message: "Đăng nhập thành công!",
        user: matchedUser
      });
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
 * Xử lý thêm 1 mục Lịch Tuần vào sheet LichTuan
 */
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

  // Kiểm tra số lượng cột hiện tại của sheet Lịch Tuần để thêm dòng tương thích
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
    // Tương thích ngược với bảng 9 cột cũ
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
  setupTicketsOnly(); // Đảm bảo tab Tickets đã có tiêu đề cột
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

  // Format trạng thái mặc định: Chờ xử lý (màu vàng cam)
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
