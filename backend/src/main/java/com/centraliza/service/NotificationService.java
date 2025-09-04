package com.centraliza.service;

import com.centraliza.model.Tarefa;
import com.centraliza.model.enums.Status;
import com.centraliza.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private EmailService emailService;

    // Mantenha a configuração de agendamento que for melhor para você (a cada minuto para testes, ou uma vez por dia para produção)
    @Scheduled(cron = "0 * * * * *") // Exemplo: a cada minuto para testes
    public void notifyOverdueTasks() {
        System.out.println("Verificando tarefas atrasadas...");

        List<Tarefa> overdueTasks = tarefaRepository.findAllOverdueAndNotCompleted(
        LocalDate.now(),
        Status.CONCLUIDO
        );

        if (overdueTasks.isEmpty()) {
            System.out.println("Nenhuma tarefa atrasada encontrada.");
            return;
        }

        System.out.println("Encontradas " + overdueTasks.size() + " tarefas atrasadas. Enviando e-mails...");

        for (Tarefa tarefa : overdueTasks) {
            try {
                String recipientEmail;

                // --- esse é um teste do envio de emails pra conta admin/admin ---
                // Verifica se o nome de usuário da tarefa é "admin"
                if ("admin".equals(tarefa.getUsuario().getUsuario())) {
                    recipientEmail = "centralizaifsp@gmail.com";
                    System.out.println("Tarefa do admin encontrada. Redirecionando e-mail para: " + recipientEmail);
                } else {
                    // Para qualquer outro usuário, usa o e-mail cadastrado
                    recipientEmail = tarefa.getUsuario().getEmail();
                }
                // --- fim do teste ---

                emailService.sendOverdueTaskEmail(recipientEmail, tarefa);
                System.out.println("E-mail enviado para: " + recipientEmail + " sobre a tarefa: " + tarefa.getNome());

            } catch (Exception e) {
                // A mensagem de erro continuará mostrando o e-mail original do usuário para referência
                System.err.println("Erro ao enviar e-mail para o usuário: " + tarefa.getUsuario().getUsuario() + " - " + e.getMessage());
            }
        }
    }
}