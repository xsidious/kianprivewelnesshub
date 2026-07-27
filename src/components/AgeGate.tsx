import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";

const kianLogo = "/assets/kian-prive-logo.png";

const STORAGE_KEY = "kian-prive-age-gate-v1";
const MIN_AGE = 21;
const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

type StoredGate = { email: string; dob: string; verifiedAt: string };

function isBrowser() {
  return typeof window !== "undefined";
}

function readStored(): StoredGate | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredGate;
    if (!parsed?.email || !parsed?.dob) return null;
    return parsed;
  } catch {
    return null;
  }
}

function ageFromDob(dob: string): number | null {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      const age = ageFromDob(stored.dob);
      if (age !== null && age >= MIN_AGE) setVerified(true);
    }
    setReady(true);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    const age = ageFromDob(dob);
    if (age === null) {
      setError("Please enter your date of birth.");
      return;
    }
    if (age < MIN_AGE) {
      setError(`You must be at least ${MIN_AGE} years old to enter this site.`);
      return;
    }

    const record: StoredGate = {
      email: trimmedEmail,
      dob,
      verifiedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // ignore storage failures
    }
    setVerified(true);
  };

  if (!ready) return null;
  if (verified) return <>{children}</>;

  const maxDob = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-background/95 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-primary/25 bg-card/90 p-5 shadow-[0_20px_60px_-25px_rgba(160,130,70,0.5)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={kianLogo}
            alt="KIAN Privé"
            className="h-auto w-full max-w-[160px] object-contain"
          />
          <div className="mt-6 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <div className="h-px w-12 bg-primary/40" />
          </div>
          <h1 className="mt-4 text-2xl text-foreground sm:text-3xl" style={serif}>
            Sign In to Enter
          </h1>
          <p
            className="mt-2 text-sm leading-relaxed text-foreground/80"
            style={serif}
          >
            This is a private wellness resource intended for adults 21 years or
            older. Please confirm your email and date of birth to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label
              htmlFor="age-gate-email"
              className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/70"
            >
              Email address
            </label>
            <input
              id="age-gate-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 255))}
              className="min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="age-gate-dob"
              className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/70"
            >
              Date of birth
            </label>
            <input
              id="age-gate-dob"
              type="date"
              required
              max={maxDob}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={serif}
          >
            Enter KIAN Privé
          </button>

          <p className="text-center text-xs uppercase tracking-[0.15em] text-foreground/60 sm:tracking-[0.25em]">
            By entering, you confirm you are {MIN_AGE}+ and agree to receive
            related communications.
          </p>
        </form>
      </div>
    </div>
  );
}
