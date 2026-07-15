# wh-apply-click
workflow_id: 18440f4a-ff36-4e4d-864e-c351126111df
status: published
exported: 2026-07-14

---
## Notify team (app)  (internal_notification)

[internal notify] New website lead — wh-apply-click
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-apply-click

---
## Notify team (email)  (internal_notification)

[internal notify] 
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-apply-click

---
## Notify team (text)  (internal_notification)

[internal notify] 
New wh-apply-click lead: {{inboundWebhookRequest.name}} {{inboundWebhookRequest.phone}} {{inboundWebhookRequest.email}}

