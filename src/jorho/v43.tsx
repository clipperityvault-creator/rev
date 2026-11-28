// v43 (user 2026-11-28): keep the ORIGINAL Jorho format on every video (black top + bottom, video box, top line + emoji,
// one-word captions, green/red/yellow flashes with ding / cha-ching / wrong). What changes per video, like BBreaks_Grail:
//   · how it begins (opening hook)  · the pop-up images (memes + people, never the same photo twice)
//   · the VFX package  · a different famous song for every video (drop on the reveal, ~15 dB under the voices)
import type {CSSProperties} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cam, FPS, Music, SfxTrack, SpeechTrack, ease, pop, sfx, type CamCfg, type Seat} from '../e3/kit';
import {Frame, GREEN, OneWord, RED, Tints, strobe, type Word} from './kit';
import {Rain} from './pod7';
import {MONT} from '../e3/bars';
import {V41_CFG, v36, type Spec} from './clips';
import {TOP42} from './looks42';
import v36Music from './v36_music.json';

type Open = 'tease' | 'teaseAfter' | 'zoom' | 'cast' | 'memeOpen' | 'question' | 'flash' | 'glitch';
type Vfx = 'rgbPunch' | 'shakePunch' | 'wobble' | 'whip' | 'leak' | 'grain' | 'vhs' | 'vignette' | 'bloom' | 'bwReveal';
type MemeStyle = 'card' | 'polaroid' | 'sticker' | 'round' | 'plain' | 'tv' | 'comic' | 'tape';
type Var = {open: Open; vfx: Vfx[]; meme: MemeStyle; song: string; drop?: number; from?: number; q?: string; openMeme?: string; cast?: string[]; people?: [RegExp, string][]};

// songs: loudness measured (first 60 s, LUFS) so every bed sits where the reference bed sat (~15 dB under the voices)
const SONG_LUFS: Record<string, number> = {'montagem-pegadora': -4.7, 'funk-abnormal': -6.3, eclipser: -4.0, 'acido-iii': -7.9, 'amor-na-praia': -4.0, 'vem-pere-reka': -9.2,
  'funk-do-balkan': -6.5, 'tipo-insta-buzeira': -4.1, 'montagem-uranium': -3.5, 'funk-sigilo': -16.2, versatile: -9.6, 'tak-tak': -9.2, 'blue-yung-kai': -12.5,
  'lose-you-adturnup': -9.4, 'midnight-club': -13.2, 'joyful-chess-slowed': -9.9, 'interstellar-piano': -13.5, 'du-bist-full': -9.4, 'experience-einaudi': -14.6};
const BED_LUFS = [0, -19.5, -20.1, -21.5, -21.4];

