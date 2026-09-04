"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

/**
 * Privacy notice, in the slot a cookie banner would occupy.
 *
 * It does not ask for consent, because there is nothing here to consent to:
 * no route on this site sends a Set-Cookie header, the analytics in use are
 * the cookieless kind, and the only thing written to your device is the
 * light/dark preference — which is exempt as strictly necessary in every
 * regime that would otherwise require a banner.
 *
 * Putting up an accept/reject gate anyway would state something untrue about
 * what the site does and tax every first visit for it. This says what actually
 * happens, links to the detail, and goes away.
 *
 * The dismissal is kept in localStorage rather than a cookie, which would be
 * a fine irony to miss.
 */
const KEY = "mb.privacy-notice.seen";

export default function PrivacyNotice() {
  // Never render on the server: the answer depends on this browser's storage,
  // and guessing produces a banner that flashes in and out on every load.
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(KEY) === "1";
    } catch {
      // Private mode, or storage blocked. Showing it once per visit is the
      // safer failure than never showing it.
      seen = false;
    }
    if (!seen) {
      // Let the page settle first — arriving at the same moment as the content
      // makes it feel like an interruption rather than a footnote.
      const t = window.setTimeout(() => setShow(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* Nothing to do — it simply shows again next time. */
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
        // Clears the standing mobile call to action, which owns the bottom edge.
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
