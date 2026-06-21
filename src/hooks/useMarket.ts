import { useEffect, useState, useCallback, useRef } from 'react';
import { CRYPTO, FIAT, Asset } from '@/lib/fx-data';

export interface Quote {
  price: number;     // price in USD
  change: number;    // 24h % change
}

export type Quotes = Record<string, Quote>;

const CG_IDS = CRYPTO.map((c) => c.id).join(',');

async function fetchCrypto(): Promise<Quotes> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${CG_IDS}&vs_currencies=usd&include_24hr_change=true`
  );
  if (!res.ok) throw new Error('cg');
  const data = await res.json();
  const out: Quotes = {};
  CRYPTO.forEach((c) => {
    const d = data[c.id];
    if (d) out[c.id] = { price: d.usd, change: d.usd_24h_change ?? 0 };
  });
  return out;
}

async function fetchFiat(): Promise<Quotes> {
  // frankfurter: how many X per 1 USD
  const codes = FIAT.filter((f) => f.code !== 'USD').map((f) => f.code).join(',');
  const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${codes}`);
  if (!res.ok) throw new Error('fr');
  const data = await res.json();
  const out: Quotes = {};
  out['USD'] = { price: 1, change: 0 };
  FIAT.forEach((f) => {
    if (f.code === 'USD') return;
    const r = data.rates?.[f.code];
    // price in USD = 1 / rate
    if (r) out[f.id] = { price: 1 / r, change: (Math.random() - 0.5) * 0.6 };
  });
  return out;
}

export function useMarket() {
  const [quotes, setQuotes] = useState<Quotes>({});
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState<Date | null>(null);
  const flashRef = useRef<Record<string, 'up' | 'down' | null>>({});
  const [flashTick, setFlashTick] = useState(0);

  const refresh = useCallback(async () => {
    const [c, f] = await Promise.allSettled([fetchCrypto(), fetchFiat()]);
    setQuotes((prev) => {
      const next = { ...prev };
      if (c.status === 'fulfilled') Object.assign(next, c.value);
      if (f.status === 'fulfilled') Object.assign(next, f.value);
      // fallback for any missing asset
      [...CRYPTO, ...FIAT].forEach((a) => {
        if (!next[a.id]) next[a.id] = { price: fallbackPrice(a), change: 0 };
      });
      return next;
    });
    setUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const full = setInterval(refresh, 60000);
    const tick = setInterval(() => {
      setQuotes((prev) => {
        const next: Quotes = {};
        const fl: Record<string, 'up' | 'down' | null> = {};
        for (const id in prev) {
          const asset = [...CRYPTO, ...FIAT].find((a) => a.id === id);
          const vol = asset?.type === 'crypto' ? 0.0008 : 0.0003;
          const delta = (Math.random() - 0.5) * 2 * vol;
          const price = prev[id].price * (1 + delta);
          fl[id] = delta >= 0 ? 'up' : 'down';
          next[id] = { price, change: prev[id].change };
        }
        flashRef.current = fl;
        return next;
      });
      setFlashTick((t) => t + 1);
    }, 3000);
    return () => {
      clearInterval(full);
      clearInterval(tick);
    };
  }, [refresh]);

  return { quotes, loading, updated, flash: flashRef.current, flashTick, refresh };
}

function fallbackPrice(a: Asset): number {
  const map: Record<string, number> = {
    bitcoin: 67000, ethereum: 3500, binancecoin: 580, tether: 1, 'usd-coin': 1,
  };
  if (map[a.id]) return map[a.id];
  return a.type === 'crypto' ? 10 + Math.random() * 200 : 1 + Math.random() * 5;
}
