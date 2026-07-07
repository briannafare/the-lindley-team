import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import ServicesList from "@/components/ServicesList";
import FieldNotes from "@/components/FieldNotes";
import Testimonial from "@/components/Testimonial";
import Process from "@/components/Process";
import HomeFAQ from "@/components/HomeFAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Mission />
      <ServicesList />
      <FieldNotes />
      <Testimonial />
      <Process />
      <HomeFAQ />
      <CTA />
      <Footer />
    </>
  );
}
