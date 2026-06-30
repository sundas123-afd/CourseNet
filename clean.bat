@echo off
echo Cleaning cache and build files...
if exist .next (
    echo Removing .next folder...
    rmdir /s /q .next
)
if exist node_modules\.cache (
    echo Removing node_modules\.cache folder...
    rmdir /s /q node_modules\.cache
)
echo Cache cleaned successfully!
echo.
echo Now run: start-fast.bat
pause
