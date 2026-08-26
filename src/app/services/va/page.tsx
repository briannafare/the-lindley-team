import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import VaCalculator from "@/components/calculators/VaCalculator";
import { getServiceBySlug } from "@/lib/services";
const service = getServiceBySlug("va")!;

export const metadata: Metadata = {
  title: service.seo.title,
  description: service.seo.description,
  keywords: service.seo.keywords,
};

export default function ServicePage() {
  return (
    <>
      <Nav />
      <ServicePageLayout
        service={service}
        calculator={<VaCalculator />}
      />
      <Footer />
    </>
  );
}
