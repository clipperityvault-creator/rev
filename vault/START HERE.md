---
tags: [index]
---
# START HERE

This repo is a **Remotion + Whisper Shorts editing setup**, and this `vault/` folder is its memory (open it in Obsidian, or just read the Markdown). A new session should read this file first, then follow the links.

## What the user wants
Edit podcast/streamer clips into viral vertical Shorts in a **meme / brainrot clipping style**, copying the references they gave and the patterns from researching 50 top Shorts. They give feedback on each version, so check the feedback log in the project note before editing again.

## User preferences
- **Focus: Trevor Lawrence clips only (2026-11-25):** "stop making the card pulls clips just focus on the tlaw clips". No card-pull batches until the user asks again. Posted so far (from the user's channel screenshot): coen, celly, redeem, lair, rogers, presnap, enter (1.1K views, cold open), golf, josh, neck. The cold-open edit is the only one that broke out → default for Trevor edits.
- **Riser before every reveal (2026-11-22):** "when revealing something you must add the riser effect so that it would get tense". On each video's reveal/payoff: cinematic-suspense-riser peaking ON the reveal, edges darken (vignette) over ~2.6 s, music drops out for the last 450 ms, then the reveal hits.
- **Music −15 dB under the raw audio (2026-11-21):** "lowering the background music where the raw videos music wouldnt be covered … -15dB". Measure the stream segments (LUFS) and the song, set a steady music gain = 15 dB under the voices (`music.level`, see `src/pulls/b10_music_levels.json`); only the 300 ms silence before the drop changes it. Also: a 2nd short hype cutaway right before the slow-mo, hook title stays until the reveal, punch-in on the hosts' real reaction after the reveal. Check each hook clip for burned-in text (scale it off-screen or pick another clip).
- **Keep viewers busy + beat-exact reveals (2026-11-21):** "make them better by adding pop ups … fix the errors and the timing of the beats when revealing". Every card pull gets: iOS emoji pop-ups on key words (pop SFX), "WAIT FOR IT… 👀" blinking in the slow-mo + heartbeat, a money/fire emoji burst + shake on the reveal, the price counting up, zoom pulses on the next beats. The music drop must be the MEASURED first beat (see SFX and music library → Measured drops). Check captions for transcription errors before rendering.
- **Never repeat the main footage (2026-11-21):** "make sure the clips arent repeated … the hooks can repeat but the needed video cant". Each pull/clip is used in ONE video only (no A/B/C versions of the same pull, no reuse across batches). Hook clips may repeat. Inside a video, the teaser shot must not be the same moment as the reveal.
- **Card pulls: 15–16 seconds (2026-11-21: "it must atleast be 15 seconds", 16 s max)** like refs PTBmw2npS9o / 33kmdagNFhM: blurred teaser of the card + hook text at frame 0, short hype cutaway, build-up, reveal with PLAYER/CARD/$PRICE, best reaction, done. Skip players the user doesn't know (e.g. Sir Alex Ferguson). See [[16s card pull (PTBmw2npS9o + 33kmdagNFhM)]].
- **Already posted, skip (2026-11-19):** Kon Knueppel (the user posted it). Check this list before picking a pull.
- **No more Cooper Flagg (2026-11-19):** "im done with cooper flag". Skip Flagg pulls/clips in future batches; pick other players from the sheet.
- **Blur ONLY the card (2026-11-17):** "dont blur the hand or the card when its not opened yet or when you put it in intro just blur the card not a whole big box of blur". No blur on card backs, base cards or covered slabs; when the hit card shows before its reveal (e.g. a cold-open reaction), a tight rounded blur the size of the card only. Hook clips: no blurred caption box; frame the clip so its burned caption falls off-screen (scale ~1.45 from the top).
- **Less obviously AI + good background music (2026-11-17):** "lessen the obviousness of AI and use good background music for retention". Look like the creator's own Shorts: real footage carries it, ONE white hook banner, plain captions, a player/card/price stack on the reveal, whip cuts. No label pills, checklists, sticker emoji, burst lines, rewind icons or a meme SFX on every beat. No AI narration (the AI-voice cold open got 28% stayed). One strong song (phonk for pulls) clearly audible (~0.18 under talk, ~0.3 after the drop), drop on the reveal, short silence before it. See [[Batch 8 - natural card pulls]].
- **Retention sound design on every video (2026-11-15):** "the videos must have sound effects that can make people who are watching stay and watch til the end" + background music. Every beat gets a purposeful myinstants SFX (no dead stretches), with a riser/build into the payoff, and a music bed throughout.
- **Frame the person who is ACTUALLY talking (2026-11-01).** Before picking shots, check who speaks each line: run `scripts/voice_diarize.py` (voice clusters) + `scripts/speaker_check.py` (mouth motion per seat), then confirm with a frame strip. Laughing fools the mouth check. If unsure, use the wide shot.
- **Plain words only on screen (2026-11-01).** Captions and 3D text use words an average viewer knows. Swap hobby slang (auto → autograph, redeem → "why the wait", prism, numbered, etc.) for everyday words, or cut the line.
- **Every title + description must be brand new (2026-11-01).** Never reuse or lightly reword one sent before, even for a re-send. Check `vault/04 Projects/Titles used.md` first and add each new one there.
- **Captions ALWAYS on screen (2026-11-01):** each word stays until the next word, never blank gaps.
- **Title, description and tags go in chat inside code blocks** (one block for the title, one for description + tags) so the user can tap the copy button. (2026-11-01)
- **Always send a title + description with every video.** The description should be a short story or in-depth explanation (about 3–5 sentences, not too long), followed by tags that boost reach: 8–15 hashtags mixing broad (#shorts #nfl) and niche (#trevorlawrence #jaguars), plus a few plain keyword tags. (2026-10-26)
- **Always send the finished video file directly in chat** (SendUserFile) so they can download it.
- iOS emoji only; Ref A glow font; whoosh = `fast-whoosh.mp3`, ding = `ding-2.mp3`.
- Music: **podcasts** → one meme song looped, loud (`du-bist-gut-genug.mp3`). **Non-podcasts** → the user's slowed Brazilian phonk list, drop timed to the big reveal (see [[SFX and music library#Music for NON-podcast clips (user's phonk list)]]).
- **Blur (and/or beep) cards until they're revealed**: makes viewers curious who was pulled. Don't name the player in the banner/hook before the reveal.
- Red circle must **really track** the face: use `scripts/track.py` (OpenCV CSRT), never hand-guessed keyframes.
- Add small punch-in zooms on key words (1.1–1.18×), only the relevant part of the frame.
- Big reveal = **green screen flash + falling money (💵💸💰) + ka-ching**, and it has to be **shocking**: white flash, shake, zoom slam, "1 OF 1" stamp. Before it, **build suspense** (slow-mo, heartbeat, riser, trembling zoom, vignette, "WAIT FOR IT", music cut right before the drop).
- **AI narration** (ElevenLabs) on card pulls, **ONLY the "Alex - Young American Male" voice** (`yl2ZDV1MzN4HbQJbMihG`); see [[Card pull playbook#AI narration]].

- **Length (2026-10-31, replaces 15–25): 15–30 s, aim for ~20 s, and the main point/story MUST finish before the video ends.**
- **Length: every Short 15–25 s** (30 s is too long, never under 15 s; go a bit over only if the moment really needs it). (2026-10-25)
- **Card edits: open with a hook clip from the user's hooks folder** (Drive `1DnNI_zX5q7eWpiDOP75SnCMDWNC5xYkI`, local `public/hooks/`). (2026-10-25)
- **Music variety: don't reuse one song for every video.** Rotate through the user's phonk list for card pulls. Podcast music by mood:
  - funny → Du bist gut genug;
  - wholesome → "Blue" (Yung Kai), edited as a **W speed edit** in our usual style;
  - serious → phonk. (2026-10-25)
- **Podcast captions stay in ONE fixed spot** (66% down the video box). Never move them per shot; covering a face sometimes is OK. (2026-10-25, replaces the earlier "under the faces" rule)
- **Podcast: motion-track the speakers**: the crop follows the face of whoever is talking, never random people in the background. `scripts/seat_track.py` only accepts faces near the seat and at seated head height. When people walk around, use wide shots instead. (2026-10-25)
- **Hook clips are ONLY for card pulls**, never in podcast videos. (2026-10-25)
- **W Speed edits:**
  - freeze the screen (`scripts/insert_freeze.py`) and put a **gray overlay** on it;
  - the "W TREVOR ❤️‍🩹" caption lands on Blue's **"I'd imagine we fell in love / under moonlight skies with you"** (song 55.7–65.4 s; the freeze starts on 59.9 s);
  - the narrated action text (*TREVOR WALKS IN*) gets a **keyboard typing SFX** (`sfx/keyboard-typing.mp3`). (2026-10-25)
- **Let the speaker finish the story before the video ends.** End cuts on a finished sentence, even if it runs a bit past 25 s. (2026-10-25)
- **ElevenLabs retries: don't wait long.** If a call is rate-limited, retry after a couple of minutes, not 15–30. On 2026-10-25 an immediate retry worked and two back-to-back calls went through. (2026-10-25)
- **Podcast clips:** use the Ref C layout (black bars, video box, plain top caption "Do you agree with this? 💀", cut-out photos of people mentioned) **on top of** our normal edit style. See [[Reference Shorts#Ref C: podcast layout (user: "for podcast style videos make it like this")]].

- **Card pulls (stream clips from the Backyard Breaks sheet):** follow [[Card pull playbook]] (white banner hook, whip transitions, tracked red circle + arrow, card title stack with price).

## Map
- **Research**
  - [[Shorts analysis - 50 clips]]: the 50 Shorts, views, format, hook and edit notes for each
  - [[Hooks and retention]]: how they hook and keep viewers watching
  - [[Editing playbook]]: what SFX, effects and memes go when and where
  - [[Reference Shorts]]: Refs A–C (A = same show as their footage, C = podcast layout)
  - [[Card pull and clip refs D-G]]: SFX, red circle/arrow tracking, transitions (round 2 training)
- **Style guide**
  - [[Caption style]]: font (Montserrat 800 + glow), keyword colors, iOS emoji
  - [[SFX and music library]]: every sound/music file, when to use it, licensing
  - [[Card pull playbook]]: template for card-pull stream clips
  - [[Edit3 kinetic storytelling compositing]]: **Edit3** (`src/E3Ant.tsx`): kinetic type + story graphics + text/photos behind the speaker; lessons from the 38% STW flop (no ad look, cold-open hook, sound design checklist)
  - [[Glass style]]: **current pick (2026-11-01)**: cinematic full-frame motion design (glass UI cards, serif words behind the head, orbit avatars, 2D football people, B&W beat), from the user's TikTok ref
  - [[Jorho style]]: copied from 4 Backyard Breaks Shorts: black bars, 💀 top line, one-word colored captions, punch-ins, exposure flash, meme cutouts
  - [[Motion graphics podcast style]]: **preset Edit2** (`src/Edit2.tsx` + `src/plans/edit2/`), the motion-graphics podcast edit, plus research on 6 viral refs
- **Workflow**
  - [[Edit workflow]]: step by step, from Drive link to rendered MP4
  - [[Environment notes]]: cloud-box gotchas (blocked hosts, Chrome path, fonts)
- **Projects**
  - [[NBA GOAT pick]]: Trevor Lawrence podcast clip: seat map, verified timings, **feedback log**
  - [[Cooper Flagg Arrivals 1-1]]: card pull from the sheet
  - [[Batch 1 - 6 big pulls + 6 Trevor clips]]: 12 Shorts from the sheet, how the batch pipeline works, titles/descriptions
  - [[Batch 2 - 6 big pulls + 6 Trevor clips]]: hooks, mood music, face tracking
  - [[Batch 3 - Edit3 4 cards + 4 Trevor]]: Edit3 style on black bars + card pulls, titles/descriptions
  - [[Batch 4 - Jorho v32 Tiger gift + T-Law packs]]: two unused sheet clips, retention sound pass
  - [[Batch 5 - Jorho v33 5 clips x 3 variants]]: 15 Shorts, A/B/C variant recipe
  - [[Batch 6 - Jorho v34 retention pass]]: punch-ins, re-hook label, cold-open teaser + rewind
  - [[Batch 7 - Jorho v35 graded quality + retention]]: graded footage, 5 fresh clips
  - [[Batch 8 - natural card pulls]]: less-AI card-pull style, 5 big pulls × 3
  - [[Batch 10 - one video per pull]]: 5 pulls, one video each
  - [[Batch 11 - v36 Trevor interviews from user refs]]: all 19 Trevor clips, refs' music, reaction bubble, aura
  - [[Riddle card pull (4-2ECl4wWOs)]]: **style for the next batch**
  - [[Batch 9 - reference-style pulls]]: 5 pulls × 3 in the reference style
  - [[Reference card pull (6OkxaC1w9jA)]]: the user's reference card-pull look (`RefPull`), Flagg $445 → $9,300

## Quick start (new session)
1. Read [[NBA GOAT pick]] (feedback log) and [[Caption style]].
2. `npm install` (and `pip install faster-whisper` if transcribing).
3. Download footage one file at a time with `scripts/drive_dl.sh` (parallel Drive pulls get blocked).
4. Transcribe with `scripts/batch_transcribe.py`.
5. Write a plan:
   - card pull → `src/plans/card/<name>.ts` with `makeCardPlan`;
   - podcast → `src/plans/pod/<name>.ts` with `makePodPlan`.
   Copy an existing plan as the template.
6. Check stills (`scripts/stills.sh`), then render with `scripts/render_card.sh <name>` / `scripts/render_pod.sh <name>`.
7. Send the MP4s in chat, plus titles and descriptions (see [[Batch 1 - 6 big pulls + 6 Trevor clips#Titles + descriptions (sent to user)]]).

## Repo layout
| Path | What |
|---|---|
| `src/plans/pod/*.ts` | podcast edit plans (`make.ts` = `makePodPlan` factory: captions, shots, SFX, music from a short spec) |
| `src/plans/card/*.ts` | card-pull edit plans (`make.ts` = `makeCardPlan` factory: suspense, reveal, narration, banner) |
| `src/activePod.ts`, `src/activeCard.ts` | which plan renders; switch with `node scripts/use-plan.mjs pod\|card <name>` |
| `src/ShortEdit.tsx`, `src/CardPull.tsx` | the Remotion renderers (podcast layout / card-pull layout) |
| `scripts/drive_dl.sh`, `batch_transcribe.py`, `prep_narr.py`, `track.py`, `seat_motion.py`, `stills.sh`, `render_*.sh` | batch pipeline (see [[Batch 1 - 6 big pulls + 6 Trevor clips#How it was built (reuse this)]]) |
| `scripts/transcribe_words.py` | faster-whisper word timestamps → `public/words.json` |
| `scripts/speech_segments.py` | real speech on/off times from the audio (to fix whisper timing) |
| `public/emoji-ios/` | Apple emoji PNGs (160 px) |
| `public/sfx/`, `public/music/` | sound effects and royalty-free music |
| `vault/assets/research/` | contact sheets of the 50 analysed Shorts + the hashtag pool |
| `vault/assets/references/` | full-res frames of the two reference Shorts |
- **Top captions must be creative and NOT about Trevor (2026-11-01).** Write it like a meme about the topic or the player ("This man is better than MJ and LeBron combined", "Real ball knowledge is knowing who the GOAT is"), never "Trevor's NBA GOAT". Every clip gets a new one.
- **Keep usage low (2026-11-01):** batch similar clips in one file, check ONE stills grid per batch, render in one queue, no re-checks unless something is clearly broken.
- Campaign rule: Shorts must be 15 s+ (aim 16+). Never ship under 15 s.

### Edit upgrades (2026-11-26, user) — apply to ALL edits from now on
- **Meme pop-ups:** use well-known current memes as pop-ups (search for them). Every meme pop-up gets its matching meme sound, synced exactly to when it appears.
- **No "scientific" overlays:** no percentages, stats, timers or numbers like "2.7s of silence".
- **No rectangle label chips** in the top-right of the video box (they look boring and AI-made). Keep on-screen text to the top line + captions + memes.
- **Colour flashes with SFX:** green flash → `cha-ching.mp3` or `ding-2.mp3`; red flash → `error.mp3`, `fahhh.mp3`/`meme-fahh.mp3`, or a shocked SFX. Never a flash without its sound.
- **Less AI-looking** overall: fewer generic graphics, more human-style meme editing.
- **People pop-ups ARE allowed** (corrected 2026-11-28): show the people mentioned (headshots in `public/people` from ESPN, `public/cutouts`), but never the same photo twice — each photo once per batch, first mention only. Like BBreaks_Grail: a GOAT collage (MJ/LeBron/Kobe/Curry) rising from the bottom.
- **Every video in a batch must look like a different editor made it** (2026-11-28): own layout, fonts, caption engine, hook style, flash, meme frame, rewind, grade, intro, signature sounds. Presets in `src/jorho/looks42.tsx` (19 looks).
- **Next:** the user will send 1–2 reference videos, then re-edit ALL the Trevor clips with these rules + the reference style.
- **Why uniqueness matters (user 2026-11-28):** BBreaks_Grail posts the SAME Trevor GOAT clip many times (2.8K–23K views each) because every edit looks different: new title, new player photo collage, new layout. So every video must differ in some visible way.
- **Titles/captions must be specific and hooky (user 2026-11-28):** name what's in the clip (people, numbers, the joke), short, end with 💀/😭. Not generic lines like "The coach who changed everything for him". BBreaks examples: "Better than MJ and LeBron fr 💀", "Bro caught a stray 😭", "Is this a valid take? 😭".
