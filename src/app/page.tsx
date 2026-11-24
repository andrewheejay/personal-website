import AsciiFigure from "./components/AsciiFigure";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const contactLinks = [
  { href: "mailto:andrew@duetlabs.co", label: "andrew@duetlabs.co" },
  { href: "https://github.com/andrewheejay", label: "github" },
  { href: "https://www.linkedin.com/in/andrewheejay/", label: "linkedin" },
];

export default function Home() {
  return (
    <div className="lowercase">
      <AsciiFigure />

      {/* Written for investors and duet contacts: the backing and the raise
          lead, then the work that backs up the cto role. */}
      <section className="space-y-flow max-w-measure">
        <p>
          <strong>hey i&apos;m andrew.</strong> cofounder &amp; cto @{" "}
          <a href="https://duetlabs.co" {...ext}>
            duet labs
          </a>{" "}
          (a16z speedrun), where{" "}
          <a href="https://idhant.dev" {...ext}>
            idhant
          </a>{" "}
          and i teach robots by having them watch people work together.
          we&apos;ve raised $1.36m. grew up in seoul, now math + cs at penn and
          a z fellow.
        </p>
        <p>
          before duet, i did research on{" "}
          <a href="https://github.com/andrewheejay/motion-segmentation" {...ext}>
            motion segmentation
          </a>{" "}
          (breaking human movement into steps), built things that catch
          scammers, like{" "}
          <a href="https://github.com/thomasha1310/phishfence" {...ext}>
            phishfence
          </a>{" "}
          and{" "}
          <a href="https://github.com/andrewheejay/Authentivox" {...ext}>
            authentivox
          </a>
          , and made small things i use myself, like{" "}
          <a href="https://fitgrid.xyz" {...ext}>
            fitgrid
          </a>
          .
        </p>
        <p>i&apos;ve played cello since i was 3.</p>
      </section>

      <details className="mt-[1.1em] max-w-measure">
        <summary className="inline-flex cursor-pointer items-baseline gap-[0.35em] text-muted">
          a few more things{" "}
          <span aria-hidden="true" className="more-arrow inline-block transition-transform duration-200">
            ↓
          </span>
        </summary>
        <ul className="mt-[0.5em] space-y-[0.1em]">
          <li>2025 national club basketball champion</li>
          <li>varsity basketball, soccer, and track, with 7+ recruiting offers incl. caltech</li>
          <li>korean national astronomy olympiad team summer camp</li>
          <li>
            reading religion and philosophy (<em>confessions</em>,{" "}
            <em>consolation of philosophy</em>)
          </li>
        </ul>
      </details>

      <p className="mt-section">
        {contactLinks.map((link, index) => (
          <span key={link.href}>
            {index > 0 && <span className="text-muted"> · </span>}
            <a href={link.href} {...(link.href.startsWith("http") ? ext : {})}>
              {link.label}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
