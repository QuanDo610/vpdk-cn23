/**
 * =========================================================================
 * APP.JS: CỔNG DỊCH VỤ NỘI BỘ VPĐK CHI NHÁNH 23
 * (ĐĂNG KÝ LỊCH CÔNG TÁC TUẦN & TIẾP NHẬN SỰ CỐ IT HELPDESK)
 * =========================================================================
 */

// Key lưu trữ LocalStorage
const STORAGE_KEYS = {
  SCRIPT_URL: "vpdk_script_url",
  CURRENT_USER: "vpdk_current_user",
  LOCAL_SCHEDULE: "vpdk_local_schedule_data",
  LOCAL_TICKETS: "vpdk_local_tickets_data",
  LOCAL_USERS: "vpdk_local_registered_users",
  REMEMBER_PHONE: "vpdk_remember_phone",
  REMEMBER_PASS: "vpdk_remember_pass"
};

// Danh sách 70 tài khoản cán bộ Chi nhánh 23 nạp sẵn (chạy offline / fallback tức thì)
const DEFAULT_ACCOUNTS = [
  {
    "phone": "0918606045",
    "password": "V#5h84m4",
    "fullname": "Nguyễn Thị Lệ Hằng",
    "position": "Phó giám đốc",
    "department": "Chi nhánh số 23",
    "cccd": "074182013514",
    "status": "Đã nghỉ",
    "role": "user"
  },
  {
    "phone": "0913975579",
    "password": "PYVCQ3w@",
    "fullname": "Đặng Huy Cường",
    "position": "Phó giám đốc",
    "department": "Chi nhánh số 23",
    "cccd": "074082001909",
    "status": "Đã nghỉ",
    "role": "user"
  },
  {
    "phone": "0907259775",
    "password": "6#xMqhhe",
    "fullname": "Nguyễn Thành Như Bảo",
    "position": "Tổ phó  Tổ Đăng ký Cấp GCN",
    "department": "Chi nhánh số 23",
    "cccd": "074184006938",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0907259775",
    "password": "Q%TVr**2",
    "fullname": "Đoàn Thị Hoàng An",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074185000312",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0942245858",
    "password": "SaCmQ3*m",
    "fullname": "Nguyễn Duy Tấn",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074089005525",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0985992556",
    "password": "USf4g@%#",
    "fullname": "Lê Ngọc Bảo Ngân",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074187000969",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0984506056",
    "password": "cz6QB5X$",
    "fullname": "Nguyễn Thị Mai",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "066187007583",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0903523534",
    "password": "&q8xQDLg",
    "fullname": "Nguyễn Thị Ngọc Thảo",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "079191004702",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0928517724",
    "password": "TMun4$ma",
    "fullname": "Trần Đình Siêu",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074202008455",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0982436448",
    "password": "Hxj!EGR7",
    "fullname": "Phạm Hoàng Oanh",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074186000948",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0911496161",
    "password": "3qr$G3hy",
    "fullname": "Nguyễn Thanh Điền",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074090000994",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0918856839",
    "password": "yt4&u!B&",
    "fullname": "Nguyễn Văn Khánh",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "1084041275",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0927988753",
    "password": "Hmr3PUA$",
    "fullname": "Nguyễn Tiến Thịnh",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074097008452",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0813441815",
    "password": "P@pH38Ax",
    "fullname": "Nguyễn Hoàng Tiến",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074202004657",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0855572555",
    "password": "iLT4#Q9C",
    "fullname": "Nguyễn Trung Thành",
    "position": "nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074088008228",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0909736435",
    "password": "uivBB%3L",
    "fullname": "Nguyễn Thị Bích Tuyền",
    "position": "Tổ trưởng Tổ HCTH",
    "department": "Chi nhánh số 23",
    "cccd": "070182000478",
    "status": "Đang làm việc",
    "role": "admin"
  },
  {
    "phone": "0356039473",
    "password": "4&xCy#iG",
    "fullname": "Hồ Lê Thanh Vũ",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074092001148",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0945859956",
    "password": "3h@JB&rt",
    "fullname": "Nguyễn Thị Thùy Trang",
    "position": "Tổ Trưởng Tổ ĐKCGCN",
    "department": "Chi nhánh số 23",
    "cccd": "070181000414",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0919266474",
    "password": "N@52S2&n",
    "fullname": "Trần Thanh Triết",
    "position": "Tổ trưởng  Tổ KTĐC và LT",
    "department": "Chi nhánh số 23",
    "cccd": "089081000484",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0909409961",
    "password": "d%K3y%pG",
    "fullname": "Nguyễn Bích Ngọc",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074184029295",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0933991003",
    "password": "e3&F6JAn",
    "fullname": "Phạm Nguyễn Lan Anh",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074186001229",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0937496139",
    "password": "qY!pu26Y",
    "fullname": "Nguyễn Thị Dáng",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "030183016846",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0387805470",
    "password": "ABaT2!2i",
    "fullname": "Đỗ Thị Yến",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "038193048288",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0918047179",
    "password": "9yw3SQ*H",
    "fullname": "Phạm Thị Yến Nhi",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074184007130",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0914645945",
    "password": "gdGF7v!e",
    "fullname": "Hoàng Minh Tú",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074093005624",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0917339468",
    "password": "P5&Cv#qL",
    "fullname": "Trần Thị Thùy Trang",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074190008803",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0916646669",
    "password": "ws&DzU89",
    "fullname": "Trần Nguyễn Hoài Lam",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074184005637",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0395780608",
    "password": "EMh!Vz7G",
    "fullname": "Nguyễn Anh Khôi",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074202003866",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0974118474",
    "password": "%5tYdx3w",
    "fullname": "Đoàn Văn Sang",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074086005188",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0906395984",
    "password": "QHnCa!g9",
    "fullname": "Hồ Thị Hồng Linh",
    "position": "Tổ phó Tổ HCTH",
    "department": "Chi nhánh số 23",
    "cccd": "083184009837",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0945004594",
    "password": "3$6&EyzN",
    "fullname": "Vương Ánh Xuân",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074189007529",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0342242523",
    "password": "*wd@xDG6",
    "fullname": "Nguyễn Thảo Tuyết Nhi",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "070199005001",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0902373837",
    "password": "6C&qG3V$",
    "fullname": "Nguyễn Khánh Duy",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074097004501",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0917711148",
    "password": "NT32jxf@",
    "fullname": "Nguyễn Thị Thu Minh",
    "position": "Tổ phó Tổ Đăng ký Cấp GCN",
    "department": "Chi nhánh số 23",
    "cccd": "060181004687",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0815433332",
    "password": "*T6iPk23",
    "fullname": "Huỳnh Thành Duy",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074092001090",
    "status": "Đã nghỉ",
    "role": "user"
  },
  {
    "phone": "0786186199",
    "password": "pFjsV3$!",
    "fullname": "Nguyễn Trần Thảo Vy",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "079190029572",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0913789990",
    "password": "Kg%2y%7V",
    "fullname": "Nguyễn Hoàng Xuân",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074084026863",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0839676646",
    "password": "fzsD3X3@",
    "fullname": "Phạm Minh Trí",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074084003392",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0909364549",
    "password": "F5*nY#CT",
    "fullname": "Ngô Thị Cẩm Thúy",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074180001297",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0961395817",
    "password": "R#$aUK46",
    "fullname": "Trương Ngô Hồng Duyên",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074300000890",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0909195709",
    "password": "X*q@bTV6",
    "fullname": "Huỳnh Tấn Nguyên",
    "position": "Tổ phó  Tổ Đăng ký & Cấp GCN",
    "department": "Chi nhánh số 23",
    "cccd": "074084006084",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0974751752",
    "password": "B#mrWL3y",
    "fullname": "Nguyễn Thị Lệ Thu",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "051181020203",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0795300995",
    "password": "Nx7#%UJn",
    "fullname": "Nguyễn Tuấn Anh",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074095007388",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0972888838",
    "password": "TTh#xv4T",
    "fullname": "Phạm Thành Vũ",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "089089005666",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0903052099",
    "password": "73ZJm*!k",
    "fullname": "Nguyễn Thị Ngọc Trản",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074182004180",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0335817578",
    "password": "n!VC5kdk",
    "fullname": "Quản Nguyễn Thảo Nguyên",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074300000239",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0909348840",
    "password": "E36eBW@9",
    "fullname": "Phạm Trần Hồng Như",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074180008326",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0917540409",
    "password": "bZ4*a%Q8",
    "fullname": "Trần Quốc Hưng",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074083003636",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0919037479",
    "password": "@ewCSn2W",
    "fullname": "Võ Phi Trúc",
    "position": "Kế toán viên",
    "department": "Chi nhánh số 23",
    "cccd": "074178009735",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0983771739",
    "password": "#2nN8WLm",
    "fullname": "Nguyễn Thị Huỳnh Mai",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074184000428",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0334505304",
    "password": "h#9z3YKS",
    "fullname": "Đặng Thị Tuyết Trinh",
    "position": "Tổ phó  Tổ KTĐC và Lưu trữ",
    "department": "Chi nhánh số 23",
    "cccd": "046194012557",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0918352101",
    "password": "%5qN8%NV",
    "fullname": "Nguyễn Hoàng Duy",
    "position": "Người lao động",
    "department": "Chi nhánh số 23",
    "cccd": "074072008426",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0972709729",
    "password": "Nv7GC@T7",
    "fullname": "Lê Thị Phương Mai",
    "position": "Người lao động",
    "department": "Chi nhánh số 23",
    "cccd": "074184000430",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0839655449",
    "password": "Q3X$pHwG",
    "fullname": "Nguyễn Nhật Quyền Trinh",
    "position": "Người lao động",
    "department": "Chi nhánh số 23",
    "cccd": "074196001328",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0947810655",
    "password": "gRJp#3N%",
    "fullname": "Lê Sơn Thanh",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074189008338",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0964610889",
    "password": "wA2W$%ws",
    "fullname": "Huỳnh Thị Ái Nhi",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "052197013121",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0934043647",
    "password": "8ZyVk@*4",
    "fullname": "Lý Minh Tân",
    "position": "Tổ phó  Tổ KTĐC và Lưu trữ",
    "department": "Chi nhánh số 23",
    "cccd": "074084008297",
    "status": "Đã nghỉ",
    "role": "user"
  },
  {
    "phone": "0373445790",
    "password": "&FxHi9Uj",
    "fullname": "Đoàn Thanh Phong",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074096005075",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0918983455",
    "password": "nMP@57jD",
    "fullname": "Bùi Thị Minh Nguyệt",
    "position": "Tổ phó Tổ HCTH",
    "department": "Chi nhánh số 23",
    "cccd": "074182013628",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0938940303",
    "password": "3LUK$GhS",
    "fullname": "Tạ Nguyễn Bích Trang",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074189001179",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0918949878",
    "password": "%8K!uqFd",
    "fullname": "Lê Quang Khoa",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "087093014630",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0949309399",
    "password": "KEv2s!j9",
    "fullname": "Phan Trọng Hiệp",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "040079007604",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0917624629",
    "password": "n*TEJ2xS",
    "fullname": "Nguyễn Thị Trúc Phương",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074189007600",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0978945739",
    "password": "4u%xgY2b",
    "fullname": "Ân Văn Tuấn",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074082007752",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0936688880",
    "password": "S5$P9PNb",
    "fullname": "Lê Thị Thùy Duyên",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074192006524",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0906488008",
    "password": "%8HqjYNc",
    "fullname": "Nguyễn Thanh Sang",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074082000355",
    "status": "Đã nghỉ",
    "role": "user"
  },
  {
    "phone": "0963252038",
    "password": "U%jiaS@2",
    "fullname": "Nguyễn Quốc Danh",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074094004258",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0868644860",
    "password": "!y8JKZ&U",
    "fullname": "Nguyễn Tuấn Kiệt",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074097007620",
    "status": "Đang làm việc",
    "role": "user"
  },
  {
    "phone": "0909912281",
    "password": "gq$&gR%3",
    "fullname": "Lưu Văn Tuấn",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074084010128",
    "status": "Đã nghỉ",
    "role": "user"
  },
  {
    "phone": "0977000369",
    "password": "5@65RZhj",
    "fullname": "Phạm Minh Hoàng",
    "position": "Nhân viên",
    "department": "Chi nhánh số 23",
    "cccd": "074086002733",
    "status": "Đang làm việc",
    "role": "user"
  }
];

