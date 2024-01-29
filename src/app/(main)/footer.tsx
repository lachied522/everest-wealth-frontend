

export default function Footer() {
    return (
        <div className="z-10 w-full flex items-center justify-center bg-blue-500/80 p-16 border-t border-blue-800/30 mt-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="text-white text-xl font-serif font-semibold mb-0">Everest Wealth</h3>
            <p className="text-white text-sm">created by Lachie Duncan</p>
            <p className="max-w-[50%] text-white text-xs text-center">Everest Wealth is in Beta. Any advice provided is for demonstration purposes only, and not intended as formal investment advice.</p>
          </div>
        </div>
    )
}