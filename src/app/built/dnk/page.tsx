import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "dnk — Andrew Lee",
  description: "Internal platform work at a Korean fintech — a full-stack CMS rebuild, an MCP server that turns session logs into slides, localization, and a support chatbot backed by the internal wiki.",
};

export default function Dnk() {
  return (
    <div className="text-fg text-body">

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-fg/10">
        <Link href="/" className="inline-flex items-center min-h-[24px] text-meta lowercase">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-bold text-title lowercase text-fg">dnk</h1>
          <span className="text-body text-fg">2026</span>
        </div>
        <p className="text-lede text-fg lowercase max-w-measure">the internal platform a korean fintech runs on</p>
        <p className="text-body text-fg lowercase max-w-measure">
          {["internal-tools", "cms", "mcp", "llm", "localization"].join("; ")}
        </p>
        <div className="flex gap-4 text-meta text-fg lowercase pt-1">
          <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">dnk →</a>
          <span>ai engineer</span>
        </div>
      </header>

      {/* Opening */}
      <section className="py-8 space-y-4 lowercase text-fg max-w-measure">
        <p>
          there&apos;s a line about how if you love what you do, you never work a day in your life. i&apos;d always heard that as the kind of thing people say rather than the kind of thing that happens. this summer is the first time it happened to me. i was in it constantly, and none of it registered as work.
        </p>
        <p>
          what i was in is internal tooling. i spent the summer as the ai engineer at dnk, a fintech company in korea, and nearly everything i built there is the software the company runs on rather than the product its customers see. that changes the measure. nobody picks up an internal tool because they want to, they&apos;re handed it, so the bar isn&apos;t whether it&apos;s impressive. it&apos;s whether people stop working around it.
        </p>
        <p>
          one caveat before the rest: this page stays at the level of what these systems do rather than how they work. it&apos;s an employer&apos;s platform and the implementation isn&apos;t mine to publish, so there is less detail here than on the other pages. that&apos;s a deliberate omission, not a thin project.
        </p>
      </section>

      {/* What i built */}
      <section className="py-8 border-t border-fg/10 space-y-4">
        <h2 className="font-bold text-body text-fg">what i built</h2>
        <div className="space-y-4 lowercase text-fg max-w-measure">
          <p>
            the largest piece is nexus 2.0, a full-stack rebuild of dnk&apos;s internal cms, the system the company&apos;s content actually lives in. i was lead engineer on it. a rebuild rather than a patch makes the decisions structural: what carries over, what gets dropped, and what the people using it every day have to relearn. that last one is the expensive part, and it&apos;s why a rebuild is a harder sell internally than a new feature is.
          </p>
          <p>
            the piece i&apos;d point at first is an mcp server that turns session logs into slides. a record of what happened in a session goes in, and a deck comes out, generated and editable rather than assembled by hand. the generation isn&apos;t the interesting part. running it as an mcp server is: the work sits behind a protocol an assistant can call, instead of inside an app a person has to open and drive.
          </p>
          <p>
            then a localization system built on a translation api, so the platform&apos;s content can be read in more than the one language it was written in.
          </p>
          <p>
            and an ai customer support chatbot that answers out of an llm-driven internal wiki. the wiki is the point. a support bot backed by a static faq goes stale the moment anything changes; one backed by the wiki the company already maintains goes stale only when the wiki does. it puts the maintenance where it was happening anyway.
          </p>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-8 border-t border-fg/10 space-y-4">
        <h2 className="font-bold text-body text-fg">outcome</h2>
        <div className="space-y-4 lowercase text-fg max-w-measure">
          <p>
            there are no public numbers on this page, and putting invented ones here would undo the point of every other page on this site. what i can say precisely: the mcp server is built and deployed. the localization system and the support chatbot are built. nexus 2.0 is a rebuild i led, and how far it has rolled out to everyone who will eventually use it is the kind of detail i&apos;d rather answer in person than approximate here.
          </p>
          <p>
            if you want the specifics — adoption, what got faster, how much content moved — ask me directly and i&apos;ll tell you what i&apos;m free to tell you.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-fg/10 space-y-6 lowercase">
        <nav aria-label="more projects" className="flex flex-wrap justify-end gap-x-8 gap-y-2 text-meta">
          <Link href="/built/lime" className="inline-flex items-center min-h-[24px]">
            older · lime (2026) →
          </Link>
        </nav>
        <div className="flex gap-x-5 gap-y-2 flex-wrap text-meta text-fg">
          <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">dnk →</a>
          <a href="mailto:andrew.heejay.lee@gmail.com" className="inline-flex items-center min-h-[24px]">andrew.heejay.lee@gmail.com</a>
          <Link href="/" className="inline-flex items-center min-h-[24px]">← all projects</Link>
        </div>
      </footer>

    </div>
  );
}