// URL Google Apps Script mặc định của hệ thống
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLjARkYWp2TegCCdMcfVc3W6qQm6PmhFz71-y8zB_xFXxXbRXpsUhk6aPbJtqVqUHE/exec";

// Trạng thái ứng dụng toàn cục
let currentUser = null;
let currentView = "login"; // "login" | "register" | "hub" | "schedule" | "helpdesk"
let scheduleData = [];
let currentTickets = [];
let googleScriptUrl = localStorage.getItem(STORAGE_KEYS.SCRIPT_URL) || DEFAULT_SCRIPT_URL;

// Phân trang lịch tuần
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
let exportFromPicker = null;
let exportToPicker = null;

// Thông số máy nhận diện tự động cho IT Helpdesk
let detectedClient = {
  ip: "Đang quét...",
  os: "Windows",
  machineName: "",
  specs: "",
  imageBase64: ""
};

// Tra cứu tên hiển thị cán bộ
const KNOWN_USERS_MAP = {};
DEFAULT_ACCOUNTS.forEach(acc => {
  if (acc.phone && acc.fullname) KNOWN_USERS_MAP[acc.phone] = acc.fullname;
});
try {
  const customUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_USERS) || "[]");
  customUsers.forEach(u => {
    if (u.phone && u.fullname) KNOWN_USERS_MAP[u.phone] = u.fullname;
  });
} catch (e) {}

function getSenderDisplayName(item) {
  if (!item) return "Cán bộ";
  const p = (item.phone || "").trim().replace(/^'+/, "");
  if (p && KNOWN_USERS_MAP[p]) return KNOWN_USERS_MAP[p];
  if (item.name && item.name.trim() && !item.name.includes("@")) return item.name.trim();
  return item.name || p || "Cán bộ";
}

function getMeetingStatus(dateVal, timeVal) {
  try {
    const cleanDate = formatDisplayDate(dateVal);
    const cleanTime = formatDisplayTime(timeVal);
    if (!cleanDate) return { status: "unknown", label: "Lịch tuần", badgeClass: "status-upcoming", isPast: false };
    const parts = cleanDate.split("/");
    if (parts.length !== 3) return { status: "unknown", label: "Lịch tuần", badgeClass: "status-upcoming", isPast: false };
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    let startHour = 8, startMin = 0;
    let endHour = 10, endMin = 0;
    let hasEnd = false;
    if (cleanTime && cleanTime.includes(" - ")) {
      const p = cleanTime.split(" - ");
      const ps = (p[0]||"").trim().split(":");
      const pe = (p[1]||"").trim().split(":");
      if (ps.length >= 2) { startHour = parseInt(ps[0], 10)||0; startMin = parseInt(ps[1], 10)||0; }
      if (pe.length >= 2) { endHour = parseInt(pe[0], 10)||0; endMin = parseInt(pe[1], 10)||0; hasEnd = true; }
    } else if (cleanTime && cleanTime.includes(":")) {
      const ps = cleanTime.split(":");
      startHour = parseInt(ps[0], 10)||0; startMin = parseInt(ps[1], 10)||0;
    }
    const startTime = new Date(year, month, day, startHour, startMin, 0).getTime();
    const endTime = hasEnd ? new Date(year, month, day, endHour, endMin, 0).getTime() : (startTime + 2 * 3600 * 1000);
    const now = Date.now();
    if (now > endTime) return { status: "past", label: "Đã diễn ra", badgeClass: "status-past", isPast: true };
    if (now >= startTime && now <= endTime) return { status: "ongoing", label: "Đang diễn ra", badgeClass: "status-ongoing", isPast: false };
    return { status: "upcoming", label: "Sắp diễn ra", badgeClass: "status-upcoming", isPast: false };
  } catch(e) {
    return { status: "unknown", label: "Lịch tuần", badgeClass: "status-upcoming", isPast: false };
  }
}


/* =========================================================================
   1. ĐIỀU HƯỚNG VIEW (SWITCH VIEW CONTROLLER)
   ========================================================================= */
function switchView(viewName) {
  currentView = viewName;

  const loginSec = document.getElementById("loginSection");
  const registerSec = document.getElementById("registerSection");
  const hubSec = document.getElementById("portalHubSection");
  const scheduleSec = document.getElementById("weeklyScheduleWorkspace");
  const helpdeskSec = document.getElementById("itHelpdeskWorkspace");

  const headerTabs = document.getElementById("headerNavTabs");
  const headerUser = document.getElementById("headerUserArea");

  // Ẩn tất cả section
  if (loginSec) loginSec.style.display = "none";
  if (registerSec) registerSec.style.display = "none";
  if (hubSec) hubSec.style.display = "none";
  if (scheduleSec) scheduleSec.style.display = "none";
  if (helpdeskSec) helpdeskSec.style.display = "none";

  // Cập nhật tabs
  const tabHub = document.getElementById("navTabHub");
  const tabSchedule = document.getElementById("navTabSchedule");
  const tabHelpdesk = document.getElementById("navTabHelpdesk");

  if (tabHub) tabHub.classList.remove("active");
  if (tabSchedule) tabSchedule.classList.remove("active");
  if (tabHelpdesk) tabHelpdesk.classList.remove("active");

  if (viewName === "login") {
    if (headerTabs) headerTabs.style.display = "none";
    if (headerUser) headerUser.style.display = "none";
    if (loginSec) loginSec.style.display = "block";
    return;
  }

  if (viewName === "register") {
    if (headerTabs) headerTabs.style.display = "none";
    if (headerUser) headerUser.style.display = "none";
    if (registerSec) registerSec.style.display = "block";
    return;
  }

  // Nếu người dùng chưa đăng nhập mà vào các trang trong thì đẩy về login
  if (!currentUser) {
    switchView("login");
    return;
  }

  // Đã đăng nhập: hiển thị thanh điều hướng trên Header
  if (headerTabs) headerTabs.style.display = "flex";
  if (headerUser) headerUser.style.display = "flex";
  updateHeaderUserInfo();

  if (viewName === "hub") {
    if (tabHub) tabHub.classList.add("active");
    if (hubSec) hubSec.style.display = "block";
    updateHubData();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (viewName === "schedule") {
    if (tabSchedule) tabSchedule.classList.add("active");
    if (scheduleSec) scheduleSec.style.display = "block";
    renderScheduleTable(scheduleData);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (viewName === "helpdesk") {
    if (tabHelpdesk) tabHelpdesk.classList.add("active");
    if (helpdeskSec) helpdeskSec.style.display = "block";
    prepareItHelpdeskForm();
    fetchTickets();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
}

function updateHeaderUserInfo() {
  if (!currentUser) return;
  const nameEl = document.getElementById("displayUserName");
  const infoEl = document.getElementById("displayUserInfo");
  const btnConfig = document.getElementById("btnAdminServerConfig");

  if (nameEl) nameEl.textContent = currentUser.fullname || "Cán bộ";
  if (infoEl) infoEl.textContent = `${currentUser.phone} • ${currentUser.position || currentUser.department || "Chi nhánh 23"}`;
  if (btnConfig) {
    btnConfig.style.display = (currentUser.role === "admin") ? "inline-flex" : "none";
  }
}

function updateHubData() {
  if (!currentUser) return;
  const greetingEl = document.getElementById("hubGreetingName");
  const roleEl = document.getElementById("hubUserRole");
  const phoneEl = document.getElementById("hubUserPhone");
  const dateEl = document.getElementById("hubCurrentDate");
  const countScheduleEl = document.getElementById("hubCountSchedule");
  const countTicketsEl = document.getElementById("hubCountPendingTickets");

  if (greetingEl) greetingEl.textContent = currentUser.fullname;
  if (roleEl) roleEl.innerHTML = `Chức vụ: <strong>${currentUser.position || "Cán bộ"}</strong>`;
  if (phoneEl) phoneEl.innerHTML = `SĐT: <strong>${currentUser.phone}</strong>`;

  const now = new Date();
  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  if (dateEl) {
    dateEl.innerHTML = `<i class="fa-solid fa-calendar-day mr-1"></i> ${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  }

  if (countScheduleEl) countScheduleEl.textContent = scheduleData.length;

  let pendingCount = 0;
  currentTickets.forEach(t => {
    const s = (t.status || "").toLowerCase();
    if (!s.includes("hoàn thành") && !s.includes("xong")) pendingCount++;
  });
  if (countTicketsEl) countTicketsEl.textContent = pendingCount;
}

/* =========================================================================
   2. XỬ LÝ XÁC THỰC: ĐĂNG NHẬP, ĐĂNG KÝ, ĐĂNG XUẤT
   ========================================================================= */
async function handleLogin(e) {
  if (e) e.preventDefault();
  let phone = (document.getElementById("loginPhone").value || "").trim().replace(/^'+/, "");
  const password = (document.getElementById("loginPassword").value || "").trim();
  const remember = document.getElementById("rememberMe")?.checked ?? true;

  if (!phone || !password) {
    showToast("Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu!", "warning");
    return;
  }

  if (phone.length === 9 && !phone.startsWith("0")) phone = "0" + phone;

  const btn = document.getElementById("btnLogin");
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang xác thực...`;

  // 1. Thử xác thực trực tuyến qua Google Apps Script nếu có kết nối
  let authSuccess = false;
  let authUser = null;

  if (googleScriptUrl && googleScriptUrl.trim() !== "") {
    try {
      const res = await fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "login", phone: phone, password: password })
      });
      const data = await res.json();
      if (data && data.success && data.user) {
        authSuccess = true;
        authUser = data.user;
      } else if (data && data.isRetired) {
        btn.disabled = false;
        btn.innerHTML = origHtml;
        alert(data.message || "Tài khoản của cán bộ này đã được ghi nhận trạng thái ĐÃ NGHỈ LÀM VIỆC tại đơn vị!");
        return;
      }
    } catch (netErr) {
      console.warn("Không kết nối được server trực tuyến, chuyển sang kiểm tra bộ nhớ danh sách cán bộ:", netErr);
    }
  }

  // 2. Fallback đối chiếu với 70 tài khoản Chi nhánh 23 nạp sẵn & tài khoản đăng ký mới
  if (!authSuccess) {
    // Tổng hợp danh sách tài khoản
    let localUsers = [];
    try {
      localUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_USERS) || "[]");
    } catch(e){}
    const allAccounts = [...DEFAULT_ACCOUNTS, ...localUsers];

    const matched = allAccounts.find(a => {
      let aPhone = (a.phone || "").trim().replace(/^'+/, "");
      if (aPhone.length === 9 && !aPhone.startsWith("0")) aPhone = "0" + aPhone;
      return aPhone === phone && a.password === password;
    });

    if (matched) {
      if (matched.status === "Đã nghỉ") {
        btn.disabled = false;
        btn.innerHTML = origHtml;
        alert(`Tài khoản của cán bộ (${matched.fullname}) đã được ghi nhận trạng thái ĐÃ NGHỈ LÀM VIỆC tại Chi nhánh. Vui lòng liên hệ Tổ CNTT/HCTH nếu cần hỗ trợ!`);
        return;
      }
      authSuccess = true;
      authUser = {
        phone: matched.phone,
        fullname: matched.fullname,
        position: matched.position,
        department: matched.department || "Chi nhánh số 23",
        cccd: matched.cccd || "",
        status: matched.status || "Đang làm việc",
        role: matched.role || (matched.fullname.toLowerCase().includes("quân") ? "admin" : "user")
      };
    }
  }

  btn.disabled = false;
  btn.innerHTML = origHtml;

  if (authSuccess && authUser) {
    currentUser = authUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_PHONE, phone);
      localStorage.setItem(STORAGE_KEYS.REMEMBER_PASS, password);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_PHONE);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_PASS);
    }

    showToast(`Đăng nhập thành công! Xin chào đồng chí ${currentUser.fullname}.`, "success");
    switchView("hub");
  } else {
    showToast("Số điện thoại hoặc mật khẩu không chính xác!", "danger");
  }
}

