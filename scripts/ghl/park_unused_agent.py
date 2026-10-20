#!/usr/bin/env python3
"""Park the unused stock Voice AI template sitting in hl-lindley-team.

Agent 695c9d38153547370c0cfa87 arrived as GoHighLevel's generic "Mortgage Lender" sample and was
never edited. As of 2026-08-11 it was still carrying the template's placeholders
([Mortgage Lender Name], support@mortgagelender.com) plus several things a mortgage account should
never have an agent say: a 620 credit-score minimum, "most approvals take 30-45 days", "closing
costs typically range from 2-5%", an offer to run a pre-qualification, and a request for the last
four digits of the caller's SSN.

It has no phone number and no knowledge base, so nothing has ever reached it. This replaces the
prompt with a refusing stub and renames it, so an accidental number assignment cannot go wrong.
Safe to delete outright instead; the full original is in the session backup.

    ./.venv/bin/python <repo>/scripts/ghl/park_unused_agent.py [--apply]
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

sys.path.insert(0, os.path.expanduser(
    "~/Desktop/Ai Tools/leadgenjay-gohighlevel-cli-23cbc5732db2284717344234d6f2410b43e922ba"))
from cli_anything.gohighlevel.utils.ghl_internal_client import TokenManager, BASE_URL  # noqa: E402

LOC = "pe2yBdfaVo406b3BaavZ"
AGENT = "695c9d38153547370c0cfa87"
NAME = "PARKED - unused template"
GREETING = "Thanks for calling The Lindley Team."
STUB = (
    "PARKED. This agent is not in service and must not be given a phone number until it has been "
    "written and reviewed.\n\n"
    "If you are ever invoked, say exactly this and then stop: \"Thanks for calling The Lindley "
    "Team. Let me get you to David or Bri directly at 971-754-1771.\"\n\n"
    "Never quote a rate. Never state a credit score minimum or a closing timeline. Never quote "
    "closing costs. Never ask for a Social Security number, a date of birth, or an account "
    "number. Never say the word free. Never approve, deny, or prequalify anyone. You are not "
    "authorized to answer mortgage questions."
)
# Phrases the stock template shipped with. None may survive.
# "last four digits", not "Social Security": the stub legitimately says never to ask for one.
LIABILITY = ["last four digits", "620", "30-45", "2-5%", "pre-qualification",
             "[Mortgage Lender Name]", "support@mortgagelender.com"]

_tm = TokenManager()


def req(path, method="GET", body=None):
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
        return e.code, (e.read() or b"")[:400].decode(errors="replace")


def main() -> None:
    apply = "--apply" in sys.argv
    s, before = req(f"/voice-ai/agents/{AGENT}?locationId={LOC}")
    if s != 200:
        sys.exit(f"read failed: {s} {before}")
    p = before.get("agentPrompt") or ""
    print(f"live: {before['agentName']!r}  inboundActive={before['isInboundActive']} "
          f"numbers={before['inboundNumbers']} prompt={len(p)} chars")
    print(f"  liability phrases present: {[x for x in LIABILITY if x.lower() in p.lower()]}")
    if not apply:
        print("\ndry run. pass --apply to write.")
        return

    s, d = req(f"/voice-ai/agents/{AGENT}", "PUT", {
        "locationId": LOC, "agentName": NAME, "agentPrompt": STUB,
        "agentWelcomeMessage": GREETING, "welcomeMessage": GREETING})
    print(f"PUT -> {s}" + ("" if s == 200 else f" {d}"))

    s, after = req(f"/voice-ai/agents/{AGENT}?locationId={LOC}")
    ap = after.get("agentPrompt") or ""
    left = [x for x in LIABILITY if x.lower() in ap.lower()]
    print(f"read-back: {after['agentName']!r}  inboundActive={after['isInboundActive']} "
          f"numbers={after['inboundNumbers']} prompt={len(ap)} chars")
    print(f"  liability phrases remaining: {left or 'none'}")


if __name__ == "__main__":
    main()
