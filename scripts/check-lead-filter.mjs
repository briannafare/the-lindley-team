// Run: node scripts/check-lead-filter.mjs
// The pitches are the real ones that reached the CRM, with names and companies removed.
// The borrower lines are the ones a careless pattern would block.
import assert from "node:assert";
import { looksLikePitch } from "../src/lib/lead-filter.ts";

const pitches = [
  "Hi, what if you had one person you could hand everything off to? Your trained VA runs our custom AI system for you. Reply YES for a quick Zoom or STOP to opt out.",
  "Hi, want the power of AI without having to learn it? We give you a trained VA who operates our custom AI system for you. Your first 30 days are free.",
  "I'm reaching out because we specialize in Virtual Assistants who can assist with a wide range of tasks, including: Prospecting and Lead Generation, Cold Calling",
  "I tried emailing you, but it seems it didn't go through, so I'm reaching out here instead. We offer Virtual Assistants powered by our custom-built AI tools.",
  "Tx Based -- No SEO oversees 28 years experience $199/mo -- Hosting Available at No Extra Charge -- Unsubscribe on Request - Email or Text --",
];

const borrowers = [
  "I'm a veteran and I'd like to know if I qualify for a VA loan.",
  "Can a VA refinance lower my payment? We used our VA benefit in 2019.",
  "Would you be so kind as to remove me from your USPS mailing list? Thank you.",
  "We offer on a house this weekend and need a pre-approval letter. Here is the listing: https://www.zillow.com/homedetails/123",
  "My assistant will send over the pay stubs. Reply when you can.",
  "",
];

for (const p of pitches) assert(looksLikePitch(p), `pitch got through: ${p.slice(0, 60)}`);
for (const b of borrowers) assert(!looksLikePitch(b), `borrower blocked: ${b.slice(0, 60)}`);
assert(!looksLikePitch(undefined));
console.log(`lead filter ok: ${pitches.length} pitches caught, ${borrowers.length} borrower messages let through`);
