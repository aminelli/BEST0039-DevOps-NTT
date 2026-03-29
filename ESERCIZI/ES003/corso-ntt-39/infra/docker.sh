#!/bin/bash

# ==============================================================================
# Docker Helper Script for DevOps Spring Boot Application
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="devops-app"
CONTAINER_NAME="devops-spring-app"
VERSION="1.0"
PORT="8080"

# Functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

show_help() {
    cat << EOF
🐳 Docker Helper Script for DevOps Spring Boot App

Usage: ./docker.sh [command]

Commands:
    build         Build Docker image
    build-opt     Build with optimized Dockerfile
    run           Run container
    stop          Stop container
    restart       Restart container
    logs          Show container logs
    logs-f        Follow container logs
    shell         Open shell in container
    clean         Remove container and image
    clean-all     Clean all Docker resources
    stats         Show container statistics
    health        Check container health
    compose-up    Start with docker-compose
    compose-down  Stop docker-compose
    push          Push image to registry
    help          Show this help message

Examples:
    ./docker.sh build
    ./docker.sh run
    ./docker.sh logs-f
    ./docker.sh clean

EOF
}

build_image() {
    print_info "Building Docker image: ${IMAGE_NAME}:${VERSION}"
    docker build -f Dockerfile -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:latest ..
    print_success "Image built successfully!"
    docker images | grep ${IMAGE_NAME}
}

build_optimized() {
    print_info "Building optimized Docker image: ${IMAGE_NAME}:${VERSION}-optimized"
    docker build -f Dockerfile.optimized -t ${IMAGE_NAME}:${VERSION}-optimized ..
    print_success "Optimized image built successfully!"
    docker images | grep ${IMAGE_NAME}
}

run_container() {
    print_info "Running container: ${CONTAINER_NAME}"
    
    # Check if container already exists
    if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
        print_warning "Container ${CONTAINER_NAME} already exists. Removing..."
        docker rm -f ${CONTAINER_NAME}
    fi
    
    docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${PORT}:8080 \
        --restart unless-stopped \
        ${IMAGE_NAME}:latest
    
    print_success "Container started successfully!"
    print_info "Application available at: http://localhost:${PORT}"
    
    sleep 3
    docker ps | grep ${CONTAINER_NAME}
}

stop_container() {
    print_info "Stopping container: ${CONTAINER_NAME}"
    docker stop ${CONTAINER_NAME}
    print_success "Container stopped!"
}

restart_container() {
    print_info "Restarting container: ${CONTAINER_NAME}"
    docker restart ${CONTAINER_NAME}
    print_success "Container restarted!"
}

show_logs() {
    print_info "Showing logs for: ${CONTAINER_NAME}"
    docker logs --tail 100 ${CONTAINER_NAME}
}

follow_logs() {
    print_info "Following logs for: ${CONTAINER_NAME}"
    docker logs -f ${CONTAINER_NAME}
}

open_shell() {
    print_info "Opening shell in: ${CONTAINER_NAME}"
    docker exec -it ${CONTAINER_NAME} /bin/sh
}

clean_container() {
    print_warning "Cleaning container and image..."
    
    if [ "$(docker ps -aq -f name=${CONTAINER_NAME})" ]; then
        docker rm -f ${CONTAINER_NAME}
        print_success "Container removed!"
    fi
    
    if [ "$(docker images -q ${IMAGE_NAME})" ]; then
        docker rmi -f ${IMAGE_NAME}:latest ${IMAGE_NAME}:${VERSION}
        print_success "Images removed!"
    fi
}

clean_all() {
    print_warning "Cleaning all Docker resources..."
    read -p "Are you sure? This will remove all unused containers, images, and volumes. (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -a --volumes -f
        print_success "All resources cleaned!"
    fi
}

show_stats() {
    print_info "Container statistics:"
    docker stats --no-stream ${CONTAINER_NAME}
}

check_health() {
    print_info "Checking container health..."
    
    if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
        health=$(docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null || echo "no healthcheck")
        echo -e "Health Status: ${GREEN}${health}${NC}"
        
        print_info "Testing endpoint..."
        curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:${PORT}/ || print_error "Endpoint not reachable"
    else
        print_error "Container is not running!"
    fi
}

compose_up() {
    print_info "Starting with docker-compose..."
    docker-compose up -d --build
    print_success "Services started!"
    docker-compose ps
}

compose_down() {
    print_info "Stopping docker-compose services..."
    docker-compose down
    print_success "Services stopped!"
}

push_image() {
    print_info "Pushing image to registry..."
    read -p "Enter registry URL (e.g., username/devops-app): " REGISTRY
    
    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}:${VERSION}
    docker tag ${IMAGE_NAME}:latest ${REGISTRY}:latest
    
    docker push ${REGISTRY}:${VERSION}
    docker push ${REGISTRY}:latest
    
    print_success "Images pushed successfully!"
}

# Main script logic
case "${1}" in
    build)
        build_image
        ;;
    build-opt)
        build_optimized
        ;;
    run)
        run_container
        ;;
    stop)
        stop_container
        ;;
    restart)
        restart_container
        ;;
    logs)
        show_logs
        ;;
    logs-f)
        follow_logs
        ;;
    shell)
        open_shell
        ;;
    clean)
        clean_container
        ;;
    clean-all)
        clean_all
        ;;
    stats)
        show_stats
        ;;
    health)
        check_health
        ;;
    compose-up)
        compose_up
        ;;
    compose-down)
        compose_down
        ;;
    push)
        push_image
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac
