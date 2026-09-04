import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LEGAL_UPDATED, LegalBody, type LegalSection } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site collects, what it does not, and who processes it. No cookies, no tracking pixels, no advertising networks.",
  alternates: { canonical: "/privacy" },
};

/**
 * Written against what the site actually does, not from a template. Every
 * claim here was checked: there is no Set-Cookie header on any route, contact
 * submissions go to Resend and land in an inbox rather than a database, and
 * the analytics in use are the cookieless kind. If any of that changes this
 * page has to change with it.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: "The short version",
    paragraphs: [
      `This is a portfolio. It sets no cookies, runs no advertising or tracking pixels, and sells nothing to anyone. The only personal information it ever receives is what you type into the contact form, and that arrives as an email.`,
    ],
  },
  {
    heading: "What the contact form collects",
    paragraphs: [
      `Your name, your email address, and — if you fill them in — your company, your budget range and your message. The company and budget fields are optional and the form works without them.`,
      `That submission is delivered as an email through Resend, a transactional email provider, and lands in my inbox. It is not written to a database, and this site has no user accounts, so there is nothing here to log into or be logged out of.`,
      `I use it to reply to you and to keep track of the work if we go ahead. I do not add you to a mailing list, because there isn't one.`,
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      `None. No consent banner is needed to browse this site because nothing is stored on your device to consent to.`,
      `One exception worth naming precisely: if you switch between the light and dark theme, that preference is saved in your browser's own local storage so the site does not flash the wrong colours next time. It never leaves your device and is not readable by me or anyone else.`,
    ],
  },
  {
    heading: "Analytics",
    paragraphs: [
      `Vercel Analytics counts page views. It is cookieless and does not build a profile of you, follow you between sites, or record anything that identifies you personally.`,
    ],
  },
  {
    heading: "Who else touches your data",
    paragraphs: [
      `Two companies, both only because they run the plumbing:`,
    ],
    list: [
      `Vercel hosts the site and serves every page. Like any web host it processes request data, including your IP address, in order to deliver the page to you.`,
      `Resend delivers the contact form as an email. It sees what you submitted, because that is the message it is carrying.`,
    ],
  },
  {
    heading: "How long it is kept",
    paragraphs: [
      `Contact emails stay in my inbox until they are no longer useful — an enquiry that goes nowhere gets deleted, and correspondence about actual work is kept while that work and its invoicing are live. Ask me to delete yours and I will.`,
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      `Ask me what I hold about you, ask for a copy, ask me to correct it, or ask me to delete it. Email me and I will do it — there is no form to fill in and no process to go through.`,
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      `This site is aimed at people commissioning software work. It is not directed at children and does not knowingly collect anything from them.`,
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      `If what the site does changes, this page changes first. The date at the top is when it was last accurate.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Privacy · updated ${LEGAL_UPDATED}`}
        title="What this site collects, and what it does not."
        lead="Short, because there is not much to say. No cookies, no tracking, no mailing list."
      />

      <Section className="py-16 md:py-24">
        <div className="container">
          <LegalBody sections={SECTIONS} />

          <Reveal>
            <p className="mt-14 max-w-2xl border-t border-border pt-8 text-sm text-muted-foreground">
              Questions about any of this?{" "}
              <Link href="/contact" className="text-brand underline underline-offset-4">
                Ask me directly
              </Link>
              {profile.email ? (
                <>
                  {" "}
                  or email{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-brand underline underline-offset-4"
                  >
                    {profile.email}
                  </a>
                </>
              ) : null}
              .
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
