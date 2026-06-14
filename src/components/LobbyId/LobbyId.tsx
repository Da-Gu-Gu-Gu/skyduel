import { useState } from "react"
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline"

interface LobbyIdProps {
    id: string
}

const LobbyId = ({ id }: LobbyIdProps) => {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(id)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            /* clipboard not available */
        }
    }

    return (
        <button
            onClick={copy}
            title="Copy lobby id"
            className="flex items-center gap-3 rounded-full bg-white py-2 px-4 shadow-md transition-transform hover:scale-[1.04]"
        >
            <span className="text-sm font-bold uppercase tracking-wide text-gray-400">Lobby ID</span>
            <span className="text-xl font-bold tracking-widest text-pink">{id}</span>
            {copied ? (
                <CheckIcon className="h-5 w-5 text-[#43AA8B]" />
            ) : (
                <ClipboardIcon className="h-5 w-5 text-gray-400" />
            )}
        </button>
    )
}

export default LobbyId
