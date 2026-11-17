// Card-pull edit, "natural" style (user 2026-11-17: "lessen the obviousness of AI, good background music for retention").
// Built to look like the creator's own Shorts (refs D–F in the vault): the real stream frame, ONE white hook banner,
// plain white captions, a player / card / price stack on the reveal, whip cuts. No pills, checklists, stickers or
// meme SFX on every beat. One phonk song, clearly audible, its drop on the reveal with a short silence before it.
// Rules kept: hook clip first (or the stream's own reaction), card blurred until the reveal, no name before the reveal.
import type {ReactNode} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Music, SfxTrack, f, sfx, type Sfx} from '../e3/kit';
import {Blurs, HookAudio, HookView, HostAudio, StreamView, cardTimeline, type CSeg} from '../e3/cardkit';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Word = {text: string; startMs: number};
type Tok = [string, string?]; // text, colour
export type PullSpec = {
  src: string;
  hook: {kind: 'clip'; file: string; ms: number; text: string} | {kind: 'cold'; src: [number, number]; text: string};
  segs: CSeg[];
  reveal: number; // source ms of the reveal frame
  zoom: [number, number]; // card position on the stream (px) for the reveal punch-in
  blur: {src: [number, number]; box: [number, number, number, number]}[];
  pre: Tok[][]; // banner before the reveal (2 lines)
  post: Tok[][]; // banner after the reveal
  title: [string, string, string]; // player, card, price
  words: Word[];
  fix?: Record<string, string>;
  music: {file: string; drop: number; pre?: number; post?: number};
  end?: string; // closing question in the banner
};

const RED = '#E8202A', GREEN = '#17A34A';
const emoji = (code: string, s: number) => <Img src={staticFile(`emoji-ios/${code}.png`)} style={{width: s, height: s, verticalAlign: '-8px', marginLeft: 6}} />;

// one white box over the stream's ticker strip, black heavy type, 1–2 coloured words (creator style)
const Banner = ({lines, k}: {lines: Tok[][]; k: number}) => (
  <div style={{position: 'absolute', left: 28, right: 28, top: 392, padding: '14px 18px', background: '#fff', borderRadius: 14,
    boxShadow: '0 6px 18px rgba(0,0,0,.35)', textAlign: 'center', transform: `scale(${0.96 + 0.04 * k})`, opacity: k}}>
    {lines.map((l, i) => <div key={i} style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 50, lineHeight: 1.12, color: '#111', textTransform: 'uppercase', letterSpacing: -0.5}}>
      {l.map(([t, c], j) => t.startsWith(':') ? <span key={j}>{emoji(t.slice(1), 50)}</span> : <span key={j} style={{color: c ?? '#111'}}>{t}{j < l.length - 1 ? ' ' : ''}</span>)}
    </div>)}
  </div>
);

// plain captions: 2–3 words, white, uppercase, heavy dark shadow, centred on the card cam
type Chunk = {at: number; end: number; text: string};
const chunks = (spec: PullSpec, tl: ReturnType<typeof cardTimeline>): Chunk[] => {
  const out: {t: string; at: number}[] = [];
  tl.segs.forEach((s, i) => {
    if ((s.rate ?? 1) !== 1) return;
    spec.words.forEach((w) => {
      if (w.startMs < s.src[0] || w.startMs >= s.src[1]) return;
      const bare = w.text.trim().replace(/[.,!?]+$/g, '');
      const t = (spec.fix?.[bare] ?? bare).toUpperCase();
      if (t) out.push({t, at: tl.segOut[i] + w.startMs - s.src[0]});
    });
  });
  const cs: Chunk[] = [];
  let cur: {t: string; at: number}[] = [];
  const flush = (end: number) => { if (cur.length) cs.push({at: cur[0].at, end, text: cur.map((c) => c.t).join(' ')}); cur = []; };
  out.forEach((w, i) => {
    if (cur.length && (cur.length >= 3 || w.at - cur[cur.length - 1].at > 700)) flush(w.at);
    cur.push(w);
    if (i === out.length - 1) flush(w.at + 900);
  });
  // a chunk stays until the next one starts (captions always on while people talk)
  return cs.map((c, i) => ({...c, end: Math.min(cs[i + 1]?.at ?? c.end, c.at + 2200)}));
};
const Caption = ({o, cs, y}: {o: number; cs: Chunk[]; y: number}) => {
  const c = cs.find((x) => o >= x.at && o < x.end);
  if (!c) return null;
  const k = Math.min(1, (o - c.at) / 90);
  return <div style={{position: 'absolute', left: 40, right: 40, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: '#fff',
    textShadow: '0 4px 0 #000, 0 0 14px rgba(0,0,0,.9), 3px 3px 0 #000, -3px 3px 0 #000', transform: `scale(${0.9 + 0.1 * k})`, lineHeight: 1.05}}>{c.text}</div>;
};

const Title = ({o, at, title}: {o: number; at: number; title: [string, string, string]}) => {
  if (o < at || o > at + 3600) return null;
  const fr = f(o - at);
  const p = (d: number) => spring({frame: fr - d, fps: FPS, config: {damping: 13, stiffness: 220}});
  const out = interpolate(o, [at + 3300, at + 3600], [1, 0], clamp);
  const line = (t: string, c: string, s: number, d: number) => <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: s, color: c, lineHeight: 1.05,
    textShadow: '0 5px 0 #000, 0 0 18px rgba(0,0,0,.85), 4px 4px 0 #000, -4px 4px 0 #000', transform: `scale(${p(d)})`, opacity: out}}>{t}</div>;
  return <div style={{position: 'absolute', left: 30, right: 30, top: 1390, textAlign: 'center'}}>
    {line(title[0], '#fff', 76, 0)}{line(title[1], RED, 60, 4)}{line(title[2], '#2BD964', 82, 8)}
  </div>;
};

