package com.corso.devops.corsontt38.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller per la gestione delle pagine pubbliche dell'applicazione.
 * Gestisce Home Page e About Page accessibili senza autenticazione.
 */
@Controller
public class HomeController {

    /**
     * Endpoint per la home page pubblica.
     * @return nome del template Thymeleaf per la home page
     */
    @GetMapping({"/", "/home"})
    public String home() {
        return "index";
    }

    /**
     * Endpoint per la pagina About.
     * @return nome del template Thymeleaf per la pagina about
     */
    @GetMapping("/about")
    public String about() {
        return "about";
    }
}
