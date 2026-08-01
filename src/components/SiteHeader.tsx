const KIAN_HOME = "https://www.kianprive.com";
const KIAN_SHOP = "https://www.kianprive.com/shop";

const serif = { fontFamily: '"Cormorant Garamond", serif' } as const;

/** Persistent links back to the main KIAN Privé site and shop. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <a
          href={KIAN_HOME}
          className="text-sm tracking-wide text-foreground transition hover:text-primary"
          style={serif}
        >
          KIAN Privé
        </a>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={KIAN_HOME}
            className="inline-flex rounded-full border border-primary/35 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground/85 transition hover:border-primary hover:bg-primary/10"
          >
            Privé site
          </a>
          <a
            href={KIAN_SHOP}
            className="inline-flex rounded-full border border-primary bg-primary px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90"
          >
            Shop
          </a>
        </div>
      </div>
    </header>
  );
}
