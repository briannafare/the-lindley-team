# wh-appointment-booked
workflow_id: a3b4d8f5-cb89-4dec-98ce-d614e0903649
status: published
exported: 2026-07-14

---
## Notify team (app)  (internal_notification)

[internal notify] Appointment booked — {{contact.name}}
{{contact.name}} booked {{appointment.title}} on {{appointment.start_time}}

---
## Notify team (email)  (internal_notification)

[internal notify] 
{{contact.name}} ({{contact.email}} / {{contact.phone}}) booked {{appointment.title}} on {{appointment.start_time}}.

---
## Notify team (text)  (internal_notification)

[internal notify] 
Booked: {{contact.name}} {{appointment.start_time}} — {{contact.phone}}

