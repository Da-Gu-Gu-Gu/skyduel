interface ReadyBadgeProps {
  ready: boolean
}

const ReadyBadge = ({ ready }: ReadyBadgeProps) => {
  return (
    <span
      className={`pointer-events-none select-none rounded-full px-3 py-1 text-sm font-bold uppercase tracking-wide shadow-md ${
        ready ? "bg-[#43AA8B] text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {ready ? "✓ Ready" : "Not Ready"}
    </span>
  )
}

export default ReadyBadge
