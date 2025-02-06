import { Cog6ToothIcon, FaceSmileIcon, PaintBrushIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import Background from "../components/Background/Background"
import IconButton from "../components/Buttons/IconButton"
import Header from "../components/Header/Header"
import Line from "../components/Line/Line"
import useContainer from "../pages/Home/useContainer"
import HomeScene from "../pages/Home/HomeScene"
import ColorPicker from "../components/Modal/ColorPicker"
import CreateLobbyModal from "../components/Modal/CreateLobby"
import JoinLobbyModal from "../components/Modal/JoinLobby"

interface MainLayoutProps {
    inLobby?: boolean
    children: React.ReactNode
}

const MainLayout = ({ inLobby = false, children }: MainLayoutProps) => {
    const { modalOpenState, modalStateHandler, modalClose } = useContainer()

    return (
        <div className="w-full h-full relative"> <Background />
            <Header />
            {modalOpenState.colorPicker && <ColorPicker setClose={modalClose} left="20px" top="35%" onSubmit={() => modalStateHandler('colorPicker')} />}
            {modalOpenState.createLobby && <CreateLobbyModal setClose={modalClose} isCenter left="50%" top="50%" onSubmit={() => modalStateHandler('createLobby')} label="Create" />}
            {modalOpenState.joinLobby && <JoinLobbyModal setClose={modalClose} isCenter left="50%" top="50%" onSubmit={() => modalStateHandler('joinLobby')} label="Join" />}

            {inLobby && <Line />}
            {children}
            <div className="absolute z-20 flex w-max items-end justify-between bottom-0 left-0 p-5">
                <div className="flex flex-col items-start gap-3">
                    <h1 className="text-sm text-white font-bold">v0.0.1</h1>
                    <IconButton onClick={() => modalStateHandler('colorPicker')} icon={<PaintBrushIcon className="h-10 w-10 text-white hover:text-pink" />} />
                    <IconButton icon={<QuestionMarkCircleIcon className="h-10 w-10 text-white hover:text-pink" />} />
                    <div className="flex gap-3">
                        <IconButton icon={<Cog6ToothIcon className="h-10 w-10 text-white hover:text-pink" />} />
                        {inLobby && <IconButton onClick={() => modalStateHandler('emote')} icon={<FaceSmileIcon className="h-10 w-10 text-white hover:text-purple" />} />}
                    </div>
                </div>
            </div>
            <div className="z-10 absolute top-0">
                <HomeScene inLobby={inLobby} />
            </div>
        </div >
    )
}

export default MainLayout