async function handleRegisterUser(e) {
  if (e) e.preventDefault();

  const fullname = (document.getElementById("regFullname").value || "").trim();
  let phone = (document.getElementById("regPhone").value || "").trim().replace(/^'+/, "");
  const position = (document.getElementById("regPosition").value || "").trim();
  const group = document.getElementById("regGroup").value;
  const department = document.getElementById("regDepartment").value;
  const cccd = (document.getElementById("regCccd").value || "").trim();
  const password = (document.getElementById("regPassword").value || "").trim();
  const passwordConfirm = (document.getElementById("regPasswordConfirm").value || "").trim();

  if (!fullname || !phone || !position || !password) {
    showToast("Vui lòng điền đầy đủ tất cả các trường bắt buộc (*)", "warning");
    return;
  }

  if (phone.length === 9 && !phone.startsWith("0")) phone = "0" + phone;
  if (!/^0\d{9}$/.test(phone)) {
    showToast("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số (bắt đầu bằng 0).", "warning");
    return;
  }

  if (password.length < 8) {
    showToast("Mật khẩu phải có độ dài tối thiểu 8 ký tự!", "warning");
    return;
  }

  // Kiểm tra độ mạnh mật khẩu: hoa, thường, số, ký tự đặc biệt
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[@#$%&*!]/.test(password);

  if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
    showToast("Mật khẩu bắt buộc phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@, #, $, %, &, *, !)", "warning");
    return;
  }

  if (password !== passwordConfirm) {
    showToast("Mật khẩu và xác nhận mật khẩu không khớp!", "danger");
    return;
  }

  const btn = document.getElementById("btnSubmitRegisterUser");
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang đăng ký...`;

  const newUser = {
    phone: phone,
    password: password,
    fullname: fullname,
    position: position,
    group: group,
    department: department,
    cccd: cccd,
    status: "Đang làm việc",
    role: "user"
  };

  // 1. Thử gửi lên Google Apps Script
  if (googleScriptUrl && googleScriptUrl.trim() !== "") {
    try {
      await fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "registerUser", ...newUser })
      });
    } catch(err) {
      console.warn("Lưu Google Sheet gặp lỗi, lưu dự phòng LocalStorage:", err);
    }
  }

  // 2. Lưu vào LocalStorage
  let localUsers = [];
  try {
    localUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_USERS) || "[]");
  } catch(e){}
  localUsers.push(newUser);
  localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers));
  KNOWN_USERS_MAP[phone] = fullname;

  btn.disabled = false;
  btn.innerHTML = origHtml;

  showToast("Đăng ký tài khoản thành công! Tự động đăng nhập vào Cổng...", "success");

  currentUser = newUser;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  switchView("hub");
}

function handleLogout() {
  if (confirm("Đồng chí có chắc chắn muốn đăng xuất khỏi Cổng Dịch Vụ Nội Bộ?")) {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showToast("Đã đăng xuất an toàn.", "info");
    switchView("login");
  }
}

function checkAutoLogin() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      currentUser = JSON.parse(saved);
      if (currentUser && currentUser.phone) {
        switchView("hub");
        return;
      }
    }
  } catch(e){}

  // Điền nhớ mật khẩu
  const rPhone = localStorage.getItem(STORAGE_KEYS.REMEMBER_PHONE);
  const rPass = localStorage.getItem(STORAGE_KEYS.REMEMBER_PASS);
  if (rPhone) {
    const phoneInput = document.getElementById("loginPhone");
    if (phoneInput) phoneInput.value = rPhone;
  }
  if (rPass) {
    const passInput = document.getElementById("loginPassword");
    if (passInput) passInput.value = rPass;
  }
  switchView("login");
}

/* =========================================================================
   3. PHÂN HỆ IT HELPDESK (SỰ CỐ MÁY TÍNH & MONITORING)
   ========================================================================= */
function prepareItHelpdeskForm() {
  if (!currentUser) return;
  const fnInput = document.getElementById("itFullname");
  const phoneInput = document.getElementById("itPhone");
  const deptInput = document.getElementById("itDepartment");

  if (fnInput) fnInput.value = currentUser.fullname || "";
  if (phoneInput) phoneInput.value = currentUser.phone || "";
  if (deptInput) deptInput.value = currentUser.department || "Chi nhánh số 23";

  autoDetectMachineAndSpecs();
}

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

  const machineInput = document.getElementById("itMachineName");
  if (machineInput && !machineInput.value) {
    machineInput.value = autoName;
  }

  const specText = document.getElementById("detectedSpecText");
  if (specText) {
    specText.innerHTML = `<i class="fa-solid fa-desktop mr-1 text-blue-600"></i> <span>Máy: <strong>${autoName}</strong> | ${specsSummary}</span>`;
  }

  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    if (data && data.ip) {
      detectedClient.ip = data.ip;
      if (specText) {
        specText.innerHTML = `<i class="fa-solid fa-desktop mr-1 text-blue-600"></i> <span>Máy: <strong>${autoName}</strong> | IP: <strong>${data.ip}</strong> (${specsSummary})</span>`;
      }
    }
  } catch (e) {
    detectedClient.ip = "LAN Nội Bộ";
  }
}

function setupPasteEventListener() {
  window.addEventListener("paste", (e) => {
    if (currentView !== "helpdesk") return;
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

function setupDropZone() {
  const dropZone = document.getElementById("itDropZone");
  if (!dropZone) return;

  ["dragenter", "dragover"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("dragover");
    }, false);
  });

  ["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("dragover");
    }, false);
  });

  dropZone.addEventListener("drop", (e) => {
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      compressAndPreviewImage(files[0]);
    }
  }, false);

  dropZone.addEventListener("click", (e) => {
    if (e.target.id === "btnRemoveItImg") return;
    const fileInput = document.getElementById("itFileInput");
    if (fileInput) fileInput.click();
  });

  const fileInput = document.getElementById("itFileInput");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        compressAndPreviewImage(e.target.files[0]);
      }
    });
  }

  const btnRemove = document.getElementById("btnRemoveItImg");
  if (btnRemove) {
    btnRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      removeItSelectedImage();
    });
  }
}

function compressAndPreviewImage(file) {
  if (!file.type.match("image.*")) {
    showToast("Vui lòng chỉ chọn file ảnh (PNG, JPG, JPEG)!", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = (re) => {
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

      const compressed = canvas.toDataURL("image/jpeg", 0.75);
      detectedClient.imageBase64 = compressed;

      const promptBox = document.getElementById("itDropPrompt");
      const previewBox = document.getElementById("itPreviewBox");
      const previewImg = document.getElementById("itPreviewImg");
      const sizeNote = document.getElementById("itImageSizeNote");

      if (promptBox) promptBox.style.display = "none";
      if (previewBox) previewBox.style.display = "inline-block";
      if (previewImg) previewImg.src = compressed;

      const sizeKb = Math.round((compressed.length * 3 / 4) / 1024);
      if (sizeNote) sizeNote.textContent = `Ảnh đã nén: ~${sizeKb} KB (Sẵn sàng gửi)`;
    };
    img.src = re.target.result;
  };
  reader.readAsDataURL(file);
}

function removeItSelectedImage() {
  detectedClient.imageBase64 = "";
  const fileInput = document.getElementById("itFileInput");
  if (fileInput) fileInput.value = "";
  const promptBox = document.getElementById("itDropPrompt");
  const previewBox = document.getElementById("itPreviewBox");
  if (previewBox) previewBox.style.display = "none";
  if (promptBox) promptBox.style.display = "flex";
}

async function handleSubmitTicket(e) {
  if (e) e.preventDefault();

  const btn = document.getElementById("btnSubmitItTicket");
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang tải lên và gửi...`;

  const selectedCat = document.querySelector('input[name="itCategory"]:checked')?.value || "Máy tính / PC";
  const machineVal = document.getElementById("itMachineName").value.trim() || detectedClient.machineName;

  const payload = {
    action: "createTicket",
    fullname: document.getElementById("itFullname").value.trim(),
    phone: document.getElementById("itPhone").value.trim(),
    department: document.getElementById("itDepartment").value.trim(),
    machineName: machineVal,
    category: selectedCat,
    errorMessage: document.getElementById("itErrorMessage").value.trim(),
    description: document.getElementById("itDescription").value.trim(),
    imageBase64: detectedClient.imageBase64,
    ip: detectedClient.ip,
    clientSpecs: `IP: ${detectedClient.ip} | ${detectedClient.specs}`
  };

  const now = new Date();
  const dCode = `${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const tempId = `TK-${dCode}-${Math.floor(100 + Math.random() * 900)}`;
  const timeStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  let ticketUrl = "";
  if (googleScriptUrl && googleScriptUrl.trim() !== "") {
    try {
      const res = await fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.ticketId) {
        tempId = data.ticketId;
        ticketUrl = data.imageUrl || "";
      }
    } catch(err) {
      console.warn("Lỗi gửi POST Google Apps Script, chuyển fallback GET:", err);
      try {
        const clone = Object.assign({}, payload);
        delete clone.imageBase64;
        await fetch(`${googleScriptUrl}?action=createTicket&data=${encodeURIComponent(JSON.stringify(clone))}`, { mode: "no-cors" });
      } catch(e2){}
    }
  }

  const newTicket = {
    id: tempId,
    timestamp: timeStr,
    fullname: payload.fullname,
    phone: payload.phone,
    department: payload.department,
    machineName: payload.machineName,
    category: payload.category,
    errorMessage: payload.errorMessage,
    description: payload.description,
    imageUrl: ticketUrl || detectedClient.imageBase64,
    status: "Chờ xử lý",
    itNote: "",
    clientSpecs: payload.clientSpecs
  };

  currentTickets.unshift(newTicket);
  localStorage.setItem(STORAGE_KEYS.LOCAL_TICKETS, JSON.stringify(currentTickets));

  // Reset các ô nhập lỗi và ảnh
  document.getElementById("itErrorMessage").value = "";
  document.getElementById("itDescription").value = "";
  removeItSelectedImage();

  btn.disabled = false;
  btn.innerHTML = origHtml;

  updateTicketStats();
  renderTickets();
  updateHubData();

  // Mở popup thành công
  document.getElementById("itSuccessTicketId").textContent = `#${tempId}`;
  document.getElementById("itSuccessMachineName").textContent = `Máy: ${payload.machineName}`;
  document.getElementById("itSuccessModal").style.display = "flex";
}

async function fetchTickets() {
  const icon = document.getElementById("itRefreshIcon");
  if (icon) icon.classList.add("fa-spin");

  if (googleScriptUrl && googleScriptUrl.trim() !== "") {
    try {
      const res = await fetch(`${googleScriptUrl}?action=getTickets&t=${Date.now()}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.tickets)) {
        currentTickets = data.tickets;
        localStorage.setItem(STORAGE_KEYS.LOCAL_TICKETS, JSON.stringify(currentTickets));
      }
    } catch(err) {
      loadCachedTickets();
    }
  } else {
    loadCachedTickets();
  }

  if (icon) icon.classList.remove("fa-spin");
  updateTicketStats();
  renderTickets();
  updateHubData();
}

function loadCachedTickets() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCAL_TICKETS);
    if (saved) {
      currentTickets = JSON.parse(saved);
      return;
    }
  } catch(e){}

  // Vé mẫu demo nếu trống
  currentTickets = [
    {
      id: "TK-261028-002",
      timestamp: "28/10/2026 08:35:10",
      fullname: "Nguyễn Thị Bích Tuyền",
      phone: "0909736435",
      department: "Tổ Hành chính - Tổng hợp",
      machineName: "Win 10/11 (PC-48A2) - Bàn 01",
      category: "Máy in / Scan",
      errorMessage: "Paper Jam inside tray 2",
      description: "Máy in kẹt giấy liên tục khi in báo cáo lịch tuần, đèn báo lỗi đỏ.",
      imageUrl: "",
      status: "Chờ xử lý",
      itNote: "",
      clientSpecs: "Win 10/11 • 8GB RAM"
    },
    {
      id: "TK-261028-001",
      timestamp: "28/10/2026 08:12:05",
      fullname: "Nguyễn Thành Như Bảo",
      phone: "0907259775",
      department: "Tổ Đăng ký và Cấp GCN",
      machineName: "Win 10/11 (PC-91F0) - Bàn 03",
      category: "Chữ ký số / Cổng DVC",
      errorMessage: "Cannot find valid certificate in token",
      description: "Cắm USB Token ký số văn bản nhưng phần mềm báo không tìm thấy chứng thư.",
      imageUrl: "",
      status: "Đang xử lý",
      itNote: "Đang cập nhật driver Token VNPT",
      clientSpecs: "Win 10/11 • 16GB RAM"
    }
  ];
}

function updateTicketStats() {
  const total = currentTickets.length;
  let pending = 0, processing = 0, completed = 0;
  currentTickets.forEach(t => {
    const s = (t.status || "").toLowerCase();
    if (s.includes("hoàn thành") || s.includes("xong") || s.includes("done")) completed++;
    else if (s.includes("đang")) processing++;
    else pending++;
  });

  const elTot = document.getElementById("itStatTotal");
  const elPen = document.getElementById("itStatPending");
  const elPro = document.getElementById("itStatProcessing");
  const elCom = document.getElementById("itStatCompleted");

  if (elTot) elTot.textContent = total;
  if (elPen) elPen.textContent = pending;
  if (elPro) elPro.textContent = processing;
  if (elCom) elCom.textContent = completed;
}

function getStatusRank(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("đang")) return 1;
  if (s.includes("hoàn thành") || s.includes("xong")) return 3;
  return 2;
}

function renderTickets() {
  const tbody = document.getElementById("itTicketTableBody");
  const search = (document.getElementById("itSearchInput")?.value || "").toLowerCase().trim();
  const stFilter = document.getElementById("itStatusFilter")?.value || "ALL";

  if (!tbody) return;

  const filtered = currentTickets.filter(t => {
    if (stFilter !== "ALL") {
      const s = (t.status || "").toLowerCase();
      if (s !== stFilter.toLowerCase()) return false;
    }
    if (search) {
      const txt = `${t.id} ${t.fullname} ${t.phone} ${t.department} ${t.machineName} ${t.errorMessage} ${t.description}`.toLowerCase();
      if (!txt.includes(search)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => getStatusRank(a.status) - getStatusRank(b.status));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center empty-state">Không có sự cố nào phù hợp bộ lọc.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    let badgeClass = "status-pending";
    const s = (t.status || "").toLowerCase();
    if (s.includes("hoàn thành") || s.includes("xong")) badgeClass = "status-completed";
    else if (s.includes("đang")) badgeClass = "status-processing";

    const cleanPhone = String(t.phone || "").replace(/^'+/, "");
    let imgBtn = `<span style="color: #cbd5e1;">—</span>`;
    if (t.imageUrl && t.imageUrl.trim() !== "") {
      imgBtn = `<button type="button" class="btn btn-secondary btn-sm" onclick="openItImageViewer('${encodeURIComponent(t.imageUrl)}', '${encodeURIComponent(t.id)}')">
        <i class="fa-solid fa-image text-blue-600 mr-1"></i> Xem
      </button>`;
    }

    return `
      <tr>
        <td>
          <strong style="color: #1e3a8a; font-family: monospace;">${t.id}</strong>
          <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">${t.timestamp}</div>
        </td>
        <td>
          <strong>${t.fullname}</strong>
          <div style="font-size: 0.76rem; color: #475569;">${t.department}</div>
          ${cleanPhone ? `<div style="font-size: 0.74rem; color: #1e40af;"><a href="tel:${cleanPhone}"><i class="fa-solid fa-phone text-[10px] mr-1"></i>${cleanPhone}</a></div>` : ''}
        </td>
        <td>
          <div style="font-size: 0.8rem; font-weight: 600;">${t.machineName || "Chưa rõ máy"}</div>
          <span style="display: inline-block; font-size: 0.72rem; padding: 1px 6px; background: #e2e8f0; border-radius: 4px; margin-top: 2px;">${t.category}</span>
        </td>
        <td>
          ${t.errorMessage ? `<div class="error-tag-box"><i class="fa-solid fa-triangle-exclamation mr-1"></i>${escapeHtml(t.errorMessage)}</div>` : ''}
          <div style="color: #334155; line-height: 1.4;">${escapeHtml(t.description)}</div>
        </td>
        <td style="text-align: center;">${imgBtn}</td>
        <td style="text-align: center;">
          <span class="badge-status ${badgeClass}">
            ${badgeClass === 'status-completed' ? '<i class="fa-solid fa-check"></i>' : (badgeClass === 'status-processing' ? '<i class="fa-solid fa-spinner fa-spin"></i>' : '<i class="fa-regular fa-clock"></i>')}
            ${t.status || "Chờ xử lý"}
          </span>
        </td>
        <td style="font-size: 0.78rem;">
          ${t.itNote ? `<div style="background: #e0f2fe; padding: 4px 6px; border-radius: 4px; color: #0369a1;"><strong>IT:</strong> ${escapeHtml(t.itNote)}</div>` : '<span style="color: #94a3b8; font-style: italic;">Chưa có ghi chú</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function openItImageViewer(encodedUrl, encodedId) {
  const rawUrl = decodeURIComponent(encodedUrl || "").trim();
  const id = decodeURIComponent(encodedId || "").trim();

  document.getElementById("itModalImgTitle").innerHTML = `<i class="fa-solid fa-image text-blue-600 mr-2"></i>Ảnh Lỗi Ticket #${id}`;
  const modal = document.getElementById("itImageViewerModal");
  const loading = document.getElementById("itModalImgLoading");
  const imgEl = document.getElementById("itModalFullImg");
  const driveLink = document.getElementById("itModalDriveLink");

  loading.style.display = "block";
  imgEl.style.display = "none";
  imgEl.src = "";

  if (rawUrl.startsWith("data:image/")) {
    driveLink.style.display = "none";
    imgEl.src = rawUrl;
  } else {
    driveLink.style.display = "inline-flex";
    driveLink.href = rawUrl;
    const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      imgEl.src = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    } else {
      imgEl.src = rawUrl;
    }
  }

  modal.style.display = "flex";
}

/* =========================================================================
   4. LOGIC ĐĂNG KÝ LỊCH TUẦN (WEEKLY SCHEDULE)
   ========================================================================= */
function handleAutoEndTime(startTimeStr) {
  if (!startTimeStr) return;
  const parts = startTimeStr.split(":");
  if (parts.length < 2) return;
  const startHour = parseInt(parts[0], 10);
  const startMinute = parseInt(parts[1], 10);
  let totalMinutes = startHour * 60 + startMinute + 120;
  if (totalMinutes >= 24 * 60) totalMinutes = 23 * 60 + 59;
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;
  const endStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  const regEndTime = document.getElementById("regEndTime");
  if (regEndTime) {
    if (window.endTimePicker) window.endTimePicker.setDate(endStr, true);
    else regEndTime.value = endStr;
  }
}

function calculateDayOfWeek(dateString) {
  const dayInput = document.getElementById("regDayOfWeek");
  if (!dayInput) return;
  if (!dateString) { dayInput.value = ""; return; }
  const parts = dateString.split("/");
  if (parts.length !== 3) { dayInput.value = ""; return; }
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const y = parseInt(parts[2], 10);
  const dateObj = new Date(y, m, d);
  if (isNaN(dateObj.getTime())) { dayInput.value = ""; return; }
  const days = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  dayInput.value = days[dateObj.getDay()];
}

function setupCharCounter(inputId, counterId, maxLen) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  if (!input || !counter) return;
  const update = () => {
    const len = input.value.length;
    counter.textContent = `${len} / ${maxLen} ký tự`;
    counter.classList.toggle("warning", len > maxLen * 0.9);
  };
  input.addEventListener("input", update);
  update();
}

function renderScheduleTable(data) {
  const tbody = document.getElementById("scheduleTableBody");
  const countBadge = document.getElementById("totalScheduleCount");
  if (!tbody) return;

  const keyword = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  let list = Array.isArray(data) ? [...data] : [];

  if (keyword) {
    list = list.filter(item => {
      const txt = `${item.date} ${item.dayOfWeek} ${item.time} ${item.content} ${item.attendees} ${item.location} ${getSenderDisplayName(item)}`.toLowerCase();
      return txt.includes(keyword);
    });
  }

  if (countBadge) countBadge.textContent = `${list.length} mục`;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center empty-state">Không có lịch công tác nào phù hợp.</td></tr>`;
    renderPaginationControls(0, 0, 0, 0);
    return;
  }

  // Sắp xếp lịch theo ngày
  list.sort((a, b) => {
    const da = (a.date || "").split("/").reverse().join("");
    const db = (b.date || "").split("/").reverse().join("");
    return db.localeCompare(da);
  });

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, list.length);
  const pageItems = list.slice(startIdx, endIdx);

  tbody.innerHTML = pageItems.map(item => {
    const st = getMeetingStatus(item.date, item.time);
    return `
      <tr class="${st.isPast ? 'meeting-past' : ''}">
        <td>
          <strong>${item.dayOfWeek}</strong>
          <div style="font-size: 0.76rem; color: #64748b;">${item.date}</div>
        </td>
        <td>
          <strong style="color: #1e40af;">${item.time}</strong>
          <div style="margin-top: 2px;"><span class="badge ${st.badgeClass}">${st.label}</span></div>
        </td>
        <td>
          <div style="font-weight: 600; color: #0f172a; line-height: 1.4;">${formatCellHtmlWithRedHighlight(item.content)}</div>
        </td>
        <td style="font-size: 0.82rem; color: #334155;">${formatCellHtmlWithRedHighlight(item.attendees)}</td>
        <td style="font-size: 0.82rem; color: #475569;">${escapeHtml(item.location)}</td>
        <td>
          <div style="font-weight: 600; font-size: 0.82rem;">${getSenderDisplayName(item)}</div>
        </td>
      </tr>
    `;
  }).join('');

  renderPaginationControls(list.length, totalPages, startIdx + 1, endIdx);
}

function renderPaginationControls(total, totalPages, start, end) {
  const infoEl = document.getElementById("paginationInfo");
  const controlsEl = document.getElementById("paginationControls");
  if (infoEl) infoEl.innerHTML = `Hiển thị <strong>${start} - ${end}</strong> trên tổng số <strong>${total}</strong> lịch`;
  if (!controlsEl) return;
  if (totalPages <= 1) { controlsEl.innerHTML = ""; return; }

  let html = `<button type="button" class="btn-page" ${currentPage === 1 ? 'disabled' : ''} onclick="currentPage--; renderScheduleTable(scheduleData);">&laquo;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" class="btn-page ${i === currentPage ? 'active' : ''}" onclick="currentPage = ${i}; renderScheduleTable(scheduleData);">${i}</button>`;
  }
  html += `<button type="button" class="btn-page ${currentPage === totalPages ? 'disabled' : ''} onclick="currentPage++; renderScheduleTable(scheduleData);">&raquo;</button>`;
  controlsEl.innerHTML = html;
}

