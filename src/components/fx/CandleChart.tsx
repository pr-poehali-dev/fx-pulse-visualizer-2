import { useEffect, useRef, useState } from 'react';
import { Asset } from '@/lib/fx-data';

export interface Candle {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

interface Props {
  candles: Candle[];
  asset: Asset;
  height?: number;
  loading?: boolean;
  timeframe: string;
}

const PAD = { l: 80, r: 24, t: 24, b: 56 };
const UP = '#22c55e';
const DOWN = '#ef4444';

export default function CandleChart({ candles, asset, height = 460, loading, timeframe }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number; i: number } | null>(null);
  const [size, setSize] = useState({ w: 800, h: height });

  useEffect(() => {
    const ro = new ResizeObserver((e) => {
      const w = e[0].contentRect.width;
      setSize({ w, h: height });
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const { w, h } = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (!candles.length) return;

    const cw = w - PAD.l - PAD.r;
    const ch = h - PAD.t - PAD.b;
    const volH = ch * 0.2;
    const priceH = ch - volH;

    let min = Infinity, max = -Infinity, maxV = 0;
    candles.forEach((c) => {
      min = Math.min(min, c.l);
      max = Math.max(max, c.h);
      maxV = Math.max(maxV, c.v);
    });
    const range = max - min || 1;
    min -= range * 0.05;
    max += range * 0.05;

    const yP = (p: number) => PAD.t + priceH - ((p - min) / (max - min)) * priceH;
    const xAt = (i: number) => PAD.l + (cw / candles.length) * (i + 0.5);

    // grid Y
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 6; i++) {
      const y = PAD.t + (priceH / 6) * i;
      const val = max - ((max - min) / 6) * i;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.moveTo(PAD.l, y);
      ctx.lineTo(w - PAD.r, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'right';
      ctx.fillText(`${asset.symbol}${fmtAxis(val)}`, PAD.l - 8, y);
    }

    // grid X
    const xCount = 6;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= xCount; i++) {
      const idx = Math.min(candles.length - 1, Math.round((candles.length - 1) * (i / xCount)));
      const x = xAt(idx);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath();
      ctx.moveTo(x, PAD.t);
      ctx.lineTo(x, PAD.t + priceH);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(fmtTime(candles[idx].t, timeframe), x, h - PAD.b + 10);
    }

    const bodyW = Math.max(2, (cw / candles.length) * 0.62);

    // volume
    candles.forEach((c, i) => {
      if (maxV <= 0) return;
      const x = xAt(i);
      const vh = (c.v / maxV) * volH;
      ctx.fillStyle = c.c >= c.o ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)';
      ctx.fillRect(x - bodyW / 2, h - PAD.b - vh, bodyW, vh);
    });

    // candles
    candles.forEach((c, i) => {
      const x = xAt(i);
      const up = c.c >= c.o;
      const col = up ? UP : DOWN;
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yP(c.h));
      ctx.lineTo(x, yP(c.l));
      ctx.stroke();
      const yo = yP(c.o), yc = yP(c.c);
      const top = Math.min(yo, yc);
      const bh = Math.max(1, Math.abs(yc - yo));
      ctx.fillRect(x - bodyW / 2, top, bodyW, bh);
    });

    // last price dashed line
    const last = candles[candles.length - 1];
    const ly = yP(last.c);
    const lastUp = last.c >= last.o;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = lastUp ? UP : DOWN;
    ctx.beginPath();
    ctx.moveTo(PAD.l, ly);
    ctx.lineTo(w - PAD.r, ly);
    ctx.stroke();
    ctx.setLineDash([]);
    const tag = `${asset.symbol}${fmtAxis(last.c)}`;
    ctx.font = '11px "JetBrains Mono", monospace';
    const tw = ctx.measureText(tag).width + 14;
    ctx.fillStyle = lastUp ? UP : DOWN;
    ctx.fillRect(w - PAD.r - tw, ly - 9, tw, 18);
    ctx.fillStyle = '#04050a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, w - PAD.r - tw / 2, ly);

    // crosshair + tooltip
    if (hover && hover.i >= 0 && hover.i < candles.length) {
      const c = candles[hover.i];
      const x = xAt(hover.i);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.moveTo(x, PAD.t);
      ctx.lineTo(x, PAD.t + priceH);
      ctx.stroke();
      ctx.setLineDash([]);

      const lines = [
        `O ${asset.symbol}${fmtAxis(c.o)}`,
        `H ${asset.symbol}${fmtAxis(c.h)}`,
        `L ${asset.symbol}${fmtAxis(c.l)}`,
        `C ${asset.symbol}${fmtAxis(c.c)}`,
      ];
      const boxW = 130, boxH = 84;
      let bx = x + 14;
      if (bx + boxW > w - PAD.r) bx = x - boxW - 14;
      const by = PAD.t + 10;
      ctx.fillStyle = 'rgba(13,16,24,0.92)';
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      roundRect(ctx, bx, by, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '11px "JetBrains Mono", monospace';
      lines.forEach((ln, k) => {
        const isC = k === 3;
        ctx.fillStyle = isC ? (c.c >= c.o ? UP : DOWN) : 'rgba(255,255,255,0.75)';
        ctx.fillText(ln, bx + 12, by + 12 + k * 17);
      });
    }
  }, [candles, size, hover, asset, timeframe]);

  const onMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cw = size.w - PAD.l - PAD.r;
    const i = Math.floor(((x - PAD.l) / cw) * candles.length);
    if (i >= 0 && i < candles.length) setHover({ x, y: e.clientY - rect.top, i });
    else setHover(null);
  };

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        className="cursor-crosshair"
      />
    </div>
  );
}

function fmtAxis(n: number): string {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1) return n.toFixed(2);
  return n.toPrecision(4);
}

function fmtTime(ts: number, tf: string): string {
  const d = new Date(ts);
  if (tf === '1D') return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}
const pad = (n: number) => String(n).padStart(2, '0');

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
