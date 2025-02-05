
import MainLayout from '../../layout/Main'
import Button from '../../components/Buttons/Button'
import { colors } from '../../utils/theme/color'
import EmoteCircle from '../../components/EmoteCircle/EmoteCircle'

const Lobby = () => {
    const emotes = [
        { emoji: "😊", onClick: () => console.log("Happy clicked") },
        { emoji: "😂", onClick: () => console.log("Laughing clicked") },
        { emoji: "😍", onClick: () => console.log("Love clicked") },
        { emoji: "😎", onClick: () => console.log("Cool clicked") },
        { emoji: "🤔", onClick: () => console.log("Thinking clicked") },
        { emoji: "😮", onClick: () => console.log("Surprised clicked") },
        { emoji: "😢", onClick: () => console.log("Sad clicked") },
        { emoji: "😡", onClick: () => console.log("Angry clicked") },
    ]
    return (
        <MainLayout inLobby>
            <EmoteCircle emotes={emotes} size={400} />
            <div className="absolute z-20 bottom-10 right-10 flex flex-col items-end gap-2 ">

                <Button
                    label={false ? "Wait Other Player" : "Start Game"}
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