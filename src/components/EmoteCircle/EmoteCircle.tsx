import type React from "react"

interface Emote {
    emoji: string
    onClick: () => void
}

interface EmoteCircleProps {
    emotes: Emote[]
    size?: number
}

const EmoteCircle: React.FC<EmoteCircleProps> = ({ emotes, size = 300 }) => {
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 50

    return (
        <div
            className="fixed border-white border-2   bg-gray-500 bg-opacity-25 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 box-border"
            style={{ width: size, height: size }}
        >

            {emotes.map((emote, index) => {
                const angle = (index / emotes.length) * 2 * Math.PI
                const x = centerX + radius * Math.cos(angle) - 24
                const y = centerY + radius * Math.sin(angle) - 24

                return (
                    <button
                        key={index}
                        className="absolute  group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none "
                        style={{ left: x, top: y }}
                        onClick={emote.onClick}
                    >
                        <span className="text-2xl">{emote.emoji}</span>
                    </button>
                )
            })}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-2 border-white rounded-full">

            </div>
        </div>
    )
}

export default EmoteCircle

