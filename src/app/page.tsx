export default function Home() {
  return (
    <div className="space-y-20 text-left max-w-2xl font-serif text-[#F4F1EB] pb-24">
      
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight lowercase">
          andrew heejay lee
        </h1>
        <p className="text-lg md:text-xl text-[#F4F1EB]/70 lowercase italic">
          building machine learning systems on solid ground.
        </p>
      </section>

      {/* Currently */}
      <section className="space-y-6">
        <h2 className="text-2xl font-ogg text-[#F4F1EB]/60 lowercase">
          currently
        </h2>
        <div className="text-lg text-[#F4F1EB]/80 space-y-2 lowercase">
          <p>incoming @ penn (&apos;30)</p>
          <p>summer intern @ dnk (june–august)</p>
          <p>building full-stack with react & next.js</p>
          <p>prototyping machine learning pipelines</p>
        </div>
      </section>

      {/* Selected Work */}
      <section className="space-y-6">
        <h2 className="text-2xl font-ogg text-[#F4F1EB]/60 lowercase">
          selected work
        </h2>
        <div className="space-y-8">

          <div className="opacity-80">
            <h3 className="text-xl lowercase text-[#F4F1EB]">phishfence ml pipeline</h3>
            <p className="text-sm text-[#F4F1EB]/50 lowercase mt-2">phishing email detection utilizing bert-based tokenization and explainable ai</p>
          </div>

          <div className="opacity-80">
            <h3 className="text-xl lowercase text-[#F4F1EB]">bu rise research</h3>
            <p className="text-sm text-[#F4F1EB]/50 lowercase mt-2">research poster symposium and professional abstract presentation</p>
          </div>

          <div className="opacity-80">
            <h3 className="text-xl lowercase text-[#F4F1EB]">stem club operations</h3>
            <p className="text-sm text-[#F4F1EB]/50 lowercase mt-2">scaling infrastructure, hosa competitions, and hosting professional visits</p>
          </div>

        </div>
      </section>

      {/* Pursuits */}
      <section className="space-y-6">
        <h2 className="text-2xl font-ogg text-[#F4F1EB]/60 lowercase">
          pursuits
        </h2>
        <div className="text-lg text-[#F4F1EB]/80 space-y-2 lowercase">
          <p>varsity soccer (lcb) & basketball @ yiss</p>
          <p>curating high-end streetwear</p>
          <p>hunting vintage digicams (lumix tz7)</p>
        </div>
      </section>

      {/* Links */}
      <section className="pt-12">
        <div className="flex gap-8 text-sm text-[#F4F1EB]/50 lowercase">
          <a href="mailto:andrew.heejay.lee@gmail.com" className="hover:text-[#F4F1EB] transition-colors">email</a>
          <a href="https://github.com/andrewheejay" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F1EB] transition-colors">github</a>
          <a href="https://www.linkedin.com/in/andrewheejay/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F1EB] transition-colors">linkedin</a>
        </div>
      </section>

    </div>
  );
}