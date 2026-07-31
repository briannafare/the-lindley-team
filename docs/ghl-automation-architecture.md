# The Lindley Team — GHL Automation Architecture
## Every form, every webhook, every sequence, every pipeline stage

---

## OVERVIEW

Every page on thelindleyteam.com becomes a lead capture point. Forms submit via webhook to GHL, contacts enter the pipeline, and automated sequences handle follow-up until Bri makes human contact. The goal: speed-to-lead on hot inquiries, nurture on warm ones, and nobody falls through the cracks.

---

## PIPELINE: The Lindley Team — Client Journey

Set this up as a single pipeline in GHL with these stages:

| Stage | Trigger | What Happens |
|---|---|---|
| 1. New Lead | Form submission / chat / referral | Auto-tagged by source, sequence starts |
| 2. Contacted | Bri makes first human touchpoint | Manual move — Bri confirms she's spoken to them |
| 3. Discovery Scheduled | Calendar booking confirmed | Auto-move when GHL calendar event is created |
| 4. Pre-Qualification | Financial info reviewed | Manual move after Bri reviews their numbers |
| 5. Application Started | Clicked through to Movement Mortgage | Auto-tag when UTM-tracked link is clicked |
| 6. In Processing | Loan is in underwriting | Manual move |
| 7. Closed — Won | Loan funded | Manual move → triggers post-close sequence |
| 8. Closed — Lost | Didn't proceed | Manual move → add loss reason tag → long-term nurture |
| 9. Long-Term Nurture | Not ready now | Manual move → quarterly touchpoint sequence |

---

## FORMS (7 total)

Each form submits via webhook to GHL. Every form captures UTM parameters from the URL so you know which page and CTA drove the lead.

### Form 1: Get Pre-Approved (Primary CTA — every page)
**Where it appears:** Nav CTA, Hero, service page CTAs, CTA sections
**What it actually does:** Redirects to Movement Mortgage application with UTM tracking
**URL pattern:**
```
# Movement easyApp — one link per loan officer (live values in src/app/apply/page.tsx):
David Chandler: https://easyapp.movement.com/apply/create_profile?userid=10107026
Bri Lindley:    https://easyapp.movement.com/apply/login?userid=10115700
# apply-click tracking still works via /api/lead (formType "apply-click") → wh-apply-click.
```
**GHL tracking:** Fire a webhook on click (not form submission) that creates/updates a contact with tag `clicked-apply` and the UTM data. This lets you see who clicked but didn't complete the application.

### Form 2: Schedule a Call (Contact page + secondary CTAs)
**Fields:**
- First Name (required)
- Last Name (required)  
- Email (required)
- Phone (required)
- What are you looking to do? (dropdown: Buy a home, Refinance, Divorce/equity buyout, Cash-out/HELOC, Investment property, Not sure yet)
- Timeline (dropdown: ASAP, 1-3 months, 3-6 months, Just exploring)
- Anything else we should know? (textarea, optional)

**GHL config:**
- Creates contact with tags: `source:website`, `form:schedule-call`, `interest:{dropdown-value}`, `timeline:{dropdown-value}`
- Adds to pipeline stage 1 (New Lead)
- If timeline = "ASAP" → triggers Speed-to-Lead sequence
- If timeline = anything else → triggers appropriate nurture sequence
- Books on Bri's GHL calendar (30-min slot)

### Form 3: Get Your Rate Quote (Service pages)
**Fields:**
- First Name (required)
- Email (required)
- Phone (required)
- Loan Type (auto-populated from service page: Purchase, Refinance, FHA, VA, etc.)
- Estimated Loan Amount (dropdown: Under $200k, $200-400k, $400-600k, $600k-1M, $1M+)
- Credit Score Range (dropdown: 580-619, 620-679, 680-719, 720-759, 760+, Not sure)

