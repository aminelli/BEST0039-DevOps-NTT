# 📦 Infrastructure Files

Questa cartella contiene tutti i file necessari per il deployment e la containerizzazione dell'applicazione DevOps Spring Boot.

## 📁 Contenuto

### Docker Files
- **`Dockerfile`** - Multi-stage build con sicurezza e best practices
- **`Dockerfile.optimized`** - Build ottimizzato con Spring Boot layering per caching migliorato
- **`.dockerignore`** - File da escludere dal build context Docker
- **`docker-compose.yml`** - Orchestrazione container con Docker Compose

### Kubernetes Files
- **`k8s-deployment.yml`** - Manifest Kubernetes completo con deployment, service, ingress, HPA, ecc.

### Helper Scripts
- **`docker.sh`** - Script helper per operazioni Docker su Linux/Mac
- **`docker.cmd`** - Script helper per operazioni Docker su Windows
- **`Makefile`** - Automazione build, test e deployment

### Documentation
- **`DOCKER.md`** - Guida completa per il deployment Docker
- **`KUBERNETES.md`** - Guida completa per il deployment Kubernetes
- **`README.md`** - Questo file

## 🚀 Quick Start

### Docker (Metodo più semplice)

```bash
# Dalla cartella infra/
cd infra

# Con Docker Compose (raccomandato)
docker-compose up -d --build

# Visualizza logs
docker-compose logs -f

# Accedi all'app
# http://localhost:8080
```

### Helper Scripts

**Windows:**
```bash
cd infra
.\docker.cmd build
.\docker.cmd run
.\docker.cmd logs-f
```

**Linux/Mac:**
```bash
cd infra
chmod +x docker.sh
./docker.sh build
./docker.sh run
./docker.sh logs-f
```

### Makefile

```bash
cd infra

# Mostra tutti i comandi disponibili
make help

# Build Docker image
make docker-build

# Run con Docker
make docker-run

# Build e run l'app Java (development)
make package
make run

# Docker Compose
make compose-up
make compose-logs
make compose-down
```

### Kubernetes

```bash
# Dalla root del progetto
kubectl apply -f infra/k8s-deployment.yml

# Verifica deployment
kubectl get all -n devops-app

# Port forward per test
kubectl port-forward service/devops-app-service 8080:80 -n devops-app
```

## 📖 Guide Complete

- 🐳 **[DOCKER.md](DOCKER.md)** - Setup Docker, comandi avanzati, best practices
- ☸️ **[KUBERNETES.md](KUBERNETES.md)** - Deployment K8s, scaling, monitoring

## 🔧 Comandi Rapidi

### Development Workflow

```bash
# 1. Build l'applicazione
cd ..
./mvnw clean package -DskipTests

# 2. Build Docker image
cd infra
docker build -f Dockerfile -t devops-app:latest ..

# 3. Run container
docker run -d -p 8080:8080 --name devops-app devops-app:latest

# 4. Verifica logs
docker logs -f devops-app
```

### Production Workflow

```bash
# 1. Build ottimizzato
cd infra
docker build -f Dockerfile.optimized -t devops-app:prod ..

# 2. Tag per registry
docker tag devops-app:prod your-registry.io/devops-app:1.0

# 3. Push to registry
docker push your-registry.io/devops-app:1.0

# 4. Deploy to Kubernetes
kubectl apply -f k8s-deployment.yml
```

## 🎯 Path Context

**IMPORTANTE**: I Dockerfile e docker-compose.yml usano percorsi relativi che assumono:
- **Context di build**: La directory root del progetto (`..` dalla cartella infra)
- **Dockerfile path**: `infra/Dockerfile` o `infra/Dockerfile.optimized`

Questo significa che:

```bash
# ✅ Corretto - dalla cartella infra
docker build -f Dockerfile -t devops-app ..

# ✅ Corretto - dalla root del progetto
docker build -f infra/Dockerfile -t devops-app .

# ❌ Sbagliato - context errato
docker build -f Dockerfile -t devops-app .
```

Per Docker Compose, il file già specifica i path corretti:
```yaml
build:
  context: ..          # Root del progetto
  dockerfile: infra/Dockerfile
```

## 📊 Struttura File

```
infra/
├── Dockerfile                 # Docker build standard
├── Dockerfile.optimized       # Docker build con layering
├── .dockerignore             # Esclusioni Docker
├── docker-compose.yml        # Orchestrazione
├── k8s-deployment.yml        # Kubernetes manifest
├── docker.sh                 # Helper script (Linux/Mac)
├── docker.cmd                # Helper script (Windows)
├── Makefile                  # Build automation
├── DOCKER.md                 # Docker documentation
├── KUBERNETES.md             # Kubernetes documentation
└── README.md                 # Questo file
```

## 💡 Tips

1. **Primo utilizzo**: Usa Docker Compose (`docker-compose up -d --build`)
2. **Development**: Usa gli helper scripts per velocità
3. **CI/CD**: Usa il Makefile per automazione standardizzata
4. **Production**: Usa Kubernetes con i manifest forniti

## 🔗 Collegamenti

- [README principale](../README.md) - Documentazione completa applicazione
- [DOCKER.md](DOCKER.md) - Guida deployment Docker
- [KUBERNETES.md](KUBERNETES.md) - Guida deployment Kubernetes

---

**Ready to deploy! 🚀**
