@echo off
setlocal enabledelayedexpansion

echo 🔥 Starting build process for React application...

:: Navigate to the React app folder
cd /d "%~dp0"

:: Build the React application
echo ⚙️ Building the React application...
call npm run build || (
    echo ❌ Build failed. Exiting...
    exit /b 1
)

:: Define the source and destination
set SOURCE_DIR=dist
set DEST_DIR=..\backend\client

:: Remove old content in the destination if it exists
echo 🗑️ Cleaning up old content at %DEST_DIR%...
if exist "%DEST_DIR%" (
    rmdir /s /q "%DEST_DIR%"
)

:: Create the destination directory
echo 📁 Creating destination directory...
mkdir "%DEST_DIR%"

:: Copy contents of dist folder to the destination
echo 🚚 Copying contents of %SOURCE_DIR% to %DEST_DIR%...
xcopy "%SOURCE_DIR%\*" "%DEST_DIR%\" /E /H /C /I || (
    echo ❌ Failed to copy files. Exiting...
    exit /b 1
)

echo ✅ Build and move completed successfully!
