import { PortfolioProvider } from "./context/PortfolioState";
import PortfolioPage from "./components/portfolio-page";

export default async function Page({ params }) {
  
  return (
      <PortfolioProvider>
        <PortfolioPage />
      </PortfolioProvider>
  );
}