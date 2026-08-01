import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

type Props = {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  label?: string;
  height?: number;
  fullScreen?: boolean;
  onCloseFullScreen?: () => void;
};

export type SignaturePadHandle = {
  /** Saves the current canvas strokes and returns the PNG data URL, if any. */
  commit: () => string | null;
};

export const SignaturePad = forwardRef<SignaturePadHandle, Props>(function SignaturePad(
  {
    value,
    onChange,
    label = "Signature",
    height = 180,
    fullScreen = false,
    onCloseFullScreen,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const hasStrokeRef = useRef(Boolean(value));
  const committedRef = useRef<string | null>(value ?? null);
  const [hasStroke, setHasStroke] = useState(Boolean(value));

  function canvasCssHeight() {
    return fullScreen ? Math.max(280, window.innerHeight - 180) : height;
  }

  function drawBackground(ctx: CanvasRenderingContext2D, width: number, h: number) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1f1a15";
    ctx.lineWidth = 2.4;
    ctx.fillStyle = "#fffdf9";
    ctx.fillRect(0, 0, width, h);
  }

  function paintFromSource(source: string | null | undefined) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const h = canvasCssHeight();
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(h * ratio));
    drawBackground(ctx, width, h);

    if (!source) return;
    const img = new Image();
    img.onload = () => {
      const live = canvasRef.current?.getContext("2d");
      if (!live) return;
      live.drawImage(img, 0, 0, width, h);
    };
    img.src = source;
  }

  // Initial size + resize only — do not wipe strokes when parent value updates from our own commit.
  useEffect(() => {
    paintFromSource(committedRef.current);
    const onResize = () => {
      if (drawing.current) return;
      const canvas = canvasRef.current;
      const snapshot =
        committedRef.current ||
        (hasStrokeRef.current && canvas ? canvas.toDataURL("image/png") : null);
      if (snapshot && !committedRef.current) committedRef.current = snapshot;
      paintFromSource(snapshot);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, fullScreen]);

  // Sync when parent clears / replaces signature from outside (not our own Apply).
  useEffect(() => {
    const next = value ?? null;
    if (next === committedRef.current) return;
    committedRef.current = next;
    hasStrokeRef.current = Boolean(next);
    setHasStroke(Boolean(next));
    paintFromSource(next);
  }, [value]);

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
    if (!hasStrokeRef.current) {
      hasStrokeRef.current = true;
      setHasStroke(true);
    }
  }

  function endStroke() {
    drawing.current = false;
  }

  function commit(): string | null {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return committedRef.current;
    if (!hasStrokeRef.current && !committedRef.current) return null;
    const dataUrl = canvas.toDataURL("image/png");
    committedRef.current = dataUrl;
    hasStrokeRef.current = true;
    setHasStroke(true);
    onChange(dataUrl);
    return dataUrl;
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const width = canvas.clientWidth;
    const h = canvasCssHeight();
    drawBackground(ctx, width, h);
    hasStrokeRef.current = false;
    setHasStroke(false);
    committedRef.current = null;
    onChange(null);
  }

  useImperativeHandle(ref, () => ({ commit }), [onChange]);

  const body = (
    <div className={fullScreen ? "flex h-full flex-col bg-[#0f0d0b] p-4 text-foreground" : ""}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/70">{label}</p>
        <div className="flex gap-3">
          <button type="button" onClick={clear} className="text-xs underline underline-offset-2">
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              commit();
              if (fullScreen && onCloseFullScreen) onCloseFullScreen();
            }}
            className="rounded-full border border-primary bg-primary px-3 py-1 text-xs text-primary-foreground"
          >
            Apply signature
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full touch-none rounded-lg border border-primary/30 bg-[#fffdf9]"
        style={{ height: fullScreen ? "min(70vh, 520px)" : height, minHeight: fullScreen ? 280 : height }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
      />
      {!hasStroke ? (
        <p className="mt-2 text-xs text-foreground/60">Sign using your mouse or finger, then tap Apply signature.</p>
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
});
