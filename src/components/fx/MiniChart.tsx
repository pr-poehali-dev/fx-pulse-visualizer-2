import { useEffect, useRef } from 'react';

interface Props {
  data: number[];
  color: string;
  up: boolean;
  height?: number;
}

export default function MiniChart({ data, color, up, height = 70 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || data.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 6;
    const x = (i: number) => (w / (data.length - 1)) * i;
    const y = (v: number) => pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2);

    const line = up ? '#22c55e' : '#ef4444';
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, hexA(line, 0.28));
    grad.addColorStop(1, hexA(line, 0));

    ctx.beginPath();
    ctx.moveTo(0, y(data[0]));
    data.forEach((v, i) => ctx.lineTo(x(i), y(v)));
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, y(data[0]));
    data.forEach((v, i) => ctx.lineTo(x(i), y(v)));
    ctx.strokeStyle = line;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [data, color, up, height]);

  return (
    <div ref={wrapRef} className="w-full" style={{ height }}>
      <canvas ref={ref} />
    </div>
  );
}

function hexA(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
