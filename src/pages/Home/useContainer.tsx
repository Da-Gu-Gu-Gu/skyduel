import { useRecoilState } from 'recoil'
import { BodyPart, bodyPartColors, bodyPart, homeModalOpenState, ModalOpenState, activeEmoteState } from './store/home.store'
import type { EmoteType } from './emotes'


const useContainer = () => {
    const [bodyPartColor, setBodyPartColor] = useRecoilState(bodyPartColors)
    const [selectedPart, setSelectedPart] = useRecoilState(bodyPart)

    const [modalOpenState, setModalOpenState] = useRecoilState(homeModalOpenState)

    const [activeEmote, setActiveEmote] = useRecoilState(activeEmoteState)

    const triggerEmote = (type: EmoteType) => {
        setActiveEmote(prev => ({ type, nonce: (prev?.nonce ?? 0) + 1 }))
    }


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
        modalStateHandler,
        activeEmote,
        triggerEmote
    }
}

export default useContainer