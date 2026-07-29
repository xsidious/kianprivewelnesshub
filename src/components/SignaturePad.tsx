"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  label?: string;
  height?: number;
  fullScreen?: boolean;
  onCloseFullScreen?: () => void;
};

export function SignaturePad({
  value,
  onChange,
  label = "Signature",
  height = 180,
  fullScreen = false,
  onCloseFullScreen,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [hasStroke, setHasStroke] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const h = fullScreen ? Math.max(280, window.innerHeight - 180) : height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(h * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#1f1a15";
      ctx.lineWidth = 2.4;
      ctx.fillStyle = "#fffdf9";
      ctx.fillRect(0, 0, width, h);
      if (value) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, width, h);
        img.src = value;
      }
    };

    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [height, value, fullScreen]);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasStroke(true);
  }

  function commit() {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (hasStroke || value) onChange(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#fffdf9";
    ctx.fillRect(0, 0, canvas.clientWidth, fullScreen ? Math.max(280, window.innerHeight - 180) : height);
    setHasStroke(false);
    onChange(null);
  }

  const body = (
    <div className={fullScreen ? "flex h-full flex-col bg-[#0f0d0b] p-4 text-foreground" : ""}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/70">{label}</p>
        <div className="flex gap-3">
          <button type="button" onClick={clear} className="text-xs underline underline-offset-2">
            Clear
          </button>
          {fullScreen && onCloseFullScreen ? (
            <button
              type="button"
              onClick={() => {
                commit();
                onCloseFullScreen();
              }}
              className="rounded-full border border-primary bg-primary px-3 py-1 text-xs text-primary-foreground"
            >
              Apply signature
            </button>
          ) : null}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full touch-none rounded-lg border border-primary/30 bg-[#fffdf9]"
        style={{ height: fullScreen ? "min(70vh, 520px)" : height, minHeight: fullScreen ? 280 : height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={commit}
        onPointerLeave={commit}
      />
      {!hasStroke && !value ? (
        <p className="mt-2 text-xs text-foreground/60">Sign using mouse or finger.</p>
      ) : null}
    </div>
  );

  if (!fullScreen) return body;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-[#0f0d0b]/95 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col rounded-2xl border border-primary/30 bg-background/95 p-4 shadow-2xl">
        {body}
      </div>
    </div>
  );
}
