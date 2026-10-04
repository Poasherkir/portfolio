import AnimatedBackground from "@/components/animated-background";
import Hero from "@/components/sections/hero";
import ProofStrip from "@/components/sections/proof-strip";
import Flagship from "@/components/sections/flagship";
import Projects from "@/components/sections/projects";
import Skills from "@/components/sections/skills";
import Capabilities from "@/components/sections/capabilities";
import Services from "@/components/sections/services";
import ContactSection from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      {/* The keyboard choreography targets this page's sections. */}
      <AnimatedBackground />
      <Hero />
      <ProofStrip />
      <Flagship />
      <Projects />
      <Skills />
      <Capabilities />
      <Services />
      <ContactSection />
    </>
  );
}
