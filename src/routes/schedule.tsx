import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Check, Clock, Stethoscope } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const kianLogo = "/assets/kian-prive-logo.png";
const carmenPortrait = "/assets/carmen-ramirez-portrait.png";

const PROVIDER_EMAIL = "consultations@kianprive.com";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule a Consultation — KIAN Privé" },
      {
        name: "description",
        content:
          "Choose a date and time to connect with a KIAN Privé provider for a private wellness consultation.",
      },
      { property: "og:title", content: "Schedule a Consultation — KIAN Privé" },
      {
        property: "og:description",
        content:
          "Choose a date and time to connect with a KIAN Privé provider for a private wellness consultation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/schedule" }],
  }),
  component: SchedulePage,
});

const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

const inputClass =
  "w-full rounded-lg border border-primary/25 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/70";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 rounded-2xl border border-primary/20 bg-card/60 p-6 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:p-8">
      <h2 className="mb-6 text-2xl text-foreground" style={serif}>
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function MeetYourProvider() {
  return (
    <section className="mt-12 w-full sm:mt-16">
      <div className="flex flex-col items-center">
        <div className="h-px w-24 bg-primary/40" />
        <h2
          className="mt-6 text-center text-2xl text-foreground sm:text-3xl"
          style={serif}
        >
          Meet Your Provider
        </h2>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-card/60 px-6 pb-6 pt-6 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex flex-col items-center">
          <img
            src={carmenPortrait}
            alt="Dr. Carmen Teresa Ramirez, Board Certified Neurologist"
            width={280}
            height={420}
            loading="lazy"
            className="h-auto w-48 max-w-[220px] object-contain drop-shadow-[0_12px_24px_rgba(42,38,32,0.15)] sm:w-56"
          />
          <div className="mt-5 text-center">
            <h3
              className="text-xl text-foreground sm:text-2xl"
              style={serif}
            >
              Carmen Teresa Ramirez, M.D., M.Sc., M.B.A.
            </h3>
            <p className="mt-1 text-sm italic text-foreground/75">
              Neurology, Traumatic Brain Injury (TBI) & Stroke
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-foreground/60">
              American Board of Psychiatry and Neurology — Active
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <p className="text-sm leading-relaxed text-foreground/85">
            Dr. Carmen Teresa Ramirez is a board-certified neurologist with more than two decades of clinical leadership across neurology, stroke care, and brain health. She earned her Bachelor of Science in Microbiology & Immunology from the University of Miami, her Master of Science in Pharmacology and Doctor of Medicine from the University of Ottawa, and an MBA from the University of Texas at Dallas.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            She has served as Stroke Program Director at institutions across Florida and Texas, held faculty appointments at Texas A&M University, and currently works as a Neurology Consultant with Advantage Health Care Systems. Her expertise spans neurohospitalist medicine, traumatic brain injury consultation, tele-neurology, and intraoperative neuromonitoring. Dr. Ramirez holds active medical licensure in more than a dozen states and is a member of the American Academy of Neurology and the American Medical Association.
          </p>
        </div>
      </div>
    </section>
  );
}

function SchedulePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [signature, setSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );

  const signatureValid = signature.trim().length >= 2;
  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(signatureDate);
  const contactValid =
    !!date && !!time && name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = contactValid && consentAcknowledged && signatureValid && dateValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }
    if (!contactValid) {
      setError("Please provide your name and a valid email.");
      return;
    }
    if (!consentAcknowledged) {
      setError("Please acknowledge the disclaimer and informed consent to continue.");
      return;
    }
    if (!signatureValid) {
      setError("Please type your full name as your signature.");
      document.getElementById("signature")?.focus();
      return;
    }
    if (!dateValid) {
      setError("Please select the date you are signing.");
      document.getElementById("signatureDate")?.focus();
      return;
    }

    const dateStr = format(date, "EEEE, MMMM d, yyyy");
    const subject = `Consultation Request — ${name} — ${dateStr} at ${time}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      `Requested date: ${dateStr}`,
      `Requested time: ${time}`,
      "",
      notes ? `Notes:\n${notes}` : null,
      "",
      `Signature: ${signature}`,
      `Date signed: ${signatureDate}`,
      "",
      "— Sent from the KIAN Privé scheduling page",
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${PROVIDER_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-primary/30 px-4 py-2 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={serif}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <img
          src={kianLogo}
          alt="KIAN Privé"
          className="h-auto w-full max-w-[200px] object-contain"
        />

        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />
            <div className="h-px w-16 bg-primary/40" />
          </div>
          <h1
            className="mt-6 text-center text-3xl text-foreground sm:text-4xl"
            style={serif}
          >
            Connect with a Provider
          </h1>
          <p
            className="mt-3 max-w-lg text-center text-sm leading-relaxed text-foreground/80"
            style={serif}
          >
            Choose a date and time. Your request will be sent privately to our
            consultation team, who will confirm availability by email.
          </p>
        </div>

        <MeetYourProvider />

        {submitted ? (
          <section
            className="mt-12 w-full rounded-2xl border border-primary/30 bg-card/60 p-8 text-center shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)]"
            aria-live="polite"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
              <Check className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl text-foreground" style={serif}>
              Request prepared
            </h2>
            <p className="mt-3 text-sm text-foreground/80">
              Your email client should now be open with your consultation
              request ready to send. If it did not open, please email us
              directly at{" "}
              <a
                href={`mailto:${PROVIDER_EMAIL}`}
                className="underline decoration-primary/60 underline-offset-4 hover:text-primary"
              >
                {PROVIDER_EMAIL}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/60 px-5 py-2 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10"
              style={serif}
            >
              Book another time
            </button>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 w-full rounded-2xl border border-primary/20 bg-card/60 p-6 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="flex flex-col items-center">
                <div className="mb-3 flex items-center gap-2 text-sm text-foreground/80" style={serif}>
                  <CalendarIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                  Select a date
                </div>
                <div className="rounded-xl border border-primary/20 bg-background/60 p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setTime(undefined);
                    }}
                    disabled={(d) => {
                      const day = d.getDay();
                      return d < today || day === 0 || day === 6;
                    }}
                    initialFocus
                    className={cn("pointer-events-auto")}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="mb-3 flex items-center gap-2 text-sm text-foreground/80" style={serif}>
                  <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                  Select a time
                </div>
                <div
                  role="radiogroup"
                  aria-label="Available time slots"
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3"
                >
                  {TIME_SLOTS.map((slot) => {
                    const active = time === slot;
                    const disabled = !date;
                    return (
                      <button
                        type="button"
                        key={slot}
                        role="radio"
                        aria-checked={active}
                        disabled={disabled}
                        onClick={() => setTime(slot)}
                        className={cn(
                          "min-h-11 rounded-full border px-4 py-2.5 text-xs tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-primary/30 bg-background/60 text-foreground hover:border-primary hover:bg-primary/10",
                          disabled && "cursor-not-allowed opacity-50 hover:border-primary/30 hover:bg-background/60",
                        )}
                        style={serif}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {!date && (
                  <p className="mt-3 text-xs italic text-foreground/60">
                    Choose a date to see available times.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 100))}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.slice(0, 255))}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.slice(0, 40))}
                  autoComplete="tel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">What would you like to discuss? (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
                  rows={4}
                />
              </div>
            </div>

            {date && time && (
              <p className="mt-6 text-center text-sm text-foreground/80" style={serif}>
                Requesting{" "}
                <span className="font-semibold text-foreground">
                  {format(date, "EEEE, MMMM d")} at {time}
                </span>
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 text-center text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <Section title="Disclaimer & Important Notice">
              <p className="text-sm font-medium text-foreground">Please read carefully before proceeding.</p>
              <ol className="list-decimal space-y-3 pl-5 text-xs leading-relaxed text-foreground/80">
                <li>
                  <strong className="text-foreground">For Informational &amp; Consultation Purposes Only.</strong>{" "}
                  The information collected is intended solely to assist KIAN Privé's licensed medical team in
                  understanding your health background and wellness objectives. This request does not constitute a
                  diagnosis, treatment plan, or guarantee of any specific outcome.
                </li>
                <li>
                  <strong className="text-foreground">Physician Oversight Required.</strong> All peptide therapies
                  administered or recommended through KIAN Privé are done exclusively under the supervision of our
                  licensed Medical Director. Peptide protocols will be determined on an individual basis following a
                  comprehensive clinical evaluation. No peptide therapy will be initiated without prior physician
                  approval.
                </li>
                <li>
                  <strong className="text-foreground">Off-Label &amp; Investigational Use.</strong> Some peptides
                  offered may be used in an off-label or investigational capacity. While supported by emerging
                  clinical research, these therapies may not have received full approval by the U.S. Food and Drug
                  Administration (FDA) for all indicated uses. Clients will be informed of the evidence base and any
                  known risks prior to beginning any protocol.
                </li>
                <li>
                  <strong className="text-foreground">Individual Results May Vary.</strong> Outcomes from peptide
                  therapy are highly individualized and depend on a variety of physiological, lifestyle, and
                  compliance-related factors. KIAN Privé makes no express or implied warranties regarding specific
                  results. Testimonials or case studies referenced during consultation are illustrative and not a
                  guarantee of similar outcomes.
                </li>
                <li>
                  <strong className="text-foreground">Confidentiality &amp; Data Use.</strong> All personal and
                  medical information submitted is strictly confidential and protected in accordance with the Health
                  Insurance Portability and Accountability Act (HIPAA). Your information will never be sold, shared,
                  or disclosed to third parties without your express written consent, except as required by law.
                </li>
              </ol>
            </Section>

            <Section title="Consent & Signature">
              <p className="text-sm font-medium text-foreground">Informed Consent</p>
              <p className="text-xs leading-relaxed text-foreground/80">
                By signing below, I confirm that the information provided is accurate and complete to the best of my
                knowledge. I understand that KIAN Privé will use this information solely for the purpose of
                personalizing my care plan. I consent to the consultation and acknowledge that I have been informed of
                the nature of peptide therapy services offered.
              </p>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-primary/25 bg-background/60 px-3 py-2.5 text-sm text-foreground/85 transition-colors hover:border-primary/60">
                <input
                  type="checkbox"
                  name="consentAcknowledged"
                  value="yes"
                  checked={consentAcknowledged}
                  onChange={(e) => setConsentAcknowledged(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span>
                  I have read, understood, and agree to the Disclaimer &amp; Important Notice and the Informed Consent
                  above.
                </span>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="signature">Signature (type full name)</label>
                  <input
                    id="signature"
                    name="signature"
                    required
                    autoComplete="off"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    aria-invalid={signature.length > 0 && !signatureValid}
                    className={`${inputClass} font-[cursive]`}
                    placeholder="Your full legal name"
                  />
                  {signature.length > 0 && !signatureValid && (
                    <p className="mt-1 text-xs text-destructive">Please type your full name.</p>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="signatureDate">Date signed</label>
                  <input
                    id="signatureDate"
                    name="signatureDate"
                    type="date"
                    required
                    value={signatureDate}
                    onChange={(e) => setSignatureDate(e.target.value)}
                    aria-invalid={!dateValid}
                    className={inputClass}
                  />
                  {!dateValid && (
                    <p className="mt-1 text-xs text-destructive">Please select a valid date.</p>
                  )}
                </div>
              </div>
            </Section>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-6 py-3 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  !canSubmit && "cursor-not-allowed opacity-50",
                )}
                style={serif}
              >
                <Stethoscope className="h-4 w-4" aria-hidden="true" />
                Send Consultation Request
              </button>
            </div>
          </form>
        )}

        <div className="mt-14 flex flex-col items-center">
          <div className="h-px w-24 bg-primary/40" />
          <p
            className="mt-6 text-center text-xs tracking-[0.2em] text-foreground/80 sm:tracking-[0.4em]"
            style={serif}
          >
            — KIAN PRIVÉ · MMXXVI —
          </p>
        </div>
      </div>
    </main>
  );
}
