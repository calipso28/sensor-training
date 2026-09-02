import "./Workspace.css";
import { useCallback, useState } from "react";

import RadarView from "../../features/sensors/components/radar/RadarView";
import RadarRenderSpeedControl from "../../features/sensors/components/radar/RadarRenderSpeedControl/RadarRenderSpeedControl";
import SensorDetailBar from "../../features/sensors/components//overview/SensorDetailBar";
import EnvSensorObjectCard from "../../features/sensors/components/environmental/EnvSensorObjectCard";

import { useSensorContext } from "../../features/sensors/context/SensorContext";

import type { RadarSummary } from "../../features/sensors/types/radar";

function Workspace() {
  const {
    selectedSensor,
    environmentalSensors,
    environmentalLoading,
    environmentalError,
    environmentalConnectionStatus,
    radarMeasurements,
    radarConnectionStatus,
  } = useSensorContext();

  const [radarSummary, setRadarSummary] =
    useState<RadarSummary>();

  const handleRadarSummaryChange = useCallback(
    (summary: RadarSummary) => {
      setRadarSummary((currentSummary) => {
        if (
          currentSummary?.connectionStatus ===
            summary.connectionStatus &&
          currentSummary?.measurementIntervalMs ===
            summary.measurementIntervalMs &&
          currentSummary?.detectedObjectCount ===
            summary.detectedObjectCount &&
          currentSummary?.lastMeasurementTimestamp ===
            summary.lastMeasurementTimestamp
        ) {
          return currentSummary;
        }

        return summary;
      });
    },
    [],
  );

  const selectedEnvironmentalSensor =
    environmentalSensors.find(
      (sensor) => sensor.id === selectedSensor?.id,
    );

  const radarVisualizationActive =
    selectedSensor?.type === "radar" &&
    radarConnectionStatus === "connected" &&
    radarMeasurements.length > 0;

  return (
    <main className="app-workspace">
      {!selectedSensor && (
        <p>Sensor auswählen</p>
      )}

      {selectedSensor?.type === "radar" && (
        <>
          <SensorDetailBar
            sensor={selectedSensor}
            radarConnectionStatus={radarConnectionStatus}
            measurementIntervalMs={
              radarSummary?.measurementIntervalMs
            }
            detectedObjectCount={
              radarSummary?.detectedObjectCount
            }
            lastMeasurementTimestamp={
              radarSummary?.lastMeasurementTimestamp
            }
          />

          {radarVisualizationActive && <RadarRenderSpeedControl />}

          <RadarView
            onSummaryChange={handleRadarSummaryChange}
          />
        </>
      )}

      {selectedSensor &&
        selectedSensor.type !== "radar" && (
          <>
            <SensorDetailBar
              sensor={selectedSensor}
              measurement={selectedEnvironmentalSensor}
              environmentalLoading={environmentalLoading}
              environmentalError={environmentalError}
              environmentalConnectionStatus={environmentalConnectionStatus}
            />

            {environmentalLoading && (
              <p>
                Environmental Sensor wird geladen...
              </p>
            )}

            {environmentalError && (
              <p>{environmentalError}</p>
            )}

            {!environmentalLoading &&
              !environmentalError &&
              selectedEnvironmentalSensor && (
                <EnvSensorObjectCard
                  sensor={selectedSensor}
                  measurement={{
                    sensorId: selectedEnvironmentalSensor.id,
                    value: selectedEnvironmentalSensor.value,
                    unit: selectedEnvironmentalSensor.unit,
                    timestamp: selectedEnvironmentalSensor.timestamp,
                  }}
                />
              )}
          </>
        )}
    </main>
  );
}

export default Workspace;