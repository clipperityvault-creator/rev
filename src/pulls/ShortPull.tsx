// ≤16 s card pull copied from the user's refs PTBmw2npS9o ("ONLY 10 OF THIS $1,500 NBA RISING STAR!") and 33kmdagNFhM
// ("THIS WAS A $200,000 DECISION"), user 2026-11-21: "it must be only 16 seconds max just like this one".
//  · frame 0: money/scarcity hook text on screen + a teaser of the revealed card, blurred (only the card)
//  · ~1.3 s green-screen hook cutaway, then straight into the build-up on the stream (pushed in), red arrow on the card
//  · captions: white, uppercase, one green keyword · reveal: flash + punch, PLAYER / CARD / $PRICE stacked, phonk drop
//  · style 'box' (ref 1): white box banner, black type, red + green keywords; 'plain' (ref 2): bold white text + green $,
//    red circle around the teaser card
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Music, SfxTrack, f, sfx} from '../e3/kit';

type Word = {text: string; startMs: number};
type Tok = [string, string?];
type Box = [number, number, number, number];
export type Seg =
  | {kind: 'stream'; src: [number, number]; rate?: number; blur?: Box; circle?: [number, number, number]}
  | {kind: 'hook'; file: string; ms: number; caption: string};
export type ShortSpec = {
  src: string; segs: Seg[]; reveal: number; words: Word[]; fix?: Record<string, string>; keys?: string[];
  style: 'box' | 'plain'; hookText: Tok[][]; textMs: number; // hook text stays this long
  title: [string, string, string]; arrows: {src: [number, number]; at: [number, number]; deg: number}[];
  music: {file: string; drop: number};
};
const R = '#E8202A', G = '#22C55E', GREEN = '#33E62E';
const stroke = '0 0 2px #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 6px 10px rgba(0,0,0,.7)';
const Z = {o: [540, 1500] as [number, number], s: 1.18};

const timeline = (segs: Seg[]) => {
  const out: number[] = []; let t = 0;
  segs.forEach((s) => { out.push(t); t += s.kind === 'hook' ? s.ms : (s.src[1] - s.src[0]) / (s.rate ?? 1); });
  const at = (o: number) => { let i = 0; out.forEach((x, j) => { if (o >= x) i = j; }); return i; };
  const outOf = (src: number) => { for (let i = 0; i < segs.length; i++) { const s = segs[i]; if (s.kind === 'stream' && src >= s.src[0] && src < s.src[1] && !s.blur) return out[i] + (src - s.src[0]) / (s.rate ?? 1); } return -1; };
  return {out, total: t, at, outOf};
};
export const shortMs = (s: ShortSpec) => timeline(s.segs).total;

const Arrow = ({x, y, o, deg}: {x: number; y: number; o: number; deg: number}) => {
  const a = (deg * Math.PI) / 180, jab = 14 + Math.sin(o / 95) * 14;
  const pts = [[0, 0], [-95, -54], [-95, -20], [-240, -20], [-240, 20], [-95, 20], [-95, 54]]
    .map(([px, py]) => { const qx = px - jab; return `${x + qx * Math.cos(a) - py * Math.sin(a)},${y + qx * Math.sin(a) + py * Math.cos(a)}`; }).join(' ');
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.55))'}}><polygon points={pts} fill="#F21D1D" stroke="#fff" strokeWidth={8} strokeLinejoin="round" /></svg>;
};

