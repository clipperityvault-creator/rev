// v42 (user 2026-11-28): "change everything … so you wouldn't know they came from the same editor". Same cuts, memes and
// sound rules as v41, but every video gets its own look: layout, fonts, caption engine, hook text, flash, meme frame,
// rewind, grade, intro and signature sounds. One Look per video, no two share a font pair or a layout+caption combo.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Cam, FPS, Music, SfxTrack, SpeechTrack, clamp, ease, pop, sfx, type CamCfg, type Seat} from '../e3/kit';
import {GREEN, RED, type Word} from './kit';
import {Rain} from './pod7';
import {MONT} from '../e3/bars';
import {V41, type Spec} from './clips';
import '../mgFonts';

type Area = {x: number; y: number; w: number; h: number};
type Hook = {font: string; weight?: number; size: number; color: string; upper?: boolean; italic?: boolean; stroke?: string; shadow?: string;
  hi?: string; hiColor?: string; y: number; align?: 'center' | 'left'; rotate?: number; emoji?: string; anim?: 'none' | 'type' | 'drop'; lh?: number; maxW?: number; skew?: number; under?: string};
type Cap = {mode: 'one' | 'chunk' | 'karaoke'; n?: number; font: string; weight?: number; size: number; color: string; pal?: string[]; hi?: string; hiBg?: string;
  stroke?: number; strokeColor?: string; shadow?: string; y: number; upper?: boolean; lower?: boolean; italic?: boolean; anim: 'pop' | 'smear' | 'up' | 'bounce' | 'type' | 'fade' | 'shake' | 'drop'; ls?: number};
type Look = {
  layout: 'full' | 'boxed' | 'blurfill' | 'square' | 'letterbox' | 'inset'; bg?: string; area?: Area; radius?: number; border?: string; glow?: string;
  hook: Hook; cap: Cap; flash: 'tint' | 'edge' | 'shake' | 'bars'; green: string; red: string; strobe: 'white' | 'dip' | 'zoom' | 'rgb';
  meme: 'card' | 'polaroid' | 'sticker' | 'comic' | 'tv' | 'tape' | 'round' | 'gold' | 'plain' | 'pixel'; memeY?: number; memeW?: number; memeIn?: 'pop' | 'slide' | 'drop' | 'spin' | 'fade';
  rew: 'arrows' | 'vhs' | 'glitch' | 'spin' | 'film'; grade: string; grain?: number; vignette?: number; overlay?: 'grid' | 'scan' | 'dots';
  intro: 'box' | 'zoom' | 'fade' | 'flash' | 'glitch' | 'slide' | 'none'; snd: {start?: string; strobe: string; swish: string}; push: 'slow' | 'none' | 'shake'; bed: 1 | 2 | 3 | 4;
};

const FULL: Area = {x: 0, y: 0, w: 1080, h: 1920};
const areaOf = (L: Look): Area => L.area ?? (L.layout === 'full' ? FULL : L.layout === 'blurfill' ? {x: 0, y: 640, w: 1080, h: 608}
  : L.layout === 'square' ? {x: 0, y: 430, w: 1080, h: 1080} : L.layout === 'letterbox' ? {x: 0, y: 330, w: 1080, h: 1260}
  : L.layout === 'inset' ? {x: 34, y: 34, w: 1012, h: 1852} : {x: 0, y: 417, w: 1080, h: 1077});
const fr = (o: number) => Math.round((o * FPS) / 1000);
const shotAt = (shots: [number, Seat][], o: number) => shots.reduce<Seat>((w, [t, s]) => (o >= t ? s : w), 'W');

