package com.centraliza.controller; 

import com.centraliza.dto.AiSubtaskRequest;
import com.centraliza.dto.AiSubtaskResponse;
import com.centraliza.service.GeminiService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@Tag(name = "IA", description = "Endpoints para geração de conteúdo com IA") // Tag opcionalmente atualizada
@SecurityRequirement(name = "bearerAuth") // Garante que está protegido
public class AiSubtaskController {

    private final GeminiService gemini;

    public AiSubtaskController(GeminiService gemini) {
        this.gemini = gemini;
    }

    @PostMapping("/subtarefas")
    public AiSubtaskResponse gerar(@RequestBody AiSubtaskRequest req) {
        var items = gemini.suggestSubtasks(req.getPrompt() == null ? "" : req.getPrompt());
        return new AiSubtaskResponse(items);
    }
}