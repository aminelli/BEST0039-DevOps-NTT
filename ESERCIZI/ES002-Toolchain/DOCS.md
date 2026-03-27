# DOCS

## Dashboards

| Dashboard | URL                              |
| --------- | -------------------------------- |
| Gitlab    | https://gitlab.corso.local:5443/ |
| Jenkins   | http://localhost:8081/           |
| Sonar     |                                  |



## Approccio Imperativo

```sh

docker pull gitlab/gitlab-ce:nightly
docker pull jenkins/jenkins:lts
docker pull jenkins/ssh-agent
docker pull sonarqube:latest

```


## Approccio Dichiarativo


```sh

# Avviare tutti i container previsti
docker compose -p corso-devops up -d

# Solo GitLab
docker compose -p corso-devops up -d gitlab

# Solo Jenkins
docker compose -p corso-devops up -d jenkins

# Solo Jenkins ssh agent
docker compose -p corso-devops up -d jenkins-ssh-agent

# Solo Jenkins ssh agent 2 (se previsto nel compose)
docker compose -p corso-devops up -d jenkins-ssh-agent2

# Solo SonarQube
docker compose -p corso-devops up -d sonar

```

---

## GITLAB Docs

Endpoints Utili:
- https://docs.gitlab.com/install/docker/installation/
- https://hub.docker.com/r/gitlab/gitlab-ce

Per recuperare la password di gitlab:

```sh
docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

Credenziali:
root
s9dYtvweJ3RFTWYLcmVVsFligGYar++4Br6nuA4rGJo=

Dashboard:
https://gitlab.corso.local:5443/

---

## Jenkins

Endpoints Utili:
- https://www.jenkins.io/doc/book/installing/docker/
- https://github.com/jenkinsci/docker
- https://hub.docker.com/r/jenkins/jenkins
- https://plugins.jenkins.io/


Per recuperare la password di Jenkins:

```sh
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Post installazione
apt-get update && apt-get install -y curl wget net-tools iputils-ping


# Risoluzione problemi:
# Certificato GitLab
openssl s_client -connect 10.0.0.43:5443 -showcerts < /dev/null | sed -n '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' > /usr/local/share/ca-certificates/gitlab.crt
update-ca-certificates
```

Credenziali:
admin
4c4ce5269c9b4a05a4efc5d5ab44e6ce

corso
corso


Plugins Jenkins da installare:

- https://plugins.jenkins.io/blueocean/
- https://plugins.jenkins.io/docker-plugin/
- https://plugins.jenkins.io/json-path-api/
- https://plugins.jenkins.io/docker-workflow/
- https://plugins.jenkins.io/docker-commons/





## SonarQube

Prerequisiti: 

```sh
# LINUX: lanciare i seguenti comandi
sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
# WINDOWS: Docker Desktop
wsl -d docker-desktop
sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
```

Credenziali:
admin
admin

admin
Corso2026DevOps!

Token x Integrazioni:
squ_83371c639549bd34dfa1ad2b67fc8768b46c1e55