import Background from "../../components/Background/Background";
import Button from "../../components/Buttons/Button";
import IconButton from "../../components/Buttons/IconButton";
import ColorPicker from "../../components/Modal/ColorPicker";
import { colors } from "../../utils/theme/color";
import HomeScene from "./HomeScene";
import { Cog6ToothIcon, PaintBrushIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import useContainer from "./useContainer";

const Home = () => {
    const { modalOpenState, modalStateHandler, modalClose } = useContainer()
    // const [open, setOpen] = useState(false)
    // const [categoryColors, setCategoryColors] = useState({
    //     Body: '#FFFFFF',
    //     Face: '#FFFFFF',
    //     Eye: '#FFFFFF',
    //     Ear: '#FFFFFF',
    // });
    // const [selectedPart, setSelectedPart] = useState<'Body' | 'Face' | 'Eye' | 'Ear'>('Body')

    // const handleColorClick = (color: string, selectedCategory: 'Body' | 'Face' | 'Eye' | 'Ear') => {
    //     setCategoryColors(prev => ({
    //         ...prev,
    //         [selectedCategory]: color,
    //     }));
    //     setSelectedPart(selectedCategory)
    // };
    return (
        <div className="w-full h-full relative">
            <Background />
            {modalOpenState.colorPicker && <ColorPicker setClose={modalClose} left="20px" top="35%" onSubmit={() => modalStateHandler('colorPicker')} />}
            <header className="absolute z-20 flex items-center justify-between w-full top-0 p-5">
                <h1
                    style={{ WebkitTextStroke: "0px white" }}
                    className="text-6xl text-stroke font-bold text-dark"
                >
                    <span className="text-[#ff006e]">Sky</span>Duel
                </h1>
                <h1 className="text-3xl text-pink bg-white py-2 pt-4 px-4 rounded-3xl flex items-center">Gu Gu Gr Gr</h1>
            </header>
            <div className="absolute z-20 flex w-full items-end justify-between bottom-0 right-0 p-5">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-sm text-white font-bold">v0.0.1</h1>
                    <IconButton onClick={() => modalStateHandler('colorPicker')} icon={<PaintBrushIcon className="h-10 w-10 text-white hover:text-pink" />} />
                    <IconButton icon={<QuestionMarkCircleIcon className="h-10 w-10 text-white hover:text-pink" />} />
                    <IconButton icon={<Cog6ToothIcon className="h-10 w-10 text-white hover:text-pink" />} />
                </div>
                <div className=" flex flex-col items-end gap-2 ">
                    <Button
                        label="Join Lobby"
                        textColor={colors.purple}
                        bgColor={colors.white}
                        loading={false}
                    />
                    <Button
                        label="Create Lobby"
                        textColor={colors.pink}
                        bgColor={colors.white}
                        loading={false}
                    />
                </div>
            </div>
            <div className="z-10 absolute top-0">
                <HomeScene />
            </div>
        </div>
    );
};

export default Home;
