

export default function Container({ children } : { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-6 sm:px-12">
            {children}
        </div>
    )
}