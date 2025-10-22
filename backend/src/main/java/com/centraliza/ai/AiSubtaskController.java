package com.centraliza.ai;

import com.centraliza.ai.dto.AiSubtaskRequest;
import com.centraliza.ai.dto.AiSubtaskResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin
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
