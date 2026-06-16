import { useCallback } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import { BodyPart, bodyPartColors, bodyPart, homeModalOpenState, ModalOpenState, activeEmoteState, lobbyReadyState, lobbyFormState, LobbyForm, lobbyCountdownState, opponentJoinedState, isLobbyOwnerState, lobbyStatusState, StatusTone, soundEnabledState } from './store/home.store'
import type { EmoteType } from './emotes'
import { playEmoteSound } from '../../utils/sound/emote'


const useContainer = () => {
    const navigate = useNavigate()
    const [bodyPartColor, setBodyPartColor] = useRecoilState(bodyPartColors)
    const [selectedPart, setSelectedPart] = useRecoilState(bodyPart)

    const [modalOpenState, setModalOpenState] = useRecoilState(homeModalOpenState)

    const [activeEmote, setActiveEmote] = useRecoilState(activeEmoteState)
    const soundEnabled = useRecoilValue(soundEnabledState)

    const [readyState, setReadyState] = useRecoilState(lobbyReadyState)

    const [opponentJoined, setOpponentJoined] = useRecoilState(opponentJoinedState)

    const [isLobbyOwner, setIsLobbyOwner] = useRecoilState(isLobbyOwnerState)

    const setLobbyStatus = useSetRecoilState(lobbyStatusState)
    const showStatus = useCallback(
        (text: string, tone: StatusTone = "info") =>
            setLobbyStatus(prev => ({ text, tone, nonce: (prev?.nonce ?? 0) + 1 })),
        [setLobbyStatus],
    )

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
        setIsLobbyOwner(true)
        modalClose()
        navigate("/lobby")
    }

    const submitJoinLobby = () => {
        if (!canJoinLobby) return
        setIsLobbyOwner(false)
        modalClose()
        navigate("/lobby")
    }

    // Reset all lobby state and return to Home.
    const resetReady = useResetRecoilState(lobbyReadyState)
    const resetJoined = useResetRecoilState(opponentJoinedState)
    const resetCountdown = useResetRecoilState(lobbyCountdownState)
    const resetForm = useResetRecoilState(lobbyFormState)
    const resetOwner = useResetRecoilState(isLobbyOwnerState)
    const resetStatus = useResetRecoilState(lobbyStatusState)
    const leaveLobby = () => {
        resetReady()
        resetJoined()
        resetCountdown()
        resetForm()
        resetOwner()
        resetStatus()
        navigate("/")
    }

    const triggerEmote = (type: EmoteType) => {
        if (soundEnabled) playEmoteSound(type)
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
        opponentJoined,
        setOpponentJoined,
        isLobbyOwner,
        showStatus,
        leaveLobby,
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