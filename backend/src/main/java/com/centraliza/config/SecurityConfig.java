package com.centraliza.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Configura o CORS usando o bean 'corsConfigurationSource'
            .cors(withDefaults())
            // 2. Desabilita o CSRF (comum para APIs stateless)
            .csrf(AbstractHttpConfigurer::disable)
            // 3. Define as regras de autorização
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated() // Todas as requisições exigem autenticação
            )
            // 4. Habilita a autenticação HTTP Basic
            .httpBasic(withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean que define a configuração do CORS de forma centralizada
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Define as origens permitidas (seu frontend React)
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        // Define os métodos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permite todos os cabeçalhos
        configuration.setAllowedHeaders(List.of("*"));
        // Permite o envio de credenciais (cookies, etc.)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica a configuração a todas as rotas da sua API
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}