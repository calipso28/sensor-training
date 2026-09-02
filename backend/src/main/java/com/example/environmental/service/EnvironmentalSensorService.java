package com.example.environmental.service;
import com.example.environmental.model.EnvironmentalSensor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;


@Service
public class EnvironmentalSensorService {

    private final Random random = new Random();

    public List<EnvironmentalSensor> getSensors() {
        long timestamp = System.currentTimeMillis();

        return List.of(
            create(
                "temperature-01",
                "temperature",
                23.0,
                0.5,
                "°C",
                timestamp
            ),
            create(
                "temperature-02",
                "temperature",
                24.0,
                0.5,
                "°C",
                timestamp
            ),
            create(
                "humidity-01",
                "humidity",
                48.0,
                2.0,
                "%",
                timestamp
            ),
            createWithStatus(
                "humidity-02",
                "humidity",
                52.0,
                2.0,
                "%",
                timestamp,
                "warning"
            ),
            create(
                "pressure-01",
                "pressure",
                1013.0,
                1.5,
                "hPa",
                timestamp
            ),
            createFixed(
                "pressure-02",
                "pressure",
                1011.0,
                "hPa",
                timestamp,
                "offline"
            )
        );
    }

    private EnvironmentalSensor create(
        String id,
        String type,
        double baseValue,
        double variation,
        String unit,
        long timestamp
    ) {
        return createWithStatus(
            id,
            type,
            baseValue,
            variation,
            unit,
            timestamp,
            "online"
        );
    }

    private EnvironmentalSensor createWithStatus(
        String id,
        String type,
        double baseValue,
        double variation,
        String unit,
        long timestamp,
        String status
    ) {
        double value =
            baseValue
                + (random.nextDouble() * 2 - 1) * variation;

        return new EnvironmentalSensor(
            id,
            type,
            value,
            unit,
            timestamp,
            status
        );
    }

    private EnvironmentalSensor createFixed(
        String id,
        String type,
        double value,
        String unit,
        long timestamp,
        String status
    ) {
        return new EnvironmentalSensor(
            id,
            type,
            value,
            unit,
            timestamp,
            status
        );
    }
}