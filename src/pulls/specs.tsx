// Batch 8 (2026-11-17): 5 big pulls from the "recent viral pulls" tab × 3 natural card-pull edits.
// A = hooks-folder clip, B = cold open on the stream's own reaction (hosts' cam only, card hidden), C = another hook clip.
// Each version: different song (drop on the reveal), different banner wording. No name before the reveal.
import type {CSeg} from '../e3/cardkit';
import {Pull, pullMs, type PullSpec} from './Pull';
import curryW from '../plans/data/pulls/p_curry_papa.words.json';
import wembyW from '../plans/data/pulls/p_wemby_black10.words.json';
import judgeW from '../plans/data/pulls/p_judge_patch11.words.json';
import aceW from '../plans/data/pulls/p_ace_papa.words.json';
import ohtaniW from '../plans/data/pulls/p_ohtani_black10.words.json';

const R = '#E8202A', G = '#17A34A';
const H = {
  greatest: {kind: 'clip' as const, file: 'hooks/the_greatest_player.mp4', ms: 3200, text: 'GREATEST PLAYER EVER?'},
  noWay: {kind: 'clip' as const, file: 'hooks/no_way_he_did_it.mp4', ms: 3800, text: 'NO WAY HE DID IT!'},
  goat: {kind: 'clip' as const, file: 'hooks/thats_the_goat.mp4', ms: 2900, text: "THAT'S THE GOAT!"},
  holy: {kind: 'clip' as const, file: 'hooks/holy_scream.mp4', ms: 2800, text: 'OH MY… GOD'},
  product: {kind: 'clip' as const, file: 'hooks/this_product_is_unbelievable.mp4', ms: 1900, text: 'THIS PRODUCT IS UNBELIEVABLE'},
};
type Base = Omit<PullSpec, 'hook' | 'music' | 'pre'>;
const mk = (b: Base, hook: PullSpec['hook'], music: PullSpec['music'], pre: PullSpec['pre'], end: string): PullSpec => ({...b, hook, music, pre, end});

// ---- Steph Curry Papa 1/1 ($100,000) ---------------------------------------------------------------------------
const currySegs: CSeg[] = [{src: [48300, 52900]}, {src: [87700, 89400], rate: 0.5}, {src: [89400, 94500]}, {src: [119400, 122800]}, {src: [128500, 132800]}];
const CURRY: Base = {src: 'pulls/p_curry_papa.mp4', segs: currySegs, reveal: 89400, zoom: [560, 1200], blur: [],
  post: [[['STEPH CURRY'], ['1 OF 1', R]], [['$100,000', G], ['PULL'], [':1f631']]], title: ['STEPH CURRY', 'PAPA AUTO · 1 OF 1', '$100,000'],
  words: curryW, fix: {NIL: ''}};
export const PullCurryA = () => <Pull s={mk(CURRY, H.greatest, {file: 'eclipser.mp3', drop: 15800}, [[['ONLY'], ['ONE', R], ['OF THESE EXISTS…']], [['WHO DID THEY PULL?'], [':1f440']]], 'KEEP IT OR SELL IT?')} />;
export const PullCurryB = () => <Pull s={mk(CURRY, {kind: 'cold', src: [90300, 92100], text: 'OH MY GOD!', blur: [{src: [90000, 92200], box: [455, 1145, 290, 325]}]}, {file: 'acido-iii.mp3', drop: 21700}, [[['A'], ['$100,000', G], ['CARD…']], [['GUESS WHO'], [':1f440']]], 'WHAT WOULD YOU DO?')} />;
export const PullCurryC = () => <Pull s={mk(CURRY, H.holy, {file: 'vem-pere-reka.mp3', drop: 21100}, [[['THE CARD'], ['EVERYONE', R], ['CHASES…']], [['WAIT TILL YOU SEE WHO'], [':1f62e']]], 'WOULD YOU SELL IT?')} />;

// ---- Victor Wembanyama Black Auto /10 ($30,000+) ----------------------------------------------------------------
const wembySegs: CSeg[] = [{src: [17800, 18700]}, {src: [29400, 30600], rate: 0.5}, {src: [30600, 35000]}, {src: [53000, 60500]}, {src: [78200, 84700]}];
const WEMBY: Base = {src: 'pulls/p_wemby_black10.mp4', segs: wembySegs, reveal: 30600, zoom: [560, 1150], blur: [],
  post: [[['WEMBY'], ['BLACK AUTO /10', R]], [['$30,000+', G], [':1f525']]], title: ['VICTOR WEMBANYAMA', 'BLACK AUTO · ONLY 10', '$30,000+'],
  words: wembyW, fix: {Wembenyama: 'Wembanyama', Phoenix: '', uh: ''}};
