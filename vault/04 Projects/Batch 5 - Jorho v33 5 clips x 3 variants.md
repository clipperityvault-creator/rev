---
tags: [project, jorho, batch, variants]
date: 2026-11-15
---
# Batch 5: Jorho v33, 5 clips × 3 variants (15 Shorts)

User ask (2026-11-15): "next batch, for each clip there must be three edits". Answers: 5 clips × 3; same Jorho frame, varied details (v28 rule).
Code: `src/jorho/clips.tsx` section `v33`. Timelines, captions and speaker shots reuse the verified v5/v7/v11 ones (`tTl`, `tt`, `g7`, `j3`, `n7`).

## Variant recipe (what changes between A/B/C)
| | SFX palette | graphic gag | music (drop on the payoff) |
|---|---|---|---|
| A | meme: bonk, orch, violin, lwk, dun-dun, tada, trombone | labels + cut-outs of who's named | Du bist (full) 42.5 s (Ticket A: Blue "I'd") |
| B | game show: ding-2, error, clock tick, cha-ching, anime wow, record scratch | a checklist that builds (`Stack`) + emoji pops | Joyful Chess / Monkeys / Fluffing a Duck |
| C | cinematic: riser peaking on the payoff, heartbeat, soft mg-boom ≤0.2, shimmer | suspense device: "guess who", censor beep before a name, 400 ms freeze (Josh C), speed-line burst | Interstellar piano, Funk Sigilo, Einaudi, Eclipser, Sneaky Snitch |
All variants: Jorho intro, "TREVOR LAWRENCE · NFL QB" label, one-word captions always on, a silent music beat right before the payoff, −14 LUFS master.

| clip | A | B | C |
|---|---|---|---|
| t1 ant autograph → Peyton | `JorhoAntA` "This QB's autograph got called an ANT" | `JorhoAntB` "Peyton Manning called him about THIS" | `JorhoAntC` "What Peyton Manning told him about autographs" |
| t3 Traveling Trevors | `JorhoFansA` "Two grown men dress like him at every game" | `JorhoFansB` "He thought these fans were whacked… then this" | `JorhoFansC` "When the guy you dress up as finds your videos" |
| t4 natty ticket gift | `JorhoTicketA` "Gifting someone their OWN autograph is wild" | `JorhoTicketB` "His own signature came back to him as a gift" | `JorhoTicketC` "The one ticket he never kept for himself" |
| t5 wrong Josh Allen | `JorhoJoshA` "Pulled a Josh Allen… but it's the WRONG Josh Allen" | `JorhoJoshB` "There are TWO NFL players named Josh Allen" | `JorhoJoshC` "He thought he hit the jackpot… then read the name" |
| t6 Davis Mills neck | `JorhoNeckA` "Worst way to find out your neck is famous" | `JorhoNeckB` "This pack opening turned into a neck roast" | `JorhoNeckC` "Nobody's neck is safe at this table" |

## Lessons from the stills
- A dark emoji (🐜) on a dark shirt vanishes: put pops on the light wall and give them a white glow (`Pop` now has one).
- A ❌ row in a checklist must not get the green ✓.

## Feedback log
- (waiting)
