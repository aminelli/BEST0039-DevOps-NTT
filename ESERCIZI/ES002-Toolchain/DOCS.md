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
```

Credenziali:
admin
9e7c12045fa94bc2bacef6e8af89604e

corso
corso


Plugins Jenkins da installare:

- https://plugins.jenkins.io/blueocean/
- https://plugins.jenkins.io/docker-plugin/
- https://plugins.jenkins.io/json-path-api/
- https://plugins.jenkins.io/docker-workflow/
- https://plugins.jenkins.io/docker-commons/

---

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