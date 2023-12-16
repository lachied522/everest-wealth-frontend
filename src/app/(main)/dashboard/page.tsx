import NewPortfolioPopup from "./components/new-portfolio-popup";
import UserPortfolioList from "./components/user-portfolio-list";
import UserWatchlist from "./components/user-watchlist";
import FeaturedStocksServerComponent from "./components/featured-list-server-component";

export default function DashboardPage() {

  return (
    <>
        <div className="mb-8">
        <div className="flex items-center justify-between">
            <div className="text-xl font-medium text-slate-800 mb-0">
                My Portfolios
            </div>
            <NewPortfolioPopup />
        </div>
        </div>
        <UserPortfolioList />
        <UserWatchlist />
        <FeaturedStocksServerComponent />
    </>
  );
};