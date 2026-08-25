import Link from "next/link";
import { profile, navLinks, socials } from "@/data/portfolio";
import SocialIcon from "./social-icon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-background/60 backdrop-blur-sm">
      <div className="container py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold tracking-tight">{profile.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{profile.role}</p>
            <p className="mt-4 text-sm text-muted-foreground">{profile.legal}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            <span className="eyebrow mb-1">Pages</span>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                {l.title}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2">
            <span className="eyebrow mb-1">Elsewhere</span>
            {socials.map((s) => (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
                {s.title}
              </a>
            ))}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                <SocialIcon name="mail" className="h-3.5 w-3.5" />
                {profile.email}
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.16em]">
            {profile.location} · {profile.timezone}
          </p>
        </div>
      </div>
    </footer>
  );
}
