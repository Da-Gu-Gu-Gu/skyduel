import { RecoilRoot } from "recoil"

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <RecoilRoot >
            <div className="w-screen h-screen">
                {children}
            </div></RecoilRoot>
    )
}

export default GlobalProvider