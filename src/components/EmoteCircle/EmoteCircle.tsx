import type React from "react"
import { FaceSmileIcon } from "@heroicons/react/24/solid"

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
    const radius = size / 2 - 30

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" style={{ width: size, height: size }}>
            {emotes.map((emote, index) => {
                const angle = (index / emotes.length) * 2 * Math.PI
                const x = centerX + radius * Math.cos(angle) - 24
                const y = centerY + radius * Math.sin(angle) - 24

                return (
                    <button
                        key={index}
                        className="absolute group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{ left: x, top: y }}
                        onClick={emote.onClick}
                    >
                        <span className="text-2xl">{emote.emoji}</span>
                        <FaceSmileIcon className="absolute w-5 h-5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-0 right-0" />
                    </button>
                )
            })}
        </div>
    )
}

export default EmoteCircle

