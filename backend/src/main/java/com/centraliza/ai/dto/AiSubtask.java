package com.centraliza.ai.dto;

public class AiSubtask {
    private String title;
    private String description;

    public AiSubtask() {}
    public AiSubtask(String title, String description) {
        this.title = title;
        this.description = description;
    }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
}
