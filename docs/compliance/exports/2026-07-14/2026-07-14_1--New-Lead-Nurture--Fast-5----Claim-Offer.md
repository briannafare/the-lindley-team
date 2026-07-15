# 1. New Lead Nurture (Fast 5) - Claim Offer
workflow_id: 5fe4dcfd-6871-4279-b50b-d4ba2da1b9ed
status: draft
exported: 2026-07-14

---
## Conversational Email  (email)

SUBJECT: Thanks for claiming our offer {{contact.first_name}}!

<p style="margin:0px">Thanks for claiming our {{custom_values.promotion_name}} promotion {{contact.first_name}}! </p><br/><p style="margin:0px">We're looking forward to seeing you. Be sure to check out our calendar to schedule your appointment: {{ custom_values.marketing__website_booking_page_url }}</p><br/><p style="margin:0px">We also shot you a text if you have any questions in the meantime.<br><br><br>{{location.name}}</p>

---
## Conversational SMS  (sms)

Hi {{contact.first_name}}, thanks for claiming our {{custom_values.promotion_name}} promotion - Have you spoken to a Mortgage Lender in the past?   - {{location.name}}

---
## Booking Link SMS  (sms)

Got it, so you know a little about what to expect. And just as a reminder: if you haven't already, be sure to schedule on our calendar here: {{custom_values.marketing__website_booking_page_url}} You can also call us directly at {{location.phone}}

---
## Survey Link SMS  (sms)

No problem. The next step is to book a time to come in - grab a spot that works for you here: {{custom_values.marketing__website_booking_page_url}}

---
## Any questions SMS  (sms)

Hi {{contact.first_name}}, just checking back to see if you're ready to book an appointment so we can apply your discount. Are there any questions we can answer for you in the meantime? - {{location.name}}

