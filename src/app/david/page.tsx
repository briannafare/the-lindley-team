import type { Metadata } from "next";
import VideoMessagePage from "@/components/VideoMessagePage";

// Landing page for David's postcard QR code (his past clients). Not a search page, so noindex.
// VIDEO_ID: David's YouTube video. Placeholder until Bri sends the link.
const VIDEO_ID = "REPLACE_WITH_DAVID_VIDEO_ID";

export const metadata: Metadata = {
  title: "A message from David",
  description: "A short message from David, and the team's new contact info.",
  alternates: { canonical: "https://thelindleyteam.com/david" },
  robots: { index: false, follow: false },
};

export default function DavidPage() {
  return (
    <VideoMessagePage
      firstName="David"
      videoId={VIDEO_ID}
      videoTitle="David Chandler with a ChandlerLindley Team update"
      intro="David wanted to tell you about the changes himself, so here he is. It's short."
    />
  );
}
