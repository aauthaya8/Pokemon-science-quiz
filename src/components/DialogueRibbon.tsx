interface Props {
  line: string;
}

export function DialogueRibbon({ line }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-kidParchment border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] px-4 py-3 font-mono text-slate-900 uppercase tracking-wide"
    >
      <span className="text-base font-bold">{line}</span>
      <span className="ml-1 inline-block animate-typewriter-cursor" aria-hidden="true">
        ▼
      </span>
    </div>
  );
}
