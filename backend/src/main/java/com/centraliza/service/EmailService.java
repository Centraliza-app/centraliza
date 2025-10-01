package com.centraliza.service;

import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendOverdueTasksSummary(String to, String userName, List<Tarefa> tarefasEmAtraso) {
        if (tarefasEmAtraso == null || tarefasEmAtraso.isEmpty()) {
            return; // Não envia e-mail se não há tarefas atrasadas
        }

        try {
            // Monta o corpo do e-mail
            StringBuilder body = new StringBuilder();
            body.append("Olá ").append(userName).append("!\n\n");
            body.append("Você possui as seguintes tarefas em atraso:\n\n");

            LocalDate hoje = LocalDate.now();
            for (Tarefa tarefa : tarefasEmAtraso) {
                LocalDate dataFim = tarefa.getDataFim();
                long diasAtraso = (dataFim != null) ? ChronoUnit.DAYS.between(dataFim, hoje) : 0;

                body.append("• ").append(tarefa.getNome());

                if (dataFim != null) {
                    body.append(" (vencimento: ").append(dataFim)
                        .append(" - ")
                        .append(diasAtraso).append(" dia(s) de atraso)");
                }
                body.append("\n");
            }

            body.append("\nAtenciosamente,\nEquipe Centraliza");

            // Cria e envia o e-mail
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Resumo de Tarefas em Atraso");
            message.setText(body.toString());

            mailSender.send(message);

        } catch (MailException e) {
            // Log detalhado no console
            System.err.println("### ERRO AO ENVIAR E-MAIL ###");
            System.err.println(e.getMessage());
            throw e; // Lança a exceção para que o NotificationService saiba que falhou
        }
    }

    public void sendActivationEmail(Usuario usuario, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(usuario.getEmail());
            message.setSubject("Ative sua conta no Centraliza");

            String activationUrl = frontendUrl + "/ativar-conta?token=" + token;

            message.setText(
                "Olá " + usuario.getNome() + ",\n\n" +
                "Bem-vindo ao Centraliza! Para ativar sua conta, por favor, clique no link abaixo:\n" +
                activationUrl + "\n\n" +
                "Se você não se cadastrou, por favor, ignore este e-mail.\n\n" +
                "Atenciosamente,\nEquipe Centraliza"
            );
            mailSender.send(message);
        } catch (MailException e) {
            System.err.println("### ERRO AO ENVIAR E-MAIL DE ATIVAÇÃO ###");
            System.err.println(e.getMessage());
            throw e;
        }
    }
}