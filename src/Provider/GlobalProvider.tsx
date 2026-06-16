import { useEffect, useRef } from "react"
import { RecoilRoot, useRecoilValue } from "recoil"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { playClickSound } from "../utils/sound/click"
import { soundEnabledState } from "../pages/Home/store/home.store"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""

// Plays a click sound for every button press across the app — unless sound is
// muted in Settings. Lives inside RecoilRoot so it can read the sound setting;
// a ref keeps the document listener reading the latest value without rebinding.
const ClickSound = () => {
    const soundEnabled = useRecoilValue(soundEnabledState)
    const enabledRef = useRef(soundEnabled)
    enabledRef.current = soundEnabled

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null
            if (enabledRef.current && target?.closest("button")) playClickSound()
        }
        document.addEventListener("click", handler)
        return () => document.removeEventListener("click", handler)
    }, [])

    return null
}

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <RecoilRoot >
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <ClickSound />
                <div className="w-screen h-screen">
                    {children}
                </div>
            </GoogleOAuthProvider>
        </RecoilRoot>
    )
}

export default GlobalProvider
