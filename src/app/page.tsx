import Keyboard3D from "@/components/keyboard";
import Hero from "@/components/sections/hero";
import ProofStrip from "@/components/sections/proof-strip";
import Flagship from "@/components/sections/flagship";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Services from "@/components/sections/services";
import ContactSection from "@/components/sections/contact";

/**
 * Six sections: the claim, the best proof in depth, the rest of the work, what
 * it is built with, what you can hire, the ask. Everything else lives on its
 * own page rather than making this one longer.
 */
export default function HomePage() {
  return (
    <>
      {/* Home page only — the choreography is written against these sections. */}
      <Keyboard3D />
      <Hero />
      <ProofStrip />
      <Flagship />
      <Projects />
      <Skills />
      <Services />
      <ContactSection />
    </>
  );
}
