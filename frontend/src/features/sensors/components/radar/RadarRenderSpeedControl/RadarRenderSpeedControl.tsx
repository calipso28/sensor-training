import "./RadarRenderSpeedControl.css";

import {
  useRadarRenderSpeed,
  type RadarRenderSpeed,
} from "../../../context/RadarRenderSpeedContext";

const renderSpeedOptions: Array<{
  value: RadarRenderSpeed;
  label: string;
}> = [
  { value: "slow", label: "Langsam" },
  { value: "normal", label: "Normal" },
  { value: "fast", label: "Schnell" },
];

function RadarRenderSpeedControl() {
  const { renderSpeed, setRenderSpeed } = useRadarRenderSpeed();

  return (
    <section>
    <div className="radar-render-speed-control" aria-labelledby="radar-render-speed-title">
      <h2 id="radar-render-speed-title">Rendergeschwindigkeit</h2>
      <div className="radar-render-speed-control__options" role="group" aria-label="Rendergeschwindigkeit auswählen">
        {renderSpeedOptions.map((option) => (
          <button
            key={option.value}
            className={renderSpeed === option.value ? "selected" : ""}
            type="button"
            aria-pressed={renderSpeed === option.value}
            onClick={() => setRenderSpeed(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
    </section>
  );
}

export default RadarRenderSpeedControl;