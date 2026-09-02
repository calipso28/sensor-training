const sensorTypeTranslations: Record<string, string> = {
  temperature: "Temperatur",
  humidity: "Luftfeuchtigkeit",
  pressure: "Luftdruck",
};

const sensorNameTranslations: Record<string, string> = {
  "Temperature 01": "Temperatur 01",
  "Temperature 02": "Temperatur 02",
  "Humidity 01": "Luftfeuchtigkeit 01",
  "Humidity 02": "Luftfeuchtigkeit 02",
  "Pressure 01": "Luftdruck 01",
  "Pressure 02": "Luftdruck 02",
};

export function translateSensorType(type: string): string {
  return sensorTypeTranslations[type] ?? type;
}

export function translateSensorName(name: string): string {
  return sensorNameTranslations[name] ?? name;
}
