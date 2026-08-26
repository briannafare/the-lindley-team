import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import { getServiceBySlug } from "@/lib/services";

const service = getServiceBySlug("purchase")!;

export const metadata: Metadata = {
  title: service.seo.title,
  description: service.seo.description,
  keywords: service.seo.keywords,
};

export default function PurchasePage() {
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
