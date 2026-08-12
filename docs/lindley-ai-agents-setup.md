# The Lindley Team — AI agents

**Status as of 2026-08-11.** This replaces the previous version of this file, which was written
before the move to Movement Mortgage, wired every agent to a Bri-only calendar, and described a
setup that had never actually been built.

Sub-account `hl-lindley-team` · locationId `pe2yBdfaVo406b3BaavZ`

---

## What was wrong, and what changed

The docs in this folder described David Chandler correctly. **Nothing that was actually live did.**

| Surface | Before 2026-08-11 | Now |
|---|---|---|
| Voice agent "Voice Assistant - 1" (June, on the website) | GHL's stock "Customer Support Specialist" template. 2,003 characters. Named June and the team, and said nothing else. No David, no Bri, no NMLS, no compliance, no calendars, no divorce protocol. One tool: the knowledge base. | Rewritten from `ghl-content/june-voice-agent.md`. 15,274 characters. David and Bri as equals, explicit routing between them, hard compliance, divorce protocol. Eight tools. |
| Voice agent "Mortgage Lender" | Unedited GHL sample. Still said `[Mortgage Lender Name]` and `support@mortgagelender.com`, quoted a 620 credit minimum, "most approvals take 30-45 days", "closing costs 2-5%", offered a pre-qualification, and asked callers for the last four digits of their SSN. | Parked. Renamed `PARKED - unused template`, prompt replaced with a refusing stub. Safe to delete. |
| Knowledge base "The Lindley Team" | 6 FAQs. Three still described **Mortgage Express**, called the team a **correspondent lender**, and offered to **broker through our wholesale lending network**. Every answer naming a loan officer named only Bri. | 11 FAQs, all rewritten. Zero banned phrases. Two new ones answer "who is on the team" and "should I talk to David or Bri". |
| Lead capture from June | Every conversation created a `guest visitor NNN` contact with no name, email, phone, or tag, and fired nothing. Four leads already lost. | Call-end workflow `June - call end lead alert` summarizes the conversation and emails **and** texts both David and Bri. |
| Booking | Old doc pointed the AI at "30-Minute Consultation with Bri" (`6f0akEGdvIhvmXJeyV2B`), a round-robin calendar with **Bri as its only member**. That is the literal mechanism by which David was written out. | Booking runs on `Consultation - 30 min` (`iP61EhQ1LwMiCpWjYVXH`), a collective calendar with **both** officers on it. |

---

## The facts every agent must use

Pinned to what thelindleyteam.com actually publishes. Older drafts in this folder disagree with
some of these; the site wins.

- **David Chandler** — Mortgage Loan Officer, NMLS #265974. 20+ years. Licensed **OR, WA, AZ**.
  Jumbo, new construction, self-employed and bank-statement, DSCR and investment, reverse.
- **Bri Lindley** — Mortgage Loan Officer, NMLS #1367416, **CDLP**. Licensed **OR, WA**.
  Grew up in these neighborhoods. Divorce lending is hers.
- Team: ~35 years combined, **156 five-star reviews**, mostly referral.
- **Movement Mortgage, LLC**, NMLS #39179. Impact Lender.
- Office: **10135 SE Sunnyside Rd, Suite 125, Clackamas, OR 97015**.
  *(The "15115 SW Sequoia Parkway" address in older docs is dead.)*
- Phone 971-754-1771 · david.chandler@movement.com · brianna.lindley@movement.com

**Banned positioning, every surface:** "we're a bank", "we shop hundreds of lenders", "broker",
"brokerage", "correspondent lender", "wholesale lending network", "Mortgage Express".
**Banned language:** the word "free" (use complimentary), em dashes, "not X but Y" reframes.

### Routing: who gets the lead

This is the part that was missing everywhere. Every agent states it out loud.

| Situation | Goes to |
|---|---|
| Divorce, separation, equity buyout | **Bri** (CDLP) |
| Jumbo, new construction, self-employed / bank-statement, DSCR / investment, reverse, Arizona | **David** |
| First-time buyer, refinance, neighborhoods, general | **Either.** Say "David or Bri" |
| Asked for by name | That one |

Never say "Bri will call you" about work that is not specifically hers.

---

## June — the voice agent (LIVE)

Agent `6a5fc3d5d0c5f9597a206aa0`, named **June - The Lindley Team**. Reached from the site through
`src/components/JuneWidget.tsx` over Retell/LiveKit. Voice "Bri 2", speed 0.33 (both preserved
through the rewrite; note that changing a voice in the GHL UI silently resets speed to 0.33).

**Prompt source of truth is `docs/ghl-content/june-voice-agent.md`,** not the GHL UI. Editing in
the UI will be overwritten on the next deploy.

### Tools now attached

