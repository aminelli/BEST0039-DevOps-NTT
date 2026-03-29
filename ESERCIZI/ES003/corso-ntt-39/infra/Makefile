# ==============================================================================
# Makefile for DevOps Spring Boot Application
# ==============================================================================

# Variables
APP_NAME := devops-app
IMAGE_NAME := $(APP_NAME)
CONTAINER_NAME := devops-spring-app
VERSION := 1.0
PORT := 8080
DOCKER_REGISTRY ?= 

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

##@ General

.PHONY: help
help: ## Display this help message
	@echo "$(BLUE)DevOps Spring Boot Application - Makefile$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	cd .. && ./mvnw dependency:go-offline

.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	cd .. && ./mvnw clean

.PHONY: compile
compile: ## Compile the application
	@echo "$(BLUE)Compiling application...$(NC)"
	cd .. && ./mvnw compile

.PHONY: test
test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	cd .. && ./mvnw test

.PHONY: package
package: ## Package the application
	@echo "$(BLUE)Packaging application...$(NC)"
	cd .. && ./mvnw clean package -DskipTests

.PHONY: run
run: ## Run the application locally
	@echo "$(BLUE)Starting application...$(NC)"
	cd .. && ./mvnw spring-boot:run

.PHONY: dev
dev: clean run ## Clean and run in development mode

##@ Quality & Code Analysis

.PHONY: coverage
coverage: ## Generate code coverage report with JaCoCo
	@echo "$(BLUE)Generating code coverage report...$(NC)"
	cd .. && ./mvnw clean test
	@echo "$(GREEN)Coverage report generated: ../target/site/jacoco/index.html$(NC)"

.PHONY: coverage-open
coverage-open: coverage ## Generate and open coverage report
	@echo "$(BLUE)Opening coverage report...$(NC)"
ifeq ($(OS),Windows_NT)
	@start ../target/site/jacoco/index.html
else
	@open ../target/site/jacoco/index.html || xdg-open ../target/site/jacoco/index.html
endif

.PHONY: sonar
sonar: ## Run SonarQube analysis (requires SONAR_TOKEN env var)
	@echo "$(BLUE)Running SonarQube analysis...$(NC)"
	@if [ -z "$$SONAR_TOKEN" ]; then \
		echo "$(YELLOW)Warning: SONAR_TOKEN not set. Analysis may fail.$(NC)"; \
		echo "$(YELLOW)Set it with: export SONAR_TOKEN=your_token$(NC)"; \
	fi
	cd .. && ./mvnw clean verify sonar:sonar

.PHONY: sonar-local
sonar-local: ## Run SonarQube analysis on local server (localhost:9000)
	@echo "$(BLUE)Running SonarQube analysis on local server...$(NC)"
	cd .. && ./mvnw clean verify sonar:sonar -Dsonar.host.url=http://localhost:9000

.PHONY: verify
verify: ## Run tests and code quality checks
	@echo "$(BLUE)Running verification (tests + coverage)...$(NC)"
	cd .. && ./mvnw clean verify
	@echo "$(GREEN)Verification completed!$(NC)"

##@ Docker

.PHONY: docker-build
docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image: $(IMAGE_NAME):$(VERSION)$(NC)"
	docker build -f Dockerfile -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest ..
	@echo "$(GREEN)Build completed!$(NC)"

.PHONY: docker-build-optimized
docker-build-optimized: ## Build optimized Docker image
	@echo "$(BLUE)Building optimized Docker image...$(NC)"
	docker build -f Dockerfile.optimized -t $(IMAGE_NAME):$(VERSION)-optimized ..
	@echo "$(GREEN)Optimized build completed!$(NC)"

.PHONY: docker-run
docker-run: ## Run Docker container
	@echo "$(BLUE)Starting Docker container...$(NC)"
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):8080 \
		--restart unless-stopped \
		$(IMAGE_NAME):latest
	@echo "$(GREEN)Container started! Access at http://localhost:$(PORT)$(NC)"

.PHONY: docker-stop
docker-stop: ## Stop Docker container
	@echo "$(BLUE)Stopping Docker container...$(NC)"
	docker stop $(CONTAINER_NAME)
	@echo "$(GREEN)Container stopped!$(NC)"

.PHONY: docker-logs
docker-logs: ## View Docker container logs
	docker logs -f $(CONTAINER_NAME)

.PHONY: docker-shell
docker-shell: ## Open shell in Docker container
	docker exec -it $(CONTAINER_NAME) /bin/sh

.PHONY: docker-stats
docker-stats: ## Show Docker container statistics
	docker stats $(CONTAINER_NAME)

