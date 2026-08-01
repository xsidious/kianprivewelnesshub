import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const kianLogo = "/assets/kian-prive-logo.png";
const KIAN_TRACK_API = "https://www.kianprive.com/api/intake/track";
const KIAN_CLAIM_API = "https://www.kianprive.com/api/intake/claim-account";
const KIAN_LOGIN = "https://www.kianprive.com/login?callbackUrl=/dashboard/intake";

type TrackSearch = {
  ref?: string;
  email?: string;
};

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): TrackSearch => ({
    ref: typeof search.ref === "string" ? search.ref : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Your Intake — KIAN Privé Wellness Hub" },
      {
        name: "description",
        content: "Check your Provider Connect intake status with your email and request code.",
      },
    ],
  }),
  component: TrackPage,
});

const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

function TrackPage() {
  const search = Route.useSearch();
  const [mode, setMode] = useState<"track" | "create">("track");
  const [email, setEmail] = useState(search.email ?? "");
  const [referenceId, setReferenceId] = useState((search.ref ?? "").toUpperCase());
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [autoChecked, setAutoChecked] = useState(false);
  const [result, setResult] = useState<{
    statusLabel: string;
    fullName: string;
    referenceId: string;
    statusNote: string | null;
    hasAccount: boolean;
  } | null>(null);

  async function lookupStatus(nextEmail = email, nextRef = referenceId) {
    setBusy(true);
    setMessage("");
    setResult(null);
    try {
      const res = await fetch(KIAN_TRACK_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, referenceId: nextRef }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Could not find that request.");
      } else {
        setResult({
          statusLabel: data.intake.statusLabel,
          fullName: data.intake.fullName,
          referenceId: data.intake.referenceId,
          statusNote: data.intake.statusNote,
          hasAccount: data.intake.hasAccount,
        });
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (autoChecked) return;
    if (search.email) setEmail(search.email);
    if (search.ref) setReferenceId(search.ref.toUpperCase());
    if (search.email && search.ref) {
      setAutoChecked(true);
      void lookupStatus(search.email, search.ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.email, search.ref, autoChecked]);

  async function onTrack(e: FormEvent) {
    e.preventDefault();
    await lookupStatus();
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(KIAN_CLAIM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referenceId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Could not create account.");
      } else {
        setMessage("Account ready. You can sign in on KIAN Privé.");
        setMode("track");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex w-full items-center justify-between gap-3 self-stretch">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm tracking-wide"
            style={serif}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <a
            href={`https://www.kianprive.com/track-intake?ref=${encodeURIComponent(referenceId)}&email=${encodeURIComponent(email)}`}
            className="text-xs uppercase tracking-[0.14em] text-primary underline-offset-4 hover:underline"
          >
            Open on Privé site
          </a>
        </div>

        <img src={kianLogo} alt="KIAN Privé" className="h-auto w-full max-w-[160px] object-contain" />
        <h1 className="mt-8 text-center text-3xl text-foreground" style={serif}>
          Track your intake
        </h1>
        <p className="mt-3 text-center text-sm text-foreground/75" style={serif}>
          Use your email and request code (example: KP-7F3A-9C2E).
        </p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("track")}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] ${
              mode === "track" ? "border-primary bg-primary text-primary-foreground" : "border-primary/30"
            }`}
          >
            Check status
          </button>
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] ${
              mode === "create" ? "border-primary bg-primary text-primary-foreground" : "border-primary/30"
            }`}
          >
            Create account
          </button>
        </div>

        {mode === "track" ? (
          <form onSubmit={onTrack} className="mt-6 w-full space-y-4 rounded-2xl border border-primary/20 bg-card/60 p-5">
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/70">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/70">
              Request code
              <input
                required
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 font-mono text-sm tracking-[0.12em]"
                placeholder="KP-XXXX-XXXX"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-full border border-primary bg-primary px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-60"
              style={serif}
            >
              {busy ? "Checking…" : "Check status"}
            </button>
          </form>
        ) : (
          <form onSubmit={onCreate} className="mt-6 w-full space-y-4 rounded-2xl border border-primary/20 bg-card/60 p-5">
            <p className="text-sm text-foreground/75">
              Create a KIAN Privé member login with the same email used on your intake.
            </p>
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/70">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/70">
              Request code
              <input
                required
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 font-mono text-sm tracking-[0.12em]"
                placeholder="KP-XXXX-XXXX"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.2em] text-foreground/70">
              Password (min 8 characters)
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-full border border-primary bg-primary px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-60"
              style={serif}
            >
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
        )}

        {message ? <p className="mt-4 text-center text-sm text-primary">{message}</p> : null}

        {result ? (
          <section className="mt-6 w-full rounded-2xl border border-primary/25 bg-card/70 p-5 text-left">
            <p className="text-[10px] uppercase tracking-[0.18em] text-primary">Current status</p>
            <h2 className="mt-1 text-2xl text-foreground" style={serif}>
              {result.statusLabel}
            </h2>
            <p className="mt-1 text-sm text-foreground/75">
              {result.fullName} · <span className="font-mono tracking-[0.12em]">{result.referenceId}</span>
            </p>
            {result.statusNote ? (
              <p className="mt-3 rounded-lg border border-primary/20 bg-background/50 px-3 py-2 text-sm">
                Provider note: {result.statusNote}
              </p>
            ) : null}
            <a
              href={KIAN_LOGIN}
              className="mt-4 inline-flex rounded-full border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground"
              style={serif}
            >
              {result.hasAccount ? "Sign in on KIAN Privé" : "Create account / sign in on KIAN Privé"}
            </a>
          </section>
        ) : null}
      </div>
    </main>
  );
}
