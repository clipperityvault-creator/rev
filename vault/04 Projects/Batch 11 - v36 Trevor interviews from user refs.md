---
tags: [project, jorho, trevor, batch]
date: 2026-11-21
---
# Batch 11: all 19 Trevor interview clips re-edited (v36)

User (2026-11-21) sent 4 reference edits (Messenger uploads, 18.6–19.4 s each, same footage): "edit all the trevor lawrence interview videos again … take inspiration from these edits … use what music they are using … not just pop ups but something unique".

## What the refs are
Jorho frame (black, box 417–1494, blurred box-opening intro), top line sentence-case + 💀 that teases without the name ("The #1 Football Player…"), one-word coloured captions, meme reaction cut-outs at the bottom of the box (soldier, crying guy, laughing guy with paper, headset streamer, two guys on phones), green/red tints, white flash, money-bill rain.

## What we did (`src/jorho/clips.tsx` section v36, comps `V36<Name>`)
- **Music = the refs' own beds**: demucs htdemucs two-stems → `no_vocals` → `public/music/refbg1-4.wav` (loudnorm −20, gitignored). Clean beds (no SFX spikes). The songs are not in our library (chroma match < 0.23). Level per clip = 15 dB under that clip's voice LUFS (`src/jorho/v36_music.json`), looped.
- **Did NOT copy the refs' meme cut-outs** (another editor's assets; auto-cutting them grabbed Trevor + their captions). Instead: auto cut-outs of whoever is named (first mention → `img/jorho/*.png`).
- **Unique**: live **REACTION BUBBLE** (circle, top-right of the box) with the other person's real face at the same moment (from the seat track; centre = track y + 0.45·w, scale 150/w); **AURA ±N counter** with rizz / trombone SFX; emoji pops on every tint; 💵 rain on money clips.
- New tease top lines (no name). Long clips trimmed by whole sentences (`cutSpec`): Playbook, Ant, Celly, Ticket. Lengths 15.2–20.5 s.
- Bubbles off for Neck (wrong seat track), Enter and NT (people standing/moving).

## Self-review pass (2026-11-22, user: "look at the edits and make them better until you like the video")
1. Found 5–10 s dead stretches (only captions) → **gap filler**: any gap > 2.2 s between real visual events (tints, strobes, cut-outs, real seat changes, the riser window) gets a keyword emoji pop OR a punch-in, alternating, never the same emoji twice per video.
2. AURA on every video (sometimes twice) looked templated → **one AURA per video**, on the reveal (negative only for big losses, e.g. NT −19,500).
3. Reaction bubble → **one**, at the reveal.
4. Regression found: the v36 layer had replaced each clip's own story graphics (GOAT slot reel + silence timer, CARD VALUE / REDEEM / PSA 10 explainer labels, Playbook flat diagram) → restored underneath (`s0.box`), AURA moved to y 150 so it doesn't cover the labels.
5. Missing emoji PNGs (1f4cb, 1f92a) made stills fail → downloaded; checked every referenced emoji exists.
