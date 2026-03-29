# 🔍 SonarQube Integration Guide

## Panoramica

SonarQube è integrato nel progetto per l'analisi statica del codice, rilevamento di bug, vulnerabilità e code smells. Include anche l'integrazione con JaCoCo per il code coverage.

## 📋 Prerequisiti

### Opzione 1: SonarQube Locale (Docker)

```bash
# Avvia SonarQube con Docker
docker run -d --name sonarqube \
  -p 9000:9000 \
  sonarqube:latest

# Accedi a http://localhost:9000
# Credenziali default: admin/admin
```

### Opzione 2: SonarQube con Docker Compose

Aggiungi al file `infra/docker-compose.yml`:

```yaml
sonarqube:
  image: sonarqube:10-community
  container_name: sonarqube
  ports:
    - "9000:9000"
  environment:
    - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
  volumes:
    - sonarqube_data:/opt/sonarqube/data
    - sonarqube_extensions:/opt/sonarqube/extensions
    - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
```

### Opzione 3: SonarCloud (Cloud-based)

Registrati su [SonarCloud](https://sonarcloud.io) e ottieni il token.

## ⚙️ Configurazione

### 1. Configurazione Locale (SonarQube Server)

Nel `pom.xml` le proprietà sono già configurate per un server locale:

```xml
<sonar.host.url>http://localhost:9000</sonar.host.url>
<sonar.projectKey>corso-ntt-39</sonar.projectKey>
```

### 2. Configurazione SonarCloud

Se usi SonarCloud, modifica le properties nel `pom.xml`:

```xml
<sonar.host.url>https://sonarcloud.io</sonar.host.url>
<sonar.organization>your-org-key</sonar.organization>
<sonar.projectKey>your-username_corso-ntt-39</sonar.projectKey>
```

### 3. Token di Autenticazione

Genera un token da SonarQube/SonarCloud:

1. Accedi a SonarQube (http://localhost:9000)
2. User → My Account → Security → Generate Token
3. Salva il token in modo sicuro

## 🚀 Esecuzione Analisi

### Metodo 1: Analisi Completa con Coverage

```bash
# Build, test e genera report coverage
mvn clean verify

# Esegui analisi SonarQube
mvn sonar:sonar -Dsonar.token=YOUR_TOKEN_HERE
```

### Metodo 2: Analisi Diretta (senza coverage)

```bash
mvn clean install
mvn sonar:sonar -Dsonar.token=YOUR_TOKEN_HERE
```

### Metodo 3: Un Comando (Build + Coverage + Analisi)

```bash
mvn clean verify sonar:sonar \
  -Dsonar.token=YOUR_TOKEN_HERE
```

### Metodo 4: Con Parametri Personalizzati

```bash
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN_HERE \
  -Dsonar.projectKey=corso-ntt-39 \
  -Dsonar.projectName="DevOps Spring Boot App" \
  -Dsonar.projectVersion=1.0
```

## 🔐 Gestione Token

### Variabile d'Ambiente (Raccomandato)

```bash
# Linux/Mac
export SONAR_TOKEN=your_token_here
mvn clean verify sonar:sonar

# Windows CMD
set SONAR_TOKEN=your_token_here
mvn clean verify sonar:sonar

# Windows PowerShell
$env:SONAR_TOKEN="your_token_here"
mvn clean verify sonar:sonar
```

### File settings.xml di Maven

Aggiungi in `~/.m2/settings.xml`:

```xml
<settings>
  <profiles>
    <profile>
      <id>sonar</id>
      <properties>
        <sonar.host.url>http://localhost:9000</sonar.host.url>
        <sonar.token>YOUR_TOKEN_HERE</sonar.token>
      </properties>
    </profile>
  </profiles>
</settings>
```

Usa il profilo:

```bash
mvn clean verify sonar:sonar -Psonar
```

## 📊 JaCoCo Code Coverage

### Generazione Report

```bash
# Genera report coverage
mvn clean test

# Report disponibile in:
# target/site/jacoco/index.html
```

### Visualizza Report Locale

```bash
# Windows
start target/site/jacoco/index.html

# Linux
xdg-open target/site/jacoco/index.html

# Mac
open target/site/jacoco/index.html
```

### Soglie di Coverage

Configurate in `pom.xml` (attualmente 50%):

```xml
<limit>
  <counter>LINE</counter>
  <value>COVEREDRATIO</value>
  <minimum>0.50</minimum> <!-- 50% coverage minimo -->
</limit>
```

Per modificare, cambia il valore `<minimum>`.

## 📈 Metriche Analizzate

SonarQube analizza:

- **🐛 Bugs**: Errori nel codice
- **🔐 Vulnerabilities**: Problemi di sicurezza
- **💩 Code Smells**: Problemi di manutenibilità
- **🔄 Duplicazioni**: Codice duplicato
- **📏 Coverage**: Copertura dei test
- **📐 Complessità**: Complessità ciclomatica
- **📝 Documentazione**: Commenti e documentazione

## 🎯 Quality Gates

### Quality Gate Default

SonarQube applica automaticamente un Quality Gate che verifica:

- Coverage > 80%
- Duplicazione < 3%
- Vulnerabilità = 0
- Bug = 0
- Security Hotspots reviewed = 100%

### Personalizzare Quality Gate

1. Accedi a SonarQube
2. Quality Gates → Create
3. Configura le condizioni
4. Associa al progetto

## 🔧 Configurazione Avanzata

### Escludere File dall'Analisi

Nel `pom.xml`, aggiungi:

```xml
<properties>
  <sonar.exclusions>
    **/generated/**,
    **/dto/**,
    **/entity/**
  </sonar.exclusions>
  <sonar.test.exclusions>
    **/test/**
  </sonar.test.exclusions>
</properties>
```

### Configurazione Coverage Selettiva

```xml
<properties>
  <sonar.coverage.exclusions>
    **/config/**,
    **/Application.java
  </sonar.coverage.exclusions>
</properties>
```

### Analisi Branch/Pull Request

```bash
# Analisi su branch specifico
mvn sonar:sonar \
  -Dsonar.token=$SONAR_TOKEN \
  -Dsonar.branch.name=feature/new-feature

# Analisi Pull Request
mvn sonar:sonar \
  -Dsonar.token=$SONAR_TOKEN \
  -Dsonar.pullrequest.key=123 \
  -Dsonar.pullrequest.branch=feature/new-feature \
  -Dsonar.pullrequest.base=main
```

## 🐳 SonarQube con Docker

### Quick Start Completo

```bash
# 1. Avvia SonarQube
cd infra
docker-compose up -d sonarqube

# 2. Attendi che sia pronto (circa 1-2 minuti)
docker logs -f sonarqube

# 3. Accedi e genera token
# http://localhost:9000 (admin/admin)

# 4. Esegui analisi
cd ..
export SONAR_TOKEN=your_token
mvn clean verify sonar:sonar
```

## 📋 Makefile Integration

Aggiungi al `infra/Makefile`:

```makefile
.PHONY: sonar
sonar: ## Run SonarQube analysis
	@echo "$(BLUE)Running SonarQube analysis...$(NC)"
	cd .. && ./mvnw clean verify sonar:sonar

.PHONY: sonar-local
sonar-local: ## Run SonarQube analysis (local server)
	@echo "$(BLUE)Running SonarQube analysis on local server...$(NC)"
	cd .. && ./mvnw clean verify sonar:sonar \
		-Dsonar.host.url=http://localhost:9000

.PHONY: coverage
coverage: ## Generate coverage report
	@echo "$(BLUE)Generating coverage report...$(NC)"
	cd .. && ./mvnw clean test
	@echo "$(GREEN)Coverage report: target/site/jacoco/index.html$(NC)"
```

Uso:
```bash
cd infra
make coverage    # Solo coverage report
make sonar      # Analisi completa
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Cache Maven packages
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
      
      - name: Build and analyze
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        run: |
          mvn clean verify sonar:sonar \
            -Dsonar.host.url=https://sonarcloud.io
```

### GitLab CI

```yaml
sonarqube-check:
  stage: test
  image: maven:3.9-eclipse-temurin-21
  script:
    - mvn clean verify sonar:sonar
      -Dsonar.token=$SONAR_TOKEN
      -Dsonar.host.url=$SONAR_HOST_URL
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  only:
    - main
    - develop
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build & Test') {
            steps {
                sh 'mvn clean verify'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

## 🆘 Troubleshooting

### Problema: "Insufficient privileges"

**Soluzione**: Verifica che il token abbia i permessi corretti:
- Analyze Projects
- Browse Projects

### Problema: "Coverage report not found"

**Soluzione**: Assicurati di eseguire i test prima dell'analisi:
```bash
mvn clean test sonar:sonar
```

### Problema: SonarQube non si avvia (Docker)

**Soluzione**: Aumenta la memoria:
```bash
# Linux/Mac
sysctl -w vm.max_map_count=262144

# Docker Desktop: Settings → Resources → Memory (min 2GB)
```

### Problema: Token non funziona

**Soluzione**: Verifica che il token sia valido:
```bash
curl -u YOUR_TOKEN: http://localhost:9000/api/authentication/validate
```

## 📚 Risorse Utili

- [SonarQube Documentation](https://docs.sonarqube.org/latest/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [JaCoCo Documentation](https://www.jacoco.org/jacoco/trunk/doc/)
- [Maven Sonar Plugin](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-maven/)

## 🎯 Best Practices

1. ✅ Esegui analisi prima di ogni merge
2. ✅ Mantieni coverage > 80%
3. ✅ System zero bugs e vulnerabilità critiche
4. ✅ Revisiona tutti i security hotspots
5. ✅ Riduci code smells progressivamente
6. ✅ Documenta le esclusioni dall'analisi
7. ✅ Usa Quality Gates nel CI/CD
8. ✅ Monitora le metriche nel tempo

---

**Ready for Code Quality! 🎯**