export const PullWembyA = () => <Pull s={mk(WEMBY, H.noWay, {file: 'montagem-pegadora.mp3', drop: 15700}, [[['ONLY'], ['10', R], ['OF THESE EXIST…']], [['WHO IS IT?'], [':1f440']]], 'KEEP IT OR SELL IT?')} />;
export const PullWembyB = () => <Pull s={mk(WEMBY, {kind: 'cold', src: [31000, 32800], text: 'HE CAN\'T BELIEVE IT', blur: [{src: [30900, 32600], box: [280, 955, 420, 490]}, {src: [32600, 32900], box: [390, 1150, 320, 330]}]}, {file: 'funk-abnormal.mp3', drop: 10800}, [[['HE WAS EATING'], ['LETTUCE WRAPS', R]], [['THEN HE PULLED THIS'], [':1f62d']]], 'WHAT WOULD YOU DO?')} />;
export const PullWembyC = () => <Pull s={mk(WEMBY, H.goat, {file: 'eclipser.mp3', drop: 8400}, [[['A'], ['BLACK', R], ['AUTO TO 10…']], [['OF WHO THOUGH?'], [':1f914']]], 'WOULD YOU SELL IT?')} />;

// ---- Aaron Judge Patch Auto 1/1 ($50,000) -----------------------------------------------------------------------
const judgeSegs: CSeg[] = [{src: [27200, 28400]}, {src: [30300, 34000]}, {src: [34000, 35400], rate: 0.5}, {src: [35400, 40200]}, {src: [46200, 48700]}, {src: [49400, 51700]}, {src: [63500, 65400]}];
const JUDGE: Base = {src: 'pulls/p_judge_patch11.mp4', segs: judgeSegs, reveal: 35400, zoom: [540, 1150], blur: [],
  post: [[['AARON JUDGE'], ['1 OF 1', R]], [['$50,000', G], ['PATCH AUTO'], [':1f525']]], title: ['AARON JUDGE', 'PATCH AUTO · 1 OF 1', '$50,000'],
  words: judgeW, fix: {'101': '1 OF 1', missile: ''}};
export const PullJudgeA = () => <Pull s={mk(JUDGE, H.holy, {file: 'funk-abnormal.mp3', drop: 43700}, [[['IS THIS A'], ['1 OF 1', R], ['?']], [['THEY CAN\'T EVEN WATCH'], [':1f62c']]], 'KEEP IT OR SELL IT?')} />;
export const PullJudgeB = () => <Pull s={mk(JUDGE, {kind: 'cold', src: [36600, 38400], text: 'OH MY GOD', blur: [{src: [36500, 38500], box: [415, 1275, 580, 360]}]}, {file: 'funk-do-balkan.mp3', drop: 11900}, [[['THE MOST'], ['EXPENSIVE', R], ['SLAB…']], [['OF THE WHOLE STREAM'], [':1f631']]], 'WHAT WOULD YOU DO?')} />;
export const PullJudgeC = () => <Pull s={mk(JUDGE, H.noWay, {file: 'tipo-insta-buzeira.mp3', drop: 19300}, [[['ONLY'], ['ONE', R], ['EXISTS…']], [['AND THEY JUST HIT IT'], [':1f440']]], 'WOULD YOU SELL IT?')} />;

// ---- Ace Bailey Rookie Papa 1/1 ($40,000+) ----------------------------------------------------------------------
const aceSegs: CSeg[] = [{src: [0, 3600]}, {src: [44400, 47000]}, {src: [50700, 51700]}, {src: [72000, 74300]}, {src: [76200, 77800], rate: 0.5}, {src: [77800, 84000]}, {src: [93300, 96300]}];
const ACE: Base = {src: 'pulls/p_ace_papa.mp4', segs: aceSegs, reveal: 77800, zoom: [560, 1150],
  blur: [],
  post: [[['ACE BAILEY'], ['ROOKIE 1 OF 1', R]], [['$40,000+', G], [':1f525']]], title: ['ACE BAILEY', 'ROOKIE PAPA · 1 OF 1', '$40,000+'],
  words: aceW, fix: {Papua: 'Papa', Aces: "Ace's", '$44': '$44,000', ',000': ''}};
