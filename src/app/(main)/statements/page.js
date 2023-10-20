import StatementsPage from "./components/statements-page";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default async function () {
        
    return (
        <div className="dashboard-main">
            <Sidebar currentPage={"Statements"} />
            <div className="dashboard-content">
                <Header currentPage={"Statements"} />
                <div className="dashboard-main-content">
                    <StatementsPage />
                </div>
            </div>
        </div>
    );
}
