# Jenkins Pipeline Configuration Guide

## 📋 Prerequisiti Jenkins

### Plugin Richiesti

Installare i seguenti plugin in Jenkins:

```
1. Pipeline (workflow-aggregator)
2. Git (git)
3. Docker Pipeline (docker-workflow)
4. Kubernetes (kubernetes)
5. Kubernetes CLI (kubernetes-cli)
6. SonarQube Scanner (sonar)
7. JaCoCo (jacoco)
8. HTML Publisher (htmlpublisher)
9. JUnit (junit)
10. Credentials Binding (credentials-binding)
```

### Installazione Plugin

```bash
# Via Jenkins CLI
java -jar jenkins-cli.jar -s http://jenkins-url/ install-plugin \
  workflow-aggregator git docker-workflow kubernetes kubernetes-cli \
  sonar jacoco htmlpublisher junit credentials-binding

# Oppure via Jenkins UI:
# Gestisci Jenkins → Plugin Manager → Available → Cerca e installa
```

## 🔑 Configurazione Credenziali

### 1. SonarQube Token

```bash
# In Jenkins: Credentials → System → Global credentials → Add Credentials
Tipo: Secret text
ID: sonarqube-token
Secret: squ_83371c639549bd34dfa1ad2b67fc8768b46c1e55
Descrizione: SonarQube Authentication Token
```

### 2. Docker Hub Credentials

```bash
# In Jenkins: Credentials → System → Global credentials → Add Credentials
Tipo: Username with password
ID: dockerhub-credentials
Username: your-dockerhub-username
Password: your-dockerhub-password
Descrizione: Docker Hub Registry Credentials
```

### 3. Kubernetes Config

```bash
# In Jenkins: Credentials → System → Global credentials → Add Credentials
Tipo: Secret file
ID: kubeconfig-credentials
File: Upload your kubeconfig file
Descrizione: Kubernetes Cluster Config
```

Oppure creare dalla CLI:

```bash
# Creare secret da kubeconfig
kubectl create secret generic jenkins-kubeconfig \
  --from-file=config=$HOME/.kube/config \
  -n jenkins
```

## 🛠️ Configurazione Tool

### Maven Configuration

```bash
# In Jenkins: Gestisci Jenkins → Global Tool Configuration → Maven
Name: Maven
Version: Install automatically → 3.9.6
```

### SonarQube Server Configuration

```bash
# In Jenkins: Gestisci Jenkins → Configure System → SonarQube servers
Name: SonarQube
Server URL: http://10.0.0.43:9000
Server authentication token: Select 'sonarqube-token' credential
```

### Docker Configuration

```bash
# Verificare che Docker sia accessibile da Jenkins
docker --version

# Aggiungere utente jenkins al gruppo docker (se necessario)
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Kubernetes Configuration

```bash
# Verificare accesso al cluster
kubectl cluster-info
kubectl get nodes

# Testare kubeconfig
export KUBECONFIG=/path/to/kubeconfig
kubectl get pods --all-namespaces
```

## 📦 Variabili d'Ambiente

Modificare le seguenti variabili nel `Jenkinsfile` secondo il tuo ambiente:

```groovy
environment {
    // SonarQube
    SONAR_HOST_URL = 'http://10.0.0.43:9000'              // ⚠️ Cambiare
    SONAR_PROJECT_KEY = 'corso-ntt-39'                    // ⚠️ Cambiare
    
    // Docker
    DOCKER_IMAGE_NAME = 'corso-ntt-39'                    // ⚠️ Cambiare
    DOCKER_REGISTRY = 'docker.io'                         // ⚠️ Cambiare se usi altro registry
    DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'       // ⚠️ Verificare ID
    
    // Kubernetes
    K8S_NAMESPACE = 'production'                          // ⚠️ Cambiare
    K8S_DEPLOYMENT_NAME = 'corso-ntt-39'                  // ⚠️ Cambiare
    K8S_CREDENTIALS_ID = 'kubeconfig-credentials'         // ⚠️ Verificare ID
}
```

## 🚀 Setup Progetto Jenkins

### 1. Creare Pipeline Job

```bash
# Jenkins UI:
1. New Item
2. Enter name: "corso-ntt-39-pipeline"
3. Select: "Pipeline"
4. Click "OK"
```

### 2. Configurare Pipeline

```bash
# In Pipeline Configuration:

