import { useEffect, useRef, useState } from "react";
import { useRadarRenderSpeed } from "../context/RadarRenderSpeedContext";
import type { RadarMeasurement } from "../types/radar";

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export function useRadarWebSocket() {
  const { renderIntervalMs } = useRadarRenderSpeed();
  const [radarMeasurements, setRadarMeasurements] =
    useState<RadarMeasurement[]>([]);

  const [radarConnectionStatus, setRadarConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const latestMeasurements = useRef<RadarMeasurement[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;

      if (socketRef.current) {
        socketRef.current = null;
      }

      setRadarConnectionStatus("connecting");

      const socket = new WebSocket(
        "ws://localhost:8080/ws/radar",
      );

      socketRef.current = socket;

      socket.onopen = () => {
        if (isUnmounted) {
          socket.close();
          return;
        }

        setRadarConnectionStatus("connected");
      };

      socket.onmessage = (event) => {
        try {
          const data: RadarMeasurement[] =
            JSON.parse(event.data);

          latestMeasurements.current = data;

        } catch (error) {
          console.error(
            "Fehler beim Verarbeiten der Radar-Daten:",
            error,
          );

          setRadarConnectionStatus("error");
        }
      };

      socket.onerror = (error) => {
        console.error(
          "Radar WebSocket Fehler:",
          error,
        );

        setRadarConnectionStatus("error");
      };

      socket.onclose = () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }

        if (isUnmounted) return;

        setRadarConnectionStatus("disconnected");

        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
        }

        reconnectTimer.current = setTimeout(
          connect,
          2000,
        );
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const renderInterval = setInterval(() => {
      if (latestMeasurements.current.length > 0) {
        setRadarMeasurements(latestMeasurements.current);
      }
    }, renderIntervalMs);

    return () => clearInterval(renderInterval);
  }, [renderIntervalMs]);

  return {
    radarMeasurements,
    radarConnectionStatus,
  };
}