async function handleSubmitSchedule(e) {
  if (e) e.preventDefault();

  const date = document.getElementById("regDate").value.trim();
  const dayOfWeek = document.getElementById("regDayOfWeek").value.trim();
  const startTime = document.getElementById("regStartTime").value.trim();
  const endTime = document.getElementById("regEndTime").value.trim();
  const content = document.getElementById("regContent").value.trim();
  const attendees = document.getElementById("regAttendees").value.trim();
  const location = document.getElementById("regLocation").value.trim();

  if (!date || !startTime || !endTime || !content || !attendees || !location) {
    showToast("Vui lòng điền đầy đủ các thông tin lịch công tác!", "warning");
    return;
  }

  const time = `${startTime} - ${endTime}`;
  const btn = document.getElementById("btnSubmitRegister");
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Đang ghi nhận...`;

  const payload = {
    action: "addSchedule",
    phone: currentUser ? currentUser.phone : "",
    name: currentUser ? currentUser.fullname : "Cán bộ",
    date: date,
    dayOfWeek: dayOfWeek,
    time: time,
    content: content,
    attendees: attendees,
    location: location
  };

  const now = new Date();
  const newScheduleItem = {
    id: "LT-" + now.getTime(),
    timestamp: `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`,
    phone: payload.phone,
    name: payload.name,
    date: date,
    dayOfWeek: dayOfWeek,
    time: time,
    content: content,
    attendees: attendees,
    location: location
  };

  if (googleScriptUrl && googleScriptUrl.trim() !== "") {
    try {
      await fetch(googleScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    } catch(err) {
      console.warn("Lỗi gửi lịch tuần lên Apps Script, lưu offline:", err);
    }
  }

  scheduleData.unshift(newScheduleItem);
  localStorage.setItem(STORAGE_KEYS.LOCAL_SCHEDULE, JSON.stringify(scheduleData));

  btn.disabled = false;
  btn.innerHTML = origHtml;

  // Reset form
  document.getElementById("regContent").value = "";
  document.getElementById("regAttendees").value = "";
  document.getElementById("regLocation").value = "";
  setupCharCounter("regContent", "contentCounter", 500);
  setupCharCounter("regAttendees", "attendeesCounter", 500);
  setupCharCounter("regLocation", "locationCounter", 500);

  showToast("Đã đăng ký lịch công tác tuần thành công!", "success");
  renderScheduleTable(scheduleData);
  updateHubData();
}

async function fetchSchedule() {
  const btn = document.getElementById("btnRefreshList");
  if (btn) btn.disabled = true;

  if (googleScriptUrl && googleScriptUrl.trim() !== "") {
    try {
      const res = await fetch(`${googleScriptUrl}?action=getSchedule&t=${Date.now()}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        scheduleData = data.data;
        localStorage.setItem(STORAGE_KEYS.LOCAL_SCHEDULE, JSON.stringify(scheduleData));
      }
    } catch(err) {
      loadCachedSchedule();
    }
  } else {
    loadCachedSchedule();
  }

  if (btn) btn.disabled = false;
  renderScheduleTable(scheduleData);
  updateHubData();
}

