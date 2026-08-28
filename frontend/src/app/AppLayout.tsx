import "./AppLayout.css";
import Sidebar from "../components/layout/Sidebar";
import Workspace from "../components/layout/Workspace";

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <Workspace />
    </div>
  );
}

export default AppLayout;