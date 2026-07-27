import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

const kianLogo = "/assets/kian-prive-logo.png";
const jenniferPortrait = "/assets/jennifer-fenner-portrait.png";
const shanePortrait = "/assets/shane-shuckerow-portrait.png";

export const Route = createFileRoute("/jennifer-fenner")({
  head: () => ({
    meta: [
      { title: "Personalize Your Wellness Journey | KIAN Privé" },
      {
        name: "description",
        content:
          "Meet Jennifer Fenner and Shane Shuckerow, wellness consultants at KIAN Privé. Personalize your peptide protocol with expert guidance.",
      },
      {
        property: "og:title",
        content: "Personalize Your Wellness Journey | KIAN Privé",
      },
      {
        property: "og:description",
        content:
          "Meet Jennifer Fenner and Shane Shuckerow, wellness consultants at KIAN Privé. Personalize your peptide protocol with expert guidance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/jennifer-fenner" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/jennifer-fenner" }],
  }),
  component: JenniferFenner,
});

function JenniferFenner() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 sm:px-6 sm:py-20">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 self-start rounded-full border border-primary/30 px-4 py-2 text-sm tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <img
          src={kianLogo}
          alt="KIAN Privé"
          className="h-auto w-full max-w-[220px] object-contain"
        />

        <div className="mt-10 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <div className="h-px w-16 bg-primary/40" />
          </div>
          <h1
            className="mt-6 text-center text-3xl text-foreground sm:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Personalize Your Wellness Journey
          </h1>
          <p
            className="mt-3 max-w-lg text-center text-sm leading-relaxed text-foreground/80"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            One-on-one wellness guidance with our certified consultants
          </p>
        </div>

        <section className="mt-12 w-full rounded-2xl border border-primary/20 bg-card/60 px-6 pb-6 pt-2 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:px-8 sm:pb-8 sm:pt-3">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex flex-shrink-0 flex-col items-center md:items-start">
              <img
                src={jenniferPortrait}
                alt="Jennifer Fenner, Certified Peptide Consultant"
                width={280}
                height={420}
                loading="lazy"
                className="h-auto w-48 max-w-[220px] object-contain drop-shadow-[0_12px_24px_rgba(42,38,32,0.15)] sm:w-56 md:max-w-[260px]"
              />
              <div className="mt-4 text-center md:text-left">
                <h2
                  className="text-xl text-foreground sm:text-2xl"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Jennifer Fenner
                </h2>
                <p className="mt-1 text-sm italic text-foreground/75">
                  Certified Peptide Consultant, KIAN Privé
                </p>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm leading-relaxed text-foreground/85">
                Jennifer Fenner is a Certified Peptide Consultant with KIAN Privé and a graduate of Dr. William Seeds' peptide education program. She is passionate about bridging the gap between cutting-edge peptide therapies and evidence-informed wellness through education, personalized guidance, and a whole-person approach to health.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                With a background in peptide education, fitness, nutrition, biohacking, yoga, Reiki, and sound healing, Jennifer helps clients optimize recovery, metabolic health, healthy aging, body composition, cognitive performance, and overall well-being. She believes that lasting results come from combining science-backed therapies with sustainable lifestyle habits.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                At KIAN Privé, Jennifer's mission is to simplify complex science, empower informed health decisions, and support clients on their journey toward living healthier, stronger, and more vibrant lives.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 w-full rounded-2xl border border-primary/20 bg-card/60 px-6 pb-6 pt-2 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:px-8 sm:pb-8 sm:pt-3">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex flex-shrink-0 flex-col items-center md:items-start">
              <img
                src={shanePortrait}
                alt="Shane Shuckerow, Health, Wellness & Fitness Expert"
                width={280}
                height={420}
                loading="lazy"
                className="h-auto w-48 max-w-[220px] object-contain drop-shadow-[0_12px_24px_rgba(42,38,32,0.15)] sm:w-56 md:max-w-[260px]"
              />
              <div className="mt-4 text-center md:text-left">
                <h2
                  className="text-xl text-foreground sm:text-2xl"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Shane Shuckerow
                </h2>
                <p className="mt-1 text-sm italic text-foreground/75">
                  Health, Wellness & Fitness Expert
                </p>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm leading-relaxed text-foreground/85">
                Shane Shuckerow is a seasoned fitness and wellness professional who brings a rare blend of scientific rigor and real-world coaching experience to every client relationship. He built his foundation in exercise physiology and personal training under the mentorship of Dr. Anthony Abbott, Founder and President of Fitness Institute International, developing deep expertise in human performance, metabolic health, and individualized program design.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                Shane further sharpened his qualifications through the International Sports Sciences Association (ISSA), earning certifications as a Certified Personal Trainer, Certified Nutrition Specialist, and Certified Weight Management Specialist. This multidisciplinary training allows him to integrate exercise science, nutrition, and behavioral coaching into a single, sustainable approach for clients pursuing weight management, fitness optimization, and long-term lifestyle transformation.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                His years leading operations at Pur Aesthetics Medical Spa, where he helped build a patient-centered culture of exceptional wellness care, further honed his ability to guide individuals through their health journeys with both clinical insight and genuine compassion. Grounded in integrity, accountability, and continuous learning, Shane is committed to helping every client become the healthiest, strongest version of themselves.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-14 flex flex-col items-center">
          <div className="h-px w-24 bg-primary/40" />
          <p
            className="mt-6 text-center text-xs tracking-[0.2em] text-foreground/80 sm:tracking-[0.4em]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            — KIAN PRIVÉ · MMXXVI —
          </p>
        </div>
      </div>
    </main>
  );
}
