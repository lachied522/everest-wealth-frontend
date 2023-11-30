import { notFound } from "next/navigation";

import { fetchSymbol } from "src/app/lib/redis";

import SymbolPage from "./components/symbol-page";

export default async function Page({ params }) {
    const data = await fetchSymbol(params.symbol);

    if (!data.hasOwnProperty('symbol')) {
        return (
            <div className="text-slate-700">Symbol not found</div>
        )
    }
    // NOTE: data must be converted to JSON before passing to client
    return (
        <SymbolPage jsonData={JSON.stringify(data)} />
    )
}