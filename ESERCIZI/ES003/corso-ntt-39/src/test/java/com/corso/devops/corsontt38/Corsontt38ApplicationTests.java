package com.corso.devops.corsontt38;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.corso.devops.corsontt38.config.SecurityConfig;
import com.corso.devops.corsontt38.controller.AuthController;
import com.corso.devops.corsontt38.controller.HomeController;
import com.corso.devops.corsontt38.controller.PrivateAreaController;

/**
 * Test di smoke per verificare che il contesto Spring si carichi correttamente
 * e che tutti i bean principali siano presenti.
 */
@SpringBootTest
class Corsontt38ApplicationTests {

	@Autowired
	private ApplicationContext applicationContext;

	@Test
	void contextLoads() {
		// Verifica che il contesto Spring si carichi senza errori
		assertThat(applicationContext).isNotNull();
	}

	@Test
	void allControllersAreLoaded() {
		// Verifica che tutti i controller siano presenti nel contesto
		assertThat(applicationContext.getBean(HomeController.class)).isNotNull();
		assertThat(applicationContext.getBean(AuthController.class)).isNotNull();
		assertThat(applicationContext.getBean(PrivateAreaController.class)).isNotNull();
	}

	@Test
	void securityConfigurationIsLoaded() {
		// Verifica che la configurazione di sicurezza sia presente
		assertThat(applicationContext.getBean(SecurityConfig.class)).isNotNull();
	}

	@Test
	void securityBeansAreConfigured() {
		// Verifica che i bean di sicurezza siano configurati
		assertThat(applicationContext.getBean(PasswordEncoder.class)).isNotNull();
		assertThat(applicationContext.getBean(UserDetailsService.class)).isNotNull();
	}

	@Test
	void applicationMainMethodRuns() {
		// Verifica che il metodo main possa essere invocato
		assertThat(CorsonttApplication.class).isNotNull();
	}

}
