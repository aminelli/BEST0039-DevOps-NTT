package com.corso.devops.corsontt38.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test per HomeController.
 * Verifica che gli endpoint pubblici siano accessibili senza autenticazione.
 */
@SpringBootTest
class HomeControllerTest {

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
    void testHomePage_RootPath_ReturnsIndexView() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(view().name("index"));
    }

    @Test
    void testHomePage_HomePath_ReturnsIndexView() throws Exception {
        mockMvc.perform(get("/home"))
                .andExpect(status().isOk())
                .andExpect(view().name("index"));
    }

    @Test
    void testAboutPage_ReturnsAboutView() throws Exception {
        mockMvc.perform(get("/about"))
                .andExpect(status().isOk())
                .andExpect(view().name("about"));
    }

    @Test
    void testPublicEndpoints_AccessibleWithoutAuthentication() throws Exception {
        // Verifica che gli endpoint pubblici non richiedano autenticazione
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/home"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/about"))
                .andExpect(status().isOk());
    }
}
