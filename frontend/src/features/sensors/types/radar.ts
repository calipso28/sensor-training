export interface RadarMeasurement {
  id: string;
  timestamp: number;
  distance: number;
  direction: number;
  height: number;
  speed: number;
}

export interface RadarStatus {
  status: string;
  radar: string;
  intervalMs: number;
}

export interface RadarSummary {
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  measurementIntervalMs?: number;
  detectedObjectCount: number;
  lastMeasurementTimestamp?: number;
}