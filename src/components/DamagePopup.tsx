interface Props {
  value: string;
  side: "creature" | "kid";
}

export function DamagePopup({ value, side }: Props) {
  return (
    <div
      className={`pointer-events-none absolute -top-2 text-3xl font-extrabold text-red-600 drop-shadow animate-damage-pop ${
        side === "creature" ? "right-12" : "left-12"
      }`}
      aria-hidden="true"
    >
      {value}
    </div>
  );
}
