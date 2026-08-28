package com.example.radar;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RadarStatusController {

    @GetMapping("/api/radar/status")
    public Map<String, Object> getStatus() {
        return Map.of(
                "status", "running",
                "radar", "radar-simulator",
                "intervalMs", 10);
    }

}