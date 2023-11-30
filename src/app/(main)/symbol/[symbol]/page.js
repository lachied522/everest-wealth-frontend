import { fetchSymbol } from "src/app/lib/redis";

import SymbolPage from "./components/symbol-page";

export default async function Page({ params }) {

    const data = await fetchSymbol(params.symbol);
    // NOTE: data must be converted to JSON before passing to client
    return (
        <SymbolPage jsonData={JSON.stringify(data)} />
    )
}