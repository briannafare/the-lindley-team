# 3. Appt No Show
workflow_id: eed2dde5-6b5c-4652-ba84-af86c6724946
status: draft
exported: 2026-07-14

---
## Reschedule Follow Up Link  (email)

SUBJECT: Let's get you rescheduled {{contact.first_name}}!

<p style="margin:0px"><span style="font-size: 15px; font-family: Verdana">Hi {{contact.first_name}},<br><br>Sorry you weren't able to make our appointment - let's get you rescheduled!<br><br>You can book another day/time that will work for you by clicking here: {{custom_values.marketing__website_booking_page_url}}<br><br>We look forward to seeing with you!<br><br></span><strong><span style="font-size: 15px; font-family: Verdana">{{location.name}}</span></strong><span style="font-size: 15px; font-family: Verdana"><br>{{location.full_address}}<br><br></span></p>

---
## SMS  (sms)

Hi {{contact.first_name}}! Sorry you weren't able to make our appointment - let's get you rescheduled!

You can book another day/time that will work for you by clicking here: {{custom_values.marketing__website_booking_page_url}}

We look forward to seeing you! - {{location.name}}

---
## SMS  (sms)

Hi {{contact.first_name}}, just wanted to check back to see if we can get you rescheduled or if you had any questions we can help with - {{location.name}}

