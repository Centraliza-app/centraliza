package com.centraliza.service;

import com.centraliza.dto.AiSubtask;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${ai.gemini.model:gemini-2.5-flash}")
    private String model;

    // lê de property OU de env (qualquer um serve)
    @Value("${GOOGLE_API_KEY:}")
    private String googleApiKeyProp;

    private final RestTemplate http = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<AiSubtask> suggestSubtasks(String userPrompt) {
        String apiKey = (googleApiKeyProp != null && !googleApiKeyProp.isBlank())
                ? googleApiKeyProp
                : System.getenv("GOOGLE_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            System.out.println("[AI] GOOGLE_API_KEY ausente -> usando fallback heurístico.");
            return heuristic(userPrompt);
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent";

        // ===== Prompt com exemplo explícito =====
        String systemText = """
            Você gera subtarefas curtas e objetivas para um Kanban.
            Regras:
            - Gere entre 2 e 5 itens.
            - Cada item deve ter:
              * "title": título breve (<=60 chars)
              * "description": um único parágrafo curto (sem listas/markdown)
            - Responda SOMENTE JSON válido conforme o schema.
            
            EXEMPLO DE FORMATO/ESTILO (apenas referência de conteúdo e tamanho, NÃO copie literalmente):
            Tarefa: Fazer um Bolo de Chocolate (Descrição: Usar a receita que encontrei na internet)
            Sugestão de Subtarefas:
              1) "title": "Comprar e separar ingredientes"
                 "description": "Garanta que todos os ingredientes da receita estão disponíveis."
              2) "title": "Começar preparo"
                 "description": "Siga o passo a passo (pré-aquecer forno, misturar secos e úmidos, assar e esfriar)."
            """;

        String userText = "Tarefa do usuário: " + userPrompt;

        Map<String, Object> body = new HashMap<>();

        // systemInstruction
        Map<String, Object> sys = new HashMap<>();
        sys.put("parts", List.of(Map.of("text", systemText)));
        body.put("systemInstruction", sys);

        // contents (mensagem do usuário)
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(Map.of("text", userText)));
        body.put("contents", List.of(content));

        // Schema JSON 2–5 itens
        Map<String, Object> itemSchema = Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "title", Map.of("type", "STRING"),
                        "description", Map.of("type", "STRING")
                ),
                "required", List.of("title", "description")
        );
        Map<String, Object> schema = Map.of(
                "type", "OBJECT",
                "properties", Map.of(
                        "items", Map.of(
                                "type", "ARRAY",
                                "minItems", 2,
                                "maxItems", 5,
                                "items", itemSchema
                        )
                ),
                "required", List.of("items")
        );

        Map<String, Object> genCfg = new HashMap<>();
        genCfg.put("temperature", 0.2);
        genCfg.put("responseMimeType", "application/json");
        genCfg.put("responseSchema", schema);
        body.put("generationConfig", genCfg);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("x-goog-api-key", apiKey);

        try {
            ResponseEntity<String> resp = http.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(body, headers), String.class
            );

            JsonNode root = mapper.readTree(resp.getBody());
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.size() == 0) {
                System.out.println("[AI] Sem candidates -> fallback.");
                return heuristic(userPrompt);
            }
            JsonNode parts0 = candidates.get(0).path("content").path("parts");
            if (!parts0.isArray() || parts0.size() == 0) {
                System.out.println("[AI] Sem parts -> fallback.");
                return heuristic(userPrompt);
            }

            String json = parts0.get(0).path("text").asText("{}");
            JsonNode parsed = mapper.readTree(json).path("items");

            List<AiSubtask> out = new ArrayList<>();
            if (parsed.isArray()) {
                for (JsonNode n : parsed) {
                    String title = n.path("title").asText("").trim();
                    String desc  = n.path("description").asText("").trim();
                    if (!title.isBlank()) {
                        // sanitiza tamanho do título
                        if (title.length() > 60) title = title.substring(0, 60) + "...";
                        out.add(new AiSubtask(title, desc));
                    }
                }
            }
            if (out.size() < 2) {
                System.out.println("[AI] Menos de 2 itens -> fallback.");
                return heuristic(userPrompt);
            }
            return out;

        } catch (Exception e) {
            System.out.println("[AI] Erro Gemini -> fallback. Causa: " + e.getMessage());
            return heuristic(userPrompt);
        }
    }

    // fallback simples (se IA falhar/sem chave)
    private List<AiSubtask> heuristic(String prompt) {
        String p = prompt == null ? "" : prompt.trim();
        List<AiSubtask> out = new ArrayList<>();
        if (!p.isEmpty()) {
            String title = p.length() > 60 ? p.substring(0, 60) + "..." : p;
            out.add(new AiSubtask(title, "Passo sugerido com base no objetivo informado."));
        }
        out.add(new AiSubtask("Definir próximos passos", "Descreva brevemente a próxima ação objetiva."));
        if (out.size() < 2) {
            out.add(new AiSubtask("Revisar objetivo", "Ajuste o objetivo para permitir decomposição em subtarefas."));
        }
        return out;
    }
}
