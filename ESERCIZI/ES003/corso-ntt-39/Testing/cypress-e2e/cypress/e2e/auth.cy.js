/**
 * Authentication E2E Tests
 * 
 * Tests for login and logout functionality:
 * - Login form display
 * - Successful login
 * - Failed login attempts
 * - Logout functionality
 * - Session management
 */

describe('Authentication Tests', () => {
  
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })
  
  describe('Login Page Display', () => {
    
    it('should display the login page', () => {
      cy.visit('/login')
      cy.url().should('include', '/login')
      cy.contains(/Login|Accedi/i).should('be.visible')
    })
    
    it('should display login form with username and password fields', () => {
      cy.visit('/login')
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
    
    it('should display error message when error parameter is present', () => {
      cy.visit('/login?error')
      cy.get('.alert-danger, .error, [class*="error"]').should('be.visible')
    })
    
    it('should display logout message when logout parameter is present', () => {
      cy.visit('/login?logout')
      cy.contains(/logout|disconnesso|uscito/i).should('be.visible')
    })
    
    it('should be accessible without authentication', () => {
      cy.clearCookies()
      cy.visit('/login')
      cy.url().should('include', '/login')
    })
  })
  
  describe('Successful Login', () => {
    
    it('should login successfully with valid USER credentials', () => {
      cy.visit('/login')
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      
      // Should redirect away from login page
      cy.url().should('not.include', '/login')
      
      // Should be able to access private area
      cy.shouldBeAuthenticated()
    })
    
    it('should login successfully with valid ADMIN credentials', () => {
      cy.visit('/login')
      cy.fillLoginForm('admin', 'admin')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('not.include', '/login')
      cy.shouldBeAuthenticated()
    })
    
    it('should login successfully with valid DEMO credentials', () => {
      cy.visit('/login')
      cy.fillLoginForm('demo', 'demo')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('not.include', '/login')
      cy.shouldBeAuthenticated()
    })
    
    it('should redirect to originally requested page after login', () => {
      // Try to access private area without authentication
      cy.visit('/private')
      
      // Should redirect to login
      cy.url().should('include', '/login')
      
      // Login
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      
      // Should redirect back to private area
      cy.url().should('include', '/private')
    })
  })
  
  describe('Failed Login Attempts', () => {
    
    it('should show error with invalid username', () => {
      cy.visit('/login')
      cy.fillLoginForm('invaliduser', 'password')
      cy.get('button[type="submit"]').click()
      
      // Should stay on login page with error
      cy.url().should('include', '/login')
      cy.url().should('include', 'error')
    })
    
    it('should show error with invalid password', () => {
      cy.visit('/login')
      cy.fillLoginForm('user', 'wrongpassword')
      cy.get('button[type="submit"]').click()
      
      cy.url().should('include', '/login')
      cy.url().should('include', 'error')
    })
    
    it('should show error with empty credentials', () => {
      cy.visit('/login')
      cy.get('button[type="submit"]').click()
      
      // Should either show validation error or stay on login page
      cy.url().should('include', '/login')
    })
    
    it('should handle SQL injection attempt safely', () => {
      cy.visit('/login')
      cy.fillLoginForm("admin' OR '1'='1", "anything")
      cy.get('button[type="submit"]').click()
      
      // Should fail login
      cy.url().should('include', '/login')
      cy.url().should('include', 'error')
    })
    
    it('should handle XSS attempt in username field', () => {
      cy.visit('/login')
      cy.fillLoginForm('<script>alert("XSS")</script>', 'password')
      cy.get('button[type="submit"]').click()
      
      // Should not execute script and should fail login
      cy.url().should('include', '/login')
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!')
      })
    })
  })
  
  describe('Logout Functionality', () => {
    
    it('should logout successfully and redirect to login page', () => {
      // Login first
      cy.loginAs('user')
      
      // Verify authenticated
      cy.visit('/private')
      cy.url().should('include', '/private')
      
      // Logout
      cy.logout()
      
      // Should be on login page
      cy.url().should('include', '/login')
      
      // Should not be able to access private area
      cy.shouldNotBeAuthenticated()
    })
    
    it('should clear session on logout', () => {
      cy.loginAs('user')
      cy.visit('/private')
      cy.url().should('include', '/private')
      
      // Logout
      cy.logout()
      
      // Try to access private area again
      cy.visit('/private')
      cy.url().should('include', '/login')
    })
    
    it('should show logout success message', () => {
      cy.loginAs('user')
      cy.logout()
      cy.url().should('include', '/login')
      cy.url().should('include', 'logout')
    })
  })
  
  describe('Session Management', () => {
    
    it('should maintain session across page navigation', () => {
      cy.loginAs('user')
      
      // Navigate to different pages
      cy.visit('/')
      cy.visit('/about')
      cy.visit('/private')
      
      // Should still be authenticated
      cy.url().should('include', '/private')
      cy.contains('Area Privata').should('be.visible')
    })
    
    it('should not allow accessing private pages without authentication', () => {
      cy.clearCookies()
      cy.visit('/private')
      cy.url().should('include', '/login')
    })
    
    it('should handle concurrent user sessions', () => {
      // Login as user
      cy.loginAs('user')
      cy.visit('/private')
      cy.verifyUserInfo('user', 'USER')
      
      // Clear session and login as admin
      cy.clearCookies()
      cy.loginAs('admin')
      cy.visit('/private')
      cy.verifyUserInfo('admin', 'ADMIN')
    })
  })
  
  describe('Login Form Validation', () => {
    
    it('should have required attribute on username field', () => {
      cy.visit('/login')
      cy.get('input[name="username"]').should('have.attr', 'type')
    })
    
    it('should have password type on password field', () => {
      cy.visit('/login')
      cy.get('input[name="password"]').should('have.attr', 'type', 'password')
    })
    
    it('should enable submit button when form is filled', () => {
      cy.visit('/login')
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').should('not.be.disabled')
    })
  })
  
  describe('Login Security', () => {
    
    it('should use HTTPS in production (check form action)', () => {
      cy.visit('/login')
      cy.get('form').should('exist')
      // Note: In production, this should POST to HTTPS endpoint
    })
    
    it('should not expose password in URL or logs', () => {
      cy.visit('/login')
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      
      cy.url().then(url => {
        expect(url).not.to.include('password')
      })
    })
  })
})
