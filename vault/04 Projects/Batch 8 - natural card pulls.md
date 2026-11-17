---
tags: [project, card-pull, batch, natural]
date: 2026-11-17
---
# Batch 8: natural card pulls, 5 pulls × 3 (15 Shorts)

User ask (2026-11-17): "next batch, lessen the obviousness of AI, use good background music for retention, increase retention."
Source: sheet tab **recent viral pulls** (`gid=133317179`, 923 rows); picked the biggest live reveals. Main Trevor tab is fully used.
Code: `src/pulls/Pull.tsx` (renderer) + `src/pulls/specs.tsx` (15 specs), comps `Pull<Name><A|B|C>`. Footage `public/pulls/` (gitignored), transcripts `src/plans/data/pulls/`.
Hooks folder is listable without login: `https://drive.google.com/embeddedfolderview?id=1DnNI_zX5q7eWpiDOP75SnCMDWNC5xYkI` (22 files, ids parsed from the HTML).

| pull | value | reveal (src) | story beats |
|---|---|---|---|
| Steph Curry Papa 1/1 | $100,000 | 89.4 s (pink card in hand) | "We have Papa… craziest guessing game" → slow-mo → reveal → "Steph Curry and LeBron James Papa in one break" → "heart beating faster than a motor" |
| Wembanyama Black Auto /10 | $30,000+ | 30.6 s | "Black auto to 10?" → reveal → girlfriend/goosebumps line → "crooked like my nose, I'd still buy that" |
| Aaron Judge Patch Auto 1/1 | $50,000 | 35.4 s (foam off the serial) | "No way it's a 1 of 1?" → "don't you dare" → reveal → "written in the script" → "how big that card is" |
| Ace Bailey Rookie Papa 1/1 | $40,000+ | 77.8 s | "another Papa? two straight boxes?" → "rookie Papa" → reveal "on your head, top!" → "it did $44,000" |
| Shohei Ohtani Black Auto /10 | $17,000+ | ~66 s | "Black auto to 10 right here" → "who is that? is that him?" → reveal → "he has Ohtani for the entire break" |

Dropped: LeBron Black /10 (no clean on-camera reveal; the reaction is Grant begging the customer to sell).

## The natural style (what changed vs Jorho/Edit3)
- Real stream frame, untouched layout. One white banner over the stream ticker (pre-reveal: scarcity + "who is it?", never the name; post-reveal: name + rarity + price; last 2.3 s: a question).
- Captions: plain white uppercase, 2–3 words, heavy dark shadow; hidden during the title stack.
- Reveal: 2-frame white flash, punch-in on the card (1.28 → 1), short shake, title stack PLAYER / CARD / PRICE, camera shutter + cha-ching. A soft riser into it.
- Whip blur + fast-whoosh on every cut. Slow-mo (0.5×, muted) only right before the reveal; cards blurred until the reveal.
- Versions: A = hooks-folder clip, B = cold open on the stream's own reaction (hosts' cam zoomed so the card stays hidden), C = a different hook clip. Different song and banner per version.
- No AI narration (ElevenLabs not connected, and AI voice tested worst).

## Feedback log
- (waiting)
