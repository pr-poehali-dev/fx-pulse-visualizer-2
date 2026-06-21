import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_ASSETS, CRYPTO, FIAT, Asset } from '@/lib/fx-data';
import { useMarket } from '@/hooks/useMarket';
import { Timeframe } from '@/hooks/useCandles';
import { Lang, t } from '@/lib/i18n';
import Converter from '@/components/fx/Converter';
import MarketCard from '@/components/fx/MarketCard';
import DetailChart from '@/components/fx/DetailChart';
import Icon from '@/components/ui/icon';

type Filter = 'all' | 'fiat' | 'crypto';

const Index = () => {
  const { quotes, loading, updated, flash, flashTick } = useMarket();
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('fx_lang') as Lang) || 'en');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Asset>(CRYPTO[0]);
  const [tf, setTf] = useState<Timeframe>('7D');
  const [clock, setClock] = useState('');
  const sparks = useRef<Record<string, number[]>>({});

  useEffect(() => {
    localStorage.setItem('fx_lang', lang);
  }, [lang]);

  useEffect(() => {
    const i = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(i);
  }, []);

  // build sparklines from live ticks
  useEffect(() => {
    ALL_ASSETS.forEach((a) => {
      const p = quotes[a.id]?.price;
      if (!p) return;
      const arr = sparks.current[a.id] || [];
      arr.push(p);
      if (arr.length > 30) arr.shift();
      sparks.current[a.id] = arr;
    });
  }, [quotes]);

  const list = useMemo(() => {
    if (filter === 'fiat') return FIAT;
    if (filter === 'crypto') return CRYPTO;
    return ALL_ASSETS;
  }, [filter]);

  const navItems: [string, string][] = [
    ['nav_converter', '#converter'],
    ['nav_market', '#market'],
    ['nav_charts', '#charts'],
    ['nav_about', '#about'],
  ];

  const sparkFor = (id: string) => {
    const s = sparks.current[id];
    if (s && s.length > 2) return s;
    const base = quotes[id]?.price ?? 1;
    return Array.from({ length: 20 }, (_, i) => base * (1 + Math.sin(i / 3) * 0.01));
  };

  return (
    <div className="min-h-screen bg-[#04050a] text-white font-sans relative overflow-x-hidden">
      {/* orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-cyan/30 blur-[140px] opacity-40 animate-orb-float" />
        <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-purplefx/30 blur-[140px] opacity-40 animate-orb-float" style={{ animationDelay: '-8s' }} />
        <div className="absolute bottom-0 left-1/4 w-[34rem] h-[34rem] rounded-full bg-pinkfx/25 blur-[140px] opacity-40 animate-orb-float" style={{ animationDelay: '-16s' }} />
        <div className="absolute top-2/3 right-1/3 w-[28rem] h-[28rem] rounded-full bg-cyan/20 blur-[140px] opacity-30 animate-orb-float" style={{ animationDelay: '-4s' }} />
      </div>
      <div className="pointer-events-none fixed inset-0 fx-grid-bg" />

      {/* header */}
      <header className="sticky top-0 z-50 fx-glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan via-purplefx to-pinkfx flex items-center justify-center">
              <Icon name="ChartCandlestick" size={20} className="text-[#04050a]" />
            </div>
            <span className="text-lg font-bold fx-brand-text tracking-tight">FX Pulse</span>
          </a>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map(([key, href]) => (
              <a key={key} href={href} className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg">
                {t(key, lang)}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-upfx animate-pulse-dot" />
              <span className="text-upfx font-medium">{t('live', lang)}</span>
              <span className="text-white/40">{clock}</span>
            </div>
            <div className="flex p-0.5 rounded-lg bg-white/5 text-xs font-medium">
              {(['en', 'ru'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md transition-all ${lang === l ? 'bg-gradient-to-r from-cyan to-purplefx text-[#04050a]' : 'text-white/50'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5">
        {/* hero */}
        <section className="pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full fx-glass text-xs text-white/70 mb-7 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" />
            {t('hero_badge', lang)}
          </div>
          <h1
            className="font-extrabold tracking-tighter leading-[0.95] mb-6 animate-fade-up"
            style={{ fontSize: 'clamp(40px,8vw,80px)', letterSpacing: '-0.04em', fontWeight: 900, animationDelay: '80ms' }}
          >
            <span className="fx-brand-text">{t('hero_title', lang)}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/50 text-base md:text-lg animate-fade-up" style={{ animationDelay: '160ms' }}>
            {t('hero_sub', lang)}
          </p>
        </section>

        {/* converter */}
        <section id="converter" className="scroll-mt-24 mb-8 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <Converter quotes={quotes} updated={updated} lang={lang} />
        </section>

        {/* stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { v: FIAT.length, k: 'stat_fiat', icon: 'Banknote', c: '#00d4ff' },
            { v: CRYPTO.length, k: 'stat_crypto', icon: 'Bitcoin', c: '#a855f7' },
            { v: '700+', k: 'stat_pairs', icon: 'Network', c: '#ec4899' },
            { v: 'CoinGecko · Frankfurter', k: 'stat_source', icon: 'Radio', c: '#fbbf24', small: true },
          ].map((s, i) => (
            <div key={s.k} className="fx-glass rounded-2xl p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Icon name={s.icon} size={20} style={{ color: s.c }} className="mb-3" />
              <div className={`font-bold text-white mb-1 ${s.small ? 'text-sm' : 'text-2xl font-mono'}`}>{s.v}</div>
              <div className="text-xs text-white/40">{t(s.k, lang)}</div>
            </div>
          ))}
        </section>

        {/* market */}
        <section id="market" className="scroll-mt-24 mb-16">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">{t('market_title', lang)}</h2>
              <p className="text-white/40 text-sm">{t('market_sub', lang)}</p>
            </div>
            <div className="flex gap-1 p-1 rounded-xl fx-glass">
              {(['all', 'fiat', 'crypto'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f ? 'bg-gradient-to-r from-cyan to-purplefx text-[#04050a]' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {t(`f_${f}`, lang)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="fx-skeleton animate-shimmer rounded-2xl h-44" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
              {list.map((a, i) => (
                <MarketCard
                  key={a.id}
                  asset={a}
                  quote={quotes[a.id]}
                  spark={sparkFor(a.id)}
                  selected={selected.id === a.id}
                  flash={flash[a.id] ?? null}
                  flashTick={flashTick}
                  index={i}
                  onSelect={() => {
                    setSelected(a);
                    document.getElementById('charts')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* charts */}
        <section id="charts" className="scroll-mt-24 mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-7">{t('chart_title', lang)}</h2>
          <DetailChart asset={selected} quote={quotes[selected.id]} tf={tf} onTf={setTf} lang={lang} />
        </section>

        {/* about */}
        <section id="about" className="scroll-mt-24 mb-20">
          <h2 className="text-3xl font-bold tracking-tight mb-7 text-center">{t('about_title', lang)}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'Globe', k: 'feat1', c: '#00d4ff' },
              { icon: 'TrendingUp', k: 'feat2', c: '#a855f7' },
              { icon: 'Zap', k: 'feat3', c: '#ec4899' },
              { icon: 'ShieldCheck', k: 'feat4', c: '#fbbf24' },
            ].map((f, i) => (
              <div key={f.k} className="fx-glass rounded-2xl p-6 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.c}1f` }}>
                  <Icon name={f.icon} size={22} style={{ color: f.c }} />
                </div>
                <h3 className="font-semibold mb-2">{t(`${f.k}_t`, lang)}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{t(`${f.k}_d`, lang)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 fx-glass">
        <div className="max-w-7xl mx-auto px-5 py-8 flex items-center justify-between flex-wrap gap-3 text-sm text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan via-purplefx to-pinkfx flex items-center justify-center">
              <Icon name="ChartCandlestick" size={14} className="text-[#04050a]" />
            </div>
            <span>© {new Date().getFullYear()} FX Pulse</span>
          </div>
          <span>{t('footer_note', lang)}</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
