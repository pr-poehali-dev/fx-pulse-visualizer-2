import { useEffect, useState } from 'react';
import { Asset } from '@/lib/fx-data';
import { Candle } from '@/components/fx/CandleChart';

export type Timeframe = '1D' | '7D' | '30D' | '90D';
const DAYS: Record<Timeframe, number> = { '1D': 1, '7D': 7, '30D': 30, '90D': 90 };

export function useCandles(asset: Asset | null, tf: Timeframe, currentPrice?: number, change?: number) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asset) return;
    let cancelled = false;
    setLoading(true);

    async function load() {
      let result: Candle[] | null = null;
      try {
        if (asset!.type === 'crypto') {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${asset!.id}/ohlc?vs_currency=usd&days=${DAYS[tf]}`
          );
          if (res.ok) {
            const raw: number[][] = await res.json();
            result = raw.map((r) => ({ t: r[0], o: r[1], h: r[2], l: r[3], c: r[4], v: 0 }));
          }
        } else {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - DAYS[tf]);
          const fmt = (d: Date) => d.toISOString().slice(0, 10);
          const res = await fetch(
            `https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?from=${asset!.code}&to=USD`
          );
          if (res.ok && asset!.code !== 'USD') {
            const data = await res.json();
            const days = Object.keys(data.rates || {}).sort();
            result = days.map((d, i) => {
              const v = data.rates[d].USD;
              const prev = i > 0 ? data.rates[days[i - 1]].USD : v;
              const o = prev, c = v;
              return { t: new Date(d).getTime(), o, h: Math.max(o, c) * 1.001, l: Math.min(o, c) * 0.999, c, v: 0 };
            });
          }
        }
      } catch {
        result = null;
      }

      if (!result || result.length < 3) {
        result = synth(currentPrice ?? 1, change ?? 0, tf);
      }
      if (!cancelled) {
        setCandles(result);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [asset?.id, tf]);

  return { candles, loading };
}

function synth(price: number, change: number, tf: Timeframe): Candle[] {
  const n = tf === '1D' ? 24 : tf === '7D' ? 42 : tf === '30D' ? 30 : 45;
  const step = tf === '1D' ? 3600000 : 86400000;
  const now = Date.now();
  const startPrice = price / (1 + change / 100);
  const out: Candle[] = [];
  let p = startPrice;
  const drift = (price - startPrice) / n;
  for (let i = 0; i < n; i++) {
    const o = p;
    const vol = price * 0.012;
    const c = o + drift + (Math.random() - 0.5) * vol;
    const h = Math.max(o, c) + Math.random() * vol * 0.6;
    const l = Math.min(o, c) - Math.random() * vol * 0.6;
    out.push({ t: now - (n - i) * step, o, h, l, c, v: Math.random() * 100 });
    p = c;
  }
  return out;
}
