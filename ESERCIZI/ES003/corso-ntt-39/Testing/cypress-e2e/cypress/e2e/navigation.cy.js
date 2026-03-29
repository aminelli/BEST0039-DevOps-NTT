/**
 * Navigation Flow E2E Tests
 * 
 * End-to-end tests for complete user journeys:
 * - Complete user flow (home -> login -> private -> logout)
 * - Navigation patterns
 * - Cross-page data persistence
 * - Complex user scenarios
 */

describe('Navigation Flow Tests', () => {
  
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })
  
  describe('Complete User Journey', () => {
    
    it('should complete full user flow: home -> login -> private -> logout', () => {
      // Step 1: Visit home page
      cy.visit('/')
      cy.contains('Benvenuto').should('be.visible')
      
      // Step 2: Click login link
      cy.clickNavLink('Login')
      cy.url().should('include', '/login')
      
      // Step 3: Login
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      
      // Step 4: Access private area
      cy.visit('/private')
      cy.url().should('include', '/private')
      cy.verifyUserInfo('user', 'USER')
      
      // Step 5: Navigate to about
      cy.clickNavLink('About')
      cy.url().should('include', '/about')
      
      // Step 6: Navigate back to private
      cy.clickNavLink(/Private|Area Privata|Dashboard/i)
      cy.url().should('include', '/private')
      
      // Step 7: Logout
      cy.logout()
      cy.url().should('include', '/login')
      
      // Step 8: Verify logged out
      cy.shouldNotBeAuthenticated()
    })
    
    it('should handle complete admin workflow', () => {
      // Start at home
      cy.visit('/')
      
      // Navigate to login
      cy.clickNavLink('Login')
      
      // Login as admin
      cy.fillLoginForm('admin', 'admin')
      cy.get('button[type="submit"]').click()
      
      // Access private area
      cy.visit('/private')
      cy.verifyUserInfo('admin', 'ADMIN')
      cy.contains('USER').should('be.visible')
      
      // Navigate through public pages
      cy.clickNavLink('Home')
      cy.url().should('match', /\/(home)?$/)
      
      cy.clickNavLink('About')
      cy.url().should('include', '/about')
      
      // Back to private area
      cy.visit('/private')
      cy.url().should('include', '/private')
      
      // Logout
      cy.logout()
      cy.url().should('include', '/login')
    })
  })
  
  describe('Failed Login Recovery Flow', () => {
    
    it('should recover from failed login and succeed', () => {
      cy.visit('/login')
      
      // Attempt 1: Wrong password
      cy.fillLoginForm('user', 'wrongpassword')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', 'error')
      
      // Attempt 2: Wrong username
      cy.fillLoginForm('wronguser', 'password')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', 'error')
      
      // Attempt 3: Correct credentials
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      cy.url().should('not.include', '/login')
      
      // Should be able to access private area
      cy.visit('/private')
      cy.url().should('include', '/private')
    })
  })
  
  describe('Multi-Page Navigation Patterns', () => {
    
    it('should navigate through all pages systematically', () => {
      const pages = [
        { path: '/', name: 'Home' },
        { path: '/home', name: 'Home Alt' },
        { path: '/about', name: 'About' },
        { path: '/login', name: 'Login' }
      ]
      
      pages.forEach(page => {
        cy.visit(page.path)
        cy.url().should('include', page.path)
        cy.log(`Successfully navigated to ${page.name}`)
      })
    })
    
    it('should handle deep linking with authentication', () => {
      // Try to access private page directly
      cy.visit('/private')
      
      // Should redirect to login
      cy.url().should('include', '/login')
      
      // Login
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      
      // Should redirect back to originally requested page
      cy.url().should('include', '/private')
    })
  })
  
  describe('Session Persistence Across Navigation', () => {
    
    it('should maintain session across multiple page visits', () => {
      cy.loginAs('user')
      
      const pages = ['/', '/home', '/about', '/private']
      
      pages.forEach(page => {
        cy.visit(page)
        cy.log(`Visiting ${page}`)
        
        // Try to access private area from each page
        cy.visit('/private')
        cy.url().should('include', '/private')
        cy.contains('Area Privata').should('be.visible')
      })
    })
    
    it('should handle rapid navigation without session loss', () => {
      cy.loginAs('user')
      
      // Rapid navigation
      cy.visit('/')
      cy.visit('/about')
      cy.visit('/private')
      cy.visit('/')
      cy.visit('/private')
      cy.visit('/about')
      cy.visit('/private')
      
      // Should still be authenticated
      cy.url().should('include', '/private')
      cy.contains('user').should('be.visible')
    })
  })
  
  describe('User Role-Based Navigation', () => {
    
    it('should handle USER role navigation flow', () => {
      cy.loginAs('user')
      
      // Navigate to private area
      cy.visit('/private')
      cy.verifyUserInfo('user', 'USER')
      
      // Navigate to public pages
      cy.visit('/')
      cy.visit('/about')
      
      // Back to private
      cy.visit('/private')
      cy.url().should('include', '/private')
    })
    
    it('should handle ADMIN role navigation flow', () => {
      cy.loginAs('admin')
      
      // Navigate to private area
      cy.visit('/private')
      cy.verifyUserInfo('admin', 'ADMIN')
      
      // Admin should have both roles visible
      cy.contains('USER').should('be.visible')
      cy.contains('ADMIN').should('be.visible')
      
      // Navigate to public pages
      cy.visit('/')
      cy.visit('/about')
      
      // Back to private - should still have admin access
      cy.visit('/private')
      cy.contains('ADMIN').should('be.visible')
    })
  })
  
  describe('Multiple User Session Switching', () => {
    
    it('should handle switching between different user sessions', () => {
      const users = [
        { role: 'user', expectedRole: 'USER' },
        { role: 'admin', expectedRole: 'ADMIN' },
        { role: 'demo', expectedRole: 'USER' }
      ]
      
      users.forEach(({ role, expectedRole }) => {
        // Login as specific user
        cy.loginAs(role)
        
        // Navigate to private area
        cy.visit('/private')
        cy.contains(expectedRole).should('be.visible')
        
        // Navigate through pages
        cy.visit('/')
        cy.visit('/about')
        cy.visit('/private')
        
        // Verify still correct user
        cy.contains(role).should('be.visible')
        
        // Logout
        cy.logout()
      })
    })
  })
  
  describe('Browser Navigation Controls', () => {
    
    it('should handle browser back button correctly', () => {
      cy.loginAs('user')
      
      // Navigate: home -> about -> private
      cy.visit('/')
      cy.visit('/about')
      cy.visit('/private')
      
      // Go back to about
      cy.go('back')
      cy.url().should('include', '/about')
      
      // Go back to home
      cy.go('back')
      cy.url().should('match', /\/(home)?$/)
      
      // Go forward to about
      cy.go('forward')
      cy.url().should('include', '/about')
    })
    
    it('should handle browser refresh on each page', () => {
      cy.loginAs('user')
      
      const pages = ['/', '/about', '/private']
      
      pages.forEach(page => {
        cy.visit(page)
        cy.reload()
        cy.url().should('include', page === '/' ? '' : page)
      })
    })
  })
  
  describe('Error Recovery Navigation', () => {
    
    it('should handle navigation after authentication error', () => {
      cy.visit('/login')
      
      // Failed login
      cy.fillLoginForm('invalid', 'invalid')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', 'error')
      
      // Navigate to home
      cy.visit('/')
      cy.contains('Benvenuto').should('be.visible')
      
      // Try login again with valid credentials
      cy.clickNavLink('Login')
      cy.fillLoginForm('user', 'password')
      cy.get('button[type="submit"]').click()
      
      // Should be successful
      cy.url().should('not.include', '/login')
    })
  })
  
  describe('Complex Navigation Scenarios', () => {
    
    it('should handle complex user journey with multiple interactions', () => {
      // Anonymous user browsing
      cy.visit('/')
      cy.clickNavLink('About')
      cy.clickNavLink('Home')
      
      // Attempt to access private area
      cy.visit('/private')
      cy.url().should('include', '/login')
      
      // Leave login and browse public pages
      cy.visit('/')
      cy.visit('/about')
      
      // Return to login and authenticate
      cy.visit('/login')
      cy.fillLoginForm('admin', 'admin')
      cy.get('button[type="submit"]').click()
      
      // Explore as authenticated admin
      cy.visit('/private')
      cy.verifyUserInfo('admin', 'ADMIN')
      
      cy.visit('/')
      cy.visit('/about')
      cy.visit('/private')
      
      // Logout and verify
      cy.logout()
      cy.shouldNotBeAuthenticated()
      
      // Browse as anonymous again
      cy.visit('/')
      cy.visit('/about')
    })
  })
  
  describe('Performance During Navigation', () => {
    
    it('should navigate quickly between pages', () => {
      cy.loginAs('user')
      
      const pages = ['/', '/about', '/private']
      
      pages.forEach(page => {
        const startTime = Date.now()
        cy.visit(page)
        cy.get('body').should('be.visible').then(() => {
          const loadTime = Date.now() - startTime
          expect(loadTime).to.be.lessThan(2000)
          cy.log(`${page} loaded in ${loadTime}ms`)
        })
      })
    })
  })
  
  describe('Navigation Accessibility', () => {
    
    it('should have accessible navigation links on all pages', () => {
      const pages = ['/', '/about', '/login']
      
      pages.forEach(page => {
        cy.visit(page)
        cy.get('nav a, header a, .navbar a').should('have.length.greaterThan', 0)
      })
    })
    
    it('should allow keyboard navigation', () => {
      cy.visit('/')
      
      // Tab through navigation links
      cy.get('body').tab()
      cy.focused().should('have.prop', 'tagName', 'A')
    })
  })
})
