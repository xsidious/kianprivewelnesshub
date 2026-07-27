import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const kianLogo = "/assets/kian-prive-logo.png";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Book a Consultation — Wellness Goals Questionnaire | KIAN Privé" },
      {
        name: "description",
        content:
          "Complete the Wellness Goals Questionnaire to book a consultation with a Certified Peptide Consultant at KIAN Privé.",
      },
      { property: "og:title", content: "Book a Consultation | KIAN Privé" },
      {
        property: "og:description",
        content:
          "Complete the Wellness Goals Questionnaire to book a consultation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
  component: ConsultationPage,
});

const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

const WELLNESS_GOALS = [
  "Weight management",
  "Fat loss",
  "Increase lean muscle",
  "Improve recovery from exercise",
  "Joint support",
  "Reduce inflammation",
  "Improve energy",
  "Better sleep",
  "Mental clarity and focus",
  "Healthy aging/longevity",
  "Skin, hair, and collagen support",
  "Gut health",
  "Immune support",
  "Sexual wellness",
  "Hormone optimization",
  "Heart and metabolic health",
];

const CONCERNS = [
  "Stubborn weight",
  "Low energy",
  "Brain fog",
  "Poor recovery",
  "Joint discomfort",
  "Digestive issues",
  "Difficulty building muscle",
  "Poor sleep",
  "Low libido",
  "Skin aging",
  "Hair thinning",
  "Mood",
  "Blood sugar concerns",
  "Inflammation",
];

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

function CheckboxGrid({
  name,
  options,
  max,
}: {
  name: string;
  options: readonly string[];
  max?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm text-foreground/85 transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <input
            type="checkbox"
            name={name}
            value={opt}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <span>{opt}</span>
        </label>
      ))}
      {max ? (
        <p className="col-span-full mt-1 text-xs italic text-foreground/60">
          Select up to {max}.
        </p>
      ) : null}
    </div>
  );
}

