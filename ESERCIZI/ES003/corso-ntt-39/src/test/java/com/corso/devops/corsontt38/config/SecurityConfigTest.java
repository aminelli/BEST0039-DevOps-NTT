package com.corso.devops.corsontt38.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.logout;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test per SecurityConfig.
 * Verifica la configurazione di sicurezza, gli utenti in-memory e
 * le regole di autorizzazione.
 */
@SpringBootTest
class SecurityConfigTest {

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

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ========== Test Password Encoder ==========

    @Test
    void testPasswordEncoder_IsConfigured() {
        assertThat(passwordEncoder).isNotNull();
    }

    @Test
    void testPasswordEncoder_IsBCrypt() {
        assertThat(passwordEncoder).isInstanceOf(org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder.class);
    }

    @Test
    void testPasswordEncoder_EncodesPasswords() {
        String rawPassword = "testpassword";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        assertThat(encodedPassword).isNotNull();
        assertThat(encodedPassword).isNotEqualTo(rawPassword);
        assertThat(passwordEncoder.matches(rawPassword, encodedPassword)).isTrue();
    }

    // ========== Test UserDetailsService ==========

    @Test
    void testUserDetailsService_LoadsUserByUsername() {
        UserDetails userDetails = userDetailsService.loadUserByUsername("user");
        
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("user");
        assertThat(userDetails.getAuthorities()).hasSize(1);
        assertThat(userDetails.getAuthorities().toString()).contains("ROLE_USER");
    }

    @Test
    void testUserDetailsService_LoadsAdminUser() {
        UserDetails adminDetails = userDetailsService.loadUserByUsername("admin");
        
        assertThat(adminDetails).isNotNull();
        assertThat(adminDetails.getUsername()).isEqualTo("admin");
        assertThat(adminDetails.getAuthorities()).hasSize(2);
        assertThat(adminDetails.getAuthorities().toString()).contains("ROLE_USER", "ROLE_ADMIN");
    }

    @Test
    void testUserDetailsService_LoadsDemoUser() {
        UserDetails demoDetails = userDetailsService.loadUserByUsername("demo");
        
        assertThat(demoDetails).isNotNull();
        assertThat(demoDetails.getUsername()).isEqualTo("demo");
        assertThat(demoDetails.getAuthorities()).hasSize(1);
        assertThat(demoDetails.getAuthorities().toString()).contains("ROLE_USER");
    }

    @Test
    void testUserDetailsService_ThrowsExceptionForUnknownUser() {
        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("unknown"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void testUserPasswords_AreEncodedCorrectly() {
        UserDetails user = userDetailsService.loadUserByUsername("user");
        UserDetails admin = userDetailsService.loadUserByUsername("admin");
        UserDetails demo = userDetailsService.loadUserByUsername("demo");
        
        // Verifica che le password siano codificate e corrispondano
        assertThat(passwordEncoder.matches("password", user.getPassword())).isTrue();
        assertThat(passwordEncoder.matches("admin123", admin.getPassword())).isTrue();
        assertThat(passwordEncoder.matches("demo", demo.getPassword())).isTrue();
    }

    // ========== Test Security Filter Chain ==========

    @Test
    void testPublicEndpoints_AreAccessibleWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/home"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/about"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk());
    }

    @Test
    void testPrivateEndpoints_RequireAuthentication() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));
    }

    @Test
    @WithMockUser
    void testPrivateEndpoints_AccessibleWithAuthentication() throws Exception {
        mockMvc.perform(get("/private/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    void testLogin_WithValidCredentials_RedirectsToDashboard() throws Exception {
        mockMvc.perform(formLogin("/login")
                        .user("user")
                        .password("password"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
    }

    @Test
    void testLogin_WithInvalidCredentials_RedirectsToLoginWithError() throws Exception {
        mockMvc.perform(formLogin("/login")
                        .user("user")
                        .password("wrongpassword"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error=true"));
    }

    @Test
    void testLogin_WithAdminCredentials_Succeeds() throws Exception {
        mockMvc.perform(formLogin("/login")
                        .user("admin")
                        .password("admin123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
    }

    @Test
    void testLogin_WithDemoCredentials_Succeeds() throws Exception {
        mockMvc.perform(formLogin("/login")
                        .user("demo")
                        .password("demo"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/private/dashboard"));
    }

    @Test
    @WithMockUser
    void testLogout_InvalidatesSession_RedirectsToHome() throws Exception {
        mockMvc.perform(logout("/logout"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/home"));
    }

    @Test
    void testStaticResources_ArePubliclyAccessible() throws Exception {
        // Verifica che CSS, JS e immagini siano accessibili senza autenticazione
        mockMvc.perform(get("/css/style.css"))
                .andExpect(status().isNotFound()); // 404 è accettabile, l'importante è che non reindirizzi al login
        
        mockMvc.perform(get("/js/script.js"))
                .andExpect(status().isNotFound());
        
        mockMvc.perform(get("/images/logo.png"))
                .andExpect(status().isNotFound());
    }
}
