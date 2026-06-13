
import MainLayout from '../../layout/Main'
import Button from '../../components/Buttons/Button'
import { colors } from '../../utils/theme/color'
import EmoteCircle from '../../components/EmoteCircle/EmoteCircle'
import useContainer from '../Home/useContainer'
import { EMOTES } from '../Home/emotes'

const Lobby = () => {
    const { modalOpenState, triggerEmote, modalClose } = useContainer()
    const emotes = EMOTES.map(({ emoji, type }) => ({
        emoji,
        onClick: () => {
            triggerEmote(type)
            modalClose()
        },
    }))
    const waitPlayer = false
    return (
        <MainLayout inLobby={true}>
            {modalOpenState.emote && <EmoteCircle emotes={emotes} size={400} />}
            <div className="absolute z-20 bottom-10 right-10 flex flex-col items-end gap-2 ">

                <Button
                    label={waitPlayer ? "Wait Other Player" : "Start Game"}
                    bgColor={colors.pink}
                    textColor={colors.white}
                    loading={false}
                    disable={false}
                    onClick={() => { alert('Start Game') }}
                />
            </div>
        </MainLayout>
    )
}

export default Lobby