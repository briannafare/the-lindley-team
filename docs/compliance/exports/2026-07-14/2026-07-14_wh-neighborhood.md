# wh-neighborhood
workflow_id: ecdd3394-7067-4671-9a0f-fa80e48445e3
status: published
exported: 2026-07-14

---
## Notify team (app)  (internal_notification)

[internal notify] New website lead — wh-neighborhood
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-neighborhood

---
## Notify team (email)  (internal_notification)

[internal notify] 
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-neighborhood

---
## Notify team (text)  (internal_notification)

[internal notify] 
New wh-neighborhood lead: {{inboundWebhookRequest.name}} {{inboundWebhookRequest.phone}} {{inboundWebhookRequest.email}}

