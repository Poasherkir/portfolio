import Link from "next/link";
import { Clock, Globe, Mail } from "lucide-react";
import { contactCopy, hero, profile, socials } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";
import SocialIcon from "@/components/layout/social-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contact-form";

/** The form, plus the answers people want before filling one in. */
export default function ContactSection() {
  return (
    <Section id="contact" className="mx-auto max-w-7xl pb-24">
      <SectionHeader
        id="contact"
        className="relative"
        spacer="mb-14"
        title={
          <>
            LET&apos;S WORK <br /> TOGETHER
          </>
        }
      />

      <div className="z-10 mx-4 grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12">
        <Card className="rounded-xl bg-white/70 backdrop-blur-sm dark:bg-black/70">
          <CardHeader>
            <CardTitle className="font-display text-3xl">{contactCopy.title}</CardTitle>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {contactCopy.body}
            </p>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <Reveal delay={0.1} className="md:pt-4">
          <dl className="space-y-7">
            <div className="flex gap-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <dt className="font-display text-base font-semibold tracking-tight">
                  Response time
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {contactCopy.responseTime}
                </dd>
              </div>
            </div>

            <div className="flex gap-4">
              <Globe className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <dt className="font-display text-base font-semibold tracking-tight">
                  Working remotely
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {profile.location} · {profile.timezone} — a full working day of overlap with
                  Europe, mornings with North America. {profile.legal}
                </dd>
              </div>
            </div>

            {/* The mailto block appears the moment an address is set. */}
            {profile.email && (
              <div className="flex gap-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <div>
                  <dt className="font-display text-base font-semibold tracking-tight">
                    Prefer email?
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Write to{" "}
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
                    >
                      {profile.email}
                    </a>{" "}
                    directly — it reaches the same inbox as the form.
                  </dd>
                </div>
              </div>
            )}
          </dl>

          {hero.availability && (
            <p className="mt-8 flex items-center gap-2.5 border-t border-border pt-8 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inset-0 animate-blip rounded-full bg-brand" />
                <span className="absolute inset-0 rounded-full bg-brand opacity-40 blur-[3px]" />
              </span>
              {hero.availability}
            </p>
          )}

          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <Button key={s.title} asChild variant="outline" size="icon">
                  <Link href={s.href} target="_blank" rel="noreferrer" aria-label={s.title}>
                    <SocialIcon name={s.icon} className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
