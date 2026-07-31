@echo off
title Vision-Scan Pro - Instalador Windows 64-bit
color 0A

echo.
echo ========================================
echo    VISION-SCAN PRO - INSTALADOR
echo ========================================
echo.
echo Desenvolvido por: Iris Clin
echo Proprietarios: Dioenne, Marly e Mariana
echo Versao: 1.0.0 Beta
echo Sistema: Windows 64-bit
echo.
echo ========================================
echo.

echo [INFO] Iniciando instalacao do Vision-Scan Pro...
timeout /t 2 >nul

echo [INFO] Verificando sistema...
if not exist "%ProgramFiles%" (
    echo [ERRO] Sistema Windows nao detectado!
    pause
    exit /b 1
)

echo [INFO] Criando diretorio de instalacao...
set "INSTALL_DIR=%ProgramFiles%\VisionScan-Pro"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo [INFO] Copiando arquivos do aplicativo...
xcopy /E /I /Y "." "%INSTALL_DIR%" >nul 2>&1

echo [INFO] Criando atalho na area de trabalho...
set "DESKTOP=%USERPROFILE%\Desktop"
echo [InternetShortcut] > "%DESKTOP%\Vision-Scan Pro.url"
echo URL=file:///%INSTALL_DIR:\=/%/index.html >> "%DESKTOP%\Vision-Scan Pro.url"
echo IconFile=%INSTALL_DIR%\icon.ico >> "%DESKTOP%\Vision-Scan Pro.url"
echo IconIndex=0 >> "%DESKTOP%\Vision-Scan Pro.url"

echo [INFO] Criando atalho no menu iniciar...
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"
if not exist "%STARTMENU%\Vision-Scan Pro" mkdir "%STARTMENU%\Vision-Scan Pro"
echo [InternetShortcut] > "%STARTMENU%\Vision-Scan Pro\Vision-Scan Pro.url"
echo URL=file:///%INSTALL_DIR:\=/%/index.html >> "%STARTMENU%\Vision-Scan Pro\Vision-Scan Pro.url"
echo IconFile=%INSTALL_DIR%\icon.ico >> "%STARTMENU%\Vision-Scan Pro\Vision-Scan Pro.url"
echo IconIndex=0 >> "%STARTMENU%\Vision-Scan Pro\Vision-Scan Pro.url"

echo [InternetShortcut] > "%STARTMENU%\Vision-Scan Pro\Sistema Financeiro.url"
echo URL=file:///%INSTALL_DIR:\=/%/sistema-financeiro.html >> "%STARTMENU%\Vision-Scan Pro\Sistema Financeiro.url"

echo [InternetShortcut] > "%STARTMENU%\Vision-Scan Pro\Testes Multiplos.url"
echo URL=file:///%INSTALL_DIR:\=/%/testes-multiplos.html >> "%STARTMENU%\Vision-Scan Pro\Testes Multiplos.url"

echo [InternetShortcut] > "%STARTMENU%\Vision-Scan Pro\Reflexo Pupilar.url"
echo URL=file:///%INSTALL_DIR:\=/%/reflexo-pupilar.html >> "%STARTMENU%\Vision-Scan Pro\Reflexo Pupilar.url"

echo [INFO] Registrando aplicativo no sistema...
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VisionScanPro" /v "DisplayName" /t REG_SZ /d "Vision-Scan Pro" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VisionScanPro" /v "DisplayVersion" /t REG_SZ /d "1.0.0" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VisionScanPro" /v "Publisher" /t REG_SZ /d "Iris Clin" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VisionScanPro" /v "InstallLocation" /t REG_SZ /d "%INSTALL_DIR%" /f >nul 2>&1

echo.
echo ========================================
echo    INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo O Vision-Scan Pro foi instalado em:
echo %INSTALL_DIR%
echo.
echo Atalhos criados:
echo - Area de Trabalho
echo - Menu Iniciar
echo.
echo Para iniciar o aplicativo:
echo 1. Clique no atalho da area de trabalho
echo 2. Ou acesse pelo Menu Iniciar
echo.
echo IMPORTANTE:
echo - Use um navegador moderno (Chrome, Edge, Firefox)
echo - Permita acesso a camera quando solicitado
echo - Para melhor experiencia, use em tela cheia
echo.
echo Desenvolvido por Iris Clin
echo Todos os direitos reservados
echo.
echo Pressione qualquer tecla para finalizar...
pause >nul

echo [INFO] Abrindo Vision-Scan Pro...
start "" "%INSTALL_DIR%\index.html"

exit /b 0