const VARS: Record<string, Var> = {
  V41Playbook: {open: 'question', q: 'HOW MANY NEW PLAYS?!', vfx: ['grain', 'whip'], meme: 'polaroid', song: 'interstellar-piano', from: 20},
  V41Goat: {open: 'cast', cast: ['cutouts/jordan.png', 'people/lebron_espn.png', 'people/kobe_espn.png', 'people/curry_espn.png'], people: [[/^Dellavedova$/i, 'cutouts/delly3.png']],
    vfx: ['rgbPunch', 'bwReveal'], meme: 'card', song: 'montagem-pegadora', drop: 15.7},
  V41Presnap: {open: 'zoom', vfx: ['vignette', 'wobble'], meme: 'plain', song: 'experience-einaudi', from: 40},
  V41Ant: {open: 'tease', people: [[/^Richardson/i, 'people/ar_espn.png'], [/^(Peyton|Manning)$/i, 'cutouts/peyton.png']], vfx: ['shakePunch', 'leak'], meme: 'sticker', song: 'funk-abnormal', drop: 43.663},
  V41Golf: {open: 'cast', cast: ['people/tiger_espn.png'], vfx: ['grain', 'bloom'], meme: 'round', song: 'blue-yung-kai', from: 30},
  V41Fans: {open: 'memeOpen', openMeme: 'huh', vfx: ['vhs', 'whip'], meme: 'tv', song: 'tak-tak', from: 0},
  V41Coen: {open: 'question', q: 'LISTEN TO WHAT HE SAID', vfx: ['leak', 'wobble'], meme: 'polaroid', song: 'lose-you-adturnup', from: 30},
  V41Ticket: {open: 'teaseAfter', vfx: ['bloom', 'shakePunch'], meme: 'tape', song: 'amor-na-praia', drop: 13.5},
  V41Slab: {open: 'flash', people: [[/^Tiger/i, 'cutouts/tiger.png']], vfx: ['rgbPunch', 'grain'], meme: 'comic', song: 'eclipser', drop: 12.666},
  V41Josh: {open: 'cast', cast: ['people/allen_bills.png', 'people/hinesallen_espn.png'], people: [[/^Hines$/i, 'cutouts/hines_allen.png']], vfx: ['shakePunch', 'bwReveal'], meme: 'sticker', song: 'vem-pere-reka', drop: 21.1},
  V41Neck: {open: 'memeOpen', openMeme: 'leolaugh', people: [[/^Mills$/i, 'people/mills_espn.png'], [/^Glennon$/i, 'people/glennon_espn.png']], vfx: ['wobble', 'vhs'], meme: 'card', song: 'funk-do-balkan', drop: 11.9},
  V41Lair: {open: 'glitch', vfx: ['rgbPunch', 'vignette'], meme: 'tv', song: 'joyful-chess-slowed', from: 10},
  V41Rogers: {open: 'tease', people: [[/^Rogers$/i, 'people/rodgers_espn.png']], vfx: ['whip', 'bloom'], meme: 'comic', song: 'montagem-uranium', drop: 36.983},
  V41Celly: {open: 'zoom', vfx: ['leak', 'grain'], meme: 'round', song: 'versatile', from: 20},
  V41Packs: {open: 'question', q: 'EVERY CARD IS HIM??', people: [[/^(Lawrence|TLAW)$/i, 'people/lawrence_espn.png']], vfx: ['bwReveal', 'whip'], meme: 'polaroid', song: 'tipo-insta-buzeira', drop: 19.3},
  V41Nt: {open: 'teaseAfter', people: [[/^(Justin|Fields)/i, 'people/fields_espn.png']], vfx: ['vhs', 'shakePunch'], meme: 'plain', song: 'acido-iii', drop: 21.073},
  V41Enter: {open: 'flash', vfx: ['bloom', 'rgbPunch'], meme: 'tape', song: 'du-bist-full', from: 0},
  V41Redeem: {open: 'glitch', vfx: ['grain', 'wobble'], meme: 'card', song: 'funk-sigilo', drop: 36.936},
  V41Peyton: {open: 'cast', cast: ['people/peyton_espn.png'], vfx: ['leak', 'vignette'], meme: 'sticker', song: 'midnight-club', from: 20},
};
const OPEN_MEME: Record<string, {img: string; sfx: string; key: string}> = {huh: {img: 'huh.jpg', sfx: 'huh-cat', key: 'huh'}, leolaugh: {img: 'leolaugh.jpg', sfx: 'sitcom-laugh', key: 'leolaugh'}};
const MEME_KEY_OF_IMG: Record<string, string> = {'huh.jpg': 'huh', 'leolaugh.jpg': 'leolaugh'};

const shotAt = (shots: [number, Seat][], o: number) => shots.reduce<Seat>((w, [t, s]) => (o >= t ? s : w), 'W');
const BW = 1080, BH = 1077;