.PHONY: docker-clean
docker-clean: ## Remove Docker container and images
	@echo "$(YELLOW)Cleaning Docker resources...$(NC)"
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	@docker rmi -f $(IMAGE_NAME):latest $(IMAGE_NAME):$(VERSION) 2>/dev/null || true
	@echo "$(GREEN)Docker resources cleaned!$(NC)"

##@ Docker Compose

.PHONY: compose-up
compose-up: ## Start services with docker-compose
	@echo "$(BLUE)Starting services with docker-compose...$(NC)"
	docker-compose up -d --build
	@echo "$(GREEN)Services started!$(NC)"
	docker-compose ps

.PHONY: compose-down
compose-down: ## Stop docker-compose services
	@echo "$(BLUE)Stopping docker-compose services...$(NC)"
	docker-compose down
	@echo "$(GREEN)Services stopped!$(NC)"

.PHONY: compose-logs
compose-logs: ## View docker-compose logs
	docker-compose logs -f

.PHONY: compose-ps
compose-ps: ## List docker-compose services
	docker-compose ps

.PHONY: compose-restart
compose-restart: ## Restart docker-compose services
	docker-compose restart

##@ Registry

.PHONY: docker-push
docker-push: ## Push Docker image to registry
	@if [ -z "$(DOCKER_REGISTRY)" ]; then \
		echo "$(YELLOW)Error: DOCKER_REGISTRY not set. Use: make docker-push DOCKER_REGISTRY=username/repo$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Pushing to $(DOCKER_REGISTRY)...$(NC)"
	docker tag $(IMAGE_NAME):$(VERSION) $(DOCKER_REGISTRY):$(VERSION)
	docker tag $(IMAGE_NAME):latest $(DOCKER_REGISTRY):latest
	docker push $(DOCKER_REGISTRY):$(VERSION)
	docker push $(DOCKER_REGISTRY):latest
	@echo "$(GREEN)Images pushed successfully!$(NC)"

.PHONY: docker-pull
docker-pull: ## Pull Docker image from registry
	@if [ -z "$(DOCKER_REGISTRY)" ]; then \
		echo "$(YELLOW)Error: DOCKER_REGISTRY not set$(NC)"; \
		exit 1; \
	fi
	docker pull $(DOCKER_REGISTRY):latest

##@ CI/CD

.PHONY: ci
ci: clean test package ## Run CI pipeline (clean, test, package)
	@echo "$(GREEN)CI pipeline completed!$(NC)"

.PHONY: cd
cd: docker-build docker-run ## Run CD pipeline (build, run)
	@echo "$(GREEN)CD pipeline completed!$(NC)"

.PHONY: all
all: ci cd ## Run full CI/CD pipeline
	@echo "$(GREEN)Full pipeline completed!$(NC)"

##@ Utilities

.PHONY: health
health: ## Check application health
	@echo "$(BLUE)Checking application health...$(NC)"
	@curl -f http://localhost:$(PORT)/ && echo "$(GREEN)Application is healthy!$(NC)" || echo "$(YELLOW)Application not responding$(NC)"

.PHONY: info
info: ## Display build information
	@echo "$(BLUE)Build Information:$(NC)"
	@echo "  App Name:       $(APP_NAME)"
	@echo "  Image Name:     $(IMAGE_NAME)"
	@echo "  Container Name: $(CONTAINER_NAME)"
	@echo "  Version:        $(VERSION)"
	@echo "  Port:           $(PORT)"
	@echo "  Registry:       $(DOCKER_REGISTRY)"

.PHONY: logs-app
logs-app: ## View application logs (local run)
	tail -f logs/*.log

.PHONY: format
format: ## Format code (requires Maven)
	./mvnw spring-javaformat:apply

.PHONY: verify
verify: ## Verify code quality
	./mvnw verify

##@ Quick Commands

.PHONY: quick-start
quick-start: docker-build docker-run ## Quick start with Docker
	@echo "$(GREEN)Application started at http://localhost:$(PORT)$(NC)"

.PHONY: quick-stop
quick-stop: docker-stop docker-clean ## Quick stop and clean
	@echo "$(GREEN)Application stopped and cleaned$(NC)"

.PHONY: rebuild
rebuild: docker-clean docker-build docker-run ## Rebuild and restart
	@echo "$(GREEN)Application rebuilt and restarted$(NC)"

# ==============================================================================
# Usage Examples:
# make help                              - Show this help
# make run                               - Run locally with Maven
# make docker-build                      - Build Docker image
# make compose-up                        - Start with docker-compose
# make ci                                - Run CI pipeline
# make all                               - Run full CI/CD
# make docker-push DOCKER_REGISTRY=user/app - Push to registry
# ==============================================================================
