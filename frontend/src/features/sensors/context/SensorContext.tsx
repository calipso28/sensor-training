import { createContext, useContext, useState, type ReactNode } from "react";

import { sensors } from "../../../data/sensors";
import { useEnvironmentalSensors } from "../hooks/useEnvironmentalSensors";
import { useRadarWebSocket } from "../hooks/useRadarWebSocket";

import type { EnvironmentalSensor } from "../types/environmentalSensor";
import type { RadarMeasurement } from "../types/radar";
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
}

const SensorContext = createContext<SensorContextValue | undefined>(undefined);

interface SensorProviderProps {
  children: ReactNode;
}

export function SensorProvider({ children }: SensorProviderProps) {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const selectedSensor = sensors.find(
    (sensor) => sensor.id === selectedSensorId,
  );

  const environmentalEnabled =
    selectedSensor?.type !== undefined && selectedSensor.type !== "radar";
  const environmentalRequestKey = environmentalEnabled
    ? selectedSensor?.id
    : undefined;

  const {
    sensors: environmentalSensors,
    loading: environmentalLoading,
    error: environmentalError,
    connectionStatus: environmentalConnectionStatus,
  } = useEnvironmentalSensors(
    environmentalEnabled,
    environmentalRequestKey,
  );

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
