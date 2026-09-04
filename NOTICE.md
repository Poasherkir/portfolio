# Third-party code

## Spline keyboard scene and its controller

`src/components/animated-background.tsx`, `src/components/animated-background-config.ts`,
`src/hooks/use-media-query.tsx`, the `SkillNames` / `Skill` / `SKILLS` exports in
`src/data/skills-3d.ts`, and `public/assets/skills-keyboard.spline` originate from
[ferhatolmez/portfolio](https://github.com/ferhatolmez/portfolio) by Ferhat Ölmez,
used with his permission.

That repository carries no licence file, so it is otherwise all rights reserved.
Permission was given directly to Malik Boudine for this site and does not extend
to anyone forking or copying from here.

Adapted for this codebase: the sound hook is wired to this project's own
synthesised keyboard audio, the preloader context is this project's, and the
skill data is reduced to the three exports the scene needs.

## Devicon

Icons in `public/assets/devicon/` are MIT licensed. See the licence file in that
directory.
