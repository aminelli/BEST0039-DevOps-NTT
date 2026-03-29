package com.corso.devops.corsontt38.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configurazione Spring Security per l'applicazione.
 * Gestisce l'autenticazione in-memory e le regole di autorizzazione.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configura il password encoder BCrypt per la sicurezza delle password.
     * @return istanza di BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura gli utenti in-memory con username, password e ruoli.
     * @return UserDetailsService con gli utenti configurati
     */
    @Bean
    public UserDetailsService userDetailsService() {
        // Utente standard con ruolo USER
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder().encode("password"))
                .roles("USER")
                .build();

        // Utente amministratore con ruoli USER e ADMIN
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("admin123"))
                .roles("USER", "ADMIN")
                .build();

        // Utente demo
        UserDetails demo = User.builder()
                .username("demo")
                .password(passwordEncoder().encode("demo"))
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(user, admin, demo);
    }

    /**
     * Configura la sicurezza HTTP, definendo quali endpoint sono pubblici
     * e quali richiedono autenticazione.
     * @param http HttpSecurity object
     * @return SecurityFilterChain configurato
     * @throws Exception in caso di errore di configurazione
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Endpoint pubblici accessibili senza autenticazione
                .requestMatchers("/", "/home", "/about", "/css/**", "/js/**", "/images/**").permitAll()
                // Tutti gli endpoint sotto /private richiedono autenticazione
                .requestMatchers("/private/**").authenticated()
                // Tutti gli altri endpoint richiedono autenticazione
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                // Configura la pagina di login personalizzata
                .loginPage("/login")
                .permitAll()
                // Redirect dopo login riuscito
                .defaultSuccessUrl("/private/dashboard", true)
                // Gestione errori di login
                .failureUrl("/login?error=true")
            )
            .logout(logout -> logout
                // Configura il logout
                .logoutUrl("/logout")
                .permitAll()
                // Redirect dopo logout
                .logoutSuccessUrl("/home")
                // Invalida la sessione HTTP
                .invalidateHttpSession(true)
                // Elimina i cookie
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }
}
