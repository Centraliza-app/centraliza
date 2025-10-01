package com.centraliza.service;

import com.centraliza.model.Tarefa;
import com.centraliza.model.Usuario;
import com.centraliza.model.enums.Status;
import com.centraliza.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private EmailService emailService;

    // Mantenha a configuração de agendamento que for melhor para você (a cada minuto para testes, ou uma vez por dia para produção)
    @Scheduled(cron = "0 * * * * *") // Exemplo: a cada minuto para testes
    //@Scheduled(cron = "0 0 1 * * *", zone = "America/Sao_Paulo") código para enviar um email à 1 da manhã
    public void notifyOverdueTasks() {
        System.out.println("Verificando tarefas atrasadas...");

        List<Tarefa> overdueTasks = tarefaRepository.findAllOverdueAndNotCompleted(
                LocalDate.now(),
                Status.CONCLUIDO);

        if (overdueTasks.isEmpty()) {
            System.out.println("Nenhuma tarefa atrasada encontrada.");
            return;
        }

        System.out.println("Encontradas " + overdueTasks.size() + " tarefas atrasadas. Preparando e-mails agrupados por usuário...");

        Map<Usuario, List<Tarefa>> tarefasPorUsuario = overdueTasks.stream()
                .collect(Collectors.groupingBy(Tarefa::getUsuario));

        tarefasPorUsuario.forEach((usuario, tarefasDoUsuario) -> {
            if (usuario.getNotificar() == null || !usuario.getNotificar()) {
                System.out.println("Usuário " + usuario.getUsuario() + " optou por não receber notificações. Pulando envio.");
                return; // Pula para o próximo usuário do loop
            }

            try {
                String recipientEmail;
                if ("admin".equals(usuario.getUsuario())) {
                    recipientEmail = "centralizaifsp@gmail.com";
                    System.out.println("Usuário admin detectado. Redirecionando e-mail para: " + recipientEmail);
                } else {
                    recipientEmail = usuario.getEmail();
                }

                if (recipientEmail == null || recipientEmail.isBlank()) {
                    System.err.println("Usuário sem e-mail cadastrado: " + usuario.getUsuario() + ". Ignorando envio.");
                    return;
                }

                String userName = (usuario.getNome() != null && !usuario.getNome().isBlank())
                        ? usuario.getNome()
                        : usuario.getUsuario();

                emailService.sendOverdueTasksSummary(recipientEmail, userName, tarefasDoUsuario);

                System.out.println("E-mail de resumo enviado para: " + recipientEmail
                        + " | Tarefas em atraso: " + tarefasDoUsuario.size());

            } catch (Exception e) {
                System.err.println("Erro ao enviar e-mail para o usuário: " + usuario.getUsuario()
                        + " - " + e.getMessage());
            }
        });
    }
}