import { useEffect, useState } from "react";
import { isMuted, setMuted, subscribeMute } from "../logic/sound";

interface Props {
  className?: string;
}

export function MuteToggle({ className }: Props) {
  const [muted, setLocalMuted] = useState<boolean>(isMuted());

  useEffect(() => {
    const unsub = subscribeMute((m) => setLocalMuted(m));
    return () => {
      unsub();
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      aria-pressed={muted}
      onClick={() => setMuted(!muted)}
      className={[
        "bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-11 h-11 flex items-center justify-center text-xl font-mono active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
        className ?? "",
      ].join(" ")}
    >
      <span aria-hidden="true">{muted ? "\uD83D\uDD07" : "\uD83D\uDD0A"}</span>
    </button>
  );
}