| Tool | Type | Behaviour |
|---|---|---|
| `knowledge_base` | KNOWLEDGE_BASE | KB `UI50OxMhVCRHS5J2qUpi` |
| Book consultation (David or Bri) | APPOINTMENT_BOOKING | Real slots + booking on `iP61EhQ1LwMiCpWjYVXH`, 3 days out, 2 slots/day. Auto-created `Get Available Slots` and `Book Appointment Slot` sub-actions. |
| Text divorce consult link | SMS | Private consult `OwSdQeWY7mySxMYWPfQN` |
| Text first-time buyer link | SMS | `HO4qop4LqQWemPhKj4IC` |
| Text rate and strategy link | SMS | `nCrKarsV3BLrp1WiwHN8` |
| Text application link | SMS | David's and Bri's Movement application URLs |
| `callEndWorkflowIds` | — | `3634a8d5-4a45-4d8b-bd4e-85ee6eceafa8` |

`isInboundActive` is **false** and no phone number is attached. June is a website agent today.
Attaching a number is a deliberate decision, not a side effect.

### Redeploying after a prompt edit

```bash
cd "$HOME/Desktop/Ai Tools/leadgenjay-gohighlevel-cli-"*/
set -a; . ./.env; set +a
./.venv/bin/python ~/Desktop/the-lindley-team/scripts/ghl/deploy_june.py          # dry run
./.venv/bin/python ~/Desktop/the-lindley-team/scripts/ghl/deploy_june.py --apply
```

Idempotent: tools are matched by name, so re-running does not duplicate them. The script asserts
there is no em dash in the prompt before it writes, and diffs voice settings, transfer actions and
working hours after the write to prove nothing else moved.

---

## The call-end workflow (LIVE)

`June - call end lead alert`, workflow `3634a8d5-4a45-4d8b-bd4e-85ee6eceafa8`, published, 3 steps,
no trigger. A Voice AI agent fires it through `callEndWorkflowIds`, so a trigger would be wrong.

1. `workflow_ai_summarize_text` — GHL's native summarizer reads the transcript by itself. Asked for
   who they are, what they want, timeline, what was booked or sent, and **which officer should pick
   it up**. Output is referenced downstream as `{{chatgpt.1.response}}`.
2. Internal notification **email** to David and Bri.
3. Internal notification **SMS** to David and Bri.

Both alerts go to the two GHL **user records**, so they reach whatever contact details those hold.
Right now that is `david@eighty5labs.com` and `hello@rinseitoff.com`, not the `@movement.com`
inboxes. Changing a GHL user's email changes their login, so that is Bri's call, not a silent fix.

**Unverified until a real conversation happens:** whether `{{chatgpt.1.response}}` renders plainly
or needs a sub-key. A test contact has no transcript, so this can only be confirmed on a live one.
Watch the first alert.

---

## Knowledge base (LIVE)

`The Lindley Team`, `UI50OxMhVCRHS5J2qUpi`. 11 FAQs, source of truth is
`scripts/ghl/deploy_kb_faqs.py`, which asserts on the banned-phrase list before writing.

```bash
./.venv/bin/python ~/Desktop/the-lindley-team/scripts/ghl/deploy_kb_faqs.py --apply
```

Also attached to the KB: 4 trained URLs, 2 tables, and one file,
`lindley-team-knowledge-base.docx`, uploaded **2026-04-22**, which predates Movement. Its contents
are **not readable through the API** and it has never been re-checked. Given the FAQs from the same
date were full of Mortgage Express language, assume this file is too. See the Ask-AI section.

---

## Conversation AI (chat / SMS) — NOT built, and not buildable from here

The website chat and SMS threads are the remaining gap. Two separate GHL products matter here and
they are easy to confuse:

- **Conversation AI** (Settings → AI → Conversation AI) is the classic bot for SMS, web chat, and
  email. **No API endpoint for it exists.** Probed 34 candidate paths across 5 rounds
  (`/conversation-ai/*` in ten shapes, `/bot*`, `/ai-bot`, `/ai-employee`, `/chatbot`,
  `/locations/{loc}/*`, path-param and query-param forms). Every one returns 404 while sibling
  routes on the same host return clean 200s, so this is a genuinely absent route rather than an
  auth problem. It has to be configured in the UI or through Ask AI.
- **Agent Studio** (`/agent-studio/agents`) **is** reachable and does accept creates: a bare POST
  returns `422 {isGhl required, status must be one of active|inactive|archived, versionData
  required}`, which is a schema response, not a wall. But it is a node-graph builder, not a prompt
  box: live agents elsewhere in the agency carry `versions[].nodes[]` with tool nodes, sequential
  nodes, and staging/published states. Lindley has **zero** agents in it. Building the chat agent
  there is a real option and a real project, not a paste. Say the word and it can be built.

The deployable chat and SMS prompt already exists at `docs/ghl-content/chat-voice-agents.md`.

---

## Give this to GHL's Ask AI

Everything below was attempted through the API and genuinely could not be done. Paste it into
**Ask AI** inside the `hl-lindley-team` sub-account, in one go.

