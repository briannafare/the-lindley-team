import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import DscrCalculator from "@/components/calculators/DscrCalculator";
import { getServiceBySlug } from "@/lib/services";

const service = getServiceBySlug("dscr")!;

export const metadata: Metadata = {
  title: service.seo.title,
  description: service.seo.description,
  keywords: service.seo.keywords,
};

export default function DscrPage() {
  return (
    <>
      <Nav />
      <ServicePageLayout
        service={service}
        calculator={<DscrCalculator />}
      />
      <Footer />
    </>
  );
}
