package com.example.radar.simulator;

public class RadarObject {

    private final String id;

    private double distance;
    private double direction;
    private double height;
    private double speed;

    public RadarObject(
            String id,
            double distance,
            double direction,
            double height,
            double speed) {

        this.id = id;
        this.distance = distance;
        this.direction = direction;
        this.height = height;
        this.speed = speed;
    }

    public String id() {
        return id;
    }

    public double distance() {
        return distance;
    }

    public double direction() {
        return direction;
    }

    public double height() {
        return height;
    }

    public double speed() {
        return speed;
    }

    public void setDistance(double distance) {
        this.distance = Math.max(0, distance);
    }

    public void setDirection(double direction) {
        this.direction = direction;
    }

    public void setHeight(double height) {
        this.height = Math.max(0, height);
    }

    public void setSpeed(double speed) {
        this.speed = Math.max(0, speed);
    }
}