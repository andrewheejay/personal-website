"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function read(): Theme {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === "light" || pinned === "dark") return pinned;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", onChange);

  // A theme pinned in another tab should apply here too.
  const fromOtherTab = (e: StorageEvent) => {
    if (e.key !== "theme") return;
    if (e.newValue === "light" || e.newValue === "dark") {
      document.documentElement.dataset.theme = e.newValue;
    } else {
      delete document.documentElement.dataset.theme;
    }
    onChange();
  };
  window.addEventListener("storage", fromOtherTab);

  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
    window.removeEventListener("storage", fromOtherTab);
  };
}

// The server cannot know the visitor's OS preference, so it renders a neutral
// label and the real one arrives on hydration. Guessing here would mismatch.
const serverSnapshot = () => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, serverSnapshot);

  function toggle() {
    const next: Theme = read() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the choice still applies to this page.
    }
    listeners.forEach((l) => l());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme ? `switch to ${theme === "dark" ? "light" : "dark"} mode` : "switch color theme"
      }
      className="inline-flex items-center min-h-[24px] text-body lowercase text-fg transition-colors cursor-pointer"
    >
      {theme === null ? "theme" : theme === "dark" ? "light mode" : "dark mode"}
    </button>
  );
}
