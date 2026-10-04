"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

/**
 * Informational privacy notice. No consent prompt: the site sets no cookies,
 * analytics are cookieless, and only the theme preference is stored locally.
 * Dismissal is remembered in localStorage.
 */
const KEY = "mb.privacy-notice.seen";

export default function PrivacyNotice() {
  // Client-only, since visibility depends on localStorage.
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(KEY) === "1";
    } catch {
      // Storage blocked: show it.
      seen = false;
    }
    if (!seen) {
      const t = window.setTimeout(() => setShow(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className={[
        "fixed z-[3500] print:hidden",
        // Sits above the mobile call-to-action bar.
        "inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)]",
        "md:inset-x-auto md:bottom-6 md:left-6 md:max-w-sm",
        "rounded-xl border border-border bg-card p-4 shadow-lg",
        "animate-in fade-in slide-in-from-bottom-2 duration-500",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This site sets no cookies and does not track you. Page views are counted
          anonymously.{" "}
          <Link href="/privacy" className="text-brand underline underline-offset-4">
            What that means
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="-mr-1 -mt-1 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden className="h-4 w-4" />
          <span className="sr-only">Dismiss privacy notice</span>
        </button>
      </div>
    </div>
  );
}
