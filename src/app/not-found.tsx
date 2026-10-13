import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "not found — Andrew Lee",
};

export default function NotFound() {
  return (
    <div className="lowercase">
      <h1 className="font-bold">nothing here</h1>
      <p className="mt-flow max-w-measure">
        this page doesn&apos;t exist, or it moved. the built log has everything.
      </p>
      <div className="flex gap-x-5 gap-y-2 flex-wrap pt-section">
        <Link href="/" className="inline-flex items-center min-h-[24px]">
          ← all projects
        </Link>
        <a
          href="mailto:andrew@duetlabs.co"
          className="inline-flex items-center min-h-[24px]"
        >
          andrew@duetlabs.co
        </a>
      </div>
    </div>
  );
}
