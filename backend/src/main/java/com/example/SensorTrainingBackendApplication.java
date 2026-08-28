package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class SensorTrainingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SensorTrainingBackendApplication.class, args);
	}

	@Bean
	ObjectMapper objectMapper() {
		return new ObjectMapper();
	}

}