**GHL config:**
- Creates contact with tags: `source:website`, `form:rate-quote`, `interest:{loan-type}`, `loan-range:{amount}`, `credit-range:{score}`
- Adds to pipeline stage 1
- Triggers Speed-to-Lead sequence (rate quote = hot lead)

### Form 4: Calculator Email Results
**Fields:**
- Email (required)
- First Name (optional)
- Phone (optional)
- Hidden fields: home_price, down_payment, rate, term, monthly_payment (auto-captured from calculator state)

**GHL config:**
- Creates contact with tags: `source:website`, `form:calculator`, `calculator-price:{home_price}`
- Adds to pipeline stage 1
- Sends instant email with their calculator results (formatted)
- Triggers First-Time Buyer nurture if loan amount < $500k, general nurture otherwise

### Form 5: Neighborhood Inquiry
**Fields:**
- First Name (required)
- Email (required)
- Phone (optional)
- Neighborhood of interest (auto-populated from page)
- Hidden: neighborhood_slug

**GHL config:**
- Creates contact with tags: `source:website`, `form:neighborhood`, `neighborhood:{slug}`
- Adds to pipeline stage 1
- Triggers neighborhood-specific email with market data for that area
- Then flows into general purchase nurture

### Form 6: Download Guide (Lead magnet — Resources page)
**Fields:**
- First Name (required)
- Email (required)
- Which guide? (dropdown or auto-populated: First-Time Buyer Guide, Divorce & Your Mortgage Guide, Oregon Down Payment Assistance)

**GHL config:**
- Creates contact with tags: `source:website`, `form:guide-download`, `guide:{guide-name}`
- Delivers PDF via email instantly
- Triggers matching nurture sequence (FTB guide → FTB sequence, Divorce guide → Divorce sequence)

### Form 7: Divorce Consultation Request
**Fields:**
- First Name (required)
- Email (required)
- Phone (required)
- Your situation (dropdown: Going through divorce, Considering divorce, Recently divorced, Attorney/mediator seeking info for client)
- What's your primary concern? (dropdown: Keeping the home, Equity buyout, Qualifying on my own, Understanding my options, Advising my client)
- Preferred contact method (dropdown: Phone call, Email, Text)

**GHL config:**
- Creates contact with tags: `source:website`, `form:divorce-consult`, `divorce-situation:{dropdown}`, `divorce-concern:{dropdown}`
- Adds to pipeline stage 1
- Triggers Divorce Lending sequence (sensitive, longer intervals)
- If "Attorney/mediator" → separate professional referral sequence

---

## SEQUENCES (6 total)

All sequences are built as GHL Workflows. Every sequence includes a "stop" trigger: if the contact books a call or moves to pipeline stage 2+, all sequences pause automatically.

### Sequence 1: Speed-to-Lead
**Trigger:** Rate quote form, Schedule a Call with timeline "ASAP", or any form where intent is immediate
**Goal:** Get Bri on the phone within 5 minutes

```
0 min     → Internal notification: SMS + email to Bri
            "New hot lead: {first_name} {last_name} — {interest} — {phone}"
            
0 min     → Email to lead:
            Subject: "Got it, {first_name} — here's what happens next"
            Body: Brief, personal. "This is Bri from The Lindley Team. I got your 
            request and I'm putting together options for you. I'll reach out within 
            the next few hours to go over everything. In the meantime, if you have 
            any questions, you can text me directly at 971-754-1771."
            
2 min     → SMS to lead:
            "Hey {first_name}, it's Bri from The Lindley Team. Got your 
            {interest} request — I'll have info for you shortly. You can 
            text me here if anything comes up."
            
1 hour    → IF no response: Voicemail drop (record a 20-second voicemail)
            "Hey {first_name}, it's Bri Lindley. I got your inquiry about 
            {interest} from our website. I'd love to chat for a few minutes 
            and see how I can help. Call or text me at 971-754-1771."
            
4 hours   → IF no response: SMS
            "Just following up, {first_name}. No pressure — whenever you're 
            ready to chat, I'm here. You can book a time that works for you: 
            {calendar_link}"
            
24 hours  → IF no response: Email
            Subject: "Your {interest} options"
            Body: Value-add email with 2-3 relevant tips based on their 
            interest tag. End with calendar link.
            
48 hours  → IF no response: Final SMS
            "Hey {first_name} — just wanted to make sure my messages are 
            getting through. If now isn't the right time, totally fine. 
            I'll check back in a couple weeks. — Bri"
            
14 days   → IF still no response: Move to Long-Term Nurture pipeline stage
```

