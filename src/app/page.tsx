import Link from "next/link";
/* Entries without a slug have no /built page yet and render as plain rows. */
type Entry = {
  slug?: string;
  year: string;
  /* Omitted for entries that are a year and a note, with nothing to title. */
  name?: string;
  blurb: React.ReactNode;
};

const projects: Entry[] = [
  {
    slug: "2026",
    year: "2026",
    name: "out of the notebook",
    blurb:
      "until this year everything i did happened on a python notebook. this year i decided to try something new: lime, two months as an ai engineer at dnk, a first trip to sf, and the physical ai data company i'm building now.",
  },
  {
    slug: "phishfence",
    year: "2025",
    name: "phishfence",
    blurb:
      "a phishing detector that explains itself, because telling someone “this is a scam” teaches them nothing. 99.31% accurate, and every verdict comes back with the reason in plain english. first author, bu rise data science practicum.",
  },
  {
    slug: "motion-segmentation",
    year: "2024",
    name: "motion segmentation",
    blurb:
      "given raw motion-sensor data, find where one movement ends and the next begins. i benchmarked seven existing methods against each other, then tested whether a neural network could beat them. korea science service international research program.",
  },
  {
    slug: "authentivox",
    year: "2023",
    name: "authentivox",
    blurb:
      "catching a voice-phishing call while it is still happening, on a model small enough to run on an ordinary laptop with no graphics card. 98.46% accurate. ksef silver medal.",
  },
];

const contactLinks = [
  { href: "mailto:andrew.heejay.lee@gmail.com", label: "andrew.heejay.lee@gmail.com" },
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
          <strong>hi! i&apos;m andrew.</strong> i&apos;m a co-founder @{" "}
          <a href="https://duetlabs.co" target="_blank" rel="noopener noreferrer">
            duet labs
          </a>
          , where we&apos;re building the data layer for physical ai. math + cs @
          penn.
        </p>
        <p>built:</p>
      </section>

      {/* Built log, reverse chronological. This is the layout that is mine
          rather than theirs: entries, not a bullet list of credentials. */}
      <ul className="list-none pl-0 mt-flow space-y-flow">
        {projects.map((project) => {
          const row = (
            <>
              <div className="flex items-baseline gap-3">
                <span className="shrink-0">{project.year}</span>
                {project.name && <h2 className="font-bold">{project.name}</h2>}
              </div>
              <p className="max-w-measure">{project.blurb}</p>
              {/* Nothing else in the row says where it goes: the year and name
                  read the same whether or not a page exists behind them. This
                  cue is the affordance, so the name stays plain. */}
              {project.slug && (
                <p>
                  <span data-link>learn more →</span>
                </p>
              )}
            </>
          );

          return (
            <li key={project.slug ?? project.year}>
              {project.slug ? (
                <Link href={`/built/${project.slug}`} data-block className="block">
                  {row}
                </Link>
              ) : (
                <div>{row}</div>
              )}
            </li>
          );
        })}
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