const MemeBox = ({o, at, to, img, left, style}: {o: number; at: number; to: number; img: string; left: boolean; style: MemeStyle}) => {
  if (o < at || o >= to + 160) return null;
  const p = pop(o, at), out = o > to ? 1 - (o - to) / 160 : 1;
  const fr: CSSProperties = ({
    card: {border: '7px solid #fff', borderRadius: 14, boxShadow: '0 12px 28px rgba(0,0,0,.6)'}, polaroid: {border: '14px solid #fff', borderBottomWidth: 54, boxShadow: '0 14px 30px rgba(0,0,0,.55)'},
    sticker: {border: '12px solid #fff', borderRadius: 34}, round: {borderRadius: 48, boxShadow: '0 16px 36px rgba(0,0,0,.55)'}, plain: {borderRadius: 6},
    tv: {border: '16px solid #1b1b1b', borderRadius: 30, boxShadow: '0 0 0 4px #555'}, comic: {border: '9px solid #111', boxShadow: '10px 10px 0 #111'}, tape: {border: '6px solid #fffaf0', boxShadow: '0 10px 22px rgba(0,0,0,.5)'},
  } as Record<MemeStyle, CSSProperties>)[style];
  const rot = style === 'polaroid' || style === 'tape' || style === 'card' || style === 'comic' ? (left ? -4 : 4) : 0;
  return <div style={{position: 'absolute', top: 60, [left ? 'left' : 'right']: 40, width: 400, transform: `scale(${p * out}) rotate(${rot}deg)`, transformOrigin: left ? '0 0' : '100% 0',
    overflow: 'hidden', lineHeight: 0, background: '#000', ...fr}}>
    <Img src={staticFile(`memes/${img}`)} style={{width: '100%', display: 'block'}} />
    {style === 'tv' && <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)'}} />}
  </div>;
};
// people rise from the bottom of the box (BBreaks look); a group of 2+ becomes an overlapping collage
const Rise = ({o, at, dur, files, side}: {o: number; at: number; dur: number; files: string[]; side: number}) => {
  if (o < at || o >= at + dur + 200) return null;
  const n = files.length, w = n > 1 ? Math.min(560, (BW + (n - 1) * 140) / n) : 600, h = (w * 436) / 600, out = o > at + dur ? 1 - (o - at - dur) / 200 : 1;
  return <>{files.map((f, i) => {
    const k = pop(o, at + i * 110, 13, 200), x = n > 1 ? i * (w - 140) + (BW - (n * w - (n - 1) * 140)) / 2 : side % 2 ? BW - w - 10 : 10;
    return <Img key={i} src={staticFile(f)} style={{position: 'absolute', left: x, top: BH - h * k * out + 6, width: w, height: h, objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.7))'}} />;
  })}</>;
};

