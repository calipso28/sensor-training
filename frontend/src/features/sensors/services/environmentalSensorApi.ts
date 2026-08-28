import type {
  EnvironmentalSensor,
} from "../types/environmentalSensor";

const API_URL =
  "http://localhost:8080/api/environmental-sensors";

export async function getEnvironmentalSensors(): Promise<
  EnvironmentalSensor[]
> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      "Environmental Sensors konnten nicht geladen werden.",
    );
  }

  return response.json();
}