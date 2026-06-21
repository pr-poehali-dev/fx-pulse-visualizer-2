import { Asset, fmt } from '@/lib/fx-data';
import { Quote } from '@/hooks/useMarket';
import { Lang, t } from '@/lib/i18n';
import CandleChart from './CandleChart';
import { Timeframe, useCandles } from '@/hooks/useCandles';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  asset: Asset;
  quote?: Quote;
  tf: Timeframe;
  onTf: (tf: Timeframe) => void;
  lang: Lang;
}

const TFS: Timeframe[] = ['1D', '7D', '30D', '90D'];

export default function DetailChart({ asset, quote, tf, onTf, lang }: Props) {
  const { candles, loading } = useCandles(asset, tf, quote?.price, quote?.change);
  const isMobile = useIsMobile();

  const last = candles[candles.length - 1];
  const first = candles[0];
  const stats = last
    ? {
        o: first?.o ?? last.o,
        h: Math.max(...candles.map((c) => c.h)),
        l: Math.min(...candles.map((c) => c.l)),
        c: last.c,
        v: candles.reduce((s, c) => s + c.v, 0),
      }
    : null;

  const up = (quote?.change ?? 0) >= 0;

  return (
    <div className="fx-glass rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shrink-0"
          style={{ background: asset.type === 'crypto' ? '#fff' : `${asset.color}22` }}
        >
          <img src={asset.icon} alt={asset.code} className="w-9 h-9 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
            <span className="text-sm text-white/40 font-mono">{asset.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-bold text-white">${quote ? fmt(quote.price) : '—'}</span>
            <span className={`text-sm font-mono px-2 py-0.5 rounded-lg ${up ? 'bg-upfx/15 text-upfx' : 'bg-downfx/15 text-downfx'}`}>
              {up ? '▲' : '▼'} {Math.abs(quote?.change ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="ml-auto flex gap-1 p-1 rounded-xl bg-white/5">
          {TFS.map((f) => (
            <button
              key={f}
              onClick={() => onTf(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tf === f ? 'bg-gradient-to-r from-cyan to-purplefx text-[#04050a]' : 'text-white/50 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          {([
            ['open', stats.o],
            ['high', stats.h],
            ['low', stats.l],
            ['close', stats.c],
            ['volume', stats.v],
          ] as [string, number][]).map(([k, v]) => (
            <div key={k} className="bg-white/5 rounded-xl p-3">
              <div className="text-[11px] text-white/40 mb-1">{t(k, lang)}</div>
              <div className="font-mono text-sm text-white">
                {k === 'volume' ? fmt(v, 0) : `${asset.symbol}${fmt(v)}`}
              </div>
            </div>
          ))}
        </div>
      )}

      <CandleChart candles={candles} asset={asset} loading={loading} height={isMobile ? 360 : 460} timeframe={tf} />
    </div>
  );
}