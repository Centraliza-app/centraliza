package com.api.produtos;

import com.api.produtos.model.Usuario;
import com.api.produtos.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner criarAdmin(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByUsuario("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsuario("admin");
                admin.setNome("Administrador");
                admin.setSobrenome("Padrão");
                admin.setEmail("admin@localhost");
                admin.setSenha(new BCryptPasswordEncoder().encode("admin"));
                usuarioRepository.save(admin);

                System.out.println("✅ Usuário admin criado com sucesso.");
            }
        };
    }
}
