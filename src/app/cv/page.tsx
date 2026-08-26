import type { Metadata } from "next";
import { Download, Printer } from "lucide-react";
import {
  about,
  featuredProjects,
  foundations,
  profile,
  seo,
  skillGroups,
  socials,
} from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import PrintButton from "@/components/print-button";

export const metadata: Metadata = {
  title: "CV",
  description: seo.description.short,
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  const hasDownload = Boolean(profile.cv.en || profile.cv.fr);

  return (
    <>
      <PageHeader
        eyebrow="Curriculum vitae"
        title="The short version, on one page."
        lead="Everything below is also downloadable. If you need it in a different format for a client or a platform, ask."
      >
        <div className="flex flex-wrap gap-3 print:hidden">
          {/* Download buttons appear as soon as the PDFs are dropped in. */}
          {profile.cv.en && (
            <Button asChild>
              <a href={profile.cv.en} download>
                <Download className="h-4 w-4" />
                CV (English)
              </a>
            </Button>
          )}
          {profile.cv.fr && (
            <Button asChild variant={profile.cv.en ? "outline" : "default"}>
              <a href={profile.cv.fr} download>
                <Download className="h-4 w-4" />
                CV (Français)
              </a>
            </Button>
          )}
          <PrintButton variant={hasDownload ? "ghost" : "default"}>
            <Printer className="h-4 w-4" />
            Print / save as PDF
          </PrintButton>
        </div>
      </PageHeader>

      <Section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-14">
            {/* Header block */}
            <header>
              <h2 className="font-display text-3xl font-semibold tracking-tight">{profile.name}</h2>
              <p className="mt-1 text-muted-foreground">{profile.role}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted-foreground">
                <li>
                  {profile.location} · {profile.timezone}
                </li>
                {profile.email && <li>{profile.email}</li>}
                {socials.map((s) => (
                  <li key={s.title}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.href.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                ))}
              </ul>
            </header>

            {/* Summary */}
            <section>
              <h3 className="eyebrow">Summary</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {about.lead} {seo.description.short}
              </p>
            </section>

            {/* Selected work — projects stand in for employment history, which
                is the honest shape of a freelance CV at this stage. */}
            <section>
              <h3 className="eyebrow">Selected work</h3>
              <ul className="mt-5 space-y-7 border-t border-border pt-5">
                {featuredProjects.map((p) => (
                  <li key={p.slug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="font-display text-lg font-semibold tracking-tight">
                        {p.title}
                      </h4>
                      <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.role}</p>
                    <p className="mt-2 text-sm leading-relaxed">{p.tagline}</p>
                    {p.stack.length > 0 && (
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        {p.stack.join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section>
              <h3 className="eyebrow">Technical skills</h3>
              <dl className="mt-5 space-y-4 border-t border-border pt-5">
                {skillGroups.map((g) => (
                  <div key={g.title} className="sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="text-sm font-semibold">{g.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground sm:mt-0">
                      {g.items.map((i) => i.name).join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 font-mono text-xs text-muted-foreground">{foundations}</p>
            </section>

            {/* Languages + status */}
            <section>
              <h3 className="eyebrow">Languages & status</h3>
              <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                {profile.languages.map((l) => (
                  <li key={l.name}>
                    <span className="font-medium">{l.name}</span>
                    <span className="text-muted-foreground"> — {l.level}</span>
                  </li>
                ))}
                <li className="pt-2 text-muted-foreground">{profile.legal}</li>
              </ul>
            </section>
          </div>
        </div>
      </Section>
    </>
  );
}
