/** Playful placeholder shown in the opponent's slot while we wait for them to join. */
const WaitingForOpponent = () => {
  return (
    <div className="pointer-events-none flex select-none flex-col items-center gap-4">
      {/* Mystery avatar: radar ping + bobbing dashed ring with a wiggling "?" */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/30" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-dashed border-white shadow-lg [animation:float-bob_2s_ease-in-out_infinite]">
          <span className="text-6xl font-bold text-white [animation:wiggle_1.2s_ease-in-out_infinite]">?</span>
        </div>
      </div>

      {/* "Searching" pill with bouncing dots */}
      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1 text-lg font-bold uppercase tracking-wide text-dark shadow-md">
        <span>Searching</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block h-1.5 w-1.5 rounded-full bg-pink [animation:dot-bounce_1s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
};

export default WaitingForOpponent;