function loadCachedSchedule() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCAL_SCHEDULE);
    if (saved) {
      scheduleData = JSON.parse(saved);
      return;
    }
  } catch(e){}

  // Demo schedule
  scheduleData = [
    {
      id: "LT-261028-01",
      timestamp: "28/10/2026 08:00",
      phone: "0909736435",
      name: "Nguyễn Thị Bích Tuyền",
      date: "28/10/2026",
      dayOfWeek: "Thứ Tư",
      time: "08:00 - 11:30",
      content: "Họp giao ban định kỳ Chi nhánh 23 rà soát tiến độ giải quyết hồ sơ đất đai và công tác tiếp công dân",
      attendees: "Ban Giám đốc, Lãnh đạo các Tổ chuyên môn Chi nhánh số 23",
      location: "Phòng họp số 1 - Chi nhánh số 23"
    }
  ];
}

/* =========================================================================
   5. BINDING CÁC SỰ KIỆN GIAO DIỆN KHI KHỞI ĐỘNG
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Chuyển đổi qua lại giữa Login và Register
  document.getElementById("btnGoToRegister")?.addEventListener("click", () => switchView("register"));
  document.getElementById("btnBackToLogin")?.addEventListener("click", () => switchView("login"));

  // 2. Form Auth
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerUserForm")?.addEventListener("submit", handleRegisterUser);
  document.getElementById("btnLogout")?.addEventListener("click", handleLogout);

  // 3. Toggle mắt xem mật khẩu
  document.getElementById("btnToggleLoginPassword")?.addEventListener("click", () => {
    const el = document.getElementById("loginPassword");
    if (!el) return;
    el.type = (el.type === "password") ? "text" : "password";
  });
  document.getElementById("btnToggleRegPassword")?.addEventListener("click", () => {
    const el = document.getElementById("regPassword");
    if (!el) return;
    el.type = (el.type === "password") ? "text" : "password";
  });
  document.getElementById("btnToggleRegPasswordConfirm")?.addEventListener("click", () => {
    const el = document.getElementById("regPasswordConfirm");
    if (!el) return;
    el.type = (el.type === "password") ? "text" : "password";
  });

  // 4. Chọn nhanh tài khoản kiểm thử
  document.getElementById("quickAccountSelect")?.addEventListener("change", (e) => {
    const val = e.target.value;
    if (!val) return;
    const [p, pw] = val.split("|");
    const phoneInput = document.getElementById("loginPhone");
    const passInput = document.getElementById("loginPassword");
    if (phoneInput) phoneInput.value = p;
    if (passInput) passInput.value = pw;
  });

  // 5. Tabs trên Header
  document.getElementById("navTabHub")?.addEventListener("click", () => switchView("hub"));
  document.getElementById("navTabSchedule")?.addEventListener("click", () => switchView("schedule"));
  document.getElementById("navTabHelpdesk")?.addEventListener("click", () => switchView("helpdesk"));

  // 6. Nút điều hướng trên Hub
  document.getElementById("btnHubGoSchedule")?.addEventListener("click", () => switchView("schedule"));
  document.getElementById("cardSelectSchedule")?.addEventListener("click", (e) => {
    if (!e.target.closest("button")) switchView("schedule");
  });
  document.getElementById("btnHubGoHelpdesk")?.addEventListener("click", () => switchView("helpdesk"));
  document.getElementById("cardSelectHelpdesk")?.addEventListener("click", (e) => {
    if (!e.target.closest("button")) switchView("helpdesk");
  });

  // 7. Nút quay lại từ phân hệ về Hub
  document.getElementById("btnBackFromSchedule")?.addEventListener("click", () => switchView("hub"));
  document.getElementById("btnBackFromHelpdesk")?.addEventListener("click", () => switchView("hub"));

  // 8. Đăng ký lịch tuần
  document.getElementById("registerForm")?.addEventListener("submit", handleSubmitSchedule);
  document.getElementById("btnRefreshList")?.addEventListener("click", fetchSchedule);
  document.getElementById("searchInput")?.addEventListener("input", () => {
    currentPage = 1;
    renderScheduleTable(scheduleData);
  });
  document.getElementById("btnExportWord")?.addEventListener("click", openExportWordModal);
  document.getElementById("btnCloseExportModal")?.addEventListener("click", closeExportWordModal);
  document.getElementById("btnCancelExportModal")?.addEventListener("click", closeExportWordModal);
  document.getElementById("btnConfirmExportWord")?.addEventListener("click", handleConfirmExportWord);

  // 9. IT Helpdesk
  document.getElementById("itTicketForm")?.addEventListener("submit", handleSubmitTicket);
  document.getElementById("btnRefreshItTickets")?.addEventListener("click", fetchTickets);
  document.getElementById("itSearchInput")?.addEventListener("input", renderTickets);
  document.getElementById("itStatusFilter")?.addEventListener("change", renderTickets);
  document.getElementById("btnCloseItImgModal")?.addEventListener("click", () => {
    document.getElementById("itImageViewerModal").style.display = "none";
  });
  document.getElementById("btnCloseItImgBtn")?.addEventListener("click", () => {
    document.getElementById("itImageViewerModal").style.display = "none";
  });
  document.getElementById("btnOkItSuccess")?.addEventListener("click", () => {
    document.getElementById("itSuccessModal").style.display = "none";
  });

  // Radio chips selector
  document.querySelectorAll('.category-radio-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-radio-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  // 10. Quên mật khẩu & Cấu hình Server
  document.getElementById("btnForgotPassword")?.addEventListener("click", () => {
    document.getElementById("forgotPasswordModal").style.display = "flex";
  });
  document.getElementById("btnCloseForgotModal")?.addEventListener("click", () => {
    document.getElementById("forgotPasswordModal").style.display = "none";
  });
  document.getElementById("btnCloseForgotBtn")?.addEventListener("click", () => {
    document.getElementById("forgotPasswordModal").style.display = "none";
  });

  document.getElementById("btnAdminServerConfig")?.addEventListener("click", () => {
    const input = document.getElementById("googleScriptUrlInput");
    if (input) input.value = googleScriptUrl;
    document.getElementById("configModal").style.display = "flex";
  });
  document.getElementById("btnBannerConfig")?.addEventListener("click", () => {
    const input = document.getElementById("googleScriptUrlInput");
    if (input) input.value = googleScriptUrl;
    document.getElementById("configModal").style.display = "flex";
  });
  document.getElementById("btnCloseModal")?.addEventListener("click", () => {
    document.getElementById("configModal").style.display = "none";
  });
  document.getElementById("btnSaveConfig")?.addEventListener("click", () => {
    const val = (document.getElementById("googleScriptUrlInput")?.value || "").trim();
    if (val) {
      googleScriptUrl = val;
      localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, val);
      showToast("Đã lưu cấu hình Server API thành công!", "success");
      document.getElementById("configModal").style.display = "none";
      updateSyncBanner();
    }
  });

  // Khởi tạo các bộ đếm ký tự 500
  setupCharCounter("regContent", "contentCounter", 500);
  setupCharCounter("regAttendees", "attendeesCounter", 500);
  setupCharCounter("regLocation", "locationCounter", 500);

  // Setup IT Helpdesk paste & drop
  setupPasteEventListener();
  setupDropZone();

  // Khởi tạo Flatpickr cho ngày & giờ lịch tuần
  initDateTimePickers();

  // Nạp dữ liệu ban đầu
  loadCachedSchedule();
  loadCachedTickets();

  // Kiểm tra đăng nhập
  checkAutoLogin();
});

function initDateTimePickers() {
  const regDateInput = document.getElementById("regDate");
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayVnStr = `${dd}/${mm}/${yyyy}`;

  if (regDateInput && window.flatpickr) {
    flatpickr(regDateInput, {
      dateFormat: "d/m/Y",
      minDate: "today",
      defaultDate: todayVnStr,
      disableMobile: true,
      locale: {
        weekdays: {
          shorthand: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
          longhand: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
        },
        months: {
          shorthand: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
          longhand: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
        },
        firstDayOfWeek: 1
      },
      onChange: (selectedDates, dateStr) => calculateDayOfWeek(dateStr)
    });
    calculateDayOfWeek(todayVnStr);
  }

  const regStart = document.getElementById("regStartTime");
  const regEnd = document.getElementById("regEndTime");
  if (window.flatpickr) {
    if (regStart) {
      window.startTimePicker = flatpickr(regStart, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultDate: "07:30",
        minuteIncrement: 15,
        disableMobile: true,
        onChange: (dates, dateStr) => handleAutoEndTime(dateStr)
      });
    }
    if (regEnd) {
      window.endTimePicker = flatpickr(regEnd, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultDate: "09:30",
        minuteIncrement: 15,
        disableMobile: true
      });
    }
  }
}

function updateSyncBanner() {
  const banner = document.getElementById("syncWarningBanner");
  if (!banner) return;
  if (!googleScriptUrl || googleScriptUrl.trim() === "" || googleScriptUrl.includes("PLACEHOLDER")) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }
}

function formatVnDateObj(d) {
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
}

function getThisWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const distToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { from: formatVnDateObj(monday), to: formatVnDateObj(sunday) };
}

function getNextWeekRange() {
  const thisWeek = getThisWeekRange();
  const [d, m, y] = thisWeek.from.split("/").map(Number);
  const nextMonday = new Date(y, m - 1, d + 7);
  const nextSunday = new Date(y, m - 1, d + 13);
  return { from: formatVnDateObj(nextMonday), to: formatVnDateObj(nextSunday) };
}

function getThisMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: formatVnDateObj(firstDay), to: formatVnDateObj(lastDay) };
}

function openExportWordModal() {
  if (!scheduleData || scheduleData.length === 0) {
    showToast("Chưa có dữ liệu đăng ký nào để xuất file Word!", "warning");
    return;
  }

  const modal = document.getElementById("exportWordModal");
  if (!modal) {
    exportWeeklyScheduleWord(scheduleData, "", "");
    return;
  }

  const fromInput = document.getElementById("exportFromDate");
  const toInput = document.getElementById("exportToDate");
  const thisWeek = getThisWeekRange();

  if (window.flatpickr) {
    if (!exportFromPicker && fromInput) {
      exportFromPicker = flatpickr(fromInput, {
        dateFormat: "d/m/Y",
        defaultDate: thisWeek.from,
        disableMobile: true,
        locale: { firstDayOfWeek: 1 },
        onChange: () => updateExportPreviewCount()
      });
    } else if (exportFromPicker) {
      exportFromPicker.setDate(thisWeek.from);
    }

    if (!exportToPicker && toInput) {
      exportToPicker = flatpickr(toInput, {
        dateFormat: "d/m/Y",
        defaultDate: thisWeek.to,
        disableMobile: true,
        locale: { firstDayOfWeek: 1 },
        onChange: () => updateExportPreviewCount()
      });
    } else if (exportToPicker) {
      exportToPicker.setDate(thisWeek.to);
    }
  } else {
    if (fromInput) fromInput.value = thisWeek.from;
    if (toInput) toInput.value = thisWeek.to;
  }

  const radioAll = document.getElementById("scopeAll");
  const radioRange = document.getElementById("scopeRange");
  if (radioAll) radioAll.checked = true;
  if (radioRange) radioRange.checked = false;

  handleExportScopeChange("all");
  updateExportPreviewCount();

  modal.style.display = "flex";
}

function closeExportWordModal() {
  const modal = document.getElementById("exportWordModal");
  if (modal) modal.style.display = "none";
}

function handleExportScopeChange(scope) {
  const rangeBox = document.getElementById("exportDateRangeBox");
  const labelAll = document.getElementById("labelExportAll");
  const labelRange = document.getElementById("labelExportRange");

  if (scope === "range") {
    if (rangeBox) rangeBox.style.display = "block";
    if (labelRange) labelRange.classList.add("active");
    if (labelAll) labelAll.classList.remove("active");
  } else {
    if (rangeBox) rangeBox.style.display = "none";
    if (labelAll) labelAll.classList.add("active");
    if (labelRange) labelRange.classList.remove("active");
  }

  updateExportPreviewCount();
}

function getFilteredExportData() {
  const isRange = document.getElementById("scopeRange") && document.getElementById("scopeRange").checked;
  if (!isRange) {
    return {
      data: [...scheduleData],
      fromDateStr: "",
      toDateStr: "",
      isFiltered: false
    };
  }

  const fromVal = (document.getElementById("exportFromDate").value || "").trim();
  const toVal = (document.getElementById("exportToDate").value || "").trim();

  const fromIso = convertDDMMYYYYtoYYYYMMDD(fromVal);
  const toIso = convertDDMMYYYYtoYYYYMMDD(toVal);

  if (!fromIso || !toIso) {
    return { data: [], fromDateStr: fromVal, toDateStr: toVal, isFiltered: true, error: "Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc!" };
  }

  if (toIso < fromIso) {
    return { data: [], fromDateStr: fromVal, toDateStr: toVal, isFiltered: true, error: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!" };
  }

  const filtered = scheduleData.filter(item => {
    const itemIso = item.rawDate || convertDDMMYYYYtoYYYYMMDD(item.date);
    return itemIso >= fromIso && itemIso <= toIso;
  });

  return {
    data: filtered,
    fromDateStr: fromVal,
    toDateStr: toVal,
    isFiltered: true
  };
}

function updateExportPreviewCount() {
  const previewInfo = document.getElementById("exportPreviewInfo");
  if (!previewInfo) return;

  const result = getFilteredExportData();
  if (result.error) {
    previewInfo.innerHTML = `<span style="color: #b91c1c;">⚠️ ${escapeHtml(result.error)}</span>`;
    return;
  }

  if (result.isFiltered) {
    previewInfo.innerHTML = `Đang chọn: Từ ngày <strong>${escapeHtml(result.fromDateStr)}</strong> đến ngày <strong>${escapeHtml(result.toDateStr)}</strong> (<strong style="color: #1e40af;">${result.data.length}</strong> mục)`;
  } else {
    previewInfo.innerHTML = `Đang chọn: <strong>Tất cả lịch hiện có</strong> (<strong style="color: #1e40af;">${scheduleData.length}</strong> mục)`;
  }
}

async function handleConfirmExportWord() {
  const result = getFilteredExportData();
  if (result.error) {
    showToast(result.error, "warning");
    return;
  }

  if (result.data.length === 0) {
    if (result.isFiltered) {
      showToast(`Không có lịch công tác nào trong khoảng từ ngày ${result.fromDateStr} đến ${result.toDateStr}!`, "warning");
    } else {
      showToast("Chưa có dữ liệu nào để xuất file Word!", "warning");
    }
    return;
  }

  await exportWeeklyScheduleWord(result.data, result.fromDateStr, result.toDateStr);
}

// ==================== XUẤT LỊCH TUẦN WORD (.DOCX) CHUẨN NGHỊ ĐỊNH 30 ====================
async function exportWeeklyScheduleWord(customData, customFirstDate, customLastDate) {
  const dataToExport = Array.isArray(customData) ? customData : scheduleData;
  if (!dataToExport || dataToExport.length === 0) {
    showToast("Chưa có dữ liệu đăng ký nào để xuất file Word!", "warning");
    return;
  }

  const btnConfirm = document.getElementById("btnConfirmExportWord");
  const btnExport = document.getElementById("btnExportWord");
  if (btnConfirm) {
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = "⏳ Đang tạo file Word...";
  } else if (btnExport) {
    btnExport.disabled = true;
    btnExport.innerHTML = "⏳ Đang tạo file Word...";
  }

  try {
    // Sắp xếp dữ liệu theo trình tự thời gian tuần (Thứ Hai -> Chủ Nhật, sáng -> chiều) theo quy chuẩn hành chính
    const sorted = [...dataToExport].sort(compareScheduleChronological);

    const firstDate = customFirstDate || (sorted.length > 0 ? formatDisplayDate(sorted[0].date) : "");
    const lastDate = customLastDate || (sorted.length > 0 ? formatDisplayDate(sorted[sorted.length - 1].date) : "");
    const today = new Date();
    const curDay = String(today.getDate()).padStart(2, '0');
    const curMonth = String(today.getMonth() + 1).padStart(2, '0');
    const curYear = today.getFullYear();

    // 1. Kiểm tra nếu thư viện docx đã được nạp
    if (window.docx) {
      await generateDocxWithLibrary(sorted, firstDate, lastDate, curDay, curMonth, curYear);
    } else {
      // 2. Chế độ Fallback: Xuất file Word XML chuẩn MSO tương thích 100% Word mọi phiên bản
      generateDocxXmlFallback(sorted, firstDate, lastDate, curDay, curMonth, curYear);
    }

    showToast("Đã xuất file Lịch tuần Word (.docx) chuẩn Nghị định 30 thành công!", "success");
    closeExportWordModal();
  } catch (error) {
    console.error("Lỗi khi xuất Word:", error);
    // Nếu tạo thư viện bị lỗi thì dùng fallback
    generateDocxXmlFallback(dataToExport, customFirstDate, customLastDate, "", "", "");
    showToast("Đã tải file Word Lịch tuần thành công!", "success");
    closeExportWordModal();
  } finally {
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.innerHTML = `
        <svg class="btn-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <span>Tải file Word (.docx)</span>
      `;
    }
    if (btnExport) {
      btnExport.disabled = false;
      btnExport.innerHTML = `
        <svg class="btn-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <span><strong>Xuất Lịch tuần Word</strong></span>
      `;
    }
  }
}

/**
 * Tách chuỗi thành các TextRun trong file Word .docx và làm màu đỏ cho các từ khóa:
 * "chi nhánh 23", "chi nhánh số 23", "CN23", "CN 23", "23"
 */
