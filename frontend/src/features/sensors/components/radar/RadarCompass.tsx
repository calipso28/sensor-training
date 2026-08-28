import type { RadarMeasurement } from "../../types/radar";

interface RadarCompassProps {
  radarMeasurements: RadarMeasurement[];
}

const warningRadius = 30;

function RadarCompass({ radarMeasurements }: RadarCompassProps) {
  const hasWarning = radarMeasurements.some(
    (radarMeasurement) => radarMeasurement.distance <= warningRadius,
  );
  const measurementsWithWarning = radarMeasurements.map(
    (radarMeasurement) => ({
      radarMeasurement,
      isWarning: radarMeasurement.distance <= warningRadius,
    }),
  );
  const warningDiameter = (warningRadius / 100) * 90;

  return (
    <div className="radar-compass-container">
      <h3>Radar Übersicht</h3>
      <div className="radar-compass">
        <span className="radar-compass-label radar-compass-north">N</span>
        <span className="radar-compass-label radar-compass-east">O</span>
        <span className="radar-compass-label radar-compass-south">S</span>
        <span className="radar-compass-label radar-compass-west">W</span>
        <div className="radar-compass-center">+</div>
        <div
          className={`radar-warning-zone${hasWarning ? " warning" : ""}`}
          style={{
            width: `${warningDiameter}%`,
            height: `${warningDiameter}%`,
          }}
        />
        {measurementsWithWarning.map(({ radarMeasurement, isWarning }) => {
          const angle = (radarMeasurement.direction * Math.PI) / 180;
          const radius = (Math.min(radarMeasurement.distance, 100) / 100) * 45;
          const x = Math.sin(angle) * radius;
          const y = -Math.cos(angle) * radius;
          return (
            <div
              key={radarMeasurement.id}
              className={`radar-compass-object${isWarning ? " warning" : ""}`}
              style={{
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
              }}
              title={`${radarMeasurement.id} – ${radarMeasurement.distance.toFixed(1)} m`}
            >
              ●
            </div>
          );
        })}
      </div>
      <div className="radar-compass-legend">
        {measurementsWithWarning.map(({ radarMeasurement, isWarning }) => (
          <div
            key={radarMeasurement.id}
            className={`radar-compass-legend-item${isWarning ? " warning" : ""}`}
          >
            <span>●</span>
            <span>{radarMeasurement.id}</span>
            <span>{radarMeasurement.distance.toFixed(1)} m</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadarCompass;