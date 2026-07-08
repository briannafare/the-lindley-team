import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import MeetTheTeam from "@/components/MeetTheTeam";
import ExploreNeighborhoods from "@/components/ExploreNeighborhoods";
import HowItWorks from "@/components/HowItWorks";
import ColorBlockCTA from "@/components/ColorBlockCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Reveal>
        <MeetTheTeam />
      </Reveal>
      <Reveal>
        <ExploreNeighborhoods />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <ColorBlockCTA />
      </Reveal>
      <Footer />
    </>
  );
}
