import type { Sensor } from "../../types/sensor";
import type { EnvironmentalMeasurement } from "../../types/environmentalSensor";
import "./EnvSensorObjectCard.css";

interface EnvSensorObjectCardProps {
  sensor: Sensor;
  measurement: EnvironmentalMeasurement;
}

function EnvSensorObjectCard({
  sensor,
  measurement,
}: EnvSensorObjectCardProps) {
  return (
    <section className="env-sensor-object-card">
      <header className="env-sensor-object-card__header">
        <h2>{sensor.name}</h2>
      </header>

      <div className="env-sensor-object-card__value">
        <span className="env-sensor-object-card__number">
          {Math.round(measurement.value)}
        </span>
        <span className="env-sensor-object-card__unit">
          {measurement.unit}
        </span>
      </div>

      <p className="env-sensor-object-card__timestamp">
        Zuletzt aktualisiert: {" "}
        {new Date(measurement.timestamp).toLocaleTimeString("de-DE")}
      </p>
    </section>
  );
}

export default EnvSensorObjectCard;