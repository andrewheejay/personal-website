import RobotFigure from "./components/RobotFigure";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const contactLinks = [
  { href: "mailto:andrew@duetlabs.co", label: "andrew@duetlabs.co" },
  { href: "https://github.com/andrewheejay", label: "github" },
  { href: "https://www.linkedin.com/in/andrewheejay/", label: "linkedin" },
];

export default function Home() {
  return (
    <div className="lowercase">
      <RobotFigure />

      <section className="space-y-flow max-w-measure">
        <p>
          <strong>hey i&apos;m andrew.</strong> cofounder &amp; cto @{" "}
          <a href="https://duetlabs.co" {...ext}>
            duet labs
          </a>{" "}
          (a16z sr 008). we teach robots by having them watch people work
          together, and we&apos;ve raised $1.5m to bring{" "}
          <a href="https://www.cs.utexas.edu/~eunsol/courses/data/bitter_lesson.pdf" {...ext}>
            the bitter lesson
          </a>{" "}
          to multi-actor robotics.
        </p>
        <p>
          grew up in seoul. z fellow and pareto fellow. studying math + cs at
          penn through this semester, then leaving.
        </p>
        <p>
          i&apos;ve explored ml from human motion to what makes people
          distinctly human.
        </p>
        <p className="!mt-[1.3em] italic text-muted">
          two are better than one; because they have a good reward for their
          labour.
        </p>
      </section>

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