export const Pull = ({s}: {s: PullSpec}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const hookMs = s.hook.kind === 'clip' ? s.hook.ms : s.hook.src[1] - s.hook.src[0];
  const tl = cardTimeline(hookMs, s.segs);
  const rv = tl.out(s.reveal);
  const cs = chunks(s, tl);
  // whip: a few frames of horizontal blur + slide on every cut into a new segment
  const cutTimes = tl.segOut.slice(1).filter((t, i) => (s.segs[i + 1].rate ?? 1) === 1 && (s.segs[i].rate ?? 1) === 1);
  const whip = [hookMs, ...cutTimes].reduce((m, t) => { const d = o - t; return Math.abs(d) < 100 ? Math.max(m, 1 - Math.abs(d) / 100) : m; }, 0);
  // reveal punch-in on the card, slow push during slow-mo
  const slowSeg = s.segs.findIndex((x) => (x.rate ?? 1) < 1);
  const push = slowSeg >= 0 && o >= tl.segOut[slowSeg] && o < rv ? 1 + 0.06 * (o - tl.segOut[slowSeg]) / (rv - tl.segOut[slowSeg]) : 1;
  const z = o < rv ? push : o < rv + 200 ? 1.06 + 0.22 * (o - rv) / 200 : o < rv + 1600 ? 1.28 - 0.1 * (o - rv - 200) / 1400 : o < rv + 2000 ? 1.18 - 0.18 * (o - rv - 1600) / 400 : 1;
  const flash = o >= rv && o < rv + 70 ? 1 : o >= rv + 70 && o < rv + 240 ? 1 - (o - rv - 70) / 170 : 0;
  const shake = o >= rv && o < rv + 450 ? Math.sin(o / 18) * 10 * (1 - (o - rv) / 450) : 0;
  const lvl = s.music.pre ?? 0.18, post = s.music.post ?? 0.3;
  const musicLevel = (t: number) => (t < rv - 280 ? lvl : t < rv ? 0 : post - 0.06 * Math.min(1, (t - rv) / 4000)) * Math.min(1, (tl.total - t) / 500);
  const banner = o < rv ? s.pre : o > tl.total - 2300 && s.end ? [[[s.end, undefined], [':1f914']]] as Tok[][] : s.post;
  const bannerK = o < hookMs ? Math.min(1, o / 160) : 1;
  const fx: Sfx[] = [
    ...[hookMs, ...cutTimes].map((t) => sfx('fast-whoosh', t, 0.22)),
    sfx('cinematic-suspense-riser', rv, 0.16), sfx('camera-shutter', rv, 0.25), sfx('cha-ching', rv + 900, 0.28),
  ];
  let hookView: ReactNode = null;
  if (o < hookMs) {
    hookView = s.hook.kind === 'clip'
      ? <HookView file={s.hook.file} w={720} from={0} cover={[40, 900, 640, 280]} push={1.04 + 0.05 * (o / hookMs)} />
      // cold open on the stream's own reaction: only the hosts' cam, zoomed, so the card stays hidden
      : <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0',
          transform: `translate(${540 - 540 * (2.5 + 0.08 * (o / hookMs))}px, ${1000 - 280 * (2.5 + 0.08 * (o / hookMs))}px) scale(${2.5 + 0.08 * (o / hookMs)})`}}>
          <OffthreadVideo src={staticFile(s.src)} muted trimBefore={f(s.hook.src[0])} style={{width: 1080, height: 1920}} />
        </div>
        {/* everything below the hosts' cam (stream y > 470) is the card cam: keep it hidden */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1000 + (470 - 280) * 2.5, bottom: 0, background: '#000'}} />
      </AbsoluteFill>;
  }
  const hookCap = o < hookMs ? <div style={{position: 'absolute', left: 40, right: 40, top: 1180, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 74,
    color: '#fff', textShadow: '0 4px 0 #000, 0 0 14px rgba(0,0,0,.9), 3px 3px 0 #000, -3px 3px 0 #000'}}>{s.hook.text}</div> : null;
  return <AbsoluteFill style={{background: '#000'}}>
    {o >= hookMs && <AbsoluteFill style={{transformOrigin: `${s.zoom[0]}px ${s.zoom[1]}px`, transform: `translateX(${whip * 60 + shake}px) scale(${z})`,
      filter: `${whip ? `blur(${whip * 14}px)` : ''} saturate(1.08) contrast(1.04)`}}>
      <StreamView src={s.src} srcW={1080} tl={tl} />
      <Blurs tl={tl} o={o} srcW={1080} boxes={s.blur} />
    </AbsoluteFill>}
    {hookView}
    <Banner lines={banner} k={bannerK} />
    {hookCap}
    {o >= hookMs && !(o >= rv && o < rv + 3600) && <Caption o={o} cs={cs} y={1250} />}
    <Title o={o} at={rv + 250} title={s.title} />
    {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
    {s.hook.kind === 'clip' ? <HookAudio file={s.hook.file} from={0} ms={hookMs} /> :
      <Sequence durationInFrames={f(hookMs)}><OffthreadVideo src={staticFile(s.src)} trimBefore={f(s.hook.src[0])} style={{display: 'none'}} /></Sequence>}
    <HostAudio src={s.src} tl={tl} gain={() => 1} />
    <Music file={s.music.file} songFrom={s.music.drop - rv} level={musicLevel} />
    <SfxTrack list={fx} />
  </AbsoluteFill>;
};
export const pullMs = (s: PullSpec) => cardTimeline(s.hook.kind === 'clip' ? s.hook.ms : s.hook.src[1] - s.hook.src[0], s.segs).total;
