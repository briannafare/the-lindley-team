import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MeetTheTeam from "@/components/MeetTheTeam";
import ExploreNeighborhoods from "@/components/ExploreNeighborhoods";
import ColorBlockCTA from "@/components/ColorBlockCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <MeetTheTeam />
      <ExploreNeighborhoods />
      <ColorBlockCTA />
      <Footer />
    </>
  );
}
