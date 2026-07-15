# wh-calculator
workflow_id: 0d8fc8ad-5f52-426c-a15f-f2c157b0a49c
status: published
exported: 2026-07-14

---
## Notify team (app)  (internal_notification)

[internal notify] New website lead — wh-calculator
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-calculator

---
## Notify team (email)  (internal_notification)

[internal notify] 
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-calculator

---
## Notify team (text)  (internal_notification)

[internal notify] 
New wh-calculator lead: {{inboundWebhookRequest.name}} {{inboundWebhookRequest.phone}} {{inboundWebhookRequest.email}}

