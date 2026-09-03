import type { Metadata } from "next";
import { CalendarClock, Mail, MapPin } from "lucide-react";
import { contactCopy, profile, services, socials } from "@/data/portfolio";
import Faq from "@/components/sections/faq";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import ContactForm from "@/components/contact-form";
import SocialIcon from "@/components/layout/social-icon";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Malik Boudine — Flutter and React development, Supabase backends, Python automation. Based in Algiers, working remotely, replies within one working day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title={contactCopy.headline} lead={contactCopy.body} />

      <Section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
            <div className="max-w-2xl rounded-xl border border-border bg-card/80 p-7 backdrop-blur-sm md:p-10">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Tell me about the project
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{contactCopy.responseTime}</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-10">
              <div>
                <p className="eyebrow">Direct</p>
                <ul className="mt-4 space-y-3 border-t border-border pt-4">
                  {/* Each row appears only once the detail exists in portfolio.ts. */}
                  {profile.email && (
                    <li>
                      <a
                        href={"mailto:" + profile.email}
                        className="flex items-center gap-2.5 text-sm transition-colors hover:text-brand"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-brand" />
                        {profile.email}
                      </a>
                    </li>
                  )}
                  {profile.calendly && (
                    <li>
                      <a
                        href={profile.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm transition-colors hover:text-brand"
                      >
                        <CalendarClock className="h-4 w-4 shrink-0 text-brand" />
                        Book a call
                      </a>
                    </li>
                  )}
                  {socials.map((s) => (
                    <li key={s.title}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm transition-colors hover:text-brand"
                      >
                        <SocialIcon name={s.icon} className="h-4 w-4 shrink-0 text-brand" />
                        {s.title}
                        <span className="text-muted-foreground">{s.handle}</span>
                      </a>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-brand" />
                    {profile.location} · {profile.timezone}
                  </li>
                </ul>
              </div>

              <div>
                <p className="eyebrow">What I take on</p>
                <ul className="mt-4 space-y-3 border-t border-border pt-4">
                  {services.map((s) => (
                    <li key={s.id} className="text-sm">
                      <span className="font-medium">{s.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {s.timeline}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow">Working with me</p>
                <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                  {profile.legal} Invoices, contracts and handover documents in English or French.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Section>
      <Faq />
    </>
  );
}
