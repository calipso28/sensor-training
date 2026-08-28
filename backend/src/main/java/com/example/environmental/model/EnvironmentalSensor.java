package com.example.environmental.model;

public class EnvironmentalSensor {

    private String id;
    private String type;
    private double value;
    private String unit;
    private long timestamp;
    private String status;

    public EnvironmentalSensor(
        String id,
        String type,
        double value,
        String unit,
        long timestamp,
        String status
    ) {
        this.id = id;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.timestamp = timestamp;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}