import "./RadarView.css";
import { useEffect, useState } from "react";
import RadarCompass from "./RadarCompass";
import RadarObjectCard from "./RadarObjectCard";
import type { RadarStatus, RadarSummary } from "../../types/radar";
import { useSensorContext } from "../../context/SensorContext";

function getRadarCompassDirection(degrees: number): string {
  const directions = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

interface RadarViewProps {
  onSummaryChange?: (summary: RadarSummary) => void;
}

function RadarView({ onSummaryChange }: RadarViewProps) {
  const [radarStatus, setRadarStatus] = useState<RadarStatus | null>(null);
  const {
    radarMeasurements,
    radarConnectionStatus,
  } = useSensorContext();
  const radarVisualizationActive =
    radarConnectionStatus === "connected" && radarMeasurements.length > 0;

  useEffect(() => {
    fetch("http://localhost:8080/api/radar/status")
      .then((response) => response.json())
      .then((data: RadarStatus) => setRadarStatus(data))
      .catch((error) => {
        console.error("Fehler beim Abrufen des Radar-Status:", error);
      });
  }, []);

  useEffect(() => {
    onSummaryChange?.({
      connectionStatus: radarConnectionStatus,
      measurementIntervalMs: radarStatus?.intervalMs ?? 10,
      detectedObjectCount: radarMeasurements.length,
      lastMeasurementTimestamp:
        radarMeasurements[radarMeasurements.length - 1]?.timestamp,
    });
  }, [
    onSummaryChange,
    radarConnectionStatus,
    radarMeasurements,
    radarStatus,
  ]);

  return (
    <div className="radar-container">
      {radarVisualizationActive && (
        <RadarCompass radarMeasurements={radarMeasurements} />
      )}
      {radarVisualizationActive && (
        <div className="radar-objects">
          {radarMeasurements.map((radarMeasurement) => (
            <RadarObjectCard
              key={radarMeasurement.id}
              radarMeasurement={radarMeasurement}
              getRadarCompassDirection={getRadarCompassDirection}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RadarView;