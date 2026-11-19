// Card pull copied from the user's reference Short 6OkxaC1w9jA (Backyard Breaks, "THE MOST PATRIOTIC 1/1"):
//  · hook clip in a band in the middle of a black frame, short white title above it
//  · then the stream, pushed in ~1.2× on the card cam, no banner
//  · big white captions, 2–3 words, ONE keyword in colour (green), black outline, mid-frame
//  · chunky red arrow jabbing at the card / the price
//  · on the reveal: punch-in + flash, then "PLAYER" (two colours) + "HOW MUCH DO YOU THINK IT IS?" over the ticker
//    strip, kept to the end. One phonk song, drop on the reveal. Card blurred only if its front shows before the reveal.
import {AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Music, SfxTrack, f, sfx} from '../e3/kit';
import {HookAudio, HostAudio, StreamView, cardTimeline, type CSeg} from '../e3/cardkit';

type Word = {text: string; startMs: number};
export type RefSpec = {
  src: string;
  hook: {file: string; ms: number; title: string; caption: string[]; crop: [number, number]; scale?: number}; // crop[0] = top source y (of 1280) shown in the band
  segs: CSeg[];
  reveal: number;
  name: [string, string, string?]; // e.g. ['COOPER', 'FLAGG', ' /10']
  nameColors: [string, string, string?];
  arrows: {src: [number, number]; at: [number, number]; deg: number}[]; // stream px target while source time is inside src
  words: Word[];
  fix?: Record<string, string>;
  keys?: string[]; // words that get the colour when they appear in a chunk
  music: {file: string; drop: number};
  zoom: {origin: [number, number]; scale: number};
};

const GREEN = '#33E62E';
const stroke = '0 0 2px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 6px 10px rgba(0,0,0,.7)';

type Chunk = {at: number; end: number; words: string[]; key: number};
const chunk = (s: RefSpec, tl: ReturnType<typeof cardTimeline>): Chunk[] => {
  const out: {t: string; at: number; stop: boolean}[] = [];
  tl.segs.forEach((g, i) => {
    if ((g.rate ?? 1) !== 1) return;
    s.words.forEach((w) => {
      if (w.startMs < g.src[0] || w.startMs >= g.src[1]) return;
      const bare = w.text.trim().replace(/[.,!?]+$/g, '');
      const t = (s.fix?.[bare] ?? bare).toUpperCase();
      if (t) out.push({t, at: tl.segOut[i] + w.startMs - g.src[0], stop: /[.,!?]$/.test(w.text.trim()) || w.startMs >= g.src[1] - 400});
    });
  });
  const cs: Chunk[] = [];
  let cur: {t: string; at: number; stop: boolean}[] = [];
  const keys = new Set((s.keys ?? []).map((k) => k.toUpperCase()));
  const flush = (end: number) => {
    if (!cur.length) return;
    const ws = cur.map((c) => c.t);
    let key = ws.findIndex((w) => keys.has(w) || /\d/.test(w));
    if (key < 0) key = ws.reduce((b, w, i) => (w.length > ws[b].length ? i : b), 0);
    cs.push({at: cur[0].at, end, words: ws, key}); cur = [];
  };
  out.forEach((w, i) => {
    if (cur.length && (cur.length >= 3 || cur[cur.length - 1].stop || w.at - cur[cur.length - 1].at > 650)) flush(w.at);
    cur.push(w);
    if (i === out.length - 1) flush(w.at + 900);
  });
  return cs.map((c, i) => ({...c, end: Math.min(cs[i + 1]?.at ?? c.end, c.at + 2000)}));
};

const Caption = ({o, cs, y}: {o: number; cs: Chunk[]; y: number}) => {
  const c = cs.find((x) => o >= x.at && o < x.end);
  if (!c) return null;
  const p = spring({frame: f(o - c.at), fps: FPS, config: {damping: 14, stiffness: 260}});
  return <div style={{position: 'absolute', left: 30, right: 30, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, lineHeight: 1.05,
    color: '#fff', textShadow: stroke, transform: `scale(${0.85 + 0.15 * p})`}}>
    {c.words.map((w, i) => <span key={i} style={{color: i === c.key ? GREEN : '#fff'}}>{w}{i < c.words.length - 1 ? ' ' : ''}</span>)}
  </div>;
};

