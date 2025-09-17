package com.centraliza.service;

import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    public void sendOverdueTaskEmail(String to, Tarefa tarefa) {
        try { // Adicione o bloco try
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Tarefa Atrasada: " + tarefa.getNome());
            message.setText(
                "Olá " + tarefa.getUsuario().getNome() + ",\n\n" +
                "A tarefa \"" + tarefa.getNome() + "\" está atrasada.\n" +
                "A data de conclusão era " + tarefa.getDataFim().toString() + ".\n\n" +
                "Por favor, verifique suas tarefas no Centraliza.\n\n" +
                "Atenciosamente,\nEquipe Centraliza"
            );
            mailSender.send(message);
        } catch (MailException e) { // Capture a exceção específica
            // Imprime o erro detalhado no console do backend
            System.err.println("### ERRO AO ENVIAR E-MAIL ###");
            System.err.println(e.getMessage());
            // Lança a exceção novamente para que o NotificationService saiba que falhou
            throw e;
        }
    }

    public void sendWelcomeEmail(Usuario usuario) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(usuario.getEmail());
            message.setSubject("Bem-vindo ao Centraliza!");
            message.setText(
                "Olá " + usuario.getNome() + ",\n\n" +
                "Seu cadastro no Centraliza foi realizado com sucesso!\n" +
                "Acesse o site: https://centralizaa.com\n\n" +
                "Atenciosamente,\nEquipe Centraliza"
            );
            mailSender.send(message);
        } catch (MailException e) {
            System.err.println("### ERRO AO ENVIAR E-MAIL DE BOAS-VINDAS ###");
            System.err.println(e.getMessage());
            throw e;
        }
    }
}