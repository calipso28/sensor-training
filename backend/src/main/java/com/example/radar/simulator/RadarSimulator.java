package com.example.radar.simulator;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RadarSimulator {

    private static final double INTERVAL_SECONDS = 0.01;

    private final List<RadarObject> objects = new ArrayList<>();

    // ---------------------------------------------------------
    // Objekt 1: Flugbahn SW -> NW
    // ---------------------------------------------------------

    private static final double OBJECT_1_LOOP_SECONDS = 30.0;
    private static final double OBJECT_1_SPEED = 20.0;
    private static final double OBJECT_1_MIN_DISTANCE = 10.0;
    private static final double OBJECT_1_MAX_DISTANCE = 80.0;

    // ---------------------------------------------------------
    // Objekt 2: bestehende Bewegung
    // ---------------------------------------------------------

    private static final double OBJECT_2_LOOP_SECONDS = 30.0;
    private static final double OBJECT_2_MIN_DISTANCE = 60.0;

    // ---------------------------------------------------------
    // Objekt 3: Durchflug SO -> NW
    // ---------------------------------------------------------

    private static final String OBJECT_3_ID = "radar-object-3";

    private static final double OBJECT_3_CYCLE_SECONDS = 20.0;
    private static final double OBJECT_3_START_AFTER_SECONDS = 5.0;
    private static final double OBJECT_3_FLIGHT_SECONDS = 7.0;
    private static final double OBJECT_3_MIN_DISTANCE = 28.0;

    // Radar-Darstellung:
    // 100 m entsprechen 45 % Abstand vom Mittelpunkt.
    private static final double RADAR_MAX_DISTANCE = 100.0;
    private static final double RADAR_MAX_RADIUS_PERCENT = 45.0;

    public RadarSimulator() {

        objects.add(
                new RadarObject(
                        "radar-object-1",
                        80.0,
                        225.0,
                        20.0,
                        OBJECT_1_SPEED
                )
        );

        objects.add(
                new RadarObject(
                        "radar-object-2",
                        65.0,
                        25.0,
                        10.0,
                        10.0
                )
        );
    }

    public List<RadarMeasurement> generateMeasurements() {

        updateObject1();
        updateObject2();
        updateObject3();

        long timestamp = System.currentTimeMillis();

        List<RadarMeasurement> measurements = new ArrayList<>();

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

    // ---------------------------------------------------------
    // Objekt 1
    // ---------------------------------------------------------

    private void updateObject1() {

        RadarObject object = objects.get(0);

        double time =
                (System.currentTimeMillis() % 30_000) / 1000.0;

        double progress =
                time / OBJECT_1_LOOP_SECONDS;

        /*
         * Objekt 1 fliegt von SW nach NW.
         *
         * Die Richtung bewegt sich von 225° nach 315°.
         * Durch zusätzliche Sinusbewegungen entsteht eine
         * geschwungene Flugbahn.
         */
        double direction =
                225.0
                        + progress * 90.0
                        + Math.sin(progress * Math.PI * 4.0) * 18.0
                        + Math.sin(progress * Math.PI * 8.0) * 7.0;

        /*
         * Abstand zwischen 10 und 80 m.
         *
         * Mehrere Sinusbewegungen erzeugen Kurven und
         * unterschiedliche Abstände zum Radar.
         */
        double distance =
                45.0
                        + Math.sin(progress * Math.PI * 2.0) * 25.0
                        + Math.sin(progress * Math.PI * 4.0) * 10.0;

        distance = Math.max(
                OBJECT_1_MIN_DISTANCE,
                Math.min(OBJECT_1_MAX_DISTANCE, distance)
        );

        object.setDistance(distance);
        object.setDirection(direction);
        object.setSpeed(OBJECT_1_SPEED);
        object.setHeight(
                20.0 + Math.sin(progress * Math.PI * 2.0) * 4.0
        );
    }

    // ---------------------------------------------------------
    // Objekt 2
    // ---------------------------------------------------------

    private void updateObject2() {

        RadarObject object = objects.get(1);

        double time =
                (System.currentTimeMillis()
                        % (long) (OBJECT_2_LOOP_SECONDS * 1000))
                        / 1000.0;

        /*
         * Die bisherige Bewegung bleibt erhalten.
         */
        double distance =
                65.0
                        + Math.sin(time * 0.45) * 7.0
                        + Math.sin(time * 0.9) * 2.5;

        double direction =
                70.0
                        + Math.sin(time * 0.35) * 45.0
                        + Math.sin(time * 0.8) * 18.0;

        double speed =
                12.0
                        + Math.sin(time * 0.5) * 5.0
                        + Math.sin(time * 1.1) * 2.0;

        double height =
                10.0
                        + Math.sin(time * 0.4) * 3.0;

        /*
         * Objekt 2 darf niemals näher als 60 m kommen.
         */
        distance = Math.max(
                OBJECT_2_MIN_DISTANCE,
                distance
        );

        object.setDistance(distance);
        object.setDirection(direction);
        object.setSpeed(Math.max(5.0, speed));
        object.setHeight(height);
    }

    // ---------------------------------------------------------
    // Objekt 3
    // ---------------------------------------------------------

    private void updateObject3() {

        double cycleSeconds =
                (System.currentTimeMillis()
                        % (long) (OBJECT_3_CYCLE_SECONDS * 1000))
                        / 1000.0;

        // Noch nicht erschienen.
        if (cycleSeconds < OBJECT_3_START_AFTER_SECONDS) {
            removeObject3();
            return;
        }

        double flightProgress =
                (cycleSeconds - OBJECT_3_START_AFTER_SECONDS)
                        / OBJECT_3_FLIGHT_SECONDS;

        // Durchflug beendet.
        if (flightProgress >= 1.0) {
            removeObject3();
            return;
        }

        RadarObject object = getOrCreateObject3();

        /*
         * Gerade Linie von Südost nach Nordwest.
         *
         * Die Linie wird so verschoben, dass der
         * Mindestabstand zum Radarzentrum 28 m beträgt.
         */

        double maxY = 44.0;

        double offset =
                (OBJECT_3_MIN_DISTANCE / RADAR_MAX_DISTANCE)
                        * RADAR_MAX_RADIUS_PERCENT;

        double diagonalX =
                maxY
                        - (maxY * 2.0 * flightProgress);

        double diagonalY =
                maxY
                        - (maxY * 2.0 * flightProgress);

        double shift =
                offset / Math.sqrt(2.0);

        double x =
                diagonalX + shift;

        double y =
                diagonalY - shift;

        double radiusPercent =
                Math.sqrt(x * x + y * y);

        double distance =
                (radiusPercent / RADAR_MAX_RADIUS_PERCENT)
                        * RADAR_MAX_DISTANCE;

        double angle =
                Math.atan2(x, -y);

        double direction =
                Math.toDegrees(angle);

        if (direction < 0.0) {
            direction += 360.0;
        }

        object.setDistance(distance);
        object.setDirection(direction);
        object.setSpeed(20.0);
        object.setHeight(15.0);
    }

    // ---------------------------------------------------------
    // Objekt 3 – Verwaltung
    // ---------------------------------------------------------

    private RadarObject getOrCreateObject3() {

        for (RadarObject object : objects) {
            if (OBJECT_3_ID.equals(object.id())) {
                return object;
            }
        }

        RadarObject object =
                new RadarObject(
                        OBJECT_3_ID,
                        100.0,
                        135.0,
                        15.0,
                        20.0
                );

        objects.add(object);

        return object;
    }

    private void removeObject3() {

        objects.removeIf(
                object -> OBJECT_3_ID.equals(object.id())
        );
    }
}