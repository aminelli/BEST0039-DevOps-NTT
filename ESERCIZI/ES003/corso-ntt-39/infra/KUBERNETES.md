# 🚢 Kubernetes Deployment Guide

## Overview

Questo file fornisce le configurazioni Kubernetes per il deployment dell'applicazione DevOps Spring Boot in un cluster Kubernetes.

## 📋 Prerequisiti

- Kubernetes cluster (1.24+)
- kubectl configurato
- NGINX Ingress Controller (opzionale)
- cert-manager per SSL (opzionale)
- Metrics Server per HPA

## 🏗️ Componenti Kubernetes

### Risorse Incluse

1. **Namespace** - Isolamento delle risorse
2. **ConfigMap** - Configurazione applicazione
3. **Deployment** - Gestione pod e replica
4. **Service** - Esposizione dell'applicazione
5. **Ingress** - Routing HTTP esterno
6. **HorizontalPodAutoscaler** - Auto-scaling basato su metriche
7. **PodDisruptionBudget** - Disponibilità durante manutenzione
8. **NetworkPolicy** - Sicurezza di rete

## 🚀 Quick Start

### 1. Deploy Basic

```bash
# Dalla root del progetto
# Apply delle configurazioni
kubectl apply -f infra/k8s-deployment.yml

# Verifica lo stato
kubectl get all -n devops-app

# Controlla i pod
kubectl get pods -n devops-app -w
```

### 2. Port Forward (per test locali)

```bash
# Forward porta locale al servizio
kubectl port-forward service/devops-app-service 8080:80 -n devops-app

# Accedi a http://localhost:8080
```

### 3. Accesso tramite Ingress

Modifica `infra/k8s-deployment.yml` e sostituisci `devops-app.example.com` con il tuo dominio.

```bash
# Verifica ingress
kubectl get ingress -n devops-app

# Descrivi ingress per ottenere IP
kubectl describe ingress devops-app-ingress -n devops-app
```

## 📊 Monitoring e Gestione

### Visualizza Logs

```bash
# Logs di tutti i pod
kubectl logs -f deployment/devops-app-deployment -n devops-app

# Logs di un pod specifico
kubectl logs -f <pod-name> -n devops-app

# Logs precedenti (se crashato)
kubectl logs --previous <pod-name> -n devops-app
```

### Stato Deployment

```bash
# Rollout status
kubectl rollout status deployment/devops-app-deployment -n devops-app

# History
kubectl rollout history deployment/devops-app-deployment -n devops-app

# Rollback
kubectl rollout undo deployment/devops-app-deployment -n devops-app
```

### Auto-Scaling

```bash
# Verifica HPA
kubectl get hpa -n devops-app

# Dettagli HPA
kubectl describe hpa devops-app-hpa -n devops-app

# Metrics
kubectl top pods -n devops-app
kubectl top nodes
```

### Scaling Manuale

```bash
# Scale up
kubectl scale deployment/devops-app-deployment --replicas=5 -n devops-app

# Scale down
kubectl scale deployment/devops-app-deployment --replicas=2 -n devops-app

# Auto-scale
kubectl autoscale deployment/devops-app-deployment \
  --min=2 --max=10 --cpu-percent=70 -n devops-app
```

## 🔧 Configurazione

### Aggiornamento ConfigMap

```bash
# Modifica ConfigMap
kubectl edit configmap devops-app-config -n devops-app

# Riavvia deployment per applicare modifiche
kubectl rollout restart deployment/devops-app-deployment -n devops-app
```

### Aggiornamento Immagine

```bash
# Set nuova immagine
kubectl set image deployment/devops-app-deployment \
  devops-app=devops-app:v2.0 -n devops-app

# Verifica rollout
kubectl rollout status deployment/devops-app-deployment -n devops-app
```

### Resource Limits

Modifica in `k8s-deployment.yml`:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "2000m"
```

## 🔒 Sicurezza Best Practices

### 1. Network Policies

Le Network Policies sono già configurate per:
- Consentire traffico solo da NGINX Ingress
- Consentire DNS (porta 53)
- Consentire HTTPS esterno (porta 443)

### 2. Security Context

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  allowPrivilegeEscalation: false
  capabilities:
    drop:
    - ALL
```

### 3. RBAC

Crea Service Account e Role Binding se necessario:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: devops-app-sa
  namespace: devops-app
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: devops-app-role
  namespace: devops-app
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
```

## 🌐 Ingress Setup

### NGINX Ingress Controller

```bash
# Install NGINX Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

# Verifica installazione
kubectl get pods -n ingress-nginx
```

### SSL/TLS con cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Crea ClusterIssuer per Let's Encrypt
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

## 📈 Monitoring

### Prometheus & Grafana

```bash
# Install Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# ServiceMonitor per l'app
kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: devops-app-monitor
  namespace: devops-app
spec:
  selector:
    matchLabels:
      app: devops-spring
  endpoints:
  - port: http
    path: /actuator/prometheus
EOF
```

## 🐛 Troubleshooting

### Pod non parte

```bash
# Descrivi pod
kubectl describe pod <pod-name> -n devops-app

# Eventi
kubectl get events -n devops-app --sort-by='.lastTimestamp'

# Logs
kubectl logs <pod-name> -n devops-app
```

### Connettività

```bash
# Test DNS
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup devops-app-service.devops-app.svc.cluster.local

# Test connettività
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl http://devops-app-service.devops-app.svc.cluster.local
```

### Performance Issues

```bash
# Resource usage
kubectl top pods -n devops-app
kubectl top nodes

# Verifica limiti
kubectl describe deployment devops-app-deployment -n devops-app
```

## 🔄 CI/CD Integration

### GitLab CI Example

```yaml
deploy-k8s:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context $KUBE_CONTEXT
    - kubectl apply -f k8s-deployment.yml
    - kubectl rollout status deployment/devops-app-deployment -n devops-app
  only:
    - main
```

### GitHub Actions Example

```yaml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up kubectl
      uses: azure/setup-kubectl@v3
    - name: Deploy
      run: |
        kubectl apply -f k8s-deployment.yml
        kubectl rollout status deployment/devops-app-deployment -n devops-app
```

## 🧹 Cleanup

```bash
# Rimuovi tutto
kubectl delete namespace devops-app

# Solo deployment
kubectl delete deployment devops-app-deployment -n devops-app

# Solo ingress
kubectl delete ingress devops-app-ingress -n devops-app
```

## 📚 Risorse Utili

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager](https://cert-manager.io/)
- [Prometheus Operator](https://prometheus-operator.dev/)

---

**Ready for Kubernetes! 🎉**
