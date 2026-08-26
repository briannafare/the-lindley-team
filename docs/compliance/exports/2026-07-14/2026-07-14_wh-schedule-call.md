# wh-schedule-call
workflow_id: 80325228-9fc4-40d9-b27a-e1fdcfc838f2
status: published
exported: 2026-07-14

---
## Notify team (app)  (internal_notification)

[internal notify] New website lead — wh-schedule-call
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-schedule-call

---
## Notify team (email)  (internal_notification)

[internal notify] 
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-schedule-call

---
## Notify team (text)  (internal_notification)

[internal notify] 
New wh-schedule-call lead: {{inboundWebhookRequest.name}} {{inboundWebhookRequest.phone}} {{inboundWebhookRequest.email}}