function createRedHighlightTextRuns(text, baseOptions, TextRun) {
  if (!text) return [new TextRun({ text: "", ...baseOptions })];
  const str = String(text);
  const regex = /(chi nhánh(?: số)? 23|cn\s*23|23)/gi;
  const parts = str.split(regex);
  if (parts.length <= 1) {
    return [new TextRun({ text: str, ...baseOptions })];
  }
  const runs = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    const isRed = /(?:chi nhánh(?: số)? 23|cn\s*23|^23$)/i.test(part);
    runs.push(new TextRun({
      ...baseOptions,
      text: part,
      color: isRed ? "FF0000" : (baseOptions.color || undefined),
      bold: isRed ? true : (baseOptions.bold || false)
    }));
  }
  return runs;
}

/**
 * Định dạng HTML với màu đỏ cho các từ khóa khi xuất Word Fallback
 */
function formatCellHtmlWithRedHighlight(text) {
  if (!text) return "";
  const escaped = escapeHtml(String(text));
  return escaped.replace(/(chi nhánh(?: số)? 23|cn\s*23|23)/gi, '<span style="color: #ff0000; font-weight: bold;">$1</span>');
}

/**
 * Tạo file Word .docx dùng thư viện docx (Chuẩn toàn diện NĐ 30/2020)
 */
