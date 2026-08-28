import type { Sensor } from "../features/sensors/types/sensor";

export const sensors: Sensor[] = [
  {
    id: "radar-01",
    name: "Radar 01",
    location: "Außenbereich",
    type: "radar",
    value: 0,
    unit: "",
    status: "online",
  },
  {
    id: "temperature-01",
    name: "Temperatursensor 01",
    location: "Halle A",
    type: "temperature",
    value: 22.4,
    unit: "°C",
    status: "online",
  },
  {
    id: "temperature-02",
    name: "Temperatursensor 02",
    location: "Halle C",
    type: "temperature",
    value: 19.7,
    unit: "°C",
    status: "offline",
  },
  {
    id: "humidity-01",
    name: "Feuchtigkeitssensor 01",
    location: "Lager",
    type: "humidity",
    value: 56,
    unit: "%",
    status: "online",
  },
  {
    id: "pressure-01",
    name: "Drucksensor 01",
    location: "Halle B",
    type: "pressure",
    value: 4.8,
    unit: "bar",
    status: "warning",
  },
];