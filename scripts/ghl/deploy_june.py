#!/usr/bin/env python3
"""Deploy June, the Lindley Team Voice AI agent, from the repo to live GHL.

Source of truth for the prompt is docs/ghl-content/june-voice-agent.md: this reads the first
fenced block under "## Deployable system prompt" and PUTs it, so the repo and the live agent
cannot drift.

Idempotent. Actions are matched by name, so re-running does not duplicate tools.

    cd "~/Desktop/Ai Tools/leadgenjay-gohighlevel-cli-<hash>"
    set -a; . ./.env; set +a
    ./.venv/bin/python <repo>/scripts/ghl/deploy_june.py [--apply]

Without --apply it prints the diff and changes nothing.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request

CLI = os.path.expanduser(
    "~/Desktop/Ai Tools/leadgenjay-gohighlevel-cli-23cbc5732db2284717344234d6f2410b43e922ba")
sys.path.insert(0, CLI)
from cli_anything.gohighlevel.utils.ghl_internal_client import TokenManager, BASE_URL  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROMPT_DOC = os.path.join(REPO, "docs", "ghl-content", "june-voice-agent.md")

LOC = "pe2yBdfaVo406b3BaavZ"
JUNE = "6a5fc3d5d0c5f9597a206aa0"
KB_ID = "UI50OxMhVCRHS5J2qUpi"
AGENT_NAME = "June - The Lindley Team"
WELCOME = "Hi, I'm June, the assistant for The Lindley Team. What can I do for you?"

CAL_GENERAL = "iP61EhQ1LwMiCpWjYVXH"
BOOK = "https://api.leadconnectorhq.com/widget/booking/"
LINK_DIVORCE = BOOK + "OwSdQeWY7mySxMYWPfQN"
LINK_FTB = BOOK + "HO4qop4LqQWemPhKj4IC"
LINK_RATE = BOOK + "nCrKarsV3BLrp1WiwHN8"
APPLY_DAVID = "https://easyapp.movement.com/apply/create_profile?userid=10107026"
APPLY_BRI = "https://easyapp.movement.com/apply/login?userid=10115700"

_tm = TokenManager()


def req(path: str, method: str = "GET", body: dict | None = None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(BASE_URL + path, data=data, method=method)
    for k, v in {
        "token-id": _tm.get_token(), "channel": "APP", "source": "WEB_USER",
        "version": "2021-07-28", "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }.items():
        r.add_header(k, v)
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, (e.read() or b"")[:600].decode(errors="replace")


def read_prompt() -> str:
    md = open(PROMPT_DOC).read()
    body = md.split("## Deployable system prompt", 1)[1]
    m = re.search(r"```\n(.*?)\n```", body, re.S)
    if not m:
        sys.exit(f"no fenced prompt block found in {PROMPT_DOC}")
    prompt = m.group(1).strip()
    # The brand bans em dashes in anything customer-facing; the prompt is no exception.
    assert "—" not in prompt and "–" not in prompt, "em/en dash in the deployable prompt"
    assert "Mortgage Express" not in prompt or "former company" in prompt
    return prompt


def sms(name, trigger, spoken, message):
    return {"actionType": "SMS", "name": name, "actionParameters": {
        "examples": [], "selectedPaths": [], "parameters": [],
        "triggerPrompt": trigger, "triggerMessage": spoken, "messageBody": message}}


WANTED = [
    {"actionType": "APPOINTMENT_BOOKING", "name": "Book consultation (David or Bri)",
     "actionParameters": {"examples": [], "selectedPaths": [], "parameters": [],
                          "calendarId": CAL_GENERAL, "daysOfOfferingDates": 3,
                          "slotsPerDay": 2, "hoursBetweenSlots": 3}},
    sms("Text divorce consult link",
        "The conversation involves divorce, separation, or a home equity buyout and they want to "
        "talk to Bri. Use this instead of booking on the line, so the consult stays private.",
        "Sending you the private consult link now.",
        "Here's the private, confidential consult with Bri, our Certified Divorce Lending "
        "Professional: " + LINK_DIVORCE + ". No cost, and it's just a conversation. "
        "Reply here if you'd rather we call you."),
    sms("Text first-time buyer link",
        "They have never owned a home and are just starting to figure out whether buying is "
        "possible. Use this rather than the general consult.",
        "Texting you the first-time buyer link now.",
        "Here's the first-time buyer intro call with David or Bri: " + LINK_FTB +
        ". Complimentary, about thirty minutes, no pressure."),
    sms("Text rate and strategy link",
        "They are rate shopping or comparing offers from other lenders and want real numbers.",
        "Texting you the link now.",
        "Here's the rate and strategy call with David or Bri: " + LINK_RATE +
        ". They'll quote your actual situation. Not a commitment to lock or lend."),
    sms("Text application link",
        "They say they're ready to apply, start an application, or get pre-approved.",
        "Sending you the application links now.",
        "Here's where to start, both secure through Movement and about fifteen minutes. "
        "David: " + APPLY_DAVID + " . Bri: " + APPLY_BRI +
        " . Pick whoever you've been talking to, and text us here if anything sticks."),
    # No DATA_EXTRACTION actions here on purpose. POST /voice-ai/actions rejects every shape with
    # 422 "Invalid actionParameters for the given actionType" (6 variants tried, 2026-08-11), and
    # the agent PUT rejects contactFieldActions too. Add the five capture fields through GHL's
    # Ask AI instead, per the "Ask AI" section of docs/lindley-ai-agents-setup.md. Until then the
    # call-end workflow below is what rescues the lead.
]


# ── Call-end workflow ───────────────────────────────────────────────────────────────────────
# June cannot write contact fields herself: POST /voice-ai/actions rejects DATA_EXTRACTION with
# 422 "Invalid actionParameters" on every shape, and the agent PUT rejects contactFieldActions.
# So the lead is rescued workflow-side instead: GHL's native summarizer reads the transcript on
# its own, and both officers get it by email and text the moment the conversation ends.
WF_NAME = "June - call end lead alert"
USER_BRI = "9iXXFaE4tKyRGSvd2aBq"
USER_DAVID = "dvMkXYC5awKadmVkOCgu"
SUMMARY = "{{chatgpt.1.response}}"  # summarizer sits at order 0; reference is order + 1


def v(field: str) -> str:
    """Build a merge token by concatenation. An f-string collapses '}}' into '}'."""
    return "{{" + field + "}}"


def wf_templates() -> list[dict]:
    who = v("contact.first_name") + " " + v("contact.last_name")
    summarize = (
        "Summarize this conversation for David Chandler and Bri Lindley, the two loan officers. "
        "In 3 to 5 plain sentences state: who this is and any contact details they gave (name, "
        "email, phone), what they are trying to do (buy, refinance, divorce or equity buyout, "
        "investment, just researching), their timeline, whether anything was booked or sent, and "
        "the single most useful next step. Say plainly which of the two should pick it up: Bri for "
        "divorce and separation, David for jumbo, new construction, self-employed, DSCR or "
        "investment, and Arizona. Use the call transcript or AI call notes as the source. If there "
        "is nothing substantive, reply exactly: 'No details captured, open the transcript.'"
    )
    body = (
        "New June conversation on thelindleyteam.com.\n\n" + who + "\nPhone: " + v("contact.phone")
        + "\nEmail: " + v("contact.email") + "\n\n" + SUMMARY
        + "\n\nFull transcript is in Voice AI, agent June."
    )
    html = (
        '<p style="margin:0 0 12px;font:16px/1.75 arial,sans-serif;color:#000;">'
        "<strong>June here.</strong> Someone just talked to me on the site.</p>"
        '<p style="margin:0 0 4px;font:13px arial,sans-serif;letter-spacing:.04em;'
        'text-transform:uppercase;color:#666;">Who</p>'
        '<p style="margin:0 0 16px;font:16px/1.7 arial,sans-serif;color:#111;">' + who
        + "<br>" + v("contact.phone") + "<br>" + v("contact.email") + "</p>"
        '<p style="margin:0 0 4px;font:13px arial,sans-serif;letter-spacing:.04em;'
        'text-transform:uppercase;color:#666;">What they want</p>'
        '<p style="margin:0 0 16px;padding:12px 16px;border-left:3px solid #111;background:#f6f6f6;'
        'font:16px/1.7 arial,sans-serif;color:#111;white-space:pre-wrap;">' + SUMMARY + "</p>"
        '<p style="margin:0;font:16px/1.75 arial,sans-serif;color:#000;">'
        "Full transcript and recording are in Voice AI, agent June.</p>"
    )
    ids = ["8fbb1a10-june-0001-0000-callendsummary",
           "8fbb1a10-june-0002-0000-callendemail",
           "8fbb1a10-june-0003-0000-callendsms"]
    both = [USER_DAVID, USER_BRI]
    return [
        {"id": ids[0], "type": "workflow_ai_summarize_text",
         "workflowsActionType": "INTERNAL", "name": "Summarize the conversation",
         "order": 0, "cat": "", "parentKey": None,
         "attributes": {"type": "workflow_ai_summarize_text", "inputText": summarize,
                        "maxLength": "700", "__customInputs__": {}},
         "advanceCanvasMeta": {"position": {"x": 400, "y": 0}}, "next": ids[1]},
        {"id": ids[1], "type": "internal_notification", "name": "Email David + Bri",
         "order": 1, "cat": "", "parentKey": ids[0],
         "attributes": {"type": "email", "email": {
             "from_name": v("location.name"), "from_email": v("location.email"),
             "userType": "user", "selectedUser": both,
             "subject": "New June conversation, " + who, "html": html, "attachments": []}},
         "advanceCanvasMeta": {"position": {"x": 700, "y": 0}}, "next": ids[2]},
        {"id": ids[2], "type": "internal_notification", "name": "Text David + Bri",
         "order": 2, "cat": "", "parentKey": ids[1],
         "attributes": {"type": "sms", "sms": {
             "body": body, "userType": "user", "selectedUser": both, "attachments": []}},
         "advanceCanvasMeta": {"position": {"x": 1000, "y": 0}}, "next": None},
    ]


BAD_TOKEN = re.compile(r"\{\{[^{}]*\}(?!\})")


def ensure_call_end_workflow(apply: bool) -> str | None:
    s, wfs = req(f"/workflow/{LOC}")
    if s != 200:
        print(f"  could not list workflows: {s} {wfs}")
        return None
    existing = next((w for w in wfs if w.get("name") == WF_NAME), None)
    templates = wf_templates()
    blob = json.dumps(templates)
    assert not BAD_TOKEN.search(blob), f"malformed merge token: {BAD_TOKEN.search(blob).group()}"

    if not apply:
        print(f"  workflow {WF_NAME!r}: {'exists, would update' if existing else 'would create'}"
              f" ({len(templates)} steps)")
        return existing.get("_id") if existing else None

    if existing:
        wf_id = existing["_id"]
    else:
        s, d = req(f"/workflow/{LOC}", "POST", {"name": WF_NAME})
        if s not in (200, 201):
            print(f"  create workflow failed: {s} {d}")
            return None
        wf_id = d.get("_id") or d.get("id")
        print(f"  created workflow {wf_id}")

    s, cur = req(f"/workflow/{LOC}/{wf_id}")  # re-read for the optimistic-lock version
    if s != 200:
        print(f"  re-read failed: {s} {cur}")
        return None
    s, d = req(f"/workflow/{LOC}/{wf_id}", "PUT", {
        "name": WF_NAME, "status": "published", "version": cur.get("version"),
        "meta": cur.get("meta", {}), "workflowData": {"templates": templates}})
    print(f"  PUT workflow -> {s}" + ("" if s in (200, 201) else f" {d}"))

    s, back = req(f"/workflow/{LOC}/{wf_id}")
    got = json.dumps(back.get("workflowData", {}).get("templates"))
    bad = BAD_TOKEN.search(got)
    print(f"  read-back: status={back.get('status')} steps="
          f"{len(back.get('workflowData', {}).get('templates') or [])}"
          f" merge-tokens={'BROKEN ' + bad.group() if bad else 'ok'}")
    return wf_id


def main() -> None:
    apply = "--apply" in sys.argv
    prompt = read_prompt()

    s, live = req(f"/voice-ai/agents/{JUNE}?locationId={LOC}")
    if s != 200:
        sys.exit(f"could not read agent: {s} {live}")

    have = {a.get("name"): a for a in (live.get("actions") or [])}
    print(f"live agent: {live['agentName']!r}")
    print(f"  prompt   : {len(live.get('agentPrompt') or '')} chars -> {len(prompt)} chars")
    print(f"  name     : {live['agentName']!r} -> {AGENT_NAME!r}")
    print(f"  welcome  : {live.get('agentWelcomeMessage')!r}\n          -> {WELCOME!r}")
    print(f"  KB       : {live.get('knowledgeBaseIds')}")
    print(f"  tools now: {sorted(have)}")
    todo = [a for a in WANTED if a["name"] not in have]
    print(f"  tools to create: {[a['name'] for a in todo]}")
    print(f"  call-end wf now: {live.get('callEndWorkflowIds')}")
    if not apply:
        ensure_call_end_workflow(False)
        print("\ndry run. pass --apply to write.")
        return

    wf_id = ensure_call_end_workflow(True)

    body = {"locationId": LOC, "agentName": AGENT_NAME, "agentPrompt": prompt,
            "agentWelcomeMessage": WELCOME, "welcomeMessage": WELCOME,
            "welcomeMessageMode": "ai_custom", "knowledgeBaseIds": [KB_ID],
            "businessName": "The Lindley Team", "saveCallSummaryAsNote": True}
    if wf_id:
        body["callEndWorkflowIds"] = [wf_id]
    s, d = req(f"/voice-ai/agents/{JUNE}", "PUT", body)
    print(f"\nPUT agent -> {s}" + ("" if s == 200 else f" {d}"))

    for a in todo:
        s, d = req("/voice-ai/actions", "POST", {"locationId": LOC, "agentId": JUNE, **a})
        print(f"POST action {a['name']!r} -> {s}"
              + (f" id={d.get('_id')}" if s in (200, 201) and isinstance(d, dict) else f" {d}"))

    # Read back and diff the fields we did not intend to touch.
    s, after = req(f"/voice-ai/agents/{JUNE}?locationId={LOC}")
    print("\n--- read-back ---")
    print(f"  name    : {after['agentName']!r}")
    print(f"  prompt  : {len(after.get('agentPrompt') or '')} chars, "
          f"matches repo: {after.get('agentPrompt', '').strip() == prompt}")
    print(f"  KB      : {after.get('knowledgeBaseIds')}")
    print(f"  tools   : {sorted(x.get('name') for x in (after.get('actions') or []))}")
    for f in ("callTransferActions", "smsActions", "workflowActions", "contactFieldActions",
              "callEndWorkflowIds", "agentWorkingHours", "isInboundActive", "llmModel"):
        if json.dumps(live.get(f), sort_keys=True) != json.dumps(after.get(f), sort_keys=True):
            print(f"  CHANGED (unintended?) {f}: {live.get(f)} -> {after.get(f)}")
    v_before = (live.get("agentSettings") or {}).get("voice")
    v_after = (after.get("agentSettings") or {}).get("voice")
    speed_b = (live.get("agentSettings") or {}).get("voiceSpeed")
    speed_a = (after.get("agentSettings") or {}).get("voiceSpeed")
    print(f"  voice   : {v_before} -> {v_after}   speed {speed_b} -> {speed_a}")


if __name__ == "__main__":
    main()
