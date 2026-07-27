import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, HelpCircle } from "lucide-react";
import kianLogo from "../assets/kian-prive-logo.png.asset.json";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — KIAN Privé" },
      {
        name: "description",
        content:
          "Expert peptide therapy Q&A with Carmen Teresa Ramirez, M.D., M.Sc., M.B.A., Board Certified Neurologist.",
      },
      {
        property: "og:title",
        content: "Frequently Asked Questions — KIAN Privé",
      },
      {
        property: "og:description",
        content:
          "Expert peptide therapy Q&A with Carmen Teresa Ramirez, M.D., M.Sc., M.B.A., Board Certified Neurologist.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQ,
});

type QA = {
  question: string;
  answer: React.ReactNode;
};

const FAQS: QA[] = [
  {
    question:
      "In simple terms, what are peptides and how do they differ from other treatments you may prescribe as a neurologist?",
    answer:
      "Peptides are short chains of amino acids — the building blocks of protein — that act as signaling molecules throughout the body. Think of them as the body's internal messaging system: they tell cells what to do, when to repair, how to respond to stress, and how to regulate hormones and inflammation. What makes them distinct from many conventional treatments is their precision. Rather than broadly suppressing or stimulating a system, peptides communicate with specific receptors to encourage the body's own healing and regulatory processes. As a neurologist, that specificity is incredibly valuable — we can target neuroprotection, inflammation, or cognitive function without the broad side-effect profiles we often see with pharmaceutical drugs.",
  },
  {
    question:
      "What first sparked your interest in peptide therapy, and how has that evolved throughout your career?",
    answer:
      "On a personal note, in 2012 I presented with severe fatigue, knee swelling, and elevated inflammatory markers. I did not fit into a distinct autoimmune category and was treated as seronegative inflammatory arthritis. After a few years of being started on immunomodulatory therapy, I saw no meaningful change in the joint pain, fatigue, or degree of inflammation beyond modest improvements. I began using peptides to decrease my level of inflammation — and I have not experienced the degree of joint swelling I once had, and no longer suffer from pain or the intermittent cycles of fatigue that once significantly impacted my quality of life. That personal journey transformed my clinical curiosity into conviction. It deepened my commitment to understanding peptide science and exploring its applications for patients who, like me, had not found adequate relief through conventional pathways.",
  },
  {
    question:
      "From your clinical experience, what makes peptides particularly beneficial — and where have you seen the most compelling results?",
    answer:
      "The most compelling results I've witnessed have been in patients dealing with traumatic brain injury, cognitive decline, and chronic neuroinflammation. Peptides like BPC-157 and Semax have shown remarkable potential in supporting neuronal repair and reducing inflammatory markers. What's exciting from a neurological standpoint is that some peptides appear to cross the blood-brain barrier and act directly on central nervous system tissue — which is a significant frontier in brain health. Beyond neurology, I've seen patients report improvements in energy, sleep quality, body composition, and immune resilience, which reflects how interconnected these signaling pathways truly are.",
  },
  {
    question:
      "Every patient is unique. How do you determine which peptide — or combination — is right for a specific patient?",
    answer:
      "It always starts with a thorough clinical evaluation — medical history, current symptoms, labs, and lifestyle factors. Peptide therapy is never one-size-fits-all. I look at what systems are under stress: Is the priority neurological repair? Hormonal balance? Immune regulation? Metabolic function? From there, we layer in the patient's goals and any contraindications. For some patients, a single peptide at a specific dosing protocol is appropriate. For others, a synergistic stack makes more sense. The key is that this decision must be made by a qualified physician who understands both the science and the individual patient — not an algorithm or a wellness trend.",
  },
  {
    question: "Walk us through what actually happens in the body when peptides are introduced.",
    answer:
      "When a peptide is administered — whether by injection, orally, topically, or intranasally — it travels to its target receptor, binds to it, and initiates a cascade of biological responses. Depending on the peptide, this might mean stimulating growth hormone release, reducing cytokine-driven inflammation, accelerating tissue repair, enhancing mitochondrial function, or modulating neurotransmitter activity. The body already produces many of these peptides naturally, but levels decline with age, stress, illness, or injury. Therapeutic peptides essentially replenish or amplify signals the body already understands — which is why the tolerability profile tends to be favorable when used correctly.",
  },
  {
    question:
      "We're seeing peptides sold online and imported from other countries. What are the real dangers of sourcing peptides without physician guidance?",
    answer:
      "This is one of the most important conversations we can have right now. Peptides sourced from unregulated international suppliers or online research chemical markets carry serious risks. First, there is no guarantee of purity, sterility, or accurate dosing — contaminated or mislabeled compounds can cause infections, immune reactions, or systemic harm. Second, without a physician's evaluation, a patient has no way of knowing whether a given peptide is appropriate for their physiology, contraindicated with their medications, or dosed correctly for their goals. Third, many peptides require proper storage and handling — cold chain integrity matters. What you order online may have been compromised long before it reaches you. To meaningfully improve safety, patients should only utilize peptides sourced from a compounding pharmacy operating under USP 503A or 503B standards. These designations ensure that the facility is held to rigorous pharmaceutical-grade manufacturing requirements — including sterility testing, potency verification, and quality control oversight. A 503A pharmacy compounds for individual patient prescriptions, while a 503B outsourcing facility produces larger batches under FDA registration. Either pathway provides a level of accountability and traceability that no foreign or unregulated online source can match. The bottom line: peptide therapy is medicine. It requires medical oversight, pharmaceutical-grade sourcing from a licensed compounding facility, and individualized clinical judgment.",
  },
  {
    question: "What is the difference between a GLP-1 and a peptide?",
    answer:
      "All GLP-1s are peptides — but not all peptides are GLP-1s. A GLP-1, or Glucagon-Like Peptide-1, is one specific type of peptide hormone produced naturally in the gut. It plays a targeted role in regulating blood sugar, slowing digestion, and signaling fullness to the brain. The GLP-1 receptor agonist drugs you hear about — semaglutide, tirzepatide — are pharmaceutical compounds engineered to mimic and extend the action of this natural peptide for the treatment of type 2 diabetes and obesity. The broader world of peptide therapy encompasses thousands of different signaling molecules, each with distinct functions: tissue repair, immune modulation, hormone optimization, cognitive enhancement, sleep regulation, inflammation control, and much more. As a neurologist, the peptides I work with are primarily focused on brain health, neuroprotection, and the central nervous system — a very different clinical application than metabolic GLP-1 therapy, though both reflect the remarkable precision that peptide science offers.",
  },
];

