@echo off
:: ===============================================================================
:: CÔNG CỤ TỰ ĐỘNG CÀI ĐẶT PHÍM TẮT CỔNG DỊCH VỤ NỘI BỘ - CHI NHÁNH SỐ 23
:: - Mở trực tiếp bằng Google Chrome hoặc Microsoft Edge
:: - Biểu tượng Pikachu Vàng nổi bật nhất Desktop (Chống bấm nhầm, giao diện thân thiện)
:: ===============================================================================
chcp 65001 >nul
title Cài đặt Phím tắt Cổng Dịch Vụ Pikachu Vàng - Chi Nhánh 23
color 0E

echo.
echo ===============================================================================
echo       CỔNG DỊCH VỤ NỘI BỘ - VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI CHI NHÁNH SỐ 23
echo               (Hệ thống Lịch Tuần & Tiếp nhận IT Helpdesk)
echo ===============================================================================
echo.
echo [*] BƯỚC 1: Đang thiết lập Biểu tượng Pikachu Vàng nổi bật (chống bấm nhầm)...

:: Tạo thư mục lưu Icon ứng dụng trong LocalAppData của cán bộ
set "APP_DIR=%LOCALAPPDATA%\VPDK23"
if not exist "%APP_DIR%" mkdir "%APP_DIR%" 2>nul
set "ICON_FILE=%APP_DIR%\pikachu.ico"

:: Ưu tiên 1: Lấy icon pikachu.ico có sẵn trong cùng thư mục (khi giải nén zip)
if exist "%~dp0pikachu.ico" (
    copy /y "%~dp0pikachu.ico" "%ICON_FILE%" >nul 2>&1
)

:: Ưu tiên 2: Tải trực tiếp từ máy chủ GitHub chính thức
if not exist "%ICON_FILE%" (
    curl -s -L "https://raw.githubusercontent.com/QuanDo610/vpdk-cn23/main/pikachu.ico" -o "%ICON_FILE%" 2>nul
)

:: Ưu tiên 3: Nếu có icon badge trong thư mục
if not exist "%ICON_FILE%" (
    if exist "%~dp0pikachu_badge.ico" (
        copy /y "%~dp0pikachu_badge.ico" "%ICON_FILE%" >nul 2>&1
    )
)

:: Ưu tiên 4: Icon huy hiệu cũ dự phòng
if not exist "%ICON_FILE%" (
    if exist "%~dp0vpdk23.ico" (
        copy /y "%~dp0vpdk23.ico" "%ICON_FILE%" >nul 2>&1
    )
)

:: Ưu tiên 5: Icon hệ thống Windows
if not exist "%ICON_FILE%" (
    set "ICON_FILE=%SystemRoot%\System32\shell32.dll,220"
    echo   [!] Tạm thời dùng biểu tượng hệ thống Windows.
) else (
    echo   [OK] Đã thiết lập thành công Biểu tượng Pikachu Vàng rực rỡ, sắc nét.
)

echo.
echo [*] BƯỚC 2: Đang tự động dò tìm trình duyệt Google Chrome hoặc Microsoft Edge...

set "BROWSER_EXE="
set "BROWSER_NAME="

:: Dò tìm Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
    set "BROWSER_NAME=Google Chrome"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
    set "BROWSER_NAME=Google Chrome"
) else if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_EXE=%LocalAppData%\Google\Chrome\Application\chrome.exe"
    set "BROWSER_NAME=Google Chrome"
)

:: Nếu không có Chrome, tự động chuyển sang Microsoft Edge (mặc định 100% trên Win 10/11)
if not defined BROWSER_EXE (
    if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
        set "BROWSER_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
        set "BROWSER_NAME=Microsoft Edge"
    ) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
        set "BROWSER_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
        set "BROWSER_NAME=Microsoft Edge"
    )
)