### Sequence 2: First-Time Buyer Nurture
**Trigger:** Guide download (FTB), calculator use with lower loan amounts, interest tag "purchase" with no urgency
**Goal:** Educate and build trust over 30 days until they're ready

```
Day 0     → Guide delivery email (if applicable)
            + "Welcome" email from Bri, personal tone

Day 2     → Email: "3 things Portland first-time buyers get wrong"
            (Common misconceptions: 20% down myth, credit score 
            requirements, renting vs buying math)

Day 5     → SMS: "Quick tip — did you know Oregon has down payment 
            assistance programs that most buyers never hear about? 
            Happy to walk you through them if you're curious."

Day 8     → Email: "What can you actually afford in Portland?"
            Link to calculator page. Neighborhood spotlight section 
            featuring 2-3 affordable entry neighborhoods.

Day 14    → Email: "How {client_name} bought their first home in 
            {neighborhood}" — case study/testimonial story. 
            End with: "When you're ready, I'm here."

Day 21    → SMS: "Hey {first_name} — just checking in. Any questions 
            come up since we last connected? No sales pitch, just here 
            if you need anything."

Day 30    → Email: "Ready or not, here's your next step"
            Clear CTA: schedule a 30-min call OR reply with questions.
            If no engagement → move to Long-Term Nurture.
```

### Sequence 3: Refinance Nurture
**Trigger:** Interest tag "refinance", rate quote with refi selected
**Goal:** Provide value through rate/savings analysis

```
Day 0     → Email: "Thanks for reaching out about refinancing"
            Personal note from Bri. "I'll be honest — refinancing 
            doesn't always make sense. Let me look at your numbers 
            before you spend any time on this."

Day 3     → Email: "When refinancing actually saves you money (and 
            when it doesn't)" — break-even analysis explainer. 
            Link to refinance service page.

Day 7     → SMS: "Hey {first_name} — I ran some general numbers 
            based on current rates. Want me to do a specific analysis 
            for your situation? Just need your current rate and 
            approximate balance."

Day 14    → Email: "The refinance question nobody asks (but should)"
            Content about total cost of the loan vs monthly payment.
            
Day 21    → Email: Final CTA — schedule a call for personalized analysis.
            Move to Long-Term Nurture if no engagement.
```

### Sequence 4: Divorce Lending (Sensitive — Longer Intervals)
**Trigger:** Divorce consultation form, divorce guide download, interest tag "divorce"
**Goal:** Build trust gently, demonstrate expertise, never be pushy

```
Day 0     → Email: "Thank you for reaching out"
            Warm, empathetic, brief. "I understand this is a 
            difficult time. There's no pressure here — I just want 
            to make sure you have the information you need to make 
            the best decision for your situation."
            Explain what a CDLP does in 2-3 sentences.

Day 5     → Email: "What a CDLP does differently"
            Educational content about why divorce mortgage planning 
            matters BEFORE the decree is finalized. Link to divorce 
            lending service page.

Day 12    → Email: "Understanding equity buyouts"
            Clear explanation of how they work, what to expect, 
            common pitfalls. No sales language.

Day 21    → Email: "When you're ready, I'm here"
            Short, personal. Calendar link. No pressure language.
            
Day 35    → Final email: "Checking in"
            "I know timelines in divorce are unpredictable. Whenever 
            you're ready — whether that's next week or next year — 
            I'm here to help. — Bri"
            Move to Long-Term Nurture.

*** NEVER use aggressive follow-up, countdown urgency, or 
    "don't miss out" language in divorce sequences ***
```

