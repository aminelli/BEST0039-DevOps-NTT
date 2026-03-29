# Import Export


```sh
docker images --filter "reference=devops-app"

# Export
docker save devops-app:1.0 > devops-app-v1-0.tar

# Import
docker image load -i devops-app-v1-0.tar  


```