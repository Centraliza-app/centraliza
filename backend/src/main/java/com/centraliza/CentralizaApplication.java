package com.centraliza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CentralizaApplication {

	public static void main(String[] args) {
		SpringApplication.run(CentralizaApplication.class, args);
	}

}