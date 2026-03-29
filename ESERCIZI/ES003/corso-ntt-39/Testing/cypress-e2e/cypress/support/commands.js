// ***********************************************
// Custom Cypress commands for the application
// ***********************************************

/**
 * Login command - Performs login with given credentials
 * @param {string} username - Username
 * @param {string} password - Password
 * 
 * Usage: cy.login('user', 'password')
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()
    
    // Wait for redirect after successful login
    cy.url().should('not.include', '/login')
  })
})

/**
 * Login as specific user role
 * @param {string} role - 'user', 'admin', or 'demo'
 * 
 * Usage: cy.loginAs('admin')
 */
Cypress.Commands.add('loginAs', (role) => {
  const users = Cypress.env('users')
  const user = users[role]
  
  if (!user) {
    throw new Error(`User role '${role}' not found in config`)
  }
  
  cy.login(user.username, user.password)
})

/**
 * Logout command - Performs logout
 * 
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.visit('/logout')
  cy.url().should('include', '/login')
})

/**
 * Check if user is authenticated
 * 
 * Usage: cy.shouldBeAuthenticated()
 */
Cypress.Commands.add('shouldBeAuthenticated', () => {
  cy.visit('/private')
  cy.url().should('include', '/private')
  cy.contains('Area Privata').should('be.visible')
})

/**
 * Check if user is NOT authenticated (should redirect to login)
 * 
 * Usage: cy.shouldNotBeAuthenticated()
 */
Cypress.Commands.add('shouldNotBeAuthenticated', () => {
  cy.visit('/private')
  cy.url().should('include', '/login')
})

/**
 * Verify page title
 * @param {string} title - Expected page title
 * 
 * Usage: cy.verifyPageTitle('Home Page')
 */
Cypress.Commands.add('verifyPageTitle', (title) => {
  cy.title().should('include', title)
})

/**
 * Verify navigation link exists and is visible
 * @param {string} linkText - Link text to verify
 * 
 * Usage: cy.verifyNavLink('Home')
 */
Cypress.Commands.add('verifyNavLink', (linkText) => {
  cy.contains('a', linkText).should('be.visible')
})

/**
 * Click navigation link
 * @param {string} linkText - Link text to click
 * 
 * Usage: cy.clickNavLink('About')
 */
Cypress.Commands.add('clickNavLink', (linkText) => {
  cy.contains('a', linkText).click()
})

/**
 * Verify user info in private area
 * @param {string} username - Expected username
 * @param {string} role - Expected role (USER or ADMIN)
 * 
 * Usage: cy.verifyUserInfo('admin', 'ADMIN')
 */
Cypress.Commands.add('verifyUserInfo', (username, role) => {
  cy.contains(`Benvenuto, ${username}`).should('be.visible')
  cy.contains(role).should('be.visible')
})

/**
 * Fill login form without submitting
 * @param {string} username - Username
 * @param {string} password - Password
 * 
 * Usage: cy.fillLoginForm('user', 'password')
 */
Cypress.Commands.add('fillLoginForm', (username, password) => {
  cy.get('input[name="username"]').clear().type(username)
  cy.get('input[name="password"]').clear().type(password)
})

/**
 * Verify error message on login page
 * @param {string} message - Expected error message (optional)
 * 
 * Usage: cy.verifyLoginError()
 */
Cypress.Commands.add('verifyLoginError', (message = null) => {
  if (message) {
    cy.contains(message).should('be.visible')
  } else {
    cy.get('.alert-danger, .error, [class*="error"]').should('be.visible')
  }
})

/**
 * Verify logout success message
 * 
 * Usage: cy.verifyLogoutSuccess()
 */
Cypress.Commands.add('verifyLogoutSuccess', () => {
  cy.url().should('include', '/login')
  cy.contains('logout').should('exist') // Check for logout parameter in URL or message
})