async function generateDocxWithLibrary(data, firstDate, lastDate, day, month, year) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    HeightRule
  } = window.docx;

  // Đường viền bảng
  const tableBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" }
  };

  const noBorders = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE },
    insideVertical: { style: BorderStyle.NONE }
  };

  // Header Table (2 cột: Trái 38% - Đơn vị, Phải 62% - Quốc hiệu & Tiêu ngữ chuẩn NĐ 30 không rớt dòng chữ Việt Nam)
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3550, 5805],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          // Cột trái: Tên cơ quan (Không có Sở TNMT theo file mẫu)
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            margins: { top: 0, bottom: 0, left: 10, right: 10 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI", size: 24, font: "Times New Roman" }),
                  new TextRun({ text: " THÀNH PHỐ HỒ CHÍ MINH", size: 24, font: "Times New Roman" })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "CHI NHÁNH SỐ 23", bold: true, color: "FF0000", size: 24, font: "Times New Roman" })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "————————", bold: true, size: 17, font: "Times New Roman" })
                ]
              })
            ]
          }),
          // Cột phải: Quốc hiệu & Tiêu ngữ (Rộng 62%, Cỡ chữ 12pt = size 24 chuẩn NĐ30 tuyệt đối không rớt dòng chữ Việt Nam)
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            margins: { top: 0, bottom: 0, left: 10, right: 10 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24, font: "Times New Roman" })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 26, font: "Times New Roman" })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "——————————————————", bold: true, size: 17, font: "Times New Roman" })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `Thủ Dầu Một, ngày ${day} tháng ${month} năm ${year}`, italics: true, size: 26, font: "Times New Roman" })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // Hàng tiêu đề bảng Lịch công tác
  const tableHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "STT", bold: true, size: 24, font: "Times New Roman" })] })]
      }),
      new TableCell({
        width: { size: 16, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Thứ / Ngày", bold: true, size: 24, font: "Times New Roman" })] })]
      }),
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Thời gian", bold: true, size: 24, font: "Times New Roman" })] })]
      }),
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Nội dung công tác", bold: true, size: 24, font: "Times New Roman" })] })]
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Thành phần", bold: true, size: 24, font: "Times New Roman" })] })]
      }),
      new TableCell({
        width: { size: 16, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Địa điểm", bold: true, size: 24, font: "Times New Roman" })] })]
      })
    ]
  });

  // Hàng dữ liệu
  const tableDataRows = data.map((item, index) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), size: 24, font: "Times New Roman" })] })]
        }),
        new TableCell({
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.dayOfWeek || "", bold: true, size: 24, font: "Times New Roman" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formatDisplayDate(item.date), size: 22, font: "Times New Roman" })] })
          ]
        }),
        new TableCell({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formatDisplayTime(item.time), bold: true, size: 24, font: "Times New Roman" })] })]
        }),
        new TableCell({
          children: [new Paragraph({ children: createRedHighlightTextRuns(item.content || "", { size: 24, font: "Times New Roman" }, TextRun) })]
        }),
        new TableCell({
          children: [new Paragraph({ children: createRedHighlightTextRuns(item.attendees || "", { size: 24, font: "Times New Roman" }, TextRun) })]
        }),
        new TableCell({
          children: [new Paragraph({ children: createRedHighlightTextRuns(item.location || "", { size: 24, font: "Times New Roman" }, TextRun) })]
        })
      ]
    });
  });

  const mainScheduleTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [tableHeaderRow, ...tableDataRows]
  });

  // Bảng Ký duyệt cuối văn bản (Giám đốc Nguyễn Chiến Thắng)
  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Nơi nhận:", bold: true, italics: true, size: 24, font: "Times New Roman" })]
              }),
              new Paragraph({
                children: [new TextRun({ text: "- Ban Giám đốc VPĐK;", size: 22, font: "Times New Roman" })]
              }),
              new Paragraph({
                children: [new TextRun({ text: "- Các Tổ chuyên môn;", size: 22, font: "Times New Roman" })]
              }),
              new Paragraph({
                children: [new TextRun({ text: "- Lưu: VT, TH.", size: 22, font: "Times New Roman" })]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "GIÁM ĐỐC", bold: true, size: 26, font: "Times New Roman" })]
              }),
              new Paragraph({ text: "" }),
              new Paragraph({ text: "" }),
              new Paragraph({ text: "" }),
              new Paragraph({ text: "" }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Nguyễn Chiến Thắng", bold: true, size: 26, font: "Times New Roman" })]
              })
            ]
          })
        ]
      })
    ]
  });

  // Tạo toàn bộ văn bản docx
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,    // 20mm
              bottom: 1134, // 20mm
              left: 1701,   // 30mm
              right: 850    // 15mm
            }
          }
        },
        children: [
          headerTable,
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "LỊCH CÔNG TÁC TUẦN", bold: true, size: 30, font: "Times New Roman" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `(Từ ngày ${firstDate} đến ngày ${lastDate})`, italics: true, size: 26, font: "Times New Roman" })
            ]
          }),
          new Paragraph({ text: "" }),
          mainScheduleTable,
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          signTable
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Lich_Tuan_VPDK_${firstDate.replace(/\//g, "-")}_den_${lastDate.replace(/\//g, "-")}.docx`;
  
  if (window.saveAs) {
    window.saveAs(blob, fileName);
  } else {
    downloadBlob(blob, fileName);
  }
}

/**
 * Fallback tạo file Word chất lượng cao tương thích 100% Microsoft Word
 */
function generateDocxXmlFallback(data, firstDate, lastDate, day, month, year) {
  const fDate = firstDate || (data[0] ? data[0].date : "");
  const lDate = lastDate || (data[data.length - 1] ? data[data.length - 1].date : "");
  const d = day || new Date().getDate();
  const m = month || (new Date().getMonth() + 1);
  const y = year || new Date().getFullYear();

  let rowsHtml = data.map((item, index) => {
    return `
      <tr>
        <td style="text-align: center; font-size: 13pt; padding: 6px; border: 1px solid #000;">${index + 1}</td>
        <td style="text-align: center; font-size: 13pt; padding: 6px; border: 1px solid #000;">
          <strong>${item.dayOfWeek || ""}</strong><br/>
          <span>${formatDisplayDate(item.date)}</span>
        </td>
        <td style="text-align: center; font-size: 13pt; font-weight: bold; padding: 6px; border: 1px solid #000;">${formatDisplayTime(item.time)}</td>
        <td style="font-size: 13pt; padding: 6px; border: 1px solid #000;">${formatCellHtmlWithRedHighlight(item.content)}</td>
        <td style="font-size: 13pt; padding: 6px; border: 1px solid #000;">${formatCellHtmlWithRedHighlight(item.attendees)}</td>
        <td style="font-size: 13pt; padding: 6px; border: 1px solid #000;">${formatCellHtmlWithRedHighlight(item.location)}</td>
      </tr>
    `;
  }).join("");

  const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Lịch Công Tác Tuần</title>
      <style>
        @page {
          size: 210mm 297mm;
          margin: 20mm 15mm 20mm 30mm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 13pt;
          line-height: 1.25;
          color: #000;
        }
        table { border-collapse: collapse; width: 100%; }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
      </style>
    </head>
    <body>
      <!-- Header Table -->
      <table style="width: 100%; border: none; margin-bottom: 20px;">
        <tr>
          <td style="width: 38%; text-align: center; vertical-align: top; border: none; padding: 0 4px;">
            <div style="font-size: 12pt; line-height: 1.25;">VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI THÀNH PHỐ HỒ CHÍ MINH</div>
            <div style="font-size: 12pt; font-weight: bold; line-height: 1.25; color: #ff0000;">CHI NHÁNH SỐ 23</div>
            <div style="font-size: 8.5pt; font-weight: bold; margin-top: -2px;">————————</div>
          </td>
          <td style="width: 62%; text-align: center; vertical-align: top; border: none; padding: 0 4px;">
            <div style="font-size: 12pt; font-weight: bold; white-space: nowrap; line-height: 1.25;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div style="font-size: 13pt; font-weight: bold; white-space: nowrap; line-height: 1.25;">Độc lập - Tự do - Hạnh phúc</div>
            <div style="font-size: 8.5pt; font-weight: bold; margin-top: -2px;">——————————————————</div>
            <div style="font-size: 13pt; font-style: italic; margin-top: 4px; line-height: 1.25;">Thủ Dầu Một, ngày ${d} tháng ${m} năm ${y}</div>
          </td>
        </tr>
      </table>

      <!-- Tiêu đề -->
      <div style="text-align: center; margin: 15px 0 5px 0;">
        <span style="font-size: 15pt; font-weight: bold;">LỊCH CÔNG TÁC TUẦN</span>
      </div>
      <div style="text-align: center; font-style: italic; font-size: 13pt; margin-bottom: 18px;">
        (Từ ngày ${fDate} đến ngày ${lDate})
      </div>

      <!-- Bảng lịch công tác -->
      <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="width: 5%; border: 1px solid #000; padding: 6px; font-size: 13pt; text-align: center;">STT</th>
            <th style="width: 15%; border: 1px solid #000; padding: 6px; font-size: 13pt; text-align: center;">Thứ / Ngày</th>
            <th style="width: 12%; border: 1px solid #000; padding: 6px; font-size: 13pt; text-align: center;">Thời gian</th>
            <th style="width: 32%; border: 1px solid #000; padding: 6px; font-size: 13pt; text-align: center;">Nội dung công tác</th>
            <th style="width: 18%; border: 1px solid #000; padding: 6px; font-size: 13pt; text-align: center;">Thành phần</th>
            <th style="width: 18%; border: 1px solid #000; padding: 6px; font-size: 13pt; text-align: center;">Địa điểm</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <!-- Ký duyệt cuối trang -->
      <table style="width: 100%; border: none; margin-top: 30px;">
        <tr>
          <td style="width: 50%; vertical-align: top; border: none;">
            <div style="font-weight: bold; font-style: italic; font-size: 12pt;">Nơi nhận:</div>
            <div style="font-size: 11pt;">- Ban Giám đốc VPĐK;</div>
            <div style="font-size: 11pt;">- Các Tổ chuyên môn;</div>
            <div style="font-size: 11pt;">- Lưu: VT, TH.</div>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
            <div style="font-weight: bold; font-size: 13pt;">GIÁM ĐỐC</div>
            <div style="height: 60px;"></div>
            <div style="font-weight: bold; font-size: 13pt;">Nguyễn Chiến Thắng</div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
  const fileName = `Lich_Tuan_VPDK_${fDate.replace(/\//g, "-")}_den_${lDate.replace(/\//g, "-")}.doc`;
  downloadBlob(blob, fileName);
}

function downloadBlob(blob, fileName) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ==================== CẤU HÌNH GOOGLE APPS SCRIPT URL ====================
function saveGoogleScriptConfig() {
  const url = document.getElementById("googleScriptUrlInput").value.trim();
  if (url && !url.startsWith("https://script.google.com/macros/s/")) {
    showToast("URL Google Apps Script chưa đúng định dạng!", "warning");
    return;
  }

  googleScriptUrl = url;
  localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, url);

  document.getElementById("configModal").style.display = "none";
  showToast("Đã lưu URL cấu hình Server thành công!", "success");
  updateSyncBanner();

  if (url) {
    loadScheduleList(true);
  }
}

