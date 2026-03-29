# DevOps Spring Boot Application

Applicazione web completa sviluppata con **Spring Boot 4.0.4**, **Spring Security** e **Thymeleaf** nell'ambito del Corso NTT DevOps.

## 📋 Indice

- [Caratteristiche](#caratteristiche)
- [Tecnologie Utilizzate](#tecnologie-utilizzate)
- [Requisiti](#requisiti)
- [Installazione](#installazione)
- [Avvio dell'Applicazione](#avvio-dellapplicazione)
- [Docker Deployment](#docker-deployment)
- [Test](#test)
- [SonarQube & Code Quality](#sonarqube--code-quality)
- [Credenziali di Accesso](#credenziali-di-accesso)
- [Struttura del Progetto](#struttura-del-progetto)
- [Endpoints](#endpoints)
- [Funzionalità](#funzionalità)
- [Build e Deploy](#build-e-deploy)

## 🚀 Caratteristiche

- ✅ Sistema di autenticazione sicuro con Spring Security 6
- ✅ Gestione utenti in-memory con password BCrypt
- ✅ Aree pubbliche (Home, About) e private (Dashboard)
- ✅ Design responsive con Bootstrap 5
- ✅ Template Thymeleaf con fragments riutilizzabili
- ✅ Architettura MVC ben strutturata
- ✅ Navbar dinamica basata sullo stato di autenticazione
- ✅ Gestione sessioni e CSRF protection
- ✅ Logout sicuro con invalidazione sessione
- ✅ Analisi statica del codice con SonarQube
- ✅ Code coverage con JaCoCo

## 🛠 Tecnologie Utilizzate

### Backend
- **Java 21** - Linguaggio di programmazione
- **Spring Boot 4.0.4** - Framework applicativo
- **Spring MVC** - Pattern Model-View-Controller
- **Spring Security 6** - Autenticazione e autorizzazione
- **Thymeleaf** - Template engine per rendering HTML
- **Maven** - Gestione dipendenze e build

### Code Quality
- **SonarQube** - Analisi statica del codice
- **JaCoCo** - Code coverage reporting

### Frontend
- **HTML5** - Struttura delle pagine
- **CSS3** - Stilizzazione personalizzata
- **Bootstrap 5.3** - Framework CSS responsive
- **Bootstrap Icons** - Libreria di icone
- **JavaScript** - Funzionalità interattive

## 📦 Requisiti

- **Java 21** o superiore
- **Maven 3.6+** o superiore
- Un browser web moderno

## 💾 Installazione

### 1. Clone del repository
```bash
git clone <repository-url>
cd corso-ntt-39
```

### 2. Verifica Java e Maven
```bash
java -version
mvn -version
```

## ▶️ Avvio dell'Applicazione

### Metodo 1: Maven Wrapper (Consigliato)

**Windows:**
```bash
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

### Metodo 2: Maven
```bash
mvn spring-boot:run
```

### Metodo 3: Package e Run
```bash
mvn clean package
java -jar target/corsontt39-0.0.1-SNAPSHOT.jar
```

L'applicazione sarà disponibile su: **http://localhost:8080**

## 🐳 Docker Deployment

L'applicazione è pronta per essere containerizzata con Docker. Sono disponibili diversi metodi:

### Quick Start con Docker Compose (Raccomandato)

```bash
# Build e avvia l'applicazione
docker-compose -f infra/docker-compose.yml up -d --build

# Visualizza i logs
docker-compose -f infra/docker-compose.yml logs -f

# Stop
docker-compose -f infra/docker-compose.yml down
```

### Docker Build & Run Manuale

```bash
# Build immagine Docker
docker build -f infra/Dockerfile -t devops-app:latest .

# Run container
docker run -d -p 8080:8080 --name devops-app devops-app:latest

# Visualizza logs
docker logs -f devops-app
```

### Helper Scripts

Per semplificare le operazioni Docker:

**Windows:**
```bash
# Build
.\infra\docker.cmd build

# Run
.\infra\docker.cmd run

# Logs
.\infra\docker.cmd logs-f

# Health check
.\infra\docker.cmd health
```

**Linux/Mac:**
```bash
# Rendi eseguibile lo script
chmod +x infra/docker.sh

# Build
./infra/docker.sh build

# Run
./infra/docker.sh run

# Logs
./infra/docker.sh logs-f
```

### File Docker Disponibili

- **`infra/Dockerfile`** - Multi-stage build con best practices
- **`infra/Dockerfile.optimized`** - Versione ottimizzata con Spring Boot layering
- **`infra/docker-compose.yml`** - Orchestrazione completa
- **`infra/.dockerignore`** - Esclusione file non necessari
- **`infra/DOCKER.md`** - Guida completa Docker

📖 **Per la guida completa Docker, consulta [infra/DOCKER.md](infra/DOCKER.md)**

### Caratteristiche Docker

- ✅ Multi-stage build per immagini leggere (~200MB)
- ✅ Non-root user per sicurezza
- ✅ Health checks automatici
- ✅ JVM ottimizzato per container
- ✅ Gestione corretta dei segnali
- ✅ Resource limits configurabili
## 🧪 Test

L'applicazione dispone di una suite completa di **44 unit test** con **97% di code coverage**.

### Test Coverage

```bash
# Esegui tutti i test
mvn test

# Genera report coverage
mvn clean test

# Apri report nel browser
make coverage-open      # Linux/Mac
start target/site/jacoco/index.html  # Windows
```

### Test Suites

| Suite | Tests | Coverage | Descrizione |
|-------|-------|----------|-------------|
| **HomeControllerTest** | 4 | 100% | Endpoint pubblici |
| **AuthControllerTest** | 5 | 100% | Login e autenticazione |
| **PrivateAreaControllerTest** | 5 | 100% | Area privata |
| **SecurityConfigTest** | 18 | 100% | Configurazione sicurezza |
| **SecurityIntegrationTest** | 8 | 100% | Flussi end-to-end |
| **AppTests** | 4 | - | Smoke tests |
| **TOTALE** | **44** | **97%** | ✅ **All PASS** |

### Verifica Quality Gates

```bash
# Verifica soglia coverage (>50%)
mvn verify

# Con Makefile
make verify
```

📖 **Per i dettagli completi, consulta [TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md)**

---
## � SonarQube & Code Quality

L'applicazione integra **SonarQube** per l'analisi statica del codice e **JaCoCo** per il code coverage.

### Quick Start

```bash
# Genera report coverage
mvn clean test

# Visualizza report: target/site/jacoco/index.html

# Esegui analisi SonarQube (richiede server e token)
mvn clean verify sonar:sonar -Dsonar.token=YOUR_TOKEN
```

### Con Makefile

```bash
cd infra

# Report coverage
make coverage

# Analisi SonarQube
export SONAR_TOKEN=your_token
make sonar

# Analisi su server locale
make sonar-local
```

### Metriche Analizzate

- 🐛 **Bugs** - Errori nel codice
- 🔐 **Vulnerabilities** - Problemi di sicurezza
- 💩 **Code Smells** - Problemi di manutenibilità
- 🔄 **Duplicazioni** - Codice duplicato
- 📏 **Coverage** - Copertura dei test (target: >50%)
- 📐 **Complessità** - Complessità ciclomatica

### SonarQube con Docker

```bash
# Avvia SonarQube locale
docker run -d -p 9000:9000 sonarqube:latest

# Accedi: http://localhost:9000 (admin/admin)
# Genera token e esegui analisi
mvn sonar:sonar -Dsonar.token=YOUR_TOKEN
```

📖 **Per la guida completa, consulta [SONARQUBE.md](SONARQUBE.md)**

## �🔑 Credenziali di Accesso

L'applicazione utilizza autenticazione in-memory con i seguenti utenti:

| Username | Password  | Ruoli           |
|----------|-----------|-----------------|
| `user`   | `password`| ROLE_USER       |
| `admin`  | `admin123`| ROLE_USER, ROLE_ADMIN |
| `demo`   | `demo`    | ROLE_USER       |

## 📁 Struttura del Progetto

```
corso-ntt-39/
├── src/
│   ├── main/
│   │   ├── java/com/corso/devops/corsontt39/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java          # Configurazione Spring Security
│   │   │   ├── controller/
│   │   │   │   ├── HomeController.java          # Controller pagine pubbliche
│   │   │   │   ├── AuthController.java          # Controller autenticazione
│   │   │   │   └── PrivateAreaController.java   # Controller area privata
│   │   │   └── CorsonttApplication.java         # Main class
│   │   └── resources/
│   │       ├── templates/
│   │       │   ├── fragments/
│   │       │   │   ├── header.html              # Header e navbar
│   │       │   │   └── footer.html              # Footer
│   │       │   ├── private/
│   │       │   │   └── dashboard.html           # Dashboard privata
│   │       │   ├── index.html                   # Home page
│   │       │   ├── about.html                   # About page
│   │       │   └── login.html                   # Login page
│   │       ├── static/
│   │       │   ├── css/
│   │       │   │   └── custom.css               # CSS personalizzato
│   │       │   └── js/
│   │       │       └── custom.js                # JavaScript personalizzato
│   │       └── application.properties           # Configurazione applicazione
│   └── test/
│       └── java/com/corso/devops/corsontt39/
│           └── CorsonttApplicationTests.java
├── infra/                                        # Infrastructure & deployment files
│   ├── Dockerfile                                # Docker multi-stage build
│   ├── Dockerfile.optimized                      # Docker layered build
│   ├── docker-compose.yml                        # Docker Compose config
│   ├── .dockerignore                             # Docker exclusions
│   ├── docker.sh                                 # Docker helper (Linux/Mac)
│   ├── docker.cmd                                # Docker helper (Windows)
│   ├── k8s-deployment.yml                        # Kubernetes manifest
│   ├── Makefile                                  # Build automation
│   ├── DOCKER.md                                 # Guida Docker completa
│   ├── KUBERNETES.md                             # Guida Kubernetes completa
│   └── README.md                                 # Infrastructure guide
├── pom.xml                                       # Configurazione Maven
└── README.md                                     # Questo file
```

## 🌐 Endpoints

### Pagine Pubbliche (Accessibili senza autenticazione)
- `GET /` o `GET /home` - Home page
- `GET /about` - About page
- `GET /login` - Login page

### Pagine Private (Richiedono autenticazione)
- `GET /private/dashboard` - Dashboard utente

### Autenticazione
- `POST /login` - Processo di login
- `POST /logout` - Logout

## ⚙️ Funzionalità

### Sistema di Autenticazione
- Login form con validazione
- Password encoding con BCrypt
- Gestione errori di login
- Redirect automatico dopo login/logout
- Protezione CSRF abilitata

### Gestione Sessioni
- Timeout sessione: 30 minuti
- Cookie HTTP-only per sicurezza
- Invalidazione sessione al logout

### UI/UX
- Design responsive per tutti i dispositivi
- Navbar dinamica basata sullo stato di autenticazione
- Feedback visivo per azioni utente
- Animazioni CSS fluide
- Auto-dismiss per alert dopo 5 secondi

## 🏗️ Build e Deploy

### Build del progetto
```bash
mvn clean package
```

### Esecuzione dei test
```bash
mvn test
```

### Docker Deployment

**Quick Start:**
```bash
cd infra
docker-compose up -d --build
```

**Build manuale:**
```bash
# Dalla root del progetto
docker build -f infra/Dockerfile -t devops-app:1.0 .
docker run -p 8080:8080 devops-app:1.0
```

**Con helper scripts:**
```bash
cd infra
# Windows: .\docker.cmd build && .\docker.cmd run
# Linux/Mac: ./docker.sh build && ./docker.sh run
```

📖 Per dettagli completi: [infra/DOCKER.md](infra/DOCKER.md)

### Kubernetes Deployment

```bash
kubectl apply -f infra/k8s-deployment.yml
kubectl get all -n devops-app
```

📖 Per dettagli completi: [infra/KUBERNETES.md](infra/KUBERNETES.md)

## 📊 Architettura

### Pattern MVC
- **Model**: Dati e logica di business
- **View**: Template Thymeleaf per la presentazione
- **Controller**: Gestione delle richieste HTTP

### Sicurezza
- Spring Security per autenticazione
- BCrypt per hashing password
- Protezione CSRF
- Session management sicuro
- HTTP-only cookies

## 🔧 Configurazione

Le configurazioni principali si trovano in `application.properties`:

```properties
# Server
server.port=8080

# Thymeleaf
spring.thymeleaf.cache=false

# Logging
logging.level.com.corso.devops.corsontt39=DEBUG
```

## 📝 Best Practices Implementate

1. ✅ Separazione delle responsabilità (MVC)
2. ✅ Codice ben commentato e documentato
3. ✅ Gestione sicura delle credenziali
4. ✅ Logging appropriato per debugging
5. ✅ Riutilizzo di componenti (Thymeleaf fragments)
6. ✅ Design responsive
7. ✅ Validazione input lato client e server
8. ✅ Gestione errori
9. ✅ Containerizzazione Docker con best practices
10. ✅ Multi-stage build per immagini ottimizzate
11. ✅ Analisi statica del codice con SonarQube
12. ✅ Code coverage con JaCoCo (target >50%)

## 🚀 Prossimi Passi / TODO

- [ ] Integrazione database (JPA/Hibernate)
- [ ] REST API endpoints
- [ ] Test unitari e integration test
- [x] Containerizzazione con Docker ✅
- [x] Deployment su Kubernetes ✅
- [x] Analisi statica del codice (SonarQube) ✅
- [x] Code coverage (JaCoCo) ✅
- [ ] CI/CD con Jenkins/GitHub Actions
- [ ] Monitoraggio con Actuator
- [ ] Documentazione API con Swagger

## 👥 Autori

Sviluppato per il **Corso NTT DevOps**

## 📄 Licenza

Questo progetto è stato creato per scopi educativi.

## 🆘 Troubleshooting

### Problema: Porta 8080 già in uso
**Soluzione**: Cambiare la porta in `application.properties`:
```properties
server.port=8081
```

### Problema: Errore "Java version mismatch"
**Soluzione**: Verificare di avere Java 21:
```bash
java -version
```

### Problema: Maven build fallisce
**Soluzione**: Pulire e rebuilddare:
```bash
mvn clean install -U
```

## 📚 Risorse Utili

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://spring.io/projects/spring-security)
- [Thymeleaf Documentation](https://www.thymeleaf.org/documentation.html)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)

---

**Made with ❤️ for DevOps Course**
