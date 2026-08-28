package com.example.radar.simulator;

public record RadarMeasurement(
        String id,
        long timestamp,
        double distance,
        double direction,
        double height,
        double speed
) {
}