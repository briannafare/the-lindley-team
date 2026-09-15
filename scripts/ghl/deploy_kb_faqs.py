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

FAQS = {
    "Who is on The Lindley Team":
        "Two loan officers at Movement Mortgage, David Chandler and Bri Lindley. David has been "
        "doing this over twenty years and handles the complicated files: jumbo, new construction, "
        "self-employed borrowers, investment property, reverse. Bri grew up in these Portland "
        "neighborhoods and carries the CDLP, the Certified Divorce Lending Professional "
        "certification, which matters when a mortgage is caught up in a divorce. About 35 years "
        "between them and 156 five-star reviews. You get David or Bri, that is the whole org chart.",

    "Should I talk to David or Bri":
        "Either one, and they will sort it out between them. If it helps: divorce, separation, or "
        "buying out an ex is Bri, she is the Certified Divorce Lending Professional. Jumbo, new "
        "construction, self-employed or bank-statement income, DSCR and investment property, "
        "reverse mortgages, and anything in Arizona is David. First-time buying, refinancing, and "
        "neighborhood questions, take whoever has the sooner opening.",

    "Are you a broker or a bank":
        "Neither. David and Bri are loan officers at Movement Mortgage, a national lender. Most "
        "programs live in-house rather than being sent out, so answers come back faster and there "
        "is real flexibility on pricing. Movement is also an Impact Lender, which means ten "
        "percent or more of profits go back into communities.",

    "What types of loans do you offer":
        "Conventional, FHA, VA, USDA, and jumbo, plus the ones that take more work: bank-statement "
        "loans for self-employed borrowers, DSCR for investors, construction and renovation, "
        "reverse mortgages, HELOCs and cash-out, and Oregon down payment assistance. Movement's "
        "program shelf is deep, so the honest answer to most 'can I do this' questions is yes, "
        "with details. What are you trying to do? David or Bri can point you at the right one.",

    "What are your current rates":
        "Rates move daily and yours depends on your actual situation, so any number quoted here "
        "would be wrong by tomorrow and wrong for you today. David or Bri will pull real numbers "
        "for your file. Call or text 971-754-1771, or grab a rate and strategy call. Not a "
        "commitment to lock or lend.",

    "Do you charge for consultations":
        "No. A consultation with David or Bri is complimentary, about thirty minutes, and there is "
        "no obligation attached to it. You get a straight read on your situation either way.",

    "Are you licensed in my state":
        "The Lindley Team works in Oregon and Washington. David is also licensed in Arizona. If "
        "your property is somewhere else, they will tell you plainly rather than string you along.",

    "Where are you located":
        "Movement Mortgage, 10135 SE Sunnyside Road, Suite 125, Clackamas, Oregon 97015, right off "
        "the Portland metro. Phone is 971-754-1771. Most of the work happens by phone, text, and "
        "email, so you do not have to come in.",

    "How do I apply":
        "Head to thelindleyteam.com/apply and it takes you straight into the application. No "
        "picking anybody first. It runs securely through Movement and takes about fifteen minutes, "
        "and David and Bri both see it. If you would rather apply with one of them specifically, "
        "thelindleyteam.com/apply/choose has both. If something snags, text 971-754-1771 and a "
        "human will unstick it.",

    "Do you do divorce lending":
        "Yes, and it is the thing the team is known for. Bri is a Certified Divorce Lending "
        "Professional, one of few in Oregon, and works alongside attorneys on the lending side. "
        "The most useful thing to know: the wording about the house and any buyout in a settlement "
        "is far easier to get right before anything is final. If you are not divorced yet, that is "
        "the reason to have the conversation now. It is confidential, and it is complimentary.",

    "Who is Tammi Lindley":
        "Tammi is Bri's mom, and she co-founded The Lindley Team before stepping back from active "
        "lending. She spent two decades building the relationships the team still runs on. Today "
        "the team is David Chandler and Bri Lindley at Movement Mortgage.",
}


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
