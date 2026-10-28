@echo off
:: ===============================================================================
:: CỔNG DỊCH VỤ NỘI BỘ - VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI CHI NHÁNH SỐ 23
:: - Mở trực tiếp bằng Google Chrome hoặc Microsoft Edge
:: - Biểu tượng Pikachu Đeo Kính Vuông Nổi Bật (Chống bấm nhầm 100%)
:: - Tên Shortcut Desktop: "Family CN23"
:: ===============================================================================
chcp 65001 >nul
title Cài đặt Phím tắt "Family CN23" Pikachu Kính Vuông
color 0E

echo.
echo ===============================================================================
echo            FAMILY CN23 - VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI CHI NHÁNH SỐ 23
echo                 (Hệ thống Lịch Tuần & Tiếp nhận IT Helpdesk)
echo ===============================================================================
echo.
echo [*] BƯỚC 1: Đang thiết lập Biểu tượng Pikachu Kính Vuông nổi bật...

:: Tạo thư mục lưu Icon ứng dụng trong LocalAppData của cán bộ
set "APP_DIR=%LOCALAPPDATA%\VPDK23"
if not exist "%APP_DIR%" mkdir "%APP_DIR%" 2>nul

:: Ưu tiên 1: Icon Badge Pikachu Kính Vuông nền xanh viền vàng (Mẫu chính thức)
set "ICON_FILE=%APP_DIR%\pikachu_badge.ico"

if exist "%~dp0pikachu_badge.ico" (
    copy /y "%~dp0pikachu_badge.ico" "%ICON_FILE%" >nul 2>&1
)

:: Ưu tiên 2: Tải trực tiếp từ máy chủ GitHub chính thức
if not exist "%ICON_FILE%" (
    curl -s -L "https://raw.githubusercontent.com/QuanDo610/vpdk-cn23/main/pikachu_badge.ico" -o "%ICON_FILE%" 2>nul
)

:: Ưu tiên 3: Icon pikachu.ico có sẵn
if not exist "%ICON_FILE%" (
    if exist "%~dp0pikachu.ico" (
        copy /y "%~dp0pikachu.ico" "%ICON_FILE%" >nul 2>&1
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
    echo   [OK] Đã thiết lập thành công Biểu tượng Pikachu Đeo Kính Vuông sắc nét.
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
echo [*] BƯỚC 3: Đang khởi tạo Lối tắt "Family CN23" ngoài Desktop...

set "TARGET_URL=https://quando610.github.io/vpdk-cn23/index.html"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $desktop = [Environment]::GetFolderPath('Desktop'); ^
   $name = 'Family CN23.lnk'; ^
   $p1 = Join-Path $desktop $name; ^
   function MakeLnk($dest) { ^
       $s = $ws.CreateShortcut($dest); ^
       $s.TargetPath = '%BROWSER_EXE%'; ^
       $s.Arguments = '%TARGET_URL%'; ^
       $s.IconLocation = '%ICON_FILE%'; ^
       $s.Description = 'Family CN23 - Cổng Dịch Vụ Nội Bộ Chi Nhánh 23'; ^
       $s.WorkingDirectory = [System.IO.Path]::GetDirectoryName('%BROWSER_EXE%'); ^
       $s.Save(); ^
   }; ^
   MakeLnk($p1); ^
   Write-Host '   -> Da tao Shortcut [Family CN23] thanh cong tai:' $p1 -ForegroundColor Yellow; ^
   if (Test-Path "$env:USERPROFILE\Desktop") { ^
       $p2 = Join-Path "$env:USERPROFILE\Desktop" $name; ^
       if ($p2 -ne $p1) { MakeLnk($p2); } ^
   }; ^
   if (Test-Path "$env:USERPROFILE\OneDrive\Desktop") { ^
       $p3 = Join-Path "$env:USERPROFILE\OneDrive\Desktop" $name; ^
       if ($p3 -ne $p1) { MakeLnk($p3); } ^
   }; ^
   Remove-Item "$desktop\Cổng Dịch Vụ - Chi Nhánh 23.lnk" -ErrorAction SilentlyContinue; ^
   Remove-Item "$desktop\Cổng Dịch Vụ - Chi Nhánh 23.url" -ErrorAction SilentlyContinue; ^
   Remove-Item "$desktop\Cong Dich Vu - Chi Nhanh 23.url" -ErrorAction SilentlyContinue; ^
   Remove-Item "$desktop\Family CN23.url" -ErrorAction SilentlyContinue;"

echo.
echo ===============================================================================
echo  [V] HOÀN TẤT THÀNH CÔNG!
echo      - Lối tắt [Family CN23] với icon Pikachu Kính Vuông đã được cài ngoài Desktop.
echo      - Cố định mở chuyên dụng qua: %BROWSER_NAME%.
echo ===============================================================================
echo.
echo [*] Đang tự động mở Family CN23 lần đầu bằng %BROWSER_NAME%...
start "" "%BROWSER_EXE%" "%TARGET_URL%"

echo.
echo -------------------------------------------------------------------------------
echo  HƯỚNG DẪN DÀNH CHO CÁN BỘ:
echo  1. Hằng ngày, cán bộ chỉ cần bấm đúp vào biểu tượng Pikachu "Family CN23"
echo     ngay trên màn hình Desktop.
echo  2. Đăng nhập bằng Số CCCD (12 số) và Mật khẩu được cấp.
echo -------------------------------------------------------------------------------
echo.
echo Nhấn phím bất kỳ để đóng cửa sổ này...
pause >nul
exit /b
