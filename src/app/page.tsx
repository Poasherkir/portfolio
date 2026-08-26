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
 * Section order: claim, evidence, the work in depth, what you can hire, how it
 * is delivered, what it is built with, objections, ask.
 */
export default function HomePage() {
  return (
    <>
      {/* Home page only — the choreography is written against these sections. */}
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
