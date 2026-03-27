# DNS server contenierizzato

E' una pratica molto comune, soprattutto in ambienti Docker/Kubernetes 👍

Ti spiego in modo pratico **come farlo** e quali sono le opzioni migliori.

---

## 🧠 Perché mettere un DNS in un container?

Serve per:

* risolvere nomi custom (es. `app.local`)
* fare caching DNS (più performance)
* isolare ambienti (dev/test)
* gestire reti interne Docker o microservizi

---

## 🔧 Opzione 1: usare **BIND**

### 📦 Esempio Dockerfile

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y bind9 bind9utils bind9-doc

COPY named.conf /etc/bind/
COPY db.local /etc/bind/

EXPOSE 53/tcp
EXPOSE 53/udp

CMD ["named", "-g", "-c", "/etc/bind/named.conf"]
```

### ▶️ Avvio container

```bash
docker build -t my-dns .
docker run -d -p 53:53/udp -p 53:53/tcp my-dns
```

---

## ⚡ Opzione 2: usare **dnsmasq** (più semplice)

Perfetto per sviluppo e test.

### 🚀 Run veloce senza Dockerfile

```bash
docker run -d \
  --name dnsmasq \
  -p 53:53/udp \
  -p 53:53/tcp \
  --cap-add=NET_ADMIN \
  andyshinn/dnsmasq
```

### Config custom

Puoi montare un file:

```bash
-v $(pwd)/dnsmasq.conf:/etc/dnsmasq.conf
```

Esempio:

```
address=/myapp.local/192.168.1.100
```

---

## 🧱 Opzione 3: usare **CoreDNS** (top per Kubernetes)

Molto moderno e modulare.

### ▶️ Run base

```bash
docker run -d -p 53:53/udp -p 53:53/tcp coredns/coredns -conf /Corefile
```

### Esempio Corefile

```
. {
    forward . 8.8.8.8
    log
}
```

---

## 🐳 DNS dentro Docker (importantissimo)

Docker ha già un DNS interno:

* ogni container può risolvere altri container per nome
* es: `http://my-service`

👉 Ma se vuoi:

* domini custom (`.local`)
* risoluzione esterna controllata
* caching

allora ha senso il tuo DNS container.

---

## ⚠️ Attenzioni importanti

* Porta **53** → già usata dal sistema (Linux spesso ha systemd-resolved)
* Serve spesso:

  ```bash
  sudo systemctl stop systemd-resolved
  ```
* Usa `--dns` nei container client:

  ```bash
  docker run --dns=172.17.0.2 ...
  ```
* In produzione → attenzione a:

  * sicurezza
  * recursion abuse
  * rate limiting

---

## 💡 Consiglio pratico

* 🔹 Dev/test → **dnsmasq**
* 🔹 Setup serio → **BIND**
* 🔹 Cloud / Kubernetes → **CoreDNS**

---

Se vuoi, posso prepararti:

* 🔥 un **docker-compose completo** con DNS + app
* 🔥 integrazione con PostgreSQL / Kafka (visto che ci lavori)
* 🔥 oppure simulazione enterprise con più zone DNS

Dimmi il tuo scenario 👍
