import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { lobbyStatusState, StatusTone } from "../../pages/Home/store/home.store";

const TONE_BG: Record<StatusTone, string> = {
  info: "bg-dark",
  success: "bg-[#43AA8B]",
  danger: "bg-danger",
};

/** Transient lobby status banner (bottom-center), auto-dismissing after a moment. */
const StatusMessage = () => {
  const status = useRecoilValue(lobbyStatusState);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!status) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [status]);

  if (!status || !visible) return null;

  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2">
      <div
        key={status.nonce}
        className={`${TONE_BG[status.tone]} rounded-full px-6 py-2 text-lg font-bold uppercase tracking-wide text-white shadow-lg [animation:status-pop_.3s_ease-out]`}
      >
        {status.text}
      </div>
    </div>
  );
};

export default StatusMessage;
