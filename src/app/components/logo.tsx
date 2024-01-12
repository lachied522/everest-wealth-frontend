import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    width?: number
    height?: number
    withText?: boolean
}

export default function Logo({ width, height, withText }: LogoProps) {
    const w = width || 48;
    const h = height || 48;

    return (
        <Link
            href="/"
            className="flex items-center justify-center gap-3 no-underline"
        >
            <Image
                src="/palladian.svg"
                alt="Palladian Logo"
                width={w}
                height={h}
                className="transform transition duration-300 relative hover:scale-105"
            />
            {withText && <h2 className="text-slate-700 font-serif mb-0">Palladian</h2>}
        </Link>
    )
}