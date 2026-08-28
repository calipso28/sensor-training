export type EnvironmentalSensorType =
  | "temperature"
  | "humidity"
  | "pressure";

export interface EnvironmentalMeasurement {
  sensorId: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface EnvironmentalSensor {
  id: string;
  type: EnvironmentalSensorType;
  value: number;
  unit: string;
  timestamp: number;
  status: "online" | "offline" | "warning";
}