const COMPARISON_ROWS = [
  { label: "Scope", peptides: "Thousands of types", glp1: "One specific hormone class" },
  { label: "Function", peptides: "Varies widely", glp1: "Blood sugar, appetite, weight" },
  { label: "Regulation", peptides: "Compounded / research", glp1: "FDA-approved drugs" },
  { label: "Delivery", peptides: "Injection, oral, topical, nasal", glp1: "Injection or oral" },
  { label: "Primary Use", peptides: "Recovery, brain, hormones, immunity", glp1: "Diabetes, obesity" },
];

function FAQ() {
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
          src={kianLogo.url}
          alt="KIAN Privé"
          className="h-auto w-full max-w-[220px] object-contain"
        />

        <div className="mt-10 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            <div className="h-px w-16 bg-primary/40" />
          </div>
          <h1
            className="mt-6 text-center text-3xl text-foreground sm:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Frequently Asked Questions
          </h1>
          <p
            className="mt-3 max-w-lg text-center text-sm leading-relaxed text-foreground/80"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Expert peptide therapy Q&A with{" "}
            <span className="text-foreground">Carmen Teresa Ramirez, M.D., M.Sc., M.B.A.</span>
            <br />
            Board Certified Neurologist
          </p>
        </div>

        <section className="mt-12 w-full">
          <div className="space-y-6">
            {FAQS.map((qa, index) => (
              <article
                key={index}
                className="rounded-xl border border-primary/15 bg-card/60 p-5 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.3)] sm:p-7"
              >
                <h2
                  className="text-base font-medium leading-snug text-foreground sm:text-lg"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  <span className="mr-2 text-primary" aria-hidden="true">
                    Q{index + 1}.
                  </span>
                  {qa.question}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
                  {qa.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 w-full">
          <div className="flex flex-col items-center">
            <div className="h-px w-24 bg-primary/40" />
            <h2
              className="mt-8 text-center text-2xl text-foreground sm:text-3xl"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Peptides vs. GLP-1s — At a Glance
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-primary/15 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.3)]">
            <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-primary/15 bg-card/80">
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70 sm:px-6"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      &nbsp;
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground sm:px-6"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      Peptides (General)
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground sm:px-6"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      GLP-1s
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, index) => (
                    <tr
                      key={row.label}
                      className={
                        index % 2 === 0 ? "bg-card/30" : "bg-card/60"
                      }
                    >
                      <td
                        className="px-4 py-3 font-medium text-foreground sm:px-6"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      >
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-foreground/85 sm:px-6">
                        {row.peptides}
                      </td>
                      <td className="px-4 py-3 text-foreground/85 sm:px-6">
                        {row.glp1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
