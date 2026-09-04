import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { profile } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your message is in. Here is what happens next.",
  alternates: { canonical: "/thank-you" },
  // Nothing to gain from this being in search results, and a stray visit here
  // from Google would tell someone their message went through when it did not.
  robots: { index: false, follow: true },
};

/**
 * A real page rather than only a toast, so the submission has a URL. That
 * gives the visitor something they can see and go back to, and gives a
 * conversion something to point at.
 */
export default function ThankYouPage() {
  return (
    <>
      <PageHeader
        eyebrow="Message sent"
        title="Got it. I will come back to you."
        lead="Normally within one working day, and always with a real answer rather than an acknowledgement."
      />

      <Section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                What happens next
              </h2>
              <ol className="mt-6 space-y-5">
                {[
                  "I read it properly, not in a hurry, and work out whether I am actually the right person for it.",
                  "You get either an approach with a timeline and a price, or an honest no with a reason — and a pointer elsewhere if I know one.",
                  "If it looks like a fit, we get on a call and go through the detail before anyone commits to anything.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/40 font-mono text-[0.7rem] text-brand"
                    >
                      {i + 1}
                    </span>
                    <p className="text-base leading-relaxed text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-10 flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  Nothing arrived after a day or two? It is worth checking your spam folder, then
                  emailing me directly
                  {profile.email ? (
                    <>
                      {" "}
                      at{" "}
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-brand underline underline-offset-4"
                      >
                        {profile.email}
                      </a>
                    </>
                  ) : null}
                  .
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/projects">
                    Look at the work
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Back to the start</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