export const PullAceA = () => <Pull s={mk(ACE, H.product, {file: 'funk-sigilo.mp3', drop: 36900}, [[['TWO'], ['1 OF 1s', R], ['IN TWO BOXES?']], [['WHO IS IT?'], [':1f440']]], 'KEEP IT OR SELL IT?')} />;
export const PullAceB = () => <Pull s={mk(ACE, {kind: 'cold', src: [79300, 81100], text: 'ON YOUR HEAD, TOP!', blur: [{src: [79200, 81200], box: [420, 1240, 310, 380]}]}, {file: 'montagem-uranium.mp3', drop: 37000}, [[['A'], ['ROOKIE', R], ['1 OF 1…']], [['OF WHO?'], [':1f440']]], 'WHAT WOULD YOU DO?')} />;
export const PullAceC = () => <Pull s={mk(ACE, H.holy, {file: 'funk-do-balkan.mp3', drop: 42000}, [[['IT SOLD FOR'], ['$44,000', G]], [['GUESS WHO'], [':1f914']]], 'WOULD YOU SELL IT?')} />;

// ---- Shohei Ohtani Black Auto /10 ($17,000+) --------------------------------------------------------------------
const ohtaniSegs: CSeg[] = [{src: [40400, 43300]}, {src: [62100, 65000]}, {src: [65000, 66000], rate: 0.5}, {src: [66000, 74300]}, {src: [91500, 93300]}];
const OHTANI: Base = {src: 'pulls/p_ohtani_black10.mp4', segs: ohtaniSegs, reveal: 66000, zoom: [560, 1150], blur: [],
  post: [[['SHOHEI OHTANI'], ['/10', R]], [['$17,000+', G], [':1f525']]], title: ['SHOHEI OHTANI', 'BLACK AUTO · ONLY 10', '$17,000+'],
  words: ohtaniW, fix: {Otani: 'Ohtani'}};
export const PullOhtaniA = () => <Pull s={mk(OHTANI, H.goat, {file: 'vem-pere-reka.mp3', drop: 63500}, [[['ONLY'], ['10', R], ['OF THESE EXIST…']], [['WHO IS IT?'], [':1f440']]], 'KEEP IT OR SELL IT?')} />;
export const PullOhtaniB = () => <Pull s={mk(OHTANI, {kind: 'cold', src: [67100, 68900], text: 'OH MY GOD.', blur: [{src: [67000, 67700], box: [255, 895, 470, 570]}, {src: [67700, 69000], box: [395, 1175, 330, 390]}]}, {file: 'acido-iii.mp3', drop: 64200}, [[['"WHO IS THAT?'], ['IS THAT HIM?"', R]], [['THEN THIS HAPPENED'], [':1f631']]], 'WHAT WOULD YOU DO?')} />;
export const PullOhtaniC = () => <Pull s={mk(OHTANI, H.product, {file: 'amor-na-praia.mp3', drop: 13500}, [[['THE'], ['BEST PLAYER', R], ['IN BASEBALL?']], [['WAIT FOR THE CARD'], [':1f440']]], 'WOULD YOU SELL IT?')} />;

const ms = (b: Base, hook: PullSpec['hook']) => pullMs({...b, hook, music: {file: '', drop: 0}, pre: []});
export const PULLS: [string, () => JSX.Element, number][] = [
  ['PullCurryA', PullCurryA, ms(CURRY, H.greatest)], ['PullCurryB', PullCurryB, ms(CURRY, {kind: 'cold', src: [90300, 92100], text: ''})], ['PullCurryC', PullCurryC, ms(CURRY, H.holy)],
  ['PullWembyA', PullWembyA, ms(WEMBY, H.noWay)], ['PullWembyB', PullWembyB, ms(WEMBY, {kind: 'cold', src: [31000, 32800], text: ''})], ['PullWembyC', PullWembyC, ms(WEMBY, H.goat)],
  ['PullJudgeA', PullJudgeA, ms(JUDGE, H.holy)], ['PullJudgeB', PullJudgeB, ms(JUDGE, {kind: 'cold', src: [36600, 38400], text: ''})], ['PullJudgeC', PullJudgeC, ms(JUDGE, H.noWay)],
  ['PullAceA', PullAceA, ms(ACE, H.product)], ['PullAceB', PullAceB, ms(ACE, {kind: 'cold', src: [79300, 81100], text: ''})], ['PullAceC', PullAceC, ms(ACE, H.holy)],
  ['PullOhtaniA', PullOhtaniA, ms(OHTANI, H.goat)], ['PullOhtaniB', PullOhtaniB, ms(OHTANI, {kind: 'cold', src: [67100, 68900], text: ''})], ['PullOhtaniC', PullOhtaniC, ms(OHTANI, H.product)],
];
