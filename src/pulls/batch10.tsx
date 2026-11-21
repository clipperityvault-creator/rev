// Batch 10 (2026-11-21): 5 pulls, ONE video each (user: "the needed video cant repeat"), 15–16 s, ShortPull style.
// Teaser at frame 0 = a later moment of the same card (blurred, card only), never the reveal moment itself.
import {ShortPull, shortMs, type ShortSpec} from './ShortPull';
import bradyW from '../plans/data/pulls/p10_brady_gold50.words.json';
import wembyW from '../plans/data/pulls/p10_wemby_alterego.words.json';
import ohtaniW from '../plans/data/pulls/p10_ohtani_patch10.words.json';
import lebronW from '../plans/data/pulls/p10_lebron_orange.words.json';
import allenW from '../plans/data/pulls/p10_allen_kaiju.words.json';
const R = '#E8202A', G = '#16A34A', GP = '#33E62E';
const hook = (file: string, ms: number, caption: string) => ({kind: 'hook' as const, file: `hooks/${file}.mp4`, ms, caption});

const BRADY: ShortSpec = {src: 'pulls/p10_brady_gold50.mp4', words: bradyW, reveal: 14300, style: 'box', textMs: 2800,
  segs: [{kind: 'stream', src: [46500, 48000], blur: [40, 680, 760, 960]}, hook('thats_the_goat', 1300, "THAT'S THE GOAT!"),
    {kind: 'stream', src: [10050, 12500]}, {kind: 'stream', src: [13300, 14300], rate: 0.5}, {kind: 'stream', src: [14300, 16000]},
    {kind: 'stream', src: [21800, 23700]}, {kind: 'stream', src: [26400, 27600]}, {kind: 'stream', src: [28400, 31400]}],
  hookText: [[['THE'], ['GOAT', R], ['OF QBs…']], [['ONLY'], ['50', G], ['EXIST']]],
  title: ['TOM BRADY', 'GOLD AUTO /50', '$30,000'], arrows: [{src: [14300, 16000], at: [630, 990], deg: 135}],
  fix: {Edison: '', Thomas: '', Commutable: '', diffy: 'DIFFY'}, keys: ['BRADY', '50', 'DOWN', 'HOLY'],
  music: {file: 'eclipser.mp3', drop: 12666, beat: 534},
  pops: [{src: 10350, code: '1f440', x: 840, y: 820}, {src: 22000, code: '1f410', x: 830, y: 780}, {src: 26500, code: '1f48e', x: 240, y: 800}, {src: 28600, code: '1f525', x: 840, y: 800}]};
const WEMBY: ShortSpec = {src: 'pulls/p10_wemby_alterego.mp4', words: wembyW, reveal: 11800, style: 'plain', textMs: 2900,
  segs: [{kind: 'stream', src: [27000, 28500], blur: [500, 1200, 280, 300], circle: [640, 1350, 230]}, hook('holy_scream', 1400, 'OH MY… GOD'),
    {kind: 'stream', src: [7100, 10000]}, {kind: 'stream', src: [11000, 11800], rate: 0.5}, {kind: 'stream', src: [11800, 16700]}, {kind: 'stream', src: [23800, 26900]}],
  hookText: [[['THIS CARD GOT A']], [['$30,000', GP], ['OFFER']]],
  title: ['WEMBANYAMA', 'ALTER EGO', '$30,000 OFFER'], arrows: [{src: [11800, 14000], at: [800, 860], deg: 135}],
  fix: {'30K': '$30,000', Godfather: '', cop: 'COMP', 'it?': '', it: ''}, keys: ['ALTER', 'EGO', 'VICTOR', '15', '$30,000'],
  music: {file: 'acido-iii.mp3', drop: 21073, beat: 628},
  pops: [{src: 9300, code: '1f914', x: 840, y: 800}, {src: 15900, code: '1f92f', x: 220, y: 760}, {src: 26000, code: '1f4b0', x: 840, y: 800}]};
