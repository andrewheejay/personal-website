import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 — Andrew Lee",
  description: "The year I stopped doing research and started building — Lime, internal tooling at a Korean fintech, and the San Francisco trip that decided what came next.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-md border border-fg/10 bg-fg/5 p-4 overflow-x-auto">
      <code className="font-mono text-code text-fg whitespace-pre">{children}</code>
    </pre>
  );
}

export default function Year2026() {
  return (
    <div className="text-fg text-body">

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-fg/10">
        <Link href="/" className="inline-flex items-center min-h-[24px] text-meta lowercase">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-bold text-title lowercase text-fg">2026</h1>
        </div>
        <p className="text-lede text-fg lowercase max-w-measure">the year i stopped doing research and started building</p>
        <p className="text-body text-fg lowercase max-w-measure">
          {["next.js", "fastapi", "gemini", "pinecone", "supabase", "internal-tools", "mcp"].join("; ")}
        </p>
        <div className="flex gap-4 text-meta text-fg lowercase pt-1">
          <a href="https://github.com/andrewheejay/Lime" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">lime on github →</a>
          <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">dnk →</a>
        </div>
      </header>

      {/* Opening */}
      <section className="py-8 space-y-4 lowercase text-fg max-w-measure">
        <p>
          everything on this site before 2026 is research. a competition project, an international research program, a university practicum — three years of work whose output was a paper, a poster, or a number you report. 2026 is the year i stopped doing that and started building things meant for other people to use.
        </p>
        <p>
          the difference isn&apos;t difficulty. it&apos;s what counts as finished. a research project is finished when the result holds up. a product is finished when someone can use it without you standing next to them, and that turns out to be a much longer distance than it looks from inside a notebook.
        </p>
        <p>
          this page is the year in order: the thing i built alone to find out whether i could, the job where i did the same work professionally, and the trip that decided what i&apos;m building now.
        </p>
      </section>

      {/* Lime */}
      <section className="py-8 border-t border-fg/10 space-y-4">
        <h2 className="font-bold text-body text-fg">lime</h2>
        <div className="space-y-4 lowercase text-fg max-w-measure">
          <p>
            i built lime because i couldn&apos;t decide what to wear, and i was pretty sure i wasn&apos;t the only one. every morning is the same small task: stand in front of a closet, forget half of what&apos;s in it, fail to account for the weather, and settle for the same three outfits on rotation. that&apos;s a real problem and a real market, and it was the right size for the thing i actually wanted to find out — whether i could design and ship a full-stack ai product solo, end to end, rather than train a model in a notebook and stop there.
          </p>
          <p>
            so lime does one thing: you take a phone photo of a piece of clothing, and it becomes a tagged, searchable entry in a digital closet. then it uses vector search and live weather to recommend outfits that go together. no manual data entry, no filling in forms about your shirts.
          </p>
          <p>
            the piece i&apos;m proudest of is the vision ingestion pipeline, because it&apos;s where that promise either holds or falls apart. <code className="font-mono text-code text-fg normal-case">briaai/RMBG-1.4</code> strips the background so the model sees the garment and not your bedroom floor. gemini 2.0 flash tags it across five attributes, forced through a pydantic schema so it has to return validated fields instead of a paragraph i&apos;d have to parse and trust. then the item is embedded with <code className="font-mono text-code text-fg normal-case">all-MiniLM-L6-v2</code> into a 384-dimension vector and stored in pinecone. the ordering matters: background removal before tagging makes the tags cleaner, and structured output before storage means a malformed response fails loudly at ingestion instead of quietly poisoning the closet.
          </p>
          <p>
            the decision i&apos;d defend hardest is splitting lime into two independently deployed services rather than one app. next.js owns the ui, auth, and orchestration; fastapi owns the ml pipeline and stays completely stateless. they&apos;re joined by a shared uuid and nothing else.
          </p>
        </div>
        <CodeBlock>{`Browser --photo--> Next.js (Vercel)
  Next.js --POST /items/ingest--> FastAPI (HF Spaces)
    FastAPI --> RMBG-1.4 --> Gemini 2.0 Flash --> MiniLM embedding --> Pinecone
  FastAPI --tags + image--> Next.js --store--> Supabase

Browser --geolocation--> Next.js
  Next.js --GET /recommendations--> FastAPI
    FastAPI --> Open-Meteo --> Pinecone --ranked items--> Next.js`}</CodeBlock>
        <div className="space-y-4 lowercase text-fg max-w-measure">
          <p>
            keeping fastapi stateless is what made the rest manageable. the ml service doesn&apos;t know about users, sessions, or the database; it takes an image or a weather string and returns tags or rankings. all the stateful, security-sensitive work lives in next.js and supabase, which let the heavy python service deploy on hugging face spaces and the front end on vercel, each scaling and failing independently.
          </p>
          <p>
            the hard part was never any single model. it was making four services talk to each other cleanly. getting an image to flow from a browser, through a vercel function, to a stateless python service on another host, through a background remover and a vision model and an embedder, into a vector database, and back as tags the front end could store — that was the actual work. on a solo build there&apos;s no one to hand the integration to. the bug is always in the seams, and the seams are yours. designing the contract between two services taught me more than any individual api call did.
          </p>
          <p>
            lime is live and runs on a free-tier budget. the full pipeline works end to end. the honest limitation is cost: rate limits and quotas cap how much it can do before paid bills start, because i built it to prove the system rather than to absorb production traffic. and i&apos;ll be straight about how it was made — i architected it and made the design calls, and i used ai coding tools heavily throughout, which is how a student ships a four-service product alone.
          </p>
        </div>
      </section>

      {/* dnk */}
      <section className="py-8 border-t border-fg/10 space-y-4">
        <h2 className="font-bold text-body text-fg">dnk</h2>
        <div className="space-y-4 lowercase text-fg max-w-measure">
          <p>
            there&apos;s a line about how if you love what you do, you never work a day in your life. i&apos;d always heard that as the kind of thing people say rather than the kind of thing that happens. this summer is the first time it happened to me. i was in it constantly, and none of it registered as work.
          </p>
          <p>
            what i was in is internal tooling. i spent the summer as the ai engineer at dnk, a fintech company in korea, and nearly everything i built there is the software the company runs on rather than the product its customers see. that changes the measure. nobody picks up an internal tool because they want to, they&apos;re handed it, so the bar isn&apos;t whether it&apos;s impressive. it&apos;s whether people stop working around it.
          </p>
          <p>
            the largest piece is nexus 2.0, a full-stack rebuild of dnk&apos;s internal cms, the system the company&apos;s content lives in. i was lead engineer on it. a rebuild rather than a patch makes the decisions structural: what carries over, what gets dropped, and what the people using it every day have to relearn. that last one is the expensive part, and it&apos;s why a rebuild is a harder sell internally than a new feature is.
          </p>
          <p>
            the piece i&apos;d point at first is an mcp server that turns session logs into slides. a record of what happened goes in, a deck comes out, generated and editable rather than assembled by hand. the generation isn&apos;t the interesting part — running it as an mcp server is, because the work then sits behind a protocol an assistant can call instead of inside an app a person has to open and drive. alongside it, a localization system on a translation api so the platform&apos;s content can be read in more than the one language it was written in, and an ai support chatbot that answers out of an llm-driven internal wiki rather than a static faq, which means it goes stale only when the wiki does.
          </p>
          <p>
            no numbers on this one, and inventing them would undo the point of every other page here. what i can say precisely: the mcp server is built and deployed, the localization system and the chatbot are built, and how far nexus 2.0 has rolled out is the kind of detail i&apos;d rather answer in person than approximate. the implementation stays off this page too — it&apos;s an employer&apos;s platform and not mine to publish.
          </p>
        </div>
      </section>

      {/* San Francisco */}
      <section className="py-8 border-t border-fg/10 space-y-4">
        <h2 className="font-bold text-body text-fg">san francisco</h2>
        <div className="space-y-4 lowercase text-fg max-w-measure">
          <p>
            working inside a startup is what got me interested in startups as a thing rather than as a place i happened to work. so i went looking for people in that world, and somewhere in that search i crossed paths with cory levy of z fellows, who invited me to san francisco. it was my first time there.
          </p>
          <p>
            i met gagan biyani (udemy) and chris farmer (signalfire), and a lot of other builders. what i came back with was a conviction about what to work on: that everyone ends up with a personal agi agent, and that the unsolved part isn&apos;t the agent — it&apos;s the infrastructure and the network behind it.
          </p>
        </div>
      </section>

      {/* Now */}
      <section className="py-8 border-t border-fg/10 space-y-4">
        <h2 className="font-bold text-body text-fg">now</h2>
        <p className="lowercase text-fg max-w-measure">
          i&apos;m building a context-sharing app out of that conviction. it&apos;s early and there&apos;s nothing shipped to point at yet, which is why this page ends here rather than with a link. the through-line from lime is more direct than it looks: both are bets that the interesting problem is the plumbing between services rather than the model in the middle.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-fg/10 space-y-6 lowercase">
        <nav aria-label="more projects" className="flex flex-wrap justify-end gap-x-8 gap-y-2 text-meta">
          <Link href="/built/phishfence" className="inline-flex items-center min-h-[24px]">
            older · phishfence (2025) →
          </Link>
        </nav>
        <div className="flex gap-x-5 gap-y-2 flex-wrap text-meta text-fg">
          <a href="https://github.com/andrewheejay/Lime" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">lime on github →</a>
          <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">dnk →</a>
          <a href="mailto:andrew.heejay.lee@gmail.com" className="inline-flex items-center min-h-[24px]">andrew.heejay.lee@gmail.com</a>
          <Link href="/" className="inline-flex items-center min-h-[24px]">← all projects</Link>
        </div>
      </footer>

    </div>
  );
}
