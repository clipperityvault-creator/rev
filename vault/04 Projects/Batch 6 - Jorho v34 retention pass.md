---
tags: [project, jorho, batch, retention]
date: 2026-11-16
---
# Batch 6: Jorho v34 retention pass, 5 clips × 3 (15 Shorts)

User ask (2026-11-16): "next batch… make the edit better somehow where viewers would be hooked and increase retention rate."
Code: `src/jorho/clips.tsx` section `v34`.

## Retention levers added (evidence: our own analytics in [[Jorho style]] v19–v30)
- Kept what the data says works: Jorho box-opening intro (72% vs 55–58% stayed without it), bold-claim / question hook lines with names, real footage from frame 0, silent music beat before the payoff, loop ending.
- **Punch-ins** (`Spec.punch`): 1.13× snap zoom held 550 ms on key words → a visual change every 1–2 s.
- **Mid-video re-hook**: a label around 45–55% ("WAIT… THEY'RE ACTUALLY FRIENDS?", "THEN THEY PITCHED THIS…", "PLOT TWIST").
- **Three retention structures per clip**:
  - A = story order + reaction cuts + punch-ins + re-hook label;
  - B = question hook on top, answered by a list that fills in (`Stack`), ends with a comment prompt where it fits ("SLOT 4: YOUR PICK?");
  - C = cold-open teaser of the most intriguing line (1–2.3 s) → ◀◀ `Rewind` overlay + strobe → full story, payoff still lands (story complete). `wordsAll` captions repeated segments; `shiftShots` offsets the verified shot list.
- Coen extended to 18 s so it ends on a finished sentence ("…different than any system I've had").

| clip | A | B | C (teaser) |
|---|---|---|---|
| u4 Peyton | "Peyton Manning texts this QB all season long" · Blue | "Who calls an NFL QB about his autograph?" · Chess | "A 5× MVP calls this QB" · "He called me about something one time" · Lose You |
| u6 Coen | "1 year with this coach beat his whole career" · Tipo Insta | "Did one coach really change his whole game?" · Midnight Club | "He said this about his coach… and meant it" · "Liam Coen has taught me more" · Einaudi |
| u2 Celly | "He said no to every celebration… except this one" · Du bist | "What celebration would YOU give an NFL QB?" · Fluffing a Duck | 'Why is he pointing and saying "10 10 10"?' · "10, 10, 10. It's easy." · Chess |
| u3 Redeem | "A $20,000 card… now 500 bucks?" · Monkeys | "Why do card fans hate waiting for autographs?" · Curb | "Card fans hate this one thing… and it hit HIM" · "people very much dislike that" · Funk Abnormal |
| t2 Golf | "Jesus AND Tiger Woods in one golf group?!" · Du bist | "Who would YOU put in your dream golf group?" · Sneaky Snitch | "His first dream golf partner is not who you think" · "throw Jesus in there" · Amor Na Praia |

## Measure
Compare stayed-to-watch and average % viewed of A vs B vs C per clip at 48 h; keep the winning structure as the default for the next batch.

## Feedback log
- (waiting)
