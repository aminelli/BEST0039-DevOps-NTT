// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in command log for cleaner output (optional)
// Cypress.on('window:before:load', (win) => {
//   cy.stub(win.console, 'log')
//   cy.stub(win.console, 'error')
// })

// Configure Cypress behavior
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions. Use with caution.
  console.error('Uncaught exception:', err)
  return false
})

// Set default configuration
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies()
  cy.clearLocalStorage()
})
