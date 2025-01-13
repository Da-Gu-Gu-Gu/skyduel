import Sparkle from "./Sparkle"
interface BackgroundProps {
    isHome?: boolean
}
const Background = ({ isHome = true }: BackgroundProps): JSX.Element => {
    return (
        <div
            style={{
                "--from-color": "#FAF0CA",
                "--to-color": "#90E0EF",
            } as React.CSSProperties}
            className="h-full w-full flex items-center justify-center  bg-[linear-gradient(45deg,var(--from-color)30%,var(--to-color)100%)]"
        >
            {isHome && <Sparkle />}
        </div>
    )
}

export default Background