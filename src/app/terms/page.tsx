import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LEGAL_UPDATED, LegalBody, type LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for using this site, and the ground rules that apply to freelance engagements before a signed agreement replaces them.",
  alternates: { canonical: "/terms" },
};

/**
 * Two things at once, kept clearly apart: the terms for reading the site, and
 * the default ground rules for an engagement. The second set is explicitly
 * subordinate to a signed contract, because a portfolio page is not the place
 * to settle commercial terms and pretending otherwise would be worse than
 * saying nothing.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: "Using this site",
    paragraphs: [
      `You are welcome to read it, share it and quote it. It is provided as it is: I keep it accurate, but I do not promise it will be available without interruption or free of mistakes.`,
    ],
  },
  {
    heading: "What is mine",
    paragraphs: [
      `The writing, the design and the code of this site are mine. Screenshots of client and personal projects are shown to demonstrate work I did; the products themselves, and their trademarks, belong to whoever owns them.`,
      `Technology logos are from Devicon and are used to identify the tools I work with. Each logo remains the property of its respective owner and their appearance here implies no endorsement of me by anyone.`,
    ],
  },
  {
    heading: "What this site is not",
    paragraphs: [
      `Nothing here is an offer, a quote or a contract. Descriptions of past work say what was built, not what your project will cost or how long it will take. Those come from a conversation about your actual requirements.`,
    ],
  },
  {
    heading: "Getting in touch",
    paragraphs: [
      `Send a real enquiry and you will get a real reply, normally within one working day. Do not use the form for spam, bulk marketing, or anything unlawful.`,
      `An enquiry does not commit either of us to anything. I may decline work — because it is outside what I do, because the timeline is not realistic, or because I am booked.`,
    ],
  },
  {
    heading: "If we work together",
    paragraphs: [
      `The points below are how I work by default. They apply only until a signed agreement, statement of work or client contract exists, and that document replaces every one of them if the two ever disagree.`,
    ],
    list: [
      `Scope, price and timeline are agreed in writing before work starts. Anything added afterwards is quoted separately rather than absorbed silently.`,
      `Invoices are issued in line with what we agreed. I am a registered auto-entrepreneur (ANAE) and invoice internationally.`,
      `Ownership of the delivered work transfers to you on final payment. Until then it remains mine.`,
      `I keep the right to describe the work publicly and show it in this portfolio, unless we agree in writing that I will not. Anything under NDA stays out of it.`,
      `Third-party services a project depends on — hosting, payment providers, APIs — are billed to you and governed by their own terms, not by mine.`,
      `I do not warrant that software will be free of defects. I fix defects in delivered work for an agreed period after handover; beyond that, changes are new work.`,
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      `To the extent the law allows, I am not liable for indirect or consequential loss — lost profit, lost data, lost business — arising from this site or from work delivered. Where liability cannot be excluded, it is limited to the amount you actually paid me for the work in question.`,
      `Nothing here limits liability for anything that cannot lawfully be limited.`,
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      `I operate from Algeria and Algerian law applies, unless a signed agreement between us says otherwise. For international clients the governing law and jurisdiction are usually settled in that agreement, and I am happy to discuss it.`,
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      `These terms can change. The version in force for an engagement is the one that applied when we agreed the work, not whatever is on this page later.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Terms · updated ${LEGAL_UPDATED}`}
        title="Terms of use, and how I work."
        lead="The rules for this site, and the defaults for an engagement — which a signed agreement always overrides."
      />

      <Section className="py-16 md:py-24">
        <div className="container">
          <LegalBody sections={SECTIONS} />

          <Reveal>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm text-muted-foreground">
              {profile.legal} Want the detail before you commit to anything?{" "}
              <Link href="/contact" className="text-brand underline underline-offset-4">
                Start a conversation
              </Link>
              . See also the{" "}
              <Link href="/privacy" className="text-brand underline underline-offset-4">
                privacy page
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
