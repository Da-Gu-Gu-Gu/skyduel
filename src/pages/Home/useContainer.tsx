import { useRecoilState } from 'recoil'
import { BodyPart, bodyPartColors, bodyPart, homeModalOpenState, ModalOpenState } from './store/home.store'


const useContainer = () => {
    const [bodyPartColor, setBodyPartColor] = useRecoilState(bodyPartColors)
    const [selectedPart, setSelectedPart] = useRecoilState(bodyPart)

    const [modalOpenState, setModalOpenState] = useRecoilState(homeModalOpenState)


    const modalStateHandler = (modal: keyof ModalOpenState) => {
        setModalOpenState(prev => {
            const newState = Object.keys(prev).reduce((acc, key) => {
                acc[key as keyof ModalOpenState] = key === modal ? !prev[modal] : false;
                return acc;
            }, {} as ModalOpenState);

            return newState;

        })
    }

    const modalClose = () => {
        setModalOpenState({
            colorPicker: false,
            settings: false,
            help: false,
            createLobby: false,
            joinLobby: false,
            emote: false,
        })
    }

    const handleColorClick = (color: string, selectedCategory: BodyPart) => {
        setBodyPartColor(prev => ({
            ...prev,
            [selectedCategory]: color,
        }));
        setSelectedPart(selectedCategory)
    };



    return {
        bodyPartColor,
        selectedPart,
        handleColorClick,
        modalOpenState,
        modalClose,
        setSelectedPart,
        modalStateHandler
    }
}

export default useContainer