```
I need five things done in this sub-account. Context: The Lindley Team is TWO loan officers at
Movement Mortgage, David Chandler (NMLS #265974, licensed OR/WA/AZ) and Bri Lindley (NMLS #1367416,
CDLP, licensed OR/WA). Everything must name both, not just Bri.

1. VOICE AI DATA CAPTURE
On the Voice AI agent named "June - The Lindley Team", add these data-extraction fields so callers
stop landing in the CRM as unnamed guest visitors:
   - First Name  -> contact.first_name  (standard field)
   - Last Name   -> contact.last_name   (standard field)
   - Email       -> contact.email       (standard field)
   - Phone       -> contact.phone       (standard field)
   - Loan purpose -> a custom text field. Values it should capture: buy, refinance, divorce or
     equity buyout, investment, cash-out, just researching.
   - Timeline    -> a custom text field. Values: ASAP, 1-3 months, 3-6 months, 6+ months, unsure.
Do not change the agent's prompt, its voice, its tools, or its call-end workflow.

2. CONVERSATION AI (chat + SMS)
Turn on Conversation AI for SMS and Web Chat. Set mode to Autopilot. Connect the knowledge base
called "The Lindley Team". Set the bot goal to Booking. Connect the calendar "Consultation - 30 min"
(the collective one with BOTH David and Bri on it, NOT "30-Minute Consultation with Bri").
For the system prompt, use the "Chat AI" prompt from our doc chat-voice-agents.md. Introduce the
assistant as June so chat and voice are the same person.

3. ESCALATION
Create a workflow: when a Conversation AI conversation contains "speak to a human", "talk to David",
"talk to Bri", or "real person", or the contact sends three negative-sentiment messages in a row,
send an internal SMS to BOTH David Chandler and Bri Lindley with the contact name and a conversation
summary, add the tag "escalation:human-requested", and pause Conversation AI for that contact.

4. KNOWLEDGE BASE FILE
There is a file in the "The Lindley Team" knowledge base called lindley-team-knowledge-base.docx,
uploaded 2026-04-22. That predates our move to Movement Mortgage. Show me everything in it that
mentions Mortgage Express, "correspondent lender", "wholesale", "broker", or names Bri as the only
loan officer, so I can decide whether to replace or delete it. Do the same for the 4 trained URLs
and 2 tables attached to that knowledge base.

5. DELETE
Delete the Voice AI agent named "PARKED - unused template". It is GoHighLevel's stock sample and
we do not use it.

Never let any agent say: "we're a bank", "we shop hundreds of lenders", "broker", "brokerage",
"correspondent lender", "wholesale lending network", "Mortgage Express", or the word "free" (use
"complimentary"). Never quote a rate. Never prequalify. Never ask for an SSN.
```

---

## Still open, needs a decision from Bri

1. **Alert emails go to the wrong inboxes.** `david@eighty5labs.com` and `hello@rinseitoff.com`,
   not `@movement.com`. Changing a GHL user's email changes their login. Confirm before touching.
2. **Bri's application link is a `login` URL** (`easyapp.movement.com/apply/login?userid=10115700`)
   while David's is `create_profile`. A brand-new borrower who picks Bri hits a sign-in wall. Same
   bug on `/apply` and now in June's application text. Needs Bri's real application URL.
3. **`hl-david-chandler-team` is a second live sub-account** (`udDUy1eTol8oaFCyuryw`) holding 5
   Voice AI agents of its own, including one called "Linda" with 22 data-extraction fields and full
   booking. It is not wired to the website. Confirm `hl-lindley-team` is canonical and archive the
   other, or say what it is for.
4. **The `/contact` page meta description still says "Reach Bri Lindley"** and lists OR/WA only.
   Same erasure, on the public site.
5. **Eight follow-up workflows are still draft.** Publishing them starts outbound campaigns to real
   people, which is Bri's call. Two of them (`2. Appointment Confirmation + Reminders` and
   `3. Appt No Show`) also condition on calendar `5v6xrC9jXbsvYST0hgkL`, which does not exist in
   this account. Repoint before publishing or they will stay silent anyway.

---

## Testing before this counts as done

- [ ] Open thelindleyteam.com, talk to June, ask "who am I going to be working with". She should
      name David and Bri, and route correctly if you mention divorce or a jumbo loan.
- [ ] Ask her for a rate. She must refuse, warmly, and offer the calendar.
- [ ] Ask to book. Confirm the appointment lands on `Consultation - 30 min` with both officers.
- [ ] End the conversation and confirm the email **and** the SMS reach David and Bri, and that
      `{{chatgpt.1.response}}` rendered as a real summary and not as literal text.
- [ ] Say "I'm getting divorced" and confirm the register drops, "confidential" gets said, Bri is
      named, and only the divorce link is sent.
- [ ] Delete the test contact afterwards.
