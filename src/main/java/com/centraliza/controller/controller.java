package com.centraliza.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class controller {
    @GetMapping("/")
    public String tarefa(){
        return "test";
    }
}