Pipeline:
  Definition: Pipeline script from SCM
  SCM: Git
  Repository URL: https://github.com/your-org/corso-ntt-39.git
  Credentials: Select your Git credentials
  Branch: */main
  Script Path: Pipelines/Jenkins/Jenkinsfile

Build Triggers:
  ☑ Poll SCM: H/5 * * * *  (ogni 5 minuti)
  ☑ GitHub hook trigger for GITScm polling
```

### 3. Configurare Webhook GitHub (Opzionale)

```bash
# In GitHub Repository Settings → Webhooks:
Payload URL: http://jenkins-url/github-webhook/
Content type: application/json
Events: Just the push event
```

## 🐳 Setup Docker Registry

### Docker Hub (Default)

```bash
# Login manuale per test
docker login docker.io
Username: your-username
Password: your-password

# Verificare accesso
docker pull hello-world
```

### Alternative Registry (Harbor, ECR, ACR, GCR)

Modificare nel `Jenkinsfile`:

```groovy
// Per Harbor
DOCKER_REGISTRY = 'harbor.example.com'

// Per AWS ECR
DOCKER_REGISTRY = '123456789012.dkr.ecr.us-east-1.amazonaws.com'

// Per Azure ACR
DOCKER_REGISTRY = 'myregistry.azurecr.io'

// Per Google GCR
DOCKER_REGISTRY = 'gcr.io/my-project'
```

## ☸️ Setup Kubernetes

### 1. Creare Namespace

```bash
kubectl create namespace production
kubectl label namespace production environment=production
```

### 2. Applicare Configurazioni

```bash
# Applicare configurazioni base
kubectl apply -f Pipelines/Jenkins/kubernetes-config.yaml

# Applicare manifests applicazione
kubectl apply -f Pipelines/Jenkins/kubernetes-manifests.yaml
```

### 3. Verificare Deploy

```bash
# Verificare risorse create
kubectl get all -n production
kubectl get configmap -n production
kubectl get secret -n production
kubectl get ingress -n production
```

### 4. Configurare Ingress (Opzionale)

```bash
# Installare NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Modificare hostname in kubernetes-manifests.yaml
# Cambiare: corso-ntt-39.example.com → your-domain.com
```

## 🔍 Verifica Certificati SSL (Opzionale)

```bash
# Installare cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Creare ClusterIssuer per Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## 🧪 Test della Pipeline

### Test Manuale Stages

#### 1. Test Maven Build

```bash
mvn clean package -DskipTests
ls -lh target/*.jar
```

#### 2. Test SonarQube

```bash
mvn sonar:sonar \
  -Dsonar.projectKey=corso-ntt-39 \
  -Dsonar.host.url=http://10.0.0.43:9000 \
  -Dsonar.token=squ_83371c639549bd34dfa1ad2b67fc8768b46c1e55
```

#### 3. Test Unit Tests

```bash
mvn test
```

#### 4. Test Cypress E2E

```bash
# Avviare applicazione
mvn spring-boot:run &

# Eseguire test Cypress
cd Testing/cypress-e2e
npm install
npm test
```

#### 5. Test Docker Build

```bash
docker build -t corso-ntt-39:test -f infra/Dockerfile .
docker images | grep corso-ntt-39
```

#### 6. Test Docker Push

```bash
docker tag corso-ntt-39:test your-username/corso-ntt-39:test
docker push your-username/corso-ntt-39:test
```

#### 7. Test Kubernetes Deploy

```bash
kubectl apply -f Pipelines/Jenkins/kubernetes-manifests.yaml
kubectl get pods -n production
kubectl logs -f deployment/corso-ntt-39 -n production
```

## ▶️ Esecuzione Pipeline

### Trigger Manuale

```bash
# In Jenkins UI:
1. Aprire job "corso-ntt-39-pipeline"
2. Click "Build Now"
3. Monitorare "Console Output"
```

### Trigger Automatico

