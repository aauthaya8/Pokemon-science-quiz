import type { Profile } from "../types";
import type { ShopItem } from "../data/shopItems";
import { SHOP_ITEMS } from "../data/shopItems";
import { buyItem, canAfford, isOwned, toggleCosmetic } from "../logic/shop";

interface Props {
  profile: Profile;
  onChange: (next: Profile) => void;
  onClose: () => void;
}

export function ShopPanel({ profile, onChange, onClose }: Props) {
  const consumables = SHOP_ITEMS.filter((i) => i.type === "consumable");
  const cosmetics = SHOP_ITEMS.filter((i) => i.type === "cosmetic");

  function handleBuy(item: ShopItem) {
    const result = buyItem(profile, item.id);
    if (result.ok) onChange(result.profile);
  }

  function handleToggle(item: ShopItem) {
    onChange(toggleCosmetic(profile, item.id));
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 z-20 p-6 overflow-auto">
      <button
        onClick={onClose}
        aria-label="Close shop"
        className="absolute top-4 right-4 bg-white border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] w-10 h-10 flex items-center justify-center font-mono font-bold"
      >
        X
      </button>
      <h2 className="text-2xl sm:text-3xl font-mono font-bold text-center text-slate-900 uppercase tracking-wider mb-1">
        {"\uD83D\uDED2"} Pok&eacute;mart
      </h2>
      <div className="text-center font-mono text-sm text-slate-700 uppercase tracking-widest mb-5">
        You have: <span className="font-bold text-slate-900">{profile.totalPoints} pts</span>
      </div>

      <Section title="Consumables">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {consumables.map((item) => (
            <ConsumableCard
              key={item.id}
              item={item}
              owned={profile.inventory[item.id] ?? 0}
              affordable={canAfford(profile, item)}
              onBuy={() => handleBuy(item)}
            />
          ))}
        </div>
      </Section>

      <Section title="Cosmetics">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {cosmetics.map((item) => {
            const owned = isOwned(profile, item);
            const equipped = profile.equippedCosmetics.includes(item.id);
            return (
              <CosmeticCard
                key={item.id}
                item={item}
                owned={owned}
                equipped={equipped}
                affordable={canAfford(profile, item)}
                onBuy={() => handleBuy(item)}
                onToggle={() => handleToggle(item)}
              />
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="font-mono font-bold uppercase tracking-widest text-slate-800 text-center text-sm sm:text-base mb-2">
        -- {title} --
      </h3>
      {children}
    </section>
  );
}

interface ConsumableCardProps {
  item: ShopItem;
  owned: number;
  affordable: boolean;
  onBuy: () => void;
}

function ConsumableCard({ item, owned, affordable, onBuy }: ConsumableCardProps) {
  return (
    <div
      data-testid={`shop-item-${item.id}`}
      className="p-3 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] font-mono bg-kidParchment flex flex-col gap-2"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl leading-none">{item.emoji}</div>
        <div className="flex-1">
          <div className="font-bold text-base uppercase tracking-wide text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-700">{item.description}</div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t-2 border-dashed border-slate-300 pt-2">
        <div className="text-xs uppercase tracking-widest text-slate-700">
          {owned > 0 ? <span data-testid={`owned-${item.id}`}>Owned: {owned}</span> : <span>Price: {item.price} pts</span>}
        </div>
        <button
          onClick={onBuy}
          disabled={!affordable}
          aria-label={`Buy ${item.name}`}
          className={[
            "font-mono font-bold text-xs uppercase tracking-wider py-1 px-3 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
            affordable ? "bg-emerald-200 hover:bg-emerald-300 text-slate-900" : "bg-slate-200 text-slate-500 cursor-not-allowed opacity-60",
          ].join(" ")}
        >
          Buy {item.price}
        </button>
      </div>
    </div>
  );
}

interface CosmeticCardProps {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  affordable: boolean;
  onBuy: () => void;
  onToggle: () => void;
}

function CosmeticCard({ item, owned, equipped, affordable, onBuy, onToggle }: CosmeticCardProps) {
  return (
    <div
      data-testid={`shop-item-${item.id}`}
      className="p-3 border-[3px] border-slate-900 rounded-md shadow-[3px_3px_0_#0f172a] font-mono bg-kidParchment flex flex-col gap-2"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl leading-none">{item.emoji}</div>
        <div className="flex-1">
          <div className="font-bold text-base uppercase tracking-wide text-slate-900 flex items-center gap-2">
            {item.name}
            {owned && (
              <span
                data-testid={`owned-${item.id}`}
                className="text-[10px] bg-yellow-300 border-2 border-slate-900 px-1.5 py-0.5 rounded-sm tracking-widest"
              >
                OWNED
              </span>
            )}
          </div>
          <div className="text-xs text-slate-700">{item.description}</div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t-2 border-dashed border-slate-300 pt-2">
        <div className="text-xs uppercase tracking-widest text-slate-700">
          {owned ? (equipped ? "Equipped" : "Not equipped") : `Price: ${item.price} pts`}
        </div>
        {owned ? (
          <button
            onClick={onToggle}
            aria-label={equipped ? `Unequip ${item.name}` : `Equip ${item.name}`}
            className={[
              "font-mono font-bold text-xs uppercase tracking-wider py-1 px-3 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
              equipped ? "bg-rose-200 hover:bg-rose-300 text-slate-900" : "bg-sky-200 hover:bg-sky-300 text-slate-900",
            ].join(" ")}
          >
            {equipped ? "Unequip" : "Equip"}
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={!affordable}
            aria-label={`Buy ${item.name}`}
            className={[
              "font-mono font-bold text-xs uppercase tracking-wider py-1 px-3 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0_#0f172a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#0f172a]",
              affordable ? "bg-emerald-200 hover:bg-emerald-300 text-slate-900" : "bg-slate-200 text-slate-500 cursor-not-allowed opacity-60",
            ].join(" ")}
          >
            Buy {item.price}
          </button>
        )}
      </div>
    </div>
  );
}
