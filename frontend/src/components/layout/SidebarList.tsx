import { useSensorContext } from "../../features/sensors/context/SensorContext";
import { getSensorSummary } from "../../features/sensors/utils/getSensorSummary";
import "./SidebarList.css";
import SidebarListItem from "./SidebarListItem";
function SidebarList() {
  const {
    sensors,
    selectedSensorId,
    selectSensor,
    environmentalSensors,
    environmentalLoading,
    environmentalError,
    environmentalConnectionStatus,
    radarConnectionStatus,
  } = useSensorContext();

  const getEnvironmentalSummary = (sensorId: string) => {
    const measurement = environmentalSensors.find(
      (environmentalSensor) => environmentalSensor.id === sensorId,
    );

    if (!measurement) {
      return undefined;
    }

    const value = Math.round(measurement.value).toString();

    return `${value} ${measurement.unit}`;
  };
  const radarSensors = sensors.filter(
    (sensor) => sensor.type === "radar",
  );

  const environmentalSensorMetadata = sensors.filter(
    (sensor) =>
      sensor.type === "temperature" ||
      sensor.type === "humidity" ||
      sensor.type === "pressure",
  );

  return (
    <div className="sidebar-list">
      <h2 className="sidebar-list__title">Sensors</h2>

      <section>
        <h3 className="sidebar-list__group-title">Radar</h3>

        {radarSensors.map((sensor) => (
          <SidebarListItem
            key={sensor.id}
            sensor={sensor}
            radarConnectionStatus={radarConnectionStatus}
            summary={getSensorSummary(sensor)}
            isSelected={sensor.id === selectedSensorId}
            onSelect={selectSensor}
          />
        ))}
      </section>

      <section>
        <h3 className="sidebar-list__group-title">Umweltsensoren</h3>

        {environmentalSensorMetadata.map((sensor) => (
          <SidebarListItem
            key={sensor.id}
            sensor={sensor}
            environmentalLoading={environmentalLoading}
            environmentalError={environmentalError}
            environmentalConnectionStatus={environmentalConnectionStatus}
            summary={getEnvironmentalSummary(sensor.id)}
            isSelected={sensor.id === selectedSensorId}
            onSelect={selectSensor}
          />
        ))}
      </section>
    </div>
  );
}

export default SidebarList;