// chunky red arrow (white edge + shadow): tip exactly on the target, pointing along `deg` (0 = right, 90 = down), jabbing in
const Arrow = ({x, y, o, deg}: {x: number; y: number; o: number; deg: number}) => {
  const a = (deg * Math.PI) / 180, jab = 14 + Math.sin(o / 95) * 14;
  const pts = [[0, 0], [-95, -54], [-95, -20], [-240, -20], [-240, 20], [-95, 20], [-95, 54]]
    .map(([px, py]) => { const qx = px - jab; return [x + qx * Math.cos(a) - py * Math.sin(a), y + qx * Math.sin(a) + py * Math.cos(a)]; })
    .map(([px, py]) => `${px},${py}`).join(' ');
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.55))'}}>
    <polygon points={pts} fill="#F21D1D" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
  </svg>;
};

export const RefPull = ({s}: {s: RefSpec}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const H = s.hook.ms;
  const tl = cardTimeline(H, s.segs);
  const rv = tl.out(s.reveal);
  const cs = chunk(s, tl);
  const src = tl.srcAt(o);
  // stream push-in (the reference keeps the card cam big), punch on the reveal, gentle push in slow-mo
  const slow = s.segs.findIndex((g) => (g.rate ?? 1) < 1);
  const sp = slow >= 0 && o >= tl.segOut[slow] && o < rv ? 0.08 * (o - tl.segOut[slow]) / (rv - tl.segOut[slow]) : 0;
  const punch = o >= rv && o < rv + 1600 ? interpolate(o, [rv, rv + 120, rv + 1600], [0.08, 0.2, 0], {extrapolateRight: 'clamp'}) : 0;
  const z = s.zoom.scale + sp + punch;
  const flash = o >= rv && o < rv + 220 ? 1 - (o - rv) / 220 : 0;
  const cuts = tl.segOut.slice(1).filter((t, i) => (s.segs[i + 1].rate ?? 1) === 1 && (s.segs[i].rate ?? 1) === 1);
  const whip = [H, ...cuts].reduce((m, t) => (Math.abs(o - t) < 90 ? Math.max(m, 1 - Math.abs(o - t) / 90) : m), 0);
  // where a stream point lands on screen under the zoom
  const toScreen = (x: number, y: number): [number, number] => [s.zoom.origin[0] + (x - s.zoom.origin[0]) * z, s.zoom.origin[1] + (y - s.zoom.origin[1]) * z];
  const arrow = o >= H ? s.arrows.find((a) => src >= a.src[0] && src < a.src[1]) : undefined;
  const nameIn = o >= rv + 150 ? spring({frame: f(o - rv - 150), fps: FPS, config: {damping: 12, stiffness: 200}}) : 0;
  const music = (t: number) => (t < rv - 300 ? 0.2 : t < rv ? 0 : 0.32) * Math.min(1, (tl.total - t) / 500);
  return <AbsoluteFill style={{background: '#000'}}>
    {o < H ? <>
      {/* hook: clip in a middle band, title above it */}
      <div style={{position: 'absolute', left: 0, top: 520, width: 1080, height: 900, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 540 - 540 * (s.hook.scale ?? 1.5) / 1.5, top: -s.hook.crop[0] * (s.hook.scale ?? 1.5), width: 1080 * (s.hook.scale ?? 1.5) / 1.5, height: 1920 * (s.hook.scale ?? 1.5) / 1.5,
          transformOrigin: '50% 30%', transform: `scale(${1 + 0.04 * o / H})`}}>
          <OffthreadVideo src={staticFile(s.hook.file)} muted style={{width: '100%', height: '100%'}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 30, right: 30, top: 420, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,.8)'}}>{s.hook.title}</div>
      {(() => { const n = s.hook.caption.length, i = Math.min(n - 1, Math.floor((o / H) * n)); const w = s.hook.caption[i];
        return <div style={{position: 'absolute', left: 30, right: 30, top: 1060, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: '#fff', textShadow: stroke}}>
          {w.split(' ').map((x, j, a) => <span key={j} style={{color: j === a.length - 1 ? GREEN : '#fff'}}>{x}{j < a.length - 1 ? ' ' : ''}</span>)}</div>; })()}
    </> : <>
      <AbsoluteFill style={{transformOrigin: `${s.zoom.origin[0]}px ${s.zoom.origin[1]}px`, transform: `translateX(${whip * 50}px) scale(${z})`,
        filter: `${whip ? `blur(${whip * 12}px) ` : ''}saturate(1.22) contrast(1.08)`}}>
        <StreamView src={s.src} srcW={1080} tl={tl} />
      </AbsoluteFill>
      {arrow && (() => { const [x, y] = toScreen(arrow.at[0], arrow.at[1]); return <Arrow x={x} y={y} o={o} deg={arrow.deg} />; })()}
      {o >= rv && <div style={{position: 'absolute', left: 0, right: 0, top: 360, padding: '14px 20px 18px', textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 22%, rgba(0,0,0,.55) 78%, rgba(0,0,0,0) 100%)', transform: `scale(${0.6 + 0.4 * nameIn})`, opacity: Math.min(1, nameIn * 1.5)}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 76, lineHeight: 1.05, textShadow: stroke}}>
          <span style={{color: s.nameColors[0]}}>{s.name[0]} </span><span style={{color: s.nameColors[1]}}>{s.name[1]}</span>{s.name[2] && <span style={{color: s.nameColors[2]}}>{s.name[2]}</span>}
        </div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 44, color: '#fff', textShadow: stroke, marginTop: 6}}>HOW MUCH DO YOU THINK IT IS?</div>
      </div>}
      <Caption o={o} cs={cs} y={1180} />
    </>}
    {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
    <HookAudio file={s.hook.file} from={0} ms={H} />
    <HostAudio src={s.src} tl={tl} gain={() => 1} />
    <Music file={s.music.file} songFrom={s.music.drop - rv} level={music} />
    <SfxTrack list={[...[H, ...cuts].map((t) => sfx('fast-whoosh', t, 0.22)), sfx('cinematic-suspense-riser', rv, 0.15), sfx('camera-shutter', rv, 0.25),
      ...s.arrows.map((a) => sfx('jorho-pop', Math.max(H, tl.out(a.src[0])), 0.25))]} />
  </AbsoluteFill>;
};
export const refMs = (s: RefSpec) => cardTimeline(s.hook.ms, s.segs).total;

