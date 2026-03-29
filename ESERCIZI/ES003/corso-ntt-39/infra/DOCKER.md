# 🐳 Docker Deployment Guide

## 📋 File Disponibili

Tutti i file per il deployment Docker sono nella cartella `infra/`:

- **`Dockerfile`** - Dockerfile multi-stage standard con best practices
- **`Dockerfile.optimized`** - Dockerfile ottimizzato con Spring Boot layering
- **`.dockerignore`** - Esclusione file non necessari nell'immagine
- **`docker-compose.yml`** - Orchestrazione con Docker Compose
- **`docker.sh`** - Script helper per Linux/Mac
- **`docker.cmd`** - Script helper per Windows

## 🏗️ Best Practices Implementate

### Sicurezza
- ✅ **Multi-stage build** - Riduce dimensione immagine finale
- ✅ **Non-root user** - L'app gira come utente `spring` non privilegiato
- ✅ **Minimal base image** - Usa `alpine` per ridurre la superficie di attacco
- ✅ **Dumb-init** - Gestione corretta dei segnali e processi zombie

### Performance
- ✅ **Layer caching** - Dipendenze scaricate solo quando cambiano
- ✅ **JVM ottimizzato** - Flags specifici per ambienti containerizzati
- ✅ **Layer ordering** - File che cambiano meno frequentemente prima
- ✅ **Resource limits** - Limiti CPU e memoria configurabili

### Operazioni
- ✅ **Health checks** - Verifica automatica dello stato dell'app
- ✅ **Logging configuration** - Rotazione log automatica
- ✅ **Restart policy** - Riavvio automatico in caso di crash

## 🚀 Quick Start

### Metodo 1: Docker Compose (Raccomandato)

```bash
# Dalla root del progetto
cd infra

# Build e avvio
docker-compose up -d --build

# Visualizza logs
docker-compose logs -f

# Stop
docker-compose down
```

### Metodo 2: Docker Build & Run

```bash
# Dalla root del progetto, build immagine
docker build -f infra/Dockerfile -t devops-app:latest .

# Run container
docker run -d -p 8080:8080 --name devops-app devops-app:latest

# Visualizza logs
docker logs -f devops-app

# Stop e rimuovi
docker stop devops-app
docker rm devops-app
```

### Metodo 3: Dockerfile Ottimizzato (Layer-based)

```bash
# Dalla root del progetto
# Build con Dockerfile ottimizzato
docker build -f infra/Dockerfile.optimized -t devops-app:optimized .

# Run
docker run -d -p 8080:8080 --name devops-app devops-app:optimized
```

### Metodo 4: Helper Scripts

**Windows:**
```bash
cd infra
.\docker.cmd build
.\docker.cmd run
```

**Linux/Mac:**
```bash
cd infra
chmod +x docker.sh
./docker.sh build
./docker.sh run
```

## 🎯 Comandi Utili

### Build

```bash
# Build standard dalla root
docker build -f infra/Dockerfile -t devops-app:1.0 .

# Build con cache disabilitata
docker build --no-cache -f infra/Dockerfile -t devops-app:1.0 .

# Build con build args
docker build -f infra/Dockerfile --build-arg JAVA_VERSION=21 -t devops-app:1.0 .

# Build multi-platform (per ARM e x86)
docker buildx build --platform linux/amd64,linux/arm64 -f infra/Dockerfile -t devops-app:1.0 .
```

### Run

```bash
# Run basic
docker run -p 8080:8080 devops-app:latest

# Run in background (detached)
docker run -d -p 8080:8080 --name devops-app devops-app:latest

# Run con memoria limitata
docker run -d -p 8080:8080 -m 512m --memory-reservation 256m devops-app:latest

# Run con variabili d'ambiente
docker run -d -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e JAVA_OPTS="-Xmx512m -Xms256m" \
  devops-app:latest

# Run con volume per logs
docker run -d -p 8080:8080 \
  -v $(pwd)/logs:/app/logs \
  devops-app:latest
```

### Monitoring

```bash
# Visualizza containers attivi
docker ps

# Visualizza tutti i containers
docker ps -a

# Logs in tempo reale
docker logs -f devops-app

# Logs ultimi 100 righe
docker logs --tail 100 devops-app

# Stats real-time
docker stats devops-app

# Ispeziona container
docker inspect devops-app

# Health check status
docker inspect --format='{{json .State.Health}}' devops-app
```

### Maintenance

```bash
# Stop container
docker stop devops-app

# Start container
docker start devops-app

# Restart container
docker restart devops-app

# Rimuovi container
docker rm -f devops-app

# Rimuovi immagine
docker rmi devops-app:latest

# Pulisci risorse non usate
docker system prune -a

# Pulisci volumi non usati
docker volume prune
```

## 🔧 Configurazione Avanzata

### Variabili d'Ambiente

```bash
# Spring Profile
-e SPRING_PROFILES_ACTIVE=prod

# Porta custom
-e SERVER_PORT=8081

# JVM Memory
-e JAVA_OPTS="-Xmx1g -Xms512m"

# Timezone
-e TZ=Europe/Rome

# Debug mode
-e JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
```

### Docker Compose con Database (Esempio Futuro)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/devops
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=devops
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## 📊 Dimensioni Immagini

| Dockerfile | Dimensione Stimata | Note |
|------------|-------------------|------|
| `Dockerfile` | ~200-250 MB | Multi-stage standard |
| `Dockerfile.optimized` | ~180-220 MB | Con layer caching ottimizzato |
| Con JDK (build only) | ~400-500 MB | Non usare in production |

## 🧪 Testing

```bash
# Health check manuale
curl http://localhost:8080/actuator/health

# Test endpoint home
curl http://localhost:8080/

# Test con headers
curl -i http://localhost:8080/about

# Load test con Apache Bench
ab -n 1000 -c 10 http://localhost:8080/
```

## 🐛 Troubleshooting

### Container non si avvia

```bash
# Controlla logs
docker logs devops-app

# Controlla se la porta è occupata
netstat -an | grep 8080  # Windows
lsof -i :8080            # Linux/Mac

# Verifica configurazione
docker inspect devops-app
```

### Out of Memory

```bash
# Aumenta memoria allocata
docker run -m 1g devops-app:latest

# Modifica JAVA_OPTS
docker run -e JAVA_OPTS="-Xmx768m" devops-app:latest
```

### Performance Issues

```bash
# Monitora risorse
docker stats devops-app

# Controlla CPU e memoria limits
docker inspect --format='{{.HostConfig.Memory}}' devops-app
docker inspect --format='{{.HostConfig.NanoCpus}}' devops-app
```

## 🚢 Deploy su Registry

### Docker Hub

```bash
# Login
docker login

# Tag immagine
docker tag devops-app:latest username/devops-app:1.0

# Push
docker push username/devops-app:1.0

# Pull su altro server
docker pull username/devops-app:1.0
```

### Private Registry

```bash
# Tag per private registry
docker tag devops-app:latest registry.company.com/devops-app:1.0

# Push
docker push registry.company.com/devops-app:1.0
```

## 📈 Best Practices per Production

1. **Usa tag specifici** invece di `latest`
2. **Implementa health checks** per orchestratori
3. **Configura log rotation** per evitare dischi pieni
4. **Usa secrets** per credenziali sensitive
5. **Monitora con Prometheus/Grafana**
6. **Implementa graceful shutdown**
7. **Usa reverse proxy** (Nginx/Traefik)
8. **Configura HTTPS** con certificati SSL

## 📚 Risorse

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [Docker Security](https://docs.docker.com/engine/security/)

---

**Pronto per il deployment! 🎉**
