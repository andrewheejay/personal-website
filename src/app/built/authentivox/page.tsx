import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "authentivox — andrew heejay lee",
  description: "Real-time voice phishing detection with a random forest classifier light enough to run without a GPU.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-md border border-ivory/10 bg-ivory/5 p-4 overflow-x-auto">
      <code className="font-mono text-xs text-ivory/80 whitespace-pre">{children}</code>
    </pre>
  );
}

export default function Authentivox() {
  return (
    <div className="text-ivory text-base leading-relaxed">

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-ivory/10">
        <Link href="/" className="text-sm text-ivory/50 hover:text-ivory lowercase underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-xl font-medium lowercase text-ivory">authentivox</h1>
          <span className="font-mono text-xs text-ivory/40">2023</span>
        </div>
        <p className="text-ivory/60 lowercase">real-time voice phishing detection</p>
        <div className="flex gap-2 flex-wrap font-mono text-xs text-ivory/50 lowercase">
          {["python", "machine-learning", "audio", "random-forest", "librosa"].map((tag) => (
            <span key={tag} className="rounded border border-ivory/15 px-2 py-0.5">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4 text-sm text-ivory/50 lowercase pt-1">
          <a href="https://github.com/andrewheejay/Authentivox" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
          <span>published in int&apos;l journal of steam</span>
          <span>ksef silver medal</span>
        </div>
      </header>

      {/* Opening */}
      <section className="py-8 space-y-4 lowercase text-ivory/80">
        <p>
          my grandmother lost around $45,000 to a phishing scam. the money was bad enough, but the part that stayed with me was what it did to her afterward: she carried it quietly, feeling she had let the family down. watching that is what made this real to me. phishing isn&apos;t an abstract security topic when it&apos;s someone you love sitting with that kind of shame.
        </p>
        <p>
          i chose to go after one specific form of it. voice phishing runs on a simple trick: clone a familiar voice, call the target, and ask for money or credentials before they have time to doubt what they&apos;re hearing. in korea it&apos;s common enough that most people know someone who&apos;s been hit. i wanted to know whether a model could catch the fake while the call was still happening, on a normal phone, without a server farm behind it.
        </p>
      </section>

      {/* What I built */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what i built</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            authentivox is a binary classifier that listens to short audio frames and decides whether each one is a real human voice or an ai-generated one. the constraint that shaped every decision was the &quot;real-time, on a phone&quot; part. a model that needs a gpu to keep up is useless to someone standing in a kitchen taking a scam call.
          </p>
          <p>
            the pipeline is straightforward by design. each audio file gets broken out into a set of acoustic features with librosa: a chromagram, rms energy, spectral centroid, spectral bandwidth, spectral rolloff, zero-crossing rate, and the first twenty mel-frequency cepstral coefficients. those features are what a synthetic voice tends to give itself away on. mfccs in particular model the way humans actually perceive sound, so they pick up the small spectral artifacts that voice-conversion models leave behind.
          </p>
          <p>
            for the classifier i tested the field and landed on random forest. xgboost scored slightly higher in the literature and in my own runs, but it&apos;s heavier to compute, and the whole point was to run without a gpu. random forest gave me almost the same accuracy at a fraction of the compute, which is the trade that actually matters for a phone app. it&apos;s an ensemble of decision trees voting on each frame, which also makes it harder to overfit a small dataset than a single deep model would be.
          </p>
          <p>the core of it is about as much code as you&apos;d hope. pull the features per audio file:</p>
        </div>
        <CodeBlock>{`chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
rms         = librosa.feature.rms(y=y)
centroid    = librosa.feature.spectral_centroid(y=y, sr=sr)
bandwidth   = librosa.feature.spectral_bandwidth(y=y, sr=sr)
roll_off    = librosa.feature.spectral_rolloff(y=y, sr=sr)
zero_cross  = librosa.feature.zero_crossing_rate(y=y)
mfcc        = librosa.feature.mfcc(y=y, sr=sr)`}</CodeBlock>
        <p className="lowercase text-ivory/80">then fit the forest, repeated across 28 random 70:30 splits:</p>
        <CodeBlock>{`for i in range(28):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=i)

    model = RandomForestClassifier(n_estimators=50, random_state=i)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    # accuracy, precision, recall, F1, MCC, ROC-AUC per run`}</CodeBlock>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            that&apos;s the whole engine. the interesting work isn&apos;t the model call, it&apos;s choosing features that expose what a voice-conversion model can&apos;t fake and picking a classifier light enough to live on a phone.
          </p>
          <p>
            i trained on kaggle&apos;s deep-voice dataset: 64 audio samples, 8 real and 56 fake, built from eight public figures whose voices were converted into each other with retrieval-based voice conversion. the model trains on a precomputed, already-balanced feature set i recovered from my original project files — 5,889 real and 5,889 fake rows, one row per roughly one-second window across all 64 files. the forest is 50 trees, validated with repeated random 70:30 train/test splits rather than k-fold, since that&apos;s the validation method the underlying paper describes. built and tested on a macbook air m4, python 3.13, scikit-learn for the model and metrics, matplotlib and seaborn for the plots.
          </p>
        </div>
      </section>

      {/* The hard part */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">the hard part</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            the data barely exists. that&apos;s the real obstacle in this whole problem space, and it&apos;s a direct consequence of what the crime is. actual voice phishing recordings are tied up in active criminal cases and stuffed with victims&apos; personal information, so they almost never get released publicly. you can&apos;t just download a corpus of real scam calls to train on.
          </p>
          <p>
            so i worked around it the way the available research does: use a public dataset of cloned public-figure voices as a stand-in for the manipulated audio a scammer would produce. it&apos;s a reasonable proxy, the same voice-conversion tech is involved, but i want to be clear about what it means. the model learned to separate real from synthetic on this dataset, not on field recordings of live scams. closing that gap needs data that, for good reasons, is hard to get. that limitation is the most important thing the project taught me, and it&apos;s the first thing i&apos;d flag to anyone trying to take this further.
          </p>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">outcome</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            the random forest model hit 98.46% average accuracy, with precision at 0.99 and recall at 0.98 across the 28 runs — matching, and slightly exceeding, the 95.93% the published paper reports. getting there took going back and re-verifying the work instead of just trusting the old number: the script that built the original feature dataset was lost, and a from-scratch reconstruction that pooled every raw audio frame ran into a real 8-real-vs-56-fake class imbalance, landing at 94.18% accuracy but only 0.55 recall. digging through my old project files turned up the actual precomputed, already-balanced dataset behind the original result, and training on that is what reproduced the paper&apos;s numbers for real.
          </p>
          <p>
            it does all of this without a gpu, which was the whole bet. the work was published in the international journal of steam and took a silver medal at the 2024 korean science and engineering fair, along with a kusef finalist placement and a cjsj semi-final. the name authentivox came later, when i packaged the research as something that could actually ship rather than a paper with a title too long to fit on a button.
          </p>
        </div>
      </section>

      {/* What's next */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what&apos;s next</h2>
        <p className="lowercase text-ivory/80">
          the obvious extension is the thing the constraint was always pointing at: a mobile app that runs the classifier on a live call and warns the user mid-conversation. the model&apos;s light enough for it. the harder, more interesting problem is the data one, finding an ethical path to training signal that looks like real scams instead of cloned celebrity speeches.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-ivory/10 flex gap-4 text-sm text-ivory/50 lowercase">
        <a href="https://github.com/andrewheejay/Authentivox" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
        <Link href="/" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">← back to home</Link>
      </footer>

    </div>
  );
}
