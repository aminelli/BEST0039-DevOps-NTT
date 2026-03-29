crea una folder "Pipelines" nella quale creare una folder "Jenkins".
nella folder "Jenkins" genera una pipeline per Jenkins.

la pipeline deve prevedere nell'ordine:

- Download Sorgenti
- Analisi statica con sonarqube (usa Maven)
- Unit Test
- Generazione Jar
- Test e2e con cypress
- Creare immagine docker
- Upload immagine docker su Container Registry (es. docker hub)
- Rilascio in Kubernetes