const Ed = ({s, v}: {s: Spec; v: Var}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const m = s.meta!, rv = m.rv, has = (x: Vfx) => v.vfx.includes(x);
  const st = s.shots.reduce((a, [t]) => (o >= t ? t : a), 0);
  const punchOn = (s.punch ?? []).find((t) => o >= t && o < t + 750);
  const cam: CamCfg = {src: s.src, tl: s.tl, track: s.track, grade: 'contrast(1.06) saturate(1.05)', box: [BW, BH], baseH: 640, faceY: 0.42,
    wideX: s.wideXAt ? () => s.wideXAt!(o) : s.wideX, who: () => shotAt(s.shots, o),
    zoom: () => (1 + 0.07 * ease(o, st, 3500, (x) => x)) * (punchOn !== undefined ? (o < punchOn + 550 ? 1.13 : 1 + 0.13 * (1 - (o - punchOn - 550) / 200)) : 1)};
  const cuts = s.shots.filter(([, w], j) => j > 0 && w !== s.shots[j - 1][1]).map(([t]) => t);
  // ---- VFX package ----
  const fl: string[] = [strobe(o, s.strobes)];
  let tf = '';
  if (punchOn !== undefined && has('rgbPunch') && o < punchOn + 260) { const k = 1 - (o - punchOn) / 260; fl.push(`drop-shadow(${14 * k}px 0 0 rgba(255,0,70,.75)) drop-shadow(${-14 * k}px 0 0 rgba(0,240,255,.75))`); }
  if (punchOn !== undefined && has('shakePunch') && o < punchOn + 320) { const k = 1 - (o - punchOn) / 320; tf += ` translate(${Math.sin(o / 11) * 16 * k}px, ${Math.cos(o / 13) * 12 * k}px)`; }
  if (punchOn !== undefined && has('wobble')) tf += ` rotate(${Math.sin((o - punchOn) / 120) * 2.2 * Math.max(0, 1 - (o - punchOn) / 750)}deg)`;
  const whip = cuts.find((t) => o >= t && o < t + 170);
  if (whip !== undefined && has('whip')) { const k = 1 - (o - whip) / 170; tf += ` translateX(${k * 90}px)`; fl.push(`blur(${k * 9}px)`); }
  if (has('bwReveal') && rv !== undefined && o >= rv - 1300 && o < rv) fl.push('grayscale(1) contrast(1.15)');
  const tintNow = s.tints.find(([t]) => o >= t && o < t + 300);
  if (has('bloom') && tintNow) fl.push(`brightness(${1.25 - 0.25 * (o - tintNow[0]) / 300}) saturate(1.3)`);
  if (has('vhs')) fl.push('saturate(1.15) contrast(1.05)');
  // ---- openings ----
  const noIntro = v.open === 'zoom' || v.open === 'glitch' || v.open === 'flash';
  if (v.open === 'zoom' && o < 650) { tf += ` scale(${1.6 - 0.6 * ease(o, 0, 650)})`; fl.push(`blur(${8 * (1 - o / 650)}px)`); }
  if (v.open === 'glitch' && o < 520) { tf += ` translateX(${(frame % 2 ? 1 : -1) * 28 * (1 - o / 520)}px)`; fl.push(`drop-shadow(18px 0 0 rgba(255,0,90,.8)) drop-shadow(-18px 0 0 rgba(0,255,230,.8)) hue-rotate(${frame * 40}deg)`); }
  const castDur = 1700;
  const castOn = v.open === 'cast' && v.cast?.length;
  const om = v.open === 'memeOpen' && v.openMeme ? OPEN_MEME[v.openMeme] : undefined;
  const memes = m.memes.filter((q) => !om || MEME_KEY_OF_IMG[q.img] !== om.key);
  // people: first mention only, never a photo already shown in the opening collage
  const sorted = [...s.words].sort((p, q) => p.at - q.at);
  const people = (v.people ?? []).flatMap(([re, file]) => { const w = sorted.find((x) => re.test(x.text.replace(/[^A-Za-z']/g, ''))); return w && !(v.cast ?? []).includes(file) && !(castOn && w.at < castDur) ? [{at: w.at, file}] : []; });
  const leak = has('leak') ? [...cuts, ...s.tints.map(([t]) => t)].find((t) => o >= t && o < t + 520) : undefined;
  // which memes the v36 planner already put in s.fx: drop the sound of a meme we removed (openMeme duplicate)
  const removed = new Set(m.memes.filter((q) => !memes.includes(q)).map((q) => q.at));
  const fx = (s.fx ?? []).filter((q) => !removed.has(q.at) || ['cha-ching', 'ding-2', 'error', 'meme-fahh', 'gasp'].includes(q.file));
  const songG = Math.pow(10, (BED_LUFS[(v36Music as Record<string, {bed: number}>)[VKEY.get(s) ?? 'pb']?.bed ?? 1] - SONG_LUFS[v.song]) / 20);
  const songFrom = v.drop !== undefined && rv !== undefined ? Math.max(0, v.drop * 1000 - rv) : (v.from ?? 0) * 1000;
  return <Frame o={o} top={s.top} noIntro={noIntro} emoji={EMO.get(s)}
    over={<>
      <OneWord o={o} words={s.words} y={s.wordY} />
      <SpeechTrack src={s.src} tl={s.tl} />
      <Music file={`${v.song}.mp3`} songFrom={songFrom} level={(t) => (s.musicLevel ? s.musicLevel(t) : s.music.level) * songG * Math.min(1, (s.tl.total - t) / 400)} />
      <SfxTrack list={[
        ...(noIntro ? [] : [sfx('jorho-ting', 0, 0.55)]),
        ...(v.open === 'zoom' ? [sfx('fast-whoosh', 0, 0.35)] : v.open === 'glitch' ? [sfx('meme-flash', 0, 0.35)] : v.open === 'flash' ? [sfx('camera-shutter', 0, 0.45)] : v.open === 'question' ? [sfx('jorho-pop', 150, 0.4)] : castOn ? [sfx('vine-boom', 0, 0.35)] : []),
        ...(om ? [sfx(om.sfx, 0, 0.4, 1100)] : []),
        ...s.strobes.map((t) => sfx('jorho-flash', t, 0.7)), ...s.swish.map((t) => sfx('jorho-swish', t, 0.45)), ...fx,
        ...people.map((p) => sfx('jorho-swish', p.at, 0.4)),
      ]} />
    </>}>
    <AbsoluteFill style={{filter: fl.filter(Boolean).join(' ') || undefined, transform: tf || undefined}}><Cam c={cam} o={o} /></AbsoluteFill>
    {has('grain') && <AbsoluteFill style={{opacity: 0.08, mixBlendMode: 'overlay', backgroundImage: `repeating-radial-gradient(circle at ${(frame * 37) % 100}% ${(frame * 61) % 100}%, #fff 0 1px, #000 1px 3px)`}} />}
    {has('vhs') && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.13) 0 2px, transparent 2px 5px)'}} />}
    {has('vignette') && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 52%, rgba(0,0,0,.5) 100%)'}} />}
    {leak !== undefined && <AbsoluteFill style={{mixBlendMode: 'screen', background: `radial-gradient(circle at ${-10 + 120 * ((o - leak) / 520)}% 30%, rgba(255,150,40,${0.7 * (1 - (o - leak) / 520)}), transparent 55%)`}} />}
    {rv !== undefined && o >= rv - m.rise && o < rv + 120 && <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 60% at 50% 42%, transparent ${45 - 25 * Math.min(1, (o - rv + m.rise) / m.rise)}%, rgba(0,0,0,${0.85 * Math.min(1, (o - rv + m.rise) / m.rise)}) 100%)`}} />}
    {m.tl0 > 0 && o >= m.tl0 && o < m.tl0 + 550 && (v.open === 'teaseAfter'
      ? <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.12) 0 3px, transparent 3px 9px)'}}>
          <div style={{position: 'absolute', left: 50, top: 50, fontFamily: MONT, fontWeight: 800, fontSize: 80, color: '#fff', textShadow: '3px 0 #f0f, -3px 0 #0ff'}}>◀◀ REWIND</div></AbsoluteFill>
      : <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.07) 0 2px, transparent 2px 7px)', opacity: 1 - (o - m.tl0) / 1100}}>
          <svg width={260} height={150} style={{position: 'absolute', left: 60, top: 440}}><polygon points="120,10 120,140 10,75" fill="#fff" /><polygon points="245,10 245,140 135,75" fill="#fff" /></svg></AbsoluteFill>)}
    {m.money !== undefined && <Rain o={o} at={m.money} to={m.money + 1600} code="1f4b5" n={14} />}
    {memes.map((q, j) => <MemeBox key={j} o={o} at={q.at} to={q.at + q.ms} img={q.img} left={j % 2 === 0} style={v.meme} />)}
    {castOn ? <Rise o={o} at={0} dur={castDur} files={v.cast!} side={0} /> : null}
    {people.map((p, j) => <Rise key={`p${j}`} o={o} at={p.at} dur={1900} files={[p.file]} side={j + 1} />)}
    {om && o < 950 && <AbsoluteFill style={{background: '#000', opacity: o > 800 ? 1 - (o - 800) / 150 : 1}}>
      <Img src={staticFile(`memes/${om.img}`)} style={{width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${0.9 + 0.1 * pop(o, 0)})`}} /></AbsoluteFill>}
    {v.open === 'question' && o < 1700 && <div style={{position: 'absolute', left: 40, right: 40, top: 380, textAlign: 'center', transform: `scale(${pop(o, 150)})`, opacity: o > 1500 ? 1 - (o - 1500) / 200 : 1,
      fontFamily: MONT, fontWeight: 800, fontSize: 92, lineHeight: 1.05, color: '#F9FC35', WebkitTextStroke: '9px #111', paintOrder: 'stroke fill', textShadow: '0 6px 14px rgba(0,0,0,.6)'}}>{v.q}</div>}
    {v.open === 'flash' && o < 380 && <AbsoluteFill style={{background: '#fff', opacity: 1 - o / 380}} />}
    <Tints o={o} list={s.tints} />
  </Frame>;
};

// build: same cuts as v41, opening decides whether there is a teaser
const VKEY = new Map<Spec, string>(), EMO = new Map<Spec, string>();
export const V43: [string, Spec, Var][] = V41_CFG.map(([id, k]) => {
  const v = VARS[id];
  const sp = v36(k.base, {...k.c, clean: true, tease: v.open === 'tease' ? 'payoff' : v.open === 'teaseAfter' ? 'after' : undefined, memeSeed: k.seed + 3, memeFirst: k.first});
  const t = TOP42[id];
  const spec: Spec = {...sp, top: t?.[0] ?? sp.top};
  VKEY.set(spec, k.c.key as string); EMO.set(spec, t?.[1] ?? '1f480');
  return [id.replace('V41', 'V43'), spec, v];
});
export const V43_COMPS: [string, () => JSX.Element, number][] = V43.map(([id, s, v]) => [id, () => <Ed s={s} v={v} />, s.tl.total]);
void GREEN; void RED;
export type {Word};
