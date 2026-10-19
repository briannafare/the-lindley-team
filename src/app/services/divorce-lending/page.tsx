import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import { getServiceBySlug } from "@/lib/services";
const service = getServiceBySlug("divorce-lending")!;

export const metadata: Metadata = {
  title: service.seo.title,
  description: service.seo.description,
  keywords: service.seo.keywords,
  alternates: { canonical: "/services/divorce-lending" },
};

export default function ServicePage() {
  return (
    <>
      <Nav />
      <ServicePageLayout
        service={service}
        calculator={<MortgageCalculator variant="compact" />}
      />
      <Footer />
    </>
  );
}
