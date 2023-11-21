import SymbolPage from "./components/symbol-page"

export default function Page({ params }) {

    return (
        <SymbolPage symbol={params.symbol} />
    )
}