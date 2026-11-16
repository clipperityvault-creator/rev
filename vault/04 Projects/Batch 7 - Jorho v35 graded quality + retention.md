---
tags: [project, jorho, batch, retention, grade]
date: 2026-11-16
---
# Batch 7: Jorho v35, 5 fresh clips × 3, graded footage (15 Shorts)

User ask (2026-11-16): "next batch, improve quality and retention".
Code: `src/jorho/clips.tsx` section `v35`.

## Quality upgrade
- Footage pre-graded with the user's CapCut "67" look into `public/g/` (gitignored), crf 14:
  `split[a][b];[b]gblur=sigma=14[g];[a][g]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.1:5:5:0.0,eq=contrast=1.11:saturation=1.26`
  Text, emoji and overlays stay ungraded; the Jorho CSS grade is set neutral so it's not doubled.
- Lair left-seat track was following the man standing behind the host → re-tracked with `Y=380-760` (`v_lair.seats2.json`).
- New large-v3 transcripts for `v_presnap`, `v_lair`, `v_rogers_realm`, `v_nt_rip` (`src/plans/data/`).

## Retention
Same A/B/C structures + punch-ins + mid re-hook as [[Batch 6 - Jorho v34 retention pass]]. Teaser labels in C start after the 0.8 s box-opening intro (they crossed the top line before).

| clip | story | A | B | C teaser |
|---|---|---|---|---|
| NT rip | true RPA gold → slide → **Justin Fields** → $20,000 in 2021, $200–500 now (guesses cut: no name before the reveal) | "The card everyone chases… worth WHAT now?" | "Guess what this $20,000 card is worth now" | "you pull this card, I promise you $20,000" |
| Lair | invite to the Lair → "that'd be awesome" → "we weren't thinking about going to the Colts" | "They invited an NFL QB over… then said THIS" | "Would an NFL QB come rip cards with you?" | the Colts line |
| Rogers Realm | away fans out-cheered the Jags → Traveling Trevor vs Rogers Realm → "we should box him" | "This superfan feud NEEDS to happen" | "Who wins: Trevor's superfan or Rodgers' superfan?" | "We should box him. I should take him out." |
| Pre-snap | how often does he know who's open → "50 to 65%" → "it ends up going there" | "An NFL QB admits his reads go wrong THIS often" | "Guess: how often does an NFL QB's first read work?" | "I know it should go here and it ends up going there" |
| Entrance | "All hail the king" ×3 → Trevor walks in → a bow → replay | "How they welcomed an NFL QB to the stream" | "Would you bow if an NFL QB walked in?" | the bow |

## Feedback log
- (waiting)
