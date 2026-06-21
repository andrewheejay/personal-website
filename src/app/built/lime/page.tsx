import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lime — Andrew Heejay Lee",
  description: "An AI digital wardrobe that tells you what to wear.",
};

export default function Lime() {
  return (
    <div className="text-ivory text-base leading-relaxed">

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-ivory/10">
        <Link href="/" className="text-sm text-ivory/50 hover:text-ivory lowercase underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-xl font-medium lowercase text-ivory">lime</h1>
          <span className="font-mono text-xs text-ivory/40">2026</span>
        </div>
        <p className="text-ivory/60 lowercase">an ai digital wardrobe that tells you what to wear</p>
        <div className="flex gap-2 flex-wrap font-mono text-xs text-ivory/50 lowercase">
          {["next.js", "fastapi", "gemini", "pinecone", "supabase", "vision-ai", "vector-search"].map((tag) => (
            <span key={tag} className="rounded border border-ivory/15 px-2 py-0.5">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4 text-sm text-ivory/50 lowercase pt-1">
          <a href="https://github.com/andrewheejay/Lime" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
        </div>
      </header>

      {/* Opening */}
      <section className="py-8 space-y-4 lowercase text-ivory/80">
        <p>
          i built lime because i couldn&apos;t decide what to wear, and i was pretty sure i wasn&apos;t the only one. every morning is the same small task: stand in front of a closet, forget half of what&apos;s in it, fail to account for the weather, and settle for the same three outfits on rotation. that&apos;s a real problem, it&apos;s a real market (closet apps and styling services exist for a reason), and it was the right size to chase a third goal i cared about just as much: proving to myself i could design and ship a full-stack ai product solo, end to end, not just train a model in a notebook.
        </p>
        <p>
          so lime does one thing: you take a phone photo of a piece of clothing, and it becomes a tagged, searchable entry in a digital closet. then it uses vector search and live weather to recommend outfits that actually go together. no manual data entry, no filling in forms about your shirts.
        </p>
      </section>

      {/* What I built */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what i built</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            the piece i&apos;m proudest of is the vision ingestion pipeline, because it&apos;s where the &quot;no manual data entry&quot; promise either holds up or falls apart. when you snap a photo of an item, a few things happen in sequence on the backend. first, <code className="font-mono text-sm">briaai/RMBG-1.4</code> strips the background so the model sees the garment and not your bedroom floor. then gemini 2.0 flash tags it across five attributes: category, silhouette, palette, texture, and aesthetic. i forced that output through a pydantic schema so the model has to return structured, validated fields instead of a paragraph i&apos;d have to parse and trust. finally the item gets embedded with <code className="font-mono text-sm">all-MiniLM-L6-v2</code> into a 384-dimension vector and stored in pinecone for similarity search.
          </p>
          <p>
            that ordering matters. background removal before tagging makes the tags cleaner. structured output before storage means a malformed gemini response fails loudly at ingestion instead of silently poisoning the closet. each step exists because the naive version without it produced worse data.
          </p>
          <p>
            the recommendation side closes the loop. on the styling deck, lime pulls your local weather from open-meteo, turns the conditions into a natural-language description of an ideal outfit, and uses that to re-rank your actual wardrobe by aesthetic fit through vector search. the front end is a tinder-style swipe deck (tops, bottoms, shoes) so building an outfit feels like a game instead of a database query. supabase handles auth, the postgres database, and image storage, with row-level security so one user&apos;s closet stays their own.
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">architecture</h2>
        <p className="lowercase text-ivory/80">
          the decision i&apos;d defend hardest is splitting lime into two independently deployed services instead of one app. next.js owns the ui, auth, and orchestration. fastapi owns the entire ml pipeline and stays completely stateless. they&apos;re joined by a shared uuid and nothing else.
        </p>
        <pre className="rounded-md border border-ivory/10 bg-ivory/5 p-4 overflow-x-auto">
          <code className="font-mono text-xs text-ivory/80 whitespace-pre">{`Browser --photo--> Next.js (Vercel)
  Next.js --POST /items/ingest--> FastAPI (HF Spaces)
    FastAPI --> RMBG-1.4 --> Gemini 2.0 Flash --> MiniLM embedding --> Pinecone
  FastAPI --tags + image--> Next.js --store--> Supabase

Browser --geolocation--> Next.js
  Next.js --GET /recommendations--> FastAPI
    FastAPI --> Open-Meteo --> Pinecone --ranked items--> Next.js`}</code>
        </pre>
        <p className="lowercase text-ivory/80">
          keeping fastapi stateless was the call that made the rest manageable. the ml service doesn&apos;t know about users, sessions, or the database; it takes an image or a weather string and returns tags or rankings. all the stateful, security-sensitive work lives in next.js and supabase. that separation let me deploy the heavy python ml service on hugging face spaces and the fast typescript front end on vercel, each scaling and failing independently.
        </p>
      </section>

      {/* The hard part */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">the hard part</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            the struggle wasn&apos;t any single model. it was making four services talk to each other cleanly. next.js, fastapi, gemini, and pinecone (plus supabase and open-meteo) each work fine alone. getting an image to flow from a browser, through a vercel function, to a stateless python service on a different host, through a background remover and a vision model and an embedder, into a vector database, and then back as tags the front end could store, with weather data and vector rankings flowing the other direction, was the actual work. on a solo build there&apos;s no one to hand the integration to. the bug is always somewhere in the seams between services, and the seams are yours.
          </p>
          <p>
            that&apos;s also where i learned the most. designing the contract between two services, deciding what each one is responsible for and what crosses the boundary, taught me more about building software than any individual api call did.
          </p>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">outcome</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            lime is live and running on a free-tier budget. the full pipeline works: ingest a photo, get it tagged and embedded, browse the closet, and get weather-aware outfit recommendations. the honest limitation is cost. the mvp runs on free api tiers, so rate limits and quotas cap how much it can do before the paid bills would start, and i built it to prove the system, not to absorb production traffic. everything that&apos;s throttled is throttled by billing, not by a gap in the build.
          </p>
          <p>
            i&apos;ll also be straight about how it was made: i architected lime and made the design calls, and i used ai coding tools heavily through the build, which is how i shipped a four-service product solo as a student. the architecture documents in the repo (the system design, the product requirements, the cost analysis) are where my reasoning lives if you want to see the decisions behind the code.
          </p>
        </div>
      </section>

      {/* What's next */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what&apos;s next</h2>
        <p className="lowercase text-ivory/80">
          the obvious next step is putting a card on the apis and letting the free-tier ceiling go, then seeing whether the recommendations hold up at real wardrobe sizes. past that, the interesting product question is personalization: right now lime ranks by aesthetic fit and weather, but a model that learns which of its suggestions you actually swipe right on would make it feel less like a tool and more like a stylist who knows you.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-ivory/10 flex gap-4 text-sm text-ivory/50 lowercase">
        <a href="https://github.com/andrewheejay/Lime" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
        <Link href="/" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">← back to home</Link>
      </footer>

    </div>
  );
}
