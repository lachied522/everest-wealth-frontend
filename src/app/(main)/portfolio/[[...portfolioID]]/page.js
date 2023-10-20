import PortfolioPage from "./components/portfolio-page";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default async function Page({ params }) {

  return (
      // <div className="dashboard-main">
      //   <Sidebar currentPage={"Portfolio"} />
      //   <div className="dashboard-content">
      //     <Header currentPage={"Portfolio"} />
      //     <div className="dashboard-main-content">
      //       <PortfolioPage />
      //     </div>
      //   </div>
      // </div>
      <PortfolioPage />
  );
}