// ---- hook text ---------------------------------------------------------------------------------------------------
const HookText = ({o, h, text}: {o: number; h: Hook; text: string}) => {
  const t = h.upper ? text.toUpperCase() : text;
  const shown = h.anim === 'type' ? t.slice(0, Math.max(0, Math.floor((o - 150) / 28))) : t;
  const d = h.anim === 'drop' ? interpolate(pop(o, 120, 11, 160), [0, 1], [-140, 0]) : 0;
  const base: CSSProperties = {fontFamily: h.font, fontWeight: h.weight ?? 400, fontSize: h.size, lineHeight: `${h.lh ?? h.size * 1.16}px`, color: h.color,
    fontStyle: h.italic ? 'italic' : 'normal', textShadow: h.shadow, WebkitTextStroke: h.stroke, paintOrder: 'stroke fill', whiteSpace: 'pre-wrap'};
  return <div style={{position: 'absolute', left: h.align === 'left' ? 60 : 0, right: h.align === 'left' ? undefined : 0, top: h.y + d, display: 'flex',
    justifyContent: h.align === 'left' ? 'flex-start' : 'center', transform: `rotate(${h.rotate ?? 0}deg) skewX(${h.skew ?? 0}deg)`}}>
    <div style={{maxWidth: h.maxW ?? 940, textAlign: h.align ?? 'center'}}>
      {h.hi ? <span style={{...base, background: h.hi, color: h.hiColor ?? h.color, padding: '4px 18px', borderRadius: 12, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{shown}</span>
        : <span style={base}>{shown}</span>}
      {h.emoji && shown.length === t.length && <Img src={staticFile(`emoji-ios/${h.emoji}.png`)} style={{width: h.size * 0.9, height: h.size * 0.9, verticalAlign: `-${h.size * 0.12}px`, marginLeft: 8}} />}
      {h.under && <div style={{height: 10, background: h.under, marginTop: 8, width: `${100 * Math.min(1, (o - 200) / 500)}%`}} />}
    </div>
  </div>;
};

// ---- captions ----------------------------------------------------------------------------------------------------
const chunks = (words: Word[], n: number) => {
  const out: Word[][] = [];
  words.forEach((w) => { const c = out[out.length - 1]; if (c && c.length < n && w.at - c[c.length - 1].at < 650) c.push(w); else out.push([w]); });
  return out;
};
const animStyle = (a: Cap['anim'], o: number, at: number): CSSProperties => {
  const k = o - at, p = pop(o, at, 10, 260);
  switch (a) {
    case 'pop': return {transform: `scale(${0.6 + 0.4 * p})`};
    case 'smear': return fr(o) - fr(at) < 2 ? {transform: 'scaleX(1.3)', filter: 'blur(4px)'} : {};
    case 'up': return {transform: `translateY(${(1 - ease(o, at, 160)) * 40}px)`, opacity: ease(o, at, 120)};
    case 'bounce': return {transform: `translateY(${-Math.abs(Math.sin(k / 60)) * 26 * Math.exp(-k / 160)}px) scale(${0.85 + 0.15 * p})`};
    case 'fade': return {opacity: ease(o, at, 180)};
    case 'shake': return {transform: `rotate(${k < 200 ? Math.sin(k / 18) * 6 * (1 - k / 200) : 0}deg) scale(${0.7 + 0.3 * p})`};
    case 'drop': return {transform: `translateY(${(1 - p) * -60}px)`, opacity: Math.min(1, k / 60)};
    default: return {};
  }
};
const Captions = ({o, words, c}: {o: number; words: Word[]; c: Cap}) => {
  const ws = [...words].sort((p, q) => p.at - q.at);
  const fix = (t: string) => (c.upper ? t.toUpperCase() : c.lower ? t.toLowerCase() : t);
  const txt = (color: string): CSSProperties => ({fontFamily: c.font, fontWeight: c.weight ?? 400, fontSize: c.size, color, fontStyle: c.italic ? 'italic' : 'normal', letterSpacing: c.ls,
    WebkitTextStroke: c.stroke ? `${c.stroke}px ${c.strokeColor ?? '#000'}` : undefined, paintOrder: 'stroke fill', textShadow: c.shadow, lineHeight: 1.12});
  const wrap = (kids: ReactNode, at: number) => <div style={{position: 'absolute', left: 60, right: 60, top: c.y - c.size / 2, display: 'flex', justifyContent: 'center'}}>
    <div style={{textAlign: 'center', ...animStyle(c.anim, o, at)}}>{kids}</div></div>;
  if (c.mode === 'one') {
    let i = -1; ws.forEach((w, j) => { if (o >= w.at) i = j; });
    if (i < 0 || o > (ws[i + 1]?.at ?? ws[i].at + 1400)) return null;
    const w = ws[i], col = c.pal ? c.pal[i % c.pal.length] : (c.color === 'word' ? w.color : c.color);
    return wrap(<span style={txt(col)}>{fix(w.text)}</span>, w.at);
  }
  const cs = chunks(ws, c.n ?? 3);
  let i = -1; cs.forEach((q, j) => { if (o >= q[0].at) i = j; });
  if (i < 0) return null;
  const q = cs[i], end = cs[i + 1]?.[0].at ?? q[q.length - 1].at + 1200;
  if (o > end) return null;
  if (c.anim === 'type') {
    const full = q.map((w) => fix(w.text)).join(' '), n = Math.floor((o - q[0].at) / 32);
    return wrap(<span style={txt(c.color)}>{full.slice(0, n + 1)}</span>, q[0].at);
  }
  return wrap(<>{q.map((w, j) => {
    const on = o >= w.at && (j === q.length - 1 || o < q[j + 1].at);
    const said = o >= w.at;
    const col = on && c.hi ? c.hi : c.mode === 'karaoke' && !said ? 'rgba(255,255,255,.55)' : c.color;
    return <span key={j} style={{...txt(col), display: 'inline-block', margin: '0 10px', padding: c.hiBg ? '0 12px' : undefined, borderRadius: 12,
      background: on && c.hiBg ? c.hiBg : undefined, transform: on && c.mode === 'karaoke' ? 'scale(1.08)' : undefined, opacity: c.mode === 'chunk' && !said ? 0 : 1}}>{fix(w.text)}</span>;
  })}</>, q[0].at);
};

// ---- flashes -----------------------------------------------------------------------------------------------------
const TINT = [0.21, 0.42, 0.62, 0.62, 0.62, 0.53, 0.35, 0.17];
const Flash = ({o, list, L, a}: {o: number; list: [number, string][]; L: Look; a: Area}) => {
  const hit = list.map(([t, c]) => [TINT[fr(o) - fr(t)], c === GREEN ? L.green : c === RED ? L.red : c] as const).find(([v]) => v !== undefined);
  if (!hit) return null;
  const [v, col] = hit;
  const box: CSSProperties = {position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, pointerEvents: 'none', borderRadius: L.radius};
  if (L.flash === 'edge') return <div style={{...box, boxShadow: `inset 0 0 ${180 * v}px ${90 * v}px ${col}`}} />;
  if (L.flash === 'bars') return <><div style={{...box, height: 90, background: col, opacity: v * 1.4}} /><div style={{...box, top: a.y + a.h - 90, height: 90, background: col, opacity: v * 1.4}} /></>;
  return <div style={{...box, background: col, opacity: v, mixBlendMode: L.flash === 'shake' ? 'normal' : 'normal'}} />;
};
const STROBE = [0.6, 0.45, 0.7, 0.85, 0.85, 0.85, -0.15, 0.95, 1, 1, 0.95];
const strobeK = (o: number, at: number[]) => at.map((t) => STROBE[fr(o) - fr(t)]).find((x) => x !== undefined);

// ---- meme frames -------------------------------------------------------------------------------------------------
const MemeFrame = ({o, at, to, img, left, L, a, j}: {o: number; at: number; to: number; img: string; left: boolean; L: Look; a: Area; j: number}) => {
  if (o < at || o >= to + 180) return null;
  const p = pop(o, at, 12, 220), out = o > to ? 1 - (o - to) / 180 : 1, W = L.memeW ?? 400;
  const inT = L.memeIn ?? 'pop';
  const side = left ? 1 : -1;
  const tr = inT === 'slide' ? `translateX(${(1 - p) * -side * 520}px)` : inT === 'drop' ? `translateY(${(1 - p) * -500}px)` : inT === 'spin' ? `rotate(${(1 - p) * 200 * side}deg) scale(${p})` : inT === 'fade' ? '' : `scale(${p})`;
  const rot = ({card: 4, polaroid: 6, sticker: 0, comic: 3, tv: 0, tape: 5, round: 0, gold: 0, plain: 0, pixel: 0} as const)[L.meme] * (left ? -1 : 1) * (j % 2 ? 0.6 : 1);
  const frame: CSSProperties = ({
    card: {border: '7px solid #fff', borderRadius: 14, boxShadow: '0 12px 28px rgba(0,0,0,.6)'},
    polaroid: {border: '14px solid #fff', borderBottomWidth: 56, boxShadow: '0 14px 30px rgba(0,0,0,.55)'},
    sticker: {border: '12px solid #fff', borderRadius: 34, boxShadow: '0 0 0 4px rgba(0,0,0,.25)'},
    comic: {border: '9px solid #111', boxShadow: '10px 10px 0 #111'},
    tv: {border: '16px solid #1b1b1b', borderRadius: 30, boxShadow: '0 0 0 4px #555, 0 18px 30px rgba(0,0,0,.6)'},
    tape: {border: '6px solid #fffaf0', boxShadow: '0 10px 22px rgba(0,0,0,.5)'},
    round: {borderRadius: 48, boxShadow: '0 16px 36px rgba(0,0,0,.55)'},
    gold: {border: '8px solid #d8b25a', outline: '3px solid #6b5220', boxShadow: '0 0 30px rgba(216,178,90,.6)'},
    plain: {borderRadius: 8},
    pixel: {border: '10px solid #fff', boxShadow: '8px 8px 0 #ff2bd6, -8px -8px 0 #2bf3ff', imageRendering: 'pixelated'},
  } as Record<string, CSSProperties>)[L.meme];
  const y = L.memeY ?? a.y + Math.min(80, a.h * 0.06) + (L.layout === 'full' || L.layout === 'inset' ? 260 : 0);
  return <div style={{position: 'absolute', top: y, [left ? 'left' : 'right']: a.x + 40, width: W, transform: `${tr} rotate(${rot}deg) scale(${out})`,
    transformOrigin: left ? '0 0' : '100% 0', opacity: inT === 'fade' ? Math.min(1, (o - at) / 160) * out : 1, overflow: 'hidden', lineHeight: 0, background: '#000', ...frame}}>
    <Img src={staticFile(`memes/${img}`)} style={{width: '100%', display: 'block', filter: L.meme === 'tv' ? 'contrast(1.1) saturate(1.2)' : undefined}} />
    {L.meme === 'tv' && <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)'}} />}
    {L.meme === 'tape' && <div style={{position: 'absolute', top: -6, left: '35%', width: 130, height: 38, background: 'rgba(255,240,170,.85)', transform: 'rotate(-6deg)'}} />}
  </div>;
};

// ---- rewind (cold-open → story) ----------------------------------------------------------------------------------
const Rew = ({o, at, L, a}: {o: number; at: number; L: Look; a: Area}) => {
  if (o < at - 250 || o >= at + 600) return null;
  const k = Math.max(0, (o - at) / 600);
  const box: CSSProperties = {position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, overflow: 'hidden', pointerEvents: 'none', borderRadius: L.radius};
  if (o < at) return L.rew === 'spin' || L.rew === 'film' ? <div style={{...box, background: '#fff', opacity: (o - at + 250) / 250 * 0.7}} /> : null;
  switch (L.rew) {
    case 'vhs': return <div style={{...box, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.12) 0 3px, transparent 3px 9px)'}}>
      <div style={{position: 'absolute', left: 50, top: 50, fontFamily: 'VT323', fontSize: 90, color: '#fff', textShadow: '3px 0 #f0f, -3px 0 #0ff'}}>◀◀ REW</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: `${(k * 140) % 100}%`, height: 40, background: 'rgba(255,255,255,.25)', filter: 'blur(6px)'}} /></div>;
    case 'glitch': return <div style={{...box, mixBlendMode: 'screen'}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 137 + fr(o) * 53) % 300) - 150, top: `${(i * 23 + fr(o) * 17) % 100}%`, width: '120%', height: 60,
      background: ['#f0f', '#0ff', '#ff0', '#fff', '#f00'][i], opacity: 0.35 * (1 - k)}} />)}</div>;
    case 'spin': return <div style={{...box, background: `conic-gradient(from ${k * 720}deg, rgba(255,255,255,.0), rgba(255,255,255,.35), rgba(255,255,255,0))`, opacity: 1 - k}} />;
    case 'film': return <div style={{...box, background: `radial-gradient(circle at ${30 + k * 40}% 40%, rgba(255,160,60,${0.75 * (1 - k)}), transparent 60%)`, mixBlendMode: 'screen'}} />;
    default: return <div style={{...box, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.07) 0 2px, transparent 2px 7px)', opacity: 1 - k * 0.5}}>
      <svg width={260} height={150} style={{position: 'absolute', right: 60, top: 60, filter: 'drop-shadow(0 0 18px rgba(0,0,0,.6))'}}>
        <polygon points="120,10 120,140 10,75" fill="#fff" /><polygon points="245,10 245,140 135,75" fill="#fff" /></svg></div>;
  }
};


