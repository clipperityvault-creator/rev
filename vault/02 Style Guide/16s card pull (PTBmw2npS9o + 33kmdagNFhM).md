---
tags: [style, card-pull, short, reference]
date: 2026-11-21
---
# 16-second card pull (user refs PTBmw2npS9o + 33kmdagNFhM)

User (2026-11-21): "improve all videos except the ferg since i dont know him, it must be only 16 seconds max just like this one: PTBmw2npS9o and 33kmdagNFhM". **Rule: card pulls are ≤ 16 s.** Skip players the user doesn't know (Sir Alex Ferguson; prefer big US names).
Code: `src/pulls/ShortPull.tsx` (renderer) + `src/pulls/shorts.tsx` (specs), comps `Short<Name><A|B|C>`.

## What the refs do (storyboards)
- Ref 1 "ONLY 10 OF THIS $1,500 NBA RISING STAR!": white box banner on top, black type, red count + green price; card-in-hand teaser at frame 0, green-screen "can you guess" cutaway, then the stream with a red arrow, reveal with NAME / PARALLEL / $PRICE stacked (white/red/green). ~15 s.
- Ref 2 "THIS WAS A $200,000 DECISION": plain bold white text with green $, red circle drawn around the (hidden) card, fast cuts, price stamp at the end.

## Our structure (each ≤16 s)
1. 0–1.5 s **teaser**: the revealed card on the table, **blurred (card only)**, hook text on screen from frame 0 (A/C: white box; B: plain white + green, red circle drawn around the blurred card).
2. ~1.3–1.5 s **green-screen hook clip** (scaled from the top so its caption is off-screen), hook text still up.
3. The **build-up** on the stream (pushed in 1.18×), captions white + one green keyword, red arrow on the card.
4. 1 s **slow-mo** (muted) → **reveal**: flash + punch-in, title stack PLAYER (white) / CARD (red) / $PRICE (green), phonk drop, cha-ching.
5. 3–4 s of the best reaction line, end.
Master: two-pass loudnorm −14 LUFS, then a gain trim if it lands off (phonk-quiet clips need +1.5 dB).
