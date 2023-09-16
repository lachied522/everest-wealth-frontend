import Sidebar from "../components/sidebar";
import Header from "../components/header";

export default function StandardLayout({ children }) {
  return (
    <div className="dashboard-main">
      <Sidebar currentPage={"Dashboard"} />
      <div className="sidebar-spacer" />
      <div className="dashboard-content">
        <Header currentPage={"Dashboard"} />
        <div className="dashboard-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}
