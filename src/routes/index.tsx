import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowUp, Sparkles, Stethoscope } from "lucide-react";

const kianLogo = "/assets/kian-prive-logo.png";
const wellnessCouple = "/assets/wellness-couple.jpg";
const peptidesHero = "/assets/peptides-hero.jpg";
const physicianTablet = "/assets/physician-tablet.jpg";
const catGlp1 = "/assets/cat-glp1.jpg";
const catRegeneration = "/assets/cat-regeneration-body.jpg";
const catGh = "/assets/cat-gh.jpg";
const catCognitive = "/assets/cat-cognitive.jpg";
const catHormonal = "/assets/cat-hormonal.jpg";
const catCellular = "/assets/cat-cellular.jpg";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KIAN Privé — Curated Wellness Technology" },
      {
        name: "description",
        content:
          "A private catalog of curated wellness technology for KIAN Privé members.",
      },
      { property: "og:title", content: "KIAN Privé — Curated Wellness Technology" },
      {
        property: "og:description",
        content:
          "A private catalog of curated wellness technology for KIAN Privé members.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function KianLogo() {
  return (
    <div className="flex flex-col items-center">
      <img
        src={kianLogo}
        alt="KIAN Privé"
        className="h-auto w-full max-w-[280px] object-contain"
      />
    </div>
  );
}



function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 sm:px-6 sm:py-24">
        <KianLogo />

        <div className="mt-12 h-px w-24 bg-primary/40" />

        <h1
          className="mt-12 text-center text-4xl leading-tight text-foreground sm:text-5xl"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Curated Wellness Technology
        </h1>
        <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-foreground/80 sm:text-base">
          A private selection for discerning members. Browse the Wellness Compounding Guide to learn about each peptide and compound.
        </p>

        <WellnessJourney />

        <AftercarePrograms />

        <WellnessCompoundingHero />

        <PeptideGlossary />

        <div className="mt-16 h-px w-24 bg-primary/40" />
        <p
          className="mt-6 text-center text-xs tracking-[0.2em] text-foreground/80 sm:tracking-[0.4em]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          — KIAN PRIVÉ · MMXXVI —
        </p>
      </div>

      <ScrollProgress />
      <BackToTop />
    </main>
  );
}

function WellnessCompoundingHero() {
  return (
    <section className="mt-14 w-full">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_10px_40px_-20px_rgba(160,130,70,0.45)]">
        <div className="relative">
          <img
            src={peptidesHero}
            alt="Peptide vial and injectable pen on a cream marble surface"
            width={1344}
            height={672}
            loading="lazy"
            className="h-[320px] w-full object-cover sm:h-[420px] md:h-[520px] lg:h-[600px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center sm:px-6">
            <div className="h-px w-16 bg-primary/80 sm:w-24" />
            <h2
              className="mt-4 text-3xl text-white sm:text-4xl lg:text-5xl"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Wellness Compounding Guide
            </h2>
            <p className="mt-3 max-w-md px-4 text-sm text-white/90 sm:text-base">
              A brief description of each peptide and compound in the collection.
            </p>

            <MedicalDisclaimer overlay />
          </div>
        </div>
      </div>
    </section>
  );
}


type Entry = { name: string; desc: string; alias?: string };
type Group = { title: string; image: string; items: Entry[] };

