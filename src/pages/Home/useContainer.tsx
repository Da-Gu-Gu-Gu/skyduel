import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { BodyPart, bodyPartColors, bodyPart, homeModalOpenState, ModalOpenState, activeEmoteState, lobbyReadyState, lobbyFormState, LobbyForm, lobbyCountdownState } from './store/home.store'
import type { EmoteType } from './emotes'


const useContainer = () => {
    const navigate = useNavigate()
    const [bodyPartColor, setBodyPartColor] = useRecoilState(bodyPartColors)
    const [selectedPart, setSelectedPart] = useRecoilState(bodyPart)

    const [modalOpenState, setModalOpenState] = useRecoilState(homeModalOpenState)

    const [activeEmote, setActiveEmote] = useRecoilState(activeEmoteState)

    const [readyState, setReadyState] = useRecoilState(lobbyReadyState)

    const bothReady = readyState.player && readyState.opponent

    const togglePlayerReady = () => {
        setReadyState(prev => ({ ...prev, player: !prev.player }))
    }

    const setOpponentReady = (ready: boolean) => {
        setReadyState(prev => ({ ...prev, opponent: ready }))
    }

    const goToBattle = () => navigate("/battle")

    const [countdown, setCountdown] = useRecoilState(lobbyCountdownState)

    // Run the 3 → 2 → 1 → Go countdown on the VS bar, then enter the battle.
    const startGame = () => {
        if (countdown !== null) return // guard against double-trigger
        setCountdown(3)
        setTimeout(() => setCountdown(2), 1000)
        setTimeout(() => setCountdown(1), 2000)
        setTimeout(() => setCountdown("Go"), 3000)
        setTimeout(() => {
            navigate("/battle")
            setCountdown(null)
        }, 3800)
    }

    const [lobbyForm, setLobbyForm] = useRecoilState(lobbyFormState)

    const setLobbyField = (field: keyof LobbyForm, value: string) => {
        setLobbyForm(prev => ({ ...prev, [field]: value }))
    }

    const canCreateLobby = lobbyForm.passCode.trim() !== ""
    const canJoinLobby = lobbyForm.id.trim() !== "" && lobbyForm.passCode.trim() !== ""

    // TODO(backend): create/join a real lobby with these inputs before navigating.
    const submitCreateLobby = () => {
        if (!canCreateLobby) return
        // Generate a short, shareable lobby id (BE will own this later).
        const id = Math.random().toString(36).slice(2, 8).toUpperCase()
        setLobbyForm(prev => ({ ...prev, id }))
        modalClose()
        navigate("/lobby")
    }

    const submitJoinLobby = () => {
        if (!canJoinLobby) return
        modalClose()
        navigate("/lobby")
    }

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
        triggerEmote,
        readyState,
        togglePlayerReady,
        setOpponentReady,
        bothReady,
        goToBattle,
        countdown,
        startGame,
        lobbyForm,
        setLobbyField,
        canCreateLobby,
        canJoinLobby,
        submitCreateLobby,
        submitJoinLobby
    }
}

export default useContainer