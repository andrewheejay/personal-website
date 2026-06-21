import Link from "next/link";

export default function Home() {
  return (
    <div className="text-ivory text-base leading-relaxed">

      {/* Identity */}
      <header className="space-y-2 pb-10">
        <h1 className="text-xl font-medium lowercase">andrew heejay lee</h1>
        <p className="text-ivory/60 lowercase">builder, incoming @ penn (&apos;30)</p>
        <div className="flex gap-4 text-sm text-ivory/50 lowercase pt-1">
          <a href="mailto:andrew.heejay.lee@gmail.com" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">email</a>
          <a href="https://github.com/andrewheejay" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github</a>
          <a href="https://www.linkedin.com/in/andrewheejay/" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">linkedin</a>
        </div>
      </header>

      {/* Now */}
      <section className="pb-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40 pb-3">now</h2>
        <div className="space-y-1 lowercase text-ivory/80">
          <p>summer intern @ dnk (june–august)</p>
          <p>building full-stack with react & next.js</p>
          <p>prototyping machine learning pipelines</p>
        </div>
      </section>

      {/* Built */}
      <section className="pb-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40 pb-3">built</h2>
        <div className="space-y-6">

          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ivory/40 shrink-0">2026</span>
              <Link href="/built/lime" className="lowercase text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">lime</Link>
            </div>
            <p className="text-sm text-ivory/60 lowercase mt-1">
              an ai digital wardrobe: snap a photo of clothing, get it tagged and embedded, and get weather-aware outfit recommendations. solo-built four-service product (next.js, fastapi, gemini, pinecone).
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ivory/40 shrink-0">2025</span>
              <Link href="/built/phishfence" className="lowercase text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">phishfence</Link>
            </div>
            <p className="text-sm text-ivory/60 lowercase mt-1">
              phishing email detection that explains itself, bert classifier at 99.31% accuracy paired with shap + gemini for plain-language explanations. bu rise data science practicum, first author.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ivory/40 shrink-0">2024</span>
              <Link href="/built/motion-segmentation" className="lowercase text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">motion segmentation</Link>
            </div>
            <p className="text-sm text-ivory/60 lowercase mt-1">
              benchmarked seven imu segmentation algorithms and tested whether a neural net could match them. korea science service international research program.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-ivory/40 shrink-0">2023</span>
              <Link href="/built/authentivox" className="lowercase text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">authentivox</Link>
            </div>
            <p className="text-sm text-ivory/60 lowercase mt-1">
              real-time voice phishing detection, 98.46% accuracy with a random forest classifier light enough to run without a gpu. ksef silver medal.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
