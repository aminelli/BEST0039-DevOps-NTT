# ==============================================================================
# Multi-stage Dockerfile for Spring Boot Application
# Best Practices Implementation
# ==============================================================================

# ==============================================================================
# Stage 1: Build Stage
# ==============================================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

# Set working directory
WORKDIR /workspace/app

# Copy Maven wrapper and pom.xml first (for better layer caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application (skip tests for faster builds)
# For production, remove -DskipTests to run tests during build
RUN ./mvnw clean package -DskipTests

# ==============================================================================
# Stage 2: Runtime Stage (Optimized)
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder --chown=spring:spring /workspace/app/target/*.jar /app/app.jar

# Switch to non-root user
USER spring:spring

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Set JVM options for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+OptimizeStringConcat \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom"

# Run application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

# ==============================================================================
# Build Instructions (from project root):
# docker build -f infra/Dockerfile -t devops-app:latest .
#
# Build Instructions (from infra folder):
# docker build -f Dockerfile -t devops-app:latest ..
#
# Run Instructions:
# docker run -p 8080:8080 devops-app:latest
#
# Run with custom memory:
# docker run -p 8080:8080 -e JAVA_OPTS="-Xmx512m -Xms256m" devops-app:latest
# ==============================================================================
