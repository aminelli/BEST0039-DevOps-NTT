# 🧪 Testing - Corso NTT 39

Cartella dedicata per tutti i test dell'applicazione Spring Boot.

## 📋 Contenuti

```
Testing/
└── cypress-e2e/          # Test End-to-End con Cypress
```

## 🎯 Suite di Test Disponibili

### 1. Cypress E2E Tests

**Directory**: `cypress-e2e/`  
**Framework**: Cypress 13.6.0  
**Test**: 91 test automatizzati  
**Tipo**: End-to-End / Integration

#### Cosa Testa

- ✅ Interfaccia utente completa
- ✅ Flussi di autenticazione
- ✅ Navigazione tra pagine
- ✅ Controllo accessi role-based
- ✅ Responsive design
- ✅ Sicurezza (XSS, SQL Injection)

#### Quick Start

```bash
cd cypress-e2e
npm install
npm test
```

Vedi [cypress-e2e/README.md](cypress-e2e/README.md) per documentazione completa.

## 📊 Test Coverage Generale

### Unit Tests (Spring Boot)

- **Location**: `../src/test/java/`
- **Framework**: JUnit 5, MockMvc, Spring Security Test
- **Test**: 44 test
- **Coverage**: 97%
- **Comando**: `mvn test` (dalla root del progetto)

### E2E Tests (Cypress)

- **Location**: `Testing/cypress-e2e/`
- **Framework**: Cypress
- **Test**: 91 test
- **Coverage**: Completo end-to-end
- **Comando**: `npm test` (da cypress-e2e/)

### Riepilogo Completo

| Tipo Test | Framework | Test | Coverage | Esecuzione |
|-----------|-----------|------|----------|------------|
| Unit Test | JUnit 5 | 44 | 97% | `mvn test` |
| E2E Test | Cypress | 91 | 100% E2E | `npm test` |
| **TOTALE** | - | **135** | **Completo** | - |

## 🚀 Esecuzione Rapida

### Tutti i Test

```bash
# Unit tests (dalla root)
cd ..
mvn test

# E2E tests
cd Testing/cypress-e2e
npm install
npm test
```

### Solo Unit Tests

```bash
cd ..
mvn test
```

### Solo E2E Tests

```bash
cd Testing/cypress-e2e
npm run cy:open  # Modalità interattiva
npm test         # Modalità headless
```

## 📁 Struttura Completa

```
corso-ntt-39/
├── src/
│   └── test/
│       └── java/                    # Unit tests (44 test)
│           └── com/corso/devops/corsontt38/
│               ├── controller/      # Controller tests
│               ├── config/          # Security config tests
│               └── integration/     # Integration tests
│
└── Testing/
    ├── README.md                    # Questa documentazione
    └── cypress-e2e/                 # E2E tests (91 test)
        ├── cypress/
        │   ├── e2e/                 # Test files
        │   ├── fixtures/            # Test data
        │   └── support/             # Custom commands
        ├── cypress.config.js        # Configurazione
        ├── package.json             # Dipendenze
        └── README.md                # Documentazione E2E
```

## 🎯 Strategia di Test

### Piramide dei Test

```
        /\
       /  \    E2E Tests (91)
      /    \   - User flows completi
     /      \  - Cross-browser
    /________\ 
   /          \
  /   Unit &   \ Unit Tests (44)
 / Integration  \ - Controller isolati
/________________\ - Security config
                   - Integration flows
```

### Quando Usare Ogni Tipo

#### Unit Tests (JUnit)
- ✅ Test di logica business
- ✅ Test di controller isolati
- ✅ Test di configurazione security
- ✅ Test veloce durante sviluppo
- ✅ Feedback immediato su errori

#### E2E Tests (Cypress)
- ✅ Test di flussi utente completi
- ✅ Test di interfaccia utente
- ✅ Test cross-browser
- ✅ Test di integrazione completa
- ✅ Validazione funzionale finale

## 🔄 Workflow Consigliato

### Durante Sviluppo

1. **Scrivi codice**
2. **Esegui unit test**: `mvn test`
3. **Fix errori** se necessario
4. **Commit** quando i test passano