const GLOSSARY: Group[] = [
  {
    title: "GLP-1 & Metabolic",
    image: catGlp1,
    items: [
      { name: "Semaglutide", desc: "GLP-1 receptor agonist used for appetite regulation, glycemic control, and sustained weight reduction." },
      { name: "Tirzepatide", desc: "Dual GIP/GLP-1 agonist offering enhanced metabolic and weight-loss effects versus GLP-1 alone." },
      { name: "Retatrutide (R3-40)", desc: "Investigational triple agonist (GIP/GLP-1/glucagon) targeting significant fat loss and metabolic remodeling." },
      { name: "Cagrilintide", desc: "Long-acting amylin analogue that enhances satiety and complements GLP-1 therapy." },
      { name: "Tesofensine", desc: "Monoamine reuptake inhibitor studied for appetite suppression and weight loss." },
      { name: "SLU-PP-332", desc: "ERR agonist that mimics exercise-like metabolic effects, supporting endurance and fat oxidation." },
      { name: "BAM15", desc: "Mitochondrial uncoupler that increases energy expenditure without stimulant effects." },
      { name: "5-Amino-1MQ (5-AMP)", alias: "5-Amino", desc: "NNMT inhibitor supporting fat metabolism, muscle preservation, and cellular energy balance." },
    ],
  },
  {
    title: "Regeneration & Repair",
    image: catRegeneration,
    items: [
      { name: "BPC-157", desc: "Body-protective compound promoting tendon, ligament, gut, and vascular healing." },
      { name: "TB-500 (Thymosin β4)", desc: "Supports tissue repair, inflammation modulation, and cellular migration for recovery." },
      { name: "KPV", desc: "Tripeptide with anti-inflammatory and gut-soothing properties." },
      { name: "GHK-Cu", desc: "Copper peptide supporting skin remodeling, hair, wound healing, and anti-aging pathways." },
      { name: "KLOW Blend", desc: "Combination of KPV, GHK-Cu, TB-500, and BPC-157 for systemic recovery and repair." },
    ],
  },
  {
    title: "Growth Hormone Axis",
    image: catGh,
    items: [
      { name: "CJC-1295", desc: "GHRH analogue that elevates baseline growth hormone and IGF-1 output." },
      { name: "Ipamorelin", desc: "Selective ghrelin/GH secretagogue with minimal impact on cortisol or prolactin." },
      { name: "Sermorelin", desc: "GHRH fragment that stimulates the pituitary's natural GH pulse." },
      { name: "Tesamorelin", desc: "GHRH analogue clinically shown to reduce visceral adipose tissue." },
      { name: "Ibutamoren (MK-677)", desc: "Oral ghrelin mimetic that raises GH and IGF-1, supporting sleep, recovery, and lean mass." },
      { name: "IGF-1 LR3", alias: "IGF-LR3", desc: "Long-acting IGF-1 analogue promoting cellular growth and muscle hypertrophy." },
    ],
  },
  {
    title: "Cognitive, Sleep & Longevity",
    image: catCognitive,
    items: [
      { name: "DSIP", desc: "Delta sleep-inducing peptide supporting deep sleep architecture and stress resilience." },
      { name: "Epithalon", desc: "Pineal peptide studied for telomere support, circadian rhythm, and longevity." },
      { name: "Pinealon", desc: "Short peptide targeting neuronal protection and cognitive resilience." },
      { name: "Selank", desc: "Anxiolytic peptide supporting calm focus without sedation." },
      { name: "Semax", desc: "Nootropic peptide enhancing focus, memory, and neuroprotection." },
      { name: "PE22-28", desc: "Peptide investigated for mood support and depressive symptom relief." },
      { name: "Dihexa", desc: "Angiotensin-derived nootropic supporting synapse formation and cognition." },
    ],
  },
  {
    title: "Hormonal & Sexual Health",
    image: catHormonal,
    items: [
      { name: "Gonadorelin", desc: "GnRH analogue used to maintain endogenous testosterone and fertility signaling." },
      { name: "Kisspeptin", desc: "Master regulator of the reproductive axis, stimulating LH/FSH release." },
      { name: "PT-141 (Bremelanotide)", desc: "Melanocortin agonist for libido and sexual arousal in men and women." },
      { name: "Melanotan I / II", desc: "Melanocortin peptides supporting pigmentation; MT-II also influences libido." },
    ],
  },
  {
    title: "Cellular, Immune & Mitochondrial",
    image: catCellular,
    items: [
      { name: "MOTS-c", desc: "Mitochondrial-derived peptide supporting metabolic flexibility and insulin sensitivity." },
      { name: "SS-31 (Elamipretide)", desc: "Mitochondria-targeted peptide protecting cardiolipin and cellular energy output." },
      { name: "Thymosin α-1", alias: "Thymosin A-1", desc: "Immune-modulating peptide supporting T-cell function and resilience." },
      { name: "AOD-9604", desc: "GH fragment focused on lipolysis without affecting blood glucose." },
      { name: "NAD+", desc: "Coenzyme central to energy production, DNA repair, and cellular longevity." },
      { name: "Glutathione", desc: "Master antioxidant supporting detoxification and cellular defense." },
      { name: "Methylcobalamin (B12)", desc: "Bioactive B12 supporting energy, methylation, and neurological function." },
      { name: "Glycine", desc: "Amino acid buffer improving solution stability, sleep quality, and metabolic support." },
      { name: "Lipo-B", desc: "Methionine, inositol, choline & B12 blend supporting fat metabolism and liver function." },
      { name: "Ondansetron", desc: "5-HT3 antagonist used to manage nausea, often paired with GLP-1 therapy." },
    ],
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const next = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(next);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${next})`;
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-transparent"
      role="progressbar"
      aria-label="Wellness Compounding Guide scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-primary shadow-[0_0_12px_rgba(179,149,85,0.45)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-card/90 text-foreground shadow-[0_8px_30px_-12px_rgba(160,130,70,0.5)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "CONSULTATION",
    desc: "Consultation and review or scheduling of recent labs for a personalized comprehensive health assessment.",
  },
  {
    number: "02",
    title: "PERSONALIZE WELLNESS PLAN",
    desc: "Your provider and physician review your assessment and provide a physician-recommended wellness plan with targeted peptides, dosing, and lifestyle guidance aligned to your goals.",
  },
  {
    number: "03",
    title: "COMPOUNDING",
    desc: "Your Rx is filled at an FDA-registered, CGMP-compliant pharmacy with verified potency and quality batch testing.",
  },
  {
    number: "04",
    title: "DELIVERY & SUPPORT",
    desc: "Medications arrive at your door. Your care team provides ongoing check-ins, dose optimization, and adjustments.",
  },
  {
    number: "05",
    title: "FOLLOW UP",
    desc: "Review appropriate nutrition and fitness protocols to match your wellness program.",
  },
  {
    number: "06",
    title: "RESULTS",
    desc: "Track progress with your provider. Protocols are refined over time to maximize outcomes.",
  },
];

function WellnessJourney() {
  return (
    <section className="mt-16 w-full sm:mt-20">
      <div className="flex flex-col items-center">
        <div className="h-px w-24 bg-primary/40" />
        <h2
          className="mt-8 text-center text-2xl text-foreground sm:text-3xl"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Start Your Wellness Journey
        </h2>
      </div>

      <div className="mt-8 w-full overflow-hidden rounded-2xl border border-primary/20 shadow-[0_10px_40px_-20px_rgba(160,130,70,0.35)]">
        <img
          src={wellnessCouple}
          alt="A man and woman embracing a wellness lifestyle"
          className="h-auto w-full object-cover"
          width={1024}
          height={768}
          loading="lazy"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {JOURNEY_STEPS.map((step, index) => (
          <div
            key={step.number}
            className="relative flex flex-col rounded-xl border border-primary/20 bg-card/60 p-5 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:p-6"
          >
            <span
              className="text-4xl leading-none text-foreground/20"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
              aria-hidden="true"
            >
              {step.number}
            </span>
            <h3
              className="mt-3 text-sm tracking-[0.2em] text-foreground"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {step.title}
            </h3>
            <p className="mt-2 flex-grow text-sm leading-relaxed text-foreground/80">
              {step.desc}
            </p>

            {index < JOURNEY_STEPS.length - 1 && (
              <div
                className="hidden lg:block"
                aria-hidden="true"
              >
                <div className="absolute -right-3 top-1/2 h-px w-6 bg-primary/30" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center">
        <p
          className="text-center text-lg text-foreground"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Ready to Start Your Personalized Wellness Program
        </p>
        <p className="mt-3 max-w-2xl text-center text-sm leading-relaxed text-foreground/80 sm:text-base">
          Ready to get started? Select a physician to begin your new program — or if you'd like guidance first, connect with a wellness specialist for a consultation on which peptides, fitness routines, or nutrition plans work best alongside your compounded peptide.
        </p>
        <div className="mt-4 flex w-full max-w-3xl flex-wrap justify-center gap-3">
          <Link
            to="/schedule"
            className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-2.5 text-center text-sm leading-tight tracking-wide text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            <Stethoscope className="h-4 w-4 shrink-0" aria-hidden="true" />
            Connect with Provider
          </Link>
          <Link
            to="/jennifer-fenner"
            className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-background/60 px-6 py-2.5 text-center text-sm leading-tight tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            Personalize Your Wellness Journey
          </Link>
          <a
            href="#compendium"
            className="inline-flex h-16 w-full items-center justify-center rounded-full border border-primary/40 bg-background/60 px-6 py-2.5 text-center text-sm leading-tight tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Explore the Wellness Compounding Guide
          </a>
          <Link
            to="/faq"
            className="inline-flex h-16 w-full items-center justify-center rounded-full border border-primary/40 bg-background/60 px-6 py-2.5 text-center text-sm leading-tight tracking-wide text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Frequently Asked Questions
          </Link>
        </div>
      </div>
    </section>
  );
}

function AftercarePrograms() {
  return (
    <section className="mt-16 w-full sm:mt-20">
      <div className="flex flex-col items-center">
        <div className="h-px w-24 bg-primary/40" />
        <h2
          className="mt-8 text-center text-2xl text-foreground sm:text-3xl"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Physician-Supported Monthly Protocols
        </h2>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-card/60 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)]">
        <div className="flex flex-col sm:flex-row">
          <div className="flex items-center justify-center p-6 sm:w-2/5 sm:p-8">
            <img
              src={physicianTablet}
              alt="Physician in a white lab coat reviewing a tablet"
              width={400}
              height={500}
              loading="lazy"
              className="max-h-[280px] w-auto object-contain drop-shadow-[0_10px_30px_rgba(42,38,32,0.15)] sm:max-h-[320px] lg:max-h-[380px]"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:w-3/5 sm:p-8">
            <p className="text-sm leading-relaxed text-foreground/85 sm:text-base">
              Physician-supported monthly recovery protocols.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85 sm:text-base">
              Designed for clients managing weight loss, menopause, chronic pain, or preparing for or recovering from surgical procedures. The most clinically effective non-invasive therapies, combined into one deeply restorative monthly protocol — personalized to your condition and timeline.
            </p>

            <div className="mt-8 flex justify-center sm:justify-start">
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-3 text-sm tracking-wide text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                <Stethoscope className="h-4 w-4" aria-hidden="true" />
                Connect with Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MedicalDisclaimer({
  className = "mt-16 w-full sm:mt-20",
  overlay = false,
}: {
  className?: string;
  overlay?: boolean;
}) {
  if (overlay) {
    return (
      <div className="mt-6 w-full max-w-3xl px-4 text-center sm:mt-8 sm:px-6" aria-labelledby="compendium-disclaimer-heading">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10">
            <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="compendium-disclaimer-heading"
              className="text-base text-white/95 sm:text-lg"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Medical Disclaimer
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-white/80 sm:text-sm">
              The Wellness Compounding Guide is provided for educational and informational purposes only. It is not intended as
              medical advice, diagnosis, or treatment recommendations. Peptide therapies should only be pursued under
              the guidance of a qualified, licensed healthcare professional who can evaluate your individual health
              history and goals. Individual results may vary, and not all compounds are appropriate for every person.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/80 sm:text-sm">
              Always consult a physician or another qualified provider before starting, stopping, or modifying any
              wellness protocol.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={className} aria-labelledby="compendium-disclaimer-heading">
      <div className="rounded-2xl border border-primary/20 bg-card/60 p-6 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <AlertTriangle className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="compendium-disclaimer-heading"
              className="text-lg text-foreground sm:text-xl"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Medical Disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              The Wellness Compounding Guide is provided for educational and informational purposes only. It is not intended as
              medical advice, diagnosis, or treatment recommendations. Peptide therapies should only be pursued under
              the guidance of a qualified, licensed healthcare professional who can evaluate your individual health
              history and goals. Individual results may vary, and not all compounds are appropriate for every person.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Always consult a physician or another qualified provider before starting, stopping, or modifying any
              wellness protocol.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PeptideGlossary() {
  const [activeId, setActiveId] = useState<string>(() => slugify(GLOSSARY[0].title));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    GLOSSARY.forEach((group) => {
      const id = slugify(group.title);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToGroup = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="compendium" className="mt-2 w-full pb-10 pt-2 sm:mt-4 sm:pb-20 sm:pt-4">
      <div>
        {/* Mobile category strip */}
        <div className="mt-6 overflow-x-auto overscroll-x-contain lg:hidden">
          <div className="flex gap-2 px-1 pb-2">
            {GLOSSARY.map((group) => {
              const id = slugify(group.title);
              return (
                <button
                  key={id}
                  onClick={() => scrollToGroup(id)}
                  className="min-h-11 shrink-0 rounded-full border border-primary/30 bg-card px-4 py-2.5 text-xs tracking-wide text-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {group.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:mt-14 lg:grid-cols-[170px_1fr]">
          {/* Desktop sticky sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {GLOSSARY.map((group) => {
                const id = slugify(group.title);
                const active = id === activeId;
                return (
                  <button
                    key={id}
                    onClick={() => scrollToGroup(id)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      active
                        ? "bg-primary/10 text-foreground"
                        : "text-foreground/70 hover:bg-primary/5 hover:text-foreground"
                    }`}
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    <span>{group.title}</span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        active ? "bg-primary" : "bg-transparent group-hover:bg-primary/40"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-10 sm:space-y-16">
            {GLOSSARY.map((group) => (
              <div key={group.title} id={slugify(group.title)} className="scroll-mt-24 sm:scroll-mt-28">
                <div className="relative mb-6 overflow-hidden rounded-2xl border border-primary/20 shadow-[0_20px_50px_-30px_rgba(160,130,70,0.5)]">
                  <img
                    src={group.image}
                    alt={`${group.title} — KIAN Privé category`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-40 w-full object-cover sm:h-56"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent" />
                  <h3
                    className="absolute inset-x-0 bottom-0 px-5 pb-4 text-sm uppercase tracking-[0.2em] text-foreground sm:text-base sm:tracking-[0.4em]"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {group.title}
                  </h3>
                </div>
                <div className="h-px w-12 bg-primary/30" />
                <dl className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col rounded-xl border border-primary/20 bg-card/60 p-4 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.35)] sm:p-5"
                    >
                      <dt
                        className="text-lg text-foreground"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {item.name}
                      </dt>
                      <dd className="mt-2 flex-grow text-sm leading-relaxed text-foreground/80">
                        {item.desc}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-14 text-center text-xs italic text-foreground/70">
          For educational reference only. Not medical advice. Availability and Rx status vary by product.
        </p>
      </div>
    </section>
  );
}

