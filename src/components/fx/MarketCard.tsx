import { Asset, fmt } from '@/lib/fx-data';
import { Quote } from '@/hooks/useMarket';
import MiniChart from './MiniChart';
import { useEffect, useRef, useState } from 'react';

interface Props {
  asset: Asset;
  quote?: Quote;
  spark: number[];
  selected: boolean;
  flash: 'up' | 'down' | null;
  flashTick: number;
  onSelect: () => void;
  index: number;
}

export default function MarketCard({ asset, quote, spark, selected, flash, flashTick, onSelect, index }: Props) {
  const [flashClass, setFlashClass] = useState('');
  const tickRef = useRef(0);

  useEffect(() => {
    if (flashTick === tickRef.current) return;
    tickRef.current = flashTick;
    if (!flash) return;
    setFlashClass(flash === 'up' ? 'text-upfx' : 'text-downfx');
    const t = setTimeout(() => setFlashClass(''), 600);
    return () => clearTimeout(t);
  }, [flashTick, flash]);

  const up = (quote?.change ?? 0) >= 0;

  return (
    <button
      onClick={onSelect}
      style={{
        animationDelay: `${index * 50}ms`,
        ['--glow' as string]: asset.color,
      }}
      className={`fx-glass group relative text-left rounded-2xl p-5 animate-fade-up transition-all duration-300 hover:-translate-y-1.5 ${
        selected ? 'ring-1 ring-cyan shadow-[0_0_30px_-8px_rgba(0,212,255,0.5)]' : 'hover:ring-1 hover:ring-white/10'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(120px 120px at 80% 0%, ${asset.color}22, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
          style={{ background: asset.type === 'crypto' ? '#fff' : `${asset.color}22` }}
        >
          <img src={asset.icon} alt={asset.code} className="w-7 h-7 object-contain" loading="lazy" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-white truncate">{asset.code}</div>
          <div className="text-xs text-white/40 truncate">{asset.name}</div>
        </div>
        <span
          className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${
            asset.type === 'crypto' ? 'bg-purplefx/20 text-purplefx' : 'bg-cyan/15 text-cyan'
          }`}
        >
          {asset.type === 'crypto' ? 'CRYPTO' : 'FIAT'}
        </span>
      </div>

      <div className="relative flex items-end justify-between mb-3">
        <div className={`font-mono text-lg font-semibold transition-colors ${flashClass || 'text-white'}`}>
          ${quote ? fmt(quote.price) : '—'}
        </div>
        <div
          className={`text-xs font-mono px-2 py-1 rounded-lg ${
            up ? 'bg-upfx/15 text-upfx' : 'bg-downfx/15 text-downfx'
          }`}
        >
          {up ? '▲' : '▼'} {Math.abs(quote?.change ?? 0).toFixed(2)}%
        </div>
      </div>

      <div className="relative">
        <MiniChart data={spark} color={asset.color} up={up} />
      </div>
    </button>
  );
}
