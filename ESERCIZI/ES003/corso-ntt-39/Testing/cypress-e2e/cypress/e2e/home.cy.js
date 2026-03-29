/**
 * Home Page E2E Tests
 * 
 * Tests for public pages:
 * - Home page (/)
 * - Home page (/home)
 * - About page (/about)
 */

describe('Home Page Tests', () => {
  
  describe('Public Home Page', () => {
    
    it('should load the home page at root path "/"', () => {
      cy.visit('/')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Benvenuto').should('be.visible')
    })
    
    it('should load the home page at "/home" path', () => {
      cy.visit('/home')
      cy.url().should('include', '/home')
      cy.contains('Benvenuto').should('be.visible')
    })
    
    it('should display welcome message', () => {
      cy.visit('/')
      cy.get('h1, h2').contains(/Benvenuto|Home/i).should('be.visible')
    })
    
    it('should have working navigation links', () => {
      cy.visit('/')
      
      // Verify navigation links exist
      cy.verifyNavLink('Home')
      cy.verifyNavLink('About')
      cy.verifyNavLink('Login')
    })
    
    it('should navigate to home from any public page', () => {
      cy.visit('/about')
      cy.clickNavLink('Home')
      cy.url().should('match', /\/(home)?$/)
    })
  })
  
  describe('About Page', () => {
    
    beforeEach(() => {
      cy.visit('/about')
    })
    
    it('should load the about page', () => {
      cy.url().should('include', '/about')
    })
    
    it('should display about content', () => {
      cy.contains(/About|Chi Siamo|Informazioni/i).should('be.visible')
    })
    
    it('should be accessible without authentication', () => {
      cy.clearCookies()
      cy.visit('/about')
      cy.url().should('include', '/about')
      cy.url().should('not.include', '/login')
    })
  })
  
  describe('Page Elements', () => {
    
    it('should have proper page title', () => {
      cy.visit('/')
      cy.title().should('not.be.empty')
    })
    
    it('should have navigation bar', () => {
      cy.visit('/')
      cy.get('nav, header, .navbar').should('exist')
    })
    
    it('should display login link for unauthenticated users', () => {
      cy.clearCookies()
      cy.visit('/')
      cy.contains('a', /Login|Accedi/i).should('be.visible')
    })
  })
  
  describe('Responsive Design', () => {
    
    const viewports = [
      { device: 'iPhone X', width: 375, height: 812 },
      { device: 'iPad', width: 768, height: 1024 },
      { device: 'Desktop', width: 1280, height: 720 }
    ]
    
    viewports.forEach(({ device, width, height }) => {
      it(`should display correctly on ${device} (${width}x${height})`, () => {
        cy.viewport(width, height)
        cy.visit('/')
        cy.contains('Benvenuto').should('be.visible')
        cy.get('nav, header, .navbar').should('be.visible')
      })
    })
  })
  
  describe('Page Performance', () => {
    
    it('should load within acceptable time', () => {
      const startTime = Date.now()
      cy.visit('/')
      cy.contains('Benvenuto').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(3000) // 3 seconds
      })
    })
  })
  
  describe('Cross-Page Navigation', () => {
    
    it('should navigate between all public pages', () => {
      // Start at home
      cy.visit('/')
      cy.url().should('match', /\/(home)?$/)
      
      // Navigate to About
      cy.clickNavLink('About')
      cy.url().should('include', '/about')
      
      // Navigate back to Home
      cy.clickNavLink('Home')
      cy.url().should('match', /\/(home)?$/)
      
      // Navigate to Login
      cy.clickNavLink('Login')
      cy.url().should('include', '/login')
    })
  })
})