```bash
# La pipeline si attiverà automaticamente su:
- Push a Git repository (se webhook configurato)
- Poll SCM (ogni 5 minuti se configurato)
- Manualmente tramite "Build Now"
```

## 📊 Monitoraggio Pipeline

### View Build Status

```bash
# In Jenkins UI:
- Dashboard → corso-ntt-39-pipeline
- Vedere "Build History"
- Cliccare su build number per dettagli
```

### View Stage Results

```bash
# Per ogni build:
- Test Results: JUnit test report
- Code Coverage: JaCoCo report
- SonarQube Analysis: Link to SonarQube dashboard
- E2E Test Report: Cypress HTML report
```

### View Kubernetes Status

```bash
# Verificare deploy su Kubernetes
kubectl get all -n production
kubectl describe deployment corso-ntt-39 -n production
kubectl logs -f deployment/corso-ntt-39 -n production
```

### Access Application

```bash
# Via NodePort (per test)
http://<node-ip>:30080

# Via Ingress (produzione)
https://corso-ntt-39.example.com

# Via kubectl port-forward (debug)
kubectl port-forward svc/corso-ntt-39-service 8080:80 -n production
http://localhost:8080
```

## 🐛 Troubleshooting

### Pipeline Fails - Stage "Analisi Statica"

```bash
# Verificare connessione SonarQube
curl http://10.0.0.43:9000/api/system/status

# Verificare token
curl -u squ_83371c639549bd34dfa1ad2b67fc8768b46c1e55: \
     http://10.0.0.43:9000/api/authentication/validate
```

### Pipeline Fails - Stage "Test E2E"

```bash
# Verificare che l'app sia raggiungibile
curl http://localhost:8080

# Verificare Node.js installato
node --version
npm --version

# Debug Cypress
cd Testing/cypress-e2e
npm run cy:open  # Eseguire in modalità interattiva
```

### Pipeline Fails - Stage "Build Docker Image"

```bash
# Verificare Docker daemon
docker info

# Verificare permessi
groups jenkins  # Deve contenere "docker"

# Test build manuale
docker build -t test-image -f infra/Dockerfile .
```

### Pipeline Fails - Stage "Push Docker Registry"

```bash
# Verificare credenziali
docker login docker.io

# Verificare network
curl https://registry-1.docker.io/v2/

# Verificare tag
docker images | grep corso-ntt-39
```

### Pipeline Fails - Stage "Deploy Kubernetes"

```bash
# Verificare kubeconfig
kubectl cluster-info
kubectl get nodes

# Verificare namespace
kubectl get namespace production

# Verificare RBAC permissions
kubectl auth can-i create deployments -n production
```

### General Debugging

```bash
# Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Pipeline replay
# In Jenkins UI: Build → Replay → Edit script → Run

# Increase verbosity in Jenkinsfile
sh 'set -x; your-command'  # Debug mode
```

## 🔒 Security Best Practices

### 1. Secret Management

```bash
# Non committare secrets nel Git
# Usare Jenkins Credentials Store
# Usare Kubernetes Secrets
# Rotare regolarmente le password
```

### 2. Docker Image Security

```bash
# Scansione vulnerabilità
docker scan corso-ntt-39:latest

# Usare immagini base ufficiali
# FROM eclipse-temurin:21-jre-alpine

# Non eseguire come root
USER spring:spring
```

### 3. Kubernetes Security

```bash
# Network Policies
kubectl apply -f kubernetes-config.yaml

# Pod Security Policies
# RBAC appropriati
# Resource limits
```

## 📈 Metriche e Monitoring

### Jenkins Pipeline Metrics

```bash
# In Jenkins:
- Build Duration Trends
- Test Results Trend
- Code Coverage Trend
- SonarQube Quality Gates
```

### Kubernetes Metrics

```bash
# Installare metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Visualizzare metriche
kubectl top nodes
kubectl top pods -n production
```

### Application Monitoring

```bash
# Accesso Actuator endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics
curl http://localhost:8080/actuator/prometheus
```

## 📚 Risorse Aggiuntive

- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Cypress Documentation](https://docs.cypress.io/)

---

**Versione**: 1.0.0  
**Ultima modifica**: 27 Marzo 2026