async function testGoogleScriptConnection() {
  const url = document.getElementById("googleScriptUrlInput").value.trim();
  if (!url) {
    showToast("Vui lòng nhập đường link Server API trước!", "warning");
    return;
  }

  updateConnectionStatusUI(false, "Đang kết nối...");
  try {
    const response = await fetch(`${url}?action=getSchedule`);
    const result = await response.json();
    if (result.success !== undefined) {
      updateConnectionStatusUI(true, "Kết nối Server thành công!");
      showToast("Kết nối Server thành công!", "success");
    } else {
      updateConnectionStatusUI(false, "Không thể kết nối đến Server");
    }
  } catch (error) {
    updateConnectionStatusUI(false, "Lỗi kết nối Server: " + error.message);
  }
}

function updateConnectionStatusUI(isConnected, text) {
  const dot = document.getElementById("statusDot");
  const textEl = document.getElementById("statusText");
  if (!dot || !textEl) return;

  dot.className = isConnected ? "status-indicator connected" : "status-indicator error";
  textEl.textContent = text;
}

// ==================== TIỆN ÍCH HỖ TRỢ ====================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease-in";
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3500);
}

function formatCurrentTimestamp() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${mi}:${s}`;
}

function convertDDMMYYYYtoYYYYMMDD(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  const formatted = formatDisplayDate(ddmmyyyy);
  const parts = formatted.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return formatted;
}

/**
 * Chuẩn hóa ngày hiển thị: Chuyển chuỗi ISO hoặc DD/MM/YYYY thành dạng chuẩn DD/MM/YYYY
 */
function formatDisplayDate(dateVal) {
  if (!dateVal) return "";
  const str = String(dateVal).trim();
  // Nếu đã là dạng DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
    const p = str.split("/");
    return `${p[0].padStart(2, '0')}/${p[1].padStart(2, '0')}/${p[2]}`;
  }
  // Nếu là chuỗi ISO UTC từ Google Sheets (ví dụ: 2026-10-19T17:00:00.000Z)
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      // Giờ Việt Nam là UTC+7
      const vnTime = new Date(d.getTime() + 7 * 60 * 60 * 1000);
      const day = String(vnTime.getUTCDate()).padStart(2, '0');
      const month = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
      const year = vnTime.getUTCFullYear();
      return `${day}/${month}/${year}`;
    }
  }
  // Nếu là dạng YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parts = str.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return str;
}

/**
 * Chuẩn hóa 1 mốc thời gian: Chuyển chuỗi ISO hoặc HH:mm thành dạng chuẩn 24h (HH:mm)
 * Xử lý triệt để lỗi lệch giờ 7:23, 8:23 do mốc năm 1899 của Google Apps Script (GMT+07:06:40)
 */
function formatSingleTime(timeVal) {
  if (!timeVal) return "";
  const str = String(timeVal).trim();
  // Nếu đã là dạng HH:mm hoặc HH:mm:ss
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(str)) {
    const p = str.split(":");
    return `${p[0].padStart(2, '0')}:${p[1].padStart(2, '0')}`;
  }
  // Nếu là chuỗi ISO từ Google Sheets (ví dụ: 1899-12-30T01:23:20.000Z hoặc 1899-12-30T00:23:20.000Z)
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      // Bù trừ chuẩn: Mốc thời gian năm 1899 từ Google Apps Script bị lệch 6 phút 40 giây (LMT GMT+07:06:40)
      const isHistorical = d.getUTCFullYear() < 1910;
      const offsetMs = isHistorical ? (7 * 3600 + 6 * 60 + 40) * 1000 : 7 * 3600 * 1000;
      const vnTime = new Date(d.getTime() + offsetMs);
      const roundedMinutes = Math.round(vnTime.getUTCMinutes() + vnTime.getUTCSeconds() / 60);
      let hours = vnTime.getUTCHours() + Math.floor(roundedMinutes / 60);
      let minutes = roundedMinutes % 60;
      if (hours >= 24) hours = hours % 24;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  }
  return str;
}

/**
 * Chuẩn hóa giờ hiển thị: Hỗ trợ cả khoảng thời gian (HH:mm - HH:mm) hoặc mốc đơn (HH:mm)
 */
function formatDisplayTime(timeVal) {
  if (!timeVal) return "";
  const str = String(timeVal).trim();
  if (str.includes(" - ")) {
    const parts = str.split(" - ");
    const startFormatted = formatSingleTime(parts[0]);
    const endFormatted = formatSingleTime(parts[1]);
    return `${startFormatted} - ${endFormatted}`;
  }
  return formatSingleTime(str);
}

function escapeHtml(string) {
  if (!string) return "";
  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}