:: Dò tìm bằng lệnh where nếu cài ở ổ đĩa khác
if not defined BROWSER_EXE (
    for /f "delims=" %%i in ('where chrome.exe 2^>nul') do (
        set "BROWSER_EXE=%%i"
        set "BROWSER_NAME=Google Chrome"
    )
)
if not defined BROWSER_EXE (
    for /f "delims=" %%i in ('where msedge.exe 2^>nul') do (
        set "BROWSER_EXE=%%i"
        set "BROWSER_NAME=Microsoft Edge"
    )
)

if not defined BROWSER_EXE (
    set "BROWSER_EXE=%SystemRoot%\explorer.exe"
    set "BROWSER_NAME=Trình duyệt mặc định"
)

echo   [OK] Trình duyệt chuyên dụng: %BROWSER_NAME%

echo.
echo [*] BƯỚC 3: Đang khởi tạo Lối tắt (Shortcut .lnk) Pikachu ngoài Desktop...

set "TARGET_URL=https://quando610.github.io/vpdk-cn23/index.html"

:: Gọi PowerShell tạo Shortcut chuẩn Windows LNK có Icon Pikachu
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $desktop = [Environment]::GetFolderPath('Desktop'); ^
   $name = 'Cổng Dịch Vụ - Chi Nhánh 23.lnk'; ^
   $p1 = Join-Path $desktop $name; ^
   function MakeLnk($dest) { ^
       $s = $ws.CreateShortcut($dest); ^
       $s.TargetPath = '%BROWSER_EXE%'; ^
       $s.Arguments = '%TARGET_URL%'; ^
       $s.IconLocation = '%ICON_FILE%'; ^
       $s.Description = 'Cổng Dịch Vụ Nội Bộ - Văn Phòng Đăng Ký Đất Đai Chi Nhánh 23'; ^
       $s.WorkingDirectory = [System.IO.Path]::GetDirectoryName('%BROWSER_EXE%'); ^
       $s.Save(); ^
   }; ^
   MakeLnk($p1); ^
   Write-Host '   -> Da tao Shortcut Pikachu thanh cong tai:' $p1 -ForegroundColor Yellow; ^
   if (Test-Path "$env:USERPROFILE\Desktop") { ^
       $p2 = Join-Path "$env:USERPROFILE\Desktop" $name; ^
       if ($p2 -ne $p1) { MakeLnk($p2); } ^
   }; ^
   if (Test-Path "$env:USERPROFILE\OneDrive\Desktop") { ^
       $p3 = Join-Path "$env:USERPROFILE\OneDrive\Desktop" $name; ^
       if ($p3 -ne $p1) { MakeLnk($p3); } ^
   }; ^
   Remove-Item "$desktop\Cổng Dịch Vụ - Chi Nhánh 23.url" -ErrorAction SilentlyContinue; ^
   Remove-Item "$desktop\Cong Dich Vu - Chi Nhanh 23.url" -ErrorAction SilentlyContinue;"

echo.
echo ===============================================================================
echo  [V] HOÀN TẤT THÀNH CÔNG!
echo      - Biểu tượng Pikachu Vàng nổi bật đã được đặt ngoài Màn hình Desktop.
echo      - Cố định mở chuyên dụng qua: %BROWSER_NAME%.
echo ===============================================================================
echo.
echo [*] Đang tự động mở Cổng dịch vụ lần đầu bằng %BROWSER_NAME%...
start "" "%BROWSER_EXE%" "%TARGET_URL%"

echo.
echo -------------------------------------------------------------------------------
echo  HƯỚNG DẪN DÀNH CHO CÁN BỘ:
echo  1. Hằng ngày, cán bộ chỉ cần bấm đúp vào biểu tượng "Pikachu Vàng"
echo     có tên "Cổng Dịch Vụ - Chi Nhánh 23" trên màn hình Desktop.
echo  2. Đăng nhập bằng Số CCCD (12 số) và Mật khẩu được cấp.
echo -------------------------------------------------------------------------------
echo.
echo Nhấn phím bất kỳ để đóng cửa sổ này...
pause >nul
exit /b
