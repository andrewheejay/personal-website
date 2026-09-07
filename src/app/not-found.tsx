import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "not found — Andrew Lee",
};

export default function NotFound() {
  return (
    <div className="text-fg text-body lowercase">
      <h1 className="font-bold text-title">nothing here</h1>
      <p className="text-fg mt-4 max-w-measure">
        this page doesn&apos;t exist, or it moved. the built log has everything.
      </p>
      <div className="flex gap-x-5 gap-y-2 flex-wrap text-meta text-fg pt-6">
        <Link href="/" className="inline-flex items-center min-h-[24px]">
          ← all projects
        </Link>
        <a
          href="mailto:andrew.heejay.lee@gmail.com"
          className="inline-flex items-center min-h-[24px]"
        >
          andrew.heejay.lee@gmail.com
        </a>
      </div>
    </div>
  );
}
