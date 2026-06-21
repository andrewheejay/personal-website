import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motion Segmentation — Andrew Heejay Lee",
  description: "Benchmarking seven IMU segmentation algorithms, and testing whether a neural net could match them.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="rounded-md border border-ivory/10 bg-ivory/5 p-4 overflow-x-auto">
      <code className="font-mono text-xs text-ivory/80 whitespace-pre">{children}</code>
    </pre>
  );
}

export default function MotionSegmentation() {
  return (
    <div className="text-ivory text-base leading-relaxed">

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-ivory/10">
        <Link href="/" className="text-sm text-ivory/50 hover:text-ivory lowercase underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">
          ← back
        </Link>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-xl font-medium lowercase text-ivory">motion segmentation</h1>
          <span className="font-mono text-xs text-ivory/40">2024</span>
        </div>
        <p className="text-ivory/60 lowercase">benchmarking seven imu segmentation algorithms, and testing whether a neural net could match them</p>
        <div className="flex gap-2 flex-wrap font-mono text-xs text-ivory/50 lowercase">
          {["python", "signal-processing", "imu", "tensorflow", "scikit-learn", "time-series"].map((tag) => (
            <span key={tag} className="rounded border border-ivory/15 px-2 py-0.5">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4 text-sm text-ivory/50 lowercase pt-1">
          <a href="https://github.com/andrewheejay/motion-segmentation" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
          <span>korea science service international research program</span>
        </div>
      </header>

      {/* Opening */}
      <section className="py-8 space-y-4 lowercase text-ivory/80">
        <p>
          this was the problem they handed me. at the korea science service international research program, working under professor jong gwan lim of mokwon university, i was given a task in motion segmentation: take raw motion-sensor data and figure out, automatically, where one movement ends and the next begins. i&apos;d never worked with an imu before. i&apos;d never done signal processing before. so the first real obstacle wasn&apos;t the code, it was understanding what i was even looking at.
        </p>
        <p>
          an imu, an inertial measurement unit, is the sensor in your phone or smartwatch that tracks acceleration and rotation. it produces a continuous stream of numbers, and &quot;segmentation&quot; means cutting that stream at the right moments: this is where the person started waving, this is where they stopped. get the cut a few samples too early or too late and you&apos;ve mislabeled the motion. learning to think in terms of derivatives, windows, and signal noise, after a lifetime of thinking about data as static tables, was the conceptual wall i had to climb before any of the rest made sense.
        </p>
      </section>

      {/* What I set out to do */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what i set out to do, and what i actually built</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            my ambition going in was to invent something. there are seven well-known segmentation algorithms in the literature, baron, benbasat, choi, eps, guenterberg, kim, and bang, and i wanted to combine their ideas into a new, better method of my own. i tried. it didn&apos;t work. the novel technique i was reaching for never beat the methods it was built from, and at some point i had to be honest that i&apos;d aimed past what i could pull off in the time i had. that failure is the most useful thing the project gave me, so i&apos;m not going to dress it up.
          </p>
          <p>
            what i built instead was a rigorous benchmark. i implemented all seven algorithms against the same imu dataset with labeled ground-truth boundaries, then ran a grid search over each method&apos;s parameters, its thresholds and window sizes, to find the configuration that performed best. scoring each method fairly was its own problem, because &quot;good&quot; here isn&apos;t one number. i scored every configuration on a weighted blend of four things: accuracy, boundary error to the left and right of the true cut (how many samples off the predicted boundary landed), and time delay. i took the top three configurations per algorithm, averaged them, and plotted all seven head to head across those four metrics.
          </p>
          <p>
            then i went past the classical methods. i built feature vectors out of the signal, the raw value, its first differences at several lags, absolute differences, and fed them to a scikit-learn mlp classifier and then a tensorflow model, to test whether a learned model could match what the hand-tuned algorithms did on the same boundary-detection task.
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">architecture</h2>
        <p className="lowercase text-ivory/80">
          the classical benchmark followed the same shape for each of the seven algorithms: load the signal and its ground truth, sweep the parameters, score every configuration.
        </p>
        <CodeBlock>{`import motionSegLib as motion

for ii in range(len(dataRepository)):
    data = np.loadtxt(dataRepository[ii]).mean(1)
    dataP, gd = motion.preprocess(data)
    target = np.loadtxt(targetRepository[ii])
    # run the segmentation method, compare predicted
    # boundaries to target, record ACC / UMBR / UMBL / time delay`}</CodeBlock>
        <p className="lowercase text-ivory/80">each method&apos;s results got ranked by a single weighted score so the seven could be compared on equal footing:</p>
        <CodeBlock>{`weights = {'umbR': 0.3, 'umbL': 0.3, 'acc': 0.2, 'td': 0.2}
df['weighted_score'] = (
    df['UMBR'] * weights['umbR'] + df['UMBL'] * weights['umbL'] +
    df['ACC']  * weights['acc']  + df['timedelay'] * weights['td']
)
top3 = df.sort_values('weighted_score').head(3)`}</CodeBlock>
        <p className="lowercase text-ivory/80">
          for the learned approach, the same preprocessed signal got turned into lagged-difference feature vectors and handed to an mlp classifier and a tensorflow model, scored against the same boundary metrics as the classical seven, though i evaluated both on the same data they were trained on rather than holding out a test set, so these numbers read as a fit check, not a generalization result.
        </p>
      </section>

      {/* Outcome */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">outcome</h2>
        <div className="space-y-4 lowercase text-ivory/80">
          <p>
            i implemented and benchmarked seven motion segmentation algorithms on real imu data, built a fair multi-metric scoring system to compare them, and tested whether mlp and tensorflow models could match the classical methods on the same task. i wrote up the work as a formal technical report and presented the findings on model performance and latency to my faculty mentors and program peers.
          </p>
          <p>
            the novel method i&apos;d hoped to produce isn&apos;t in there, because it didn&apos;t work. what is in there is a clean comparison of how seven established techniques behave on the same data, and a first honest look at whether a learned model can stand in for hand-engineered ones. for a first encounter with signal processing, ending up with a working benchmark and a clear-eyed read on my own failed idea is an outcome i&apos;ll stand behind.
          </p>
        </div>
      </section>

      {/* What I took from it */}
      <section className="py-8 border-t border-ivory/10 space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-ivory/40">what i took from it</h2>
        <p className="lowercase text-ivory/80">
          two things stuck. first, that the ambitious version of a problem and the achievable version are often different problems, and knowing when to switch from one to the other is a skill, not a defeat. second, that being able to read a noisy signal, the thing that intimidated me most at the start, became the part i&apos;m now most comfortable reaching for. the phishing work that came later leaned on audio feature extraction, which is the same muscle: turning a messy continuous signal into something a model can learn from.
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-ivory/10 flex gap-4 text-sm text-ivory/50 lowercase">
        <a href="https://github.com/andrewheejay/motion-segmentation" target="_blank" rel="noopener noreferrer" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">github →</a>
        <Link href="/" className="hover:text-ivory underline underline-offset-2 decoration-ivory/20 hover:decoration-ivory/60">← back to home</Link>
      </footer>

    </div>
  );
}
