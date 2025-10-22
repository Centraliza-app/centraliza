package com.centraliza.ai.dto;

import java.util.List;

public class AiSubtaskResponse {
    private List<AiSubtask> items;
    public AiSubtaskResponse() {}
    public AiSubtaskResponse(List<AiSubtask> items) { this.items = items; }
    public List<AiSubtask> getItems() { return items; }
    public void setItems(List<AiSubtask> items) { this.items = items; }
}
