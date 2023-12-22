import UserPortfolioList from "./components/user-portfolio-list";
import UserWatchlist from "./components/user-watchlist";
import FeaturedStocksServerComponent from "./components/featured-list-server-component";

export default function DashboardPage() {

  return (
    <>
      <h2 className="mb-8">
          Welcome Name
      </h2>
      <div className="flex flex-col gap-6">
        <UserPortfolioList />
        <UserWatchlist />
        <FeaturedStocksServerComponent />
      </div>
    </>
  );
};