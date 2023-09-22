"use client";
import PortfolioPage from "./components/portfolio-page";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default async function Page() {

  return (
      <div className="dashboard-main">
        <Sidebar currentPage={"Dashboard"} />
        <div className="dashboard-content">
          <Header currentPage={"Dashboard"} />
          <div className="dashboard-main-content">
            <PortfolioPage />
          </div>
        </div>
      </div>
  );
}

// Page.getLayout = function getLayout (page) {
//   return (
//     <div className="dashboard-main">
//       <Sidebar currentPage={"Dashboard"} />
//       <div className="dashboard-content">
//         <Header currentPage={"Dashboard"} />
//         <div className="dashboard-main-content">
//           {page}
//         </div>
//       </div>
//     </div>
//   );
// }