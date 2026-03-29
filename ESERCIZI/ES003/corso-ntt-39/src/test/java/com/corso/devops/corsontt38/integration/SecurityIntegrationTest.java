package com.corso.devops.corsontt38.integration;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.logout;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test di integrazione per verificare il flusso completo di autenticazione
 * e navigazione nell'applicazione.
 */
@SpringBootTest
class SecurityIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void testCompleteUserFlow_PublicToPrivateArea() throws Exception {
        // 1. Accesso alla home page (pubblica)
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(view().name("index"));
        
        // 2. Tentativo di accesso all'area privata senza autenticazione
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));
        
        // 3. Login con credenziali valide
        mockMvc.perform(formLogin("/login")
                        .user("user")
                        .password("password"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
    }

    @Test
    void testFailedLoginFlow() throws Exception {
        // 1. Tentativo di login con credenziali errate
        mockMvc.perform(formLogin("/login")
                        .user("user")
                        .password("wrongpassword"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error=true"));
        
        // 2. Verifica che il messaggio di errore sia presente
        mockMvc.perform(get("/login?error=true"))
                .andExpect(status().isOk())
                .andExpect(model().attributeExists("error"))
                .andExpect(model().attribute("error", "Username o password non validi!"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testAuthenticatedUserFlow() throws Exception {
        // 1. Accesso all'area privata come utente autenticato
        MvcResult result = mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("private/dashboard"))
                .andExpect(model().attributeExists("username", "roles"))
                .andReturn();
        
        // 2. Verifica che i dati dell'utente siano corretti
        String username = (String) result.getModelAndView().getModel().get("username");
        assertThat(username).isEqualTo("user");
        
        // 3. Logout
        mockMvc.perform(logout("/logout"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/home"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void testAdminUserFlow() throws Exception {
        // 1. Accesso all'area privata come amministratore
        MvcResult result = mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("private/dashboard"))
                .andExpect(model().attributeExists("username", "roles"))
                .andReturn();
        
        // 2. Verifica che l'admin abbia entrambi i ruoli
        String roles = (String) result.getModelAndView().getModel().get("roles");
        assertThat(roles).contains("ROLE_USER", "ROLE_ADMIN");
    }

    @Test
    void testMultipleUsersLogin() throws Exception {
        // Test login con tutti e tre gli utenti configurati
        
        // User
        mockMvc.perform(formLogin("/login")
                        .user("user")
                        .password("password"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
        
        // Admin
        mockMvc.perform(formLogin("/login")
                        .user("admin")
                        .password("admin123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
        
        // Demo
        mockMvc.perform(formLogin("/login")
                        .user("demo")
                        .password("demo"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
    }

    @Test
    void testPublicPagesAccessibility() throws Exception {
        // Verifica che tutte le pagine pubbliche siano accessibili
        String[] publicPages = {"/", "/home", "/about", "/login"};
        
        for (String page : publicPages) {
            mockMvc.perform(get(page))
                    .andExpect(status().isOk());
        }
    }

    @Test
    @WithMockUser
    void testSessionNavigation() throws Exception {
        // 1. Dashboard
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk());
        
        // 2. Navigazione alle pagine pubbliche (ancora autenticato)
        mockMvc.perform(get("/home"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/about"))
                .andExpect(status().isOk());
        
        // 3. Ritorno alla dashboard
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    void testLogoutFlow() throws Exception {
        // 1. Login
        mockMvc.perform(formLogin("/login")
                        .user("user")
                        .password("password"))
                .andExpect(status().is3xxRedirection());
        
        // 2. Logout
        mockMvc.perform(logout("/logout"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/home"));
        
        // 3. Verifica che si possa accedere nuovamente alla pagina di login (dopo logout)
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());
    }
}
