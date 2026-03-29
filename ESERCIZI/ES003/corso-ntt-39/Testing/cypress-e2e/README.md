# 🧪 Cypress E2E Tests - Corso NTT 39

Suite completa di test End-to-End automatizzati con Cypress per l'applicazione Spring Boot.

## 📋 Indice

- [Panoramica](#panoramica)
- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Esecuzione dei Test](#esecuzione-dei-test)
- [Struttura dei Test](#struttura-dei-test)
- [Test Coverage](#test-coverage)
- [Custom Commands](#custom-commands)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Panoramica

Questa suite di test E2E verifica il comportamento completo dell'applicazione web dal punto di vista dell'utente finale, includendo:

- ✅ **91 test end-to-end** automatizzati
- 🏠 Test delle pagine pubbliche (Home, About)
- 🔐 Test di autenticazione (Login, Logout)
- 🔒 Test dell'area privata e controllo accessi
- 🧭 Test di navigazione completa
- 👥 Test multi-utente (USER, ADMIN, DEMO)
- 📱 Test responsive (Mobile, Tablet, Desktop)
- 🛡️ Test di sicurezza (XSS, SQL Injection)

## 📦 Prerequisiti

Prima di eseguire i test, assicurarsi di avere:

- **Node.js** 18+ e npm 9+
- **Java 21** (per l'applicazione Spring Boot)
- **Maven 3.9+** (per compilare l'applicazione)
- L'applicazione Spring Boot **deve essere in esecuzione** su `http://localhost:8080`

## 🚀 Installazione

### 1. Installare le dipendenze

```bash
cd Testing/cypress-e2e
npm install
```

Questo installerà:
- Cypress 13.6.0
- Mochawesome (reporter HTML)
- Tutte le dipendenze necessarie

### 2. Avviare l'applicazione Spring Boot

Prima di eseguire i test, avviare l'applicazione:

```bash
# Dalla root del progetto
cd ../..
mvn spring-boot:run
```

Verificare che l'applicazione sia disponibile su `http://localhost:8080`

## ⚙️ Configurazione

### URL Base

L'URL base è configurato in `cypress.config.js`:

```javascript
baseUrl: 'http://localhost:8080'
```

Per cambiare l'URL (es. ambiente di test):

```bash
CYPRESS_BASE_URL=http://test.example.com npm run cy:run
```

### Utenti di Test

Gli utenti sono configurati in `cypress.config.js` sotto `env.users`:

| Username | Password | Ruoli |
|----------|----------|-------|
| user | password | USER |
| admin | admin | USER, ADMIN |
| demo | demo | USER |

## 🎮 Esecuzione dei Test

### Modalità Interattiva (Cypress UI)

Apre l'interfaccia grafica di Cypress per eseguire e debuggare i test:

```bash
npm run cy:open
```

### Modalità Headless (CI/CD)

Esegue tutti i test in modalità headless:

```bash
npm test
# oppure
npm run cy:run
```

### Test su Browser Specifici

```bash
# Chrome
npm run cy:run:chrome

# Firefox
npm run cy:run:firefox

# Edge
npm run cy:run:edge
```

### Test in Modalità Visibile

Esegue i test mostrando il browser:

```bash
npm run cy:run:headed
```

### Test Specifici

```bash
# Eseguire un singolo file di test
npx cypress run --spec "cypress/e2e/auth.cy.js"

# Eseguire test con pattern
npx cypress run --spec "cypress/e2e/**/auth*.cy.js"

# Eseguire test specifici per nome
npx cypress run --spec "cypress/e2e/home.cy.js" --grep "should load the home page"
```

### Generare Report HTML

```bash
npm run test:report
```

Report disponibile in: `cypress/reports/index.html`

## 📁 Struttura dei Test

```
Testing/cypress-e2e/
├── cypress/
│   ├── e2e/                           # Test files
│   │   ├── home.cy.js                # 22 test - Pagine pubbliche
│   │   ├── auth.cy.js                # 29 test - Autenticazione
│   │   ├── private-area.cy.js        # 23 test - Area privata
│   │   └── navigation.cy.js          # 17 test - Flussi completi
│   ├── fixtures/                      # Test data
│   │   └── users.json                # Dati utenti validi/invalidi
│   ├── support/                       # Helper files
│   │   ├── commands.js               # Custom Cypress commands
│   │   └── e2e.js                    # Global configuration
│   ├── screenshots/                   # Screenshot su failure (auto)
│   ├── videos/                        # Video recordings (auto)
│   └── reports/                       # Test reports (auto)
├── cypress.config.js                  # Configurazione Cypress
├── package.json                       # Dipendenze e scripts
├── README.md                          # Questa documentazione
└── .gitignore                        # File da ignorare
```

## 📊 Test Coverage

### Riepilogo Test Suite

| Suite | Test | Descrizione |
|-------|------|-------------|
| **home.cy.js** | 22 | Test delle pagine pubbliche (Home, About) |
| **auth.cy.js** | 29 | Test di autenticazione e sicurezza |
| **private-area.cy.js** | 23 | Test area privata e controllo accessi |
| **navigation.cy.js** | 17 | Test di navigazione e flussi completi |
| **TOTALE** | **91** | ✅ **Coverage completo E2E** |

### Dettaglio Copertura

#### 🏠 home.cy.js - Pagine Pubbliche (22 test)

- **Public Home Page** (5 test)
  - Caricamento home page (/, /home)
  - Visualizzazione messaggio di benvenuto
  - Link di navigazione funzionanti
  - Navigazione tra pagine pubbliche

- **About Page** (3 test)
  - Caricamento pagina about
  - Contenuto visibile
  - Accesso senza autenticazione

- **Page Elements** (3 test)
  - Title, navigation bar, login link

- **Responsive Design** (3 test)
  - Mobile (375x812), Tablet (768x1024), Desktop (1280x720)

- **Performance** (1 test)
  - Tempo di caricamento < 3s

- **Cross-Page Navigation** (1 test)
  - Navigazione completa tra pagine pubbliche

#### 🔐 auth.cy.js - Autenticazione (29 test)

- **Login Page Display** (5 test)
  - Form di login visibile
  - Campi username/password presenti
  - Gestione parametri error/logout

- **Successful Login** (4 test)
  - Login con credenziali USER/ADMIN/DEMO
  - Redirect alla pagina originariamente richiesta

- **Failed Login Attempts** (5 test)
  - Username invalido
  - Password errata
  - Credenziali vuote
  - Protezione SQL injection
  - Protezione XSS

- **Logout Functionality** (3 test)
  - Logout con redirect
  - Cancellazione sessione
  - Messaggio di conferma logout

- **Session Management** (3 test)
  - Persistenza sessione durante navigazione
  - Blocco accesso area privata senza auth
  - Gestione sessioni multiple utenti

- **Login Form Validation** (3 test)
  - Attributi required
  - Password field type
  - Submit button abilitato

- **Login Security** (2 test)
  - Nessuna password in URL
  - Form POST sicuro

#### 🔒 private-area.cy.js - Area Privata (23 test)

- **Access Control** (3 test)
  - Redirect utenti non autenticati
  - Accesso utenti autenticati
  - Persistenza dopo refresh

- **Standard User (USER role)** (5 test)
  - Visualizzazione info utente
  - Welcome message con username
  - Badge ruolo USER
  - Contenuto area privata

- **Admin User (ADMIN role)** (4 test)
  - Info admin visibili
  - Badge USER e ADMIN
  - Welcome message admin

- **Demo User** (2 test)
  - Info demo user
  - Accesso come utente standard

- **Multiple Users Access** (2 test)
  - Switch tra utenti
  - Info corrette per ogni utente

- **Private Area Content** (4 test)
  - Title, navigation, logout option
  - Info sessione utente

- **Security Checks** (2 test)
  - Blocco dopo sessione scaduta
  - Nessun dato sensibile esposto

- **Responsive View** (3 test)
  - Mobile, Tablet, Desktop

#### 🧭 navigation.cy.js - Flussi Completi (17 test)

- **Complete User Journey** (2 test)
  - Flusso completo USER: home → login → private → logout
  - Workflow completo ADMIN

- **Failed Login Recovery Flow** (1 test)
  - Recupero da login fallito

- **Multi-Page Navigation Patterns** (2 test)
  - Navigazione sistematica tra tutte le pagine
  - Deep linking con autenticazione

- **Session Persistence** (2 test)
  - Sessione mantenuta durante navigazione
  - Navigazione rapida senza perdita sessione

- **Role-Based Navigation** (2 test)
  - Flusso navigazione USER
  - Flusso navigazione ADMIN

- **Multiple User Session Switching** (1 test)
  - Switch tra sessioni USER/ADMIN/DEMO

- **Browser Navigation Controls** (2 test)
  - Back/forward button
  - Refresh su ogni pagina

- **Error Recovery Navigation** (1 test)
  - Navigazione dopo errore autenticazione

- **Complex Navigation Scenarios** (1 test)
  - Scenario complesso multi-interazione

- **Performance & Accessibility** (2 test)
  - Tempo navigazione < 2s per pagina
  - Link di navigazione accessibili

## 🔧 Custom Commands

Comandi personalizzati disponibili in `cypress/support/commands.js`:

### Autenticazione

```javascript
// Login con credenziali
cy.login('user', 'password')

// Login come ruolo specifico
cy.loginAs('admin')  // 'user', 'admin', 'demo'

// Logout
cy.logout()
```

### Verifica Autenticazione

```javascript
// Verifica utente autenticato
cy.shouldBeAuthenticated()

// Verifica utente NON autenticato
cy.shouldNotBeAuthenticated()
```

### Navigazione

```javascript
// Verifica link di navigazione
cy.verifyNavLink('Home')

// Click su link di navigazione
cy.clickNavLink('About')

// Verifica page title
cy.verifyPageTitle('Home Page')
```

### Form e Verifica

```javascript
// Compila form login
cy.fillLoginForm('username', 'password')

// Verifica info utente in area privata
cy.verifyUserInfo('admin', 'ADMIN')

// Verifica errore login
cy.verifyLoginError('Invalid credentials')

// Verifica logout success
cy.verifyLogoutSuccess()
```

## 🎯 Best Practices

### 1. Isolamento dei Test

Ogni test è completamente isolato:
```javascript
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})
```

### 2. Uso di Custom Commands

Preferire custom commands per operazioni comuni:
```javascript
// ❌ Non fare
cy.visit('/login')
cy.get('input[name="username"]').type('user')
cy.get('input[name="password"]').type('password')
cy.get('button[type="submit"]').click()

// ✅ Fare
cy.login('user', 'password')
```

### 3. Selettori Robusti

Usare selettori specifici e stabili:
```javascript
// ✅ Buono - selettore specifico
cy.get('input[name="username"]')
cy.get('[data-testid="submit-button"]')

// ❌ Evitare - selettore fragile
cy.get('.btn-primary')
cy.get('div > button:first')
```

### 4. Assertions Significative

```javascript
// ✅ Assertion chiara
cy.url().should('include', '/private')
cy.contains('Area Privata').should('be.visible')

// ❌ Assertion generica
cy.get('body').should('exist')
```

### 5. Gestione Timeout

```javascript
// Per operazioni lente
cy.get('.slow-element', { timeout: 10000 }).should('be.visible')

// Wait esplicito (usare con parsimonia)
cy.wait(1000)
```

## 🐛 Troubleshooting

### Problema: Applicazione non raggiungibile

**Errore**: `cy.visit() failed trying to load http://localhost:8080`

**Soluzione**:
```bash
# Verificare che l'applicazione sia in esecuzione
mvn spring-boot:run

# Verificare che risponda
curl http://localhost:8080
```

### Problema: Test falliscono sui timeout

**Errore**: `Timed out retrying: Expected to find element`

**Soluzione**:
1. Aumentare i timeout in `cypress.config.js`:
```javascript
defaultCommandTimeout: 10000,
pageLoadTimeout: 30000,
```

2. Verificare che gli elementi esistano realmente:
```bash
# Aprire l'applicazione manualmente e verificare
```

### Problema: Session non persistente

**Errore**: Test falliscono dopo login

**Soluzione**:
```javascript
// Usare cy.session per mantenere la sessione
cy.session([username, password], () => {
  cy.login(username, password)
})
```

### Problema: Video/Screenshot occupano spazio

**Soluzione**:
```bash
# Pulire file generati
npm run clean

# Oppure disabilitare in cypress.config.js
video: false,
screenshotOnRunFailure: false,
```

### Problema: Test lenti

**Soluzione**:
1. Eseguire test specifici:
```bash
npx cypress run --spec "cypress/e2e/home.cy.js"
```

2. Disabilitare video:
```javascript
// cypress.config.js
video: false
```

3. Aumentare parallelizzazione (Cypress Cloud):
```bash
npx cypress run --record --parallel
```

### Problema: Port già in uso

**Errore**: Port 8080 già occupato

**Soluzione**:
```bash
# Windows - trovare processo sulla porta 8080
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Cambiare porta applicazione
SERVER_PORT=8081 mvn spring-boot:run

# Aggiornare baseUrl in cypress.config.js
baseUrl: 'http://localhost:8081'
```

## 🚀 Integrazione CI/CD

### GitHub Actions

```yaml
name: Cypress E2E Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          
      - name: Start Spring Boot
        run: mvn spring-boot:run &
        
      - name: Wait for app
        run: npx wait-on http://localhost:8080
        
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          working-directory: Testing/cypress-e2e
          browser: chrome
          
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: Testing/cypress-e2e/cypress/screenshots
```

## 📚 Risorse

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)
- [Spring Security Testing](https://docs.spring.io/spring-security/reference/servlet/test/index.html)

## 📝 Note

- I test assumono che l'applicazione sia in esecuzione su `http://localhost:8080`
- Gli utenti di test sono quelli configurati in `SecurityConfig` dell'applicazione
- Screenshot e video vengono generati automaticamente per test falliti
- I report HTML sono disponibili in `cypress/reports/` dopo `npm run test:report`

## 🤝 Contribuire

Per aggiungere nuovi test:

1. Creare nuovo file in `cypress/e2e/` con suffisso `.cy.js`
2. Seguire la struttura `describe` → `it` per organizzare i test
3. Usare custom commands quando possibile
4. Aggiungere documentazione nel file
5. Eseguire test localmente prima di commit

---

**Versione**: 1.0.0  
**Ultima modifica**: 27 Marzo 2026  
**Cypress**: 13.6.0
