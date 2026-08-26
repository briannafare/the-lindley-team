# wh-divorce-consult
workflow_id: b473d686-2fe8-4c06-bcad-2ba13c093701
status: published
exported: 2026-07-14

---
## Notify team (app)  (internal_notification)

[internal notify] New website lead — wh-divorce-consult
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-divorce-consult

---
## Notify team (email)  (internal_notification)

[internal notify] 
{{inboundWebhookRequest.name}} · {{inboundWebhookRequest.email}} · {{inboundWebhookRequest.phone}}
Message: {{inboundWebhookRequest.message}}
Form: wh-divorce-consult

---
## Notify team (text)  (internal_notification)

[internal notify] 
New wh-divorce-consult lead: {{inboundWebhookRequest.name}} {{inboundWebhookRequest.phone}} {{inboundWebhookRequest.email}}

