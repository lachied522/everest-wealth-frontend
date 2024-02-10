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
                src="/everest-logo-transparent-background.png"
                alt="Pocket Adviser Logo"
                width={w}
                height={h}
                className="transform transition duration-300 relative"
            />
            {withText && (
                <h2>
                    <span className="text-slate-700 text-2xl font-serif font-semibold mb-0">Pocket Adviser </span>
                    <span>Demo</span>
                </h2>
            )}
        </Link>
    )
}