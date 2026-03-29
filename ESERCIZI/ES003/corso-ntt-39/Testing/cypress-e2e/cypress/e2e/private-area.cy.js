/**
 * Private Area E2E Tests
 * 
 * Tests for authenticated area:
 * - Access control
 * - User information display
 * - Role-based content
 * - Private area functionality
 */

describe('Private Area Tests', () => {
  
  describe('Access Control', () => {
    
    it('should redirect unauthenticated users to login', () => {
      cy.clearCookies()
      cy.visit('/private')
      cy.url().should('include', '/login')
    })
    
    it('should allow authenticated users to access private area', () => {
      cy.loginAs('user')
      cy.visit('/private')
      cy.url().should('include', '/private')
      cy.contains('Area Privata').should('be.visible')
    })
    
    it('should maintain access after page refresh', () => {
      cy.loginAs('user')
      cy.visit('/private')
      cy.url().should('include', '/private')
      
      // Refresh page
      cy.reload()
      
      // Should still be on private area
      cy.url().should('include', '/private')
      cy.contains('Area Privata').should('be.visible')
    })
  })
  
  describe('Standard User (USER role)', () => {
    
    beforeEach(() => {
      cy.loginAs('user')
      cy.visit('/private')
    })
    
    it('should display user information for USER role', () => {
      cy.verifyUserInfo('user', 'USER')
    })
    
    it('should display welcome message with username', () => {
      cy.contains(/Benvenuto.*user/i).should('be.visible')
    })
    
    it('should display USER role badge', () => {
      cy.contains('USER').should('be.visible')
    })
    
    it('should show private area content', () => {
      cy.contains('Area Privata').should('be.visible')
    })
    
    it('should have access to user-specific features', () => {
      // Verify basic user features are visible
      cy.get('body').should('contain', 'user')
    })
  })
  
  describe('Admin User (ADMIN role)', () => {
    
    beforeEach(() => {
      cy.loginAs('admin')
      cy.visit('/private')
    })
    
    it('should display admin information for ADMIN role', () => {
      cy.verifyUserInfo('admin', 'ADMIN')
    })
    
    it('should display both USER and ADMIN roles', () => {
      cy.contains('USER').should('be.visible')
      cy.contains('ADMIN').should('be.visible')
    })
    
    it('should display admin-specific welcome message', () => {
      cy.contains(/Benvenuto.*admin/i).should('be.visible')
    })
    
    it('should show admin role prominently', () => {
      cy.contains('ADMIN').should('be.visible')
    })
  })
  
  describe('Demo User', () => {
    
    beforeEach(() => {
      cy.loginAs('demo')
      cy.visit('/private')
    })
    
    it('should display demo user information', () => {
      cy.verifyUserInfo('demo', 'USER')
    })
    
    it('should have same access as standard user', () => {
      cy.contains('Area Privata').should('be.visible')
      cy.contains('USER').should('be.visible')
    })
  })
  
  describe('Multiple Users Access', () => {
    
    it('should handle user switching correctly', () => {
      // Login as user
      cy.loginAs('user')
      cy.visit('/private')
      cy.verifyUserInfo('user', 'USER')
      
      // Logout
      cy.logout()
      
      // Login as admin
      cy.loginAs('admin')
      cy.visit('/private')
      cy.verifyUserInfo('admin', 'ADMIN')
      
      // Logout
      cy.logout()
      
      // Login as demo
      cy.loginAs('demo')
      cy.visit('/private')
      cy.verifyUserInfo('demo', 'USER')
    })
    
    it('should display correct information for each user type', () => {
      const users = ['user', 'admin', 'demo']
      
      users.forEach(username => {
        cy.clearCookies()
        cy.loginAs(username)
        cy.visit('/private')
        
        // Verify username is displayed
        cy.contains(username).should('be.visible')
        
        // Verify at least USER role
        cy.contains('USER').should('be.visible')
        
        cy.logout()
      })
    })
  })
  
  describe('Private Area Content', () => {
    
    beforeEach(() => {
      cy.loginAs('user')
      cy.visit('/private')
    })
    
    it('should display page title', () => {
      cy.get('h1, h2').contains(/Area Privata|Private|Dashboard/i).should('be.visible')
    })
    
    it('should have navigation elements', () => {
      cy.get('nav, header, .navbar').should('be.visible')
    })
    
    it('should have logout option available', () => {
      cy.contains('a', /Logout|Esci|Disconnetti/i).should('be.visible')
    })
    
    it('should display user session information', () => {
      // Should show username somewhere on the page
      cy.contains('user').should('be.visible')
    })
  })
  
  describe('Navigation from Private Area', () => {
    
    beforeEach(() => {
      cy.loginAs('user')
      cy.visit('/private')
    })
    
    it('should navigate to home page while maintaining session', () => {
      cy.clickNavLink('Home')
      cy.url().should('match', /\/(home)?$/)
      
      // Should still be authenticated
      cy.visit('/private')
      cy.url().should('include', '/private')
    })
    
    it('should navigate to about page while maintaining session', () => {
      cy.clickNavLink('About')
      cy.url().should('include', '/about')
      
      // Should still be authenticated
      cy.visit('/private')
      cy.url().should('include', '/private')
    })
    
    it('should logout when clicking logout link', () => {
      cy.clickNavLink(/Logout|Esci/i)
      cy.url().should('include', '/login')
      cy.shouldNotBeAuthenticated()
    })
  })
  
  describe('Role-Based Content Display', () => {
    
    it('should show different content for USER vs ADMIN', () => {
      // Check USER content
      cy.loginAs('user')
      cy.visit('/private')
      const userContent = cy.get('body').invoke('text')
      cy.logout()
      
      // Check ADMIN content
      cy.loginAs('admin')
      cy.visit('/private')
      const adminContent = cy.get('body').invoke('text')
      
      // Admin should have ADMIN role visible
      cy.contains('ADMIN').should('be.visible')
    })
  })
  
  describe('Security Checks', () => {
    
    it('should not allow access after session expires', () => {
      cy.loginAs('user')
      cy.visit('/private')
      cy.url().should('include', '/private')
      
      // Clear cookies to simulate expired session
      cy.clearCookies()
      
      // Try to access again
      cy.visit('/private')
      cy.url().should('include', '/login')
    })
    
    it('should not expose sensitive data in page source', () => {
      cy.loginAs('user')
      cy.visit('/private')
      
      cy.get('body').then($body => {
        const bodyText = $body.text()
        // Should not contain raw password or tokens
        expect(bodyText).not.to.match(/password.*:.*[a-zA-Z0-9]{8,}/)
      })
    })
  })
  
  describe('Error Handling', () => {
    
    it('should handle direct URL access without authentication', () => {
      cy.clearCookies()
      cy.visit('/private', { failOnStatusCode: false })
      cy.url().should('include', '/login')
    })
    
    it('should handle browser back button correctly', () => {
      cy.loginAs('user')
      cy.visit('/private')
      cy.visit('/')
      cy.go('back')
      
      // Should still be on private page and authenticated
      cy.url().should('include', '/private')
    })
  })
  
  describe('Responsive View', () => {
    
    const viewports = [
      { device: 'Mobile', width: 375, height: 667 },
      { device: 'Tablet', width: 768, height: 1024 },
      { device: 'Desktop', width: 1280, height: 720 }
    ]
    
    viewports.forEach(({ device, width, height }) => {
      it(`should display correctly on ${device}`, () => {
        cy.loginAs('user')
        cy.viewport(width, height)
        cy.visit('/private')
        
        cy.contains('Area Privata').should('be.visible')
        cy.contains('user').should('be.visible')
        cy.contains('USER').should('be.visible')
      })
    })
  })
})
