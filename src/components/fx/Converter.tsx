import { useMemo, useState } from 'react';
import { ALL_ASSETS, Asset, fmt } from '@/lib/fx-data';
import { Quotes } from '@/hooks/useMarket';
import { Lang, t } from '@/lib/i18n';
import Icon from '@/components/ui/icon';

interface Props {
  quotes: Quotes;
  updated: Date | null;
  lang: Lang;
}

function AssetSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const a = ALL_ASSETS.find((x) => x.id === value);
  return (
    <div className="relative">
      {a && (
        <img
          src={a.icon}
          alt=""
          className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full object-cover bg-white/90 pointer-events-none z-10"
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-9 text-white font-medium focus:outline-none focus:ring-1 focus:ring-cyan cursor-pointer"
      >
        <optgroup label="Crypto">
          {ALL_ASSETS.filter((x) => x.type === 'crypto').map((x) => (
            <option key={x.id} value={x.id} className="bg-[#0d1018]">{x.code} — {x.name}</option>
          ))}
        </optgroup>
        <optgroup label="Fiat">
          {ALL_ASSETS.filter((x) => x.type === 'fiat').map((x) => (
            <option key={x.id} value={x.id} className="bg-[#0d1018]">{x.code} — {x.name}</option>
          ))}
        </optgroup>
      </select>
      <Icon name="ChevronDown" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
    </div>
  );
}

export default function Converter({ quotes, updated, lang }: Props) {
  const [from, setFrom] = useState('bitcoin');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState('1');

  const fromA = ALL_ASSETS.find((x) => x.id === from) as Asset;
  const toA = ALL_ASSETS.find((x) => x.id === to) as Asset;

  const rate = useMemo(() => {
    const pf = quotes[from]?.price;
    const pt = quotes[to]?.price;
    if (!pf || !pt) return 0;
    return pf / pt; // both in USD
  }, [quotes, from, to]);

  const result = (parseFloat(amount) || 0) * rate;

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <div className="fx-glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-semibold text-white">{t('conv_title', lang)}</h3>
        <span className="text-[11px] px-3 py-1 rounded-full bg-goldfx/15 text-goldfx font-medium">
          {t('conv_demo', lang)}
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <div>
          <label className="text-xs text-white/40 mb-2 block">{t('conv_from', lang)}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-lg mb-2 focus:outline-none focus:ring-1 focus:ring-cyan"
          />
          <AssetSelect value={from} onChange={setFrom} />
        </div>

        <button
          onClick={swap}
          aria-label="Swap"
          className="mx-auto my-2 md:mb-3 w-11 h-11 rounded-full fx-glass flex items-center justify-center text-cyan hover:rotate-180 transition-transform duration-500 hover:text-pinkfx"
        >
          <Icon name="ArrowLeftRight" size={18} />
        </button>

        <div>
          <label className="text-xs text-white/40 mb-2 block">{t('conv_to', lang)}</label>
          <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-lg mb-2 truncate">
            {toA?.symbol}{fmt(result)}
          </div>
          <AssetSelect value={to} onChange={setTo} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-xs text-white/40 flex-wrap gap-2">
        <span className="font-mono">
          1 {fromA?.code} = {fmt(rate)} {toA?.code}
        </span>
        <span>{t('conv_updated', lang)}: {updated ? updated.toLocaleTimeString() : '—'}</span>
      </div>
    </div>
  );
}
