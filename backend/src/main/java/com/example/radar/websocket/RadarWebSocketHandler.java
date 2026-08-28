package com.example.radar.websocket;

import com.example.radar.simulator.RadarMeasurement;
import com.example.radar.simulator.RadarSimulator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Component
public class RadarWebSocketHandler extends TextWebSocketHandler {

    private final RadarSimulator radarSimulator;
    private final ObjectMapper objectMapper;

    private final Set<WebSocketSession> sessions =
            ConcurrentHashMap.newKeySet();

    private final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor();

    private ScheduledFuture<?> simulationTask;

    public RadarWebSocketHandler(
            RadarSimulator radarSimulator,
            ObjectMapper objectMapper) {

        this.radarSimulator = radarSimulator;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(
            WebSocketSession session) {

        sessions.add(session);

        System.out.println(
                "Radar-Client verbunden: "
                        + session.getId()
        );

        startSimulation();
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            org.springframework.web.socket.CloseStatus status) {

        sessions.remove(session);

        System.out.println(
                "Radar-Client getrennt: "
                        + session.getId()
        );

        if (sessions.isEmpty()) {
            stopSimulation();
        }
    }

    private synchronized void startSimulation() {

        if (simulationTask != null &&
                !simulationTask.isCancelled()) {
            return;
        }

        simulationTask = scheduler.scheduleAtFixedRate(
                this::sendMeasurement,
                0,
                10,
                TimeUnit.MILLISECONDS
        );

        System.out.println("Radar-Simulation gestartet");
    }

    private synchronized void stopSimulation() {

        if (simulationTask != null) {
            simulationTask.cancel(false);
            simulationTask = null;

            System.out.println("Radar-Simulation gestoppt");
        }
    }

    private void sendMeasurement() {

        List<RadarMeasurement> measurements =
            radarSimulator.generateMeasurements();

    try {
        String json =
                objectMapper.writeValueAsString(measurements);

        for (WebSocketSession session : sessions) {

            if (session.isOpen()) {
                session.sendMessage(
                        new TextMessage(json)
                );
            }
        }

    } catch (IOException e) {

        System.err.println(
                "Fehler beim Senden: "
                        + e.getMessage()
        );
    }
}
}