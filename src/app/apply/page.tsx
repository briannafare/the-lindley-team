import { redirect } from "next/navigation";
import { APPLY_DEFAULT } from "@/lib/apply";

// /apply is the target of every "Apply" and "Get pre-approved" button on the site. It sends people
// straight into the application instead of asking them to pick a loan officer first. The picker
// still exists at /apply/choose, linked from /about and from the team cards, where you have
// actually met David and Bri and the choice means something.

// force-dynamic is load-bearing. Prerendered, redirect() bakes the target into the RSC payload and
// serves a 307 with NO Location header, so anything that is not a client-side <Link> navigation
// (a new tab from target="_blank", a pasted URL, a crawler) gets an HTML page instead of a
// redirect. Rendering at request time emits a real Location header. Verified with curl -L.
export const dynamic = "force-dynamic";

export default function ApplyPage() {
  redirect(APPLY_DEFAULT);
}
