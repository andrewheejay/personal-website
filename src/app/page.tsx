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
    year: "2026",
    blurb: (
      <>
        ai engineer at{" "}
        <a href="https://www.dnk.co/" target="_blank" rel="noopener noreferrer">
          dnk
        </a>
        , a fintech company in korea. a call with cory levy of z fellows sent me
        to san francisco for the first time. met gagan biyani (udemy), chris
        farmer (signalfire), and a lot of talented peers.
        <span className="block mt-1.5">
          currently building a context-sharing app.
        </span>
      </>
    ),
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
    <div className="text-fg text-body">

      {/* Identity */}
      <header className="pb-1">
        <h1 className="font-bold text-display">Andrew Heejay Lee</h1>
        <p className="text-lede leading-[1.25] text-fg mt-2 max-w-measure">
          Math + CS @ Penn
        </p>
        <div className="flex gap-5 flex-wrap text-meta text-fg lowercase pt-1">
          {contactLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center min-h-[24px]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>

      {/* Built */}
      <ul className="space-y-2 pb-12">
        {projects.map((project) => {
          const row = (
            <>
              <div className="flex items-baseline gap-3">
                <span className="text-body text-fg shrink-0">{project.year}</span>
                {project.name && (
                  <h3
                    className={
                      "font-bold text-lede lowercase " +
                      (project.slug
                        ? "text-link underline underline-offset-4 transition-colors group-hover:text-link-hover"
                        : "text-fg")
                    }
                  >
                    {project.name}
                  </h3>
                )}
              </div>
              <p className="text-note text-fg lowercase mt-1.5 max-w-measure">
                {project.blurb}
              </p>
            </>
          );

          return (
            <li key={project.slug ?? project.year}>
              {project.slug ? (
                <Link
                  href={`/built/${project.slug}`}
                  data-block
                  className="group block py-3"
                >
                  {row}
                </Link>
              ) : (
                <div className="py-3">{row}</div>
              )}
            </li>
          );
        })}
      </ul>

    </div>
  );
}