// ---- Cooper Flagg Black Auto /10 — "$445 spot → $9,300 card" -------------------------------------------------------
import flaggW from '../plans/data/pulls/p_flagg_black10.words.json';
export const FLAGG: RefSpec = {
  src: 'pulls/p_flagg_black10.mp4',
  hook: {file: 'hooks/no_way_he_did_it.mp4', ms: 3800, title: 'THE LUCKIEST $445 EVER', caption: ['NO WAY', 'HE DID IT!'], crop: [470, 920], scale: 2.0},
  segs: [{src: [7550, 9500]}, {src: [14550, 16900]}, {src: [22500, 26000]}, {src: [26000, 27500], rate: 0.5}, {src: [27500, 33000]}, {src: [34700, 38500]}, {src: [51300, 54700]}],
  reveal: 27500,
  name: ['COOPER', 'FLAGG', ' /10'], nameColors: ['#4FB3FF', '#fff', '#FFD43B'],
  // the serial on the hit while they call "black auto to 10", then the sold price on the laptop
  arrows: [{src: [22500, 26000], at: [667, 886], deg: 135}, {src: [37200, 38500], at: [690, 858], deg: 195}],
  words: flaggW,
  fix: {'9': '$9,300', ',300': '', '$445': '$445', roll: 'RAW', Spaghetti: 'SPAGHETTI', '-O': 'O'},
  keys: ['BLACK', 'DANGEROUS', '$9,300', '$445', 'FREE', 'RAW'],
  music: {file: 'montagem-pegadora.mp3', drop: 15700},
  zoom: {origin: [540, 1500], scale: 1.18},
};
export const PullFlaggRef = () => <RefPull s={FLAGG} />;
export const FLAGG_REF_MS = refMs(FLAGG);
