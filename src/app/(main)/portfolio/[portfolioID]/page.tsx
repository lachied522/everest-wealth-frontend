import { PortfolioProvider } from "./context/PortfolioState";
import PortfolioPage from "./components/portfolio-page";

export default async function Page() {
  
  return (
      <PortfolioProvider>
        <PortfolioPage />
      </PortfolioProvider>
  );
}