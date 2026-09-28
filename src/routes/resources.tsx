import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";

const kianLogo = "/assets/kian-prive-logo.png";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — KIAN Therapeutics" },
      {
        name: "description",
        content:
          "Guides, articles, and clinical education from KIAN Therapeutics. A home for blogs and other information on physician-supervised peptide therapy.",
      },
      { property: "og:title", content: "Resources — KIAN Therapeutics" },
      {
        property: "og:description",
        content:
          "Guides, articles, and clinical education from KIAN Therapeutics.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/resources" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

type ResourceLink = {
  kind: string;
  title: string;
  summary: string;
  to: "/" | "/faq" | "/consultation" | "/schedule";
  hash?: string;
};

/** Add new articles here. Each entry appears on the public Resources page. */
const RESOURCES: ResourceLink[] = [
  {
    kind: "Guide",
    title: "Wellness Compounding Guide",
    summary:
      "A private selection of peptides and compounds, with notes on what each is used for under physician supervision.",
    to: "/",
    hash: "compendium",
  },
  {
    kind: "Article",
    title: "Peptide therapy questions, answered",
    summary:
      "Carmen Teresa Ramirez, M.D. on how peptides differ from other treatments, how a protocol is chosen, and why compounding should stay under a physician.",
    to: "/faq",
  },
  {
    kind: "Guide",
    title: "How a consultation works",
    summary:
      "What to expect when you connect with a provider to review goals, labs, and a personalized peptide program.",
    to: "/consultation",
  },
];

function ResourcesPage() {
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
            <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            <div className="h-px w-16 bg-primary/40" />
          </div>
          <h1
            className="mt-6 text-center text-3xl text-foreground sm:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Resources
          </h1>
          <p
            className="mt-3 max-w-lg text-center text-sm leading-relaxed text-foreground/80"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Guides, articles, and clinical notes for members of KIAN Therapeutics. New writing will be published here.
          </p>
        </div>

        <section className="mt-12 w-full">
          <div className="space-y-4">
            {RESOURCES.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                hash={item.hash}
                className="block rounded-xl border border-primary/15 bg-card/60 p-5 shadow-[0_10px_30px_-20px_rgba(160,130,70,0.3)] transition-colors hover:border-primary/40 hover:bg-primary/5 sm:p-7"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-primary">{item.kind}</p>
                <h2
                  className="mt-2 text-xl text-foreground"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
