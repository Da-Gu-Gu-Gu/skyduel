import { useEffect } from 'react'
import MainLayout from '../../layout/Main'
import Button from '../../components/Buttons/Button'
import { colors } from '../../utils/theme/color'
import LobbyId from '../../components/LobbyId/LobbyId'
import useContainer from '../Home/useContainer'

const Lobby = () => {
    const {
        lobbyForm,
        readyState,
        togglePlayerReady,
        setOpponentReady,
        bothReady,
        countdown,
        startGame,
    } = useContainer()

    // TODO(backend): replace this FE simulation with the opponent's real ready signal.
    useEffect(() => {
        if (!readyState.player || readyState.opponent) return
        const t = setTimeout(() => setOpponentReady(true), 1500)
        return () => clearTimeout(t)
    }, [readyState.player, readyState.opponent, setOpponentReady])

    const counting = countdown !== null
    const waitingForOpponent = readyState.player && !bothReady

    const buttonLabel = bothReady
        ? 'Start Game'
        : readyState.player
            ? 'Waiting for Opponent…'
            : "I'm Ready"

    const onButtonClick = bothReady ? startGame : togglePlayerReady

    return (
        <MainLayout inLobby={true}>
            {lobbyForm.id && (
                <div className="absolute z-20 top-28 right-10">
                    <LobbyId id={lobbyForm.id} />
                </div>
            )}
            <div className="absolute z-20 bottom-10 right-10 flex flex-col items-end gap-2 ">
                <Button
                    label={buttonLabel}
                    bgColor={colors.pink}
                    textColor={colors.white}
                    loading={waitingForOpponent}
                    disable={waitingForOpponent || counting}
                    onClick={onButtonClick}
                />
            </div>
        </MainLayout>
    )
}

export default Lobby
