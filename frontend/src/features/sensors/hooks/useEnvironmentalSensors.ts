import { useCallback, useEffect, useState } from "react";
import { getEnvironmentalSensors } from "../services/environmentalSensorApi";
import type { EnvironmentalSensor } from "../types/environmentalSensor";

interface UseEnvironmentalSensorsResult {
  sensors: EnvironmentalSensor[];
  loading: boolean;
  error: string | null;
  connectionStatus: "unknown" | "connected" | "error";
  refresh: () => Promise<void>;
}

export function useEnvironmentalSensors(
  enabled: boolean,
  requestKey?: string,
): UseEnvironmentalSensorsResult {
  const [sensors, setSensors] = useState<EnvironmentalSensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "connected" | "error"
  >("unknown");

  const loadSensors = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);

    try {
      setError(null);

      const data = await getEnvironmentalSensors();

      setSensors(data);
      setConnectionStatus("connected");
    } catch (error) {
      console.error(
        "Fehler beim Laden der Environmental Sensors:",
        error,
      );

      setError(
        "Environmental Sensors konnten nicht geladen werden.",
      );
      setConnectionStatus("error");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const initialLoadTimer = setTimeout(() => {
      loadSensors();
    }, 0);

    const interval = setInterval(() => {
      loadSensors();
    }, 5000);

    return () => {
      clearTimeout(initialLoadTimer);
      clearInterval(interval);
    };
  }, [enabled, loadSensors, requestKey]);

  return {
    sensors: enabled ? sensors : [],
    loading: enabled ? loading : false,
    error: enabled ? error : null,
    connectionStatus,
    refresh: loadSensors,
  };
}