const OHTANI: ShortSpec = {src: 'pulls/p10_ohtani_patch10.mp4', words: ohtaniW, reveal: 34300, style: 'box', textMs: 2900,
  segs: [{kind: 'stream', src: [68000, 69500], blur: [80, 620, 860, 1040]}, hook('oh_my_god_our_first_one', 1400, 'OH MY GOD!'),
    {kind: 'stream', src: [19800, 21800]}, {kind: 'stream', src: [25500, 28600]}, {kind: 'stream', src: [33300, 34300], rate: 0.5},
    {kind: 'stream', src: [34300, 37200]}, {kind: 'stream', src: [62600, 65000]}],
  hookText: [[['THE'], ['LAST', R], ['CASE…']], [['SAVED THE'], ['BEST', G], ['FOR LAST']]],
  title: ['SHOHEI OHTANI', 'PATCH AUTO /10', '$30,000+'], arrows: [{src: [34500, 37200], at: [800, 880], deg: 135}],
  fix: {showay: 'OHTANI', Shoe: 'SHO', Shown: 'SHOHEI!', 'Shown!': 'SHOHEI!'}, keys: ['SWEAT', 'SHOHEI!', 'YAMAMOTO', 'OHTANI', 'O'],
  music: {file: 'montagem-uranium.mp3', drop: 36983, beat: 650},
  pops: [{src: 20400, code: '1f62c', x: 840, y: 800}, {src: 25700, code: '1f440', x: 840, y: 800}, {src: 35000, code: '1f525', x: 220, y: 760}, {src: 63000, code: '1f92f', x: 840, y: 780}]};
const LEBRON: ShortSpec = {src: 'pulls/p10_lebron_orange.mp4', words: lebronW, reveal: 16300, style: 'plain', textMs: 3000,
  segs: [{kind: 'stream', src: [39000, 40500], blur: [190, 660, 620, 920], circle: [500, 1120, 330]}, hook('the_greatest_player', 1500, 'GREATEST PLAYER EVER?'),
    {kind: 'stream', src: [500, 2600]}, {kind: 'stream', src: [6500, 7300]}, {kind: 'stream', src: [15300, 16300], rate: 0.5},
    {kind: 'stream', src: [16300, 19000]}, {kind: 'stream', src: [31300, 36500]}],
  hookText: [[['"SHOW US AN']], [['NBA AUTO"', GP]]],
  title: ['LEBRON JAMES', 'ORANGE AUTO', '$30,000'], arrows: [{src: [16300, 18800], at: [740, 960], deg: 135}],
  keys: ['NBA', 'AKRON', 'KING'], music: {file: 'funk-sigilo.mp3', drop: 36936, beat: 660},
  pops: [{src: 1400, code: '1f64f', x: 840, y: 800}, {src: 17600, code: '1f451', x: 220, y: 760}, {src: 34900, code: '1f451', x: 840, y: 800}, {src: 36000, code: '1f410', x: 220, y: 800}]};
const ALLEN: ShortSpec = {src: 'pulls/p10_allen_kaiju.mp4', words: allenW, reveal: 127800, style: 'box', textMs: 3000,
  segs: [{kind: 'stream', src: [138500, 140000], blur: [330, 930, 340, 440]}, hook('rise_up', 1500, 'RISE UP!'),
    {kind: 'stream', src: [112000, 116000]}, {kind: 'stream', src: [120000, 122300]}, {kind: 'stream', src: [124100, 126700]},
    {kind: 'stream', src: [126700, 127800], rate: 0.5}, {kind: 'stream', src: [127800, 130000]}],
  hookText: [[['BACK-TO-BACK'], ['KAIJUS', R]], [['IN THE'], ['SAME CASE', G]]],
  title: ['JOSH ALLEN', 'KAIJU', '$15,000'], arrows: [{src: [129400, 130000], at: [670, 970], deg: 135}],
  fix: {Hertz: 'HURTS', ACT: 'AI', Kizu: 'KAIJU', back: 'BACK-TO-BACK', '-to': '', '-back': ''}, keys: ['SP', 'BACK-TO-BACK', 'BRADY', 'HURTS', 'ALLEN', 'CASE'],
  music: {file: 'funk-abnormal.mp3', drop: 43663, beat: 348},
  pops: [{src: 115200, code: '1f92f', x: 840, y: 800}, {src: 121700, code: '1f914', x: 840, y: 800}, {src: 124500, code: '1f440', x: 220, y: 780}, {src: 129200, code: '1f525', x: 220, y: 760}]};

export const B10: [string, ShortSpec][] = [['B10Brady', BRADY], ['B10Wemby', WEMBY], ['B10Ohtani', OHTANI], ['B10Lebron', LEBRON], ['B10Allen', ALLEN]];
export const B10_COMPS: [string, () => JSX.Element, number][] = B10.map(([id, s]) => [id, () => <ShortPull s={s} />, shortMs(s)]);
