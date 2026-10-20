#!/usr/bin/env python3
"""Deploy the Lindley Team Knowledge Base FAQs from this file to live GHL.

Why this exists: the KB shipped in April 2026 and was never updated after the move to Movement
Mortgage. As of 2026-08-11 three of its six answers still described **Mortgage Express**, called
the team a "correspondent lender", and offered to "broker through our wholesale lending network".
Every one of those is a banned positioning line, and every answer that named a loan officer named
only Bri. June reads this KB, so she was repeating all of it.

Upsert by exact question text, so re-running is safe.

    cd "~/Desktop/Ai Tools/leadgenjay-gohighlevel-cli-<hash>"
    set -a; . ./.env; set +a
    ./.venv/bin/python <repo>/scripts/ghl/deploy_kb_faqs.py [--apply]
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
KB_ID = "UI50OxMhVCRHS5J2qUpi"
_tm = TokenManager()

# Words that must never appear in an answer. These are the exact lines that were live.
BANNED = ["Mortgage Express", "correspondent lender", "wholesale lending network", "broker through",
          " free ", "—", "–", "guarantee"]

# One source for chat and voice: the same JSON feeds the GHL knowledge base (here) and June's
# typed chat (src/lib/june.ts imports it), so a fact can never exist in one channel and not the other.
FAQS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                   "..", "..", "docs", "ghl-content", "june-faqs.json")))


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


def read_all_faqs() -> list[dict]:
    """The list endpoint returns 10 rows and reports the real total in `count`. `&page=` is
    silently ignored, which is how you end up creating duplicates of everything past row 10.
    `&offset=` is the one that works. Assert the total before trusting the result."""
    base = f"/knowledge-base/faqs?locationId={LOC}&knowledgeBaseId={KB_ID}"
    s, d = req(base)
    if s != 200:
        sys.exit(f"read failed: {s} {d}")
    faqs, total = list(d.get("faqs", [])), d.get("count", 0)
    while len(faqs) < total:
        s, d = req(f"{base}&offset={len(faqs)}")
        if s != 200 or not d.get("faqs"):
            break
        faqs += d["faqs"]
    assert len(faqs) == total, f"paged {len(faqs)} of {total} FAQs; refusing to guess"
    return faqs


def main() -> None:
    apply = "--apply" in sys.argv

    for q, a in FAQS.items():
        for bad in BANNED:
            assert bad.lower() not in (" " + a + " ").lower(), f"{q!r} contains banned {bad!r}"

    live = {f["question"].rstrip("?").strip().lower(): f for f in read_all_faqs()}

    for q, a in FAQS.items():
        key = q.rstrip("?").strip().lower()
        cur = live.pop(key, None)
        if cur and cur["answer"].strip() == a.strip():
            print(f"  ok      {q}")
            continue
        verb = "UPDATE" if cur else "CREATE"
        offenders = [b for b in BANNED if cur and b.lower() in (" " + cur["answer"] + " ").lower()]
        print(f"  {verb:6}  {q}" + (f"   (was carrying: {offenders})" if offenders else ""))
        if not apply:
            continue
        body = {"locationId": LOC, "knowledgeBaseId": KB_ID, "question": q, "answer": a}
        if cur:
            s, r = req(f"/knowledge-base/faqs/{cur['id']}?locationId={LOC}"
                       f"&knowledgeBaseId={KB_ID}", "PUT", body)
        else:
            s, r = req("/knowledge-base/faqs", "POST", body)
        print(f"          -> {s}" + ("" if s in (200, 201) else f" {r}"))

    for key, f in live.items():
        print(f"  ORPHAN  {f['question']!r} is live but not in this file. Delete it by hand or "
              f"add it here.")

    if apply:
        back = read_all_faqs()
        bad = [(f["question"], b) for f in back for b in BANNED
               if b.lower() in (" " + f["answer"] + " ").lower()]
        dupes = [q for q in {f["question"] for f in back}
                 if sum(1 for f in back if f["question"] == q) > 1]
        print(f"\nread-back: {len(back)} FAQs live, banned-phrase hits: {bad or 'none'}, "
              f"duplicates: {dupes or 'none'}")
    else:
        print("\ndry run. pass --apply to write.")


if __name__ == "__main__":
    main()
