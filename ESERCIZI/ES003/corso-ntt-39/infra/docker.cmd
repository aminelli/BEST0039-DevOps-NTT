@echo off
REM ==============================================================================
REM Docker Helper Script for DevOps Spring Boot Application (Windows)
REM ==============================================================================

setlocal EnableDelayedExpansion

REM Configuration
set IMAGE_NAME=devops-app
set CONTAINER_NAME=devops-spring-app
set VERSION=1.0
set PORT=8080

REM Main script logic
if "%1"=="" goto :show_help
if "%1"=="build" goto :build_image
if "%1"=="build-opt" goto :build_optimized
if "%1"=="run" goto :run_container
if "%1"=="stop" goto :stop_container
if "%1"=="restart" goto :restart_container
if "%1"=="logs" goto :show_logs
if "%1"=="logs-f" goto :follow_logs
if "%1"=="shell" goto :open_shell
if "%1"=="clean" goto :clean_container
if "%1"=="stats" goto :show_stats
if "%1"=="health" goto :check_health
if "%1"=="compose-up" goto :compose_up
if "%1"=="compose-down" goto :compose_down
if "%1"=="help" goto :show_help

echo Unknown command: %1
echo.
goto :show_help

:show_help
echo.
echo === Docker Helper Script for DevOps Spring Boot App ===
echo.
echo Usage: docker.cmd [command]
echo.
echo Commands:
echo   build         Build Docker image
echo   build-opt     Build with optimized Dockerfile
echo   run           Run container
echo   stop          Stop container
echo   restart       Restart container
echo   logs          Show container logs
echo   logs-f        Follow container logs
echo   shell         Open shell in container
echo   clean         Remove container and image
echo   stats         Show container statistics
echo   health        Check container health
echo   compose-up    Start with docker-compose
echo   compose-down  Stop docker-compose
echo   help          Show this help message
echo.
echo Examples:
echo   docker.cmd build
echo   docker.cmd run
echo   docker.cmd logs-f
echo   docker.cmd clean
echo.
goto :eof

:build_image
echo Building Docker image: %IMAGE_NAME%:%VERSION%
docker build -f Dockerfile -t %IMAGE_NAME%:%VERSION% -t %IMAGE_NAME%:latest ..
if %errorlevel% equ 0 (
    echo [SUCCESS] Image built successfully!
    docker images | findstr %IMAGE_NAME%
) else (
    echo [ERROR] Build failed!
)
goto :eof

:build_optimized
echo Building optimized Docker image: %IMAGE_NAME%:%VERSION%-optimized
docker build -f Dockerfile.optimized -t %IMAGE_NAME%:%VERSION%-optimized ..
if %errorlevel% equ 0 (
    echo [SUCCESS] Optimized image built successfully!
    docker images | findstr %IMAGE_NAME%
) else (
    echo [ERROR] Build failed!
)
goto :eof

:run_container
echo Running container: %CONTAINER_NAME%

REM Check if container exists and remove it
docker ps -a | findstr %CONTAINER_NAME% > nul
if %errorlevel% equ 0 (
    echo Container exists. Removing...
    docker rm -f %CONTAINER_NAME%
)

docker run -d --name %CONTAINER_NAME% -p %PORT%:8080 --restart unless-stopped %IMAGE_NAME%:latest
if %errorlevel% equ 0 (
    echo [SUCCESS] Container started successfully!
    echo Application available at: http://localhost:%PORT%
    timeout /t 3 /nobreak > nul
    docker ps | findstr %CONTAINER_NAME%
) else (
    echo [ERROR] Failed to start container!
)
goto :eof

:stop_container
echo Stopping container: %CONTAINER_NAME%
docker stop %CONTAINER_NAME%
if %errorlevel% equ 0 (
    echo [SUCCESS] Container stopped!
) else (
    echo [ERROR] Failed to stop container!
)
goto :eof

:restart_container
echo Restarting container: %CONTAINER_NAME%
docker restart %CONTAINER_NAME%
if %errorlevel% equ 0 (
    echo [SUCCESS] Container restarted!
) else (
    echo [ERROR] Failed to restart container!
)
goto :eof

:show_logs
echo Showing logs for: %CONTAINER_NAME%
docker logs --tail 100 %CONTAINER_NAME%
goto :eof

:follow_logs
echo Following logs for: %CONTAINER_NAME%
docker logs -f %CONTAINER_NAME%
goto :eof

:open_shell
echo Opening shell in: %CONTAINER_NAME%
docker exec -it %CONTAINER_NAME% /bin/sh
goto :eof

:clean_container
echo Cleaning container and images...

docker ps -a | findstr %CONTAINER_NAME% > nul
if %errorlevel% equ 0 (
    docker rm -f %CONTAINER_NAME%
    echo [SUCCESS] Container removed!
)

docker images | findstr %IMAGE_NAME% > nul
if %errorlevel% equ 0 (
    docker rmi -f %IMAGE_NAME%:latest %IMAGE_NAME%:%VERSION%
    echo [SUCCESS] Images removed!
)
goto :eof

:show_stats
echo Container statistics:
docker stats --no-stream %CONTAINER_NAME%
goto :eof

:check_health
echo Checking container health...

docker ps | findstr %CONTAINER_NAME% > nul
if %errorlevel% equ 0 (
    echo Container is running
    
    echo Testing endpoint...
    curl -s -o nul -w "HTTP Status: %%{http_code}" http://localhost:%PORT%/
    echo.
) else (
    echo [ERROR] Container is not running!
)
goto :eof

:compose_up
echo Starting with docker-compose...
docker-compose up -d --build
if %errorlevel% equ 0 (
    echo [SUCCESS] Services started!
    docker-compose ps
) else (
    echo [ERROR] Failed to start services!
)
goto :eof

:compose_down
echo Stopping docker-compose services...
docker-compose down
if %errorlevel% equ 0 (
    echo [SUCCESS] Services stopped!
) else (
    echo [ERROR] Failed to stop services!
)
goto :eof
