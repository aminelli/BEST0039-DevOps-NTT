const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    
    // Test files location
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Support file
    supportFile: 'cypress/support/e2e.js',
    
    // Screenshots and videos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Fixture files
    fixturesFolder: 'cypress/fixtures',
    
    // Reporter configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      reportPageTitle: 'Corso NTT 39 - E2E Test Report',
      embeddedScreenshots: true,
      inlineAssets: true
    },
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  env: {
    // Application URLs
    loginUrl: '/login',
    homeUrl: '/',
    aboutUrl: '/about',
    privateUrl: '/private',
    
    // Test users
    users: {
      user: {
        username: 'user',
        password: 'password',
        roles: ['USER']
      },
      admin: {
        username: 'admin',
        password: 'admin',
        roles: ['USER', 'ADMIN']
      },
      demo: {
        username: 'demo',
        password: 'demo',
        roles: ['USER']
      }
    }
  }
})
