
import LandingPage from "./components/LandingPage";

import WhatWeDo from "./components/WhatWeDo";
import WeBuilding from "./components/WeBuilding";
import Different from "./components/Different";
import WorkWith from "./components/WorkWith";
import Footer from "./components/Footer";
import AnimatedSection from "./components/AnimatedSection";
import CampusToCareer from "./components/CampusToCareer";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <LandingPage />
      <AnimatedSection delay={0.2}>
        <CampusToCareer />
      </AnimatedSection>

      <AnimatedSection delay={0.4}>
        <WhatWeDo />
      </AnimatedSection>
      <AnimatedSection delay={0.5}>
        <WeBuilding />
      </AnimatedSection>
      <AnimatedSection delay={0.6}>
        <Different />
      </AnimatedSection>
      <AnimatedSection delay={0.7}>
        <WorkWith />
      </AnimatedSection>
      <Footer />
    </div>
  );
}