### Sequence 5: Past Client Re-engagement (Post-Close)
**Trigger:** Pipeline stage moved to "Closed — Won"
**Goal:** Stay top-of-mind for referrals and future business (refi, next purchase, investment)

```
Close Day     → Internal task: Send handwritten note (physical mail)
                "Congratulations on your new home. It was a pleasure 
                working with you. — Bri"

Day 30        → SMS: "Hey {first_name} — how's the new place? 
                Hope you're settling in! Let me know if anything 
                comes up."

Day 90        → Email: "Your home value update"
                Neighborhood market data for their area.
                "Your home in {neighborhood} has likely [appreciated/
                held steady]. Here's what's happening in your market."

Day 180       → Email: "6 months in — have you thought about..."
                Relevant financial next step based on their loan type.
                Cash-out refi? HELOC for renovations? Investment property?

Day 365       → Email: "Happy home-iversary!"
                Market update + soft referral ask:
                "Know anyone who's thinking about buying or selling? 
                I'd love to help them the same way I helped you."
                Include referral link tracked in GHL.

Every 90 days → Repeat quarterly market updates for their neighborhood
                Always include soft referral prompt
                Birthday/holiday touchpoints if dates are captured

*** Every touchpoint includes:
    - Soft referral prompt (not pushy)
    - Google Review ask (Day 30 and Day 90 only)
    - Useful information (not just "checking in") ***
```

### Sequence 6: Long-Term Nurture
**Trigger:** Any lead that didn't convert within their initial sequence
**Goal:** Stay in their inbox without being annoying until they're ready

```
Monthly   → Email: Portland market update
            Brief, useful. Current rates, inventory trends, 
            neighborhood spotlights. Not a sales pitch — 
            genuinely informative.
            
            Rotate content:
            - Month 1: Rate update + "Is now a good time to buy?"
            - Month 2: Neighborhood spotlight
            - Month 3: Client success story
            - Month 4: Rate update + refinance check-in
            - Month 5: Seasonal market trends
            - Month 6: "Still thinking about it?" + calendar link
            
            Repeat cycle.

*** Max 1 email per month. Unsubscribe respected immediately. ***
```

---

## AI CHAT WIDGET

GHL's AI chat widget on every page. Context-aware greeting based on page type.

### Configuration:
- **Position:** Bottom-right corner
- **Delay:** 3 seconds after page load
- **Behavior:** Proactive first message, then conversational

### Context-Aware Greetings:
```
Homepage:        "Have questions about getting started? I can help."
Service page:    "Have questions about {service_name}? I'm here."
Neighborhood:    "Interested in buying in {neighborhood_name}?"
Divorce page:    "Have questions about divorce and your mortgage? 
                  Everything here is confidential."
Calculator:      "Want help understanding your results?"
Blog post:       "Have questions about {post_topic}? Ask away."
Default:         "Hey — anything I can help with?"
```

### Chat → Lead Flow:
1. AI chat engages visitor, answers basic questions
2. When visitor shows intent (asks about rates, qualification, timing):
   - AI collects: name, email, phone
   - Creates GHL contact with tag `source:ai-chat`, `page:{current_page}`
3. If high intent detected (ready to apply, specific $ amounts mentioned):
   - AI suggests scheduling a call with Bri
   - Offers calendar link directly in chat
4. All chat transcripts saved to contact record in GHL

---

## WEBHOOK INTEGRATION (Next.js → GHL)

### Webhook URL Pattern:
Each form posts to a unique GHL webhook URL. Set these up in GHL under Automations → Workflows → Webhook trigger.

