import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { sensors } from "../../../data/sensors";
import { useEnvironmentalSensors } from "../hooks/useEnvironmentalSensors";
import { useRadarWebSocket } from "../hooks/useRadarWebSocket";

import type { EnvironmentalSensor } from "../types/environmentalSensor";
import type { RadarMeasurement, RadarStatus } from "../types/radar";
import type { Sensor } from "../types/sensor";

interface SensorContextValue {
  sensors: Sensor[];
  selectedSensor: Sensor | undefined;
  selectedSensorId: string | null;
  selectSensor: (sensorId: string) => void;

  environmentalSensors: EnvironmentalSensor[];
  environmentalLoading: boolean;
  environmentalError: string | null;
  environmentalConnectionStatus: "unknown" | "connected" | "error";

  radarMeasurements: RadarMeasurement[];
  radarConnectionStatus: "connecting" | "connected" | "disconnected" | "error";
  radarStatus: RadarStatus | null;
}

const createEnvironmentalSensorDisplay = (
  sensor: EnvironmentalSensor,
): Sensor => ({
  id: sensor.id,
  name:
    sensor.id
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || sensor.type,
  location: "Umgebung",
  type: sensor.type,
  value: sensor.value,
  unit: sensor.unit,
  status: sensor.status,
});

const SensorContext = createContext<SensorContextValue | undefined>(undefined);

interface SensorProviderProps {
  children: ReactNode;
}

export function SensorProvider({ children }: SensorProviderProps) {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [radarStatus, setRadarStatus] = useState<RadarStatus | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRadarStatus = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/radar/status");

        if (!response.ok) {
          throw new Error("Radar-Status konnte nicht geladen werden.");
        }

        const data: RadarStatus = await response.json();

        if (isMounted) {
          setRadarStatus(data);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Radar-Status:", error);

        if (isMounted) {
          setRadarStatus(null);
        }
      }
    };

    loadRadarStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const environmentalEnabled = true;
  const environmentalRequestKey = selectedSensorId ?? undefined;

  const {
    sensors: environmentalSensors,
    loading: environmentalLoading,
    error: environmentalError,
    connectionStatus: environmentalConnectionStatus,
  } = useEnvironmentalSensors(
    environmentalEnabled,
    environmentalRequestKey,
  );

  const selectedStaticSensor = sensors.find(
    (sensor) => sensor.id === selectedSensorId,
  );

  const selectedEnvironmentalSensor = environmentalSensors.find(
    (sensor) => sensor.id === selectedSensorId,
  );

  const selectedSensor =
    selectedStaticSensor ??
    (selectedEnvironmentalSensor
      ? createEnvironmentalSensorDisplay(selectedEnvironmentalSensor)
      : undefined);

  const { radarMeasurements, radarConnectionStatus } = useRadarWebSocket();

  return (
    <SensorContext.Provider
      value={{
        sensors,
        selectedSensor,
        selectedSensorId,
        selectSensor: setSelectedSensorId,

        environmentalSensors,
        environmentalLoading,
        environmentalError,
        environmentalConnectionStatus,

        radarMeasurements,
        radarConnectionStatus,
        radarStatus,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSensorContext() {
  const context = useContext(SensorContext);

  if (!context) {
    throw new Error("useSensorContext must be used within SensorProvider");
  }

  return context;
}
