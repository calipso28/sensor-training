import type { RadarMeasurement } from "../../types/radar";

interface RadarObjectCardProps {
  radarMeasurement: RadarMeasurement;
  getRadarCompassDirection: (degrees: number) => string;
}

function RadarObjectCard({
  radarMeasurement,
  getRadarCompassDirection,
}: RadarObjectCardProps) {
  return (
    <div className="radar-object-card">
      <div className="radar-section">
        <h4>Name</h4>
        <p className="radar-value">{radarMeasurement.id}</p>
      </div>
      <div className="radar-section">
        <h4>Position</h4>
        <p className="radar-value">
          Richtung: {radarMeasurement.direction.toFixed(1)}° {getRadarCompassDirection(radarMeasurement.direction)}
        </p>
        <p className="radar-value">Höhe: {radarMeasurement.height.toFixed(1)} m</p>
      </div>
      <div className="radar-section">
        <h4>Geschwindigkeit</h4>
        <p className="radar-value">{radarMeasurement.speed.toFixed(1)} m/s</p>
      </div>
      <div className="radar-section">
        <h4>Distanz</h4>
        <p className="radar-value">{radarMeasurement.distance.toFixed(1)} m</p>
      </div>
      <div className="radar-section">
        <h4>Zeitstempel</h4>
        <p className="radar-value">
          {new Date(radarMeasurement.timestamp).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3,
          })}
        </p>
      </div>
    </div>
  );
}

export default RadarObjectCard;