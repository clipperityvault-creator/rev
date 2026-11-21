// Batch 9 redo (2026-11-21): ≤16 s versions of the Curry / LeBron / Wemby / Judge pulls in the style of refs
// PTBmw2npS9o + 33kmdagNFhM. A = white box hook (ref 1), B = plain text + red circle (ref 2), C = white box, other hook.
import {ShortPull, shortMs, type Seg, type ShortSpec} from './ShortPull';
import curryW from '../plans/data/pulls/p9_curry_finishers.words.json';
import lebronW from '../plans/data/pulls/p9_lebron_alterego.words.json';
import wembyW from '../plans/data/pulls/p9_wemby_red5.words.json';
import judgeW from '../plans/data/pulls/p9_judge_red55.words.json';

const R = '#E8202A', G = '#16A34A', GP = '#33E62E';
const HOOK = {
  greatest: {file: 'hooks/the_greatest_player.mp4', ms: 1300, caption: 'GREATEST PLAYER EVER?'},
  goat: {file: 'hooks/thats_the_goat.mp4', ms: 1300, caption: "THAT'S THE GOAT!"},
  holy: {file: 'hooks/holy_scream.mp4', ms: 1400, caption: 'OH MY… GOD'},
  product: {file: 'hooks/this_product_is_unbelievable.mp4', ms: 1500, caption: 'THIS PRODUCT IS UNBELIEVABLE'},
  noWay: {file: 'hooks/no_way_he_did_it.mp4', ms: 1500, caption: 'NO WAY HE DID IT!'},
};
type H = keyof typeof HOOK;
type Base = {src: string; teaser: Seg; story: Seg[]; reveal: number; words: ShortSpec['words']; fix?: Record<string, string>; keys?: string[];
  title: ShortSpec['title']; arrows: ShortSpec['arrows']; circle: [number, number, number]};
const mk = (b: Base, v: 'A' | 'B' | 'C', hook: H, text: ShortSpec['hookText'], music: ShortSpec['music']): ShortSpec => {
  const teaser = {...(b.teaser as Extract<Seg, {kind: 'stream'}>), ...(v === 'B' ? {circle: b.circle} : {})};
  const segs: Seg[] = [teaser, {kind: 'hook', ...HOOK[hook]}, ...b.story];
  const textMs = (teaser.src[1] - teaser.src[0]) + HOOK[hook].ms;
  return {src: b.src, segs, reveal: b.reveal, words: b.words, fix: b.fix, keys: b.keys, style: v === 'B' ? 'plain' : 'box', hookText: text, textMs,
    title: b.title, arrows: b.arrows, music};
};

const CURRY: Base = {src: 'pulls/p9_curry_finishers.mp4', words: curryW, reveal: 27300,
  teaser: {kind: 'stream', src: [29200, 30700], blur: [440, 1325, 310, 510]}, circle: [594, 1579, 300],
  story: [{kind: 'stream', src: [8600, 11400]}, {kind: 'stream', src: [17100, 18600]}, {kind: 'stream', src: [26300, 27300], rate: 0.5},
    {kind: 'stream', src: [27300, 31000]}, {kind: 'stream', src: [49200, 52200]}],
  title: ['STEPH CURRY', 'FINISHERS 1 OF 1', 'UP TO $35,000'],
  arrows: [{src: [8600, 11400], at: [800, 1000], deg: 135}, {src: [29400, 31000], at: [734, 1342], deg: 135}],
  fix: {'101': '1/1', "Finisher's": 'FINISHERS', edgecombe: 'EDGECOMBE'}, keys: ['1/1', 'FINISHERS', 'CURRY', 'BACK-TO-BACK', 'CASE']};
const LEBRON: Base = {src: 'pulls/p9_lebron_alterego.mp4', words: lebronW, reveal: 12500,
  teaser: {kind: 'stream', src: [42800, 44300], blur: [415, 1270, 315, 445]}, circle: [572, 1492, 280],
  story: [{kind: 'stream', src: [6000, 8400]}, {kind: 'stream', src: [11500, 12500], rate: 0.5}, {kind: 'stream', src: [12500, 16500]}, {kind: 'stream', src: [45400, 48700]}],
  title: ['LEBRON JAMES', 'ALTER EGO', '$33,000 OFFER'],
  arrows: [{src: [45400, 48700], at: [713, 1283], deg: 135}],
  fix: {'$33': '$33,000', ',000': '', ',000.': ''}, keys: ['IMPOSSIBLE', '$33,000', 'WAY']};
