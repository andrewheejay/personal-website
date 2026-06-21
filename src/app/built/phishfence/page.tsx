import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PhishFence — Andrew Heejay Lee",
  description: "Phishing email detection that explains itself — BERT classification paired with SHAP and an LLM to translate the verdict into plain language.",
};

export default function Phishfence() {
  return (
    <div className="text-ivory text-base leading-relaxed">

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-ivory/10">
        <Link href="/" className="text-sm text-ivory/50 hover:text-ivory lowercase underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-xl font-medium lowercase text-ivory">phishfence</h1>
          <span className="font-mono text-xs text-ivory/40">2025</span>
        </div>
        <p className="text-ivory/60 lowercase">phishing email detection that explains itself</p>
        <div className="flex gap-2 flex-wrap font-mono text-xs text-ivory/50 lowercase">
          {["bert", "nlp", "explainable-ai", "shap", "gemini", "flask", "python"].map((tag) => (
            <span key={tag} className="rounded border border-ivory/15 px-2 py-0.5">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4 text-sm text-ivory/50 lowercase pt-1">
          <a href="https://github.com/thomasha1310/phishfence" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
          <a href="https://github.com/thomasha1310/phishfence/blob/main/Poster.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">poster →</a>
          <span>bu rise data science practicum</span>
        </div>
      </header>

      {/* Opening */}
      <section className="py-8 space-y-4 lowercase text-ivory/80">
        <p>
          after authentivox, i kept circling the same problem from a different angle. the voice work taught me you could catch a scam with a model. what it didn&apos;t do was help the person understand why the thing in front of them was dangerous. that gap matters, because the people who lose the most to phishing are usually the ones least equipped to read the warning signs: older, less technical, the same kind of person my grandmother was when she lost around $45,000 to a scam. a detector that just says &quot;this is phishing&quot; doesn&apos;t teach anyone anything. it asks them to trust a black box, and people who&apos;ve already been burned have every reason not to.
        </p>
        <p>
          so at the bu rise data science practicum, three of us built phishfence around a different goal: match a state-of-the-art phishing classifier on accuracy, but make every decision explain itself in language a non-technical person can actually use. i was first author on the project. my work covered the non-bert modeling, the explainability layer, and the web app that put it in front of a user.
        </p>
      </section>

      {/* What we built */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what we built</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            phishfence is a pipeline: a raw email goes in, gets preprocessed and tokenized, runs through a classifier, and comes back out with both a verdict and a plain-language explanation of that verdict. the explanation is the point, not an add-on.
          </p>
          <p>
            my first piece was the comparative modeling, the baselines that the headline bert model had to beat to justify its cost. i ran two vectorization approaches, tf-idf and sentence-bert, each paired with four classifiers: logistic regression, random forest, multinomial/gaussian naive bayes, and a multi-layer perceptron. the interesting result was counter-intuitive. tf-idf, the older and far lighter technique, beat the heavier sentence-bert embeddings once you paired them with the simpler models. with tf-idf, the mlp hit 98.2% accuracy; with sbert, most models lost ground. the lesson i took from it: a heavier embedding isn&apos;t automatically a better one, and the cheap approach is worth running before you reach for the expensive one. the fine-tuned bert classifier did win overall at 99.31% accuracy, but knowing exactly how much it beat a logistic-regression-on-tf-idf baseline by is what tells you whether that win was worth the compute.
          </p>
          <p>
            my second piece, and the one closest to the mission, was the explanation layer. i used shap to compute which words and features pushed an email toward &quot;phishing&quot; or &quot;legitimate,&quot; then passed those attributions to the gemini api to turn a list of numerical feature weights into a short, readable explanation. shap on its own gives you a bar chart of token importances, which is meaningful to me and meaningless to my grandmother. running it through an llm closes that gap: instead of &quot;the token &apos;account&apos; contributed +0.21,&quot; the user gets a sentence telling them this email is flagging because it combines an urgent request with a suspicious link. that pairing, shap for the honest math and an llm for the human translation, was the core bet of the project, and it worked.
          </p>
          <p>
            then i built the front end: a flask web app where a user pastes in an email and gets back the classification and its explanation in real time. the model is no use to a vulnerable person if it lives in a notebook, so the app was how the educational goal actually reached someone.
          </p>
          <p>
            the dataset under all of this was a unified corpus of about 82,000 emails (82,138) stitched from six public datasets, roughly balanced at 48% legitimate and 52% malicious.
          </p>
        </div>
      </section>

      {/* The hard part */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">the hard part</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            bert can only read 512 tokens at a time, and real emails are routinely longer than that. that single constraint shaped a surprising amount of the build. you can&apos;t just feed a long phishing email to the model; you have to chunk it into segments under the limit, embed each chunk, and pool the results back into one representation. every step of that costs you something. splitting an email mid-thought breaks the contextual continuity that bert is supposed to be good at, and the pooled representation is a compromise, not the real thing. we measured the cost: chunked long inputs classified less accurately than ones that fit in a single window.
          </p>
          <p>
            it&apos;s the kind of problem you don&apos;t see coming from the headline accuracy number. 99.31% looks clean until you realize it&apos;s an average over a dataset where plenty of emails had to be cut apart to fit the model at all. living with that tradeoff, and being honest about where it degrades, was more instructive than the high score was.
          </p>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">outcome</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            the fine-tuned bert model reached 99.31% accuracy (bert-large-uncased), with precision and recall both above 99%, matching leading phishing classifiers. more important for what we set out to do, the shap-to-gemini layer turned those classifications into explanations a non-technical user could read, and the flask app made the whole thing usable by someone who isn&apos;t a data scientist. we presented phishfence at the bu rise poster symposium, and i was first author on the writeup.
          </p>
          <p>
            the honest limitations are worth stating, because they&apos;re the boundary of what the project actually proves. the training corpus is static, and phishing evolves constantly, so a model trained on today&apos;s scams will drift as attackers change tactics. the system is english-only. and the 512-token constraint means accuracy degrades on long emails. none of these are fatal, but a portfolio that hides them is doing the same black-box thing phishfence was built to push against.
          </p>
        </div>
      </section>

      {/* What's next */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what&apos;s next</h2>
        <p className="lowercase text-ivory/80">
          the natural extensions are the ones that widen access and freshen the data: a browser extension or mobile app instead of a single web page, and a path to training on more current, cross-platform scam data rather than a frozen corpus. architectures like roberta or distilbert could trade a little accuracy for the speed and footprint a real deployment needs. the version that helps someone like my grandmother is the one that lives in the place she&apos;d actually encounter the scam, not on a website she&apos;d have to know to visit.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-ivory/10 flex gap-4 text-sm text-ivory/50 lowercase">
        <a href="https://github.com/thomasha1310/phishfence" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
        <Link href="/" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">← back to home</Link>
      </footer>

    </div>
  );
}
