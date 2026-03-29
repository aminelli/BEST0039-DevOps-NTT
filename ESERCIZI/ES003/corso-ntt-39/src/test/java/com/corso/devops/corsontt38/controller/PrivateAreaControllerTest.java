package com.corso.devops.corsontt38.controller;

import static org.hamcrest.Matchers.containsString;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test per PrivateAreaController.
 * Verifica che gli endpoint privati richiedano autenticazione e 
 * mostrino correttamente le informazioni dell'utente.
 */
@SpringBootTest
class PrivateAreaControllerTest {

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
    void testDashboard_WithoutAuthentication_RedirectsToLogin() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void testDashboard_WithUserRole_ShowsUserInfo() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("private/dashboard"))
                .andExpect(model().attributeExists("username"))
                .andExpect(model().attributeExists("roles"))
                .andExpect(model().attribute("username", "user"))
                .andExpect(model().attribute("roles", containsString("ROLE_USER")));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void testDashboard_WithAdminRole_ShowsAdminInfo() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("private/dashboard"))
                .andExpect(model().attributeExists("username"))
                .andExpect(model().attributeExists("roles"))
                .andExpect(model().attribute("username", "admin"))
                .andExpect(model().attribute("roles", containsString("ROLE_ADMIN")))
                .andExpect(model().attribute("roles", containsString("ROLE_USER")));
    }

    @Test
    @WithMockUser(username = "demo")
    void testDashboard_WithDemoUser_ShowsDemoInfo() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("private/dashboard"))
                .andExpect(model().attribute("username", "demo"));
    }

    @Test
    @WithMockUser
    void testDashboard_WithAuthentication_ReturnsCorrectView() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk())
                .andExpect(view().name("private/dashboard"));
    }
}
