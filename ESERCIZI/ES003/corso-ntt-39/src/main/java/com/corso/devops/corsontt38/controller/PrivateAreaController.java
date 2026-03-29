package com.corso.devops.corsontt38.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller per la gestione dell'area privata dell'applicazione.
 * Tutti gli endpoint richiedono autenticazione.
 */
@Controller
@RequestMapping("/private")
public class PrivateAreaController {

    /**
     * Endpoint per la dashboard privata.
     * Mostra informazioni sull'utente autenticato.
     * @param model modello per passare dati al template
     * @return nome del template Thymeleaf per la dashboard
     */
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // Recupera l'utente autenticato dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Recupera i ruoli dell'utente
        String roles = authentication.getAuthorities().toString();
        
        // Passa i dati al template
        model.addAttribute("username", username);
        model.addAttribute("roles", roles);
        
        return "private/dashboard";
    }
}