### Prima del Deploy

1. **Esegui tutti i unit test**: `mvn test`
2. **Verifica coverage**: `mvn verify`
3. **Avvia applicazione**: `mvn spring-boot:run`
4. **Esegui E2E tests**: `cd Testing/cypress-e2e && npm test`
5. **Verifica tutti i test passano**
6. **Deploy** se tutto è verde ✅

### CI/CD Pipeline

```yaml
stages:
  - build
  - test-unit
  - test-e2e
  - deploy

test-unit:
  script:
    - mvn test
    - mvn verify
    
test-e2e:
  script:
    - mvn spring-boot:run &
    - cd Testing/cypress-e2e
    - npm install
    - npm test
```

## 📈 Metriche di Qualità

### Current Quality Metrics

| Metrica | Target | Attuale | Status |
|---------|--------|---------|--------|
| Unit Test Coverage | ≥ 50% | 97% | ✅ PASS |
| Unit Tests | - | 44 | ✅ |
| E2E Tests | - | 91 | ✅ |
| Test Success Rate | 100% | 100% | ✅ PASS |
| Build Status | PASS | PASS | ✅ |

### Quality Gates

- ✅ **Line Coverage**: 97% (target: 50%)
- ✅ **Branch Coverage**: 100%
- ✅ **All Tests Pass**: 135/135 (100%)
- ✅ **No Critical Bugs**: 0
- ✅ **Build Success**: YES

## 🐛 Troubleshooting

### Unit Tests Falliscono

```bash
# Pulire e ricompilare
mvn clean test

# Verificare Java version
java -version  # Deve essere 21

# Vedere log dettagliati
mvn test -X
```

### E2E Tests Falliscono

```bash
# Verificare applicazione in esecuzione
curl http://localhost:8080

# Reinstallare dipendenze
cd Testing/cypress-e2e
rm -rf node_modules package-lock.json
npm install

# Eseguire in modalità debug
npm run cy:open
```

### Port 8080 Occupato

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

## 📚 Documentazione Dettagliata

- **Unit Tests**: Vedi [../TEST_DOCUMENTATION.md](../TEST_DOCUMENTATION.md)
- **E2E Tests**: Vedi [cypress-e2e/README.md](cypress-e2e/README.md)
- **README Progetto**: Vedi [../README.md](../README.md)

## 🤝 Contribuire

### Aggiungere Unit Tests

1. Creare file in `src/test/java/`
2. Seguire pattern esistenti
3. Eseguire `mvn test` per validare
4. Documentare in TEST_DOCUMENTATION.md

### Aggiungere E2E Tests

1. Creare file `.cy.js` in `cypress-e2e/cypress/e2e/`
2. Usare custom commands quando possibile
3. Eseguire `npm test` per validare
4. Aggiornare README di Cypress

## 📝 Best Practices

### General Testing

- ✅ Test isolati e indipendenti
- ✅ Nomi descrittivi dei test
- ✅ One assertion per test quando possibile
- ✅ Setup/teardown appropriato
- ✅ Test deterministici (no flaky tests)

### Unit Testing

- ✅ AAA pattern (Arrange-Act-Assert)
- ✅ Mock delle dipendenze esterne
- ✅ Test edge cases
- ✅ Coverage significativo (non solo metrico)

### E2E Testing

- ✅ Test user journeys reali
- ✅ Selettori robusti
- ✅ Gestione timeout appropriata
- ✅ Screenshot/video su failure
- ✅ Clean state tra test

## 🔒 Security Testing

Entrambe le suite includono test di sicurezza:

### Unit Tests
- ✅ Password encoding (BCrypt)
- ✅ Authentication flows
- ✅ Authorization controls
- ✅ Session management

### E2E Tests
- ✅ SQL Injection prevention
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Session hijacking prevention

## 🎓 Risorse di Apprendimento

### JUnit & Spring Test
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [MockMvc Documentation](https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-framework.html)

### Cypress
- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Examples](https://example.cypress.io)

---

**Versione**: 1.0.0  
**Ultima modifica**: 27 Marzo 2026  
**Maintainer**: Corso NTT 39 Team
