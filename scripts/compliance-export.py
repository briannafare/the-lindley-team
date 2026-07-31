#!/usr/bin/env python3
"""MAP Rule (Reg N, 12 CFR 1014) compliance export — Lindley Team GHL.

Snapshots every live workflow's marketing message bodies (email / SMS / internal
notification) to dated files, so the 24-month recordkeeping requirement survives
in-place GHL template edits. Commit the output to git — GitHub is the durable
store outside GHL.

RUN THIS:
  • now (baseline), and
  • BEFORE editing any workflow email/SMS/nurture body going forward.

Usage:
  export GHL_FIREBASE_REFRESH_TOKEN=...   # from the leadgenjay ghl CLI .env
  python3 scripts/compliance-export.py            # -> docs/compliance/exports/<YYYY-MM-DD>/
"""
import json, os, ssl, sys, urllib.request as R
from datetime import date
from pathlib import Path

CLI = Path("/Users/briannalindley/Desktop/Ai Tools/leadgenjay-gohighlevel-cli-23cbc5732db2284717344234d6f2410b43e922ba")
sys.path.insert(0, str(CLI))
from cli_anything.gohighlevel.utils.ghl_internal_client import InternalGHLClient, TokenManager

LOC = "pe2yBdfaVo406b3BaavZ"
CTX = ssl.create_default_context(); CTX.check_hostname = False; CTX.verify_mode = ssl.CERT_NONE
OUT = Path(__file__).resolve().parent.parent / "docs" / "compliance" / "exports" / date.today().isoformat()


def body_of(step):
    a = step.get("attributes", {}) or {}
    t = step.get("type")
    if t == "email":
        return f"SUBJECT: {a.get('subject','')}\n\n{a.get('html') or a.get('body','')}"
    if t == "sms":
        return a.get("body", "")
    if t == "internal_notification":
        n = a.get("notification", {}) or {}
        return f"[internal notify] {n.get('title','')}\n{n.get('body','')}"
    return None


def list_workflows():
    """The ghl CLI wrapper lists workflows (public API); internal API has no list."""
    import subprocess
    out = subprocess.run([str(CLI / "ghl"), "-L", "lindley-team", "--json", "workflows", "list"],
                         capture_output=True, text=True, timeout=60).stdout
    return json.loads(out).get("workflows", [])


def main():
    c = InternalGHLClient(TokenManager(), LOC)
    workflows = list_workflows()
    if not workflows:
        print("No workflows returned from the public API.", file=sys.stderr)
        return 1
    OUT.mkdir(parents=True, exist_ok=True)
    index = []
    for w in workflows:
        wid = w.get("id") or w.get("_id"); name = w.get("name", wid)
        g = c.request("GET", f"/workflow/{LOC}/{wid}")
        try:
            tpls = json.loads(R.urlopen(g["fileUrl"], context=CTX, timeout=30).read().decode()).get("templates", [])
        except Exception:
            tpls = []
        msgs = [(s.get("name", s.get("type")), s["type"], body_of(s)) for s in tpls if body_of(s)]
        if not msgs:
            continue
        safe = "".join(ch if ch.isalnum() or ch in "-_" else "-" for ch in name)[:60]
        f = OUT / f"{date.today().isoformat()}_{safe}.md"
        with f.open("w") as fh:
            fh.write(f"# {name}\nworkflow_id: {wid}\nstatus: {w.get('status')}\nexported: {date.today().isoformat()}\n\n")
            for sname, stype, body in msgs:
                fh.write(f"---\n## {sname}  ({stype})\n\n{body}\n\n")
        index.append((name, w.get("status"), len(msgs), f.name))
    (OUT / "INDEX.md").write_text(
        f"# Compliance snapshot — {date.today().isoformat()}\n\n"
        + "\n".join(f"- {n} — {st} — {m} message(s) — [{fn}]({fn})" for n, st, m, fn in index) + "\n"
    )
    print(f"Exported {len(index)} workflow(s) with marketing/message bodies to {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
