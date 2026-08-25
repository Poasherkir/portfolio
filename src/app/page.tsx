import Keyboard3D from "@/components/keyboard";
import Hero from "@/components/sections/hero";
import ProofStrip from "@/components/sections/proof-strip";
import Stats from "@/components/sections/stats";
import Flagship from "@/components/sections/flagship";
import Projects from "@/components/sections/projects";
import Services from "@/components/sections/services";
import Process from "@/components/sections/process";
import Skills from "@/components/sections/skills";
import AboutShort from "@/components/sections/about-short";
import ExperienceSection from "@/components/sections/experience";
import Engineering from "@/components/sections/engineering";
import Faq from "@/components/sections/faq";
import ContactSection from "@/components/sections/contact";

/**
 * Order is an argument, not a layout.
 *
 * Claim (hero) → evidence (proof, numbers) → the single best proof in depth
 * (flagship) → the rest of the work → what you can hire → how it gets
 * delivered → what it is built with → who is building it → how the code is
 * written → objections → ask. A visitor can stop at any point and have got a
 * complete, honest answer up to there.
 */
export default function HomePage() {
  return (
    <>
      {/* The 3D board lives on the home page only. Its choreography is written
          against this page's sections, and on a text-dense page like /stack it
          just floats over the content competing for attention. */}
      <Keyboard3D />
      <Hero />
      <ProofStrip />
      <Stats />
      <Flagship />
      <Projects />
      <Services />
      <Process />
      <Skills />
      <AboutShort />
      <ExperienceSection />
      <Engineering />
      <Faq />
      <ContactSection />
    </>
  );
}
