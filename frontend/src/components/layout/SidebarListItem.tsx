import type { Sensor } from "../../features/sensors/types/sensor";
import "./SidebarListItem.css";

interface SidebarListItemProps {
  sensor: Sensor;
  summary?: string;
  isSelected: boolean;
  radarConnectionStatus?: "connecting" | "connected" | "disconnected" | "error";
  environmentalLoading?: boolean;
  environmentalError?: string | null;
  environmentalConnectionStatus?: "unknown" | "connected" | "error";
  onSelect: (sensorId: string) => void;
}

function SidebarListItem({
  sensor,
  summary,
  isSelected,
  radarConnectionStatus,
  environmentalLoading,
  environmentalError,
  environmentalConnectionStatus = "unknown",
  onSelect,
}: SidebarListItemProps) {
  const connectionAvailable = sensor.type === "radar"
    ? radarConnectionStatus === "connected"
    : environmentalConnectionStatus === "connected" &&
      !environmentalLoading &&
      !environmentalError;

  return (
    <button
      type="button"
      className={`sidebar-list-item ${
        isSelected ? "selected" : ""
      }`}
      onClick={() => onSelect(sensor.id)}
    >
      <div className="sidebar-list-item__header">
        <span className="sidebar-list-item__name">{sensor.name}</span>

      </div>

      <div className="sidebar-list-item__status">
        <span
          className={`sensor-status ${connectionAvailable ? sensor.status : "disconnected"}`}
        >
          ●
        </span>
        {connectionAvailable ? sensor.status : "N/A"}
        {summary && ` · ${summary}`}
      </div>
    </button>
  );
}

export default SidebarListItem;