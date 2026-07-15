# 2. Appointment Confirmation + Reminders
workflow_id: 9662aa74-833e-4265-be3c-1caeed3e6548
status: draft
exported: 2026-07-14

---
## Confirmation Email  (email)

SUBJECT: Appointment Confirmation

<p style="margin:0px">Hi {{contact.first_name}},</p><p style="margin:0px">Your appointment has been confirmed for {{appointment.only_start_date}} at {{appointment.only_start_time}} {{appointment.timezone}}&nbsp;<br><br>Let us know if you have any questions in the meantime 👍</p><p style="margin:0px"><strong>{{location.name}}</strong><br><br>{{location.full_address}}</p><p style="margin:0px"><a target="_blank" href="{{appointment.add_to_google_calendar}}">Add to Google calendar</a> | <a target="_blank" href="{{appointment.add_to_ical_outlook}}">Add to Outlook</a></p><p style="margin:0px"><a target="_blank" href="{{appointment.cancellation_link}}">Cancel</a> |&nbsp;<a target="_blank" href="{{appointment.reschedule_link}}">Reschedule</a></p>

---
## 24 hr Reminder Email  (email)

SUBJECT: Your Appointment is in 24 Hours!

<p style="margin:0px">Hi {{contact.first_name}},</p><p style="margin:0px">Just a friendly reminder that your Appointment is in 24 Hours.&nbsp;</p><p style="margin:0px">We look forward to seeing you then!<br><br><strong>{{location.name}}</strong></p><p style="margin:0px">{{location.full_address}}</p><p style="margin:0px"><a target="_blank" href="{{appointment.add_to_google_calendar}}">Add to google calendar</a> | <a target="_blank" href="{{appointment.add_to_ical_outlook}}">Add to outlook</a></p><p style="margin:0px"><a target="_blank" href="{{appointment.cancellation_link}}">Cancel</a> |&nbsp;<a target="_blank" href="{{appointment.reschedule_link}}">Reschedule</a></p><br/>

---
## 1hr Reminder Email  (email)

SUBJECT: {{contact.first_name}} your appointment is in one hour!

<p style="margin:0px">Hi {{contact.first_name}},</p><p style="margin:0px">Just a friendly reminder that your appointment is in one hour.</p><p style="margin:0px">We look forward to seeing you!</p><p style="margin:0px"><strong>{{location.name}}</strong><br><br>{{location.full_address}}</p><p style="margin:0px"><a target="_blank" href="{{appointment.add_to_google_calendar}}">Add to google calendar</a> | <a target="_blank" href="{{appointment.add_to_ical_outlook}}">Add to outlook</a></p><p style="margin:0px"><a target="_blank" href="{{appointment.cancellation_link}}">Cancel</a> |&nbsp;<a target="_blank" href="{{appointment.reschedule_link}}">Reschedule</a></p>

---
## 1hr Reminder SMS  (sms)

Hi {{contact.first_name}}, just a friendly reminder that your Appointment is in one hour. Please confirm you're still available by replying YES - {{location.name}}

