import "./SensorDetailBar.css";
import type { Sensor, SensorType } from "../../types/sensor";

interface SensorDetailBarProps {
  sensor: Sensor | undefined;
  radarConnectionStatus?: "connecting" | "connected" | "disconnected" | "error";
  environmentalLoading?: boolean;
  environmentalError?: string | null;
  environmentalConnectionStatus?: "unknown" | "connected" | "error";
  measurementIntervalMs?: number;
  detectedObjectCount?: number;
  lastMeasurementTimestamp?: number;
}

const connectionStatusLabels = {
  connecting: "Verbinde...",
  connected: "Verbunden",
  disconnected: "Getrennt",
  error: "Fehler",
} as const;

const sensorTypeLabels: Record<SensorType, string> = {
  radar: "Radar",
  temperature: "Temperatur",
  humidity: "Feuchtigkeit",
  pressure: "Druck",
};

function SensorDetailBar({
  sensor,
  radarConnectionStatus,
  environmentalLoading = false,
  environmentalError = null,
  environmentalConnectionStatus = "unknown",
  measurementIntervalMs,
  detectedObjectCount,
  lastMeasurementTimestamp,
}: SensorDetailBarProps) {
  if (!sensor) {
    return null;
  }

  const connectionAvailable = sensor.type === "radar"
    ? radarConnectionStatus === "connected"
    : environmentalConnectionStatus === "connected" &&
      !environmentalLoading &&
      !environmentalError;

  return (
    <section className="sensor-detail-bar">
      <div className="sensor-detail-bar__info">
        <h2 className="sensor-detail-bar__name">{sensor.name}</h2>
      </div>
      <dl>
        <div>
          <dt>Typ</dt>
          <dd>{sensorTypeLabels[sensor.type]}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <span className={`sensor-status ${connectionAvailable ? sensor.status : "disconnected"}`}>●</span>{" "}
            {connectionAvailable ? sensor.status : "N/A"}
          </dd>
        </div>
        {radarConnectionStatus && (
          <div>
            <dt>Verbindung</dt>
            <dd>{connectionStatusLabels[radarConnectionStatus]}</dd>
          </div>
        )}
        {measurementIntervalMs !== undefined && (
          <div>
            <dt>Messrate</dt>
            <dd>{measurementIntervalMs} ms</dd>
          </div>
        )}
        {detectedObjectCount !== undefined && (
          <div>
            <dt>Erkannte Objekte</dt>
            <dd>{detectedObjectCount}</dd>
          </div>
        )}
        {lastMeasurementTimestamp !== undefined && (
          <div>
            <dt>Letzte Messung</dt>
            <dd>
              {new Date(lastMeasurementTimestamp).toLocaleTimeString("de-DE")}
            </dd>
          </div>
        )}
        {!radarConnectionStatus &&
          measurementIntervalMs === undefined &&
          detectedObjectCount === undefined &&
          lastMeasurementTimestamp === undefined && (
            <>
              <div>
                <dt>Standort</dt>
                <dd>{sensor.location}</dd>
              </div>
              <div>
                <dt>Messwert</dt>
                <dd>
                  {sensor.value} {sensor.unit}
                </dd>
              </div>
            </>
          )}
      </dl>
    </section>
  );
}

export default SensorDetailBar;
