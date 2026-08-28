export type SensorType =
  | "radar"
  | "temperature"
  | "humidity"
  | "pressure";

export type SensorStatus =
  | "online"
  | "offline"
  | "warning";

export interface Sensor {
  id: string;
  name: string;
  location: string;
  type: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
}