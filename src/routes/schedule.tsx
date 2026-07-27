import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { ProviderConnectForm } from "@/components/IntakeMultiStepForm";

const kianLogo = "/assets/kian-prive-logo.png";
const carmenPortrait = "/assets/carmen-ramirez-portrait.png";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule a Consultation — KIAN Privé" },
      {
        name: "description",
        content:
          "Choose a date and time and complete the compounded wellness intake to connect with a KIAN Privé provider.",
      },
      { property: "og:title", content: "Schedule a Consultation — KIAN Privé" },
      {
        property: "og:description",
        content:
          "Choose a date and time and complete the compounded wellness intake to connect with a KIAN Privé provider.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/schedule" }],
  }),
  component: SchedulePage,
});

const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

function MeetYourProvider() {
  return (
    <section className="mt-12 w-full sm:mt-16">
      <div className="flex flex-col items-center">
        <div className="h-px w-24 bg-primary/40" />
        <h2 className="mt-6 text-center text-2xl text-foreground sm:text-3xl" style={serif}>
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
            <h3 className="text-xl text-foreground sm:text-2xl" style={serif}>
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
            Dr. Carmen Teresa Ramirez is a board-certified neurologist with more than two decades of
            clinical leadership across neurology, stroke care, and brain health. She earned her
            Bachelor of Science in Microbiology & Immunology from the University of Miami, her Master
            of Science in Pharmacology and Doctor of Medicine from the University of Ottawa, and an
            MBA from the University of Texas at Dallas.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            She has served as Stroke Program Director at institutions across Florida and Texas, held
            faculty appointments at Texas A&M University, and currently works as a Neurology
            Consultant with Advantage Health Care Systems. Her expertise spans neurohospitalist
            medicine, traumatic brain injury consultation, tele-neurology, and intraoperative
            neuromonitoring. Dr. Ramirez holds active medical licensure in more than a dozen states
            and is a member of the American Academy of Neurology and the American Medical Association.
          </p>
        </div>
      </div>
    </section>
  );
}

function SchedulePage() {
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
          <h1 className="mt-6 text-center text-3xl text-foreground sm:text-4xl" style={serif}>
            Connect with a Provider
          </h1>
          <p
            className="mt-3 max-w-lg text-center text-sm leading-relaxed text-foreground/80"
            style={serif}
          >
            Schedule your consultation and complete the compounded wellness intake in one secure
            flow. Our team will confirm availability by email.
          </p>
        </div>

        <MeetYourProvider />
        <ProviderConnectForm />

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
