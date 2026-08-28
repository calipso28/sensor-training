import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const radarRenderSpeeds = {
  slow: 2000,
  normal: 500,
  fast: 30,
} as const;

export type RadarRenderSpeed = keyof typeof radarRenderSpeeds;

interface RadarRenderSpeedContextValue {
  renderSpeed: RadarRenderSpeed;
  renderIntervalMs: number;
  setRenderSpeed: (renderSpeed: RadarRenderSpeed) => void;
}

const RadarRenderSpeedContext = createContext<
  RadarRenderSpeedContextValue | undefined
>(undefined);

interface RadarRenderSpeedProviderProps {
  children: ReactNode;
}

export function RadarRenderSpeedProvider({
  children,
}: RadarRenderSpeedProviderProps) {
  const [renderSpeed, setRenderSpeed] = useState<RadarRenderSpeed>("normal");

  return (
    <RadarRenderSpeedContext.Provider
      value={{
        renderSpeed,
        renderIntervalMs: radarRenderSpeeds[renderSpeed],
        setRenderSpeed,
      }}
    >
      {children}
    </RadarRenderSpeedContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRadarRenderSpeed() {
  const context = useContext(RadarRenderSpeedContext);

  if (!context) {
    throw new Error(
      "useRadarRenderSpeed must be used within RadarRenderSpeedProvider",
    );
  }

  return context;
}