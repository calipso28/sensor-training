package com.example.radar.simulator;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RadarSimulator {

    private static final double INTERVAL_SECONDS = 0.01;

    private final List<RadarObject> objects = new ArrayList<>();

    // Objekt 1: Überflug
    private double flyoverDistance = 100.0;
    private boolean flyingTowardsRadar = true;

    // Objekt 2: Seitliches Pendeln
    private double oscillationDirection = 30.0;
    private boolean movingRight = true;
    private int pauseTicks = 0;

    public RadarSimulator() {

        objects.add(
                new RadarObject(
                        "radar-object-1",
                        100.0,
                        220.0,
                        20.0,
                        30.0
                )
        );

        objects.add(
                new RadarObject(
                        "radar-object-2",
                        40.0,
                        30.0,
                        10.0,
                        10.0
                )
        );
    }

    public List<RadarMeasurement> generateMeasurements() {

        updateFlyover();
        updateOscillation();

        long timestamp = System.currentTimeMillis();

        List<RadarMeasurement> measurements =
                new ArrayList<>();

        for (RadarObject object : objects) {
            measurements.add(
                    new RadarMeasurement(
                            object.id(),
                            timestamp,
                            object.distance(),
                            object.direction(),
                            object.height(),
                            object.speed()
                    )
            );
        }

        return measurements;
    }

    private void updateFlyover() {

        RadarObject object = objects.get(0);

        double movement =
                object.speed() * INTERVAL_SECONDS;

        if (flyingTowardsRadar) {

            flyoverDistance -= movement;

            if (flyoverDistance <= 5.0) {
                flyoverDistance = 5.0;
                flyingTowardsRadar = false;
            }

        } else {

            flyoverDistance += movement;

            if (flyoverDistance >= 100.0) {
                flyoverDistance = 100.0;
                flyingTowardsRadar = true;
            }
        }

        object.setDistance(flyoverDistance);

        // Richtung verändert sich passend zum Überflug
        double progress =
                (100.0 - flyoverDistance) / 95.0;

        double direction =
                220.0 - (progress * 80.0);

        object.setDirection(direction);

        // Höhe verändert sich leicht während des Überflugs
        double height =
                20.0 + Math.sin(progress * Math.PI) * 5.0;

        object.setHeight(height);
    }

    private void updateOscillation() {

        RadarObject object = objects.get(1);

        // Objekt steht am Wendepunkt kurz still
        if (pauseTicks > 0) {

            pauseTicks--;
            object.setSpeed(0);

            return;
        }

        double movement =
                10.0 * INTERVAL_SECONDS;

        if (movingRight) {

            oscillationDirection += movement;

            if (oscillationDirection >= 150.0) {

                oscillationDirection = 150.0;
                movingRight = false;

                pauseTicks = 100;
            }

        } else {

            oscillationDirection -= movement;

            if (oscillationDirection <= 30.0) {

                oscillationDirection = 30.0;
                movingRight = true;

                pauseTicks = 100;
            }
        }

        object.setDirection(oscillationDirection);
        object.setSpeed(10.0);
    }
}