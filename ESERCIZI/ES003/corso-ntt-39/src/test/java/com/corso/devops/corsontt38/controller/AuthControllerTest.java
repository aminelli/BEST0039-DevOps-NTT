package com.corso.devops.corsontt38.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test per AuthController.
 * Verifica la funzionalità del login form e la gestione dei messaggi.
 */
@SpringBootTest
class AuthControllerTest {

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
    void testLoginPage_NoParameters_ReturnsLoginView() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeDoesNotExist("error"))
                .andExpect(model().attributeDoesNotExist("message"));
    }

    @Test
    void testLoginPage_WithErrorParameter_ShowsErrorMessage() throws Exception {
        mockMvc.perform(get("/login").param("error", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeExists("error"))
                .andExpect(model().attribute("error", "Username o password non validi!"));
    }

    @Test
    void testLoginPage_WithLogoutParameter_ShowsLogoutMessage() throws Exception {
        mockMvc.perform(get("/login").param("logout", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeExists("message"))
                .andExpect(model().attribute("message", "Logout effettuato con successo!"));
    }

    @Test
    void testLoginPage_WithBothParameters_ShowsBothMessages() throws Exception {
        mockMvc.perform(get("/login")
                        .param("error", "true")
                        .param("logout", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attributeExists("error"))
                .andExpect(model().attributeExists("message"))
                .andExpect(model().attribute("error", "Username o password non validi!"))
                .andExpect(model().attribute("message", "Logout effettuato con successo!"));
    }

    @Test
    void testLoginPage_AccessibleWithoutAuthentication() throws Exception {
        // Verifica che la pagina di login sia accessibile pubblicamente
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());
    }
}
