type Entry = {
  name: string;
  href: string;
  /* One line, after the linked name. Idhant's page sets each credential as a
     single bullet: a short claim with the link inside it. */
  blurb: React.ReactNode;
};

/* No /built pages any more: each entry links straight out. */
const projects: Entry[] = [
  {
    name: "phishfence",
    href: "https://github.com/thomasha1310/phishfence",
    blurb:
      "a phishing detector that explains every verdict, 99.31% accurate",
  },
  {
    name: "authentivox",
    href: "https://github.com/andrewheejay/Authentivox",
    blurb:
      "catches voice-phishing calls live on a laptop with no gpu, 98.46% accurate",
  },
  {
    name: "motion segmentation",
    href: "https://github.com/andrewheejay/motion-segmentation",
    blurb:
      "benchmarked seven motion-segmentation methods, then tested whether a neural network could beat them",
  },
  {
    name: "fitgrid",
    href: "https://fitgrid.xyz",
    blurb:
      "a wardrobe app that builds one fit a day. lock a piece, reroll the rest",
  },
];

const contactLinks = [
  { href: "mailto:andrew@duetlabs.co", label: "andrew@duetlabs.co" },
  { href: "https://github.com/andrewheejay", label: "github" },
  { href: "https://www.linkedin.com/in/andrewheejay/", label: "linkedin" },
];

export default function Home() {
  return (
    <div className="lowercase">

      {/* Opening. The letter shape both co-founders' pages open with: who,
          what, where, in one breath. Every claim here is already on this
          site or on duetlabs.co; nothing is borrowed from their bios. */}
      <section className="space-y-flow max-w-measure">
        <p>
          <strong>hey i&apos;m andrew</strong>, math + cs @ penn, z fellow, and
          co-founder @{" "}
          <a href="https://duetlabs.co" target="_blank" rel="noopener noreferrer">
            duet labs
          </a>
          .
        </p>
        <p>we are building a new data layer for physical ai.</p>
        <p>
          we think robots can learn a lot by watching people work together.
        </p>
        <p>a few things i&apos;ve built:</p>
      </section>

      {/* Built log, reverse chronological, one bullet per entry. */}
      <ul className="mt-[0.3em] space-y-[0.1em] max-w-measure">
        {projects.map((project) => (
          <li key={project.name}>
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
            {": "}
            {project.blurb}
          </li>
        ))}
      </ul>

      <p className="mt-[1em] max-w-measure">when i&apos;m not building:</p>
      <ul className="mt-[0.3em] space-y-[0.1em] max-w-measure">
        <li>varsity basketball, soccer, track; 7+ recruiting offers, incl. caltech</li>
        <li>2025 national club basketball champion</li>
        <li>korean national astronomy olympiad team summer camp</li>
        <li>playing cello (started at age 3)</li>
        <li>
          reading religion and philosophy (<em>confessions</em>,{" "}
          <em>consolation of philosophy</em>)
        </li>
      </ul>

      {/* Contact, the sign-off line both siblings end on. */}
      <p className="mt-section">
        {contactLinks.map((link, index) => (
          <span key={link.href}>
            {index > 0 && <span className="text-muted"> · </span>}
            <a
              href={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          </span>
        ))}
      </p>

    </div>
  );
}
