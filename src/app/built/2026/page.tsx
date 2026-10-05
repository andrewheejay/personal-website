import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "out of the notebook — Andrew Lee",
  description: "Until this year, everything I did happened on a Python notebook. This year I decided to try something new — Lime, dnk, San Francisco, and what I'm building now.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-sm border border-rule p-4 overflow-x-auto">
      <code className="font-mono text-code whitespace-pre">{children}</code>
    </pre>
  );
}

export default function Year2026() {
  return (
    <div>

      {/* Header */}
      <header className="space-y-flow">
        <Link href="/" className="inline-flex items-center min-h-[24px] text-muted lowercase">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap mb-[0.12em]">
          <h1 className="font-bold lowercase">out of the notebook</h1>
          <span>2026</span>
        </div>
        <p className="lowercase max-w-measure">there&apos;s never been a better time to build</p>
        <p className="lowercase max-w-measure">
          {["next.js", "fastapi", "gemini", "pinecone", "supabase", "aws", "internal-tools"].join("; ")}
        </p>
        <div className="flex gap-4 flex-wrap lowercase">
          <a href="https://github.com/andrewheejay/Lime" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">lime on github →</a>
          <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">dnk →</a>
        </div>
      </header>

      {/* Opening */}
      <section className="pt-section space-y-flow lowercase max-w-measure">
        <p>
          until this year, the majority of projects i worked on were research: deepfake detection, imu data research, explainable ai phishing detector. everything i did happened on a python notebook. this year i decided to try something new. they say &ldquo;there&apos;s never been a better time to build.&rdquo; and i took that advice to heart.
        </p>
        <p>
          the year is far from over and i&apos;m going to keep building but here&apos;s what i have so far to share:
        </p>
      </section>

      {/* Lime */}
      <section className="pt-section space-y-flow">
        <h2 className="font-bold mb-[0.12em]">lime</h2>
        <div className="space-y-flow lowercase max-w-measure">
          <p>
            how i ended up starting lime was simple. now that i graduated from high school, i had no school dress code, and with all that freedom, i never knew what to wear. i defaulted to wearing the same 3 shirts that i always wore. and after thinking about it after my mom commented on the fact that i never wear anything different, i knew i couldn&apos;t be the only one. the time to decide what to wear may be less than a minute, but when that&apos;s every day, and not one but many people, that compounds to countless hours. that was the goal.
          </p>
          <p>
            so i started by getting my clothes into lime. you take a clear photo of a piece of clothing, and it becomes an entry into the digital closet. it saves each entry and uses vector search along with live weather data to curate an outfit of the day.
          </p>
          <p>
            the most time-consuming part was the vision ingestion pipeline. i used <code className="font-mono text-code normal-case">briaai/RMBG-1.4</code> to remove the background, a gemini model to look at the image of clothes with the backgrounds already removed and to log information about it, and used <code className="font-mono text-code normal-case">all-MiniLM-L6-v2</code> to vectorize the information from gemini.
          </p>
        </div>
        <CodeBlock>{`Browser --photo--> Next.js (Vercel)
  Next.js --POST /items/ingest--> FastAPI (HF Spaces)
    FastAPI --> RMBG-1.4 --> Gemini 2.0 Flash --> MiniLM embedding --> Pinecone
  FastAPI --tags + image--> Next.js --store--> Supabase

Browser --geolocation--> Next.js
  Next.js --GET /recommendations--> FastAPI
    FastAPI --> Open-Meteo --> Pinecone --ranked items--> Next.js`}</CodeBlock>
        <div className="space-y-flow lowercase max-w-measure">
          <p>
            starting from an image taken on a phone, uploading that to the browser app, removing the background, using the vision model, and vectorizing it into a database, getting each individual part to work together to create an end-to-end pipeline was the hard part of the process.
          </p>
          <p>
            lime is no longer live, but the full pipeline worked end-to-end. to be honest, the usability of lime is not really production-grade. but it was a great starting point and a way for me to build full-stack applications using my ml background.
          </p>
        </div>
      </section>

      {/* dnk */}
      <section className="pt-section space-y-flow">
        <h2 className="font-bold mb-[0.12em]">dnk</h2>
        <div className="space-y-flow lowercase max-w-measure">
          <p>
            if you love what you do, you will never work a day in your life. i usually can&apos;t stand 20 minutes of my math 1610 lecture without my body starting to itch in boredom, but when i&apos;m building something i can sit down for hours at a time. just this summer, while all of my friends were out bowling and hanging out, i worked monday to friday 9-6. but honestly, the time at work flew by me.
          </p>
          <p>
            as an ai engineer at dnk, i spent 2 months working on internal software. i had a clear goal. to talk to as many coworkers, and to make their life easier in the slightest way.
          </p>
          <p>
            the biggest project i worked on was nexus 2.0, a full-stack rebuild of the company&apos;s internal cms. because the original system was so broken, i was tasked with a complete rebuild, and that came with crucial decisions on what carries over and what gets dropped, as well as feature additions to make the new edition better than the old.
          </p>
          <p>
            the hardest part wasn&apos;t building the cms itself but making sure that all the functionalities of the old internal cms was transferred in the new. since our company&apos;s main target customers were in the japanese real estate, i had to make sure that nothing broke in the localization translation api. additionally, using aws for the first time for deployment also was a lot of learning, but also really beneficial learning that helped me scale my future projects.
          </p>
          <p>
            looking back at my time in dnk, it was honestly just a fun time where i got paid to do what i loved to do: build. i met so many great mentors, from the ceo matthew shampine, cto richard lee, and the most welcoming team that i could ever ask for.
          </p>
        </div>
      </section>

      {/* San Francisco */}
      <section className="pt-section space-y-flow">
        <h2 className="font-bold mb-[0.12em]">san francisco</h2>
        <div className="space-y-flow lowercase max-w-measure">
          <p>
            working inside a startup is what got me interested in startups. naturally, i went looking for people in that world, and somewhere in that search i crossed paths with cory levy of z fellows on x. after a 30 minute call, i immediately booked a flight: it was my first time traveling sf, in fact, traveling alone.
          </p>
          <p>
            attending many events, i met gagan biyani (udemy) and chris farmer (signalfire), zach yadegari (cal ai), aaron edell (aws), jake brooks (triumph labs), robert wachen (etched) and a lot of other builders. at internapalooza, as i listened to sam altman&apos;s talk, i came back with conviction about what to work on. the models are getting better faster than anyone expected, but robots still can&apos;t do much in the real world, and i became convinced the bottleneck is data, not models.
          </p>
        </div>
      </section>

      {/* Now */}
      <section className="pt-section space-y-flow">
        <h2 className="font-bold mb-[0.12em]">now</h2>
        <p className="lowercase max-w-measure">
          i&apos;m building a physical ai data company out of that conviction. we&apos;re in the early stages, but i&apos;m working actively with the people i&apos;ve met in the past few months, and i&apos;m excited to keep pushing forward. i&apos;m working on different projects, but the important takeaway from the year so far is that i just gotta put my head down and keep making more.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-section space-y-flow lowercase">
        <nav aria-label="more projects" className="flex flex-wrap justify-end gap-x-8 gap-y-2 text-muted">
          <Link href="/built/phishfence" className="inline-flex items-center min-h-[24px]">
            older · phishfence (2025) →
          </Link>
        </nav>
        <div className="flex gap-x-5 gap-y-2 flex-wrap">
          <a href="https://github.com/andrewheejay/Lime" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">lime on github →</a>
          <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px]">dnk →</a>
          <a href="mailto:andrew.heejay.lee@gmail.com" className="inline-flex items-center min-h-[24px]">andrew.heejay.lee@gmail.com</a>
          <Link href="/" className="inline-flex items-center min-h-[24px]">← all projects</Link>
        </div>
      </footer>

    </div>
  );
}
