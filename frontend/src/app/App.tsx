import AppLayout from "./AppLayout";
import { SensorProvider } from "../features/sensors/context/SensorContext";
import { RadarRenderSpeedProvider } from "../features/sensors/context/RadarRenderSpeedContext";

function App() {
  return (
    <RadarRenderSpeedProvider>
      <SensorProvider>
        <AppLayout />
      </SensorProvider>
    </RadarRenderSpeedProvider>
  );
}

export default App;
