import type { Sensor } from "../types/sensor";
import { translateSensorType } from "./sensorTranslations";

export function getSensorSummary(sensor: Sensor): string {
  switch (sensor.type) {
    case "radar":
      return "Radar";

    default:
      return translateSensorType(sensor.type);
  }
}