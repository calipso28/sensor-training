import type { Sensor } from "../types/sensor";

export function getSensorSummary(sensor: Sensor): string {
  switch (sensor.type) {
    case "radar":
      return "Radar";

    case "temperature":
      return "Temperature";

    case "humidity":
      return "Humidity";

    case "pressure":
      return "Pressure";

    default:
      return "";
  }
}