function RadioRow({ name, options }: { name: string; options: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-primary/25 px-4 py-1.5 text-sm text-foreground/85 transition-colors hover:border-primary hover:bg-primary/10 has-[:checked]:border-primary has-[:checked]:bg-primary/15"
        >
          <input type="radio" name={name} value={opt} className="h-3.5 w-3.5 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  );
}

function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};
    for (const key of new Set(Array.from(data.keys()))) {
      const values = data.getAll(key);
      payload[key] = values.length > 1 ? values : values[0];
    }

    const subject = encodeURIComponent("KIAN Privé — Wellness Goals Questionnaire");
    const body = encodeURIComponent(
      Object.entries(payload)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("\n"),
    );
    window.location.href = `mailto:hello@kianprive.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };


  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-12 sm:px-6 sm:py-16">
        <Link
          to="/jennifer-fenner"
          className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-primary/30 px-4 py-2 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10"
          style={serif}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>

        <div className="flex flex-col items-center">
          <img
            src={kianLogo}
            alt="KIAN Privé"
            className="h-auto w-full max-w-[200px] object-contain"
          />
          <div className="mt-8 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <div className="h-px w-16 bg-primary/40" />
          </div>
          <h1
            className="mt-6 text-center text-3xl text-foreground sm:text-4xl"
            style={serif}
          >
            Wellness Goals Questionnaire
          </h1>
          <p
            className="mt-3 max-w-xl text-center text-sm leading-relaxed text-foreground/80"
            style={serif}
          >
            Share your goals so Jennifer can personalize your consultation.
          </p>
        </div>

        {submitted ? (
          <div className="mt-12 flex flex-col items-center rounded-2xl border border-primary/30 bg-card/60 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl text-foreground" style={serif}>
              Thank you
            </h2>
            <p className="mt-2 text-sm text-foreground/80">
              Your email client should have opened with your responses. If not, please email
              your answers to <span className="font-medium">hello@kianprive.com</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Section title="Your Information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="name">Name</label>
                  <input id="name" name="name" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="date">Date</label>
                  <input id="date" name="date" type="date" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="age">Age</label>
                  <input id="age" name="age" inputMode="numeric" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="height">Height</label>
                  <input id="height" name="height" className={inputClass} placeholder={`e.g. 5'8"`} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="weight">Weight</label>
                  <input id="weight" name="weight" className={inputClass} placeholder="e.g. 150 lbs" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required className={inputClass} />
                </div>
              </div>
            </Section>

            <Section title="Primary Wellness Goals">
              <p className="text-sm text-foreground/75">Check all that apply.</p>
              <CheckboxGrid name="wellnessGoals" options={WELLNESS_GOALS} />
              <div>
                <label className={labelClass} htmlFor="goalsOther">Other</label>
                <input id="goalsOther" name="goalsOther" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="goalsDetail">
                  Tell us more — what would you like to accomplish over the next 3–6 months?
                </label>
                <textarea
                  id="goalsDetail"
                  name="goalsDetail"
                  rows={4}
                  className={inputClass}
                />
              </div>
            </Section>

            <Section title="Current Health">
              <div>
                <span className={labelClass}>Diagnosed medical conditions?</span>
                <RadioRow name="hasConditions" options={["No", "Yes"]} />
                <input
                  name="conditionsList"
                  placeholder="If yes, please list"
                  className={`${inputClass} mt-3`}
                />
              </div>
              <div>
                <span className={labelClass}>Currently taking prescription medications?</span>
                <RadioRow name="hasMedications" options={["No", "Yes"]} />
                <input
                  name="medicationsList"
                  placeholder="If yes, please list"
                  className={`${inputClass} mt-3`}
                />
              </div>
              <div>
                <span className={labelClass}>Ever used GLP-1 medications or peptide therapies?</span>
                <RadioRow name="hasPeptideHistory" options={["No", "Yes"]} />
                <input
                  name="peptideHistoryList"
                  placeholder="If yes, please list"
                  className={`${inputClass} mt-3`}
                />
              </div>
              <div>
                <span className={labelClass}>Medication allergies?</span>
                <RadioRow name="hasAllergies" options={["No", "Yes"]} />
                <input
                  name="allergiesList"
                  placeholder="If yes, please list"
                  className={`${inputClass} mt-3`}
                />
              </div>
            </Section>

            <Section title="Lifestyle">
              <div>
                <span className={labelClass}>Stress level</span>
                <RadioRow name="stress" options={["Low", "Moderate", "High"]} />
              </div>
              <div>
                <span className={labelClass}>Average hours of sleep per night</span>
                <RadioRow name="sleep" options={["Less than 5", "5–6", "7–8", "More than 8"]} />
              </div>
              <div>
                <span className={labelClass}>Exercise frequency</span>
                <RadioRow
                  name="exercise"
                  options={["Rarely", "1–2 days/week", "3–4 days/week", "5+ days/week"]}
                />
              </div>
              <div>
                <span className={labelClass}>Nutrition</span>
                <RadioRow
                  name="nutrition"
                  options={["Excellent", "Good", "Fair", "Needs improvement"]}
                />
              </div>
            </Section>

            <Section title="Areas of Concern">
              <p className="text-sm text-foreground/75">Check up to five.</p>
              <CheckboxGrid name="concerns" options={CONCERNS} max={5} />
              <div>
                <label className={labelClass} htmlFor="concernsOther">Other</label>
                <input id="concernsOther" name="concernsOther" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="additional">
                  Is there anything else you'd like us to know?
                </label>
                <textarea id="additional" name="additional" rows={4} className={inputClass} />
              </div>
            </Section>


            {formError && (
              <p
                role="alert"
                className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive"
              >
                {formError}
              </p>
            )}

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-8 py-3 text-sm tracking-wide text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                style={serif}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit Questionnaire
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
