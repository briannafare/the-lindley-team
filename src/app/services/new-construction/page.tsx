import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServicePageLayout from "@/components/services/ServicePageLayout";
import { getServiceBySlug } from "@/lib/services";

const service = getServiceBySlug("new-construction")!;

export const metadata: Metadata = {
  title: service.seo.title,
  description: service.seo.description,
  keywords: service.seo.keywords,
};

export default function NewConstructionPage() {
  return (
    <>
      <Nav />
      <ServicePageLayout service={service} />
      <Footer />
    </>
  );
}
