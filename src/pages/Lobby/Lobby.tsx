import { useEffect } from 'react'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'
import MainLayout from '../../layout/Main'
import Button from '../../components/Buttons/Button'
import { colors } from '../../utils/theme/color'
import LobbyId from '../../components/LobbyId/LobbyId'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import useContainer from '../Home/useContainer'

const Lobby = () => {
    const {
        lobbyForm,
        readyState,
        togglePlayerReady,
        setOpponentReady,
        opponentJoined,
        setOpponentJoined,
        isLobbyOwner,
        showStatus,
        leaveLobby,
        bothReady,
        countdown,
        startGame,
    } = useContainer()

    const counting = countdown !== null
    const waitingToJoin = !opponentJoined

    // TODO(backend): replace with the opponent's real "joined" signal.
    useEffect(() => {
        if (opponentJoined) return
        const t = setTimeout(() => {
            setOpponentJoined(true)
            showStatus("Opponent joined!", "success")
        }, 2000)
        return () => clearTimeout(t)
    }, [opponentJoined, setOpponentJoined, showStatus])

    // TODO(backend): replace this FE simulation with the opponent's real ready signal.
    useEffect(() => {
        if (!opponentJoined || !readyState.player || readyState.opponent) return
        const t = setTimeout(() => setOpponentReady(true), 1500)
        return () => clearTimeout(t)
    }, [opponentJoined, readyState.player, readyState.opponent, setOpponentReady])

    // TODO(backend): replace with the opponent's real "left" signal. Demo: leave once
    // while idle, then the join sim re-fires and they rejoin. Stops once we're ready.
    useEffect(() => {
        if (!opponentJoined || bothReady || counting) return
        const t = setTimeout(() => {
            setOpponentJoined(false)
            setOpponentReady(false)
            showStatus("Opponent left — waiting for a new player", "danger")
        }, 5000)
        return () => clearTimeout(t)
    }, [opponentJoined, bothReady, counting, setOpponentJoined, setOpponentReady, showStatus])

    const actionButton = !readyState.player ? (
        <Button label="I'm Ready" bgColor={colors.pink} textColor={colors.white} onClick={togglePlayerReady} />
    ) : !bothReady ? (
        <Button label="Waiting for Opponent…" bgColor={colors.pink} textColor={colors.white} loading disable />
    ) : isLobbyOwner ? (
        <Button label="Start Game" bgColor={colors.pink} textColor={colors.white} disable={counting} onClick={startGame} />
    ) : null

    return (
        <MainLayout inLobby={true}>
            <div className="absolute z-20 top-28 left-10">
                <Button
                    label="Leave"
                    bgColor={colors.danger}
                    textColor={colors.white}
                    icon={<ArrowLeftStartOnRectangleIcon className="h-6 w-6" />}
                    onClick={leaveLobby}
                />
            </div>
            {lobbyForm.id && (
                <div className="absolute z-20 top-28 right-10 flex flex-col items-end gap-2">
                    <LobbyId id={lobbyForm.id} />
                    {lobbyForm.passCode && <LobbyId id={lobbyForm.passCode} label="Pass ID" />}
                </div>
            )}
            {!waitingToJoin && actionButton && (
                <div className="absolute z-20 bottom-10 right-10 flex flex-col items-end gap-2 ">
                    {actionButton}
                </div>
            )}
            <StatusMessage />
        </MainLayout>
    )
}

export default Lobby
