// Movement Mortgage application links. One place, because they show up on /apply, on
// /apply/choose, in MeetTheTeam, and in June's "Text application link" tool in GHL.
//
// Both are `create_profile`, which is the URL a brand-new borrower needs. Bri's used to be an
// `/apply/login` URL, which dropped first-time applicants on a sign-in wall. Fixed 2026-08-12.
export const APPLY_DAVID = "https://easyapp.movement.com/apply/create_profile?userid=10107026";
export const APPLY_BRI = "https://easyapp.movement.com/apply/create_profile?userid=10115700";

// Every generic "Apply" / "Get pre-approved" CTA on the site goes straight here. Nobody should
// have to choose a loan officer just to start an application. The two-officer picker lives at
// /apply/choose and is only linked from places where you have already met both of them.
export const APPLY_DEFAULT = APPLY_BRI;