// ---- people pop-ups (user 2026-11-28: pop-ups of the people mentioned are good, just never the same photo twice) ----
// each photo is used once in the whole batch; first mention only. ESPN headshots in public/people, older cut-outs in public/cutouts
const PEOPLE: Record<string, [RegExp, string[]][]> = {
  V41Goat: [[/^Dellavedova$/i, ['cutouts/delly3.png']], [/^(NBA|greatest)$/i, ['cutouts/jordan.png', 'people/lebron_espn.png', 'people/kobe_espn.png', 'people/curry_espn.png']]],
  V41Ant: [[/^Richardson/i, ['people/ar_espn.png']], [/^(Peyton|Manning)$/i, ['cutouts/peyton.png']]],
  V41Peyton: [[/^(Peyton|Manning)$/i, ['people/peyton_espn.png']]],
  V41Golf: [[/^Tiger/i, ['people/tiger_espn.png']]],
  V41Slab: [[/^Tiger/i, ['cutouts/tiger.png']]],
  V41Josh: [[/^Josh$/i, ['people/allen_bills.png']], [/^Hines$/i, ['people/hinesallen_espn.png']]],
  V41Neck: [[/^Mills$/i, ['people/mills_espn.png']], [/^Glennon$/i, ['people/glennon_espn.png']]],
  V41Rogers: [[/^Rogers$/i, ['people/rodgers_espn.png']]],
  V41Nt: [[/^(Justin|Fields)/i, ['people/fields_espn.png']]],
  V41Packs: [[/^(Lawrence|TLAW)$/i, ['people/lawrence_espn.png']]],
};
type Pp = {at: number; files: string[]};
const peopleFor = (id: string, words: Word[]): Pp[] => {
  const out: Pp[] = [];
  for (const [re, files] of PEOPLE[id] ?? []) { const w = [...words].sort((p, q) => p.at - q.at).find((x) => re.test(x.text.replace(/[^A-Za-z']/g, ''))); if (w) out.push({at: w.at, files}); }
  return out;
};
const People = ({o, p, L, a, j}: {o: number; p: Pp; L: Look; a: Area; j: number}) => {
  const dur = p.files.length > 1 ? 2600 : 1900;
  if (o < p.at || o >= p.at + dur + 200) return null;
  const n = p.files.length, w = n > 1 ? Math.min(560, (a.w + (n - 1) * 140) / n) : 600, h = w * 436 / 600;
  const out = o > p.at + dur ? 1 - (o - p.at - dur) / 200 : 1;
  const ring = L.meme === 'comic' ? 'drop-shadow(6px 6px 0 #111)' : L.meme === 'gold' ? 'drop-shadow(0 0 14px #d8b25a)' : L.meme === 'tv' || L.meme === 'pixel' ? `drop-shadow(0 0 16px ${L.green})`
    : L.meme === 'sticker' || L.meme === 'tape' ? 'drop-shadow(0 0 0 #fff) drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 -5px 0 #fff)' : 'drop-shadow(0 10px 20px rgba(0,0,0,.7))';
  return <div style={{position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, overflow: 'hidden', borderRadius: L.radius, pointerEvents: 'none'}}>
    {p.files.map((f, i) => {
      const k = pop(o, p.at + i * 110, 13, 200);
      const x = n > 1 ? i * (w - 140) + (a.w - (n * w - (n - 1) * 140)) / 2 : (j % 2 ? a.w - w - 10 : 10);
      return <Img key={i} src={staticFile(f)} style={{position: 'absolute', left: x, top: a.h - h * k * out + 6, width: w, height: h, objectFit: 'contain', filter: ring, zIndex: n - Math.abs(i - (n - 1) / 2)}} />;
    })}
  </div>;
};
// ---- the renderer ------------------------------------------------------------------------------------------------
const Styled = ({s, L, id}: {s: Spec; L: Look; id: string}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const a = areaOf(L), m = s.meta!;
  const wideArea = a.w / a.h > 1.2;
  const st = s.shots.reduce((q, [t]) => (o >= t ? t : q), 0);
  const zoom = () => {
    const base = L.push === 'slow' ? 1 + 0.07 * ease(o, st, 3500, (v) => v) : 1;
    const pk = (s.punch ?? []).reduce((z, t) => (o >= t && o < t + 750 ? Math.max(z, o < t + 550 ? 1.13 : 1 + 0.13 * (1 - (o - t - 550) / 200)) : z), 1);
    return base * pk;
  };
  const cam: CamCfg = {src: s.src, tl: s.tl, track: s.track, grade: L.grade, box: [a.w, a.h], baseH: wideArea ? 1080 : a.w / a.h > 0.9 ? 900 : 640, faceY: 0.42,
    wideX: s.wideXAt ? () => s.wideXAt!(o) : s.wideX, who: () => (wideArea ? 'W' : shotAt(s.shots, o)), zoom};
  const sk = strobeK(o, s.strobes);
  const strobeCss: CSSProperties = sk === undefined ? {} : L.strobe === 'white' ? {filter: sk < 0 ? 'brightness(0.85)' : `brightness(${1 + 1.5 * sk}) contrast(${1 + 0.55 * sk})`}
    : L.strobe === 'dip' ? {filter: `brightness(${1 - 0.85 * Math.max(0, sk)})`} : L.strobe === 'zoom' ? {transform: `scale(${1 + 0.18 * Math.max(0, sk)})`, filter: `blur(${6 * Math.max(0, sk)}px)`}
    : {filter: `drop-shadow(${12 * Math.max(0, sk)}px 0 0 rgba(255,0,80,.8)) drop-shadow(${-12 * Math.max(0, sk)}px 0 0 rgba(0,255,255,.8))`};
  // shake on flashes for 'shake' looks and on punch-ins for 'shake' push
  const tintAt = s.tints.find(([t]) => o >= t && o < t + 260);
  const sh = (L.flash === 'shake' && tintAt) || (L.push === 'shake' && (s.punch ?? []).some((t) => o >= t && o < t + 220))
    ? {x: Math.sin(o / 13) * 14, y: Math.cos(o / 17) * 10} : {x: 0, y: 0};
  // intro
  const ik = Math.min(1, o / 450);
  const introCss: CSSProperties = L.intro === 'zoom' ? {transform: `scale(${1.35 - 0.35 * ease(o, 0, 450)})`, filter: o < 450 ? `blur(${10 * (1 - ik)}px)` : undefined}
    : L.intro === 'slide' ? {transform: `translateY(${(1 - ease(o, 0, 420)) * 400}px)`} : L.intro === 'glitch' && o < 400 ? {transform: `translateX(${Math.sin(o) * 30}px)`, filter: 'hue-rotate(90deg) saturate(2)'}
    : L.intro === 'box' && o < 500 ? {clipPath: `inset(${(1 - ease(o, 0, 500)) * 30}% 0)`} : {};
  const introOver = L.intro === 'fade' && o < 500 ? <AbsoluteFill style={{background: '#000', opacity: 1 - o / 500}} /> : L.intro === 'flash' && o < 300 ? <AbsoluteFill style={{background: '#fff', opacity: 1 - o / 300}} /> : null;
  const rv = m.rv;
  const camBox = <Cam c={cam} o={o} />;
  return <AbsoluteFill style={{background: L.bg ?? '#000'}}>
    {L.layout === 'blurfill' && <AbsoluteFill style={{filter: 'blur(38px) brightness(.55) saturate(1.3)', transform: 'scale(1.15)'}}>
      <Cam c={{...cam, box: [1080, 1920], baseH: 800, who: () => 'W', zoom: undefined}} o={o} /></AbsoluteFill>}
    {L.overlay === 'grid' && <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(0,255,170,.08) 2px, transparent 2px), linear-gradient(90deg, rgba(0,255,170,.08) 2px, transparent 2px)', backgroundSize: '60px 60px'}} />}
    {L.overlay === 'dots' && <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 3px, transparent 3px)', backgroundSize: '36px 36px'}} />}
    <div style={{position: 'absolute', left: a.x + sh.x, top: a.y + sh.y, width: a.w, height: a.h, overflow: 'hidden', borderRadius: L.radius, border: L.border, boxShadow: L.glow, ...introCss}}>
      <AbsoluteFill style={strobeCss}>{camBox}</AbsoluteFill>
      {L.grain ? <AbsoluteFill style={{opacity: L.grain, mixBlendMode: 'overlay', backgroundImage: `repeating-radial-gradient(circle at ${(frame * 37) % 100}% ${(frame * 61) % 100}%, #fff 0 1px, #000 1px 3px)`}} /> : null}
      {L.vignette ? <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,${L.vignette}) 100%)`}} /> : null}
      {L.overlay === 'scan' && <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.12) 0 2px, transparent 2px 5px)'}} />}
    </div>
    {/* riser build: edges close in over the 2.6 s before the reveal */}
    {rv !== undefined && o >= rv - m.rise && o < rv + 120 && <div style={{position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, borderRadius: L.radius, pointerEvents: 'none',
      background: `radial-gradient(ellipse 70% 60% at 50% 42%, transparent ${45 - 25 * Math.min(1, (o - rv + m.rise) / m.rise)}%, rgba(0,0,0,${0.85 * Math.min(1, (o - rv + m.rise) / m.rise)}) 100%)`}} />}
    <Flash o={o} list={s.tints} L={L} a={a} />
    {m.tl0 > 0 && <Rew o={o} at={m.tl0} L={L} a={a} />}
    {m.money !== undefined && <Rain o={o} at={m.money} to={m.money + 1600} code="1f4b5" n={14} />}
    {peopleFor(id, s.words).map((p, j) => <People key={`p${j}`} o={o} p={p} L={L} a={a} j={j} />)}
    {m.memes.map((q, j) => <MemeFrame key={j} o={o} at={q.at} to={q.at + q.ms} img={q.img} left={j % 2 === 0} L={L} a={a} j={j} />)}
    <HookText o={o} h={L.hook} text={s.top} />
    <Captions o={o} words={s.words} c={L.cap} />
    {introOver}
    <SpeechTrack src={s.src} tl={s.tl} />
    <Music file={`refbg${L.bed}.wav`} songFrom={0} loop level={(t) => (s.musicLevel ? s.musicLevel(t) : s.music.level) * Math.min(1, (s.tl.total - t) / 400)} />
    <SfxTrack list={[
      ...(L.snd.start ? [sfx(L.snd.start, 0, 0.32, 1200)] : []),
      ...s.strobes.map((t) => sfx(L.snd.strobe, t, 0.55)),
      ...s.swish.map((t) => sfx(L.snd.swish, t, 0.4)),
      ...(s.fx ?? []),
      ...peopleFor(id, s.words).map((p) => sfx(L.snd.swish, p.at, 0.4)),
    ]} />
  </AbsoluteFill>;
};

// ---- 19 looks ----------------------------------------------------------------------------------------------------
const W_ = '#ffffff';
const LOOKS: Look[] = [
  // 0 TikTok native: full-bleed, white-pill hook, 3-word captions with yellow active word
  {layout: 'full', hook: {font: 'Inter', weight: 800, size: 52, color: '#111', hi: '#fff', y: 190, lh: 74}, cap: {mode: 'chunk', n: 3, font: 'Inter', weight: 800, size: 74, color: W_, hi: '#FFE600', stroke: 9, y: 1300, anim: 'pop'},
    flash: 'edge', green: '#3cff6b', red: '#ff2d2d', strobe: 'white', meme: 'sticker', memeIn: 'slide', rew: 'vhs', grade: 'contrast(1.08) saturate(1.15)', intro: 'zoom', snd: {strobe: 'camera-shutter', swish: 'whoosh'}, push: 'slow', bed: 1},
  // 1 Anton poster: rounded box on black, huge Anton one-word captions under the video
  {layout: 'boxed', area: {x: 30, y: 400, w: 1020, h: 1040}, radius: 42, bg: '#0d0d0d', hook: {font: 'Anton', size: 78, color: '#FFD400', upper: true, y: 150, lh: 88},
    cap: {mode: 'one', font: 'Anton', size: 120, color: W_, upper: true, shadow: '0 6px 0 #000', y: 1620, anim: 'bounce'}, flash: 'tint', green: '#9dff00', red: '#ff1a1a', strobe: 'zoom',
    meme: 'polaroid', memeIn: 'drop', rew: 'arrows', grade: 'contrast(1.18) saturate(1.05)', intro: 'slide', snd: {start: 'mg-boom', strobe: 'mg-boom', swish: 'mg-swoosh'}, push: 'none', bed: 2},
  // 2 clean white editorial
  {layout: 'boxed', area: {x: 40, y: 560, w: 1000, h: 800}, radius: 28, bg: '#f4f1ea', hook: {font: 'Archivo Black', size: 60, color: '#141414', y: 250, lh: 72},
    cap: {mode: 'chunk', n: 2, font: 'Archivo Black', size: 70, color: '#141414', hi: '#e8462b', y: 1500, anim: 'up'}, flash: 'bars', green: '#24c16b', red: '#e8462b', strobe: 'dip',
    meme: 'card', memeIn: 'pop', memeY: 600, rew: 'spin', grade: 'contrast(1.02) saturate(.95)', intro: 'fade', snd: {strobe: 'mg-click', swish: 'mg-swoosh2'}, push: 'slow', bed: 3},
  // 3 comic book
  {layout: 'full', overlay: 'dots', hook: {font: 'Bangers', size: 92, color: '#FFE21F', stroke: '10px #000', rotate: -3, y: 170, lh: 96}, cap: {mode: 'one', font: 'Bangers', size: 130, color: W_, pal: ['#fff', '#FFE21F', '#3DF5FF'], stroke: 12, ls: 2, y: 1330, anim: 'shake'},
    flash: 'shake', green: '#7CFF00', red: '#FF2200', strobe: 'white', meme: 'comic', memeIn: 'spin', rew: 'glitch', grade: 'contrast(1.15) saturate(1.45)', intro: 'flash', snd: {start: 'meme-impact', strobe: 'meme-flash', swish: 'jorho-swish'}, push: 'shake', bed: 4},
  // 4 documentary serif on blurred fill
  {layout: 'blurfill', hook: {font: 'Instrument Serif', italic: true, size: 78, color: W_, y: 330, lh: 86, shadow: '0 4px 20px rgba(0,0,0,.6)'}, cap: {mode: 'chunk', n: 4, font: 'Instrument Serif', size: 70, color: W_, lower: true, shadow: '0 3px 14px rgba(0,0,0,.8)', y: 1380, anim: 'fade'},
    flash: 'edge', green: '#b7f36b', red: '#ff5a4e', strobe: 'dip', meme: 'round', memeIn: 'fade', memeY: 1460, memeW: 330, rew: 'film', grade: 'sepia(.18) contrast(1.05) saturate(.9)', grain: 0.07, intro: 'fade', snd: {strobe: 'projector', swish: 'mg-whoosh'}, push: 'slow', bed: 1},
  // 5 neon night
  {layout: 'boxed', area: {x: 50, y: 460, w: 980, h: 1000}, radius: 24, border: '4px solid #00f0ff', glow: '0 0 40px #00f0ff, 0 0 90px rgba(255,0,200,.5)', bg: '#07000f',
    hook: {font: 'Unbounded', weight: 800, size: 50, color: '#00f0ff', upper: true, shadow: '0 0 18px #00f0ff', y: 190, lh: 64}, cap: {mode: 'one', font: 'Unbounded', weight: 800, size: 72, color: '#ff4fd8', upper: true, shadow: '0 0 22px #ff4fd8', y: 1620, anim: 'smear'},
    flash: 'edge', green: '#00ff9d', red: '#ff0055', strobe: 'rgb', meme: 'tv', memeIn: 'pop', rew: 'glitch', grade: 'contrast(1.1) saturate(1.3) hue-rotate(-8deg)', overlay: 'grid', intro: 'glitch', snd: {start: 'mg-shimmer', strobe: 'meme-flash', swish: 'mg-whoosh'}, push: 'slow', bed: 2},
  // 6 marker scrapbook
  {layout: 'full', hook: {font: 'Permanent Marker', size: 72, color: W_, shadow: '4px 4px 0 #000', rotate: -2, y: 160, lh: 84}, cap: {mode: 'chunk', n: 2, font: 'Permanent Marker', size: 86, color: '#FFE96B', hi: '#ffffff', shadow: '4px 4px 0 #000', y: 1350, anim: 'drop'},
    flash: 'tint', green: '#8BE000', red: '#FF3B30', strobe: 'white', meme: 'tape', memeIn: 'drop', rew: 'arrows', grade: 'contrast(1.06) saturate(1.1) sepia(.08)', vignette: 0.35, intro: 'zoom', snd: {strobe: 'paper-tear', swish: 'whoosh'}, push: 'slow', bed: 3},
  // 7 minimal karaoke
  {layout: 'full', hook: {font: 'Inter', weight: 700, size: 46, color: W_, align: 'left', y: 210, lh: 58, shadow: '0 2px 12px rgba(0,0,0,.8)', maxW: 820}, cap: {mode: 'karaoke', n: 4, font: 'Inter', weight: 800, size: 66, color: W_, hiBg: '#2bd55b', y: 1420, anim: 'none' as Cap['anim'], shadow: '0 2px 10px rgba(0,0,0,.6)'},
    flash: 'edge', green: '#2bd55b', red: '#ff3b3b', strobe: 'dip', meme: 'plain', memeIn: 'slide', memeY: 620, memeW: 360, rew: 'spin', grade: 'contrast(1.03) saturate(1.02)', intro: 'none', snd: {strobe: 'mg-click', swish: 'mg-swoosh'}, push: 'none', bed: 4},
  // 8 arcade square
  {layout: 'square', bg: 'linear-gradient(180deg,#1b0f3a,#3a0f2e)', radius: 0, border: '10px solid #fff', hook: {font: 'Bungee', size: 58, color: '#FF9F1C', y: 200, lh: 70, shadow: '5px 5px 0 #000'},
    cap: {mode: 'one', font: 'Bungee', size: 84, color: W_, shadow: '6px 6px 0 #FF9F1C', y: 1640, anim: 'pop', upper: true}, flash: 'tint', green: '#39ff14', red: '#ff073a', strobe: 'rgb',
    meme: 'pixel', memeIn: 'pop', rew: 'vhs', grade: 'contrast(1.12) saturate(1.35)', overlay: 'scan', intro: 'glitch', snd: {start: 'scan-beep', strobe: 'jorho-beep', swish: 'mg-swoosh2'}, push: 'none', bed: 1},
  // 9 sports broadcast energy
  {layout: 'full', hook: {font: 'Oswald', weight: 700, size: 82, color: W_, upper: true, skew: -8, under: '#E10600', y: 170, lh: 90, shadow: '0 4px 14px rgba(0,0,0,.7)'},
    cap: {mode: 'chunk', n: 3, font: 'Oswald', weight: 700, size: 84, color: W_, hi: '#ff2a2a', upper: true, stroke: 6, y: 1360, anim: 'up'}, flash: 'shake', green: '#00e05a', red: '#ff1010', strobe: 'zoom',
    meme: 'card', memeIn: 'slide', rew: 'spin', grade: 'contrast(1.2) saturate(1.2)', intro: 'slide', snd: {start: 'crowd-cheer', strobe: 'boxing-bell', swish: 'fast-whoosh'}, push: 'shake', bed: 2},
  // 10 pastel soft
  {layout: 'boxed', area: {x: 60, y: 470, w: 960, h: 980}, radius: 46, bg: 'linear-gradient(160deg,#ffd6e8,#cfe8ff)', hook: {font: 'Fredoka', weight: 700, size: 62, color: '#23305a', y: 210, lh: 72},
    cap: {mode: 'one', font: 'Fredoka', weight: 700, size: 90, color: W_, stroke: 10, strokeColor: '#23305a', y: 1610, anim: 'bounce'}, flash: 'edge', green: '#7ee787', red: '#ff6b8b', strobe: 'white',
    meme: 'round', memeIn: 'pop', rew: 'spin', grade: 'brightness(1.05) saturate(1.08)', intro: 'zoom', snd: {start: 'ding', strobe: 'mg-shimmer', swish: 'mg-swoosh'}, push: 'slow', bed: 3},
  // 11 typewriter file
  {layout: 'boxed', area: {x: 70, y: 520, w: 940, h: 860}, radius: 4, border: '3px solid #2a2a2a', bg: '#efe6d2', hook: {font: 'Courier Prime', weight: 700, size: 50, color: '#1d1d1d', y: 230, lh: 62, anim: 'type'},
    cap: {mode: 'chunk', n: 4, font: 'Courier Prime', weight: 700, size: 60, color: '#1d1d1d', y: 1500, anim: 'type'}, flash: 'bars', green: '#2e9d4a', red: '#c4302b', strobe: 'dip',
    meme: 'polaroid', memeIn: 'fade', memeY: 1380, memeW: 300, rew: 'vhs', grade: 'sepia(.25) contrast(1.05) saturate(.8)', grain: 0.09, intro: 'fade', snd: {start: 'keyboard-typing', strobe: 'camera-shutter', swish: 'paper-tear'}, push: 'none', bed: 4},
  // 12 luxury gold
  {layout: 'blurfill', bg: '#000', hook: {font: 'Playfair Display', weight: 700, italic: true, size: 70, color: '#E7C873', y: 300, lh: 80, shadow: '0 0 24px rgba(231,200,115,.45)'},
    cap: {mode: 'chunk', n: 3, font: 'Playfair Display', weight: 800, size: 66, color: W_, hi: '#E7C873', y: 1390, anim: 'fade'}, flash: 'edge', green: '#d9ff7a', red: '#ff4d3d', strobe: 'white',
    meme: 'gold', memeIn: 'fade', memeY: 1470, memeW: 320, rew: 'film', grade: 'contrast(1.08) saturate(1.05) sepia(.12)', vignette: 0.5, intro: 'fade', snd: {strobe: 'mg-shimmer', swish: 'mg-whoosh'}, push: 'slow', bed: 1},
  // 13 grotesk lowercase clean
  {layout: 'full', hook: {font: 'Space Grotesk', weight: 700, size: 58, color: W_, align: 'left', y: 200, lh: 66, shadow: '0 3px 16px rgba(0,0,0,.75)', maxW: 860},
    cap: {mode: 'one', font: 'Space Grotesk', weight: 700, size: 96, color: W_, lower: true, shadow: '0 4px 18px rgba(0,0,0,.7)', y: 1250, anim: 'up'}, flash: 'tint', green: '#a6ff4d', red: '#ff3d71', strobe: 'zoom',
    meme: 'sticker', memeIn: 'pop', rew: 'arrows', grade: 'contrast(1.04) saturate(1.06)', intro: 'none', snd: {strobe: 'jorho-snap', swish: 'mg-swoosh2'}, push: 'slow', bed: 2},
  // 14 handwritten vlog with white inset frame
  {layout: 'inset', bg: '#fff', radius: 40, hook: {font: 'Caveat', weight: 700, size: 90, color: W_, y: 150, lh: 92, shadow: '0 4px 16px rgba(0,0,0,.8)'},
    cap: {mode: 'chunk', n: 3, font: 'Caveat', weight: 700, size: 92, color: '#FFF27A', shadow: '0 3px 12px rgba(0,0,0,.9)', y: 1420, anim: 'up'}, flash: 'tint', green: '#9cff57', red: '#ff4747', strobe: 'white',
    meme: 'tape', memeIn: 'drop', rew: 'film', grade: 'contrast(1.05) saturate(1.12) sepia(.1)', vignette: 0.4, intro: 'zoom', snd: {start: 'camera-shutter', strobe: 'camera-shutter', swish: 'whoosh'}, push: 'slow', bed: 3},
  // 15 tech HUD
  {layout: 'boxed', area: {x: 0, y: 430, w: 1080, h: 1060}, bg: '#020a07', overlay: 'grid', hook: {font: 'Orbitron', weight: 800, size: 50, color: '#d7ffe9', upper: true, y: 190, lh: 64, shadow: '0 0 14px #00ff9c'},
    cap: {mode: 'one', font: 'Orbitron', weight: 800, size: 68, color: '#00ff9c', upper: true, shadow: '0 0 18px #00ff9c', y: 1640, anim: 'smear'}, flash: 'edge', green: '#00ff9c', red: '#ff2a55', strobe: 'rgb',
    meme: 'tv', memeIn: 'slide', rew: 'glitch', grade: 'contrast(1.12) saturate(.9) hue-rotate(10deg)', intro: 'glitch', snd: {start: 'scan-beep', strobe: 'jorho-beep', swish: 'mg-whoosh'}, push: 'none', bed: 4},
  // 16 middle-screen meme captions
  {layout: 'full', hook: {font: 'Archivo Black', size: 64, color: W_, y: 140, lh: 74, stroke: '8px #000'}, cap: {mode: 'chunk', n: 2, font: 'Archivo Black', size: 96, color: '#FFE600', upper: true, stroke: 11, y: 980, anim: 'pop'},
    flash: 'tint', green: '#5cff2e', red: '#ff2b2b', strobe: 'white', meme: 'plain', memeIn: 'pop', memeY: 1240, memeW: 360, rew: 'arrows', grade: 'contrast(1.14) saturate(1.2)', intro: 'flash', snd: {start: 'vine-boom', strobe: 'jorho-flash', swish: 'fast-whoosh'}, push: 'shake', bed: 1},
  // 17 cinematic letterbox
  {layout: 'letterbox', bg: '#000', hook: {font: 'Cinzel', weight: 700, size: 54, color: '#E9D8A6', y: 120, lh: 66}, cap: {mode: 'chunk', n: 4, font: 'Cinzel', weight: 700, size: 52, color: W_, y: 1720, anim: 'fade'},
    flash: 'bars', green: '#b9f227', red: '#e63946', strobe: 'dip', meme: 'plain', memeIn: 'fade', rew: 'film', grade: 'contrast(1.12) saturate(.85) sepia(.15) hue-rotate(-6deg)', grain: 0.06, vignette: 0.45, intro: 'fade', snd: {start: 'meme-build', strobe: 'mg-boom', swish: 'mg-whoosh'}, push: 'slow', bed: 2},
  // 18 hype italic
  {layout: 'full', hook: {font: 'Inter', weight: 800, italic: true, size: 70, color: W_, upper: true, shadow: '5px 5px 0 #E3001B', y: 180, lh: 80, anim: 'drop'},
    cap: {mode: 'one', font: 'Inter', weight: 800, italic: true, size: 118, color: W_, pal: ['#ffffff', '#ff2e3f'], upper: true, stroke: 10, y: 1300, anim: 'shake'}, flash: 'shake', green: '#40ff4a', red: '#ff0a1e', strobe: 'zoom',
    meme: 'card', memeIn: 'spin', rew: 'glitch', grade: 'contrast(1.22) saturate(1.3)', intro: 'zoom', snd: {start: '808-boom', strobe: 'meme-impact', swish: 'fast-whoosh'}, push: 'shake', bed: 3},
];

// new titles (unique — logged in vault/04 Projects/Titles used.md)
export const TOP42: Record<string, [string, string]> = {
  // user 2026-11-28: titles name what actually happens in the clip (names, numbers, the joke), short and hooky like BBreaks_Grail
  V41Playbook: ['8 to 10 NEW plays every single week??', '1f480'], V41Goat: ['Over Bron and MJ as GOAT?', '1f480'],
  V41Presnap: ['Even Trevor gets fooled before the snap', '1f480'], V41Ant: ['Bro said his signature looks like an ant', '1f62d'],
  V41Golf: ['Jesus and Tiger in the same golf group', '1f480'], V41Fans: ['Trevor reacts to the Traveling Trevors', '1f62d'],
  V41Coen: ['Liam Coen changed EVERYTHING for him', '1f480'], V41Ticket: ['They gave him his own signed natty ticket', '1f62d'],
  V41Slab: ["Tiger's actual shirt is in this card", '1f480'], V41Josh: ['Pulled Josh Allen… the WRONG one', '1f62d'],
  V41Neck: ["Mike Glennon's neck caught a stray", '1f480'], V41Lair: ['He did NOT like hearing the Colts', '1f62d'],
  V41Rogers: ['Traveling Trevors vs Rodgers Realm in the ring??', '1f480'], V41Celly: ['He picked the PSA 10 celebration', '1f62d'],
  V41Packs: ['A pack where EVERY card is Trevor', '1f480'], V41Nt: ['Justin Fields RPA went from $20K to $500', '1f62d'],
  V41Enter: ['All hail the king', '1f451'], V41Redeem: ['Waiting on redemptions be like', '1f62d'],
  V41Peyton: ['Him and Peyton Manning are actually close??', '1f480'],
};
export const V42: [string, Spec, Look, string][] = V41.map(([id, s], i) => [id.replace('V41', 'V42'), {...s, top: TOP42[id]?.[0] ?? s.top}, {...LOOKS[i % LOOKS.length], hook: {...LOOKS[i % LOOKS.length].hook, emoji: TOP42[id]?.[1]}}, id]);
export const V42_COMPS: [string, () => JSX.Element, number][] = V42.map(([id, s, L, src]) => [id, () => <Styled s={s} L={L} id={src} />, s.tl.total]);
void MONT; void clamp;
