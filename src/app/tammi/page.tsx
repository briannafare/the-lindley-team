import type { Metadata } from "next";
import VideoMessagePage from "@/components/VideoMessagePage";

// Landing page for the Lindley Team move postcard's QR code. Not a search page, so noindex.
export const metadata: Metadata = {
  title: "A message from Tammi",
  description: "Two minutes from Tammi, and the team's new contact info.",
  alternates: { canonical: "https://thelindleyteam.com/tammi" },
  robots: { index: false, follow: false },
};

export default function TammiPage() {
  return (
    <VideoMessagePage
      firstName="Tammi"
      videoId="b9Oo-0J1b4A"
      videoTitle="Tammi Lindley with a Lindley Team update"
      intro="Tammi started this team in 2004. She wanted to tell you about the changes herself, so here she is. It's two minutes."
    />
  );
}
