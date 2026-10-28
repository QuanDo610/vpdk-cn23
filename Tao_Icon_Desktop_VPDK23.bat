@echo off
:: ======================================================================
:: CÔNG CỤ TỰ ĐỘNG TẠO BIỂU TƯỢNG CỔNG DỊCH VỤ - CHI NHÁNH SỐ 23 TRÊN DESKTOP
:: ======================================================================
chcp 65001 >nul
title Cài đặt Phím tắt Cổng Dịch Vụ - Chi Nhánh 23
color 0B

echo.
echo ===============================================================================
echo       CỔNG DỊCH VỤ NỘI BỘ - VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI CHI NHÁNH SỐ 23
echo                 (Hệ thống Lịch Tuần & Tiếp nhận IT Helpdesk)
echo ===============================================================================
echo.
echo [*] Đang tìm kiếm thư mục Màn hình chính (Desktop)...

:: 1. Xác định chính xác đường dẫn Desktop (hỗ trợ cả máy dùng OneDrive đồng bộ)
set "DESKTOP_DIR="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" /v Desktop 2^>nul') do set "DESKTOP_DIR=%%b"
if defined DESKTOP_DIR (
    call set "DESKTOP_DIR=%DESKTOP_DIR%"
) else (
    set "DESKTOP_DIR=%USERPROFILE%\Desktop"
)

if not exist "%DESKTOP_DIR%" (
    if exist "%USERPROFILE%\Desktop" (
        set "DESKTOP_DIR=%USERPROFILE%\Desktop"
    ) else if exist "%USERPROFILE%\OneDrive\Desktop" (
        set "DESKTOP_DIR=%USERPROFILE%\OneDrive\Desktop"
    )
)

echo [*] Vị trí Desktop phát hiện: "%DESKTOP_DIR%"
echo.
echo [*] Đang tạo biểu tượng truy cập "Cổng Dịch Vụ - Chi Nhánh 23"...

:: 2. Khởi tạo nội dung file shortcut (.url)
set "TARGET_URL=https://quando610.github.io/vpdk-cn23/index.html"
set "ICON_PATH=%SystemRoot%\System32\shell32.dll"
set "ICON_NUM=14"

:: Tạo shortcut chính có dấu tiếng Việt tại Desktop được phát hiện
set "SHORTCUT_VN=%DESKTOP_DIR%\Cổng Dịch Vụ - Chi Nhánh 23.url"
(
    echo [InternetShortcut]
    echo URL=%TARGET_URL%
    echo IconFile=%ICON_PATH%
    echo IconIndex=%ICON_NUM%
) > "%SHORTCUT_VN%"

:: Tạo thêm shortcut dự phòng không dấu (tránh lỗi font trên một số máy Windows cũ)
set "SHORTCUT_EN=%DESKTOP_DIR%\Cong Dich Vu - Chi Nhanh 23.url"
if not exist "%SHORTCUT_VN%" (
    (
        echo [InternetShortcut]
        echo URL=%TARGET_URL%
        echo IconFile=%ICON_PATH%
        echo IconIndex=%ICON_NUM%
    ) > "%SHORTCUT_EN%"
)

:: Nếu máy có cả thư mục OneDrive\Desktop riêng, tạo thêm 1 bản để chắc chắn 100% hiển thị
if exist "%USERPROFILE%\OneDrive\Desktop" (
    if "%DESKTOP_DIR%" neq "%USERPROFILE%\OneDrive\Desktop" (
        (
            echo [InternetShortcut]
            echo URL=%TARGET_URL%
            echo IconFile=%ICON_PATH%
            echo IconIndex=%ICON_NUM%
        ) > "%USERPROFILE%\OneDrive\Desktop\Cổng Dịch Vụ - Chi Nhánh 23.url"
    )
)

:: Nếu máy có thư mục chuẩn %USERPROFILE%\Desktop riêng, tạo thêm 1 bản
if exist "%USERPROFILE%\Desktop" (
    if "%DESKTOP_DIR%" neq "%USERPROFILE%\Desktop" (
        (
            echo [InternetShortcut]
            echo URL=%TARGET_URL%
            echo IconFile=%ICON_PATH%
            echo IconIndex=%ICON_NUM%
        ) > "%USERPROFILE%\Desktop\Cổng Dịch Vụ - Chi Nhánh 23.url"
    )
)

echo.
echo ===============================================================================
echo  [V] HOÀN TẤT: ĐÃ TẠO THÀNH CÔNG BIỂU TƯỢNG TRUY CẬP TRÊN DESKTOP!
echo ===============================================================================
echo.
echo [*] Đang tự động mở Cổng dịch vụ lần đầu trên trình duyệt của bạn...
start "" "%TARGET_URL%"

echo.
echo -------------------------------------------------------------------------------
echo  LƯU Ý DÀNH CHO CÁN BỘ:
echo  1. Từ lần sau, bạn chỉ cần bấm đúp vào biểu tượng "Cổng Dịch Vụ - Chi Nhánh 23"
echo     ngay trên màn hình Desktop để vào làm việc.
echo  2. Đăng nhập bằng Số CCCD (12 số) và Mật khẩu đã được cấp.
echo -------------------------------------------------------------------------------
echo.
echo Nhấn phím bất kỳ để đóng cửa sổ này...
pause >nul