const WEMBY: Base = {src: 'pulls/p9_wemby_red5.mp4', words: wembyW, reveal: 91200,
  teaser: {kind: 'stream', src: [95000, 96500], blur: [350, 1110, 230, 420]}, circle: [465, 1320, 260],
  story: [{kind: 'stream', src: [8900, 11400]}, {kind: 'stream', src: [50300, 54000]}, {kind: 'stream', src: [55500, 57000]}, {kind: 'stream', src: [90200, 91200], rate: 0.5},
    {kind: 'stream', src: [91200, 94500]}],
  title: ['WEMBANYAMA', 'RED AUTO · ONLY 5', '$30,000+'],
  arrows: [{src: [8900, 11400], at: [330, 1060], deg: 30}],
  fix: {papa: 'PAPA', WAH: 'WAH!'}, keys: ['RED', 'PAPA', 'SIX', 'FIGURES', '40', 'EVE']};
const JUDGE: Base = {src: 'pulls/p9_judge_red55.mp4', words: judgeW, reveal: 80800,
  teaser: {kind: 'stream', src: [84000, 85400], blur: [115, 790, 590, 890]}, circle: [410, 1230, 470],
  story: [{kind: 'stream', src: [59200, 61800]}, {kind: 'stream', src: [65200, 67800]}, {kind: 'stream', src: [68500, 71500]}, {kind: 'stream', src: [79800, 80800], rate: 0.5},
    {kind: 'stream', src: [80800, 83800]}],
  title: ['AARON JUDGE', 'RED AUTO 5/5', '$7,000'],
  arrows: [{src: [59200, 61800], at: [600, 960], deg: 135}],
  fix: {Showay: 'OHTANI', '$12': '$12,000', '$7': '$7,000', ',000': '', ',000.': ''}, keys: ['RED', '$12,000', '$7,000', 'RISE', 'OHTANI', 'JUDGE']};

export const SHORTS: [string, ShortSpec][] = [
  ['ShortCurryA', mk(CURRY, 'A', 'greatest', [[['TWO'], ['1 OF 1s', R], ['IN ONE CASE?!']], [['THE SECOND ONE IS'], ['HUGE', G]]], {file: 'eclipser.mp3', drop: 15800})],
  ['ShortCurryB', mk(CURRY, 'B', 'goat', [[['THIS CASE HAD']], [['TWO', GP], ['1 OF 1s', GP]]], {file: 'vem-pere-reka.mp3', drop: 21100})],
  ['ShortCurryC', mk(CURRY, 'C', 'noWay', [[['BACK-TO-BACK'], ['1 OF 1s', R]], [['WORTH UP TO'], ['$35,000', G]]], {file: 'acido-iii.mp3', drop: 21700})],
  ['ShortLebronA', mk(LEBRON, 'A', 'holy', [[['A'], ['$33,000', G], ['OFFER…']], [['FOR'], ['ONE', R], ['CARD']]], {file: 'montagem-uranium.mp3', drop: 37000})],
  ['ShortLebronB', mk(LEBRON, 'B', 'goat', [[['THIS CARD GOT A']], [['$33,000', GP], ['OFFER']]], {file: 'funk-do-balkan.mp3', drop: 42000})],
  ['ShortLebronC', mk(LEBRON, 'C', 'product', [[['HE CALLED IT'], ['SECONDS', R]], [['BEFORE HE'], ['PULLED IT', G]]], {file: 'funk-sigilo.mp3', drop: 36900})],
  ['ShortWembyA', mk(WEMBY, 'A', 'noWay', [[['ONLY'], ['5', R], ['OF THESE EXIST']], [['WORTH UP TO'], ['$40,000', G]]], {file: 'montagem-pegadora.mp3', drop: 15700})],
  ['ShortWembyB', mk(WEMBY, 'B', 'holy', [[['THIS WAS A']], [['SIX FIGURE', GP], ['SWEAT']]], {file: 'tipo-insta-buzeira.mp3', drop: 19300})],
  ['ShortWembyC', mk(WEMBY, 'C', 'product', [[['RED'], ['OR', R], ['PAPA?']], [['$40K OR'], ['SIX FIGURES', G]]], {file: 'amor-na-praia.mp3', drop: 13500})],
  ['ShortJudgeA', mk(JUDGE, 'A', 'greatest', [[['A'], ['$700', G], ['SPOT HIT']], [['THE'], ['LAST ONE', R], ['OF FIVE']]], {file: 'funk-abnormal.mp3', drop: 43700})],
  ['ShortJudgeB', mk(JUDGE, 'B', 'holy', [[['THIS']], [['$700', GP], ['SPOT HIT']]], {file: 'eclipser.mp3', drop: 21100})],
  ['ShortJudgeC', mk(JUDGE, 'C', 'goat', [[['OHTANI'], ['OR', R], ['JUDGE?']], [['$12K OR'], ['$7K', G]]], {file: 'acido-iii.mp3', drop: 64200})],
];
export const SHORT_COMPS: [string, () => JSX.Element, number][] = SHORTS.map(([id, s]) => [id, () => <ShortPull s={s} />, shortMs(s)]);
