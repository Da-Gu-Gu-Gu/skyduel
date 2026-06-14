import { useEffect } from "react"
import { RecoilRoot } from "recoil"
import { playClickSound } from "../utils/sound/click"

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    // Play a click sound for every button press across the app.
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            if (target?.closest("button")) playClickSound()
        }
        document.addEventListener("click", handler)
        return () => document.removeEventListener("click", handler)
    }, [])

    return (
        <RecoilRoot >
            <div className="w-screen h-screen">
                {children}
            </div></RecoilRoot>
    )
}

export default GlobalProvider