export const ShortPull = ({s}: {s: ShortSpec}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const tl = timeline(s.segs);
  const i = tl.at(o), seg = s.segs[i];
  const rv = tl.outOf(s.reveal);
  // captions from the stream segments (not the teaser), chunked on the speaker's punctuation, one green word
  const words: {t: string; at: number; stop: boolean}[] = [];
  s.segs.forEach((g, k) => {
    if (g.kind !== 'stream' || (g.rate ?? 1) !== 1 || g.blur) return;
    s.words.forEach((w) => {
      if (w.startMs < g.src[0] || w.startMs >= g.src[1]) return;
      const bare = w.text.trim().replace(/[.,!?]+$/g, ''); const t = (s.fix?.[bare] ?? bare).toUpperCase();
      if (t) words.push({t, at: tl.out[k] + w.startMs - g.src[0], stop: /[.,!?]$/.test(w.text.trim()) || w.startMs >= g.src[1] - 350});
    });
  });
  const chunks: {at: number; end: number; ws: string[]; key: number}[] = [];
  let cur: typeof words = [];
  const keys = new Set((s.keys ?? []).map((k) => k.toUpperCase()));
  const flush = (end: number) => { if (!cur.length) return; const ws = cur.map((c) => c.t); let key = ws.findIndex((w) => keys.has(w) || /\d/.test(w));
    if (key < 0) key = ws.reduce((b, w, j) => (w.length > ws[b].length ? j : b), 0); chunks.push({at: cur[0].at, end, ws, key}); cur = []; };
  words.forEach((w, j) => { if (cur.length && (cur.length >= 3 || cur[cur.length - 1].stop || w.at - cur[cur.length - 1].at > 600)) flush(w.at); cur.push(w); if (j === words.length - 1) flush(w.at + 900); });
  const chunk = chunks.map((c, j) => ({...c, end: Math.min(chunks[j + 1]?.at ?? c.end, c.at + 1800)})).find((c) => o >= c.at && o < c.end);
  // camera: pushed in on the card cam, slow push in slow-mo, punch on the reveal
  const slowI = s.segs.findIndex((g) => g.kind === 'stream' && (g.rate ?? 1) < 1);
  const sp = slowI >= 0 && i === slowI ? 0.08 * (o - tl.out[slowI]) / (rv - tl.out[slowI]) : 0;
  const z = Z.s + sp + (o >= rv && o < rv + 1500 ? interpolate(o, [rv, rv + 110, rv + 1500], [0.1, 0.22, 0], {extrapolateRight: 'clamp'}) : 0);
  const toScreen = (x: number, y: number): [number, number] => [Z.o[0] + (x - Z.o[0]) * z, Z.o[1] + (y - Z.o[1]) * z];
  const whip = tl.out.slice(1).reduce((m, t, j) => ((s.segs[j + 1] as {rate?: number}).rate ?? 1) === 1 && Math.abs(o - t) < 90 ? Math.max(m, 1 - Math.abs(o - t) / 90) : m, 0);
  const flash = o >= rv && o < rv + 220 ? 1 - (o - rv) / 220 : 0;
  const src = seg.kind === 'stream' ? seg.src[0] + (o - tl.out[i]) * (seg.rate ?? 1) : -1;
  const arrow = seg.kind === 'stream' && !seg.blur ? s.arrows.find((a) => src >= a.src[0] && src < a.src[1]) : undefined;
  const titleK = o >= rv + 150 ? (d: number) => spring({frame: f(o - rv - 150) - d, fps: FPS, config: {damping: 12, stiffness: 210}}) : () => 0;
  const music = (t: number) => (t < rv - 300 ? 0.2 : t < rv ? 0 : 0.32) * Math.min(1, (tl.total - t) / 400);
  return <AbsoluteFill style={{background: '#000'}}>
    {s.segs.map((g, k) => {
      const dur = f(k + 1 < s.segs.length ? tl.out[k + 1] : tl.total) - f(tl.out[k]);
      if (g.kind === 'hook') return <Sequence key={k} from={f(tl.out[k])} durationInFrames={dur} layout="none">
        {/* green-screen cutaway, scaled from the top so its burned caption is off-screen */}
        <AbsoluteFill style={{overflow: 'hidden'}}><div style={{position: 'absolute', inset: 0, transformOrigin: '50% 0', transform: 'scale(1.45)'}}>
          <OffthreadVideo src={staticFile(g.file)} style={{width: 1080, height: 1920}} /></div></AbsoluteFill>
      </Sequence>;
      return <Sequence key={k} from={f(tl.out[k])} durationInFrames={dur} layout="none">
        <AbsoluteFill style={{transformOrigin: `${Z.o[0]}px ${Z.o[1]}px`, transform: `translateX(${whip * 50}px) scale(${z})`, filter: `${whip ? `blur(${whip * 12}px) ` : ''}saturate(1.2) contrast(1.08)`}}>
          <OffthreadVideo src={staticFile(s.src)} muted trimBefore={f(g.src[0])} playbackRate={g.rate ?? 1} style={{width: 1080, height: 1920}} />
          {g.blur && <div style={{position: 'absolute', left: g.blur[0], top: g.blur[1], width: g.blur[2], height: g.blur[3], borderRadius: 16, backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)', background: 'rgba(20,20,20,.12)'}} />}
        </AbsoluteFill>
        {g.circle && (() => { const [x, y] = toScreen(g.circle[0], g.circle[1]); const r = g.circle[2] * z; return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <circle cx={x} cy={y} r={r} fill="none" stroke="#F21D1D" strokeWidth={14} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - Math.min(1, (o - tl.out[k]) / 350))} transform={`rotate(-90 ${x} ${y})`} /></svg>; })()}
      </Sequence>;
    })}
    {arrow && (() => { const [x, y] = toScreen(arrow.at[0], arrow.at[1]); return <Arrow x={x} y={y} o={o} deg={arrow.deg} />; })()}
    {/* hook text from frame 0 */}
    {o < s.textMs && (s.style === 'box'
      ? <div style={{position: 'absolute', left: 0, right: 0, top: 150, padding: '16px 24px', background: '#fff', textAlign: 'center', boxShadow: '0 6px 18px rgba(0,0,0,.35)'}}>
          {s.hookText.map((l, j) => <div key={j} style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.08, color: '#111', letterSpacing: -0.5}}>
            {l.map(([t, c], m) => <span key={m} style={{color: c ?? '#111'}}>{t}{m < l.length - 1 ? ' ' : ''}</span>)}</div>)}
        </div>
      : <div style={{position: 'absolute', left: 30, right: 30, top: 210, textAlign: 'center'}}>
          {s.hookText.map((l, j) => <div key={j} style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, lineHeight: 1.05, color: '#fff', textShadow: stroke}}>
            {l.map(([t, c], m) => <span key={m} style={{color: c ?? '#fff'}}>{t}{m < l.length - 1 ? ' ' : ''}</span>)}</div>)}
        </div>)}
    {seg.kind === 'hook' && <div style={{position: 'absolute', left: 30, right: 30, top: 1080, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color: '#fff', textShadow: stroke}}>
      {seg.caption.split(' ').map((w, j, a) => <span key={j} style={{color: j === a.length - 1 ? GREEN : '#fff'}}>{w}{j < a.length - 1 ? ' ' : ''}</span>)}</div>}
    {seg.kind === 'stream' && chunk && <div style={{position: 'absolute', left: 30, right: 30, top: 1180, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: '#fff', textShadow: stroke,
      transform: `scale(${0.85 + 0.15 * spring({frame: f(o - chunk.at), fps: FPS, config: {damping: 14, stiffness: 260}})})`}}>
      {chunk.ws.map((w, j) => <span key={j} style={{color: j === chunk.key ? GREEN : '#fff'}}>{w}{j < chunk.ws.length - 1 ? ' ' : ''}</span>)}</div>}
    {o >= rv && <div style={{position: 'absolute', left: 20, right: 20, top: 250, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, lineHeight: 1.02}}>
      <div style={{fontSize: 84, color: '#fff', textShadow: stroke, transform: `scale(${titleK(0)})`}}>{s.title[0]}</div>
      <div style={{fontSize: 68, color: R, textShadow: stroke, transform: `scale(${titleK(4)})`}}>{s.title[1]}</div>
      <div style={{fontSize: 92, color: G, textShadow: stroke, transform: `scale(${titleK(8)})`}}>{s.title[2]}</div>
    </div>}
    {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
    {/* stream audio (slow-mo muted), hook audio comes with its OffthreadVideo */}
    {s.segs.map((g, k) => g.kind === 'stream' && (g.rate ?? 1) === 1 ? <Sequence key={`a${k}`} from={f(tl.out[k])} durationInFrames={f(tl.out[k] + g.src[1] - g.src[0]) - f(tl.out[k])}>
      <Audio src={staticFile(s.src)} trimBefore={f(g.src[0])} volume={(fr) => Math.min(1, (fr + 1) / 2)} /></Sequence> : null)}
    <Music file={s.music.file} songFrom={s.music.drop - rv} level={music} />
    <SfxTrack list={[...tl.out.slice(1).map((t) => sfx('fast-whoosh', t, 0.2)), sfx('cinematic-suspense-riser', rv, 0.15), sfx('camera-shutter', rv, 0.25), sfx('cha-ching', rv + 900, 0.25),
      ...s.segs.flatMap((g, k) => (g.kind === 'stream' && g.circle ? [sfx('jorho-pop', tl.out[k] + 50, 0.25)] : []))]} />
  </AbsoluteFill>;
};
