import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import DashboardPage from "./components/dashboard-page";

export default async function () {

  return (
    <div className="dashboard-main">
      <Sidebar currentPage={"Dashboard"} />
      <div className="dashboard-content">
        <Header currentPage={"Dashboard"} />
        <div className="dashboard-main-content">
          <DashboardPage />
        </div>
      </div>
    </div>
  );
};