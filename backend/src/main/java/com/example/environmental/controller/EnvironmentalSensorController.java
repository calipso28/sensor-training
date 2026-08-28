package com.example.environmental.controller;

import com.example.environmental.model.EnvironmentalSensor;
import com.example.environmental.service.EnvironmentalSensorService;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/environmental-sensors")
public class EnvironmentalSensorController {

    private final EnvironmentalSensorService service;

    public EnvironmentalSensorController(
        EnvironmentalSensorService service
    ) {
        this.service = service;
    }

    @GetMapping
    public List<EnvironmentalSensor> getSensors() {
        return service.getSensors();
    }
}