### Standard Payload (all forms):
```json
{
  "first_name": "value",
  "last_name": "value",
  "email": "value",
  "phone": "value",
  "tags": ["source:website", "form:{form-id}", "interest:{value}"],
  "source": "thelindleyteam.com",
  "utm_source": "thelindleyteam",
  "utm_medium": "website",
  "utm_campaign": "{page-type}",
  "utm_content": "{cta-id}",
  "page_url": "{current page URL}",
  "custom_fields": {
    "loan_type": "value",
    "loan_amount_range": "value",
    "credit_score_range": "value",
    "timeline": "value",
    "neighborhood_interest": "value"
  }
}
```

### Next.js Implementation:
Create a server action or API route at `/api/lead` that:
1. Validates form data
2. Captures UTM params from URL/cookies
3. Posts to GHL webhook URL
4. Returns success/error to the frontend form

```typescript
// src/app/api/lead/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  const ghlPayload = {
    first_name: data.firstName,
    last_name: data.lastName || "",
    email: data.email,
    phone: data.phone || "",
    tags: data.tags || [],
    source: "thelindleyteam.com",
    ...data.utmParams,
    customField: data.customFields || {},
  };

  const response = await fetch(process.env.GHL_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ghlPayload),
  });

  if (!response.ok) {
    return Response.json({ error: "Failed to submit" }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

### Environment Variable:
```
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/{your-webhook-id}
```

---

## UTM TRACKING STRATEGY

Every outbound link and every form captures UTM parameters for attribution.

### UTM Structure:
- `utm_source`: always `thelindleyteam`
- `utm_medium`: always `website`
- `utm_campaign`: page type (`homepage`, `service-purchase`, `service-divorce`, `neighborhood-sellwood`, `blog-pmi-guide`, `calculator`)
- `utm_content`: specific CTA (`hero-cta`, `nav-cta`, `service-cta`, `footer-cta`, `calculator-cta`)

### Capture Method:
On page load, read UTM params from URL and store in a cookie (30-day expiry). Attach to every form submission and Apply Now click. This means if someone lands from Google on a blog post, browses around, and fills out a form 3 pages later, you still know the original landing page.

---

## GOOGLE REVIEW AUTOMATION

### Trigger: Pipeline stage → Closed — Won, Day 30
```
SMS: "Hey {first_name} — so glad we could help you get into your new place! 
If you had a good experience, would you mind leaving us a quick Google review? 
It helps other Portland families find us. {google_review_link}

No pressure at all — and thank you again! — Bri"
```

### Trigger: Day 90 (if no review left)
```
Email: Include review link naturally within the 90-day market update email. 
Don't make the entire email about the review — just include it as a P.S.

"P.S. — If you haven't already, a Google review helps us reach more 
Portland families like yours. Takes 30 seconds: {google_review_link}"
```

### NEVER:
- Incentivize reviews (violates Google policy)
- Ask more than twice
- Ask during any negative interaction

---

## SETUP CHECKLIST

In GHL, build in this order:

1. [ ] Create pipeline with 9 stages
2. [ ] Create custom fields: loan_type, loan_amount_range, credit_score_range, timeline, neighborhood_interest, utm_source, utm_medium, utm_campaign, utm_content
3. [ ] Create tags: source:website, source:ai-chat, source:referral, form:schedule-call, form:rate-quote, form:calculator, form:neighborhood, form:guide-download, form:divorce-consult, clicked-apply, interest:purchase, interest:refinance, interest:divorce, interest:fha, interest:va, interest:jumbo, interest:cash-out, interest:heloc, interest:investment, interest:reverse
4. [ ] Set up 7 webhook URLs (one per form)
5. [ ] Build 6 workflow sequences
6. [ ] Configure AI chat widget with page-aware greetings
7. [ ] Set up GHL calendar for Bri (30-min slots)
8. [ ] Create email templates for each sequence step
9. [ ] Connect to Next.js via /api/lead route
10. [ ] Test end-to-end: form submit → GHL contact created → sequence triggered → emails sent

---

*This document is the complete GHL automation architecture. Hand to Claude Code for the Next.js webhook integration. Implement the GHL-side configuration manually in your GHL dashboard.*
