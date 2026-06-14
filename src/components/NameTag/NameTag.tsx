interface NameTagProps {
    name: string
}

const NameTag = ({ name }: NameTagProps) => {
    return (
        <span className="pointer-events-none select-none rounded-full bg-white px-4 py-1 text-lg font-bold uppercase tracking-wide text-dark shadow-md">
            {name}
        </span>
    )
}

export default NameTag
