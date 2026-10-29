@echo off
:: ===============================================================================
:: CÔNG CỤ TỰ ĐỘNG CÀI ĐẶT PHÍM TẮT "FAMILY CN23" (PIKACHU KÍNH VUÔNG)
:: - Văn phòng Đăng ký đất đai - Chi nhánh số 23
:: - Chạy được từ mọi vị trí: Downloads, Desktop, ổ C, D, E, USB...
:: - Tự động định vị Desktop chính xác (hỗ trợ cả Windows thường & OneDrive)
:: - Biểu tượng Pikachu Đeo Kính Vuông rực rỡ, không bao giờ mất icon
:: ===============================================================================
chcp 65001 >nul
title Cài đặt Phím tắt "Family CN23" Pikachu Kính Vuông
color 0E

:: Chuyển thư mục làm việc về đúng nơi chứa file BAT (hỗ trợ mọi ổ đĩa C, D, E, mạng)
pushd "%~dp0"

echo.
echo ===============================================================================
echo            FAMILY CN23 - VĂN PHÒNG ĐĂNG KÝ ĐẤT ĐAI CHI NHÁNH SỐ 23
echo                 (Hệ thống Lịch Tuần & Tiếp nhận IT Helpdesk)
echo ===============================================================================
echo.
echo [*] BƯỚC 1: Đang thiết lập Biểu tượng Pikachu Kính Vuông vào hệ thống...

:: Tạo thư mục lưu Icon cố định trong LocalAppData của cán bộ (tránh mất icon khi xóa mục Downloads)
set "APP_DIR=%LOCALAPPDATA%\VPDK23"
if not exist "%APP_DIR%" mkdir "%APP_DIR%" 2>nul
set "ICON_FILE=%APP_DIR%\pikachu_badge.ico"

:: Ưu tiên 1: Copy icon có sẵn trong cùng thư mục giải nén
if exist "%~dp0pikachu_badge.ico" (
    copy /y "%~dp0pikachu_badge.ico" "%ICON_FILE%" >nul 2>&1
)

:: Ưu tiên 2: Copy icon pikachu.ico nếu có
if not exist "%ICON_FILE%" (
    if exist "%~dp0pikachu.ico" (
        copy /y "%~dp0pikachu.ico" "%ICON_FILE%" >nul 2>&1
    )
)

:: Ưu tiên 3: Tải từ máy chủ GitHub
if not exist "%ICON_FILE%" (
    curl -s -L "https://raw.githubusercontent.com/QuanDo610/vpdk-cn23/main/pikachu_badge.ico" -o "%ICON_FILE%" 2>nul
)

:: Ưu tiên 4: Giải mã từ dữ liệu nhúng sẵn bên trong file BAT (tự phục hồi 100% offline)
if not exist "%ICON_FILE%" (
    set "TEMP_B64=%TEMP%\pika_badge_%RANDOM%.b64"
    call :ExtractEmbeddedIcon "!TEMP_B64!"
    if exist "!TEMP_B64!" (
        certutil -decode "!TEMP_B64!" "%ICON_FILE%" >nul 2>&1
        del /f /q "!TEMP_B64!" 2>nul
    )
)

:: Kiểm tra kết quả thiết lập icon
if exist "%ICON_FILE%" (
    echo   [OK] Biểu tượng Pikachu Kính Vuông đã sẵn sàng tại:
    echo        %ICON_FILE%
) else (
    set "ICON_FILE=%SystemRoot%\System32\shell32.dll,220"
    echo   [!] Tạm thời dùng biểu tượng hệ thống Windows.
)

echo.
echo [*] BƯỚC 2: Đang tự động dò tìm trình duyệt web trên máy tính...

set "BROWSER_EXE="
set "BROWSER_NAME="

:: 1. Dò tìm Google Chrome
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

:: 2. Dò tìm Microsoft Edge (mặc định có sẵn 100% trên Win 10/11)
if not defined BROWSER_EXE (
    if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
        set "BROWSER_EXE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
        set "BROWSER_NAME=Microsoft Edge"
    ) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
        set "BROWSER_EXE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
        set "BROWSER_NAME=Microsoft Edge"
    ) else if exist "%LocalAppData%\Microsoft\Edge\Application\msedge.exe" (
        set "BROWSER_EXE=%LocalAppData%\Microsoft\Edge\Application\msedge.exe"
        set "BROWSER_NAME=Microsoft Edge"
    )
)

:: 3. Dò tìm Cốc Cốc (rất phổ biến tại cơ quan)
if not defined BROWSER_EXE (
    if exist "%LocalAppData%\CocCoc\Browser\Application\browser.exe" (
        set "BROWSER_EXE=%LocalAppData%\CocCoc\Browser\Application\browser.exe"
        set "BROWSER_NAME=Cốc Cốc"
    ) else if exist "%ProgramFiles%\CocCoc\Browser\Application\browser.exe" (
        set "BROWSER_EXE=%ProgramFiles%\CocCoc\Browser\Application\browser.exe"
        set "BROWSER_NAME=Cốc Cốc"
    )
)

:: 4. Dò tìm bằng lệnh where nếu cài ở ổ đĩa khác (D:\, E:\)
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
    for /f "delims=" %%i in ('where browser.exe 2^>nul') do (
        set "BROWSER_EXE=%%i"
        set "BROWSER_NAME=Cốc Cốc"
    )
)

:: Dự phòng trình duyệt mặc định
if not defined BROWSER_EXE (
    set "BROWSER_EXE=%SystemRoot%\explorer.exe"
    set "BROWSER_NAME=Trình duyệt mặc định hệ thống"
)

echo   [OK] Đã chọn trình duyệt chuyên dụng: %BROWSER_NAME%

echo.
echo [*] BƯỚC 3: Đang cài đặt Lối tắt "Family CN23" ra Màn hình Desktop...

set "TARGET_URL=https://quando610.github.io/vpdk-cn23/index.html"

:: Tạo script VBScript trung gian để tạo Shortcut (chuẩn 100%, không phụ thuộc PowerShell)
set "VBS_SCRIPT=%TEMP%\make_family23_%RANDOM%.vbs"

> "%VBS_SCRIPT%" echo Set ws = CreateObject("WScript.Shell")
>> "%VBS_SCRIPT%" echo Set fso = CreateObject("Scripting.FileSystemObject")
>> "%VBS_SCRIPT%" echo targetExe = "%BROWSER_EXE%"
>> "%VBS_SCRIPT%" echo targetUrl = "%TARGET_URL%"
>> "%VBS_SCRIPT%" echo iconFile  = "%ICON_FILE%"
>> "%VBS_SCRIPT%" echo createdCount = 0
>> "%VBS_SCRIPT%" echo Sub MakeLnk(fPath)
>> "%VBS_SCRIPT%" echo   On Error Resume Next
>> "%VBS_SCRIPT%" echo   If fso.FolderExists(fPath) Then
>> "%VBS_SCRIPT%" echo     lnkPath = fso.BuildPath(fPath, "Family CN23.lnk")
>> "%VBS_SCRIPT%" echo     Set s = ws.CreateShortcut(lnkPath)
>> "%VBS_SCRIPT%" echo     s.TargetPath = targetExe
>> "%VBS_SCRIPT%" echo     s.Arguments = targetUrl
>> "%VBS_SCRIPT%" echo     s.IconLocation = iconFile
>> "%VBS_SCRIPT%" echo     s.Description = "Family CN23 - Cổng Dịch Vụ Nội Bộ Chi Nhánh 23"
>> "%VBS_SCRIPT%" echo     s.WorkingDirectory = fso.GetParentFolderName(targetExe)
>> "%VBS_SCRIPT%" echo     s.Save
>> "%VBS_SCRIPT%" echo     If fso.FileExists(lnkPath) Then
>> "%VBS_SCRIPT%" echo       WScript.Echo "   -> Da tao tai: " ^& lnkPath
>> "%VBS_SCRIPT%" echo       createdCount = createdCount + 1
>> "%VBS_SCRIPT%" echo     End If
>> "%VBS_SCRIPT%" echo     ' Xoa loi tat cu tranh trung lap
>> "%VBS_SCRIPT%" echo     old1 = fso.BuildPath(fPath, "Cổng Dịch Vụ - Chi Nhánh 23.lnk")
>> "%VBS_SCRIPT%" echo     old2 = fso.BuildPath(fPath, "Cổng Dịch Vụ - Chi Nhánh 23.url")
>> "%VBS_SCRIPT%" echo     old3 = fso.BuildPath(fPath, "Cong Dich Vu - Chi Nhanh 23.url")
>> "%VBS_SCRIPT%" echo     old4 = fso.BuildPath(fPath, "Family CN23.url")
>> "%VBS_SCRIPT%" echo     If fso.FileExists(old1) Then fso.DeleteFile old1, True
>> "%VBS_SCRIPT%" echo     If fso.FileExists(old2) Then fso.DeleteFile old2, True
>> "%VBS_SCRIPT%" echo     If fso.FileExists(old3) Then fso.DeleteFile old3, True
>> "%VBS_SCRIPT%" echo     If fso.FileExists(old4) Then fso.DeleteFile old4, True
>> "%VBS_SCRIPT%" echo   End If
>> "%VBS_SCRIPT%" echo End Sub
>> "%VBS_SCRIPT%" echo ' 1. Desktop theo Windows SpecialFolders
>> "%VBS_SCRIPT%" echo MakeLnk ws.SpecialFolders("Desktop")
>> "%VBS_SCRIPT%" echo ' 2. Desktop theo UserProfile
>> "%VBS_SCRIPT%" echo MakeLnk ws.ExpandEnvironmentStrings("%USERPROFILE%\Desktop")
>> "%VBS_SCRIPT%" echo ' 3. Desktop theo OneDrive Backup (neu co)
>> "%VBS_SCRIPT%" echo MakeLnk ws.ExpandEnvironmentStrings("%USERPROFILE%\OneDrive\Desktop")

:: Thực thi VBScript
cscript //nologo "%VBS_SCRIPT%"
del /f /q "%VBS_SCRIPT%" 2>nul

:: Cập nhật ngay bộ nhớ đệm Icon của Windows Explorer để hiển thị hình Pikachu ngay lập tức
ie4uinit.exe -show 2>nul

echo.
echo ===============================================================================
echo  [V] HOÀN TẤT THÀNH CÔNG!
echo      - Biểu tượng Pikachu Kính Vuông "Family CN23" đã xuất hiện trên Desktop.
echo      - Cố định mở chuyên dụng qua: %BROWSER_NAME%.
echo ===============================================================================
echo.
echo [*] Đang tự động mở Family CN23 lần đầu bằng %BROWSER_NAME%...
start "" "%BROWSER_EXE%" "%TARGET_URL%"

echo.
echo -------------------------------------------------------------------------------
echo  HƯỚNG DẪN DÀNH CHO CÁN BỘ:
echo  1. Hằng ngày vào làm việc, chỉ cần bấm đúp vào biểu tượng Pikachu
echo     mang tên "Family CN23" ngay trên màn hình Desktop.
echo  2. Đăng nhập bằng Số CCCD (12 số) và Mật khẩu được cấp.
echo -------------------------------------------------------------------------------
echo.
echo Nhấn phím bất kỳ để đóng cửa sổ này...
popd
pause >nul
exit /b

