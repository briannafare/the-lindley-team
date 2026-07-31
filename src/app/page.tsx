import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import MeetTheTeam from "@/components/MeetTheTeam";
import LoanShelf from "@/components/LoanShelf";
import FeatureDivorce from "@/components/FeatureDivorce";
import ExploreNeighborhoods from "@/components/ExploreNeighborhoods";
import HowItWorks from "@/components/HowItWorks";
import Testimonial from "@/components/Testimonial";
import ColorBlockCTA from "@/components/ColorBlockCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ReviewsMarquee />
      <Reveal>
        <MeetTheTeam />
      </Reveal>
      <Reveal>
        <LoanShelf />
      </Reveal>
      <Reveal>
        <FeatureDivorce />
      </Reveal>
      <Reveal>
        <ExploreNeighborhoods />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Testimonial />
      </Reveal>
      <Reveal>
        <ColorBlockCTA />
      </Reveal>
      <Footer />
    </>
  );
}
