package com.corso.devops.corsontt38.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controller per la gestione dell'autenticazione.
 * Gestisce il login form e la visualizzazione degli errori.
 */
@Controller
public class AuthController {

    /**
     * Endpoint per la pagina di login.
     * @param error parametro opzionale per indicare errori di autenticazione
     * @param logout parametro opzionale per indicare logout avvenuto
     * @param model modello per passare dati al template
     * @return nome del template Thymeleaf per il login
     */
    @GetMapping("/login")
    public String login(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            Model model) {
        
        if (error != null) {
            model.addAttribute("error", "Username o password non validi!");
        }
        
        if (logout != null) {
            model.addAttribute("message", "Logout effettuato con successo!");
        }
        
        return "login";
    }
}
