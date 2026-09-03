import Link from "next/link";
import { ArrowUpRight, Clock, Globe, Mail } from "lucide-react";
import { contactCopy, profile, socials } from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, WipeReveal } from "@/components/reveal";
import SocialIcon from "@/components/layout/social-icon";
import ContactForm from "@/components/contact-form";

/**
 * The close. Large type carries it; the form sits beside rather than under, so
 * the page ends on a statement instead of on a field.
 */
export default function ContactSection() {
  return (
    <Section id="contact" className="pt-section pb-section-sm">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
          <div>
            <WipeReveal>
              <p className="eyebrow">{contactCopy.eyebrow}</p>
            </WipeReveal>

            <Reveal delay={0.05}>
              <h2 className="heading-halo mt-7 max-w-[14ch] font-display text-display-xl">
                {contactCopy.headline}{" "}
                <span className="text-brand">{contactCopy.headlineAccent}</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="copy-halo mt-8 max-w-lg text-body-lg text-muted-foreground">
                {contactCopy.body}
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <dl className="mt-12 grid max-w-lg grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
                {[
                  { icon: Clock, label: "Reply time", value: "One working day" },
                  { icon: Globe, label: "Working from", value: `${profile.location.split(",")[0]} · ${profile.timezone}` },
                  { icon: Mail, label: "Languages", value: "EN · FR · AR" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-card p-5">
                    <Icon className="h-4 w-4 text-brand" aria-hidden />
                    <dt className="eyebrow mt-3">{label}</dt>
                    <dd className="mt-1.5 text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {profile.email && (
              <Reveal delay={0.2}>
                <div className="mt-12">
                  <p className="eyebrow">Or just email me</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group mt-3 inline-flex items-baseline gap-3 font-display text-display-md transition-colors hover:text-brand"
                  >
                    {profile.email}
                    <ArrowUpRight className="h-5 w-5 shrink-0 self-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </a>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                {socials.map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <SocialIcon name={s.icon} className="h-4 w-4" />
                    {s.title}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:pt-2">
            <div className="rounded-xl border border-border bg-card p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-12px_rgba(16,24,40,0.12)] md:p-8">
              <h3 className="font-display text-display-sm">{contactCopy.formTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{contactCopy.responseTime}</p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