:: ===============================================================================
:: SUBROUTINE: GIẢI MÃ DỮ LIỆU ICON PIKACHU NHÚNG SẴN (OFFLINE RECOVERY)
:: ===============================================================================
:ExtractEmbeddedIcon
set "OUT_B64=%~1"
(
echo -----BEGIN CERTIFICATE-----
echo AAABAAYAEBAAAAAAIACUAwAAZgAAACAgAAAAACAAwAkAAPoDAAAwMAAAAAAgAAIR
echo AAC6DQAAQEAAAAAAIADcGAAAvB4AAICAAAAAACAAST0AAJg3AAAAAAAAAAAgACGe
echo AADhdAAAiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADW0lEQVR4
echo nGVTXWhcRRT+Zu7cu7uaNN1klybZiqG1JLGtbUWEGq1QK7QolQYULBrwQSyiCKIv
echo gq1FrT74UMEHfx6U1CLUCAXzYERStbRFUvLWNGlMVlubv3bd5Obu3rn3zpwjd4MP
echo 4sAZznC+c/jmfOcIBoQA2AHw81D/plm1pQVw8f+TNO7N4ZT/6LNnZyyAtVxm8dfg
echo vtbjbe98ej3bs9+QzcEkaVT8J1+AoVwoR4V36ckfjy9/+FLp8PcVxULghTM/fDGV
echo f/hQPDUBIzyIfAckxY0aa1UYJD3w4jwUR00r3X39b9VecVmIp+Twyf57rusNT+hK
echo bMPR01HxzHPUjJApCODUfci6DwpW0SxCLg4NUPjTqSiqxPaGbj/w3Wf93fIqFwom
echo ImUqfzuZ7Y/xl0d9en79KVR9D1YnDav6GRxedxpfvb1M2R2Pc4o1kVV/hO0FSVHE
echo FGohgip81eXOYFfyYu/H4n7vMjl1n1Xd553uOB3pPSnKYkeSYlIs6RgUR6wAs/Zg
echo DYes88H5g/xg24j5vO91aY1sdEA6BL3qmxO/HGRptUMmAsm4oYuCAYgiMIVIDFAq
echo LGSyvOrkmioNnRrmQHDNkR2ZJTF5K4arNEhqwDFQSBIg0YiTHFqcJX6t531naLRj
echo ZSXeFD7UdalNgMW5q9uWS52EV7e8Vxif/5prUU6wGwGZBA2OHGqENUaXupa0luPg
echo /Nj2yqVrPRVlQR4Je2Gq9/bFsd5qazkJutR0kmKhw/T3aDDgMIIlDW9WU/Ngtzuw
echo barY9vKIO3bBzaSDcOLpb7sWPimZ/NlulX2kTrYpBNdTBgaKiIXRMTyziskkL//c
echo 6utd++dzTp7cG+gAWODulnJ244Gl5Ap74UTcmvPqAYyKYYyVMi/mVoTWRgQ1qtqM
echo e6T9GTtKxaA6q8I9fTNmT9/vJvVHbTFIY1XKqhSLKLQFXlwRfAzqyek3RiZqD+y1
echo eplim5FhbMNS7qbuzN6mtEdzuiBvhqVsznNynhORk10v781d/nV43Uf7RLol7w5s
echo 3HwxODQ4V9+wm1kKKQVi8pDQ2hy4kuDJGEQMIZg771z4bbc3PHD0m/K0+Hedj3Xg
echo jtmdW/cGtqkomNiRdk0iACkNSw5YSNHkBLfuG79y7s1FpFqIfwBCntedXnXMcAAA
echo AABJRU5ErkJggolQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgGAAAAc3p69AAACYdJ
echo REFUeJytVwmMnVUVPufe/73/7W+2zj7dpsO0FqxTi9B2iim0uKUGKa1ghAQFQTGR
echo xUQJhM64UIqJ0SiaUlnVtBRFI0FKCgbbYlk6UygdYGgp005n6TLLm3nvX++9x9z/
echo f7OBJJR4J/fln/z3P+e73znnO/cCfGDQpk0MiBgAwv9vIGibge0Pv5kam2gTa8d2
echo pVfJrTD7QOmXmseN0gRICUrSOSNiUYMScti+KLer27gBjksA2LBzA39y45P6MRg4
echo 8bBz5wa+ceOTkraWXvCr+s3tb/CWL+RiDQnJTM3LB7F+jBF+w5ULGafPXiIP7r5l
echo oK3NvKH/4ISvSQBEmxhiu+p4fO26P1Te8+eOeGvaKQhgwlaIQIT8XDcf7o4kEAEq
echo I85iCQNa3P3Wt0/99LrPXffsXyd8YvAAbTT0+8bFdzVse2UPuzSRdM8IROQQzyAp
echo BeDmAfHcGCAiADMFyDiAnSMikoXoLGMl7XHb+m9aUXfTu507d67nrA3agCPStrKb
echo N3cYn08k8gOCJBmgCCN7HpLmoaclYgSUL0D58mNOAfob881/ysi/H5QglSbDSBT6
echo RSdfaT6Svek+AoVdG3YSa0emxC/MeYfhs2ut0XFCKbiSBNweF2ef2EJ9P/86i3Y+
echo JSRPAHgukC+AxEdMXwRrJEtA9NA/RP+9G9mZ7ZuJWzmhbaKU3MmNURcsXX12S/o8
echo 7ZvpZHk2sez8HK820bNICYWhkbgyapvdk+MxvLVpB1aIAeX6DED4IYj/MfU7TzAo
echo EafU7Qu2Y/9YFI3a8zxpJKW2qW0zz6Ixo9p4KXPxBdp3UJc5P5MWkmkjFBjyPXAl
echo N0o/s8q9+7YaWr/O5t+pelQVLE5MfhQACfpdvmDQjRWPqa99Jc/vvqMGyltWOa7k
echo EfCL7PmCtK8xkUpr3wEApSSGNMrJCY7FRNNl/M47Zru6oK5q2sW/nH1ejtgJ4NID
echo EGLGZNKFETsOazP/ktcseoaTArjrjnpHLbyckeOwSdu+DFkUMshqFqSsAoDgZbgb
echo 5SuICAv67arEQ3ubLRRnQTHCTUsfwCp5QmmatTHfx2AGzwKhQvSp9pbfIjFClEPw
echo 8L4F1gmrOhkVhcDmdLYmBpssG72TII7hFK4PqZiM7Dh+OTlDnkfCh4qyXn7bgm3q
echo 9HCcmGtRqRwMpn4+NZykHzQ+pKoqjnMlfHCHbX/7e1+kdExFtK3pbAW+ZAjCCN1P
echo 7Z6YAAIMdCxm5OE9uzm1q2th/orWl8tkPgVfbXyelxhnZWN5HyszcwGNw26Gjp5t
echo UJfMeZ3LAgeeGoRdry3Lv+MsSlaa+cBvSDOBDk2QZ8VhFP1PlVcRgB7CJ8jEmbml
echo 89qxVQ2vOWWV4zGmEC9buNsAGQGgUCEzydM4d9bbDNwE6DY20sucLZ3XikxSxoTt
echo A02KWBGA3r2cBkDqV7LIwiQABAQJPpmQjELG1w3Jt4A8RuRx5EyLjV9UPQSpGCDY
echo hKDQ8xNoRo207wIY6E8U2wwGZBEBm8wBX06bxZr2ETLitHp87e2R6vohk6MDRsLC
echo SDwPjCxQvhNMRjZEYgUw4hZy5kBV/bD52Jrbo/pbbSOIezH5Ju3PDIEEgpkhYCih
echo 4GXh+02/VFHqNw53pqTlcuG5HppmFJY0jkWjWQqanhgHeKMr4wtF5HuCsumIUVfV
echo z6+vf1BsOfIjVhLNgSqGK2BAlzmq6UkIM5JQDwciUMePy6san2O9PRF46pW64QPH
echo F4yXz1ljJ9V+vuLoC3Pm1gmme07/6Yh88e3ZQ4f6Frur17QW/P3bKq5Z/nrdlfN3
echo sT8du1oOeeVaicLkVhQyEJ1ehlLnwJSmo/TAsjkszXZQVXWe6udxuzTtYtPcBnHJ
echo ymWFeeWjUUYkKtPKr0wrgcj8soQwli5ZUmhZWK2qy3JG3VzDqanNq6WZDtK2tM3p
echo fWNGEkJQhtOSEDWvAhIwWji9o8o/2VluDJagb5cOib89/pvo4oYz8TXLvUhTVSGm
echo GXAL0u04ZuYHe95RT5/ZFa/xo3Ty3vkOaxkWicRoBITIEuqzgU5CCgGYM3QAimXo
echo hwCIQBkemS8pdLJXOA29b9SsfytnnLh6P85eP5JVHhfNVb6h7EjwbVOl5OuXdGfQ
echo OFzW31ORq/5jKjU3nY1ZJasGEyPCVPM8Ik8gISuGQIayANN1IFBCDqBzgAgkCarM
echo 2bGGI3szZ2Nx+DRhqjYJfkOzE4cowuYHEP6y1wdd4utbI8adt1hp8Ah6zyinnDBl
echo 4RjUH9hdXzNruSd9QSAEAjIAFbI7gcCYCEFYKgYQ0xVKECOPPVOx0PnG6D7iORbp
echo rVN5c16euyMMuImwrAmgruebwJBBddMTIEYJpG5bswu8tyE7VnGCpUbSIJ6e9Skn
echo 5nsZGUjvNCWcngNKp6dQxRAovQzi0oKDkfnRrSua+r439+VysyHCKtJ2inymJQLW
echo tBBYdXsDI4lKAjcfildZ0k7TzYN5dkKO/+79i4deG22sLfMskPpwCAr0EU/pxleU
echo R0P/xJhto3BAeQyJhzqgf7NIsQcH1mVrak+OfyvdVQMGR5AGuIKBNQ6A6T7dMsAa
echo j6BhAJiGAuACk8nhxMPe4oGtg+uy2ZgfE56mPJRjJRlw4YGJ4/YkgFlW99Esnfal
echo P8cAEhprUbwFGEaq/Id7bh3ZcfA/719//r7Y8vr+bFXGjSdNZUyKPHPBtpnoGTPt
echo /Sdn5x453OocGF9RXpqNlJLvTPYWfcAWIsoycFqWud1HAgBEhF2L8e3my468cojP
echo a5WeL8OjbHiy1yAqUrz0Tac1+909F45kcWBofqpXzM+cwhLTCnRk1E2oY2NVdCzf
echo YOSoJh1PmLUVKcmEZ086D0OtVIQn+MLEux0lL44d1r4NaGvD899C74HW5+5fVtaw
echo /MWeRpaJ5KU+lk91RUFJBiyd4eVC1Zd3e/X05gB4klSQShwZj0YgGksCVjJ9i7JA
echo BBsPGdLNXR/Lc36KXTKnm+b5u+9f8TLa1NbGihcTQkRk993Y/ONXnSt/8mr/fOZ5
echo HnFUFJ4MJtUi+IdhYDr8Kza5CY0J101dIvQmJDGMRKN4YW0PXBT7e/ud27p+pgEh
echo 4tR9rwjCvOfqimuH46tvOzq+YNGoVwJC8U92TQ3uowAGU1ASHYXG1LHuWe4Lv27b
echo fuZRInK08+Ky6fsLQODCNCy4dGVZK0vVLhJgpGiqoZ8bBgRlgMiLQl/3vr0j+w7n
echo 4QgRqQnnHwIQgtD0Mioqlb6Zar39pHd17UifWlzd90LfM2IK/wXMwh/AK/ZGTwAA
echo AABJRU5ErkJggolQTkcNChoKAAAADUlIRFIAAAAwAAAAMAgGAAAAVwL5hwAAEMlJ
echo REFUeJy9WgmQlcWd/3V/1/veNfPezDAzwHAODDAcci2YqGhAF6MmlZjBUEbFaChN
echo Vaysm1V3cyDlbiqrG7PJWrtqqVl1V3QGd0k81wOVuCiC3FAQkJthhmHu99539bHV
echo 33sDc7xBNmq6qnnffF93/6/f/+huCC6grVoFen99A3m3YhrBn6Fd3rZXYk+TJKsh
echo PtNCchXoKikpoOHP3zRASqp4ON8ofbgPjY2NGll2A8dqAvmPGMlGpy46YM2ckJV2
echo TDCQz10mLkB1Km3q5ca7O49ED7VvJ4QcJyBoaHxBa1q2jBebNgQSEiBEFv59FPPe
echo qrrt7o3m4qXH7OmpbrMKDMbQSZ9Tk6FGAySDVtTk9nQv9N59c2nrow+TO/ABpCSS
echo KHHCYcUF6GPeJETuXXPJz55K/c2PN8auMc84GghjgoJJMnD+FyAEgYBOpK7TdETg
echo Yud1vqLrlw9OuWH9T4iUUn0n/ZjQ+zPf1NhIJSHio+e/9sQDI//5tg97xiPe2cXj
echo hFMJSpW8Xyz7KGhUgnAhc64m1tGv0uPVM//2zuf/apwk5OamxkYpsUz0WYL0x/yy
echo ZTfw3c9cvOqhmqfv/6B7fFAmz+iMGKHIkAJSKPkBQpUgyrc+L3FIqHcpRGgBougp
echo fUmpICU7kGZzSluMHx27+aG5N797T57XvE+EAkgJSggV8mEx78e1jRvXiutpmrXS
echo kPlwkITQbZgmlVxqhHkuNOFBEgryGWWQBCBSgFMTmmVDJ1z6gSA0cAqUQ7+Q7aRC
echo fN14jTx0eNnl5C7/D1IKSghEGKLuLyDvlaob73lfX2rE3DYwQQk4BzhTmES8ZTvX
echo H72RxV5eFSTcVi6JDgQMkvPP1KHWIDriXjuPv/ZAoP/rchY/sYULYkByBsUD45Qk
echo /DPYSBfT/674zr0SgiieVdOVVxCiCfl9jP2ZfsVVbb0UCelTzgvuIThgJkD2vhMc
echo fG1dRBgWJux4OyB3/he4bmpEff+T45JUeAR1HcEeu0X8cctmA4GPutH1HkbOpzLo
echo JaB5PnQw2tErsElbdMU3fvLE5NVE269yBEVTAwUEDtSl5x/X60rgO0JwFLTPASEg
echo PA+sdIwXSZVIkahC9uQ+40r/Oe7yCCgP8uP+hE55gByzsSRoYu7JnTpLVCNSmpQ8
echo Pc5VNCHk2bGKJxo44oQxJbqnsmah4hn1DYSiIa+LU5FJtV0oB2W+lFxgQA98yLKx
echo PBGP+h2nezFuahV+es17Wo27O3BEBIQHA8dfQCecwRUWqnL72E+XvqVNmlFNOloz
echo iMfsAGXjmAwCMniO4q1LptBsTqwNmW5oUKEkL4Ej7FjAKchgnAoBGrhwkuONkrpZ
echo vZPGAN9uqJCRck+7d+Jv4Wd9FTrOaupTMd/3KwXcDJP31j4t7PKctuz6clk3HkhN
echo qu/NlU4yFM0wKp2dmxda8ehJO9YHwrN1huScKDv1ETnX1cQAjkdjFZdd5297e6JY
echo 3hAjvI3giunb9ZvL1rIOJwpN+CGRT4ONGqMLH51ODMtKfxf85fSPDH6G4ptfi5Lt
echo 6yeI0Uuu9XK+HlM0Fe2Bcwu/UqWBwQJIFEyWJ9K/cyZgawHdK+aZJ84kMoL1QnJH
echo CmmRu+c+p02TO4IMsy8ISmpMlkcwUexh9817RpPUJJI5UrAMWs5Eszv4QsPWAo2z
echo oXzkFSQgpRwqQNiG1ZwAYR4csyzxzNbZGRr0gCIg8HzYpa7281m/Bs1lhPK5/vOU
echo yVUfoEUJyKwj/n76b2S8LKtJl4VrUdGD/9g6qzejVyQ07g3R/gArhISKCHA+zTGf
echo o9Tm1u+aF5PTR/UsMR1AuOA5DTNqdxu3VT/HunM2TLhh5FKI9LkWdvWs3qlvXY6N
echo m0Y0sfl123Se0wHhgBgOOo4R58XjS1Bqi4iiNSwvYuAW4ZwAocP0d5rBXUDnLjrN
echo sSVrts/pJqIbUgSSihwEs/C9mY3aWHkgOJEZAT8nZDToFOXiVNjVs5cT8mSmAtXs
echo CLtz1nOaECahwgnXIOjG2h0zu07rE0oM4UGch498aB9uP1DAmIoQxZIT4wLJqBZ9
echo 7tDSzu82v+3FR7gWfAAeRTyV1e6f8TDf1VUXXFazhVTHOoit++EiDjPlqWxabDg+
echo T05JfCJL0x2mcGMACUANEKdF+M8evJonU4gxPxiC7HNKLvDYT4IBAshCFJKSh8XF
echo 4KaQZ2oeTtK6ZNPHF3V897oN1dyJS41yIh0Ni6ZsMhdpG9QoQOj5QgdAnEhUlJ3C
echo zJptgLAgXQuU5MC5JrVYhqzburDjsKxPjiAeGFPMFS+wVDEZOnK/pg+R7jwWyFtB
echo Ip3QEg/uuqXjkrE7eyZP6U4KR5OUSiJ8Cgk7LMEIBm6gVPXa940SF4ITaLZLjuxO
echo 9v582wovVSUqmddHd5gKsY/Hfp/7WaAf7oaxgGqq6ONSh2GXlrm+JpQjQ6iqNV9g
echo D9cG75ygQrkI0OukpIxUpFVxGeaS86xyzgLDQUgxr+KvVlwA9UYQCp5zxZNfvicy
echo c/phnWdNaFRlzSKMFmOi8KvY5FmKGdOPJJ8Q97AVGx8RJEIoCZX3KQL0249ToOnc
echo X30QGqZTEaAnG5H3TX6ILZyyTQt6NWjUB9QuX3XJAMkgOIMUqtQudJF/p76pMWqs
echo etaoD7XGwrpt2r2TH2JqbUXj0/joH4WK5IHi4Utl0F4/ioXx/2Ur5q3T1bbMAEem
echo m4L5FELltZzqBe36BDwodJ+E79wcgZvNj+UeRa4HUGtAo+TW+et0tbaikc/o56mn
echo ikKovxOHRuxnSPVIFdyZ+N6sp+X6LQbtyZpy78GYl6E1HYdOCNreawV14zU4LtFv
echo /8qWiosvc3XkCvOjwMcbLfbEG5M6zYjF9h+xRDwWiJqRcVlGDpTPnNxhx+2A3jbx
echo afbR5jkCEUFDfgbjUb1jErDO58TKBwbhkBAJh0cw2drHLxuzTVMRsq3dFxt2VGXr
echo Z5jOSx+U4cbb7+5uPfYHMi6xW1+7vrSkuYsFrae1cJ3KCk427bDYRdPjmVc3gHiJ
echo Rd3XXX8tsf113ta3jkeXjWLWyBFC08U2bfKuffxQUEst4qqTlCI+IFXOLQ4hDFeA
echo CQbH1bAgvUVYNtdsA6hMMVJeIsiu3blEedkIumjBBJtS22JdB1NRW/NGpYQzdVzg
echo ThsXuDVpkbMj8Ls73OiJFkQWzKzSJ9SMsrpOnSxJxxx9dDkn8QgQsbm2ILVFKFqK
echo 5oWUEoMgVEjVg2J4eCLhB2Ja6X5kAz1zrLnM8T0h2rM6+dKsmEMq55166vEXMpXJ
echo Q+WjymQqMBxj4eyOOLyCBiMS+w+nsswS/jVLpp0WtKLtmSefNL41v7nmlIj6+46k
echo 26JRSkdXt9vTSvcb8mCgau48jAZASO3QZFj2DBEgRH6fo2AghNR4Q7rodbSOticq
echo 9NimkoRt6sFpiNyHEUYPHHipsqUzkr50ekty41HPmD+RCuZS7N1jhHOnzwhAQcSm
echo HYEeiR8ree+NNeaEUYG1aV975MTWiCj5aETMDLjRNlfLZGbSXlM6lYLJEMrFIFTc
echo AkqEs0489FA4MBEYLwkrmLKi171Uc6a+/OyYu7QSbNjquLOv3mqnTafcYzpX3v6V
echo WVlTJwSTqvObNfX89QWOEbPaPClaElfV8dIOP5JrfaPS+2YbSY/hmcS+a286ZoPL
echo yO83Jf2pMogx0c9V+6NkWAGUhKKoBdSZpM5zsrbFiZdhs9ELDRnLwAwSJMa6RHNq
echo RWZsVa4kRJ4FHDlEsHm7jopUfn7bxxQTR7PINy7pikDVd5rEsTbTN9bxZMqQsZxu
echo ILlvSyoOhkkt2Yg1weGcamrnNdACvGABtalQram/AOp9n6OoiDRAgNANiDR1kTq8
echo P0GpCWaZMggkyfkgOQeEOYDnE0R14MOdFMt/4Q0gvuY+C+PHCeQyQMQEsg6IxSRJ
echo SInAMGTJ0QOJpEpiyRpPMFUoKT4HxlKFqPNAqM+JwzQ0yHYSnEb0tenp3Qt6TliE
echo RogdcCI8gs4FoqeyxIlRpmgSIEvw5VkM355aizumXAlKKB7b/ya+NOsTIKtDBVbC
echo gHTCsZtn8J7yt7WoDUkYjYBJibWp+pxPzGSUuUMTgWL+fD5wNhMPsoB6k5Ce9mLZ
echo HH5Vyabjc0/3lmUdQ/YuDLLxq9r1MuLHGQuPvuG7wMg08E93BdD25Zd/cImPynT+
echo mzr2DARBCkGsd3G79wnKWpI7jVjUCrT3K1Lta4y/iCS4p7Ew0pAiECpElbMCFEoh
echo dW6b3/GEJdsgC+QnacJO/cpe2P7Yrc9aNGKa5aYfq9C9OBHkLCxVY46B8prj6Cr9
echo l/DvsgQFc8xCSu87fwZqYpl029V+JlhiBdmcn/vlO1dmNc+uJiwYsN45TZI8jPpV
echo mmcTmSkCVxcBRDDcyQSHrTF9d+ecqgfevKKzlHdHa5LZOAWB71PJGZGCKQKqS0jX
echo RDoSCbt6zmuPQI1RY4OAqhsLjE7m4iWsO/rA+is693bOqVI0ip9IcAgmoMtAHfa6
echo fV58FkJReep4qd4NxkcQqHJ6UBoPNcuBkigtfaXzOr7tqZH77r/k1dSVU09VJ5LC
echo gKRgAYWvmBT5M2vG+s8m6iCTmJqEbggCItDbQ4OXPh7dsvr9r3Y0W3NHpxO0lAVF
echo b5LCciZglJRoPYiLU8fOQaihSajF3SNtu2pix7JCVMbAVRahRUt7xVQ6Rso6jdnx
echo W94ef7x+4449DXXb44vGn0qPL8vFU3FmUis88D8H4UJtKHygs0vzD7fHM+8dru5o
echo 2n9RZo8zK15aVjolbcJiPgt9pLgEUnJu0hrrhMdbT+wIF29oEirHyFWrBP3harLv
echo R6t2f/g/9pzFTk4KSsWw13jMk7AosapHlNYecy917t8xr83ccqZ5lHWc1aeatUll
echo Z6yqWNawDR6u4QQab8nGggPt5d6ezpH8pFej+0Z5MpGw66oT1FYHSsxjoYcPt5lh
echo QsqSiCSzk7s+fuTX2K14JkR539kLDinX3GUvf0/+4Nnnd9ejIpohgdCGXfLszooQ
echo Vc6DCwkvkJ7ri6wXBI4I1IlwYQdONEoNw7QMw46YNGYZxOqbIwreOpzilb8alKMt
echo F+PX1x/UrjYeuf1bv/rhb6VcreRVhXEouFg5d56x/Dfu62v+7tUXDo8ZtfyjQzYv
echo i7kaG94QYQvTnszfDJmUWBGbWCSqqoChlYC6ohNSQNU5fXPQLyoVazrlaO+x+Oyx
echo GW1xySvrVvxD9+9Xzn1ZaTYYILi6arh87FjL50drv79i/r89fWT5JZsPxUWJlYOu
echo SXXJVzy0FWHz/N+HRfmAEcryKvB0eTYuGuvQWyc0bm5s3Lhyj79o35Gj73lDLvlU
echo WwXQ1ZgWnVe1d+oPbpm26v2updesP1SLzgygkUDqRKqy6P9xtdc38sJucEhBfCYJ
echo 4dIgJTGCy8cfwuXp19/49zW7Vr9zbNrOhoa9TlPTuVJhyMoNDdCamuqiwP6aB7+T
echo bDBHzGnY3zN18pHeKqPTiSIQKvJ/MU2GkBFI2TmMSbSyKYn9B2X7lhf/+pnuF4Da
echo ow0NB7P9mS8qQJ8lHq2stFtbRSKOtkk3XWnOHz2ysp5GSkdyqdvq/zB8IRIQIjTC
echo HOF1tzQ3n97zn+vdzV2s/I+VlVrPHa2tzuoiJcL5lElWzoX++ImZJlpdGziaALx4
echo 3jt1JcDnbQipgqU6aQWsDFCTAUxn5cq93uOPQ6XEosi9ECZIYwPoHkA7cnos3Z3x
echo vxjtF9r0uCnGjTgq6gG+rCm/UTzf+P8DmNkka6ca0bkAAAAASUVORK5CYIKJUE5H
echo DQoaCgAAAA1JSERSAAAAQAAAAEAIBgAAAKppcd4AABijSURBVHic5VsJlF1Fmf6q
echo 6t777tvf673TnU466SSks6cJCQkxAWRRRHGc5Chu44yoGHWUOZ4R8Qzgggyox9GD
echo xsFxnAFBEidKcCEgkrCGQCAL2UNn7fSW7rf02+5SVXPqvn5J791RhDln/pxK93mv
echo ln////r/auD/OZALXSAlCDaCbq1cRVavXic34u2FNQC2br2PrO7eJrEGghDIv8pB
echo 8nbQDRs2MID9OXx7C0DhxKBwVLheyKoxQQJk44Y1dO3aTRzgkJ9BFVqwOB1tmNdN
echo 6iYXqBmQXL4tHCGMSJ1bhWredjpaOLEXu/Eq+T7ai4z4G7ZmzcZxNYKM9aXiJLmT
echo CkBA3oslJxpabn4x9O5r9vmWTmo3ZyFJyuAQvcimtwUINOkgKhOotY6g2Xq5Y1n2
echo D09Nb3/xx+QLeF4xQt7OKbkTYvQdRgG5AYysZVxeyyNnPzrzmxtjn/3MHyM36ket
echo SjgOpAYuGFz8tUxuoqBcEofCRKOaDtLoS+DKvkfE2tR9P6t5+vVbyb+zs3IDZ2Qt
echo +IQZIEvEf43PenXxDQ/dV3HP4uezM2CKPPfLAgUhRB38f8cXKGyk8tCyQHwiRwJ0
echo Segk+WzPVw4s3/fwjeRrbNdoTCAjqz0TivhnLv7Y41+P/GjqmYzhxpDSBNG8o/4v
echo g2IElS5SMuyWh6B9LfPFjqv3rn+Xx4QRzIEMC3GQBDeQyMsfee/Tt8YfXNjZBx6i
echo FlNqNgykcpHDtnkLQUldHT/8fAaOnDB4OGSwu9OfOHzZ73/5jjt+KrvvAJEDHSMd
echo tGrjGkoIFW1/M/Mb68u+vbAtqbkh5BnnBOCiOIT6yQHXgSsZhCtAXGfAd/0//xpj
echo wN7qTHW2wkHh4uFUmsMFFM4BFFgi7fL7YnfNbF294N47CRUbN24YRDM5x0sJj3h5
echo u7hk/eJ7n/ku/5JeITqpC30Y1yVhoGYAkfxpXjDKaZYECSuklGvAWwFSSnBfBAFS
echo kIHCWZ7y12ncyoFKZeKDcdDgoptU8XW++/Gl3TdfQ26jT8kN4pw/oKWJGzeuISrc
echo HWpatG6Lscbnt5OSCzpMClIAhrRF9ZN3Wn23v1MY//5hp/6NzbbGqPyrSX6QFnAw
echo xmTdiT/Y5k8/6qRuv1JW/+GrlikKQuE2dD4XBCGnF0+QG9juKSs+BwiyERsGMAhF
echo 2ydkE8++H/X/Y151zeFMJYKylwqh7H5gmJMQ0GDIHO944mF65GRKN9q2o+KFLbzp
echo 89+zTy28yaflE5B0BH/xJgARHK4ZR/2Bh+zj379Z67RDzBEU7pZfurHln+I5rZIy
echo YQ/yCQp7n7To8WwZdphXX1745PMzzLUfOlykGbKoARuVJgjYy3HJIa2l2ik4kghB
echo ztn9gEG4i4I0HWNSk+3XCcxwSLaLCpZ7/Ae0ptDq2DBAlD2OsPYvGWpPR+qodNoc
echo +/Hv0tN2nJmRiPTpgDlpmp2nQZu69iA/UBpSSCJsWxzSW6KZOfpyRWuRZhT/Uxcb
echo xauz4boFp+k0MGEJtY/0VH7gkJ4UHKlJI1JuEclBpCCWRbB8KdNvmfIQz/Qprg5d
echo 95cPCo50lsrPT3qYX7Fc6JZN4Z0vOIxomeUITUJwD8eR8Na4JU9hCjrD0xYoWos0
echo Y3AUSOk19QkeAROOt3BkO+RwHGkYjQsLIV9/5OQcy1ZOwlXzX9aX0efstBvw9niz
echo 7J4KFxkewCLssK+f+6x+6ap6z+GpIBw0JIypCwsOJ4ZixkjrFQMUPkk3jLRWU6do
echo 7e5e59l2UQO2rvYYYBMzYHMGIlwyGjKeNFxLz0xdKWKVFdnOjjzmzgnIlgU+SEbZ
echo bXMfJHqm1+XKvZRC018Y+qRCs6+P39b8AOADm9esY9HCEDo7LcRisVx++ioXrm2M
echo JjT1uaLJ4QQWfAHl+0rXeDpAAaiX2Cg1UoeOOiQ0cPTQ2tCcK1ekHn1gEp74zQxU
echo lwuINNA864z+hZr/dJNZQ6pkRM0fe7+xz1JZfiJnyk9XPuAsnn3M4BmKeJjjdxua
echo 5GMP16Hl3cuS3dqUoD6BszxmFG+u5+imA52s96XHNTn24FwlDeHuSVfZ114ecmJR
echo QaRtg8oChPCTv1+yRX8He9pOOSF4XtlbN4F9z43iXCoc9LlBLCHP2zdfvFkXCBAq
echo CpCOjUiYk6tX+93E5KstEBopatsE9u2ntWvfvuE+wDPoEZ3I4MFdgaAh2O78HP8f
echo X4ylJMlCCFcSOIBtgYZ09o3F60kkd8ZVUQHcHcU5jTYUk111w4Mve9b91oIfET3O
echo GCwb6gzBXSlpDi9sD6W3p+aaIUNoCqcJ7TvkZkyHBdsRwsiwoYhxOMxIKPbwgUv7
echo SCorKeUEwgGFDZ4H6hu7jdum3edms1SoqHChYU+t6ctq8p8b1rvTZ7QZPEdBYUGd
echo QSgnJJORD++/JK1H4lG4/dKfyN5Dbu90KP0TlZLrCoRNYW7tW8n2HQoniS8P7rqK
echo M2CyAG77ccOircZ1gd/aSTsEKouRpTgUwoOH+uxcyJMOUk4QV/ietD+0eIvBHT+o
echo zEPtraRPfXm0Hgmkt/SsIhG/CChcJor3UKBDxD/ABicQnjgHD1fGf7ZzaRL5DAgp
echo aoFClDgFwDTol+f/nEUKHS6XDJq0waTrScEVDI7QvKF+V5+p79QcISn8+V73K/N/
echo RhBklNg2iFRhVe3tAlYGP9+5OGGF62JslNA36hiTARJFj3kBWhD1i9Bvu68kJ4/4
echo +5QWKAkpBlBig+cI6qe06TfVPeB2ZSIyaYeRyvqkzBdExOnilbzNG+p39Zn6LmmF
echo 0JmN4ePVD7nTG4/pPM9AiVWSPojPIp2tenZT+1UyGhCRC5F+UQMG24A2qg/wbhZj
echo 3+7UVhoDyQUnxx58taX3qzOfCAsZLKq14q5Uzs+Hj8//rb6re0Zhank3W1r1Ghpj
echo 7TTuzxBN+Q142iAT+ZA4lqwVO7oW4nB3nfjkwl9rEobn9UGKSEtBJZV58sir7+hJ
echo mNOiNUQQZf4TAqEStuE6rw0jqsSt/n/jgSuAaIhENpy6tvfTx/6UL2ss+EWegNL+
echo 2pFNEIhI9pPr7vTBdCmYUncd8C5a5yFWnkTj5GO4gj8L5DUBn0lhEYAUTUYKAmqC
echo pE/CerD1GidaQ6Kuo/CcGKj1nkyHMIAWf2wdwKkLy9QUswxwetZsiq1/ZkUHUdkQ
echo XOnZq2ezNqQKg7pOuR0AzxtQQpU2HzTUZ+o7NQeGTtUatba0j5SuJCSF/3jmkvYz
echo RnPUpJyNnq6P5QPEGBogBoQSj10TA6WG5SEe/8mJD/asenZv92UrT1eKnCYpLfYL
echo inpOwPpVeSQYZGwugSq7npcJkTTgkp0v1vT825Eb7bIGlLn2xPEbZAJywiYgJqxe
echo XolNY0QGayq7+8IWXOW0VFI1BMkLqaAPmCvVrZ1bOJOIum5gciWhlEpXXYYmXoEq
echo mcBQFLQRZhY1YPRewjAgVCKV9ou7597hf//qHTFhmaDSwpsFTN3C8xTXX7GzOs3u
echo sW47fIeIBrJUETVhUP52BJK0UTWATEADJAGjHIl8VH5+0n32h5c/6uOWBlYi/k3s
echo mShnxW0NH17+qHEmW2X98Mw6X9xIEdWeKUWJCTnB8UwAXPkBNWv8TSlxkXHCuNR4
echo zr5lxf26KxmBzeF6CI0gHYlidBhFcN5l1Iu+o03g4AYjtyy/X3/lsQX2K/YyX5D2
echo oVi6GweU/Y9AlzbsjNKlZRwNUHYvKIVW6ON3rbyHsAow9AnAlPAKycqhlppHYoAY
echo VQRwRuCPYo4G0GD/2tL8Es7qd7XOlkAZ2LeW3sOve/K/uPBT5qXS4+UsJQ0YAtqQ
echo Wf3hQsXfsX0AJZ7q4+OTHnKC7KRvz04TleUO2s5oYtuuCjcYpKqsRlR9XvdRqXL9
echo fJ7TG1Z2aw11rkr3Qftx9nilAe1tTPxqazk3fD5OiYDtEGLoKppw9GUEWTnvrN7U
echo aNOeEz7EzJP639Zutv67/UMsbqSgUu0xQdE0gmvThnFKpcKuJ98xNECCUwLD7nM/
echo OuvXtDvDyGv7dXV9FX/YFrbntDSeOp00+C82SxqqmpExWVK7/sqIu/9Y1l/I/b7x
echo q/+UMpBSMi1ywEM9KuWvHgrZzx6d3rGsxZ/78SNSE776vGlQsaQ5x+qq4+Lun26e
echo ffWqjK4DdOEsl3xs1ib6yIn3uFwjmnfBGkMLVMvAaxsMAW04p/o1YISLQwnUVTWr
echo ChXhHW5T+QmDhRjmXdQHSMaf3xOzrlxi6w9uLgQbauqcb33vlvRTjz8ViIcPJz94
echo +XH9scci/P6fBwsn2gmxbOYd4jMkaajl2LFfF3/7rgLrSYqwyDN6ww3z+9573ftC
echo +/Y+mW8M/l7vOkCtm9+XJzBcA5yBZ05oi8O77Jfzl2hBmoW6RI8KnvQH2uOYUYD0
echo 5wIjAyEclgW5vOFlyfygVoZCJ1K9TyFKrB1dYHsOur7y+qrs9KnTA90LE2T7tpf0
echo qtqeoAC1p9TaVl0VZ4bqtSrT5oDOmHiaaL5Mn2Av7eaabgYK0Wi5NmtGk7nz1Rfy
echo 6a62MCUMhRwhPovCFhQ+P6fLK1+Wzx25RIZMTpQTHQ28HGCEsKkN55LSgAGOaKTN
echo KMC45S4oP0DgAnmbORnKuM6Iy10iGXFpeVnYmt2yKrH+u98Wb3RKTImmKlzHxfRa
echo i1297Gw5supCcN4nkxBxn3u1PM9diqDBxcw5S3tCOnNu/5e72rPpI5HpS4XucCpy
echo XLNygnEqQH2aYywqP0DYQcuVEvpYWntOA8YOg7L/NuhVCEcj32tIBmValBs94mQy
echo 2n3mSGWedYCxKOzONA3EgtT5hzVVuaff4CmRtUlZrIJ+6LIe/Xi7LgoFr7BDHZtA
echo N5Q2SdiW8icgliWp3xC4+YPx3I+2Tu7taTtDBIm41y/pKqupMAtdqQJ9Y0ddgqRh
echo uFXgtTO7zbjRGwzKNHFd0+sTjOoH1FeeBowRBsU5E+gPh6MwQEoCTVjidCrepW/W
echo glO38zpD6kyYRmGSKzL/+oucf2rlKf+rB9fHHa7z8hjXNmU6AntadX75AunCIWCG
echo wFMvGXBcgqtWWIBFSF0FcR7+XTaw97D07T/0y9mJhCOjMZP4e9oCDyZ9hcoTjDX8
echo VK/RC7bfgSMSS+K9bVcEuzUUqhzhG/MKf84ExosCGNcEVJWeoKBTy/wN8Qf1FezA
echo v3xk79wffm2O2Zc2b6b+wrZWmk9MzmTXvacnYjBucA5ZcPRsc4PE6nm5oJ0HA6WY
echo VS+8Y9wChRCS3rA8x6Jhmsnl02Th5DZGKSGWS/jx9qr2qTtZ6HJCfX6e89tlEWff
echo 57+5b+amBxv8v9odzM9klsF5QEWuUTXgnBMchwHSq6GrLHd0DVAJkJHPy4aDhXJ5
echo MUk6igxVmQLQyJzoDBvhVoOcqVxqmbW+XISDgCqTUqoDyZhP5RlA/dR+cThKMgS1
echo KIRvXGEFlF0IlWZDosv293U87gYbHV4rDGheRc17ryak6yNi6h6rLFibSecDJpjn
echo uMkYYXA8BkgMruGPACpDsAHUZhMsYoAEXnuxYsUrz1W4ugGhUjmp2lBg7BQC+QKV
echo kgmNqIdMAtBNiYNHGW5dD5RFCGKh4p6pDHA2LXHXp4DmmZypcqJKmRVCuQKV9DT8
echo TEhN0SCoRoxcn778znWLhKbBMSBqsz3aIbMCmhIeGU8DJpQKyzF9gOr4pFgAeaIJ
echo U6fU1n1gnoGpxxPFs5ywdENSGEVp9ZunS2BqwKM7VE471GNTfP9zujdH5TSl1zca
echo OHND0hLnJFvUwILplwp5S0iRYAFQoXRCFJVsVB9Ah8lVGz0RGtUFQhcOOnxx7YlI
echo U+amntfjPYZZarTD74IkDTj2XKcQIXbM44gkXopi5YHGycB7FuuIJJvx0UWzVYcJ
echo D+8+hJ7w62isFyh45bR+hAkQhuM/0+yk0jsMu8yCUTj/LJFEHQuPxS7KnvZXalHX
echo Uc2xEXEu0jWyX9OGzir6ADKGD/DeiyIA4v9B3WXdS9kR2dAl4qUSYNJPrJPvFJ0V
echo UxLhEHV9gisDOI+EdAXu/qQGsn0lmqvneNQ0BCshlu2H9NpbxdnFnI0gQLhRNTkR
echo PnVNVQfZQqvCOWl6WxFgX7kvce+k1WmfkA0Kp/7S6Rg+YHieoA2fObYGlI4wKEg3
echo qiM/mz/j9Gcir1mZExFCAq60L7KdqoZkqNqXjSvSB+bfiigrR3DRNAeHyP14/tB8
echo 78PY0r24qNGGlWPeTXjQGgJUG7kYLu7Cqepol3bA0JDRaXhKWt6fXnS2o7u6Pg5O
echo RqANIyZ5Q66E2tBJxS6qSoXHrgmraSEd0U3HLj37zst32ZeuOF6RKhhOlFnlQY0b
echo QwkZyAQnp2F2A4fT8JL3mQ4DVl4r1gHlCKV3AlJn5uKxRiuYavDlI6atvXCg/Oym
echo PZea4RiiXl9wHPpLtBUfNJyvA1P1X/F1AKSmGv9wIbgoPngao8emNqNqfaBy0pe2
echo rE0e3B/MTYumYjGDG65LpHpiUHQ8w4ciq5CnEHm/N9TvCrPR5qu9HJfIqMGNxmgq
echo qs66ZcvapDpb4SDHfV4jFE3eizGdqIIlxOrVRQ7QgTzyi2RnzMjAdZUJjN9y4lzA
echo 1GiwEJ4x9T2P3nTi3l/PPZRJEycU4MRgqsFLJXeoxwyvJjdgeJm2cvVKJOr3Id+r
echo NWqt2kPtpfZUe6sz1FnqTHW2wmHcUrhUXSwi40YOISQ6VTxaPdAEVs/Z5gUdmuk4
echo NNnsxLM8TtVzE9WjGw+Ulpu6FjVq6pvv2PvhY786uPO1z7S8UnVtc0dNbYVjghGv
echo vmC5VLXwB13Yzge2wZ8xBuLXBIimHmpJtJ/VC4/vn9SxfufFXa87LcGamkgzZVqA
echo 95e4xlN/777h6qTe3wW90H6oeOS28wxQf2kBPMK271y7u7mltVejs8ukMgNlL+MV
echo XlXe5J2iBeqqorNP5VecvfmZOWemvHCk47qpB8JXNLWXN9emo9UR1x8MCpXe9a8b
echo snHp8sWBbJbiWFrP72+PpP50tLbnd8dn951wZ5hl5bGpdXFfBQej6pXoIC6OgR8h
echo Xs2JNodbs4f3Z18DNrCtWFtEuzRvzZpmY+PG/aFnvtf8wK27/vHdx7uI8OmSjnXH
echo HglUmYtIl+cdN5VM5bt5LpGu0DrdGZF2fWF1V6CpPB2YFMn7Qqar+5h6iQlYnIpM
echo QXPOpP3W0Z5IbldnVe5IutY561ZrLBCPxKL+Sr+uRSXR2BjBaVRwOURljNHvLvnR
echo tg/e8uracFNT6ujRo17p+lwUaG7eL4BVue4j2x65fsrOq799+jIa0PrgFnGcMBTl
echo QplP85XVlutlsixo2+6k3OuFuZkdx+yMeyifBLccIm3htco989cgiUHBfLpm+M2A
echo adSYFXqoTqMBQtS9kUIp5IX0KkqgUYHeQgh/N/UVmW/btaETy/q+fsV28emjwxWI
echo tLTU+nfuTJY9c8+kn3z74Ofe/XJrQET9DlXPTS/4Qfi5yrhqc5UKxMohqQAruFR5
echo K+mvvEpJifoHqhIBqu6bJR95/kX4hZ+vXu/2FZi4qJ7Tr8+/b9v7vnzgE1Oqq7v2
echo dHbmSq6HDlwSCrXb0WhV5ue/fuN7n7toU1t5hNJcXvVxVUI/wScog16VF9/2qjaW
echo cDnU0wHOiXqCq0toPimZ3xvQfOoz9Z2ao+aqNd7Dp0F7TXQU7yuFgpABv0G/NO83
echo 3ZsfP/CdVHRBYll9p7rLnTMkMoRvpKUW/p3tzZG7P7D/+qZLrr331mfeH00kHREN
echo OJRL9ZKudKOaiEjerNbQRM/yck/lIpHOayIQNOldqx/LJV/f/NV1v7how/z5B9N7
echo 9uCc9EfbmV7ShNCOo1Pj33r/8ffOW7byth/sfl/1S2+EZNjIw9SF9+cyxb+t+PO0
echo 882CAVbWb2ISyruk7YBcOCVHv7josd4Te7f+6y0P1W9smdbXu7M10TfUkZBR9mbz
echo GqKRvScryz6w4OilN31gxrqX+lYt3XxoDmntNlW/XxrM9Thdat68HVDSReWoHc5U
echo a4k0VDi4ftYBrIxv3fnQbw/++L+2T9/WXN/du/902nu4MNIeI4GXj0ybhmBra0MZ
echo 0DP1Oze675o+c+Y1rYXmpv09DYETyTgSeR8cfmFR4s0G5eXjARuTowk0l5/KN/kP
echo tJ5uPfjkF/5b/g6obp3XcDKx9ySU5Ed4HYAxtdd7UlpdDdN1y6M9PYE40Dnl4yvF
echo /JZZkeZYPDZZauG4hGZIr4H/1gMhRFCpCgGZZCqVOrXrcPLAf2yle4CqY/6yXCLE
echo elPd3ciX6r0j7oHxQRGntUyD/1iyLNTbGw4DhQiQjwJOCKC+YnfrrWaCF0JViLAA
echo PQP4U4CZ8pe5mZnhtszuE56zc8dLHshETyuZRXU1jCpf1Mgwn5FKuboQBpPF0PBW
echo +0Kp/nyRUpuHw8wNcsvWnLS1p9PrISvCJ9TjJxd4aGm+knbp1fXb/YeEpRRxYKo4
echo Yb/8v4knAbDKlWU/AAAAAElFTkSuQmCCiVBORw0KGgoAAAANSUhEUgAAAIAAAACA
echo CAYAAADDPmHLAAA9EElEQVR4nO19CZhdRZXwqaq73/u23jvp7PsKJIEkbGETGRUd
echo 0TAoKOOoqDPg/Kj/OI4zRsZxZn51VAaXkQEFxBUFBNkUUBYJW8KSjWwkna2zdPfr
echo t929qv7v3Pe604QsTfp1CML5qLym+766tZw6+zkF8Ba8BW/BW/AWvAVvwZsRyOvx
echo zmXLgMxaC6R55uvy/uMO9q0FuWYmyC9fA5IAyGP57mOxAeSXS4FOzAFdAQCfuB44
echo ABHH7vVvBJD9n+QHV4Ayfz7AyzkQSy8GMdIIMWI7sGwZ0Au7gC24HgQAwU2v/UVo
echo f/gYtExug0aTQbOqgs45ADCAWLw5MEKh1U1lABBJiHwP9m7sgb4P3QN7duygXvUp
echo fETSZ68A9nIexMW34TrWHxnqvuBLlwI7Lwf0E9eTqNr9+1jnsttOGtsCi8GExaAb
echo 0321od1Xck6JNeicahSkGIGRvBGAABWxdOLewOQF14x7doPnboQAnuzNwxONXxy3
echo AmC7j/v+gyukmqsiAq/vCOoEywAoLAXlmtsgRNxe/nk+ftFY+ABk6IVFe+qcLdY8
echo Z5W6UK5TToi307G8RzZASVoQS7XKEY4p5zsOgCQHHBiJIUVcyEEBOkQnmybWKHPD
echo p8hkb6WbraxbD6Xw3o1d8NOp17C1AAKWLZUazIT4mmsSilCXYQy7j2VLgF3zCG4h
echo 5Sv/VUw5qR2ugkzj0tWZ81vuMy+JH4Mz4+1xlvocVCaAKRCDAhwoIM1/s+38KwFn
echo L4ABBwYRrgoFrjGI25UyX0yeZO/0f66eULivT83v+u3GLvj21C/R5wBEIit84nqI
echo h8sWSB0EPPXi20i4aNFC89HLnvyc2pK78onsxc23GJ/2nopm0jAE3SA+0SACZH3V
echo 0eK2vylp/iGh/yDgJx6LCFTwpQFMg+AEdWv84fB75lmFW0vKnq4ffmfNqK9e9d2u
echo nmsvkPrf348U9+iRYDi7QK+9ANS/v58Gq/9NnDKrA763qe3C+f9tf6X0sH+CRqNY
echo t4ibbLpI/n1rw18LICIghcR186QBgaKFC82Xg//jfdk5cfdPN23fzT899h/o/cuW
echo Cm3tbcBvQ0JyFIhwNLuC36HLlgK75jYa9n5LfCrdlvnaL9q/on5TXBUHXmw7UAYg
echo JNn4t2D4QGt760oLpKZ5V6g/g493f5aFu7r+Pf1pds2yJVxZ2wLytqPQFF4rApCl
echo APS8K1DKZ1Hpv/nX6Zhpn1vWeEvx7sopZoYXVUZEwt3fgvpDQhEkQB/N8tOcjeWv
echo Fy/L2FufvtW48gd/s2zJJ+QfAeCRRxItQY4EAuCzpEr2WVC+ln83nnzK315h315Y
echo VWpLZ6FABGFvcpHu2ACTMZQgBaOcsHBjeHGmddN9d2jfXXbJD06/Rj6YB/FaKAF5
echo LZu/7HLQrrmZ+n3fEt+Aaad89q+Nu/s2ljPZNJSAE+XNp8q9ToD2YkVyqIAJDTYp
echo 3BK9L9O86b6fm1fSD1x7gUDBMOq3JNUNAa66ALTr7ifBrq/JT+WmTvveh9MPFtYU
echo mzJpUk5UmLfg2AMqj640ockRxduCt6fp+uX/kfsM/adlS4RxzSOJdiDqgQBk6UxQ
echo b1tLwuX/yBaeMtf5w/9tuye+t7DAyZE+EoM6EhbKt2BIQIBBDCVpw0npXcUbes9J
echo bV29/aLp15A7r7pA6tcNQUWkQxH6Zs4CePepU1OnTObX/6J1Gb27uMjMQh+JJYPE
echo jIuSyVsNjv0aCOCSQQrK8HRxnPOdhv/ypk3Uv/v9D+dGN3jAlyxJSDMZDgUgly8B
echo /eZHqN/zDXFNYda7vvQ+8WtX8YsWGbabSgKREiR5c2sMRAqQuJjDtJNQKaCoNAY3
echo GZ/UZ790w03239OPXL5EGDcfgRWQI5l4Ub+8KO1MXXqOtvz/tNzHHu6b6aRopcb3
echo jw4FqOAQEQ1iqoHGXUDVETWINxNQKUBIgIBZiVSviQAkPXotCk1tntRherq3dHPh
echo bGPFkzvOP/2/4ke+vJSo19w2IBQe5HuHBrIVQLntNsbfM7d89TMNF2V+Xz5Jc1Di
echo l/QoSD9iuwQuCLhaAzQobjw9WuOrhiFcJQtcoCch/rNnJZTHILgEl6WBGo6cGq/3
echo W2hf5OqNEAkKRNQcY6+xXyEJWNKF54sd5gOpy9niyfwfCADdujfZ40OSmENRAIL8
echo 45FHQF73V9qkT7wntfxTDQ8YTxYmWzZ1QSACHIVpMyYKpNQ4ntV1tx/+/gdk9+at
echo bOzC02J/4WV0S/NZWrdIKXpYrPoMEh4j/4w8f5Dsa6CmIcs8PjG/PEiv+LHY+vjD
echo SkNbi0i//WNi3dj3672xqSoyqs3/tb2GEgm+0GC8U6zcWjlHffrR7eed953o8Svm
echo E+X6FQd3HCmHGvJZAMojwPwPzg8vXZ85t+Epd6ZvQR8IQWv9kNe8+VlZiube/mH/
echo Tw89bW6t2EpMdVi59WGY/OCD0fQFc4Ppp1/qvzDqfWbAGWPIGwdW740MsvYfAUaJ
echo WNz1c48t/7Fc/9Sz2oa9QqvQFNCXu2DMyn/kZ5xxk7fxop/AHtauqsgSXqNFFamA
echo AT685LZpz6TerZw+7dq/BlAes9Vkn/lQESAhFzdtxR8npzJNmy+8nr43CvxIt6hI
echo PFVDtDG8cnBCgKpwsXlTl7qulFUaUgpIzkGQFKwpEnX1AxvUmY9dFS/6ux3uQzP/
echo xWFBnkg0LtXH7f06AgEqY/C1Bjhr2/9U1n/7s/qKfFYDzQHDJOBIDpTqsNnVWeP6
echo PZoDARdCqug3RTfa0QCLfPUueZF/Zu5H5y09IRr9rSdn7l0CK+gjB9m4g6LY0pnA
echo OjuXhbd/fP28Unry9EfCRbEJPkEMOxq1Dz8YD2WBpERm3MTYoT4IgXwrwQwwFQ6O
echo rcML3ihl253/q872n/U86gCR8VHxw+OnARDJwScmTOEb/OJvvsmW97VqlmOBpQgA
echo wZM14BKSk9s0piPqY42cxn6V+x3FO7E/Azx4OpgtdztzRn/pHd4ZAM9Fcy84uLXu
echo YAhAOmbhw/8mTpsEizuNE8ztQRPVZFgb1NE0VPli8AMZs3RLpCElQWSqAfbLuYC0
echo KWH55sjI/e6r3IQwlklIZL9Q9EZsMkFwhVE++tH/DB9b1Wc6JgOBlG/QOcQfMUBG
echo yzbHbsRiKqJq4MRRNHwlBtx0+7ryknYym9ACZyAVCpQBmwA5HAIkD2x8GT8fVLJp
echo WPQimSf9UCoUWcgwTgNqAFEYC8i2ebaG/OrV3B3Vwb7YBlp80bwgusMrchuYHN57
echo X89G0WkjHTgjeMhrKD1u7AlTRKOvDulDwd9UBCi5Vs+PBCf9ZHMYay3jSHlOLoj1
echo FJuPrPzF5w8uuB2UAvx2RYcEuDBHLXPKWjEzZiJkR0uSBpNDwWPi26Mjx2SCHwwD
echo 8BdRBOdfMl25avIdLF3Y4qOtAEnl672Z8JobGngU0Ir7wivbfgzv+vBUDR04gylf
echo /4nDpXB0KqP06DCOBSHDXGv80GRI1kRTeGw1jv3Qyevbn9wxWcyf/+r9ftUv5s/H
echo MaX51eeV20K9obmTj+aJWiIISCGPvlVRnVWsNpF1tBhlgMFLgVpPFEloaVbhhDlp
echo aJ7Bzb8xbgpKviKqfvBhvPtYN4mnn0Mx0uVS+Ik3ZXbBmj4zB+PGaBCEIpnrYAxA
echo G0jaYtxzOrgUkkkpyXDejxQF92xX3CQrWnPmojkwBuBS3lwYsAkcEgFI9aHT5bxW
echo aPTVtNUTZ0CRcTKp4WElAY3ESo8xDsaMby8zESXG4IGBEAKez2HOLBvGdFAQLE0u
echo n/+0Mav4uOcRG8Onj4NTLYfUiOAQEBPGFF70/nbuQ5pwcjSVE7BgXgo8TwCl+/eA
echo IMHmMUwYm3N7nMlCgVhNjsawxoAxAxwKsQNl1qC3p6AFYJZsHT0EFlB9qF2Oa4Cm
echo Cs1ppdhMsHn4CwNEIZLtE1lNnbI4P8qJIBRk4DCgSyCOJZx5ahrAAojLIdhT0vrV
echo 7T8UoliKkgfeII4nSgACN46vzNwQN87WzbjC8UjC2aenB6hdP0SSkGYjgNS0Bb27
echo ZKuqEaFUE8SGc9iqFMjjCinSRppLQzPAUtDLA/tNDoYAyS/dAD+7CGNgcqLSxDxZ
echo w6phLUyiEzGigrC2Np3hTelwKnHMQVFI0nDzcQhLTk0BhHESLy+4DmeevNt6V/xL
echo FAjlG0EgZDKqCn7uPd6FCzeYgjpJwDf4EZx2ig2GQSEIRDJnVSGo68CUNj3Y1bqk
echo AgAWIZQm5LIOY0HWEhONKBSP1B+JGw1BC/CSh3QaxQkdGsCo4beECBBdkcZWZaLa
echo MnlGr0ND6C0I2dMTJ4N9x9uzMHuWDtKNgFIBJAwAmhvZ1XPuUEf3vej51Er06vqM
echo p/4NJIeQGpDOb/E/P+UWyjoaVPADYEyA9GKYMEGD916YA0IJ9PbGydw1HkDH5Am9
echo m/WZxGDSxDWqnrX6jAmtsFFiT/ojDZI9PYIlMEgQoEhQRkswYOAE1wGQOjJF4dRI
echo 9Yw+s/eEcc+3y5a08s63OXDOGSmYNtmoWkUQG/DtBEC4AG0nauY/7by2eFXftyLV
echo pmoi5RyHJmJKAMqu5F9w/jucfApPCY8AJSi7kOpoBcD1146FLVe3wh8eL8G9D5ZJ
echo cWuPcMee2lehqVRWUTC6pnr6hwuD9q0qb/cedMEO4QtwEwQ4sKPhDwr/YdQxiPNM
echo fFLPDVdN7zv7g3oTCCYhEAT8eP++1l6JvExIC847vdP+wJ03Vm6NrlIytEiOtzA0
echo BhyKMgN/4d1a+auzX7CE2k5IEL4ST3EpA4AJ4xWYML1R/s0nG8lzd+ZKlz6xMHIM
echo 6kjCGDkaL9DBYIAVJB/JoQ740OwACQhE2gFrVp1aNT2EMkr1MNXsPNQ5rVfuLkKU
echo j4hw0WWNQt4BjQgggQ/Q0MiuXniXNqP4hOsRZ79WIF7nJmUS3xBQC0bnV3lfOOFW
echo FUY1KuAFQJKcx1c2zJYQfgxhbwzQU4RHN4/vKThjTVVhBklk4jqPDz0KybK7B6UA
echo r0KA8EA+UZtkXVrV/kkEUVg6raXu2bfQ372JV1QbSTo2/uomORA0HVdiSM1wjGVj
echo rxVKsScUVK2a0F5vwU+gwYdCVPLif2r9dtR6omoKF1W96tgPNieMAtIsSYpbw+CO
echo HSdXUmk9jWJhkklTz/U+OOU+rBBYA2+ABfQbNurXElGAaoxYu+0p2oOr2nogdquk
echo 5sDTP6hRiECEGsw7tcf+uPpdvxRo+w1Er2OjSPpjU35A/NA97/TNthCoNkeHnAc2
echo gYsKPjy+Ktu7UZ/NTBVsSQirp/A3IJgeAYbgcK7/qSG4boSpVtZO375lQTHY7nGq
echo ofWrdmoO1tARHQUgrSz9+OKHjEXl+90ypJJwqtfT1u8RB2YUlrtXL7xDk7kGlmgu
echo CSs7xDwEB6oCEXvK8o71c/vUbM4hlGkJ7x+RcR5+l4+MACMxqCS5gVFHJ85KOQ+e
echo fs7pARZgzMBhqQCyAlQRtYlZbdmM75F0YZsfUT1RDY/15hM8yVQFZEfLJnxbpKab
echo hnTjZIyHnAPyfyEkUUNYu0rr+6O3MEqbNIX+wkQ8GqG1HgYFwE5Ghs8iFaCE6TLX
echo 7Nzy4vxu3lWWeDIOxTf75QFUq1C9mrzAtT6b/lbouYQnlrVjjAAUBJQDTVyhfc+f
echo v3iPLQINKEZdHW78ggNhQKCvAj9dOXuvmx1jMUpMUjVz1nnjB30eLQKMBE8aaCgM
echo UpVlLJZ+yD0tXP2i0Ue08IhUIGEFPAShpMhfnf6U9RfRbZUStxNyfKz4PpExlKUN
echo iyoPuB8/9XcGsiUS95P+w/B+PP1GBJ1raOmuntO8bErJCKIq1XjZOo+zX3YbHgWA
echo EVSfsHNCGWVmkGt3bl0xZw/0VoAwNIMeRhZArQDVKz8EaM8o/zD3JqWhuNWLiF6L
echo qB1ZlQ8EhrCrYJS6gy9O/wFoE2xNumFN5Tv8uIFKgIoLv3xmyp7u9GRDZcSGxPQ7
echo 0us8HAQYUT4qqaSqkk2rmd/mz/C2rFGKREcfwBGoAGoFNVYwepZnfjT9o8j1WaIV
echo 1F2NkoOakInBpxwa4mLtp8H0E/ZZwldq1r4jnH4ugOic7HtJeLftPLOUyehZSXQ1
echo EYhHkl0NiwKMdDxeQgQIUxmz+9ITrF88M30vlF08KYeXBZJWZQVSd8hlCx7UZ3tP
echo ui5YR/RcovB2uAZH+G4AJoytrPE/edKdqkw5lMT9iTdHGC+RkkQu3PXs+D3brZma
echo qWHQYy0bZkTWdsDuMhwKcCz4KVBBNDWT1TO/7FpS2rMeXGrwJIr4SKcKyS5K3uZ4
echo Rf/0mBukKPvoXX3FhiFCoK5OkUQTCjFRk6ykgBgQQK0Ro5qpRLBiGU2eTb6D7KaG
echo FMlYQYLvyfhTzTfEDVMjU7roMDnyODH6GU9/cXMc3rr5zD47Z2aBqBpi/0iv75Go
echo wKHyAgbhwNBIydFCVRQgTFeZs9Oaqt/5zKS9n5i1fjwQA9nAET0+SUgVN+Cc+avN
echo C3b9xr03/is1S/uSDQ3BgFAowLFiIY+lLcuxQ0oSAzAt6uKGVo1dQKQrLIiBQUWm
echo SIk4imQKYQqARjH/OQBVhFCCDCyKfu+9d8GfTElzQNDgMwRA2sLAJw89O3rvOvUE
echo 1qqTFFpDSTXyA0YGhkYBhoAAR50COGRIjCBE0VJZM3vry0v2XrJpXZCZxnXpyURB
echo Oux3cQnR6dJsK5+eeQt75PmzvH32aNMMinE7bOJTtU18bnYtdDh7yNRcp2xMV5hC
echo OTG0kBDab+1EmVKTsWCyp2jHG/Lj4h3lVvliYSZs8CazLtmhFI0GprmF4OopNxJl
echo tK4KLwaKQt0RAKVxqlMSbAvjm9ad3ms2pfD061Vj2Aiv7RD6HgIC9KtfIwpEgsJs
echo jaY2anN7Hnh27L6Lp27tkBLNgwdEUR7CDSt9BpNm91p/v+Xbhe0wMX7buMfY7NGd
echo LJXzdRQNQGUEkMRjSnty8DC1vf/tACYKchBBM6nAdLkTIMIEPhClvBGv3jkueHDX
echo 6cLWuuP5J21LyzBV0/mPPDEhiWQsIH9a2dLzjDhZNposLQmGgyABGsl1Hdq+HR4B
echo BqsnI+l+RwKA8gjVNDNrZ29+6YzeCzs3txkdQpEBWgCP/HLCOUjFJB95+x/ToPyO
echo gKMTEDoAdyCpRexXk1MTF+f+UMRXQqI1sSSaF4P1mA0slRZs8YRNsLi8RkKgCjCt
echo quA3BK8t8mCqMMJ3B+LmF0/dxxpyaUoVY0D2GgKJPnoYbAwaBgUYECxHklpVB0kk
echo YYpj0PRKWJB/bMUD3eeP29XGpSrZEGSBpIMYA+x1KqQBUEEBDW0GgyIHjlgNAfY/
echo gkPCQ45+HakBKDqhmmQQ12IWhrAYUhBJtYA891wu/wdvcZxpYRmRnH6soTfCfHVg
echo WY9jO8ArW3LoKGGarjdkMt9e8bY95Q08ooYgMokAGkJDiZzHQAWGlMVVCR2G1whq
echo BLTaZ3Xzh/a9ZMyaIOH2gP/38rN3iVxLilLFTNSMkVavB5p4IyFAggQYK6CkdJp5
echo mi6Emx6YvY2ELqAgUE0OGUIb5Deoa4PX1i+GYVDw4PbfTdp5b3hWlLNoThBl5A0/
echo r7IHwPGtBh4IVEommWE0NRmN39r0np3nPrGpcca5lawoMUlrUvvxDkKApI4gO55S
echo K//+wnt258alWoBpJkWzL8IxWc9BvHv4MsD+XMWRB4KygKqqRrrUPK5wzYPnb/nf
echo CbfPdkZzVdZkr+MZJLIyhZBgN+dfe+Ccl/dmpxlNupaVVFOrCf/H6jAhDZJHJPPH
echo GQuoDrimEeh22m58onJKvGWdVSIMvX3D5+kj3SRaKNUYOlcZ5bv2nuE5OaeRUN0g
echo 1QtCXof1HK4l8FiogYMh2X1BIkVTSclX/+e0GybOPb23QXpqYp49ZgfoKCGpn+IR
echo mHpKIf29/C0TP7P134HbuqpKXquvAMcIhkazlXrokvUEtL1zpgKpBNH3pnxBPffc
echo lWlJTSBx7dqh4xwBEBL3gMrIO97xXJP+0BeLV3V+O+a2zlCTeK1lX44e3gjewFe1
echo akJIUIF4WfM1wblnr0xxMIBE8chI9nKEGkb+RjHg2HEOX265JghcQL30dchvHA4C
echo DEQEHZvoW/TCFQJLXJ3+mnvx2x5yBNUIi9GTsz8a6A3RZNUmgWPHOeBccE44N5zj
echo sYpcGogIosNWA/vJwcgBBlqUeAr+kvyy8smzfm0Kk1ESRNUomv5XvwHI/wDU6nGQ
echo SADOBee0/p6plbv5+1MprLU44plN9RIC+0nzCEqBGMnjUQsmuavdr5zzDZW2EpVX
echo BIaHHUvxY2SASJCeANZK1K+c9g2+9uHpbqc1wzKEO8I3qtRDBkj6GXk+lQRxuH70
echo xUlf5+nJkcErpOpqRbzrR+KjocbDKvAE9Xk3VkClEnBOODecI851cODK6ykDHJYC
echo JHPoLz0yEhpMohxzKERp+QHjx95ZJ6+2eUSrd+T0m7FrL02Q+bUSoTpor7L/H3IU
echo 5H/Q/+OccG5nnbzaumjnryo/iz60P8l1RKhctdLgMN3Bgw0K9Qc08YdUg5Zgh3/l
echo /JsVbhOGQSBJJdraAvavPT1Klok5pEdrPZSy9t7XQqlrmTj9oYn9704OUyBB2IRd
echo ecLNykNPnO2XzCZTqZbKOboBHjsZYGQQgBKkhpb4u8afRB3TCylQcdexPkBNmObV
echo vHpCQXTnTUEZVlfcLxcMZJIP+OarRQ2qwybASECz6YCKeCgRBQfZfBVksazyiOti
echo f78He3fNgpn8kmAdQNKQchkhQDEWgdEqG6A6dkqhY3rB/PD6n5S+3vs5Pav5FGv+
echo 1x+Gtm9DswSOAAJgYEZINBgTv+xfeuK9aneZkace06GjOYZcRkDGFuBYErhUwg99
echo McOe29AEzY2WjPCGaUJAZRJiXqUReIIwsw6LLyVl1hCPCJW9PXn2mct6+CffXxFx
echo KJSaK+bIUxYAikb4bQ9Y/Ev/06Cks428fyk0BT/7wxWTd0vcYIz6RrWLMSrzpZCO
echo b9krb/96PrBSkSZ9QsouhWKZwu5uBuPGxeSDJ96r/vx3F/k92mgrqcJWdyowXBmg
echo hpSD9cl6ogEWhawEqvhA9sGoYZybXr3JgBvusBOXexCSpFCIrgHkS1SZ7EjysaX2
echo lr2hEWpMJD613z/JYFsXIemUw5tHj/fDmMD4hk36lDEhzceT/FRKjZ99Ym3rt291
echo O953XlzJmb6DHuV+OHAuZNDPON+Kp/lfv8UxGtsyPW8/19lXLMaKY4N8aSvA4ysx
echo hw2gZfS4QLXS3FRKdP74DabQJvhlnonHmXuM1Q/tm/H2v2tURzXF0FemSVQSIkoY
echo EVj2yRKcdbJrvC3zYPHG8sdETg1ofBQV2A8PtajgI8DrxgJiQsEKC8FFE3+fpEbN
echo HhfCHdftAwgAAp9CoUygp6SFP7wnHTz+pGq+b2a6fJLNwNI5/d87VMhXdGhujEmm
echo ZUwl19ruR0HAXtqkqXNPGFc+ec64gNJY+PvWBFvXUdndp4YNpiuZhpWbazz9wAMn
echo 90vtIgDIF5UwjIg+c7zmn73Y9mTsG2s2U/mrhw3IZABMK8XHTJ5ewupGG1/YbTtK
echo g//Rj04ruoEq7KgS/+5uFneMFtEV7/FZSy7UG1IcMo4EyxIg4+TCdHLRpN8rP3tm
echo aRCrqln/Na4XCxgBBECJuBKZ8lR9eTRr/HYLYgY8liALFAiVoCsSWnISWpq4mDtZ
echo hD+8k5lRGBgzJgXGw09L9sfHbMikPMwMEotOWRDOmDWX/OkP9zsbe3vSz6+fHs6e
echo WqRt6S5FkwVTSCIURYvy5VTYXdDIvrwCRZdBvsQGlyKCrCMgbcfQnI2hMRMBU7QQ
echo CR+VsdJqF9OhV7F/dbclwyIHTY2o3djUp1Ohn3nyAvb2eZNafvPAU+WNG8r6opkh
echo K3fvMF7q0uS7z/f8sxeHOkShnqhRmB8aVpOAScxg9vjt+oIXn3WfiM40bOol2Qj1
echo g+PVG5jwZ6wbDPH54x4lNANKFKLAVqtKJUlCLtH2hPWqKh4BXZVg60BMjSsPP6Uw
echo lRII3TKdt/is0qWXfVgIzumZ86anmQyjzr2h2L5LsnntXZamoGvJFl/4jmrt7Ylk
echo xZPSCwRRWS0HVdaGhOooIxBGOjV0Ki2DkPZm1XLDSCLPb3C48odVRNmyncqUjdZJ
echo RaayufCcs5eQc85cbI9qVNT2SSf6v737x+TcOTtNpldUTSWyXAHiFimgHzORQmtr
echo iB88JKBmQDm/7VHySOeZMTGkOhSePXTod+QdbxQAhXxKwY77ogXt66oxPrgZB0H+
echo /jVLJHIC0J0H2LyDgqZJiAOQs+ed7BLChFfuNaZMbVdnzJmX33jfk7KQL2ia7NO4
echo YDIMPLZgdlCYPDoklgmCMSowNCMJJZfV8GDESbyeIoywyKegrg90Z7fGn3mRt3Nh
echo oeAuV22iyXU3QsQ0lW0t2+lcNGbMGDCosHfsKnnZXGMcC5vGpR0WISSq+bWScQ8E
echo IffbNPCf2qHCNbA390VcGmp9A0XrwQJk/YVAlP6DWJXj6Y54QlOXgfwwCdU+sPPB
echo i5YggATfB/AChs4pojvpYP3Gl8MTd+6gs6Z0ZF7asDV+duULgWGZpHv3OkvwmArB
echo kHrIU+eIuCUdOIxIivFGUgqsTPsKqOrsVCBScEnE+FGsdL0lBab04/wLlX6MJDLT
echo 3Or29fbCU088Zs6e+H4zkGz3i6tflHt2bNOCcknTHStIasMNtiYeAPhHnPuEpi61
echo g+7wt8ZTpU6iarLQ8SME1jamjoiJ3rAgYny6s0lYDlfiWKlW20gSe6s1SZNcEPwH
echo wydrliA8UZoGYGgAvQWfnXnmOeWW9jHh7T//hfyTI0sbt+/lQtdl5HMldveZmqr4
echo IIWCqOuovjU6XcmojCdZIYPJ8UEyqWQkqOgqogtST+gSfiljYYpfTHXTCRqa2itT
echo ZsyWG1Y8Fv7rv7yw1xk1xd/S2UnDSrdJaUT7o9iTyXAiI57wN4msDwkCxR9RJIgp
echo WE6s4FqsL8/gphYodbUJ9Lvzh8cCUHJBg3b9MFNEgs9MbSSgAQ0DihvOw5jxKKI8
echo 4lgHJsE8qqhKGERKou2jatiUpnJsW0QL5Yb8O979/l7NzMJdt/wg3LKjy8t1zCCq
echo qdGtm1a2Tp7hKSrD41u94EZnQDQmmcqqUtZBl4QMLAZmbOLztQBOtCZSmD4OU1hZ
echo PGnSzJ3trR2Vc887326mfvDY40/1ELuiEK5YKWWP1dGiiC37quQf51R0dREHCSNI
echo PGqKIqiqCKapArVCphhAcS3uyAsOqlTqly1Uj8yg2gLUUzjBvWUiiCdld2CElyh7
echo auB5LPRCPQikHnJCY8zpJVIwhZG4WMbCMRz8gHHBiXzbAh96/Cndzz75dOC5niL9
echo ArNzTUAUvIlDC5uNkjh1jiBldCgNlmORwhyE7Mtaaln/VJPnB60dbiRmrM+dFLGT
echo ptmFTOOkUqmYV3914/fD8u6tkG4Zq9qmzrcVo+j8EypUUxiveDQpyVh29XBPQfMi
echo LlRJKCIyYTJWdAg0Q48024g0QwkNXAu2NYillHr95K06qYFVGaB+OCCklEyE3NJc
echo ma+o3t4eu+KDXfHKWky2U0b3gMZCIJEBUo7RgqKPN2gUZMgtP1/hyvmLYrojYtrm
echo 7sBNMTfSKRAl3QyKYcmd23dal5+/PTNzvBIXAgDdqIlf/YMfNAE0JlGt9ue4qnns
echo n/T+Z7GEg6IQOaYJxMeWqvQnTwq1wTC4v2dTrBhpYtgp6CsJmN6+pvH950jR52p+
echo xB0Py8BXQivo26z5tNPXVBc0oYKMm0hUGic8Mx2ykuvajETS0lzORCCFSO7lqJtJ
echo cCi4dOTcQOyljtIpbgWRsSi5atCdT8s+v7EIz1O98RnZmtknbCNGyyoBTK0o63E5
echo q9Mi3qm5bgNXuCulZaXC9gZX27B9bdPzG/eqGolEmutBxd9FFo5f3TCqoaI//oLK
echo qRIp23ZGGqYD1nLAB0Qa3PxSmcDO7iq/bc0JyKarFy30P9svJuzcE2mrN6ghVqPz
echo FYOPya5veObFiAQ9O9Vs+zhXlCLpqHuNdyzY0vDCJi3s7qNiZw9XXClYapW0Ol6I
echo GlKuyChJjVAJgUJ5MUe8npOsvHuyUTAoF4WKTojkhsSSubWU9fqsdD3UwIGSK/UZ
echo VkJbRSyKruWVvGyk3kmzU1Z4LWmIIdIZ+CbmTkrABTOE0Bf6Gp1KNe+Gn6+biRn1
echo aEFjdCswBiQMsaAtAbL22cQns/lpgB/emghb+FsZxRL+8mzWa2uSCJ4IlfvlWgXg
echo qm+moLdI4L5rCzVE33/JowKCvuN0JX/Lb/san32hryHxXYqnGjUVIIoFTW463bwq
echo mRHaCpY/TGSE0WsMZMwlGa1o/pJAFwYJTdWsKgTo6M4FPmvp4k7bTsV5eavZXbg4
echo mycRKJrwNCnUWjpbPXBgEBmj9YgKriMRQGXbJ7ZL7yk0zXrGbynMnFLaeM67dzY+
echo 92RD63NPtESqhnwnUaObqNA+k27auymMSe8kpUKmCm6Rsm6bgWrgbTJVIlUtxl1z
echo v+L/4PUDlg5i1riQaTRsUhNts+pdRBdx1pbw/c+VsaQvtDUKCJMglNrmI1uByHzv
echo mVH3lHFGZ8kFqiRvwng+mtgFBm4DlUBCTnnF0yNP2kG8ldHcutiZqCmyQ/ppIgRe
echo E4xeQ6lGIdk57/S9PSct6h3z8G9GTV+9uWmzxkh+YXaPEJDCu2LqtsqH00FfTyEw
echo yfFTZSzXEXXcs2Gz194Srvj8t1Z57R1h57su233KF/5abV73fC7QTalKwZpE6BAp
echo 6BhFCfI7ImXPCeo+u51GOSvWUkagoUo10Pegg4M/aowraSOwMmZkDL6JFoW+qEJg
echo akdSuwfCcnXzBy9/2oy10elygz05cmPOolfc9TXoOfQGlnxV5l0jLvcocXNn1NTI
echo BFaQ0JtEZGtEKpJQqQce2TfjxPzKf/nOWrRC7Tn57N7FX/jr+RNW721coSmFKE1D
echo lniMcEvqsdhD09+HKATWBME6DAtvjIyFiNtWBw1pQkk39ix4QviSAk+DzM74YRGp
echo aRArMcRiTEXSLWuZEk2JSs16Jd2c9RxN4YecA2OSKBS9xJIkwcWDEYRAYlhKzA3J
echo dTWD54yeO8GanMDKWqHBBQb2HfwdEae8u2BWFGby5uXF7KSiaKcGwZufqILXBfRv
echo Q7/FE8vfg4IVxgnHsoEKg/Eb3EY4MSoJoglC62UIqEYEHWnPhm4KrsPuJ3cHAuUN
echo bh+d5BYcT9PB7OvVT/qPq+d0nfWunY0vPt3YuGFVLtAMNA7VwisA0HKrAFBdBWje
echo EWf2eKSMi6wyQW2NK4eL+EHyi+WYwKjx+OSXg2L3EA70EOLPAYHIl1jG8ZAbgt1U
echo ApCMEEkjInOdIpNVsOjtATeiSUFwTji3BddcObtn7ik97X/87Wir0KtVdB2m+L12
echo R2mvu6tpMtcEqox1lgGOLwQgss3rYw3cVzjVINY0yO7Y4jT96JvTBGMQJpsvD+FD
echo ANA9UEWB0jijxnFEBVeoZFhW7lCBHYaE51YzePgpBdqaJcoF4NgSHBMgm6q+p69E
echo oOwBoO0AZYJd+wicdgKHUxbEEOOtH4cQopBYocU55krMi5ToZVAH7tY+yNxjVYO2
echo 55c3jVrxeFOsqhBpWvL7lIzZmKBH6ZRThJ7oP/Q4cgYNXDxQjzElIbIoAqAclSjp
echo CVKomgw1LPpcPS2H6yIxqlbJ9SuvVz3E65gGsGo9g8/d1F/Pr6rg4bE2axYgT8gk
echo Cm1/ZxR++GkNFi+OIer3ARz0BdhlVXFEHsaOaMiXgLINomtSrgYdD1iWDuUVLHHT
echo f9gOVcLmNUF/P7JOzqA6EIGEz3NB+pgtfcJECgBraycLcdBTfwDgfGKVcIlrKCWr
echo CvxVB8IhIQKY2CHRHAzRK5JLCbj97mA0CvX/gSDLoTBlXOKPri7DofpPtA50+ggG
echo mpShCpyESXbrIRcLEbx/f6uoJiEAIntUG9UUmvDtuigDQ4sKPqZ5AfihCc52mU2y
echo U82EWlJJY4j8DpU4DlDJgk9TeL96pDAq0En4So1nUEvkrgBg2lgBbTZL3BroDkDW
echo gNVoRXLbNl6vVjUC4d/wGXx22hiRfHewEelg/VOC8glXqC2I20S9QaTkyEuL8o0U
echo sEexwi1Wq9DiuA5X9NYxL+CVCAB1ASolLWqWel92aumUfU9YUrGGZLOkBIjPJRSn
echo 04KuRaquxSpK+IkWeIjv4waFIYXmZgmnTFOg8xmASAhoVDRY0j4epuWaAEN3NxZ6
echo 4dFdW6Er9JLvnTKNQXNzBL6HgRyHn7tCJDXVWNHDQCvPUovlzaLBJIRgTOORUFsQ
echo Cmbswe9yM8rdek7JCc4EqacaWBdnUH0RAK2tjuDGL1pOLryzZ215nnCdIqXyUPwz
echo eS0FqQdAtreRAp8Dfga8jKXHKmoG+3WsQwy/ymPgE++RcM+zOnxq5lz47MJzoL2x
echo CfXE2qA49Pb1wfdWPAr/9fyzybNJShfy9yN4QbH6oKFxzar4pj/Z7OsaT3unbJGN
echo HKP8DrgmeDDgFeEpyck6Yvo3ty4u21I0J2HN9XQG1cMQVHc7QBKwLdWKmjH+37hT
echo t123/YGJuYgZkZbcblX1/tdiAPD1uMCKD2RHVlby72B7bb1sOoZnGgpX8Y61Iw0K
echo BYWwTGHJogA+/xctcFX7RZAbrUGlr5yEl/fPsaElC38/713A2rfAkkVdEJaVJEzt
echo iP2DJIbKlZTlG0Fctopvz/Rsu0OqY/dAmuM1iPDqOSE1MyJCCiQKvzJmSecesymd
echo kkITSI+GUOP/GMoAI5OvJoEyk3DnWX0S3D2/ffOu5qgUeABaCETjKCegVAyghkC8
echo QMqNHTK/670oOlS0tF52UlZkoPY31FcmtXJiBT56+R74ztafwpZOF2wrBZauJ822
echo HNi5K4JvbfopXHbZzuTZJPZ/iP0rRDDHiIyM6dp2umzuey/dvWESdFdCKXAOWrx/
echo TloEJPIA9uSiym9ObNv0uDMttqRwBOYgDS7wfNzIAPVUA/cDIZSpsTRTD/hT9839
echo y91duzazfGZjbBtFMFgMlKvA3Qbil6ewMkzlYUopWWm9Ymcd39IpV/HkDfWo4MGL
echo AgntGRU+8rHVcPtveiHz/EKYk5uQ/H1VfguUss/A5R/dCR05DXwf77MZOivGR3Uq
echo lKwdWEn4muC08m47v+FlpeSsF47dLU0lBCYYCD9FguIkWqFTwLtn5XRfcLOZMFa9
echo MbTeMYFDUCeH5g6urzMIgUhgiqVT58neyX1rtq+Up53STfbNtnsxLwArdIIKoJic
echo mNTTLOplbTMwU1akG0zgncv9hb6HDMmN3j7AqLQOV31kN6x6+XbYvcdK/nZiqwdz
echo JhIgXMNy8NXr3V/jfNGBhGPL2YGtUq4YXqS50wzfn6IXyz7tAzRDKOg6lNBoF40n
echo X2gWT/VMUu0cdXAt6l85/Di0BA6GqgVEMRTLTl+35rS9c1p/mZ0wppIu+WpIaWIr
echo oQrlTFdjBYUsXROKSiUd4PtHMR7c1zCSAKEKc8erMHdSzQHAdfDx6sLkRsMhCc8H
echo BQUnpXBVsSU1Na56oW8GgRLHKkPnJKYMkpQZaV07VO+61aeWFNtuIVQxkrWo9wIP
echo TwjsTvLdEqo0cHFkvYeIRg+mGpqa3uWOK/7rY2dsv+G9988c2+o7vk9jhUpCccOT
echo hhfP1478cAYxoJrhxQ9VRxBCEqzZT1CGGZJXYwdM1SQ1VK4KM8KrokQUE2kaghX2
echo kPCaR8/euIuMM3KamsY1wLWo+/73O4MSs+Oh1aRXCYGagkOJsDpLhPeY4n2m9TdO
echo VLEJ8zEE0axcSmt+3D1RXn3Xmev8bohbsqGuKULVWfXUJ2bjOr8egSRJKrXlqnP/
echo yKNUrBVNcQ5CxTl53cA/c9eZ655wT5Q4Z5x7UiJhhNYXsYpBjBeWDL7ZQh4WAXr3
echo 4QMe7eyFXosUo5QR1uLl6j3ARC9CPqAKaqVbsmbbfX0nRx/4yXnPr1rlFBydE4zf
echo 5hhSnRh73niNcyTuWLmeE5wTzg3n2Jw123DOOPcEBeu8rtXSyhIsJZZZpci7+qAb
echo oI8Wqqh2eAqwJ3kopGu2Q8GUrt9keNUcurpjaP9RIZQQqgvm5FpyzqiV0Vx458/f
echo +fyP7h3bCa6UtiGIwIycpP7yoc2yx00TiV1J4phx7DgHnAvOCeeGc8S54pwT/B+h
echo dcVDm9ZDsEkp3paHPMBOku95NQK8SgbYsQMf2sdueUbr/iYv5Mdm+uxn+CiwRDwC
echo pW77S2gQRqhqCJZuyGUJ9dRxez/xaGbzH7c+n/+Hs9dMnDWpkgaFEi+kyeL2J1Yc
echo TyATbZkkBa0tXRCIOaxZZxe/9odZL/9s24m9jU3ZbM7OtAiWyuJckwjxftJf59oA
echo mGAbcgajU2Wwoa98z3PQBVBRevHyo8MgwAAeT58u6EsvtRUCd0fnnNzO8b8QHVgA
echo fwQElf2utiQvgyqmJA41LKaMalf0X+1d1Pv7H4957iMz17ZdtqBz9LSxnkMNIEFI
echo sThEog5g9OfrhQuyOvwkJFFhkpg6J8IHWLfBLN/67LidP1o7c3dBG01HtTutRE03
echo SsVME6Lo+/n+AYWQ6gR49XvINTmzcTejQV/XnavTe1OpXlY93EfWAmQ28YCMCnbs
echo 3fbCvDGbztbUxehD0UZisK8YeHKPnmJI1WZ4iVRLo2oGnpr/xpqmXTeu2r3noskv
echo N158wo62eROLuXQ2Rr8SBDEetmrIVoIMdcyuO/iGJyw7eQluuoHxO4RDsY+J5S9n
echo 8798oWP37Zsm9uRpG2/MOekW08lJJZUFRbcJoSpJyH5/byMDyCslYXxh88usr9dd
echo C3BicWr7JrKi9Gq98KAIsLeLcYBe9cHV8NylU7aEHTlf7OsmoCqoEYzseUtuDcGU
echo DWZQSRRNI4bdrpuF0DcLN25p23fzuvzeM9q2py+ctrN5ydSehnEtgZ1K8ST6DlNI
echo Ql4VvvZL+lV2cRQFxqDKTmsZxEkKuSSagoZsmVjtSiUmN+01Ko9saOy9e/3ofY/t
echo HlOMjRxpbDDtdsPJALMzoJg2pXjqk4uIhmy9PFpIUs85QIMt4znpjdoL62AFgC9C
echo n/VLUP3TG3j+wO+ji8ywLMvRQGvd9f34V1/a8vmOm54YY2TNILkHY+ShOj4ppJCS
echo x1LGvowDl/JKKY7cUqHkVyrlStSq9iqzcvuc8ybtyc0bU0xPaPLs1mykp2xBAOuO
echo oCSesOOqlRUFs0RBOtQmkOp/SUGn6gkHhvUKk0gUAqUKlXv61GBLt1lZuT1dfHBz
echo a35Nvrm8J2qIbcdWMynDVlQrJZidIopuEaIYhDCF0P7L70aeWSHxLvkKnDOr6N24
echo 4Kvl879UWvr4pvRLjY173Z4evDqrvwTXYSgAPjSxlcjVW1r3de5Y/6f3TXj6Q7c8
echo MzGUwseAfThmkJxrVJVUBgozJNUcypxsTvUrDWm3EoTZyvLy6PLDy70+7XGXNBtF
echo bXquz5rbVnBO7uhLjW3wzfZMYGSdWDU1tM5hSFotQeRgIKohXpiI6oVE9JXVqKug
echo +9t6De+ZHdnSi7sz5ZfyWXefnw5DZknTMpVURjfGaLotFcsGZtiSqiahiobOjoTc
echo Y4bKwJIdi7UTEIIWXzztOaXY3b3i8U1jO8eO3Ue3bUs2fkgsIOmlr4dFAGX1a/dp
echo v/3OVSvfv2DcBfDcJk2zdI7SLhw7IEjCWRKaSTVFUkUHqjuCWYGmRn6TGXiQDTwe
echo B74fNQdPlHjxoe4wT5/3QZcua7VctdV09VbbU9tSgWYoMWswY4VQQQyW1AsAL6ZC
echo Cip7PSX2Y4XvLunhnooZ7fGsYI9rRQGxuFAMMHWNWQ7TmnJahim6AUw3JcWmGpSq
echo OtAkEpwllrd+xjPC/P4VK4XhZRGBSS1heGb2Se1Ht5O7AHhkRBQNQYNZwKDvvBpo
echo PxuY2J7LvdyVNbb/15bvrrIvOfvSX79TNmrFag77sa7d3x+bVV1QBMwz5UQKTDOI
echo QcZosQqIjAIig4CLKOQ8CsMI/4l5FAkex0JywfGrya1epNZ1ooih/kYoMMqIolCi
echo qpRpmsI0Fe+2VjVGVU0SXZdE1YExHYVUShVM+lBQeE1Oe+0CxP0bfwzXpprLAN2u
echo Lb72rifji63r12U/2XZ5W7bSt7uP5gF6kfzHBxq7D8UCsMVlHga67rL/vNe49Zuf
echo eOT0M6edHj21Tk3ZyeXOx1j5esWCJscLF50BISpLVGpNSIZBhpxLKTgVPCIgIkWP
echo Y0viz3EMQnIpUSoYdCM0Qq2yIF5USwjDODAmQVGAMBUo3vNHVUnxFgsk6yx5Lwqr
echo 1fKE/VElg3PMj+XuD6qgEhCYPiZyLxn7oHnjr8lPAFhRU8IQwOWvhQIksY5V5MgZ
echo Y1tE47a9zcbz/7r538SEt7/7gls/GNukqCfX3x3jeR4aBjPZqpiHkFAKFHqSYse1
echo ++Grm14NPpK1L1Y3En9CMoBm/Co5QHxIqCGyoeSRfn1iUO7S8QGMcOgJM9HPLnlA
echo zir/7JmxV4+5srk5X9q3j/QCFNxBp//IamC/IAiQj7vLltvo5LVLftB448qvPnLq
echo Z86a6/zHfdPUZtsdgeKGw4aBDeov25ps4EApWTzk1V0fHO9B+tnAQBe1LNIDN/tV
echo CH98nACFCuh1dbjstG3+ufY95P3fd77vaGVfCIw98gbz/yP7Ag5kA66r+rYdBy/t
echo NDq/cae87jNTbjXOnl0q91UUUDBOe6R8BMNuA7PAE93v90M+jSF5A59k0M/VDIHk
echo mep3alcNj4y3rj4NK66WPSxhA8X/nH+L87OHKzfetbJxVTYTxT096mC+f1BsPRwN
echo 6xcGNQDbHttGmrbtbrHu++y2z52yeNbF5912ZbmrK0jZpkh07bfg2AMGraLUrzpO
echo 5aFLf2j0rf/TI/OWTfjnjtbe0o5S0A2uW8YsxwN1/8FwuJ17hSxgmiSVs3nzru6m
echo 7PNf2fKV7LTFi9/5i7+pdO9zU44hIMZaDccVYfzzA1L7xMOPRioU+pjjVO78wK/U
echo pn0PbJrwuY7/m3P6dnNKu/N5UQQoeMOhAP1/RyqgYsZ8JkOyilQaeyrptpe+2vll
echo Y9LiE979i8vdXV1hKmNFEGNmZD8zfQsL6guDBBXk+WWPgZmxK7d/4NdqW/6B7Quu
echo af1ivsK3KIqbL5VkvlraKolEHJwHfdBuj/RaMpgVpFI0F4HZ4Ltm+/Nf3vGPo2bM
echo mf+R+z9Seny1mm4w/cRek1z2/RbUHTBeERWZvKvDjAm0+OP3/MRiu5ZvPuWrbf+2
echo txC+3JD2+np7ZQ9ApVLb/PhIgYFDYd79rACRQAfLsh1KcwBGU7mcabz3M9uuOOf0
echo tvP+36pLvWsfnKyrvKyjnQA9dfWPJn9zAkkSlAR4AQVXOtFlp3d5/7HoVmvtC5uf
echo WvSVMdcpmt+VMoPevE97wZNlgN7gSKR/oO+hjmG/PNCgg+XbDjVyhkKbu/tyzj+/
echo e9c7vvB+csmL8hzrnx86N3p2vWaZzGcmZkIkEU91zHh6swCpGnfQkeBHFMqRKWZM
echo EJUvn/c4Oyt1P7/hHvc3V/2449d2pq9Pi0WPL/xezzPKAPnBm39EWvxaxHc6SCjU
echo TdO3OTMzaUM0d3dn7Jljghk/+mjP0jlzR53w2x1L5LV/mifXdOo6FYFiaXEitCQ2
echo lv58jn6r7lsA/daGWiniRMpDD6YbKRCBxiePEv6nTlsFl0z8A9u+6eX1f/uj7G1/
echo XJd+vrGxUPF9sU8Iv8/ztAoAVkeEw+r9w0EAcgAl0CzLt+KYpbO20rjX1TMQWNmP
echo Lule9PkL/fPax42e8FTfAvjJi3PFYxsa2b4+UIHHikpjUJlI3KxJAdW3BEZIKo0I
echo gvWGIBQMMyJ4Lk2ihRML8QdPXE2WtDxLS11bdl53v/rw1+5peQwg7GludouFAu1h
echo zC16nuYCFA7U+Yd0vl6rAj8YCaqCoW2beqw4zICMqSgNPT2WDaA0XXpqzwl/e56/
echo aPbk1MSyNs5ZnZ8Iy3eMEy/saoJtvRbJVxh1A0Lwrh14EwMlAKYOImvFYnSDJ+e0
echo 9cKpY7bRExu3QFZs8TZt7eu88Q/qU999sHklxuw2NLgu50Gv78u+QOFlqOgeQG94
echo NJuPcDSL348Eg1TElGEYkSWE5TgOZKRkmXzesgBYuqPFHfPhhcUZZ8+KJ07t0Eal
echo Mk6aKxnNkw4tRCkSCaVK9t6UQBIbfkYtSxPKUhWF0C2XSpt2BLsfe4m9/OOnnJfW
echo b3c6AXghlXNdBXihEpE+Gsuy70cuQNmvkfzBzp7XtJjDOX3kALlAAzs09FgxhUJt
echo R4M0gJLO+4oFWA4MVBtolJ08ymuc2+E3jc2K9KhsnLJ0UGOeFFo5msitNyTI6m1z
echo mA6EpeTjnb2stKtASy/u1HrW7jR6INbzALIMWujnbMybjkvlEIo0FpWARS64aOIt
echo 9J/6wVa+13yShrvgB7IEBSCjgRXpOlcNKZnJGLFtm+AtGpYXKkbZJRpEWNshiZHD
echo Gg94dSYyvlpfxzTa5HWAwUVtsCANOlSweiaPQI1i05KRrUa+lNKLIqh4XLg0Fm7A
echo Ih9cJQAo9m/8UZH8V42mHjM6CCIwgIwKdqyZQteEiHWpKroiuC4Z03RGNcakirUU
echo qZQsKc6T5J5gOYc/fyBJARnA0mRCEMIJETHnJOZchJzTICI8pDEPCGGBz8IQKkoI
echo UIgOOPGD01GOfiz1m9arEGEQVUgrYHMFhFAMaSgSb/LAylqgYXWt5MaIQd+twZ8b
echo JSCDNyrZuCSGPcQCcyHmwXGML/cxK5PSGCosBlBigF7ccF7vjR8YVT06OUifB0OG
echo WmvAezaR7BOApKwiAXsAAaqB93/OQAZdIYUG2+QmEfwdVszDlheDNvtQ96DXbzj1
echo 7OwQfZMhtGMxnuMJ5AE/H6kd+J26wbFY8INt8IGfx2osxzMSwCE2e0R15P8PBI2M
echo IphgI2YAAAAASUVORK5CYIKJUE5HDQoaCgAAAA1JSERSAAABAAAAAQAIBgAAAFxy
echo qGYAAJ3oSURBVHic7L0FnF3HdT9+hi48XAaxZIEt27LMMsd2bIexYWya5F9IKW1S
echo +JXblJsmpSRNmqRtmNFxEtdMsSOjLIssi7WrxYeXBv6fM/e91UqWbMHKC3rHmax2
echo 9+2FmTlnDn4PQIta1KIWtahFLWpRi1rUoha1qEUtalGLWtSiFrWoRS1qUYta1KIW
echo tahFLZorROD0pNP1vVv0/GQa+wO/znmay4xwou82l+ekRSfO2GYuTh45Td6DzOF3
echo b9HUkDnGnx3L72YNkTn47ORI/77mGiCrqkDcbqD4fUcApNzz3O9fC2b1/LSoQVn/
echo uZm1cADMaOMzA7vAHOgGfeedh/zN0f79XD+bFTQbN/hzneakyew9PUBXZ4Du2AEw
echo uBfMLdsgAQD9wj5qi2YpUQDg77oGaEcPEFkBfd8Q6PXrJ/aPeR7GnzUCgcwRpidv
echo WA109cUpw//3nSAB7Jig//r1vu6F3bJtRZdaTgmRVMllGd8sihMwYA69vjns+xbN
echo DSLkUMakBAxnQOKEjseKPaodww+U+P6BMbL/1X+zcBRgfTL5z1+yHJxLrwACddB3
echo fB30nSmjH00YzAohQGbZ8x1y0r9hNbDV3UC/eCeYbQBR80N/8yvF9nespWflhV5H
echo QJ1HQJ8BUp5FwOSyvnGQw4ETADZblqlFp4xIQy9MjD3363UKhJKSImw7AN2pgD0y
echo WGE/37CDPfL6jw3vn/SX4rfXAd+zENTXv26vMCuFAZltjH8NAFnzEmCPB0DuvBPC
echo xs/Z5n9pO6cnb14sjLwStLzY53o+dTUA4QDgQMKLkXZycS23tEqJMWPuAjXuLUqI
echo ScjMnYYWnWoyhBk/GWN99U1CEQ7Z6s4MiyuuiMf99ExJAGKAWsRKEtijhrK7x0J2
echo 6+/9b+7Brz+wJ8BrLF8O7hXzgewAkA3fwZEEwYwUAmQ2Mf6Sa4D/951W2sb4w20f
echo az+nq6hewY16DdPxpV7WWIZXpCij4uLxoeKa2m5vtd4rlsF2tcAdhza6K+z0NRAo
echo SyHKiSNoyy1wWpMBAi5VutuNQgmELHRGwyKtqmVsdzRP7zZLoo3QU3rc90tb20Q8
echo 5gGJwIQEQs03SyJuHq/T7y76tfG7G3oEe8M6cLYnIBv+ghmvEcwkAUCOxvg960B8
echo /QFr0yfXLAbv63/Sfm2OJb9qZPKSTE5xMC5EucXjIz2Xjj/lXWI2sDX8qXipv6Pe
echo lhmPhRMpylHrR2JG2dlnREOL+VvUFALKoD0IoAj6/4jdgIJqnXdVvMArB2d6e+rn
echo wMb47OhB0zv8QCEztqWLkBrokEAE4me1hH/25kf1N9/175URdC/89jpw73puQTAj
echo hACZoae+He+adOL/6hu6c39+Y/zWrFC/7tPoHBAEEre/OtR/9ciD+Zfre5KLMluD
echo nuxA3ctEmlFiNHCQwEADIXjmpxM+yb9H8N8zYQJaNN1pf6b5z+a/7T+1IYDHhARu
echo vzJiTLcfB0szY/VLnQ21K6Jb9KL9Py26le0dYBKIEmdfAuK/ntjDPnX5H43uRUHw
echo hnXgfv0BG4GakaYBmWGnvv1+9WpgV/rA/3M91N++BrIf/+3iWz0ifyvjxKtBU6h3
echo nTe0qe/Vldv5jc495ZXFXdVMXmkADgo4kUAbC2qAEDMjXrNFs5WIPTJS/RH3kzTM
echo HiuGUOjxo+CS4p7xF9Pbg/NHv+fkdt8zn7EaCUNnWBLnE1sG409e+HvBvsWLwVsC
echo AHfutFpsUxDMCCFAZpK6j+MVF4Lzg/XWuacHP9VxY96JPuL78UWQMKh3rTlw/7z3
echo 1L8pX57dUOoqlmPu4HI4gNabaTB8i9lb9AIIBAMkAQ4JCPCY1MsLtdLLvLsrLxn/
echo L1rcfec8xgMahGIgkM6fdL639DkMS7/iQsj8YP1EPsqM0AbITDr1CwVgDzwAwe1/
echo WlxyyVLzZx4J30U5g3rnOYMP9P9i8NXklflHxnrbEgnMITGq9y2mb9G0CwMNhMTG
echo ASAUlherpdfl7hi/aeQzDDUCweokSLw7xur8j+b/yti9AOBesxjInTutIIDp1gbI
echo DGB+sm4diAcaTr6hT7e9PSvif/S9uDd2F5eePOM9I18xb/ZvG5jfmyhCPRKhim80
echo UKvet877Fk0nmYmNbM0EEhsBGE5c2zk6+rbsLeNX7P63bGb0sd4wZCY0zkf+4tOl
echo v/7nByB4/4WQ+c/1Npo1rSYBmW7mf/sacL/wONRu/9Ni2yXLzEczTvyLKqEwdMar
echo d325+EHyncHVveMRdyYz/gv4zC1q0YloBRAaBzgFfV3/vsF3yU+HK7d8po+Tsl8L
echo vQd2DOlfOudD1Y1vvwGyX/ipFQJHMgleECFAppH52RuuAefrd0J1178XLu7OmU97
echo Tnhe7PSX7l/5ByP/Xn5D56bxfNElMTr3WozfollFFNAnBSQwHnRn4uDdXXcfeP3e
echo P3P94Yf7QuWOl0Ln1/r+v7EvrVsH/vAw6G3bQE2HNvBCCIBDnHw4VgPQZRcC/8F6
echo qB/4z+L7il7yMYckmWr/Zfu+1PsX8vP7L+kPEhAeiVs2fotmNVHQJjGcoFnw0r4d
echo A78RfSTq2vKNRZwbMh66/9r+S6XfwsPwmsXApiNKQF5o5l++HNj8+TaNNx78VPF3
echo u7Px30nN1f6z3r7ro+RD2TsG+3sckwAjrVO/RXODSIN/URs4s71S+lD+8yNrnvrn
echo bgeG86Wa/7+P7ITfuPbPS9V1C0A8sOeQnIFTLgTIC83853cB/foDEI58uvDZjmLy
echo bhnz8KlzPrzvjyq/0bVj3Cn4JLKfNqaVot+iueUppKBNqB2S9Un0of6b97180wfb
echo eDLQXg/d9bc+rF/+6n+pDV94IbjrX0DnIJk25s+H705Yz/iPz/y78X8eeEXfWMg8
echo l8QtW79Fc943kBhGGCfqrfMf3//+/R9k/sj6/mqcefi2h9XLXmghQF4o5u/qAvrA
echo AxAO/Wfhc12F8F0J7x6/5ayPjf317pctiGItXJK0mL9Fp41JoAFrCFx45+INe351
echo /we4P7y+rxJnHrn9EfVSFALrFoBzFHNgRguAQ+r1G8gq9O03gPjCTyEc+lThv7ra
echo wnclrMH8O1+yMJGKC6JtMsUUP0uLWjRjidj/x3ChC+9YsvGgEIj8R25/VL/0EzfX
echo xoPEJgzJUykEppLpJl8rLakCoK+6HNzv3QeVnf9a+INFfclfJ6Rz/JbV/zz6kWdu
echo WiSl5rzF/C06TYlMFgJLN+75tf0fYP74I/0jZe97Xe8rv+btN0DmgZ+C3AZHDBGa
echo mSQAjsT85JrV4N65EarbPlb45WXdySc08PqP1nxq8C93vWKhbJ38LWoR2AYExlhz
echo 4F1Lntr9q9vfmvXCZzqGxjOf6/mV8nvecA3kvn7nIclCk3EtzUwTAPbUx69r1oDz
echo +OMQPPRXhYvWLJa3U8L4U+d8eM9vDPza/PGQuS6RLbW/RS2CZhcSAwk45o+X3rLz
echo lVs+2C7kUHHbPu8DKz44/u+Xr4L8fZttgZyZaiFAToHTjy5eDOxFSwDWLC9k3n+F
echo uTsrwtW7V/7Sjl+r/XXnnhLLuzQx2lCCFfktatFpT4bYOlaNUJXCSf524Rd2X7Xh
echo Q/MSqfUjz7DrLvvTykNr1oD/+OMTkYHnQhs6LrIY+VPp8cexJGuBPKK3XkT+NecH
echo q6t9l+3/qPnt7M5xkbehPoMOP3OoVdMarTk4XfcAGFtKxMCYMFbinw68vmfPGW8f
echo cGiSOWchfPZT7891rMqAxoP1MF6bzIPTIgDg8NP/mtXgoN2/4R+K7+5ri96aOPPG
echo v9zzZ8nt+/u7fRKmzI9vO92T3hqtOTAzaQ5QAyDEhcTsKHu5f9K/na31XbYvlw1X
echo v3It/duvPwDBfA/EEQRAk/9ecAFwuAQi6xYA82NIvvFbxWVLu5K/B02T+1b8/uhn
echo d14wzzHxYQ867TPeGq05gJkzBylPYDgcD8o79vd3f6H7z2TCesu9+fiXHv6btlff
echo txmqeMBOdrTDSdKJCoDDpY+N92sPxC3bILp8Jfx1xou7Bha/av+/Db+6K0yAW/AO
echo TO+d7nlujdYczPg9QIgwMXxh99r+x8/4tWHMHDqjW/7Tu64pFsc4mMWLDxEAJ2UK
echo TIUPoBnyEw9ug8r9f9H+su588IbYXzT+5exvkE2j+YJHoobHf9pntjVaczDj94DB
echo vmREmXJIxSerby5W5121r5AJz/jT18PvPv441HqF1QKmxBSgU+H4Q4k0NgIGJdRZ
echo fcnfUMroxsXvGfnW3lW9DkTWtrFmf2u05qC1B+BY5kAZSvDgfOhAW8fNXb8aK95e
echo n1eIf+MHv1tcW3UgvLAf+CT+nTYfgFX/USI9Pgi133sleVuxEK0J28858KXoddnx
echo gDkoyZqYqtM6Js0uQoZTI4EYdeisT/cztsYLvh+IUYfuhebvZsRaYMBPk68NXtI1
echo uODlB1w3yV+wTP/Bxo2QgP8sh+AJmQL0ZB1/CxYArZZAv2FdoWN+MfltLZm+v+cd
echo 9Vv39fcgjJeN988A/k8fOmX8hDhQpm0Q0ixQKwwamZbT/Yyt8YLNQXoIKIiJB2Xa
echo DhHN2O+JbuTYzIC1MBgVIInZMp7Lf128g0vaUe/IJK/51ocLF6/fDvU1aw7RAk6I
echo 8AIndfrP80A8uAfKX/t9+oFCNjij1r526Cu1l+alNFQQxPCbftzOFKdN28UOWBaW
echo yq3BBeGDwQ5xhnjMuTCHcOIZXbXCQTc6w7RoLpKxAh8x/UOaAUkcWCE31c8N1odb
echo nbOcx53zsw7uEl1rIPvRGfDEAI6J4AdD53a+esHLh5bs+p9F65aKDwLA20TV8m+z
echo TmBy6/I0ufAYiJxMxh8KkM7OTr5ggWS3/6p8qJiVZ9x25j/u/PDOty1iKqbTX+CX
echo LnhMPQhIBharHfVXjH+h3v3EF8kDjw74Kxbm4uLaa9T9C97BHnCuyNVJlmdMDbiO
echo 7OLjRmnRHCCDq6lAEwF1mgVuEr1GPV69ZuB/E/bkT8ijGw94a84oRPSi16ibe97j
echo PsnOyQmQqSAg2GZmevcxAonUjE/eu3j93g/sfEuHqpXZNx9xL3/bv5Q2rOkF/vjg
echo RK+B484QPFEBgJzBLl8Fzn2boX7nnxdfc8XS+jei7rXDH8x+Ae7d19WVodE0I/ga
echo 7PwKAc3BArmz/vLSF+r9T3wRfvrgQPaWnXl/NHLAowrWdFTky86mtYXnrk2eWP4u
echo elfmhswB0uP5JgBHBxiRmREnQYtO9ABQkFAX6jQHRVOKL43vq1268/Oq9Ng9/Ccb
echo gswDg3mnKgVkmIQXzS/Hr7ggV5Xnv07/qPs97kZxds6DkDCdTKsQwMw5aRjpypv6
echo Z9p+b2jRzi8s3jmc+aclv17+0IXLoLB+u21jjJrA87UpP8K1j/UZDn6dEADnLS56
echo j+1cXjvwyc03dxfjFz+y6o+e/sCuX1kURUog6x+TCDolhHemQHWSvHrk0+UVmz4P
echo P31wMHPLjrw/ljiQFwo4TXOvA8kgVgZWFOr6puVRfe3aM6LdZ74Z7ii+2n2arsj5
echo pp5qBC1tYFYRhp005VCleejXe4Orqz+un739i2bbw486P95Cs4+NZBk28sgKjT3/
echo 7F6oxAw7BVtB8KoLc9XKua/TX+357ULF6XKsEJhGjRaPocg48OEVd+5406ZfWhhU
echo w/EPfstf+91b2DjvH9L791vcgOPWAk5EAFjmX90NYuPQYvnFD1TWvO6C2l202Cc/
echo vvALY/+zffWCDKb8TuPpbyeLeLBcba3d9O1r5Z/dlilWtQu5BuNjH8GJzyJWGwEI
echo JYW6JDDPj8w1C6rRiy7sq9XOfJn5Vsf7soPeYl/osKUJzBLC9UcUXl9WolePf7a2
echo ePt39EMPbfN/+ozvP13JUIcZyPB0EyDjN6l5aNUSBsoAfOi8fbXBd34Fbsu+PJvX
echo JdAk7SA8XVBigRbkwr7x0Y+r90WFwXv6H9ub/9W1Hx771IsvhPytjXZ6k8YxCYDj
echo 0W0PCTl0z0MHxM5o3Ur1ci+j3OHeK4fvGl7axoxMAT2nkTCKQ1UCdd4GY5lFJtYE
echo 2l2Zbgz97M/izxymocNTUJaCfHVrl/c73wg77//cJ/Lv3/2hqtE6mXin6VNrWvR8
echo 1Iz2aA114+t3jHy0XPnKR7wP/u+Brk8+0ZXdF/i03VPgc20ZXx+2lvg97oeiiyFB
echo DWOim1TcboN7yXYDnEbCXBqHSHhytFjc2PHyOjAB/fnkFwAWO1uHixNl+I2PH3NI
echo kJ5oR58dO4rQ0dGRLwj5KmM8eMC9yewqu1lBJIof26pz2obWhurIDJs8zXf3Je0i
echo hkg/96s2BQEnBtpcibnL8MUdC92t997rv6r29XIZ8mhS2H0wre/WGkefA+RRLU2N
echo ZOGi6IFq/uEv8X/ZOD+DHX3xAEAhj2uc5qUcnaQGcImEeb35+ADtMQy1v+med6t/
echo KlOLKPtJeJWfiJ4gx5N1f/r28vKdOzNxd/cRKwVhqjUA+3VVJ/CdpXz0D283a3JO
echo cm6UWVi+u742o1SjSe90xk+tBWSAaKXrUpC4fTF0eFJLjTXXz/+SeAlU/5A6nAT+
echo 67F89pIn/8Esls9UI+MSovX0vl9rPMccILMQ4uggeuOuvwg/fZ8uMNCAKv+xMH6T
echo tCGQ4xL8rt5kzBRQ8OOWSB0F05sXAAIkPDQ2vzDSeeFIJiszv7DWXA+wP1o9r8hP
echo JCGInogTsNvebE98xRJ1vZfVbKTr4tEtlbYsB9nQk6ZVAjSmyug40bqUWwJ9OaNQ
echo qh8P4WbBjbO/7pCv3jmQf9vIx+ohCE2MnEGZYq0xeQ6YTkyF5OC1tS9WH7n7wcxD
echo B3IMnXyHm33PudEJQKKpPTRU+0JTlRyYlspmtEx7HTsQBgoG6sLfnr8iAupAdyZ5
echo GcACZ3TsIBrXUXj3hATAEav+RsfQIO53i66+DHOJNjkXmv011+cExayNm03rPNmD
echo ADOQZayGeb/qb2MKD+7j9UzgxmlzJNz8TJsLD33DuTK5p1SFPKFatrSAGSZ7iFYm
echo BJcs0Tsrazb+B3z+iUIOoz3NxL5jJdIwAXqzRlcyC3UUGwVGY53uDNAAEDREQxAz
echo 9mC8xlWsmLhUrn31pZXeJ3ZR3d19xCrBKdMA0tO/G+jGPUy9+tJ6j8vkBfgQjyer
echo RSQppXaWppv7UQjZ1dJMhmqYdCU9Ha7E1M8TDuUSgE//jORfuu1vkwxUQ2VbF03z
echo bmiNQziDaAUJcPmmvf8UfOOugdxw6ICgJ+a5U9pAf5GoYd4ntYzx9G8YEDOhTgAM
echo 7uUN9YV+lFtUyrm6+51X0TMBsnE+3z7ZD9Dk2yl1AkImg+q/l7z9GnpW3lVdUW5x
echo aWN9gU/TOTIzaE8YrmMzqDtksb0Qe0wfsw04mZDNs1zDYyM5Vh16KveG0ucqVZK1
echo nuFD0i5aY9rmAJ2zVZon6yq3lpeM/si9daDTzfNkwpdzXETSHILeDlcOkZ6EysgQ
echo 1CjTkMG072/0cXAjYUclnxnKn13jniFnzTOXAuxRPZ46XABMvQbQnzUUYH9yVre5
echo mPuG4EM8U8lnUvt/JtX8A6Z8mlGV1V57V5R3JKAj8EQINxLmEJz/jkszr4Uv0f7K
echo 5mrCPKwgS8Hcpv1UOA1Hc841NpWh4CXl4E3DH1dr374m39fjQJyku/F4yaDvhypo
echo b8/FB0i3RGAObRVbq13OiP3NiIaROnO3ums1EI4RjnW43cfHbaz6SGhB5EQEwJGc
echo CXRU2niaaPOTNeiS2O2cqcdD5qBtMtP2ByUGqokgKtefdHnKSIu+enwbglKAINSw
echo apkHZ1/cCYsvbsu/af/Hoog4EtVOez+7c1rjBZ0DJA3o+IMaz5sb9322evE5Y9mO
echo sxfSS8/z7JoxdvwSQGEEQCjw2zqiYZU3dl83WWGG7Gt0siWS0G3yDK5oTjlMnXnN
echo uR0d+2tUH4YRMGUmwIRNUakAzMvP8wXTy8C4sNssJlFCGFbb2cL/6R6NWSKoKwGQ
echo 2AAZd+fJ3rzRErOlj5MoIRBFGq68oh0Yi0GcudR51eKfORcNfK9S45gbEB/UAlrj
echo BZ0DoqUJqQ8Lxx+vvsX9Mi1cflbGqACuvrqj0XDj+NaaEHQAEuj0lYFCb1xVHmHE
echo 2P8sC9jrTf86E4PwegZ2xr3COG2hIKpv7TLWVSpR3d7ebh31x+oHOK4oQEdHB92/
echo n6mLzoUul+ilShTDp6N+p2EezSBFmGAwggBB9iVsSPTL3gKV+JzHeyZYrHZO4Mor
echo iuk3SkL/i1fm31n7N5WJRuuScEw8mgHvfJqNBjMooMlbBv4xWH19V4FnXSBhDJdd
echo XID2DgFS2o15XCQ1QHfWmJI/T0aGMdxADdPWdrGYCQMbi+KBuycouvXM/GrW0+61
echo Z8ZLARzZn7V+ADglPoC8Uvh5c/5S2c6Z8ZXIJmMqx9LFsKsyAwY+LqYB4MJRKqhm
echo g7RfL+riiY1PHocEwGWPYw3z5rlw8fk5rBwCSBKgPZ103SX17Ev3fqpWZ1mDTqiZ
echo 8/6nw0gdfzWegwsGflB9ybInfLFqsTBBADrSsHiZC2tWZ6EeKGDHUZJCUAAogCXt
echo IEd4vzIENVuKlmQa2rZba2a8P0YCSonDQ9EmKTek3ac9+HhaH58f4HiiAMTPaoYR
echo gEuXxGdkfeXWsksqO2ttHiYnHL+sPWVkzXyC1XuEUp9qtkUvNMuW9lfn5xKI1bFv
echo CEoJBIGGi9bmoLNfgI4VUJSv9QCyl6zMvCH3Hb5o/PFqxDJWHT2lb9WiCcKYvyKc
echo 5KKR4B3Bf6ieFy3PoWC257TWQP1UY0vQ/juOXFdjwBYJXbQiW9tMz0p8kFwTlqrU
echo eOjOHCKCKBiuCXfAXZUAp9BfkOcACO1l0El/7EChR5ueIxUVEG0rYhJWCUliE/5x
echo wiegvhun70wYqQ5gTQDGDBtWRbar47LyVYuTpJ6QY65TxPfDBKKrryxa7CT8N97A
echo aAXEEbDquq78Owf/DksfE5t/0Kwmme73n7MjreAhRpqAZtWr9vxb/bJ1tRzr6aAm
echo TvBYtC22INFw5eUF8HzaWLPnJ0oA6pLCmp5I0wXnlJ5IloAvFMdTAA+TVP+3miXM
echo lIH8SOwLG0g0iQASKhUKgM5jTgY6Lg0gTaZjemGbXgKcwBjvV+WICkwASj83A2YF
echo CfeB1hQ1RSCM+VyJO/SlwSUrslX/OPIB0IbM5zlcfmkeIFSp4EAnDL5pPQRn5UJx
echo w5mb/HUD3yrXWVoslD7CdM/BHBwTqq80EfXp0rH15Te2/5DmLl3lo0ZGmmuD01+X
echo cP45GVi00IUwOrZwIGnY/9eugPABcWUVKBFA0YCgmE7U4JMm0tb0D5REsSR0wPQT
echo AAFZrpYCeKJWe04ePhkfQCfxfJwIajqzejEwAuPO/GQ84g6aAHjkzoB5af6ffWQU
echo 3YZwmuFabFRLgPafOb62JzIo6Z9PC2iG/85c6cHKFR4YzP9DkWKvj10ODJgohq6r
echo zsi9XX7K5MOhOqqlqJ5O+xzMxWGXNhUEWpP4LcMflUtf1FUARq3aP8EYRINKNGS7
echo OKy7KA8B+gGOIRwYKQILcgksXTavdJ88N8kz6RjCmSEEtwqC8swMcNuGLEQnYCQJ
echo G6DzAYgDntBLACKR8r8N1Z+0BvCsP04dDJImkiD6CDCTEGxomD7YdDtGDlW/0XuL
echo yj4hlBHK0ZZzHuCXV160AgKU9OQYw39XrCuAKFDAGCJO+kT6H2pecQKss0AuvFTm
echo X7v34/WQ+srCS0+YAq0xlXOAIVfUtK4c+GrlplWbPLF8ATdB2BDMk9bGpn1ruPrK
echo vDXdn0/jo1b9J4Am4o78BePDpo1zTjjg3iHII808gJm0nmnGIm80DNaaJHgK+8cJ
echo xnEceQCmYQLYzEj7dxiOmKFkJbbBxSOUaSpYwVHuveq8eNnS/nGU9Cjxj/rHKPIp
echo gOtQuPLyfFoV1BS9kwZ+xtRCyF1yhvfG7pv58pGfVUKWJdQkz7PlWnTcC6qVkdSB
echo tmBf/R36U9B1zRk5CON0Bx6+LvjDQMO6C3PQ2cVtyPC5zABjwIKEXLLCr96hLq9n
echo uHaBOpxQdPmiE8AmCM/IzT5R4maf0aBMQM/VMdcDHI+PFEv97U0O/bGZeSN93HR2
echo UIWjjAtOxbBu58/kLyhZZ6A81BmIy4uqIseUJg0wPCwhn2dwyQUZgEBZk+DIOlmq
echo Tiy4dkHhPWN/E7Okjt4CAI3liDNgLubASOuuFITgqjft+fva2itZjrbniJEy1cQO
echo WxO02nWoYPEZDixf6sG+/amPFtcXx2RWpg3n39qe2LC+VWNPykUk44JjuLDMn4bc
echo m84/M/NGs41Byvg05dEJxp8SJ2DjYs1Eet2QMo0bz9SRvj6aABQo44Z7PCuMd5u8
echo tH7Jiky1iQnX3BRKAZTKCoZHJbgegcsvz8Ff/NF86OhgYJKG+v+sBWh0PAwicJZ0
echo s2svPZB/055/rNRpVhONuAEzYB7mwEDVv8qLcPXgV0tvXHanl71gqYualw3x2erP
echo ww+A1BxAQO8/+GAfvPIV7VAoMhgbl3YkCQqJdO3xK5qEL1oOwf3ssrIRjkOYI4Aw
echo AVjgim3tbGLZ9M/D0cahh/RzMj453sYgh/xBwwSgh5TW26c49DFmBKWpgEZjDAdV
echo OcZFxiXuxnBplfWtGDuv54m2B/a4BBI8RQh0dXG48oocvOLGIlxzVR6WLHYBBAGo
echo IMzRxEWPcJ+DpkDxqpX+W3Z9L1w/8qLyxs6r2zOyYjTFi7ToZFT/hHqku7a9+kvq
echo X03vTSvz6HuxR/LEvjtsXWwdCEYDFFx/QwGuv6EIg/tjuPeBKtz84xLc97Mq7N+f
echo WEHgeAzm5xNYuqSn9IX43KSQNVlDHcFwz2Ai0EQa8Ezb45Pff+JnTWcFmcrOQAe3
echo v4f/LgBACWYFWdPPZgNTQzmnwhHAtXs/WVe+dsUTwVM1nnnp1Xl4yU1FuPiCLCxc
echo 6AA4xNqPJlCg6+Y4CkpsZRosuHFJ4QNf+MvRP8h+sR6IQoahKUBZqkK2RMExT+Wk
echo ZH40PeP37/+TYM0rs0VayBBTjzDF4/mvg5ZY1fqrobeTweve0A6ve307DO9L4JEN
echo dfjxrSX47k/q8KLeUrIzf8HYqOzkvS53DefcYIdbFCOpGTnj16958hvwMaAJR0gG
echo MicqAJqvTvyj3HnmScfJhK5Awghj3FBXFNzAu7O0ZvzlZ/WXHv6rYqZ7eT5VI0MD
echo piqtAx83F+4vy/vH+G72o1ECvK+NXfqi4cKbb/270ieX/ZOTlWVmq0ibldItOsZl
echo s5V+piLazMt2f6L0ijVP+d7ZaxxTRdX/2E/kppwwsbZ+Afy2q43CDTfk4YaXFOBP
echo DkjY+KUd1Q/uvaieawd7+mPUCO3GNJxm7YyJZ5o51OS7k3uoI/kAngdTTKPbZcbE
echo RJ/bOLJ5UqkWAIwB58IR3C27Xfze8jljxVIpUYEBOZqAidM4P0PXzwmVfeiGKRCA
echo f/5S941L7/DQZq3yYgtC7ASmkyhpApYly8cfqrzP/wwrXr0iZ0N+dm2OH4kF8wMY
echo M0CZASMVyHEJqqyhUCmbDcMLx3Y6y8EX4BluBUAj/k9nBMTdc+/xIwoHAtB9NH5+
echo XgFwVEpTgXE0/2w27CT7/hjLYRgNMNwVWcd4d+hL6lseDqvMJMA4fuwgI5/YaAgB
echo /Jok0HvTGflf0v9mumvPVBOKaMJYKzAD5mMWDCx0MYQSLuvRe0c+Ei1/aXeRegys
echo p/aE12nS9YkBRjUwl8D+J8aDm8sXlbnvupR5AjVFIKj8IePbhPJpn4/nH03yiDH1
echo Kc8DeG6aBfvJJoOgRLeVAQ73GHh7syvg3mfmjyV7xw0RmE02RWEZrBVIJNC8R9Zc
echo 7xTeP/AngTE2WwPDSdM9F7NioLDEXP837f1o+dpL9ufFoh5mgngi3ffkQ2cG3UIA
echo 5Ro8sckrPeGtTTLMpKc/4XgcsDSuPoNd/5PHSdAUdL2c6bvJbppmYiAjjArKXcFc
echo x/1J7eLy6FOlwHpCUtjnKRnWFKhH4J29wHnFeRv9F+/7XKnG8xpt2mmfjxk+sJ6i
echo znPk7NE7ym/q+a4oXrXMx7qLtKpvau5hIb4dAtVtI/LWgbPHAr8T80RcjBRh8o89
echo K9J4+iyQAEejQ5KBjkr8OBj9iCGGCcH6PI8zvWSlALoDGBDOFXdFRoTe497a8cc2
echo 3lK64bJahrjus3tFnTAdLBgqXrUs9/5dn4m2jF9U2ZE/r+iqutGUz2B/8vQRIt0k
echo RJBiOFT/tfpfyUWvmd+Rak2N3O2paDnXZAspYecTSfVOuKTuOSRruG+df3j6p5mu
echo jbNxhm7qI/unU9CS45moua8BNEJJaWKALe7C2gAhOHNrfgf/6eDZY/VtYwnG/LHM
echo 98R9AEewN5UG6jJYflNH8b1jfx0xVY8wdQh71x18ttN8NOcAk6q0BMRafPP+v6+u
echo uyYo8L4Cw4KrtOLVTMnaYOEQEQTQ9LvnmfmjezNnAJqEwAUHyhrOP8s/jSKCmT5O
echo jua+D+CQVzWY22mLgwxDLYB6d5lL6zs3yCpg5t4UO3wwqmDCGPiiLn7tJXvyb9z3
echo z+WA5RSWtE48mznNR2MOsNlKjRfJ1YPfKL1h2e2+v3bRwWy/qbyhzQkGGH2qEvy4
echo dnGZuZ5LuCuAcEFSBKA09j+DgECPaQ5PkI7DBDgazfQ8gAalzkCjMTWYUWY4OgPr
echo 3t7Mstrdz8wfW7FnrE3MbyM2HDiFCro1BWoRFC9f4r9113ejR0ZfVH6y/Yr2jKw2
echo sgRnwdydYkJ4dYyUdNV2VN9L/s30vXhRDmKZOvyneH6QxU25Do89lSk97qxNMlxn
echo DRMOpZRbFXHGZv6dGr6bAhNgllCaC2WdgbZEGCU+dwSeAD+uXlweeaoaAm+cEFMq
echo nhvqp9Gw8Ia+/K8FfyWL0YG6JILYvgKnO6UOJMxhj3956M/qa66jBVpwj1roczLr
echo YHEDHAr1bePypwNnj9Wt84+5hDlW/bc4cunpf9r4aE5OANi5nQEVUcccorPHjZUA
echo hFKbE5AR2nvcXZs8uiEzpkdqQNA/Z4XAVI007oyQVbw3z9ZdUym8ZeCfqhF1pS0Y
echo Os2xAzAyghGSF+//n9LL1zyW8c7uc9JU30nCc6r8MhbDIYanH5XlO8il9QwHH/cA
echo 5odgbZDtwN3Mmp01e/rkzpDTRwOAg5mBtsyTMkYo+gK5G/rt4muD64bHHh0NU2fg
echo 1C9U0xTwz1vovuGM//OvPvCNUo1hluDpix1g4/0sS1aU11f+v/x/0uJVS3KmfuQa
echo /5MdRmkgLoNgy6j8wdZVQ/vQ+SeIi3khtlqUWPA/+1hwGtFJCoAZIAGPW1qSSc5A
echo KvAEyAvt3c0uDzZs9MahFlgn0anw1qRZghL6rp+f+yXyb9BV33kwS3C65+YFHhgJ
echo QbHIVRC9d/xvouU3FYsYMbFgDKcCgd8uu4TdT8S1HyZXl11BfLCnPzr/LPOndf92
echo 6Wfbvp42ATDLKJ2rNDOQNrQA5qAW4NWz3fwHu88dKT85FhMHtYAjowCd1EBTQGKW
echo oEvOu87kf3nkz+uolFrZ0MxBOB30gUnZfm8c+Hj52kt25vmCdp5m++FcHQl74cQH
echo anS4ptEzJf1/mxYN7/RXgM+JB8xxUP3Hst9GW1A43YifvAsAD6+DOJgzn5pY5oA5
echo AbZMGJNAfF7yf6SvqbzxsYfLF58XdzUwz6f21o3SBJsluLrXefmuRzMPb/zf0g/6
echo fqkrr8qgTCMqMDsm8gSJNJp65MnZY/eU39r7bVG8bLGf2v2N09fSFE4CXooSGNxQ
echo r3+zctUY63Jc4I6DmX8WKwLvjI7IYwEQnCGEHNfku5OhuZ8H8KwxMWWoBjCEfyZc
echo CJczbzQ3n/50x8qR+pZxRdxGfcCpMAUsilAMxSsX5N5f+E+6ovpIOaCZ06Jq0GL7
echo EUHaosH6B+KPyIUv7sxPfeTl4LB4gA6BZF/F3Pdk9+jWzNkqK8Ajjcw/cvjpb2bh
echo OAk6vUwAS3bG0jJh2/eJWbQgEL7wBPW/Hb2otHW9KWGqqP3sKbHZDmYJrnhxpviu
echo 8j9HTMdR+qspWNUZSQ3b3yiIiKteP/yJymVXjuV5b46ZSB5E+JnqgUKcAQw+Wgu+
echo OnrVsHazLuWui6XhQChP+z9NAN/C6UZToAGYWTaaD542ECPUVgoLtAczArxd/jK4
echo 65mlI/GusiYuaoSn4nRq9BUIY2CLOvj1Z2/IXD76w3KdZQ82F5n2eZr6eUcNJ6I+
echo WVZ+tPK6vlscb02fh5GRKc/2aw4UONjRaawOj24qjj4szo9zAqv+PIFrTtEPNDnm
echo Pxvn/STpNNQAJggLvm1IkKAzkHMHuO94nvC+U7mstGt9XJ1wRk1pPFof1lwkgfZL
echo ujNvpp8jhWgoUAhHf6z9rGYTpRjJ2FsieUv1E/Giy92c9fafkvlt5P3bqj+A0cfK
echo 4bf3XzwqMwWHOa5LGHfS0B+x3X9nP1wTmcZEoNmayHLwJTAEhJmBHB1DOQH+Rv9c
echo ec+WeSNysGrIKcoLSJ8Bw4IKaNGnl1w0lHvVyGdrAcloYuZeghDVCdRpFi4f+2Hp
echo JWf+3BeL2oUJ5MFCn1MwbFl2NYInN2bH72SX1XOY+MNch2DZL2aDwuTQ3yw8/e0e
echo Ojk6fTUAMykxqFEfAEw4RHgO91zv++OXjg88XA+AnVoPjs14C2PIru3x3tTzHbas
echo 8lglon7abXi2uwMaz48ajQIOhWg4eAf5tOm6rDNrMNf/VMT7G8MKbYdA5clyguHd
echo ut/FhRAuYcIBgqE/RASxLWDgdKYTFACoYjVouiXgCUvOBmelyV+IHc4Is1WCTl6A
echo /6BzYXTvhr4hNVw3aEeesiYfdrNihRqBpZfz/Ntq/54ohSoA/v4U5CK80HNs4Wql
echo qVPfvGrs87WLLx7K0zafouYzYQKcgmEFaxTDhkfc8ZvVVdWsY9N+XeAiBf2w0I/G
echo 9pCe9nk66Xl+wQXAJDKzfdgEUGII4sBTjicEFY6rvYJz8+iF4+NP1iKbGWgTg07B
echo sM1FDJggAbGkTdyw4mH3otJtZVSX50JY0HbzBZcsqm6uvrbz+zx7XqcHQZIy6JTW
echo XBxa848p3fVtFfV/e1aNDPvzqcOZh5l/ABQHFv6QWQH483xjulOBZ/1/Nt+n2UcI
echo 8wI418x1skJn7mGXBD97pG1Ul0PrTT6VK5n2tVfQfWk+9274pPaT8UCiEYt9BU74
echo 7ZpM0QA6McqG4QgcZWBjUxyT/gavccL3bzhRpWHJW6v/Vl95mcwd3s33FEkdACVh
echo 2yO09P3wynLGJb4RrgNUIOgn5n6kvSPB5mbO6v9OVgq0NAA7f9YRbBuIANaFc0cI
echo 4ThVt1P8aPD8keqWWooYpE6tuoxYBKwrS9ddsCf78tEvVOskawgo8/xgoimSLjVq
echo YqSWDQNFHZDMB8lcSHgGAp6HgKaj3hjN7/F3+Bn8LP4N/m2KjwmHXnsiVfe5+dCC
echo fNAsXDT+08rLlt+fcc449Y4/XCNM/In31PSd25eN7PDPAF9QD6zzD0//ZtXfxBk2
echo +8e0A4JMhS4yvYQgkPg1bSNGmaO56+ad2L89uLTyxPoHxi4/M+oh2C/yFL6qjYcH
echo MWTP78i8Zcs3ogdqN1b2+4sLjkmwcLaBVNX4LJoO9rRDK4aBpC5IEI2yAgpC1hMu
echo Y1mQB7RjQiOBgWdC6DYDjVzEI9wfjBkifRASDzgoiIlHKrydJtzhCc8LStJ7ckiA
echo 6xjVezsfae+8Q8+S1PFHIZuMBe8mn9I9l+VzqOEgPv8pdbxZ4QKw6+eq+p3q5SW/
echo DVV/D3P+nRQHgjXDv2R279up4buTFwBzgv+RrEmYNhDBFFHmOK7DvCF3Xv07O88f
echo Om/7fR25c/PcBGkDkFNFFv/S57Dq8jj3xu9/evSfvL/NuCbieMZTG7FAs4VDgqc6
echo cTCuDiIJkq5oV9wnd4NHIr0YtqvznIeTBe2jpM0tiWKbZNgqk2oJ+WzIeZbaQ/yQ
echo t8cmmTVtKjVPasqBgobSOJfjUTHZM9ZhHqteIHbCMhYalw7whTDszncSkRPoTuMm
echo BtEUCI26JtRc6qQArx/7QvXydbtzrKuPmhra/vYtT83c4X0dCsn+urlt89Khje45
echo qo0T357+VHBr4h2e+DObaQqev6UBHJzIVAvAdjCUMsOEwIhA1lHebfWLa+947Gfl
echo NStlx6nOGUnrBBIQS9vEy5fe6d22567Ko8Ur230ISUizIIGDJ6txX7Q1XpJs0WfQ
echo rXKN94Rc2bfL6ZtXc50McMczlLZ7HPKc2A5XqMrbh8ZwRuboz08AcvaETj/bj7a6
echo HgWoHDCvG3tUxiHRcR30wL5stGVkUe3x0rn8ab2C7xAr6QF3oROKgsONBMcEkBhO
echo 5oXbq29p+xrLrmn3reOvcTqfMrLXNjD0eFy/uXRhmRVclwob93esaYdAMEbbSvBU
echo WsAsppmgAUyRHTJzKMWetvXhmCnGXMcTobfHX1r/wZazh1bseqzon5FjJjy1WoAl
echo raH/ci/3rq99anSDujhgKjIr403qTPmYvtq/Kz57/g6vZ34oMl0kAwWPQ84FIO2N
echo 9SC257WJG4szcdzj902I7UmaePPfh6xjk0E4kIwgtJAVHjHgYXvYC5S/srodXlHe
echo KOvDJjmw10ue3L9k/K7y1c4mvpbuE4vYsNvDP1D9RHDWS2tt4LUTbLZ6SjUnfFxO
echo QI8E5u4n5g2v5xdEeQfaUf0Hxnma9tsE/J303rOZGss5zSbAycciZxA1DikEh7R5
echo AcJwx/WE9G+pXVp+0xOP185YpgvprDc0gak+RZolw5EE1u2xi87fk/vQXR8cXb5w
echo 2Dtr+V6n0Kt90esXoegRIBnbCBbRbiDAh0kmvcikRzu8k+7hz9389+EM2lxXDA6k
echo TXYP/oHjAun1eWY+8CVrtL+ktCN/4+BT8fggTbbu6Q8f2nNm8uIzH8y4K/IOajRp
echo Q89TaP6j3cEZjD0VRT8cvWhc5nIOFRybfTgY3k17ARnbImr2cz7S1PDdFJgAc4xS
echo HIA0PdhiBSBuYOBt81fWf/LksqH3rH065y7yqUGE/0mNY6eUbIdiAAgVdK7xvDf3
echo buj1+h0OmWLa8CXRYOoYpsNkmoZV+1yMdawb5Tk+dqjbEKvsUPAogKjxe98lYoXv
echo dq8ybncwnrtw1+2x6chx1EQOeYZTNV+cgBqLzIOPdI7eSy8M88IUgaHzT3BsCTcB
echo 930sbcVPIzpJATA12UgzimxI3oCFD8dyUZsY5DnM0d43xq4ce9nGrb2Ll+jcC3KK
echo YCUrN4QtyXCrztfS3gWW32dAEvchgkepVCDgtFAG7oqCY7P98JFPMc+lzj8C1cfC
echo 5Fv7rh2uZTt4pxAuUEz7pdjsk8Ksgfs+VmqUOp+kDTAlGsCccgWkkIGpL8D2iWPC
echo MM/J8NDf4p4Z3r9x/ui8C/ZnRZdDTHK0gNoUEspX7Gt/+Ck/Ayd7AlIT4/EYLZn4
echo /hTf17ZlT2DDo/nx+8iFQZabAq4ZMEz7tQ3fG4g/cwfu20zRtLZ8AEcmgt5ijXsG
echo M8cYd6gQrnKy7leHrxy++tEvdc67SWQhRofaqd9Ts3HbvlDPbPH+fAaV9WHy7R3r
echo hoa9PtbpCNcWdiHeH1ZZpK6/OQa3ZmZILcBco4n5JA2DEasEmSDcE3nX+A/y8+Of
echo Prx0KNoZauI1wUNbYzrmAFONLeDHeGx+/kDbyA/UVdWcQzIGPf98otNvs9nHHGL+
echo Js0EJ+Bc8wFMEAJFa1QbMW7MgXKXcTemrvI+M37TgYvu+kzb6jeothdCxW3RUQjl
echo gENg//1x8Nk9L98/7vewDuv5x1Zfaaffg4bTKXRCTgtNDd+duAbQ3PhzdaRzjNpj
echo GhKkQuDJkhfU3yxW6M9uXLdn9OEIs2VPGXhoaxx9DlLVH6C+LVTffXDVvlvhsnpR
echo aDz9U+cfYOIPtvqzzj+bNT1nx0lQKxPw+Qk3EAKGcMKFYxzPLfph5mvj146/6IFN
echo QzctG57ndApikhcgOahFBzc8I6BrGjbd7Y5/unzDkFPgPnF8C/hB0GSziT/o/Z+r
echo KpqZkvdq1QI8JyFikM3MQTOAAeGOZp7LuOcprxj+x94b9q688yv5la/F5KC55GCa
echo 2WTrJVyAA/cm4ac3XbNnj7vEdDnCB5ae/hj3xwqp1PCfjS7UY6Qp2G9TcGbNcd3K
echo 9oxCjyBhhDFOuXDBybgFl2QeZOfG33xizd7qU5EkXuqRnv5nntvD4vy7APHeRN/2
echo 4ILBb+urym0uZI2TdUkK+CnsWjWTftNGg3N4nBy1NIDnpIkJTstHMaMMe8kxx9Nu
echo Ni740v986drRS+98ZviaeeO9vEBtQdwcPnNmBGH+xZY7nPInD7x4P8tkXOr6HhGO
echo B5Q7h8T9MZ9zTjqoGzQFr3bSAuBwbJe5SbiRNNXYRYZSDlw4RPme64bJiN8bffKZ
echo q/eseuh7+QU3mSzIuTsLM0L1zxIoPSSTLzx5yZ4n2Kqk26PtIHzPMOHapC0s9bNF
echo 042/wX/MQYFspojnWmHAYyULHIilwgwhxAVw4SqRiTu9euYn4SWl79//1P63Ldi8
echo uLCaChO9ABmCpxml6b4A4W6tbr9j3uAXgmtGOwoma3jOpdxzKXUEbZz+Fuk5hf1q
echo /DHMQTJTEoJvmQDHOtkNh6BJG4lwQ7kjGPPGWVd4of9wfnXfQIEVCQLgNhbnpNal
echo RUdaAixAIgQ6MjVnpV/KbnKWiTbBXcM4ov2kFX82598W/sx9Mid/iVYY8LgrBTUl
echo lFBBDC+JNnEWe9T7yMLP917w6lKn6KXEBC0fwCmbegng9xt22evGu//mu/9N/99Y
echo 99gWvtYpEs0NxaQfG+/H0p+5euxPoqkxuk8uCnCKwV1n4LDOZaI1rbI2dmbytPlI
echo +z+2XfDqsXbRRYipIcR3CvXdSg8+FfDp2hYZiS4gF7y61P5X7R/tOFM9Y6q8iFkB
echo WBI0N6C+zXEMpJMwN6codcWcHgNbXBkJdZaHK5K7gn9q+32+9pVjbaKLNlCCDiL8
echo TnuziLk2GnOaNlVFIUDY+a8aa/to2+87VyZ3hzVSAGaRS2bAPoEXWgKcOLVgwY9j
echo rqmRJiQ+WR4+Vf+9zN/oc15b6XC7yEHmn/bNcHoMnGucc5x7XIPfy/yNWRE9FeDa
echo oICeAY8IL9iYdgFwmtgBzdbWnclA/U/ZH8Qrbqy0g09JWqs/A07I02ykmoACXIOV
echo N1bacU1wbXCNbEelGbBnYBZIgJNyAk48xqTpnotEjTIxcUhBjgS/H/5R/fyX7W1z
echo ezlDWK5W/v/0kQUCiQCcXsrOv25v8fdv/qPxvyJ/TyuszRc6NtpmA89NMk2+O0mm
echo a+UBPA+hW1kRShxdj/4w/MPqDTc+XvSXCtFi/hkkBOoK/KVM4Nron/5B6U/9f6KS
echo Oi412NZsrsoAM8nfceLUql97HiKgISKefGflE+M3XP5I3l8lHMv8LbV/ZpkDKARW
echo CQfXCNcK1wzXrkWnVANo9oibm8o/A2kqtAAvLX+z9Pazvuln1zDP1GRL7Z+BlOIC
echo SsA1evvQN+Ptm1eUfpR/fUdel0EBn4NqgJkS3mvBgh+FKEhTIzlyQXBf6bd7Pka6
echo rzQFgxiAzemf7Y1l5hAhCzRTr7HBaveVpPDbYx8bHRztLz/qrStmTNXoOSkETp7o
echo lHki5tAgRpkEHDIv2Rl82P1IsuSGehtizzUb7DSF7nT7f1vjoAU8sSZYMMQBcM1w
echo 7XANcS1xTad7X8GpGCdJLR/A0ex+7cg3hF8or71qoMiLlNoCnxbXz3ipY/F/IgO4
echo Zrh2uIa4li1/wJGpFQU4guofkAxcEfxf+bXLbvbEYipMvQX3NfsiAxpw7XANH3xm
echo XfmBzDXtvqnPIVPATIkG0KoGnETY2DohDumIh+u/nv8X3Xd53I6dbVrIv7OQkM2l
echo hr7L48KvD//LyJbg7KAs2jLcSEzonhtCwJx88s1JmwBmzvyXFp0kmsk3Rv9dPefC
echo fQWeJ2nL+xbNSsK1wzXEtcQ1xbW1/QTsmBv/nSy1NIAGUVAmgAycFT5ae/Py7zr+
echo CuLooAHsMTejnHOecO1wDXEt37zzu84d26+rPeWtLfgwR0wBc/KXOEkNwMyRoa1a
echo yHUUv0t8Luo5L8lbLLnpfqzWmBrHoDGAa4pri2ucmgCI4DpXJnjaBMAMePcpGNQo
echo CLSrLwvvrF535s8zopcwHZ0YsMcsigBNGc3kd7ZaQASAa4pri2uMa41rDjNg7530
echo OMlkx9MbEQgfm2ijDCNZVQp+sfB5VTzHZE2EKODNVtLPJwXSz6hGUqTgFjfMrssp
echo jbES7MiNbksgHBtgTazBC6HZNt5ZpbfjLH3nU04EQKq0yw+i/zWf43n/DJcyAsC1
echo /cVnPl9fH1wSSuZlCMHcAER7hllIU8N3JycApkYLmUYywLSGCsmol8U3B2sv2JFn
echo BUpkDd1EjX2RYsxMaAMTLa+bVzDUJBLAcUAbQvTOAQGGcCuXTxVbUApEK0262mKS
echo z2sS1oFybGBGERHn1JM2FKQE43mgI0n1ngFhCGUI2Y8vfArfWZH+7oR4jqFhaCjn
echo iP155HeeSAxqPpAEEAVK1p61I3/VA7fVb/Zf5+Z1laI8sUBCs5GmYKZP8zwAbSQw
echo yMej4Zvav6FyK8DTAQD3DIDfOMbxlMPXw2gAvqpKwWaxKbDSBOKEgPCIfGqHo//0
echo P3y+dU+XPvPs1aHSjePxMLLy8ghqG3KvMRNo1lbgpMiWCHWFRG2OIt5cOI7Zu3u3
echo G5a3+h/+xUi++ppAR4nmDgdgp1gI4HvHkmjHIfL+xz39x//uOePhvGT5yhVBEifY
echo ju9k3xmVdjL5nVGyOK5jtm/dlsnSnc6f/HKUXLk2IEFouGCT3pngv9O/tBoCXto2
echo CE/XT4cEcI3ftPkblbvLLwql8DPEdnOZjWHBJt+dHO+dxrUACO9lTBUc8wp1c7h2
echo 1Y48gksQo+HeR1x4cIMDxbyBVQsTcDnA/D5pt0lHmwZUuVFIYGdqF4gcG+PJu/64
echo 6K/fwGmxUGE79zxQPOIdG1vNEY1la2iwuMFtx5tJSi2aFEo3WtvZolZzhDC3A+/9
echo M9fJ/C0EN6wLdBxpx8XD+BRtZ3yCRBENlMrNux359j8s+vuHCHHFkLvt6SH3aO+M
echo TCkwlfqQn+M7p3rWxDsrAsqQo74zfqoU+PC2P3CdH/27Ds47K0JRLEA0BAB+PEz/
echo arRMIJEUBoYYlKsUcjkNa5YnQDOU4Fpf88Dt9R/w13g5CGwP6NO1suM01QAsqyER
echo IaPgxsL/ycIZ4MUhgNMOcMdDLvzRxzoBWOooQrzZzjYEpTSweJ4ChxlYOE9Bzjdk
echo yTxN9g1x/sweSm+6MDH9K3v359u8UKF60LgVaZyceFpJBXD/YxRGyxS4oICqvOtn
echo VFtXf6S1Si0MYswZ8xPak9njRrEiQDMqovOi5smIfS8okeRndzy8ZNszsf/Z72bo
echo lecnMSjJBLPa+CnZzVqDSSTVjsviL96cofuGCFnQB/Kaa+bvy/hMKq0n7OnmO7sO
echo QK0GcO9jFOohBcbTd87kC7LQ1h0rrWzAhXMwqxbUWdHd58SxIZoVZUJ6YgDZmBOh
echo TVRyD2xYv+yuJxn96Bey7K0vpXrLDgKJAti8i9v7bdkhrG9izyCDWkChGhAIqwxe
echo 85IafPtfhyApE8C1vnHj/5V/XH1paLjJpBvY2gIwe6jpGZ1mAXC4U3J2kAZqtAmM
echo A8vlpuT8+Zt8yBBCQwOmRuB11wWwcskBqAcA2/dwqNUpbN3F7am8dTd+pfDENoHq
echo P4kTEPjeN61NzC0fHof748WVzbp/PEsijuzaDDjhCRhGAJ/7HoMq45DtSnVVpSTp
echo Xbgi6OhfECsZpwBDXJjB4d3O2Stq3vmrDAzFy0MllsRgYqsvS82g0x8m+7Zt7Ny2
echo PfKHRikZqzpx3tFCacVYU3GY6lnT9lTVsebJ3kHuoF5fKPrBS27sH4ilphhZb2Aj
echo Epwr3wUYGgP43Hc5SI9DJo+TgfOhof+M1fV8W6dSSqF9DwaE2Te6xbvg7MBdtpCa
echo oeTsQPMeSUACMZpUISfXyDt6r75xhN70d53mKz923C/+wAWVpHwr/FSD6u1SKExg
echo YZ+CznwC83sVtOc1nLsyAXTu2sXIEIJrvvTJrck2dqbxIUbROqu0gKnit9M0Ecjq
echo n6AMJC/hP456l4YdxiDXGDAxwFlLEzjrzCT9KHJk0xegAWpVagXvzkGux6si2b7X
echo i759u8fu/TnNvu9z7cm6l2Vi6tbdmCrKmCH4Z6gC1+oGPvk1DnuHKOSy0va3w2nj
echo jJtM1qeyVnbxJ8poYJSawV17s5/ZkPB3v4bqxWdm47A25mLLG7y3lNQE4U4RJ836
echo JKKDiEmXUuU7VBut6FRDlVm/h0E/HFWh5IkCynG+tAZSriacaMlRFKI9jjyGZs7+
echo AYBPfJVDNaDge8iA+KyKuE5GecKhca2EnXygKSh3bhvIfnKbou/5Ba46Fngkro87
echo aTCGgJYB36Pj5Ldu6Qke22H81ctMfM2FcbJ6WSza8glfsTChjAPM61DgugZyLjYR
echo RZursctjAF0nqbAxBHqXhv5LNv949OMGF9qIg1rALKIZ4QScbRLA2trGJIZCZzQU
echo Xb/4Pi56Qaj4oPyXEQFs8GE/3lBnrYOKAGSdVO06e7E0pRrRZ52h6hu2G+eWu0j2
echo B48Jc8krmOnOJtxzEnTKEWM08VyAv/0Mh737ObTlY5CJ7TMEWkrS1js/8IQDYVDD
echo VpbgehkT1EoOhGMZhxjy/Xs6gt84S0BPUVJUbbXhRkbjvI2PC4q7GVlKE4gSppRD
echo tdbEGIq3TfvjHfQTpQLHIhk95/TYt03t70aLXRtLt45PVLeJiTVVSqHhnGZKZh1N
echo PZGwrKMYY9o+Fjr9Pv7fAmpVDlk/Bp2+s9EyocXeeTWHM4qmgDEKtDJmcP9ul8ox
echo TypBfnhvV+1X3g0072lina3gaBPsdzxI4KebcslYteJfuYhEf/g+VfZp2JbPxdQ6
echo S61jxCoggD5YVU39AU3fCz6XNU1izAsAcf28+/gXdr41qrptgluvBOoBs0UGzIQw
echo 4NQ9xwtJBh19ofHVVbA+WbpgKGOP6KRxWuChj3vAxpmfTciEuKHCiEAloCaQaNum
echo p3wxYyDjSFbISJ53EyGoZoWcIT+8h8CjGzl0FJOU+RvX4sSAm8lVXYex+f1LiJQS
echo DhwY1kO7tuVAxb7LwBTaemsPP6nZK69KSJJQSAzVHPZmPBYbxtKJR8UgkdTECT6f
echo BoxC4jsQ7JFr++Ritzz8FDKG07Acmwgak4MVhjCaEKCNHlxGYxVt2m0H3xt9AArv
echo hSG/VJLgbbKuojk3EQUvEZwaWswD+cx3KOzYJaCzLRV4qagy4FBmim0dZQKKqSQi
echo jHNYtHC+6fJ1/vHSgFeplDT3z688sUmyay9SJIoApJHENfsyWkld9BXhFCCKAQZH
echo CckJigoP+AKbth0arrXy8UhkVRQKuPbn71xf/6l5qcpDwAxh+IizRQJMCe+dZB7A
echo DExLe17S1pb3dS16ZfEWmVloPJ00jOZjeI3m7sDjhmEXKhuIbgTsNKCDkPhcM19I
echo 4QvFqDbkmz9xrDNM67SyyN5KGcK9THTlNVerKy6/guUKBdBKwfjoMP/fTx7Ir39w
echo F+vsnRd1duXV1h2KDa4msKgXII4DmnEOZCRx602jVWpFBFfa97ikrBCN1EU8XsuY
echo vcNZXQsp7NzPIUwca/hs2w1Wkzj4QtausNdBS2fZPDAZD79TsHR+BFkXYH53jRQz
echo dZb3Y+M7UhqqldIJwT/DeeNM04xQLONonvMUGysb8oPbXchnDaCNj2QlkUxIpqu3
echo 7mezJqhV2cKFi+D6G15sFs7rdxZ15bKDg/vZV77+7drjW/fqJ7cSdulqBfmsMFqO
echo Oxk94leSTB2lWKrJIINTwygBHNgL9FnRj6Osp9VoEgKZhdp7ZfGW8j3VqyNFaYag
echo 4JstEBlNTMqTTAXkp2PoLwRuFibb1YULN2cw8UeFx9nNd7LkPWyTocOKUo2HLylm
echo Db37MSDP7GVQzGpAuPr0ZEKtoU4vu/bG8PWvfwNUy2VipMTTW69auiTzD3//t847
echo 3/Y2o9186HBhakbRp7YbWLqA65zckxE04NIgl+JzE8jmO+OfP52DTdsUbH6Gwa59
echo IRseM7RajXgiYyKTmGjdMAFseWOqAEx+5QkZTrhlVkYNdkE3jFGTzWRVRzGvF/Z7
echo cvkigLWrKRV+kAgxbJN/UAYyy3+G5jOGfu8uQkbGGXQWldWYUje+Qg2AtHf1BSqJ
echo SVdHB3nzG98Ijp8xWcfkpJSiv2+e+cX/7wPBZz/7efLzRzaSzTspXL6WGEfuyxCa
echo MNuW7fA1OEEvtJEGcO1xD/Q/vkftdpcZz0g43UKCp1kYMH3YRFO1CjbLzt4waww7
echo 7rLKyWnYR/rLpt2Jjri7HsawF+oLBz+JJ72fzcubXvnaIKzXqJIJdh0HjkeZDjMd
echo 3QV41y+9V33xWz8KlFTUEwR27KUQ1BWZJ/Zl6lGqUMtE02JbRo5Vs+x3/2p4gVYh
echo Keak4Rim7DDSnUdkqqoT6O8msesQrZt5RY1Ie5Oaz4f997RRZP8BcKSK0Q4gUhky
echo OEycpzaD8+DDnPzPt53iogUdQXdvMU6SOiHGRvIaqboA9z1CQbDUWTrxzloRN5OP
echo C21dUb1eJxdfdy1kslmoB3WWLxZ8fPVqPYhHykl0xRVXkI2btsHWnQlcek7IsmzQ
echo r8RUoz/l8Ak/0ShUukYEOntDsQo217br5cpjuBmOKf97BpD1yp70VU4jDSAVVNY7
echo pnRyaf5h5XaA09DKT2D3PMfOw1PPAQhCjEtTcMTBVvV4YsdxTBcuPqPW2z9fJkli
echo 29pjUoLvcDfruU4YKlh59pog8+P7MLZuvdtjNceEtQEn21FyqsaN8VqMM10tl7ig
echo VfKLr+ODZy8jsr8bT28A3ycKzROlwOa6cZZa9TYjj6AeZL369pnoQecgQTXYGEIk
echo 9jwh6bXwI7VAo6SEgRFKduxT8I0f7+0aGgT3jKXZmq2rw3tQgPESwPZ9FBwHbzbx
echo 0njikmJnT50yrimjtKe3DxKpdT7jZDlDFD+Aemzq+LNisY22teVgcLSiabQv67g1
echo YXQ2fNY8H6kp1XGQlgC4By7NP1y+pfbSBLMPGumIs0MGTAGdhAAgs0wDsM9ppCYm
echo r8aTs9uf5jQHVMpTE/zBpJ9SBWB4jADmrGPBsX0KLDzmXPvFjlpYD0gm4zey4ojJ
echo +TxjjE3/03sHRupaJdiSxP5dopgJS/uyrDv1jINtRJqmI/f1iPCmq/kYKOkKRjgj
echo mkiJck5TMDYwDzLStm126upoOAEmm48Tv2v8HGOOqHITG6QDV9gnN31doJYs4uET
echo W6i7Y3fsNv9GG2IEM7Br2MB4hdj3n9gWWH0vHFXo6gu0kniUQ61Ws0GGrMuyyHJS
echo G1WpxwHjlFQrESRxZPMsZHVvhvvPzgk8WbLPLQFYDijuhXx5PIlpxmWYfTwruH9q
echo /G+nUyIQhq1MDFwv1nvUwq5BrxEUPoErNb42O1dP/lVjTVCohKGBepjGnlNeQ8e6
echo JLlie2SoEz/+2KPk+uuvh/FSCWP/3GXEY5RBokx8/4M/j5AZlDHACIWoXufDB4Z9
echo tgpP7zQfoElaGRLWNfe4Ep6bcJdrigk5jcglnu62uDF1dFqf5dFfLdUK0sKepmqP
echo LKxRvWdaJoyGAZNJYtI4yYQEAMBGXLV6Wh/BvYaGmoY7aVtXd9X1solSiS2/e/jh
echo R8xF518gsp5xEiUhCGUYSZW0teXog/ffB0E9MPVaKEoj4y7vZ6qp7k68tpmCDWjQ
echo gUFhYdeg2//MnnArrNY+SAyZzHghMIMSgWaDBtCYLq1Mork+i2/RHd2x0LiHj/Ts
echo J+oQPNL3h1/XAMm199Zc1zX3338v6ezshDNXn627in6uq42LWjU23/reD2tbt241
echo vuda5yDzHV0ePZANgoAR5mLuWxqfb0bx8CT1JC+4kWjPJK7nKoYOOesptxFAVOft
echo w6X67dFyASzzp65CG/dvCIFmGnAsqWLUiRNDE86titB4LZtbQY44fVYYElPs7qul
echo JpgBITg8/fTT5ubvfi37jjf/Asu3ZXR5IKhlfAKPPvIo3HPvPeBnPLNj2/YMmkiE
echo eFMDzHb4a5vUDMK9cBbfUt+oUQAomgYCmjM8U6kFCnqc84XhLg1MaXlOfotxi8Cl
echo TTN/NjOgnZzmzljV0/oIJzZ7408snsRzRGDw90LYMmFIgjRPwOIOcSbbOntDdPjV
echo 6wF873vfNRs2bIRlfXkR1Sv6rrvvMVXjRcX2Dgxw26QEzLGvju7PZFEVbpyE6R5t
echo RPQJQMbRrOBLpy0bu65QmKVHJ4XFbBH9ISXNR95S6ddDUsyxGs8mAZlEUYkh1EDx
echo iFIxYSmjjGnOG6b/os+i6Z+yiVCZfJwtdMRxHDJUTbxM1mhZIf/9n58U99z2Y/Oi
echo 62+QPN8b79y1k27dugWsFhQnLCwfyGQ8ZrQ8yiM3NA+8r02AmsQTk0u5ATWgSSXd
echo k0lLArgXzsluMd+p4J00B83xjWYy98+QPIDZovxPpP4SLVSYLCvupeBbGMAJrP+m
echo yts8+ewp2Pjj5ok4sZkwHVdRbVNjj1Tm2vCGt+cJdLdpGC8bcBxqwnrAl648u/rm
echo d7+vjvl6D953txwfHpPDu3eTp+/fFIRBnfF8J+9ftFAH9YpQRlPOha6Nj7s6LrlL
echo 5zGtJiUSNYmCBkEVdbliDldoCnA0/g8ywKRne76ZOuybRhIhoAuQEgYuZ0qCprbv
echo bvOXjXhCLAH624wNeZbqmBNBTJIkDJ1/2Uw2YoTpdVdfQ+cvXgJP3HuHyYejO0uV
echo Cv/xLXfQbHe/iePAEY5DhBBqaGBv1mE1Mb+XqhjDp6n5cshz2sxIZiMbKlGpmdM0
echo Ww6WFqeeDKsJpT5YQNyEpkAwCku/geKeEONhgioOtVmFM90MmBreO40AQdABSE2H
echo HpHzckPCYkLa3HRi1VvMnEU7VwNuKNxEBCNXaUZtA+iieYCmMHNEY/qtNBx9bYZg
echo nNv+Ap1ueE0Cvktg2QINTz6DiUeKeULUX/7aNw93d/dCEoXm/AsvIbf96BZwIIbu
echo zg5FSY9inYtCQx2SEW5Yrpd9aTQf2j+Q6chLsqgbU34baEVNFfXgqY5RR4I71349
echo wZrgQ/5qkgCxlgRBRrL3n5Q31UgdRoQiSazQW9ynYf1mMIxI3lZsqyxffu4AAJVL
echo V6zgK1aexYIw0tfdeEN+/1Prxx3HCzPzzkSFiUiZRKXyeMYYxYb3DWbmdynoKBCo
echo x42UZJxbm8+YanRKUxUnXEWJlkpj+GICxCmVAQ0hgGAiqBExgv/WBFfLzhdJ/4F7
echo YV5uiLfrsWRUdxvHIhzNgpzgKeC706MWANlYKyONoxfCTujrGHMx/q+k9XkZ9GBj
echo WjpuKDzZlSJaorNdUy3tpkvVSyQ8GNCLhZ8PIqoSIqTSZEIPsNBgWOFqhQHAVecZ
echo +N5dkvjCD1euPGtnrRrqMKi6nHHYt2uX1jIGUy+DkZIQtBfQK4WJ8wDQlu+ojZcP
echo 5A8MHsjceDHorjYgw+ONGx0pCeFUemQPufZkPfvgz/HdhUPg0nMN3PeEZH3tmerq
echo 1Wt3OW5GYwbj8NABGB8b03393c7g9o26ND6uea6TxhKhuZSFRuho66geGNrZNjo6
echo 6r3+aqqzvoFyLfVB4Dql97X1DyZMuATJE3RHYAoy5jo1nJj22SjFlCZNOUNu1kxw
echo THXWjFGNhVqUNaQXcxjBPbEQdiYHTJ92dYy1YalInbE0NYt8GtQC2LPbAssoDXq+
echo GIBsUfM4Zqj9IaMbpajEMtdEMhUrhkJAYdWbNgyr3xpO96ZRiKeGsWZCNaZKUieO
echo pfab1eRSU3TK27+p1sBcdg7AvM6Y5TMLRtr758fbt2xl9Uol5o6AvXv2aaZDUBLD
echo +gSIX2y0tWnCEBniahWrJIIbLrO6rQUEmKlHE5oFQQBw3YUG/us7CfR19Q05uQ6l
echo tKQo8Mrj4/qe226Lu/PcbH/soTriGrAMYqccbLqIYAY0lrHHI3LTJcZgLgUuHmpl
echo scQi7nQdlKGmFopEEogQoAy1nokIhtVI7JITghn+BIUAMr1mDpPM4ZpxHEwxRgyN
echo YsJybZLh3nhQg4ZUA2gofTN1tlsawLHPUmrgY+2q7vFGNQggsaJaJkRJTWWUMBkl
echo XMaSKSm5lJJpI5lSmiHL2UKag9BViCJpIAED9ZgqLdwokbEiJLbqRJQwnSRUSYfq
echo IDamp13D669LzDdu15R7eWBRQgb279foEHQcB+J6OS2SZy5wP2tPwibhyTY+XIaL
echo zkrg8tUYYku9f/ZVJsFBNc3jZkLOqQjMHHLdhpN0AoYH/9fgYSzSWdYP8JJ1Max/
echo mtJFuYyp1yKCeftcCKiMj8CBjVsTPJWZlyVUeBMxTezr6VMF40MVuP4SBcsXEDNe
echo RfwQquOEaoxCoBZgzQ1FdRB5kdZYv6Q5uiQtnlPDf4OhT2vfkUZqtlCUMgRM4UwI
echo xV2ecE9QJrjimPbscyDdzqiGusZUSLQAZ3h1cGMhTpJOAw0gdeLZ4Lk2qs8bwupv
echo E0UMU+RlkAhk/iRJhJQJlyoRaNNrwrk2jClDqUHHW9Mhht580qgeVyGYOBRSSrT4
echo 03hBnDAVJFxmJJUYjx+rUfqGa415cq/0hyqGtmVwN6IxzUAFVQJxPX1CNwtAncbp
echo D0AZhSQMYefOTT1/9+uSOYLpGtb/Hy3/+ARm5RA63r1+lGfAy4QRMe95pSY7vyQz
echo lTopYXbNRFQgDoiLaYmo8nv5FG4JS4KxQM/hemy4RCuVrT3v/2ULoKITxSzjhyik
echo Y/SLpl5YraiOQl9SSmPjWYwUNOkA05ZREOC9mGNTm9GJQ2UgGSGSKkfSJJFcCsYT
echo JYUnEoPIJg6POO4NqBpl94otkpok52YizQQfQBPPbubKAYz+YQ4b1p0rLYFqqYgK
echo pEjCiCZR7MRJ4iRJJJQxQoHgMompSZ4xQm9XWT4qhSgbhySp80/5IOM8SZI+HoYL
echo nDr0+gkQBKVCIhBGXAWBpjXGFUf8DKlJxuPqba/pij5z80B+XBaDfFYgsp4hURXj
echo DtRgyi0yQyP+iMJEKgYPPfjQvPe+YqDjgpWOLFdQKKSmRzoOZuk0XvOYfQBNbWGy
echo CZ/mDDznNDb8Ds+GobIhURSIjd8FoaadBUe+7ZXF5Is/3ZfP5wphxhWKADMkKiPz
echo Eyw6om4eOdlegxED1bqmjz1x34IPv2ks39/pxSNlsH6ZesBkPRQqCDlqAOk9CdOG
echo eDIc15o9GXlir/SdKghWMaKRmABRgcSyjUiylIZisZOInAOo5kmTKOmgqZcgIJOW
echo Wgmst0gQIxrrqXGvINLJDMYKtdKpwXsnI6NOg1qAlBvQa4++eXTyBRGPa4mI41DE
echo UeRInbiSOCKJKwySexPfezwp9I+ZTFYT4VFCHMTYwkuhsj5uINoDUN6YyD1CVYYX
echo scE4MjZ5hBCiBc/GhDJbUI+b1BGhE0GHLHbMq/3SqxL6lVvL3kg1I31OVW3kAPcY
echo SXgmp1m2XSkZY2yRhiphlfKA+zu/sCP/C9c60WgZIJPBwn4s1iPaV0wzyqVAQIHJ
echo uVjHKAAEgprgyh/M5LH1CwiE8jzTOPHvSbUNxssw5blMZVyuHK5A0MSMy3m1pYu7
echo g3e8ImRf+7+yFwf5hOuqCcdHqceYFLmiZl5O4ztLrVgUS1qv7M3+xXsG/WvW+sGB
echo EtWuYKoeiwSoGxPixo7IRVisgG6SpA4kuiXOdj0T9i4OZKFIiONRNJsOOu6SYQOh
echo 1qa2XqmxPAS1M1mZXcJrXhdXSciNVrH18ShItKeFQecv7hHcKweTpWauEJgKmuOZ
echo gI1nQ5vO+pDTZJZaJOIwcuMkchItHQnCTcoPSi97T9CxuExyRYdS5hFr/tts38mJ
echo QEDAIQBtBlNaqFfYrdr6Y81AEIhDKR5cP9i5qF8kLg8cz1XcdxIeM64C2JPLOgld
echo 3kHg/icZbNs/6lWG9uUYo6rY2V/Pj5UCpSTFxBmMPFy9+oCbd+via7dyg6cjcqj9
echo f01pEGlSjXR+z74wg1V0rke0w58f3d5mvnKArTs57Bui4LlNiDEC2YyBNculPZCf
echo 0/Q1gKW/kPWMRl4bLyXObfeWCv2diIGgEBDE2txjkpOq3JXPOoqs6DTwwEYBB/YP
echo ZOpjQxnKuOroXVDNjAzHmBqMmgPO5g3n7fHjIGFf+ylqN1RHiSFRYiCMNQ0ixcZq
echo iVspRT4uQMewFstqqq2TEL+Y4cxFmx3fZWKd0AQgkANCikB4X2Ty1Yd0fv/jUX3s
echo Ajaavdatakl4rAg2hjGeDCFWPCFGo0WQHq22cMr+H8w8miGgoLODUjMAsz4SzVQY
echo unEYeglRIpHGkeE3o+LCJ3R3v8e4yVGQBozEljuTYAIOr53H/BHcptIBdoWTCX6U
echo VOWoTPiPbt2yyubdTUqiARhs4G6kPgTErMecA1Qx8WdjB/Y2YMHTADZqntseAviP
echo hKY1OYdRs2DNagSUwIsugAom/mBc2+oJR9EA0tR3A6UA4M1/UoQoAcBeAuUagc/+
echo SRnOX52AqmHe8JH/Fp+OUwNRotlV55PaLfdB28iYdP79v/ctmZwtmYrJn/c0mysh
echo jHrz3wffefeh70wBnnoAIJIH3/nQbL70/hgGcSiFa7PZGuWGYeq+1tpoBAQ5DM7H
echo yv4UJcxgrD8jOKxSJjN8j/Ke2RWNsteLES9PjQwI1I0P7XRMu1ZncFL7akY7AaeG
echo Ti7QeSqav03paBhLTT81VgMqruLQT0A5iSJOor4Rda563PTNzwsuEaIyDMELA8IR
echo ovs5APQwH4bjflaKdQCB9+S79y0QbkgxIM0JcIcawQkIkQ7GGQjBMMwFCmsQCANb
echo rGdw2+L3eIRjNSoDrFHA4eLfcvqswTkFhP7NZah8003swOXnQZAkmuOtG8n+aRLc
echo YQOTeJKAwkXnSvjfPyuDw7FYCeDvf70Kb355CHEVme/Zf5fqFpYZKL4CPtwZ8418
echo 7+v4vp52GnGWPpMQzWfECkgGDDEObB1y+j7P+c6YakgYeA6x5dM47NyxdC4ZdgFi
echo FNqYiN+e69y3irmxUgrRxDHn6eicSojBtfTCkLAwJIir3Fnk9Jy90OV8Ke6NKlxr
echo 8JJEetJzbBAX90kje9TajjCjx7RmAs54mnQM2x4z2kjNlEocqZgjk6+Gnau3Q7dX
echo 5CDjxErD8sJlFeX6yj+wL+OXx5zYcW132cnUzMFjxjCfIjSfFOcIp/477f27dqnY
echo qcUGyotY3VvOpJEJYzyhKF4clmDYiXKKpfrH72NqLjdmHkoN0NsJycIebThRftZV
echo 3GFYAJQWAR3tAnjSRuMUXnxVBL/5Zg6bdjD4wJsDiMfp0TH0GicFPjMjhvlC81Ig
echo navOY/WVS/iuXQNEoLbEqG5k3x3nezU0KmUYev1VIrmKpVAy4RoY1/EAEH9Tks0z
echo Svs4T3ox31HHmYwxTKAAaMAfPuu6hIATRyQotMelnnl1FgUsu29nXkkFIsth9ahp
echo 2/DFEJK3+YNe1knGKvkEDQmb5G0TgWDO09RkAs5YHwCSrQHCKD7mkmmQVIPjJvUf
echo JfkVW41lfh0lkPjZ5Klf/sONwxdfXUJ1UpTH+Fmf/vtl8x+4rS/y/GcJAdx0eCh5
echo Ros20OhJ1FlgySrmJOADDA0YCFb4dXeRZ4yOmONEzBGUezxCtGBGbXLKicxbWhCE
echo +ayUGCogcdsysZNzpMAEl4a2/ZyEZogsUfjdNwaAgkRhSs4x3BkRQTjVLONI0Zah
echo jqwQ3Z7hSXEZSzA8l4YRjv+dENMAQ6+YhBVJoaLYUXHiSmNcJWvMkJ8H+X7HS6jV
echo PiQXWop2o0UWNPZiZQ3w4mcxvxsGsHfddQNPve/D25NCOzpYoOuhu4pnffKvVztB
echo TWifm+XDpG3Dd6ME3sKGh5IuLTWWiaBRcXiYZaZRqxrwmCcJT34ciERBXK5qm43T
echo 8/OkuyvPSSwx3EP1k7/6/zYOvOjlo97QoIOnicoV1WO/94+bnD9+P+968uGu2PXw
echo GhMbLVViCfWN5hqkhyegRwwPlBIJIXqRBm/HzxJOXuaXBDeUKcMZl5wTLQSVnDPN
echo eKNK7XiJMsx+Mdgkk+W9RBS9xMk40sFr2gahx7BvU5seC3awSvpgleNz3hfNHqZp
echo 1pVWb0afQyXQPEiolGiLN+DHjpcURbRhqjFbWxqaIKMKrY1iGvRD9eyiqs67HjVE
echo auoTw/JGOwVQTga0QEzQRkrvwXcj1DhRSIbOuWgY15DFEeNBzX5s33WvGNWUbDzv
echo n//oXKMM9XMUFm7XnQP3qzprZyUoWfDENJdzprcNnO48gOOIPE0fTcRKUaIrLAjS
echo /L6kbQH3nJgQ48QhGVlxTnno0uvGvcH9jrbHMgMaVGnieHrPDa/d3/Xk+q7D3856
echo mRGXhwDPGkU4MdQHKhJDlMQwkiBQLGt/1zNGeRfzCGTCPU8K34ucrJM4WLIrEEP/
echo BMpO0cDHTDqHKepwzT1HcfyKjsDDiuaee2oaEY7j+RvbyYMrnveBCK5p1pEC1XYr
echo AI4KNHB0wvtLTVSUcBXEOka8w5BKML4wwTOh6N4XdvV4jFu1HQwRoJlnNHeN5gII
echo Q6TQZ0u8dDfi2mFDNxFUKf4FugRxjXGty0tWlru2bmgLPd/0+pTW1kcd8SWmRKhN
echo BLJhgCM0J5wxNGEOnuR15n4YsKkGKG2MoNLsCt2efaYoPAJo8DUaUWJezqS/s/7C
echo RmI5GgRHJtQCuC01JYjqR12jOJYd4Z8h1Fi3AJI8KSE53xsUnuZCaJFxpZP3Yzcj
echo EscR2uaiH+9b2XK/FIkXlRf0jaWVbkdplf2c1zrOz2NI0t6aKfQHUI9roU2CVnOK
echo N3ichHUTMXYbSnRcQQ3DKOMrabAUI/N41LHSmCJCGqP2j4KPaOtjxTm3tj+6Do/2
echo XhZENE1Wa7Q2SSld60ZRgS11JtBfh5yzvZ7Xi4jFXDNpOgC6TmdoNmAzxH1yV5nb
echo TkB7+Kd1AKjSaUJ0x756oYsRgdm91GgSCxeKz2zJ99394/Z9N752xB8ZFKjL6kxe
echo URXDwlu+Me+5FHWE/05LcQlOpq1JRb85rgtiAS4sqeKuHXE5cz7BgDcWm1N0anuO
echo 5qgFoE193EpACgSS1rYfDnbxAsjiRm09ZUxh3CHFSrAYoOQEnH9Ec1SZFNUu04nE
echo sl2PkGCvdObtl21FlznSpHGDFFwo9b80kv2Ofm1C7NoNXHnjiF3LKKAoIYPe/nje
echo T77diWseC9fuAaxDLAhOVg2N5tn8pGQYx2VsmAAzk/2niqaoFmCGagAN5sfkLkWo
echo yUVlWFM9kOFcQGxbU6cbBVXnc/7zb89iSm4aXHfduGFUO6MHxFmf/vszujc/1hG5
echo mUPs/8MpjQqkVSiNhkKN0LWBTkbp/q0yRy5wRmnDFWlh+ezeSk9xBPE87nc7Qlng
echo 5GWY6j07eYWbAqcJkNJsUHS8FoBVlRRaUfZayOaGoExxmCbbZaZTgi9cm/p/XL4S
echo rAKMHc/g2q396w+e9dT7Pvx03NaFST5k4Y++3nXWf/3jmQiZptF72ND0FRWwJjyQ
echo nV/ZX93XvsQIzB5D5Wym7u0JJ2ArDPjchGq+MZAQahZVD7AFccmXnjfh1cevinHg
echo cSTW/Ptfnlv9xmdryvWlN7w/69cqPHIxAnACDNrsFMQBnAPakzVDiEOx9BiBRlLQ
echo Eas2W5fDidFhaz+RcGMBPJ/fSmty1dF+N5nr7LXTdgTptaeALzBygBEanAtseKoQ
echo jxN/JqmhexIPmwWcaB4erhmuXf+j9/e0ffidHWFXf41FAc8N7s1i4BDXnEx6cdQC
echo OnTsLCvvFTs7l2tHK8RUmqncfyidhLSf2z6AZkKHtQaZ7ojKLAcG7fRDdnAqBJhN
echo 0csP7sna7zmH2HGRRU/qMEXUCT8GXq4CIR0Yh7B99dK+mBj+amQNnvSJTQBKZWKZ
echo EzvzFvKNfBZ8BoszMvmzDbNWTt4FkzCPkBAdyXYfSAVBuUwhaUCo57JpH76TZQ+L
echo xoJcZucC5wbtbWqwUatTs3lFJ9X7AtcR19CJAu7v3FJEbS8RKcz64SE+DQAupbQv
echo Klk0gAYucsOYm4nAIK0w4DHNUVoMDKAIgd5wnGcIOvyeTc0NkdhKmQYE1kkyf3ph
echo Al4IfKxiKOmi2B0b0YcaYJu2r+BhnHf8hI8uOMAH/8aH9U9SaCto6O+22rmdgkXz
echo NWT9FLOvq81Af6+28F1nLExri5/ezYBxA/sHKQyPE6u11AKAXXvTIii0XPYdQDwC
echo Ct3tBr78z3VoyxubQ3Ay2bKNs6Phq7MC0djy66qhXmA4ymRMEDqZybHYbYSBclJD
echo 5UhrShpbxSWEzIvGGdEmLbxIfYUz1Ak4A8KAB59ihmoATeD+xjMei8N0Spj+WZTu
echo oYPukgbE2FTFTxsXrlQIPIH4WeUEYA8WKKauM/MoATHJznAwzGm/ptY3HvQ4NzGk
echo UGRIiVWK01x9BMmxaIkg4NX9GWjLa5CYKd2890k9d8OZbRfHdgufiOtN3a5K6zqO
echo 9ZHARghSmOEUgGGGagBTMENzHBS0gdOVFpFPc1Q33YHN5hwT/rKpEgAEIJ/HZLwG
echo iBHWtDc6AOE9k0OY+9DYfxPObDI1f988/iw4ljHQXsScXwCD6MQnKyqb9282IsJ5
echo Qb9baqNNy7FLDvpvm+83c7MBpmDv8CkDJjjCJpp+aiR12dbRhgy6bTowRCP2jnrB
echo HsFA6BJJ86hYagYcFdJGHDptVnDS+xzBOBFPdGG/ASyQi0ly6GIcRY2e+NmxqNnY
echo BtwwWNBvLCKSrqchj5NSzxtfmhEUjPMbrQjziU58SNR4ir50qjeWaTxLbIzZ47Wl
echo idbNOjLroJmhO3vaNYBZogVYrElt2KhX0FVCZR4Mf6EEAKbZhj4k1ENbF4tlNJr9
echo tJE/cAgqz0mRAVgyX4MH3Kr0h/1qSgivjfeYfMGTuvbBUl8UhljIZKNyyPRRhspk
echo FKt4DzZWPZVEEMpMaz0oirhAWGTYrPmauXt7CvhuCowbM5NHo5aVEKETui/bp3eL
echo QsgbPp5TTegpj5WBuIeGDL2P2FCD2bp9arHqm+DzJ/ma9hoJwEWrFXRgcv8x4EQ0
echo hc8R0gmeRU2DHK+N98B7Tc1zW4RlzCgknCqb1UixqTFVRM2nYR3jAi+QBs7BwCh1
echo 4qfzC6TQkqV5gk29dqaP6RQAM5//CZ67VBtadXL8/uzCUMo4bZ9xCglvj+mrY0or
echo eQarM6IoEEURk17YNFpbOotlrOSkGQkjejE2IZGwrN8qGEfkaiyb4ySt+T/8Mvgw
echo 2IT0iKV11v6n9tp4D7zXRPHQSQmA1OmK5hmjxs4NY5oQpRhdxsJxZqK0t/Gp984w
echo lcATXk9tX66PCJU0yios/5M5yvtTJQAasdLpBkY4ykg3GWDKKhFa8Ts7zw4PKBK9
echo AKaljbOPFKAmltIYEskYYtNTyRg1iOQ1YQacLOE1ZAKQKxpYs8qAAITDPSgDLFMT
echo YkE7pUlRr31MfCHcjhxGC2zrNG0/g3IT/6Z5bfw/vCZeG++B95qq507bdSHzG4pY
echo CZRJahLFnD6ixvqhGsfHmQZ4IoKaEKjKRP247cxQMQyoAtWIq4DLYxltJgOCnBzN
echo 7VqAlOzuN4YwV8d8U8cZ+v9yi8bfHu7pjbnzrISQqSC8IqcAY4HS9YvYuI+e81gy
echo ziV2p2HC+gBsdW26tafgEZqv8eLLJHzhJw4MQ2i/x81t0XoB4PJCD7x84Qq4uHc+
echo LG3vgDbXtz8PZAI7xkbg0aEB+NHubfDTkd0gm8UGjb8tgGOvnfpUps4utmAeBCgn
echo OC8Ky6Q5tmcgVNH4Ird04DthcQERIm4I86kmAwRcI+Eh3l6+t2dt7KnY11SkytlM
echo jf9PIZ18c9BmrGimZgOmehxpQGgwbrT7lb5Ly1dt211cKMCLGvUeU3pDvGMCsKtg
echo KnwtDyBKOHMQEUgyxAJgzNi6fav+TxEhyEdSI3D9ugTWrRJw82YOmkjL/C9unwcf
echo vuBKuGHl2QD5TFrjjoH3SXHAhUuXwFUG4NeDCB5+5mn42MP3wP/u22J/TbWAdaso
echo XL8utPfAe00JNeYej1rODBVMM8EkS1AERJI7Z3jx/kV0rHO37nF828PxFAhqCuNB
echo Tf3vvCtLgZsRvjFohGDSRKPeaKbu66YGcHKTMhMzHKacUpQsxKrl1FVKbG1bqj/d
echo cd6+WhAY3ABTua9wSRCYfkecRNGL3WHHw2TfhHMuuSMQtkszjrauLd+dWlsQ04A9
echo 38AH35lAN80C5jT+xapL4adv+WW44eJLIMkICOMIojCAOI4hSZJ0xDFEUQBhHEAs
echo AC44+yz4nze9B754yUuhiwnopJ69Jl57osZgip65Wd2HpcWoHWF3Y0cknLGEERVz
echo +mJn/GlHVW1kcwrPY3t7QoHGdfh6ZumBO3sviHyZOMoiLViwpdnQIHyaNYAJzOxj
echo cDtPJ6V18qjWMUkZ85PA+878y8fWqD17X1MZW8BdgXABJ73eeBcPCOytSzl0tRjI
echo LgNpkthx/IS5IuYuk0Iwgz4AzHuZ8lIThOuOKgSuvVzCNRcp6D9wGfzxL7wRwqAO
echo JAiskw/DakfSbNFhmb4EQBxFkBgDb33py2BbVcIT2bvg2svTa9vTf4qfGzWhFCKN
echo MJdLIRlVUtgmrcZpo3Htpc7gMz9I+ArNPfQKnmzthHV6Ipy6TODHvDD8icU3DDlg
echo CppQbls2oXJ2jMhK00eT+I5MowaQCvODnYFm7iDY7YEBYdgjlivFvG8tv2T/I11k
echo f7mmjINw1Seo8KUbCsAxBHbVkmTv1WJv9lIRmCgWwom5K2KBPTOa9f8WvvsUJZfg
echo O8jYwN/9hoYNcgfc8/TT4LlOo5r+GK9hDGQzPtyzaRPcVnoc/uE3jb3mqUiSbm5C
echo zCkSRFOXa+Y5Urg8EY6TcCNjkTmDyLFXuHu3SBkwiebOifFmcy8g0nASaHjc1aOf
echo W3n5zirLoctGGMo5dmlsFGgctG5n8JiKuT85mm4v6LEN9ALajnzoBzCUC86Ms6XW
echo wzef179v6yozsKeKbUFtQ86J3I/nmuCJ36OHnBJQoYEtSVLfc72z172EBSaIHO5G
echo XDgx9p9zXJHgPW1rauxaPRVx9MMHviouaBJiUhCB3/3lIfitH3wHtg+Pgudjah32
echo 4Dv6W+Hv8DOu58LO0RH47R9+F/7gV0bstfCa9vA/Rbu4IRStH8DjinuuFK4TC8eJ
echo uYkixz3DyJFXO3s3CFUO6hqchpvuWNcJhRdyOZpFQxWln+rTQw+fP2/nZtVPHFCu
echo okJgL2E0FVPtrHEcmJk+4KToNMgERJoo/7W4loZQAYyJSuyLuwcWR6uuGB3Zs9hE
echo o/fH7fMrJN+GnYH4wc5Ah/MMci8mqGBZYRRp2K9VsrcfSvoqdzy7EJSJAod7CXed
echo yPERWNxJHM+2o9a2tyjusFM1XaZRglwvG3jJlQwG3zsEb/js5+DfX/YmWLdqGUA9
echo gDhJUjW6GYSw6XdYRuwAeA7sGhyBN3zxy/D+dx+Am65iUB83Fnmz+cyn4tkb6EYU
echo EQCEIMY1iU1xbjpo4shAZrGbxG9x9z95R1zv3S7be4G6novxlBTm6/DS4bTGIDVv
echo tDRQibXZ55j6+OV8lK1gpXs3LFNV5Xm+w4VB9R9nDvFh7EvOAgfAFCzEHK8GPIws
echo nB1ad4wDMCE4OD8Ll0TX7Nykz11TjZMzvP1bn0jG/Y2q0FEy2ayiwsf8gRR5Mm2h
echo p23KKNQ16LJjotE+qOnzRcldzhJqEmbi2HHchDtOInw3dnzL/BYAlFFjMBNwykJ/
echo z0UoaZBx3/VaAovmjcCff/IrcPaT58Hb154DaxfOS9mj0ZjTSgww8OiuvfCVJ56C
echo zZUn4cO/MQC/cCNNmf8U2P1HfOY0944ARS0An1DaybJtHUGTJDJEZIXkr3LHB3eb
echo 6oFH4nxxT5JrqxMvA4S5DH0UBxk3Udgb0JgaMXI0C0F9NSuz83kt36bh8ccy+sHK
echo IiJ84hjCEF9UGMyFSgsgZ8GenpqT9zTRACw10m4xBK8x6CQYjZ2KyfHbh5clZw79
echo LMO7XM4vYaE8jwX7BoGbHcpjJcNFSTsUq2OxO7BHZJKDRPfQmC7iseg2igG2qAoc
echo xhXjbmrzox3rCel4QlvmRy93Q440nAan8E0b18dTuzZq4NoLKaz8yzH43M3/B791
echo x4OwyjsXLl6wGJYV2uzHt5fH4aE9O2Fz+AS8+OoKfPwlFBbNp1AvNZj/hXzmFMSA
echo Guyv2iAKth8oNh6hCTZ3TCTz5wtpFoixSomMj+3ULtmvXF4Dzqsag/hWgZd5EicF
echo KslCGvL5VHoZhByRIjoQmduGz03KJMdzhDqGcAdPf6uApL3KZsHx39IAjp+ayW3W
echo 1mPcUOF4InHvq54RX7V3S3xR+3BOg2CccMUXUk0Ws5o21CAyDhbXWmIUHK4JxRRW
echo LalWiYsZftyXjDPJhUhExlEcvdmI+ouJLZzahpppx56manmqBaY5COVVrwD0tRH4
echo o/cL+OVXBfD9+++H/UP3w5MjDmhNoHdeBOvOA/jIZQy6+gToqoF6CQXIYc/6Ajwz
echo 3tGipKKfhCEnKusgpCSmgmoaUs0SqqWUimnFlJvn2j2PxWYtj7SiRluo5/RyDFuV
echo IfIf8n0cC6IUpSqhT+7rrDxQXaY9z7i4B3AvYDawPfsnl0jOaJqaU/fENYAjxbBn
echo AWF6JyYFAaUMoeUZpW6VZoOv7Tu3trr31lzbUuXKhClEqTXYRUhj3q7tLZwe3/iP
echo 2IatsAs4FZ6iiI/PWWLj/C5T3G0yPrcNdFHBPnjyTwMhHyOcVzhioC0L8Iuvsvp1
echo agLgM6FFhFh/dQO1kfTUf6HU/iORFQIYhtOpEGj4TahgmDCkecyljCWXSlGFcgDX
echo SRtmuz+jCmGdoehnkTYHlGBWIffserHSThN/bd95tYDmRJZy1xAuCEnbPJ5gn5bp
echo oyngu9MhFbhB1mPaqO6wjh5OCROauk5WJN6G2uLSt7auHHtP4bH+fD8TMiG4uSx+
echo 3wSCz8HEYisAsEuO7fBjM9gUQ1Wfc5Mm+lAEt0K1FSvepvnVG0yF2gD2K4jHzWFy
echo PP0epRV+ZiaQfV5iiMJiQZqWUNtCKqpVzBVLZCKkZhI7ClmgVY1CAJMEGi+TdhMm
echo NuMScwwcw4J9Sn1r69rxDdFCXfCNj6c/7gGSZv5hTCEt0JzBKGAzzAk4uQgIZg2h
echo pNfW40sF4Nagwss4cfzFgYsrS58a9l5T2NHvdzBHxQgoTtOWV409gfoDlvJS0JTa
echo CjaDPf5QEKRGpO2xmZa4TvijZtDcpKfrc3xgBj0rUsMrR21fB2RmFLBMK8WR8TVP
echo sI2HRpBV1NJYGuU8uFbYd5hQB6geVebmzUuGvzhwYSWboXkU/IRiMQgVBvsOW8af
echo PAczbCKOmgo8zU7AKQxJvgDUiNynC41szIBwB6jjEp54wpHxx5656sD8bMW79pKh
echo XihQomNlWwM189AtGm5DC8BdYxNG8XSyte02pTXtkDsDmX+2kg3MY0NgtN0wQg+2
echo fYDRlBhhAamwdxAKaezqle7F5vyjiDcVbe7Y0D348e1XHRCO4xHueECFZ9fe7gGb
echo 9zcp93/mn/6W9V9YE6CZupYmSR32KDDbCH1ymPVFKG4RxzVMJZ6TJKWkmPz1U1fu
echo 7c38xDv3/GqnmwOuE9sDLP27CdC4NJ7fyCq1p80hfSRn35TMXJpIFkoThqwgwP1v
echo NX4LIYiQv00Er/TT6AdwgMgKmMc35Eb+etOVe6vQxvKO8A3zPIJCnzZO/2d1AJ0N
echo i3cY36Uohg0X87GnmZ6QBoBJVfhVY8Pog6C7s4mspMcyVGsKMOYQ43hG+7LgJWpH
echo bV7ldx669umPwu3k/AvLXW6OIF6E7RmfJgwfrJOf2DnNNOLZcYDMTppQ7VOBm7p1
echo kPsPJlbZnE/stYLMXzV6w6OFkd996Nqnd8h5upilecN8nzDHwzUHQi0uw4TtP8sI
echo 31PrhkoK5jBebsAaTmUqcGSxbA0JYjKOaVcZUqGeY1upn4L80FM5Dr4/au0UsACc
echo eZQ5vuE5vy3LMlvi+fJ3H7pm289/XhyOx0BijxBbtNI4iSZaY02sxmHhstY4Nct2
echo 2PdNpOVUO0g1BFwrXLOfP1Qc/t0Hr9mGa4lrimuLa2zXGtccms6/wxdx5g/kOU6N
echo KYi6RZ5JFBnHwm3fTzEejpWOSwCEId5d0ycH+FMQGeiDXW5PO4lSjPiGGJ41I5X4
echo 6GDCRFfKhAAmfMqdjKI5vz3roBBI3nvP9Ztuvrd3f2UPSWzCXLPz57Q/f2tMngO7
echo JrZjKQCuFa7Ze++9fhOuIa4lrimurV1jJgSuOUlBP9K9MIvmE49hjOBmfCqX5/ca
echo MBEM1dlGgCRxsRzVfmLohE0AvM2RrNnGV2IyrhEoOhThWtkMuaYHsPnR2ULWvYcn
echo B8OG8IRwDDpryrXWRptixphS0BX85vprnv7A2MP1t12wc37/8iTLXCAa22TZS0z3
echo O5zm1Nh6lAOoCMz+baL2xYcX7/237Rfs106RFn03o1k2Q7mbJdT1CeFYD4Q1XyzN
echo ykK9YZbt2wavaY3dmUSjIA3co9j+5mR9ABOVNEGAXxOxeT8dDCOSFJJ9mSVdcbjp
echo aZIHgSHB2cgNadwXHfmNHtQu5oegjoXd9TIeQEx0+JHNl+1ZP9pd/Z2RDYvOW11p
echo 9zoJx8aeePLMPutxbpD19mOmFSUQDhv52Mb82D89cs6uW4aWj7fnHMdzfU9zZH4P
echo c34yQLkLtszLev7JwZYEs4vwqaUEMq8Noj62U0CsYajKdqF2Hlkt/djpWATAxAWD
echo AB3nxrn1SX7gt66BJK9qTnsuCRCGcpbEAY9GGLrDlHNu43yo4PBUmqLHmRtCegpV
echo euvo8tLjt7Vv+s19G+a9/sK9/d2LlU85kGZNzSGhv5ZQmFqaNKfNpCxU940Ec2A7
echo Db65fv7+j286Z98B05n0FBzP8JxreCZDuZ+l3M8Qwj2gVCD6GOaBHsz3NzAbCQ+e
echo vKdV1pQ5NoDaPkz3WgFAQ2wT0zQYJj5+ogJgkvpPTZ0QU3Q13TMkS5Hmewrx+Irl
echo neUhSrqxTm625E8dgRqdoBrgoYiqbX/APILw/WgkYJCvI1cj1agr/oPH1u18ZHhL
echo 9Vcv2Lpw9Zm1gtsG3AIjTRYEs3NfzWiydj7OL0sV92gc5MZN2fJ/PLxi99f2rhzJ
echo ZT3a4Xqe4VmXIPMLL0uYmwHCPUOZIGj34xofjObOSkI1VWoGi7plmEsGM7WQJI/t
echo MvsAFA+CRj+45kenOAxoikWgOwecej2J91CIVi7MjmrBu9Fotg6V2bzvsaueLR/H
echo WBJD1sfpsfF9TBRhmE3uEEo7GCRfG1g98uCtPdX3797U96pz9vf2L0wyPAvUYm02
echo N+rs3WMziiawS626DyBroPfuFvXvbegf/M/NZw7siLuijgIXIDLC8KxHuZchwssQ
echo 6viEodrfOPlJM3MgtfVmK9kQKAAsbKslPBlvL8e0dNcmOuyCZAEhCN3cfLnDd6A5
echo uUQgQozn4UVieaDCNi019euWZfeSQu7MpFwCdzJoxOwkjApq5HjrCrT1P9ZaTEFF
echo DWEIKcYMiLAzX6ODYU/y/x4t7PrW9v0jb13xTM+Nq4e6FiyKs8wnmKwyUW7fchae
echo AE2yKFHVt0DGgTG7dzm1n2zsHv7S1qUH1pf7a57nkc48JnJlHSJ8j3APHX4+MMcj
echo FN21FoWd2TW1C3F40s/sIzxgOCfmzK7hhKqyU5f86Q3b6Vh3wbAha6anH5sqDWBS
echo 8AFMHFs/AH1iL91wyWID/flt/uLea+sPjxCXY+3MbKmlPiqlvXKtTwBPCpvyh9VA
echo DqOcMAspRijXkgcZGlCfU/lYsLD24IM9z7zomb2jb1q5s3vdsvHiwnlRxisYjjqF
echo FQQtreCYaFLRVcr42Fy1ROTufW79ge1tpa9uWTx0x9D8EsKWteccTpwMN8xHx61P
echo uIdJPj6m+RJqQT6sw8+u5UQO1+w+ogga28pAWxuJz8rtJFCOYLDqP4FIkG1tRAyN
echo pOb6s6N3xy8Anm3SV4kpO5ECEO5XHhJPvWEtreWjXYVzFtTHHnrSbU93+Sznfztd
echo NssHna2pEMBGYhTzBVItABGFCOFCUx4YIsICr8faZfKe0tLxu++dV17+yLD/pjN2
echo d73krAOdy+aH2Wy7FgYhxvTBmoJZPktTThN831DziTRQG6LJ9r1+7Zaneka++vTC
echo 4W31roA4ru4sckY5gqxlHMI9jzFkftfDDD9CeCPFN43zW+ZHF28zQjXLJ54QMIki
echo ZGmvqc8zW30TGXh4p1gPoGgcgbbValOcCtyQJiMGoGCCAHRX3rC714vB0jvF5mIy
echo esHavgODgi9CULZZPr2TKJ1CKwRSxxFiiKBHkOOmwuYRglLKCeXCSB4CcaM2EiTG
echo ZWpn3F//iye6dn9uc2noxfP2F19yxmD7RcvKxa4+6XKPUI0YdZN8BY0bnVY0GWcR
echo mR4rFFHUqtDooQEe/Xx7oXTL071jt+7rL+2Oi6HnCtOWF5Qw1zHcF8Bdl3HPI0wg
echo 42Nyj5MWdmFGAGPUNn9MG8MekqMyuxUAQN5WmsPZ8+tBPtzVXqrS2ld/zrdgeL4c
echo swhATWjrU2ECTNYC0mIDQnQ+DzBcMcFAmT26qC+44PyOZ0xP55JweIj42FntcHDG
echo 2UtN6z0tSQVji3xtWz9kftQEsKYcS4oJFaFhTmRkHGVYILNOpEYTEXxuR1vw5R1L
echo hq94dDD/ijMG2y9bOta2qC/ycwUtiGfF9UFhYJ5dXzAnaDLvNd+xedLjj0JjqmWa
echo 7BrwgvufaR//wdO9Y/eO9FZC8GXW49CZF9QwlwPzOeGOS5mDKr+X2vncxeQeQjiC
echo vSKEgBXYB5l/rkxiSkYB8V2i1y0+ELJkzC/H4tF7HyYDnXnD6mGoIcCEnGfRcYcB
echo j5QNaAeGApWkEnH17tnCHrhwEbxnfrIhv2Le1fX9A+ALbmX73Jr1NFkohZrDCAHG
echo BRinRBEGzJ44gmJtuXIiwqLIKCfSMop9FknfiZSUXN0xlh277f4FpfmPlN1Lu4dz
echo 1y0eLl62bLytrztxMxnNMUoNk82Ew+T3bNMQnoU+jjZ9g+nxkFIB6GqdyoEhEd2/
echo vW38tp1dpZ8NdVX3hoWICkfnM5TkuMOAugyZn3HXIUy4lLkuMOESIlxbxAUMEZ7R
echo W4BxG/TWNIC95l49NsG0Bwmku4dG52Q2MhgPYMdY5r4YdFjIAw/GU/AagJFjLtE7
echo nkQgrLHSQJQ+UCbKcVTmoz90Hn/bpWxvb3Z731XLR/be9XBHJxg556RuSs3SAQst
echo bNtHGwv+gcA/zPa2NMBdSkUELIkIc2KjvMioKKEsTtp5rIzmeixxw2/u6wi+s3vJ
echo 6NJHxvzl+ap3QU8pe90ZI8UVC4JsNquFlzFWrOA0KkTGarbxm8EC4RCGbxRLIbNb
echo QA+MiCAkWZWoWo0mW/f4tdue7iw9fKBY21bJhc/U2gPFHJV1GekoMkJsexCHAXME
echo Ya6glvEdBygyPncJ4xbFlyCsW9pVLD31ydw89ZuEXqhYMli7LKnMjx9vw/n8+s/F
echo XQCa12pU1smRjo7ndgYeaxjwkEgAIZHq6/DJrgE1tqfk3tXbXXnLtfM3qs90XR2O
echo jIInMBow57SASW6BhjZghYBBMYC5A9ZDwMEwAcoKgljTJCbcjUAlMagoNiqRLoul
echo 78baKGH2RF51+5Cq/XCfHPvMpsoBFAZnd5T8s7urmVU9tczCzsjrLCZOJmu44wLB
echo 1UKgbKslPIer55SEHZ8j0dNMOt1tAqUCSCIwtRqRIyUn3j3ihpsPZOtPDuXqT44W
echo A2T6/WE+FoJrhzPTVmCIzMU0cSh2ByRMcMpcp2HXuxP2PUPPPuZe2sFMg/FRJ7Pn
echo /gTq69w59ScTop44DpiXrd5Tc+t7undX+ebP3gZbs1klyhGJ7C48GAGYUh/AQUdg
echo taDBV1pKhJl0yI828jvPm2/evDTzQPsVZ182/o3bSJ/giM805/h/ElnwmFQbsN/Y
echo c84iDFGiuQEmjGEOJSIxRnqUyhiYExMtY63ixGgZGxWrDE9UVkcatDJ16YQPltvD
echo e0fml8imhOZ5yPv8unN2e8Vf3Vn1zu6rZhZ3hv6CjsgrFhX3fcNsJTt2JWrUY020
echo aWys1iGOtiPshqMpyYd/tqltNJGObCQ9zZiyMD344bBO1GiJyT2jbrhzxAueHMjV
echo N47kwifH8sFAkIkr0pOGCS0ENZ6g0NNmI3TUUJci3CcwhyFEF8VTH80pROtF3wrh
echo wibyYOQlhQhNQYJt886U7S2yw6QHnovsTwmYMCZk1RmscnnhQQ7DdbJ1JH9bvQ7V
echo RX2ED5VCBQSx1OlxIXQcqwkw2RGoA0qVrtAkm1X5v/4We/hdlzrbFno7l7/szJ1j
echo P7xvqdJKWUDpOaqJTc6zakAFp4IAN6XBekJiMOUU3aECDJWUCtcYkRglE0LdBHQS
echo I56l0diiR0rUDBwulePGhmipQQmdaC/aJfPR1n09lW/vllRAwjqdUKwsVr2L+sYz
echo /fnIbfcTvqI78FBT8H3NXIEuSYM90GnKJgeZFzWHyXVvNp6MOBi2NO5gXlwKfNw4
echo yRuqPTooMZdBJUQnMdFRQnQQUIUn+9YhPxwLhNxfcaOfD7TVt5Ry4UjsJQkIRRjX
echo riDg+gw60XfKOCB6IhCH4Fc86dF5R6hAH4pImZ4JVPGR8bEMg+Bp33wb64FtMH4j
echo eXviIZsPPxfJpN5/bRjcuKZS6io/2l2tsvhfbxU/Qe//WE3GNtOkylQarYMpzwNo
echo XlA3/QCItZzLgR4cFLWf7VTfXthZ/fCl2fvdVcuWVx7fKNt8N+04BXOZJqa2sREb
echo 6QM4rCDAjWtsBoACgwBVQhKjFAoDpjVqAglolRiWSDAq0UpKMFIZjWDXUuccqXMm
echo sVh3SqmkKjPJfWMd9buGF45pJSkHRTtEyBcXaq7PJVuaD0XelXxRMXDaPMnnFUMH
echo 8XTx4frysfBcg3k19gcYLMoKi15MyhGzErv5uzAieqDiJLbM1oDZV/Li8ZDLXSU/
echo rkRcPlPxkkBytbOcjUYTT0pARFSuOSPGEwC5PIIsYRgeh0D8ZIROpQSZnnBGGeep
echo DS84IMPT5ilvbXsrPG2XXpvEk4qxRvJ+E5DtYAPHI67H3CKCAlwCaWtj8U2Ln5Rs
echo fNjbPuL85Dv3mR09bYaVAiojTtVBHj01tQAH/QBVookfqnqdR0KYzB9/y7n1+uXi
echo /2vj63t+4YLr9z2+qacNTGLzaObsqjyn5Z0aCIBAlSlEKG5irEHnRmOnCu4YohSh
echo jjRGSmJcabSUnCtplEqMUVIbpYiW0hiNAkETJpUjpPE8aQUC2J8rFUkv2VBtC5Qx
echo 5J5hDRptL4WJ75oKoixkLgJqdrgRIuajYLLPJjUxfZmYY5OT3RVXNpBhLEwKBjpG
echo I1dpjX2UqEkMM9JQjR49zIfijAIjxDgOQHsGwZVTrdz27iEc2y+mJzwyPZpFlCME
echo O7NqPMMWXKjOoxDAdtz4FRkePfkIAY5OVfSn2CY9KadPVO5MdvCdLvsKrO4TxZS8
echo Ym0ydlb0fx0qNvC19c53AKii1HY+wQ4I6eF8ZPv/hKsBm388adYxxFDUhBAVx1R2
echo txmy6Rlz4NH9zvevba++/ZU9t/MvLX1refPTsuA5Bkvm57YWMEFHsJonnIWos6LF
echo jPyDfkODmOLaIHcilDVoKwwA4VWoVsRoSVAwaK1QGBijJTK71Q4MfrXMr41RWghl
echo XJxlkKirpygRCJKrjbLCAO+qASo6P/GcuEuQZzeHFlATXG6bHzTgodJH97Op2Erh
echo U1P4Y+twsMF7/IZjaxTERraMj3yOkoDZeglkfmR4ZPDUIEkZHb/HvHz8DGnU5WOW
echo PrWNlpqnPZ00f88GXzt9GH/CVJOGFIo8efeahwK3srP3mRH38X/5AXukWAydsZop
echo U5ooqGJn82NPADqRKEAzzxcljaoTqT1CVTkgsRDG+5Nvud/8wYL41V30oe63XX7t
echo /v+3rbtwqBZwOsiBw2JhB7UCtFvtbrbCANuUI5i1FQbYhNj2L9eGckS5V8jFxDiW
echo 0cEYRSzjGwVGoalgT35MCTH4WfQZYHoIIuNjg2+NPG2RSvC4t65B/Na1x3sDtKGh
echo JHqQemp1ExmuwfBp96Rm3Qye7I3cB0yKxKIaC6fKULFIT/nURm8wth3cNttAQYBt
echo 2Cz0dtp6G82iFIbN8nmKw4DNe5r2fMOtd/C0P9KJfzrspZRQNFYjSl5+VTy6Rt7a
echo rhKArz7sfKESmKDHJSYEkOiTQ23gsPj/lGcCHmoG1KhCMyBJRNzZKTL3bOA7H9rt
echo ff/FhcpbX9l9O//emreOPvSY7PDdphZweknuI/jWJ51qaZoaWtjIVSm/Nfz32G0E
echo D2ZbV2VQOGgDQlM89fF4Nwb74KANgAICOV5ZFx0WZBsUAvZvrSSw12gIl1R8p/dI
echo M/IO5sfahLyJCnnLeClWbjOrzjKqFQTp8W9xVNOuZylzo4cPcRSszW4ZHYumbPZk
echo +oeW2VOmT/2lE+p9CmE3cfNjqGA9bbQAgsV3CZB5vTx8/0UP1Z2Rnb3bh90Nf/Bl
echo em9np3bGK6pMKVeT1P/nygM4aQ1gcjgQzQAVUCpdTWSlokPfj/w/+xb/5sULxMs6
echo yEPd77vmql2PbuxrM1ra3hmnx5IdjSb72A+J0qeegkalWjOuaHkfz0XLvelXLCq0
echo pzpqCgR1+6ZwQEsdm+LY783Ez/Doxz45Nk6Xwshi6wyUBI2nOGRJmnkbFiwnjW6k
echo H0tP/YYqgIzdOLknmLvxMysFmgIiVR3SzzWuhdx/sEnaZDyOhkPvSGr+6XPSHzXx
echo J6HwC9dEQ2cGt3YkMZgvPuj8D0gTEfTiECIJCRVUhQIYPSGA/uN1ApLDogGKUiaT
echo JIk7Ohz/3ifZru8+kfnvd15e+s1r2PcKN13xywe+cyvpy2e10WpWg7CcwmyaCf/2
echo IWGF9IvVENJ+ZOlH7QmOjJyqC2k/HGtGpBUYeOzjdTT+vAGYn8I14+mPTojJDzMR
echo Pjskd7bpwGz+tInCb0/wxiJaMwD1hPTsthKimYLbOOGb79FQeA7h8Wb47rC5mfTm
echo h/zsdCNjk6pMEAJZtdypvHP5LdoZ2lF8eG/m9j/5snd3T0cgxsusRKlG9V+iSX7Y
echo 6X8q8wCaY1RDtahIJpSEiGSkosP2dlX41U+z71+13L9xKXnirA9c8tAzDzxxUTg6
echo GnuCnwZhwakKJzblbMpQtheD/WlqE6dJB1ZNQNPbRhwwAcSKl7SLIX6biokG39lP
echo N2b/+TZGeq8UN8PWlqY5Tzbfr/HdxDqmndHSRz/C6d7Udo6kczzfXJy+RKwIN0A5
echo 1792w/7heaO3zi9XRe33vuZ9xvNiWlUqIMQkhCQJ1Dja/031vykETklfgMmSBW9k
echo b1ynVBFCJUlkTKmOaxHUP3ar++kwJGp16du9v/7K0oDSGE2e3Ei0NZ5/DiZmO7XJ
echo 0z4GqWqdsqGtdW8Y52lanQ01EqyZxcA7YuCJtEEWIplhxSJ+Ze7zjEbTTObg3+I1
echo 8Fr2mnjtxr3sPRvPkPoGJj1b83ntszffo7XmcIxzQIk2tYCQV7+IDr4i87U8UxXn
echo lg3+l299lD9T8KWRAZb9kqM5/+AIX6dEABxBEHAFVYxFRpIQmpTLOuzq0vxffiAe
echo vG2z/22mxjJv6fhK5nXX0cFaQLGZZku+nxQ1ZcDkpNyGP60JfJH+h6Y8+usbAgLB
echo DHCQYxyNz6c+//Q/e3049F6Tn2FCMWgpeSdDGGuph0DOOdMp//4lP0n80saurfv9
echo DW/6N/drXW2xGIt0gA1AKEX3IFFHcP6dEh/AZPu/+T12H9EA7apOtfQ0TQiRcT1h
echo 9WI2zr/zk87//PzPvbVL1KPLf3/drbue2nlj+aktYSHjAfqqW7vk1NARvOiTl/A4
echo L3VMf9aS6VNFKEIlxvwLTvyXr9k03D9w86JqKGp/+E3v3zgxkaY6JpLFhEBibf8q
echo kwCjk+3/416YE9EAmhdvSJ5DtYCkriLq6Hi8ApXf+ar30Wro1PoHbp73l6/dPJwr
echo uHEcH9ZFt0UvtPZwjKNFLySlPmAs9+XwO79Q3Xdx7cvdFCT/7N3+f37jXrqprU2S
echo SqgR9De2p3/NOv8mn/4nFAU4Xh8AHEELUABc1ilNKEXpxOJqpIOuNgnfus/Z9F93
echo +5/GF7mw+uXuv3zH6B7GqVJWBWjZhC27uLUHoDEHGMWphwTe9zqz583tX8oIOZi/
echo c7P/49/8vHtzT0csxmumRqSMkL8CSpPU9p84/ScjAU/+OqUC4HBhMEnqYESAqYBG
echo 6JlENSUaqUOtpyfhv/V550e3P+X/2FUH8q8Xn+p476vV/jBG/PBGSKClQbbodCWT
echo fsEijWqdkOsu94Z+Z+WXeL78SM/2gezTr/yo9+lCIaFBYmqEasv8lEYJ1FD1R+//
echo idv+TToRXW8iBDTJ88sAOgSWJvq+dLUWvuY06yGqE+eFsTHu/uyvgg9dsrx2Ra2w
echo dvAfnn5P/Kmvy4W+kzbWa7kGW3S6EqNgKjUg117uD3/spbfU+vZ/f/G+krvnZf+Y
echo +eNNA2TAd2S9FicVIkWVUhWGPAmhKmKAsSSNxNlx3PH/qRAAk8NSODhAUUBWOp5y
echo XK2lb7ibzTpQiGOe6cpB591/XP/LRR21JfWOCwb/btu7k099TS9oCYEWna7EqDGV
echo OrHM//GX/qjeu+f7i6rKqX/gvzN/8T938Ec7O2NZqkOJqqhGKa+HCPxdFxFACZkf
echo OwAdrgXACyEAjiQEWCoEujlALDKZxFVKeMaojGZuJutAsRpw78w+2v/DD9X+aHFH
echo bbEVAlvfnXzq62qBJ7RNPGlpAi06HYg0Ki6qdSDXXoHMf4tl/kriBB/+avZvP/UT
echo 8fP27lhVqmqcUFOjEtNt4jAIeATgxAAjhzP/4T6A43qWE30HOMwUaAiByaaA42lO
echo M0aTbMZnxXJJeKvn6f6bP1z/AxQCtfYLBv9h2y/Gn/6mns+JxMbNRrdChC2aw0Rs
echo MN1APaJw3RXe0EdvuiXo25sy/4e+kvmH//ypeKirKzbVSI0pZWpUaTz9w4DFqPon
echo k1T/IxX/vGAC4GimQEMIFB3IKeGnpoCnGc0y7WR8X7eN1YR7Vi/p+9GHq7+/uCdY
echo HDpLx74ZvLv0x//dNj+sRdjdrZUn0KI5SZRYADgSKw7vez3d87tnfpkXRx/sK4ci
echo /J0vZ/7hM7d66zs7Y12L1LjSSY1Iy/xBiMxf48lUqv5NOtmA79GEQNMfIDzleCgE
echo DG8KAdM2VhbOmQtM/xd/JXzvBYsq50fO/Mpd4p1Df/71Bd1bnw7zWf9g9miLWjRX
echo nH31wJBCmxP/zhuD/W/u/HKmUHmke+9Ydu8fftX/9P/c5Tze2ROrWl2XlIYqkWGd
echo EBYwloT1Oo8B8PQ/quo/7QLgCFGBbgYQOZCRjqebTkEvwyhkhWCFesgzKgDvzj+p
echo v//qs2pXSu3JnT2v3vuXt13h//iuqEcwDUI0sgZPFzyRFs3Jqj6jgdRCAueu9kt/
echo 8fqto5cEX+4WyWDu6cHMMy//h+zHNu+lezs7E1kNVYlqqKHqT4hqMD+LG3Y/Mr48
echo SujvhI/KqWCrw7WASUKgE52CTiajHKUQGVcdFAKE5Tln+bExwv/jfdFL3nlZ/Y1Z
echo JxHl7kv3f3rH65NPfdvpK43HTtZPuX/utBtr0elAJK2SsCW92PLg1deJwd+/4rak
echo f+DmBQwk/cnG7B2v/5j/5bo25fasDJrML7G+TiLwdhwGjMVQReYfnXzyT4nqP/Gc
echo U/O6Rw0NYn4AR6dgQwhgZMBrCgFKeM7ltDA2Rslbr5Rr/vbNtXcu7ArmJWJe5UHn
echo dSP/fOtZufvWB12gNPierZC0mDYtatFMZ/w4ARJLAmeuzJR+7SWDY68sfjOHhT2l
echo mhP+++3ZL/+/L3m3e4VECqpqcaLKVJu6lAaLazHRr8H8Nt7fZP4ps/sPed6Tf+Vj
echo yQ/oYJCLHV8pR2vHnSQEMlpDrpBhxeFhwRb2mJ7Pvj94/XUrq1cgfHyp+7J939x/
echo Y/w/txbbN26Oig5X4IhGhWxLELRoBhGxGAqI2mgIevjn9bvBG69Lht+x+l4zf+Sn
echo 85iu8A17s1t+50uZr/7kEbG5szMxQazLSsuqPfltqE+FlPIoYHEEVdZ0+k0++Q8v
echo +pmRAqD578nhQQbQziGXCF+5jtayKQR8pknGUJ71PJOvh8xP6lz87mvCS3/z+vpr
echo FnTWe7TTFe4pXnPgfzZcwr5xd6Z9794o46T+ARtLbYUNWzSdRBvHncTehzGBYrsT
echo v+RSM/q+dU+Eq5Pb20V9e3G84gZfX5/58fv/y/8JaF3t6pBJuU7KlMoawaZQVu23
echo zI/hvvgozD8lTr/Daapda8ckBDJai4ZPwDOc+Yw5PuYKCMJy3DW58RHBikXT+Yl3
echo Bze+/JzatYV8IpTore/wrxz50qaL6Xfuzbbt2xdlEQjXdQ0w25CnZR606IUh0mhB
echo iuiMUWzbMEBHpxu9+EI19q6LnozWktuLorajTcUA92zPrv/Q1zI/eOgpsjPfJhEa
echo pxYmqkKoqSsNCK4dEILMH0ep2m+Z/2hq/5Sp/hPvMlUXOi4hAJKjT0Brx9HaCgGP
echo G+prSjLG8EzWNfm65H5U4fTGi+SKP3xFcP2FC4ILc7kEtOit78xcNfx/+87XP1hf
echo yD+2SRarFckxasCxUTfeJYW+bfkLWjQ1G5o0AM2Ibd1O8LRH+951mV6xzKncdGFQ
echo ftmK/7+9a+uR4yrCVefSl9mZ9V58XcdxQuIkDkaKRfxABAEJobwgXvIDeOKdn4LE
echo C7wgJN55ipB4IQYhC0UkyCTOBQc7ia9rO5vszu5MX86pQnW6e3d2PDssyN6bp6R2
echo X7bdPTPq76s6darr+5d7qXx7Nupdn4ES4cpi+u9fv5386Zd/SN6D2BfzbVf0cuwS
echo +7UAfs99VFmGpa7D/lzA72rPTzsB/vDdHuXFtrhuQwADJDCn68SgJaqHBNYkhlTC
echo GqVyMFVKT6UptJe+NiKLF/3kO/mZn/8o//6FU71X2h2PoGfK5c7ZL//Rf7X/1gen
echo 40tXbOfO3bK11iMt7cesYTAiLlX1ul9vM9vkDiYphIkN2mAbw43uhZWSgvMS4lee
echo Pkk0HT5ssvMvcPfHr9zrvTb3nj26dnlOFfdaUDC8f7d17Td/SS/+4i37PgCvzh0m
echo ygu/WjKsIclb89xznjJ0PkNUudZlLq/S11V+W2X7Hwv4N33vHYwEBmYHnIEpb1OK
echo bZUXMDEbn2gVpcyYsoJWYkzLaJ5aWjIGCOM3zrtnf/p6fv6HL/RePTpTTIGJwSfH
echo Vhft2eWP85fzS9eORZevp+mnNyG9/8AlRSEt9YOqVWByiRKasVtFDhN70o1F0Vxe
echo TJWJdlFZCPtV9zNjFc/OmPz0gu5/65ms/9qZpexc+xN7iq90ot7NGfBrsLxi3bs3
echo 0g9+97fknd9etFfBcbc967xh6PdcBXxU3EfPfacow9Ll4vWVyoteT0J+43YD/LAD
echo 5TVbRQL1DIHUCTgDbW/qGQLLTHE9JIhZK8kNpEqZ1BpoIUJredloIB2dPumP/OwH
echo xbk3Xs6++dxs9o3ZWadBxwDmUN5LTnbv8LP9j7rP+I/vzenP7k+Zz+5isryq9OID
echo n0iL/DwnneUiMD+JBp5Uwxr84hRaLV0K8I/Oq7zTQn/6OGWn5jN39vhy+dLMDXXK
echo XIun8xsdVSy1gPqQrSJcX0puX7qefPiri8nlv3+kbgFQ1p4lb9BneQFrnqCPWPYV
echo cd+hF68v7/Tn0jinr+QMU4M/FPnQmFd7H1vAuhP1dcORwOAUYR0NHDLQId3y1ZCA
echo WchAx2B1rLVPmFTMyqaaITVGFkyXM21pNajTtC6cdcffvFCc+d5z+YunZ4uFE51y
echo SqVyZWls23Y+mu539fF+hm13M3+qVAr51uohvL06Axr9mD56EzvYxiK5zdNxD56f
echo uQ+eDZ+Ibtk2ruiOX0xtuZyAW4mBcoCc4d6KLm+vRHffuZFc/f270Sd//Ke5BRl2
echo IXZ+uu2cYujnBfQ9sbTtzsLiKXPSzCN4fS0EUG6M9yNX9dUcOd5/7OAX26knfxQJ
echo DBcM6XpIYFIiux4NWBGwDdFAzIwJK0w0Y6wUprGBxCHGK11joAitqZOFBZ757vP+
echo 2OsvFk+fP1mcOj5dHDmU+M78FGkwDGAbHbwIAKPJCwdPvGFVYUtZle0rKWinL69p
echo 6Gaqd6drH3y4GN3669Xo8z9ftbevfqGXwFEPDPsp8S2Gi9xxxg76HjlHEuCTAD93
echo SHnTxkv6ZWYyxRd6+a2H/IPz+80U3yOf6tsuMHebBGRIICSgZUjQIjJEsZVogJks
echo GxMb1hGzigIZKJTawEixSayF2BgRyYVotVTGrSkFFOSmo84ct58+7Ke+/ZSfPzZL
echo nXML5dGyQF6YcTMnDrnpUgKAzUVMO/7DTOzxG4/YRQA2mmE5U/mni9GijRi/WDJf
echo f35ffXVlUX99fVF3797DLhDkAOwgJZpO2Wt0pXMqL5kzJM5r4OcogA/A96EtHqIr
echo mzZeVaJPFHxkCaW9w8U9w918diRPvdPP+VYkMEQEEg34YSKQiMBWEYEQAQkRRFAT
echo gmaMmDFSCiNr2BqFkWe0eQmqX6KGLFw6CNnX97FgJfIQtaxK+7r+XPV6QOlmYvvZ
echo moz+UDPbMDNUiak60V3kEkD67IuCDRFExCZGmrJEGsg55tKRyom5QOLCIxWIXICn
echo Ar0qEH1RA7+Qzr3i8RHzqn136OEnwP9qcG5/nJTXjk1S7cbDPXzPYRKo1/I2oauI
echo oBoWGObEbBCBvCuoI8NkhAiYtQVNViIEzWiZ2YBWVik0itlYhZZVqBmSyUHNzCpU
echo EQaVW1HUqoQwN/fF3qRYObF9bQHwFbAwiKcCAopWKoEithgOEpGoWKIriR0ROiJy
echo EDQvyHkk6cZbIpHsF4BeIoES0ZfohASckIiTtt0V8CXcl+690sBzPdE33MYbdgv8
echo 1W+wezYuGhicKdAApBoiaDFrotgEEhDws7Fg2QgBWBPW4W8A2rAiKQ0ywPJmAQvo
echo NWilgcXba9ErCyEBiCL3+n0r1YINHcMJCexvq2pAglBZsFotOWQAkcXlS31PVeKD
echo HjwSokiuo/PoRXrLofcOkJwQg4AenXJOwF4qh1gGPYwgj1d5fJHr9lWSLwB/MLu/
echo J7z+pl9nN2465v5bDQtwExG0SbeIBNCGOdYVEci2MUIGMrHDTNoY1mGUx0IEEu5r
echo BVqIQIvXr5YAdFHCAtQV2AcigF3/fSb2aGwo/BdEYpXtq+SXAzgD8GU4ECS3vEQC
echo Hhx6YQABOEDpB0DvhCQQK1Gcnpy71mj1rQN/nHDHroN/Lz3gw9FAsx4uIEKAI6oa
echo GpCCthdvrlMZpkGqiLyBxtODrdZWtllGAWFtDQTPD2yacX+4jwwJHv4sgRgmdiDM
echo PyRsg5XsupQAsQAfradSCEB0mAMJuODNsZRtEcEtJDIQMvCImd/w9qLOK2N8WT8E
echo /OGmncNg39Wi1L30gG8VDWxFBpIslIig8uRtkt4rSoYIAmbmRDx/fZ7sW+lQpACi
echo CuxR4/3F69uHvL4UC23zc05sb9lIQNVgHzyHAcrK+1dRAEERSEEIgAAKarZrwMu+
echo 78kxWVbF08vfRZ5raauM/rg5/T1Rjb4XH+btEMEIQmjIILyyoaDNDSGoGsxCCsHr
echo 1/v1woPev75HXG9Oxv8Hwxrw5/JPnRNojgmIgzXgZwF7NSRAXge8/L/g6RvQyxKK
echo eAZBvh2Z7j0B/L1MAP8PEQwt8yGzv0EIss1Yk0J1DjO26msNePtR95zY/reRYTfW
echo JNALb/rVswTNugJ7DWZdb3+5VSKP9xvw99MDvhUoR5HB8P7AuH5+gwiABs8f8vTD
echo Xn9gv/2ovtLEHrutDu5sCv8H9nEIoKpOCDbHRwIexuw328O2J8G/Xwhg3GfFMetR
echo 2fxmPSLhJwQxsSfHArjFRq1HbQ/uj/Lseyq5t13bjw/9OCIY3B5VZzDunHHXn9jB
echo sXEemoeObRXC72vQH6SHfTuZ+u1sb+eaEzsYthVIecw5/20sv++AfxAf9v8F0BPP
echo PzGx7YB5HLj3LfAb+w8yZDO0210yjwAAAABJRU5ErkJggg==
echo -----END CERTIFICATE-----
) > "%OUT_B64%"
exit /b
