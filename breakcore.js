// INTERACTIVE MEGA BREAKCORE ARRANGEMENT
//
// INSTRUCTIONS:
// 1. Go to https://strudel.cc/
// 2. Paste this script.
// 3. Run with Ctrl+Enter.
// 4. USE THE SLIDERS that appear at the top to control the chaos!
// 5. Enable 'Piano Roll' and 'Scope' in the UI for visuals.

samples('github:yaxu/clean-breaks');

// --- CONTROLS ---
// Sliders for live manipulation
// Syntax: slider(default, min, max, step)
const speedCtrl = slider(1, 0.5, 2, 0.1); // Overall speed multiplier
const crushCtrl = slider(16, 1, 16, 1);   // Bitcrush (1 = heavy, 16 = clean)
const filterCtrl = slider(20000, 100, 20000, 100); // Low pass filter

// BPM: 220 base
setcps(220/60/4);

// --- INSTRUMENT DEFINITIONS ---

// 1. The Classic Amen
// Uses crushCtrl for live distortion
const amen = s("amen")
  .loopAt(2)
  .chop(32)
  .scramble(8)
  .every(2, x => x.rev())
  .every(4, x => x.fast(2))
  .crush(crushCtrl) // Apply bitcrush from slider
  .shape(0.85)
  .cut(1)
  .gain(1.1);

// 2. The "Think" Break
const think = s("think")
  .loopAt(4)
  .slice(16, "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15")
  .scramble(4)
  .ply("2 4 [8 16]")
  .hpf(800)
  .pan(sine.range(0, 1).fast(8))
  .speed(1.25)
  .gain(0.9);

// 3. Funky Drummer
const funky = s("funkydrummer")
  .loopAt(4)
  .chop(64)
  .speed(1.1)
  .shape(0.9)
  .lpf(filterCtrl) // Live filter control
  .gain(1.0);

// 4. Impeach
const impeach = s("impeach")
  .loopAt(4)
  .chop(16)
  .fast(2)
  .shape(0.95)
  .clip(1)
  .gain(1.2);

// 5. Gabber Kick
const kick = s("bd(3,8), bd(5,8)")
  .shape(0.95)
  .lpf(1000)
  .speed(0.8)
  .clip(1)
  .room(0.4)
  .gain(1.5);

// 6. Acid Bass
// Filter modulated by slider
const bass = note("0 [0 7] 0 [3 5]").scale("D:minor")
  .s("sawtooth")
  .lpf(filterCtrl)
  .resonance(25)
  .legato(0.8)
  .distort(0.6)
  .gain(0.8);

// 7. Rave Stabs
// Chords: Dm -> Bb -> Gm -> A7
const chords = note("d3min as3maj g3min a3dom7");
const stabs = chords
  .superimpose(x => x.add(12)) // Octave up
  .s("clavisynth")
  .room(0.8)
  .shape(0.6)
  .chop(4)
  .gain(0.85)
  .mask("<1 0 1 1>");

// 8. Piano "Roll Notes"
// Fast arpeggios for that breakcore feeling
const piano = note("d4min as4maj g4min a4dom7")
  .arpeggiate() // Turn chords into runs
  .fast(4)      // Make them fast "rolls"
  .s("steinway")
  .velocity(rand.range(0.5, 1).segment(16))
  .sustain(0.1)
  .lpf(5000)
  .gain(0.9);

// 9. Atmosphere
const atmos = note("d2min").s("vibraphone_bowed")
  .slow(4)
  .jux(x => x.add(0.1))
  .lpf(2000)
  .room(0.9)
  .size(0.9)
  .gain(0.6);

// --- ARRANGEMENT ---

const intro = stack(
  atmos,
  amen.lpf(600).gain(0.8)
);

const build = stack(
  atmos,
  amen.hpf(sine.range(0, 8000).slow(8)),
  stabs.speed(sine.range(1, 2).slow(8))
);

const dropA = stack(
  amen,
  think,
  kick,
  bass,
  stabs
);

const breakdown = stack(
  atmos,
  impeach,
  piano.slow(2)
);

const dropB = stack(
  amen.fast(2),
  funky,
  kick.fast(2).gain(1.2),
  bass.distort(0.9),
  piano,
  stabs
);

const outro = stack(
  atmos,
  piano.slow(4).lpf(1000)
);

const rep = (pat, n) => Array(n).fill(pat);

// Sequence
cat([
  ...rep(intro, 8),
  ...rep(build, 8),
  ...rep(dropA, 16),
  ...rep(breakdown, 8),
  ...rep(dropB, 16),
  ...rep(outro, 8)
]).speed(speedCtrl) // Global speed modulation
