import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import ProfilePage from "./components/profile-page";

export default async function () {

  return (
    <div className="dashboard-main">
      <Sidebar currentPage={"Profile"} />
      <div className="dashboard-content">
        <Header currentPage={"Profile"} />
        <div className="dashboard-main-content">
          <ProfilePage />
        </div>
      </div>
    </div>
  );
};